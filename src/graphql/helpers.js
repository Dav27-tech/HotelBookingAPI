/**
 * @module graphql/helpers
 * @description Reusable resolver helpers for the GraphQL layer.
 *
 * This module centralizes the cross-cutting concerns that every resolver
 * needs, replacing the schema-directive machinery of more complex setups
 * with small, explicit, testable functions:
 *
 *   - {@link requireAuth}   – guard a resolver behind a valid JWT.
 *   - {@link requireRole}   – guard a resolver behind a role check.
 *   - {@link validate}      – run a Joi schema over a GraphQL input.
 *   - {@link toGraphQLError} – normalize Boom / unknown errors into
 *                              GraphQLError instances with a stable
 *                              `extensions.code` the client can branch on.
 *
 * The helpers are intentionally dependency-free (aside from `graphql` and
 * `@hapi/boom`) so they can be reused for future resources (booking,
 * payment, etc.) without modification.
 */

import { GraphQLError } from "graphql";
import Boom from "@hapi/boom";

// --------------------------- Auth helpers ------------------------------------

/**
 * Ensures the current request has an authenticated user.
 *
 * This is the first line of every protected resolver: it aborts the
 * request if the token was missing, invalid, or expired (recorded on
 * `context.authError` by the context builder), and returns the caller's
 * identity otherwise.
 *
 * The error message intentionally collapses "missing token" and "invalid
 * token" into a single `INVALID_TOKEN` code so a client that forgets to
 * send a token receives the same shape as a client that sends a bad one —
 * one client-side branch handles both.
 *
 * @param {Object} context - The GraphQL request context built by `buildContext`.
 * @param {import('graphql').GraphQLError|null} context.authError
 *   The error produced by the context builder when the Authorization
 *   header was present but the JWT was invalid or expired.
 * @param {{ id: number|string, role: string }|null} context.user
 *   The decoded user claims, or `null` when no token was provided.
 * @returns {{ id: number|string, role: string }}
 *   The authenticated user's claims (`{ id, role }`).
 * @throws {GraphQLError}
 *   - When `context.authError` is set: the original error is rethrown
 *     verbatim, so the client receives `INVALID_TOKEN` or `TOKEN_EXPIRED`
 *     depending on what actually happened.
 *   - When `context.user` is null (no Authorization header at all):
 *     an `INVALID_TOKEN` error.
 */
export const requireAuth = (context) => {
  if (context.authError) throw context.authError;
  if (!context.user) {
    throw new GraphQLError("Authentication required. Please sign in.", {
      extensions: { code: "INVALID_TOKEN" },
    });
  }
  return context.user;
};

/**
 * Ensures the current request is authenticated AND the caller's role is
 * one of the allowed values.
 *
 * Delegates authentication to {@link requireAuth}, so a resolver guarded
 * only by `requireRole` is implicitly also guarded by `requireAuth`.
 *
 * The role is read from the JWT (`context.user.role`), matching the REST
 * `checkRoleHandler` middleware — the source of truth is the signed
 * token, not a DB lookup, so this check is cheap and tamper-proof.
 *
 * @param {Object} context - The GraphQL request context built by `buildContext`.
 * @param {string[]} roles - Roles allowed to execute the resolver
 *   (e.g. `['Administrator']`).
 * @returns {{ id: number|string, role: string }}
 *   The authenticated user's claims.
 * @throws {GraphQLError}
 *   - Any error thrown by {@link requireAuth}.
 *   - A `FORBIDDEN` error when the user is authenticated but their role
 *     is not in `roles` (or is missing entirely).
 */
export const requireRole = (context, roles) => {
  const user = requireAuth(context);
  if (!user.role || !roles.includes(user.role)) {
    throw new GraphQLError("Unauthorized: Insufficient permissions.", {
      extensions: { code: "FORBIDDEN" },
    });
  }
  return user;
};

// ------------------------- Validation helper ---------------------------------

/**
 * Validates a GraphQL input against a Joi schema.
 *
 * GraphQL already enforces the shape of the input (types, required
 * fields); this helper enforces the format-level rules that GraphQL
 * cannot express — password policy, email pattern, name alphabet, phone
 * pattern, etc. — by reusing the same Joi schemas used by the REST
 * endpoints (`userSchema`, `authenticationSchema`).
 *
 * `abortEarly: false` is used so the client receives ALL validation
 * failures in one response, not just the first one.
 *
 * @param {Object} schema - A Joi object schema (e.g. `userSchema.newUserData`).
 * @param {Object} data - The input payload to validate.
 * @returns {void} Returns nothing on success.
 * @throws {GraphQLError}
 *   With `extensions.code = 'BAD_USER_INPUT'` and
 *   `extensions.details = [{ path, message }, ...]` on failure. The
 *   `path` mirrors the input field name so the client can highlight the
 *   offending field, exactly like the REST `validatorHandler` does.
 */
export const validate = (schema, data) => {
  // Validate the data against the provided Joi schema
  const { error } = schema.validate(data, { abortEarly: false });
  if (!error) return;

  throw new GraphQLError("Input validation failed", {
    extensions: {
      code: "BAD_USER_INPUT",
      details: error.details.map((d) => ({
        path: d.path.join("."),
        message: d.message,
      })),
    },
  });
};

// ---------------------------- Error mapper -----------------------------------

/**
 * Maps HTTP status codes from Boom to GraphQL error codes.
 * Kept as a lookup table so the mapping is one place to change.
 */
const BOOM_CODES = {
  400: "BAD_USER_INPUT",
  401: "UNAUTHENTICATED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  429: "TOO_MANY_REQUESTS",
};

/**
 * Normalizes any error into a `GraphQLError` with a stable
 * `extensions.code` the frontend can branch on.
 *
 * Used in every resolver's `catch` block so the client never sees a raw
 * Boom payload (with its `output.payload` HTTP shape) nor a raw Node
 * error (which may leak stack traces).
 *
 * Behavior by input type:
 *   - **`GraphQLError`** – returned as-is. This is important: resolvers
 *     throw `GraphQLError`s intentionally (e.g. `INVALID_CREDENTIALS`,
 *     `TOO_MANY_REQUESTS`) and those must not be masked.
 *   - **Boom error** – wrapped in a `GraphQLError` with the message
 *     preserved verbatim, `extensions.code` derived from the HTTP
 *     status, and `extensions.statusCode` mirroring the original status
 *     for clients that want it.
 *   - **Any other error** – wrapped in a `GraphQLError` with
 *     `INTERNAL_SERVER_ERROR` and a generic message (`err.message` when
 *     available). Stack traces are intentionally dropped from
 *     `extensions`; Apollo's `maskedErrors` will handle the rest.
 *
 * @param {unknown} err - The error caught from a service call.
 * @returns {import('graphql').GraphQLError}
 *   A `GraphQLError` suitable for being thrown from a resolver.
 */
export const toGraphQLError = (err) => {
  // Already a GraphQLError: pass through (resolver-intentional errors).
  if (err instanceof GraphQLError) return err;

  // Boom error: preserve message + status, derive a stable code.
  if (Boom.isBoom(err)) {
    const status = err.output.statusCode;
    return new GraphQLError(err.message, {
      extensions: {
        code: BOOM_CODES[status] ?? "INTERNAL_SERVER_ERROR",
        statusCode: status,
      },
    });
  }

  // Unknown error: generic internal error with no stack trace.
  return new GraphQLError(err?.message ?? "Unexpected error", {
    extensions: {
      code: "INTERNAL_SERVER_ERROR",
    },
  });
};
