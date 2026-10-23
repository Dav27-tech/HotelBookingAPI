/**
 * @module graphql/resolvers/userResolver
 * @description Resolvers for the User domain.
 *
 * Each resolver is a thin adapter around `UserService`. Following the same
 * pattern used by `authResolver`, every resolver:
 *
 *   1. Enforces authorization  (`requireAuth` / `requireRole`),
 *   2. Validates the input     (`validate` + the same Joi schema as REST),
 *   3. Delegates to the service,
 *   4. Normalizes errors       (`toGraphQLError`).
 *
 * Authorization matrix — mirrors `routes/userRouter.js` exactly:
 *
 *   ┌──────────────────┬────────────────────────────────────┐
 *   │ Resolver         │ Allowed roles                       │
 *   ├──────────────────┼────────────────────────────────────┤
 *   │ me               │ any authenticated user              │
 *   │ user             │ Administrator                       │
 *   │ userByEmail      │ Administrator                       │
 *   │ allUsers         │ Administrator                       │
 *   │ newUser          │ Administrator                       │
 *   │ updateUser       │ Administrator                       │
 *   │ updateUserPhones │ Administrator                       │
 *   │ deleteUser       │ Administrator                       │
 *   └──────────────────┴────────────────────────────────────┘
 *
 * Response contract:
 *   - Mutations that change a user return the post-change profile so the
 *     client doesn't need a second round-trip.
 *   - The password hash never leaves this module. `UserService.listOne`,
 *     `findByEmail` and `listAll` strip it before returning.
 *
 * All `User!`/`[User!]!` return types are non-null in the schema. Every
 * failure path therefore *throws*; a resolver never falls through to
 * `undefined`, which Apollo would mask as an opaque
 * "Cannot return null for non-nullable field" error.
 */

import { GraphQLError } from "graphql";
import { UserService } from "../../services/userServices.js";
import { userSchema } from "../../schema/userSchema.js";
import {
  validate,
  toGraphQLError,
  requireAuth,
  requireRole,
} from "../helpers.js";

const userManager = new UserService();

/**
 * Fetch a user by id, throwing if the service returns anything other than
 * the expected success status.
 *
 * `UserService.listOne` already throws `Boom.notFound` when the user does
 * not exist, so the extra status check here is purely defensive: it catches
 * the case where the service is later refactored to return a different
 * success/error status and prevents the resolver from returning `undefined`
 * (which would surface as a masked Apollo error).
 *
 * Errors are propagated to the caller, which handles them uniformly via
 * `toGraphQLError` in its own `catch` block — do NOT swallow them here.
 *
 * @async
 * @param {number|string} id - The user id.
 * @returns {Promise<Object>} The formatted user profile.
 * @throws {GraphQLError} `INTERNAL_SERVER_ERROR` on unexpected status.
 * @throws {Boom} Forwarded from `UserService.listOne` (404, DB errors, …).
 */
