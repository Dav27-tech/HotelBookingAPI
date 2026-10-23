/**
 * @module graphql/resolvers/authResolver
 * @description Resolvers for the Authentication domain.
 *
 * Each resolver is a thin adapter around `AuthenticationServices` and
 * `UserService`. It runs the same Joi schema as its REST counterpart
 * (via `validate`), applies per-account brute-force protection, and maps
 * service-level outcomes to GraphQL errors with stable `extensions.code`
 * values, so the front-end can branch on them exactly like it does
 * against the REST API.
 *
 * Public mutations (no `@auth` guard):
 *   - `login(dto: LoginDto!)`
 *   - `resetPassword(dto: ResetPasswordDto!)`
 *
 * Token verification and rotation happen in `graphql/context.js`, exactly
 * mirroring the REST `authAppVerifyToken` middleware. The resolver layer
 * here is only about the unauthenticated entry points.
 */

import { GraphQLError } from "graphql";
import { AuthenticationServices } from "../../services/authenticationServices.js";
import { UserService } from "../../services/userServices.js";
import { authenticationSchema } from "../../schema/authenticationSchema.js";
import { validate, toGraphQLError } from "../helpers.js";

const authenticationManager = new AuthenticationServices();
const userManager = new UserService();

// -----------------------------------------------------------------------------
// Per-account brute-force protection (in-memory).
//
// Key:   `${ip}|${lowercased-email}`
// Goal:  stop password guessing on a single account even when the attacker
//        rotates emails. Per-IP flood protection already lives at the Express
//        level (`graphqlIpLimiter` on /graphql); this layer adds per-account
//        granularity, matching the REST `loginAccountLimiter`.
//
// NOTE: this store is process-local. A multi-instance deployment must swap
// it for a shared store (Redis) so every replica enforces the same budget.
// The REST layer already documented the same caveat for its account limiter.
// -----------------------------------------------------------------------------
const attempts = new Map(); // key -> { count: number, resetAt: number }
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

/**
 * Build the composite key used by the attempts map.
 *
 * Combines the client IP (so a shared email can't be spammed from one
 * machine) with the lowercased email (so the limiter can't be bypassed by
 * changing case). When `req.ip` is unavailable, we fall back to the literal
 * `'unknown'` so the key remains stable and unique-per-email.
 *
 * @param {Object} context - The GraphQL request context.
 * @param {import('express').Request} [context.req] - Express request.
 * @param {string} email - The email being attempted.
 * @returns {string} Composite key like `"127.0.0.1|user@example.com"`.
 */
const attemptKey = (context, email) => {
  const ip = context.req?.ip ?? "unknown";
  return `${ip}|${String(email).toLowerCase()}`;
};

/**
 * Reject the current request when the caller has exceeded `MAX_ATTEMPTS`
 * within the current window.
 *
 * Called BEFORE invoking the service so a lockout is cheap: no DB hit, no
 * password comparison — just a Map lookup.
 *
 * @param {string} key - Composite key from {@link attemptKey}.
 * @returns {void}
 * @throws {GraphQLError} `TOO_MANY_REQUESTS` when the budget is spent.
 */
const checkAttempts = (key) => {
  const now = Date.now();
  const record = attempts.get(key);
  if (!record || record.resetAt <= now) return;
  if (record.count >= MAX_ATTEMPTS) {
    throw new GraphQLError("Too many login attempts. Please try again later.", {
      extensions: { code: "TOO_MANY_REQUESTS" },
    });
  }
};

/**
 * Increment the failure counter for the given key.
 * Called when a login attempt fails with `INVALID_CREDENTIALS`.
 *
 * @param {string} key - Composite key from {@link attemptKey}.
 * @returns {void}
 */
const registerFailure = (key) => {
  const now = Date.now();
  const record = attempts.get(key);
  if (!record || record.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    record.count += 1;
  }
};

/**
 * Clear the failure counter for the given key.
 * Called on a successful login so subsequent legitimate attempts start
 * with a fresh budget.
 *
 * @param {string} key - Composite key from {@link attemptKey}.
 * @returns {boolean} `true` if an entry was removed, `false` otherwise.
 */
const clearAttempts = (key) => attempts.delete(key);

/**
 * Resolver map for the Authentication domain.
 * @type {Object}
 */
