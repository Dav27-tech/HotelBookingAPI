import { Router } from "express";

// ----------------------------- Middlewares -----------------------------------

// Middleware that verifies the API key sent by the client app
import { checkAPIkey } from "../middlewares/apiAuthHandler.js";
// Middleware that verifies the user JWT
import { authAppVerifyToken } from "../middlewares/tokenHandlers/authAppTokenHandler.js";
// Middleware that validate the user's role
import { checkRole } from "../middlewares/checkRoleHandler.js";
// Middleware that validate the Joi Schema
import { validatorHandler } from "../middlewares/validatorHandler.js";

// -------------------------- Validator Schema ---------------------------------
import { userSchema } from "../schema/userSchema.js";

// ----------------------------- Controllers -----------------------------------
import {
  createOneUser,
  updateOneUser,
  updateUserPhones,
  updateLastLoginUser,
  deleteOneUser,
  listOneUser,
  findByEmailUser,
  listAllUsers,
} from "../controllers/user/index.js";

// Create a new Router instance dedicated to the user resource
const userRouter = Router();

// -----------------------------------------------------------------------------
// POST /create → Create a new user
// Body: New user data
// -----------------------------------------------------------------------------
userRouter.post(
  "/create",
  // Step 1: Verify the API key
  checkAPIkey,
  // Step 2: Verify the session token
  authAppVerifyToken,
  // Step 3: Verify the user role
  checkRole(["Administrator"]),
  // Step 4: Validate the payload schema
  validatorHandler(userSchema.newUserData, "body"),
  // Step 5: Delegate to the controller
  createOneUser,
);

// -----------------------------------------------------------------------------
// PUT /update → Update a user
// Body: User identifier and new user data
// -----------------------------------------------------------------------------
userRouter.put(
  "/update",
  // Step 1: Verify the API key
  checkAPIkey,
  // Step 2: Verify the session token
  authAppVerifyToken,
  // Step 3: Verify the user role
  checkRole(["Administrator"]),
  // Step 4: Validate the payload schema
  validatorHandler(userSchema.updateUserData, "body"),
  // Step 5: Delegate to the controller
  updateOneUser,
);

// -----------------------------------------------------------------------------
// PUT /update-phones → Update a user's phone numbers
// Body: User identifier and the full list of phone numbers
// -----------------------------------------------------------------------------
userRouter.put(
  "/update-phones",
  // Step 1: Verify the API key
  checkAPIkey,
  // Step 2: Verify the session token
  authAppVerifyToken,
  // Step 3: Verify the user role
  checkRole(["Administrator"]),
  // Step 4: Validate the payload schema
  validatorHandler(userSchema.updateUserPhones, "body"),
  // Step 5: Delegate to the controller
  updateUserPhones,
);

// -----------------------------------------------------------------------------
// POST /update-last-login → Update a user's session last login
// Body: User identifier
// -----------------------------------------------------------------------------
userRouter.post(
  "/update-last-login",
  // Step 1: Verify the API key
  checkAPIkey,
  // Step 2: Verify the session token
  authAppVerifyToken,
  // Step 3: Verify the user role
  checkRole(["Administrator"]),
  // Step 4: Validate the payload schema
  validatorHandler(userSchema.getUserById, "body"),
  // Step 5: Delegate to the controller
  updateLastLoginUser,
);

// -----------------------------------------------------------------------------
// DELETE /delete → Delete a user by their identifier
// Body: User identifier
// -----------------------------------------------------------------------------
userRouter.delete(
  "/delete",
  // Step 1: Verify the API key
  checkAPIkey,
  // Step 2: Verify the session token
  authAppVerifyToken,
  // Step 3: Verify the user role
  checkRole(["Administrator"]),
  // Step 4: Validate the payload schema
  validatorHandler(userSchema.getUserById, "body"),
  // Step 5: Delegate to the controller
  deleteOneUser,
);

// -----------------------------------------------------------------------------
// POST /list-one → List a user by their identifier
// Body: User identifier
// -----------------------------------------------------------------------------
userRouter.post(
  "/list-one",
  // Step 1: Verify the API key
  checkAPIkey,
  // Step 2: Verify the session token
  authAppVerifyToken,
  // Step 3: Verify the user role
  checkRole(["Administrator"]),
  // Step 4: Validate the payload schema
  validatorHandler(userSchema.getUserById, "body"),
  // Step 5: Delegate to the controller
  listOneUser,
);

// -----------------------------------------------------------------------------
// POST /find-by-email → List a user by their email
// Body: User email
// -----------------------------------------------------------------------------
userRouter.post(
  "/find-by-email",
  // Step 1: Verify the API key
  checkAPIkey,
  // Step 2: Verify the session token
  authAppVerifyToken,
  // Step 3: Verify the user role
  checkRole(["Administrator"]),
  // Step 4: Validate the payload schema
  validatorHandler(userSchema.getByEmail, "body"),
  // Step 5: Delegate to the controller
  findByEmailUser,
);

// -----------------------------------------------------------------------------
// GET /list-all → List al users
// Body:
// -----------------------------------------------------------------------------
userRouter.get(
  "/list-all",
  // Step 1: Verify the API key
  checkAPIkey,
  // Step 2: Verify the session token
  authAppVerifyToken,
  // Step 3: Verify the user role
  checkRole(["Administrator"]),
  // Step 4: Delegate to the controller
  listAllUsers,
);

export default userRouter;