const fetchUser = async (id) => {
  const response = await userManager.listOne(id);
  if (response.status !== "USER FOUND SUCCESSFULLY") {
    throw new GraphQLError("Unexpected listOne status.", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
  return response.userData;
};

/**
 * Coerce the numeric ID fields (`role`, `status`) to strings before handing
 * the payload to Joi.
 *
 * GraphQL's `ID` scalar can carry an int on the wire; the Joi schemas
 * (`joiRoleId`, `joiStatusId`) expect digit-strings. Doing the conversion
 * once here keeps the Joi schemas identical to the REST layer (no
 * duplication, no drift).
 *
 * Only the fields present in `dto` are touched — partial updates keep
 * `undefined` untouched, which Sequelize correctly ignores.
 *
 * @param {Object} dto - The raw GraphQL input object.
 * @returns {Object} A shallow clone with `role`/`status` stringified if present.
 */
const asIdStrings = (dto) => ({
  ...dto,
  ...(dto.role !== undefined && { role: String(dto.role) }),
  ...(dto.status !== undefined && { status: String(dto.status) }),
});

/**
 * Resolver map for the User domain.
 * @type {Object}
 */
export const userResolver = {
  Query: {
    /**
     * `me: User!`
     *
     * Returns the profile of the currently authenticated user. The id is
     * taken from `context.user.id` (populated by `buildContext` from the
     * verified JWT), never from an argument — a user can only fetch
     * themselves through this field.
     *
     * Available to any authenticated user, regardless of role.
     *
     * @param {Object} _  - Unused root.
     * @param {Object} __ - Unused arguments (no fields).
     * @param {Object} context - GraphQL context.
     * @returns {Promise<Object>} The caller's user profile.
     * @throws {GraphQLError}
     *   - `INVALID_TOKEN` / `TOKEN_EXPIRED` – missing or invalid JWT.
     *   - `NOT_FOUND`                       – user was deleted.
     *   - `INTERNAL_SERVER_ERROR`           – unexpected service status.
     */
    async me(_, __, context) {
      const { id } = requireAuth(context);

      try {
        return await fetchUser(id);
      } catch (err) {
        throw toGraphQLError(err);
      }
    },

    /**
     * `user(dto: UserIdDto!): User!`
     *
     * Returns one user by id. Administrator only.
     *
     * @param {Object} _ - Unused root.
     * @param {Object} args
     * @param {{ id: string }} args.dto - `{ id }` from `UserIdDto`.
     * @param {Object} context - GraphQL context.
     * @returns {Promise<Object>} The user profile.
     * @throws {GraphQLError}
     *   - `BAD_USER_INPUT`    – `dto.id` is not a valid id.
     *   - `FORBIDDEN`         – caller is not an Administrator.
     *   - `NOT_FOUND`         – user does not exist.
     *   - `INTERNAL_SERVER_ERROR` – anything else.
     */
    async user(_, { dto }, context) {
      requireRole(context, ["Administrator"]);
      validate(userSchema.getUserById, { userId: dto.id });

      try {
        return await fetchUser(dto.id);
      } catch (err) {
        throw toGraphQLError(err);
      }
    },

    /**
     * `userByEmail(dto: UserEmailDto!): User!`
     *
     * Returns one user by email. Administrator only.
     *
     * RELIES ON `UserService.findByEmail` STRIPPING THE PASSWORD HASH.
     * The service currently does this via `includePassword: false` in
     * `_formatUser`. If that flag is ever flipped for another caller
     * (e.g. an internal auth flow), this resolver will start leaking
     * hashes to Administrators. Keep an eye on it during code review.
     *
     * @param {Object} _ - Unused root.
     * @param {Object} args
     * @param {{ email: string }} args.dto - `{ email }` from `UserEmailDto`.
     * @param {Object} context - GraphQL context.
     * @returns {Promise<Object>} The user profile (no password hash).
     * @throws {GraphQLError}
     *   - `BAD_USER_INPUT`    – `dto.email` is not a valid email.
     *   - `FORBIDDEN`         – caller is not an Administrator.
     *   - `NOT_FOUND`         – no user with that email.
     *   - `INTERNAL_SERVER_ERROR` – anything else.
     */
    async userByEmail(_, { dto }, context) {
      requireRole(context, ["Administrator"]);
      validate(userSchema.getByEmail, dto);

      try {
        const response = await userManager.findByEmail(dto.email);
        if (response.status !== "USER FOUND SUCCESSFULLY") {
          throw new GraphQLError("Unexpected findByEmail status.", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        return response.userData;
      } catch (err) {
        throw toGraphQLError(err);
      }
    },

    /**
     * `allUsers: [User!]!`
     *
     * Returns every user ordered by id ascending, with role, status and
     * phones eagerly loaded and reshaped into nested objects by the
     * service. Administrator only.
     *
     * @param {Object} _ - Unused root.
     * @param {Object} __ - Unused arguments (no fields).
     * @param {Object} context - GraphQL context.
     * @returns {Promise<Object[]>} The list of user profiles.
     * @throws {GraphQLError}
     *   - `FORBIDDEN`         – caller is not an Administrator.
     *   - `INTERNAL_SERVER_ERROR` – anything else.
     */
    async allUsers(_, __, context) {
      requireRole(context, ["Administrator"]);

      try {
        const response = await userManager.listAll();
        if (response.status !== "USERS FOUND SUCCESSFULLY") {
          throw new GraphQLError("Unexpected listAll status.", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        return response.usersData;
      } catch (err) {
        throw toGraphQLError(err);
      }
    },
  },

  Mutation: {
    /**
     * `newUser(dto: CreateUserDto!): User!`
     *
     * Creates a user and returns the created profile. Administrator only.
     *
     * Two-step implementation:
     *   1. `UserService.createOne` hashes the password, checks email
     *      uniqueness, inserts the user and any phones, and returns
     *      `{ status: 'CREATED SUCCESSFULLY' }`.
     *   2. We re-fetch the record by email so the client receives the
     *      fully-shaped user (with `role`/`status`/`phones` resolved).
     *
     * Email uniqueness guarantees the second lookup targets the record we
     * just created. A cleaner long-term shape would have `createOne`
     * return the new `userId` (one extra field on the return object, and
     * zero extra DB work), but the current two-step is correct.
     *
     * @param {Object} _ - Unused root.
     * @param {Object} args
     * @param {Object} args.dto - `CreateUserDto`.
     * @param {Object} context - GraphQL context.
     * @returns {Promise<Object>} The created user profile.
     * @throws {GraphQLError}
     *   - `BAD_USER_INPUT`    – payload fails the Joi schema.
     *   - `FORBIDDEN`         – caller is not an Administrator.
     *   - `CONFLICT`          – email already in use.
     *   - `INTERNAL_SERVER_ERROR` – unexpected service status, DB failure.
     */
    async newUser(_, { dto }, context) {
      requireRole(context, ["Administrator"]);
      validate(userSchema.newUserData, asIdStrings(dto));

      try {
        const createResponse = await userManager.createOne(dto);
        if (createResponse.status !== "CREATED SUCCESSFULLY") {
          throw new GraphQLError("Unexpected create-user status.", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }

        const found = await userManager.findByEmail(dto.email);
        if (found.status !== "USER FOUND SUCCESSFULLY") {
          throw new GraphQLError("Unexpected findByEmail status.", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        return found.userData;
      } catch (err) {
        throw toGraphQLError(err);
      }
    },

    /**
     * `updateUser(id: ID!, dto: UpdateUserDto!): User!`
     *
     * Partially updates a user and returns the post-update profile.
     * Administrator only.
     *
     * Partial semantics come from Sequelize: `Model.update` skips any
     * field set to `undefined`, so omitted fields in `dto` are left
     * untouched. Password and last-login are intentionally not updatable
     * via this mutation — password is changed through `resetPassword`,
     * last-login is stamped by `login`.
     *
     * @param {Object} _ - Unused root.
     * @param {Object} args
     * @param {string|number} args.id - The id of the user to update.
     * @param {Object} args.dto - `UpdateUserDto`.
     * @param {Object} context - GraphQL context.
     * @returns {Promise<Object>} The updated user profile.
     * @throws {GraphQLError}
     *   - `BAD_USER_INPUT`    – payload fails the Joi schema.
     *   - `FORBIDDEN`         – caller is not an Administrator.
     *   - `NOT_FOUND`         – user does not exist.
     *   - `CONFLICT`          – email already used by another user.
     *   - `INTERNAL_SERVER_ERROR` – anything else.
     */
    async updateUser(_, { id, dto }, context) {
      requireRole(context, ["Administrator"]);
      validate(userSchema.updateUserData, { userId: id, ...asIdStrings(dto) });

      try {
        const response = await userManager.updateOne(id, dto);
        if (response.status !== "UPDATED SUCCESSFULLY") {
          throw new GraphQLError("Unexpected update status.", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        return await fetchUser(id);
      } catch (err) {
        throw toGraphQLError(err);
      }
    },

    /**
     * `updateUserPhones(dto: UpdatePhonesDto!): User!`
     *
     * Replaces a user's full phone collection with the supplied list
     * (destroys existing rows, inserts the new ones in a transaction).
     * An empty array clears the user's phones. Administrator only.
     *
     * Returns the post-update profile so the client sees the exact
     * persisted `{ id, number }` records — including the ids the DB
     * assigned to the new rows.
     *
     * @param {Object} _ - Unused root.
     * @param {Object} args
     * @param {{ id: string, phones: string[] }} args.dto - `UpdatePhonesDto`.
     * @param {Object} context - GraphQL context.
     * @returns {Promise<Object>} The updated user profile.
     * @throws {GraphQLError}
     *   - `BAD_USER_INPUT`    – phone list fails the Joi schema.
     *   - `FORBIDDEN`         – caller is not an Administrator.
     *   - `NOT_FOUND`         – user does not exist.
     *   - `INTERNAL_SERVER_ERROR` – anything else.
     */
    async updateUserPhones(_, { dto }, context) {
      requireRole(context, ["Administrator"]);
      validate(userSchema.updateUserPhones, {
        userId: dto.id,
        phones: dto.phones,
      });

      try {
        const response = await userManager.updatePhones(dto.id, dto.phones);
        if (response.status !== "PHONES UPDATED SUCCESSFULLY") {
          throw new GraphQLError("Unexpected update-phones status.", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        return await fetchUser(dto.id);
      } catch (err) {
        throw toGraphQLError(err);
      }
    },

    /**
     * `deleteUser(dto: UserIdDto!): Boolean!`
     *
     * Deletes a user and all of their phone numbers in a single
     * transaction. Administrator only.
     *
     * Returns `true` on success. The `Boolean!` return type (rather than
     * the deleted `User`) is deliberate: it makes it impossible to leak
     * the deleted record in the response, and matches the REST
     * `DELETE /users/delete` contract which only signals success/failure.
     *
     * @param {Object} _ - Unused root.
     * @param {Object} args
     * @param {{ id: string }} args.dto - `UserIdDto`.
     * @param {Object} context - GraphQL context.
     * @returns {Promise<true>} `true` when the user is deleted.
     * @throws {GraphQLError}
     *   - `BAD_USER_INPUT`    – `dto.id` is not a valid id.
     *   - `FORBIDDEN`         – caller is not an Administrator.
     *   - `NOT_FOUND`         – user does not exist.
     *   - `INTERNAL_SERVER_ERROR` – anything else.
     */
    async deleteUser(_, { dto }, context) {
      requireRole(context, ["Administrator"]);
      validate(userSchema.getUserById, { userId: dto.id });

      try {
        const response = await userManager.deleteOne(dto.id);
        if (response.status !== "DELETED SUCCESSFULLY") {
          throw new GraphQLError("Unexpected delete status.", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
        return true;
      } catch (err) {
        throw toGraphQLError(err);
      }
    },
  },
};