export const authResolver = {
  Mutation: {
    /**
     * `login(dto: LoginDto!): AuthPayload!`
     *
     * Authenticates a user by email + password and returns:
     *   - the JWT to send as `Authorization: Bearer <token>`, and
     *   - the user profile (password hash stripped by the service).
     *
     * Security contract — identical to the REST `POST /auth/login` endpoint:
     *   - "user not found" and "wrong password" collapse into a single
     *     `INVALID_CREDENTIALS` response, so callers cannot enumerate
     *     which half of the credentials was wrong.
     *   - "inactive user" is only disclosed AFTER the password has been
     *     verified, so account status is never leaked to someone without
     *     valid credentials.
     *   - every failed attempt bumps the per-(IP,email) counter; exceeding
     *     the budget returns `TOO_MANY_REQUESTS` until the window resets.
     *   - a successful attempt clears the counter for that key.
     *
     * @param {Object} _ - Unused root object (Apollo resolver signature).
     * @param {Object} args
     * @param {{ email: string, password: string }} args.dto - Login payload.
     * @param {Object} context - GraphQL context (contains `req`, `user`, …).
     * @returns {Promise<{ token: string, user: Object }>} The JWT and the user profile.
     * @throws {GraphQLError}
     *   - `BAD_USER_INPUT`        – `dto` fails the Joi schema.
     *   - `TOO_MANY_REQUESTS`     – attempt budget spent for this (IP,email).
     *   - `INVALID_CREDENTIALS`   – wrong email or password.
     *   - `USER_INACTIVE`         – account exists but is not `Active`.
     *   - `AUTHENTICATION_ERROR`  – unexpected service status.
     *   - `INTERNAL_SERVER_ERROR` – any DB/Boom error (via `toGraphQLError`).
     */
    async login(_, { dto }, context) {
      validate(authenticationSchema.loginData, dto);

      const key = attemptKey(context, dto.email);
      checkAttempts(key);

      try {
        const response = await authenticationManager.login(
          dto.email,
          dto.password,
        );

        // Expected auth failure: collapse both cases into one response to
        // prevent user enumeration.
        if (
          response.status === "User not found" ||
          response.status === "Wrong password"
        ) {
          registerFailure(key);
          throw new GraphQLError("Invalid credentials. Please try again.", {
            extensions: { code: "INVALID_CREDENTIALS" },
          });
        }

        // Valid credentials, but the account is not 'Active'. No token is
        // issued. Reported only AFTER the password check on purpose.
        if (response.status === "Inactive user") {
          throw new GraphQLError(
            "This account is inactive. Contact an administrator.",
            { extensions: { code: "USER_INACTIVE" } },
          );
        }

        // Success. The service has already produced the JWT; also fetch
        // the profile so the client doesn't need a second round-trip.
        if (response.status === "logged") {
          clearAttempts(key);
          const { userData } = await userManager.findByEmail(dto.email);
          return { token: response.token, user: userData };
        }

        // Contract violation: the service returned a status the resolver
        // does not know how to handle.
        throw new GraphQLError("Unexpected authentication status.", {
          extensions: { code: "AUTHENTICATION_ERROR" },
        });
      } catch (err) {
        throw toGraphQLError(err);
      }
    },

    /**
     * `resetPassword(dto: ResetPasswordDto!): ResetPasswordResult!`
     *
     * Resets a forgotten password when the user cannot log in. Because the
     * caller is unauthenticated, identity is verified by the service using
     * three fields that must all match the same user record
     * (`email` + `firstName` + `firstLastName`). No JWT is issued or rotated
     * here — after a successful reset the user re-enters through `login`
     * with the new password.
     *
     * Note: this endpoint is NOT rate-limited at the resolver level in this
     * simplified version. The REST counterpart enforces
     * `resetPasswordIpLimiter` + `resetPasswordAccountLimiter`. If the
     * GraphQL surface is exposed to the internet, mirror that protection
     * using the same `attemptKey` / `checkAttempts` / `registerFailure`
     * helpers, calling `checkAttempts` before the service call and
     * `registerFailure` after every attempt (successful or not).
     *
     * @param {Object} _ - Unused root object.
     * @param {Object} args
     * @param {{
     *   email: string,
     *   firstName: string,
     *   firstLastName: string,
     *   newPassword: string,
     * }} args.dto - Reset payload.
     * @returns {Promise<{ success: true, message: string }>} The result payload.
     * @throws {GraphQLError}
     *   - `BAD_USER_INPUT`        – `dto` fails the Joi schema, or the new
     *                                password equals the current one.
     *   - `NOT_FOUND`             – no user matches the supplied identity
     *                                fields (Boom 404 from the service).
     *   - `AUTHENTICATION_ERROR`  – unexpected service status.
     *   - `INTERNAL_SERVER_ERROR` – any DB/Boom error (via `toGraphQLError`).
     */
    async resetPassword(_, { dto }) {
      validate(authenticationSchema.resetPasswordData, dto);

      try {
        const response = await authenticationManager.resetPassword(
          dto.email,
          dto.firstName,
          dto.firstLastName,
          dto.newPassword,
        );

        // The service returns a single success status or throws. Anything
        // else is a contract violation; surface it explicitly instead of
        // returning `undefined` (which would fail the non-null
        // `ResetPasswordResult!` return type with an opaque Apollo error).
        if (response.status !== "PASSWORD RESET SUCCESSFULLY") {
          throw new GraphQLError("Unexpected password reset status.", {
            extensions: { code: "AUTHENTICATION_ERROR" },
          });
        }

        return {
          success: true,
          message:
            "Password reset successfully. Please log in with your new password.",
        };
      } catch (err) {
        throw toGraphQLError(err);
      }
    },
  },
};
