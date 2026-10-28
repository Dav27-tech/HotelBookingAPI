import { Router } from "express";

// ----------------------------- Middlewares -----------------------------------

// Middleware that verifies the API key sent by the client app
import { checkAPIkey } from "../middlewares/apiAuthHandler.js";
// Middleware that count the /login and /reset-password attempts quantity
import {
  loginIpLimiter,
  loginAccountLimiter,
  resetPasswordIpLimiter,
  resetPasswordAccountLimiter,
} from "../middlewares/rateLimitHandler.js";
// Middleware that validate the Joi Schema
import { validatorHandler } from "../middlewares/validatorsHandlers.js";

// -------------------------- Validator Schema ---------------------------------
import { authenticationSchema } from "../schema/authenticationSchema.js";

// ----------------------------- Controllers -----------------------------------
import { login, resetPassword } from "../controllers/authentication/index.js";

// Create a new Router instance dedicated to the authentication resource
const authenticationRouter = Router();

// -----------------------------------------------------------------------------
// POST /login → Authenticate a user and start a session
// Body: User credentials: email, password
// -----------------------------------------------------------------------------
authenticationRouter.post(
  "/login",
  // Step 1: Verify the API key
  checkAPIkey,
  // Step 2: Supervise the attempts quantity
  loginIpLimiter,
  loginAccountLimiter,
  // Step 3: Validate the payload schema
  validatorHandler(authenticationSchema.loginData, "body"),
  // Step 4: Delegate to the controller
  login,
);

// -----------------------------------------------------------------------------
// POST /reset-password → Reset a user's password without an active session
// Body: User credentials: email, firstName, firstLastName, and the new password
// -----------------------------------------------------------------------------
authenticationRouter.post(
  "/reset-password",
  // Step 1: Verify the API key
  checkAPIkey,
  // Step 2: Supervise the attempts quantity
  resetPasswordIpLimiter,
  resetPasswordAccountLimiter,
  // Step 3: Validate the payload schema
  validatorHandler(authenticationSchema.resetPasswordData, "body"),
  // Step 4: Delegate to the controller
  resetPassword,
);

export default authenticationRouter;
