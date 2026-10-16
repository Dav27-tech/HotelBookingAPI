/**
 * @module controllers/authentication/login
 * @description HTTP controller for authentication endpoints.
 *
 * Translates HTTP requests into AuthenticationServices calls, maps the
 * service's domain-level statuses to HTTP responses, and defers all
 * unexpected failures to the centralized Express error handler.
 */

import { AuthenticationServices } from "../../services/authenticationServices.js";
import Boom from "@hapi/boom";

/**
 * Authenticates a user and, on success, returns the issued JWT in the
 * response body.
 *
 * The API is stateless and cookieless: the client stores the token and
 * sends it on every protected request as `Authorization: Bearer <token>`.
 * This endpoint is public (no session exists yet), so it runs outside the
 * authAppVerifyToken pipeline. The returned token is the client's first
 * one; afterwards authAppVerifyToken rotates it on every protected request.
 *
 * Expected authentication failures are mapped as follows:
 * - "user not found" and "wrong password" are collapsed into a single
 *   `401` response so that clients — and would-be attackers — cannot
 *   enumerate which half of the credentials was wrong.
 * - "inactive user" returns `403`. The service only reports it AFTER the
 *   password has been verified, so account status is never disclosed to
 *   someone without valid credentials.
 *
 * Any other outcome (unexpected service status, thrown Boom errors, DB
 * failures) is forwarded to the Express error handler via `next`.
 *
 * @async
 * @param {import('express').Request} req - Express request object.
 * @param {Object} req.body - Request body.
 * @param {string} req.body.username - Username.
 * @param {string} req.body.password - Plain-text password.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware.
 * @returns {Promise<import('express').Response|void>} JSON response, or void
 * when the error is delegated to `next`.
 * @throws {Boom} Forwards `Boom.badRequest` when credentials are missing, and
 * any error raised by the service, via `next`.
 */
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      Boom.badRequest("Email and password are required", {
        code: "MISSING_CREDENTIALS",
      }),
    );
  }

  const authenticationManager = new AuthenticationServices();

  try {
    const response = await authenticationManager.login(email, password);

    // Expected auth failure: collapse both case into one response to
    // prevent user enumeration.
    if (
      response.status === "User not found" ||
      response.status === "Wrong password"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials try again.",
        error: "INVALID_CREDENTIALS",
      });
    }

    // Valid credentials, but the account is not 'Active'. No token is issued.
    if (response.status === "Inactive user") {
      return res.status(403).json({
        success: false,
        message: "This account is inactive. Contact an administrator.",
        error: "USER_INACTIVE",
      });
    }

    // Authentication successful. The service has already produced the JWT;
    // hand it to the client, which must send it as a Bearer token.
    if (response.status === "logged") {
      return res.status(200).json({
        success: true,
        message: "Login successful.",
        // Same key every other endpoint uses to echo the (rotated) token
        authentication: response.token,
      });
    }

    // Any other status is a contract violation: the service returned
    // something the controller does not know how to handle.
    throw Boom.internal("Unexpected authentication status", {
      code: "AUTHENTICATION_ERROR",
      status: response.status,
    });
  } catch (err) {
    return next(err);
  }
};
