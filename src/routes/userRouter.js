import { Router } from "express";

// ----------------------------- Middlewares -----------------------------------

<<<<<<< HEAD
// -------------------------- Validator Schema ---------------------------------

// ----------------------------- Controllers -----------------------------------
import { createOneUser } from "../controllers/user/index.js";
=======
// Middleware that verifies the API key sent by the client app
import { checkAPIkey } from '../middlewares/apiAuthHandler.js';
// -------------------------- Validator Schema ---------------------------------

// ----------------------------- Controllers -----------------------------------
import {
  createOneUser,
  updateOneUser,
  updateUserPhones,
  updateLastLoginUser,
  deleteOneUser,
  listOneUser,
  findByEmailUser,
  listAllUsers
} from '../controllers/user/index.js';
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980

// Create a new Router instance dedicated to the user resource
const userRouter = Router();

// -----------------------------------------------------------------------------
// POST /create → Create a new user
// Body: New user data
// -----------------------------------------------------------------------------
<<<<<<< HEAD
userRouter.post("/create", createOneUser);
=======
userRouter.post(
  '/create',
  // Step 1: Verify the API key
  checkAPIkey,
  // Step 2: Delegate to the controller
  createOneUser
);

// -----------------------------------------------------------------------------
// PUT /update → Update a user
// Body: User identifier and new user data
// -----------------------------------------------------------------------------
userRouter.put(
  '/update',
  // Step 1: Verify the API key
  checkAPIkey,
  // Step 2: Delegate to the controller
  updateOneUser
);

// -----------------------------------------------------------------------------
// PUT /update-phones → Update a user's phone numbers
// Body: User identifier and the full list of phone numbers
// -----------------------------------------------------------------------------
userRouter.put(
  '/update-phones',
  // Step 1: Verify the API key
  checkAPIkey,
  // Step 2: Delegate to the controller
  updateUserPhones
);

// -----------------------------------------------------------------------------
// POST /update-last-login → Update a user's session last login
// Body: User identifier
// -----------------------------------------------------------------------------
userRouter.post(
  '/update-last-login',
  // Step 1: Verify the API key
  checkAPIkey,
  // Step 2: Delegate to the controller
  updateLastLoginUser
);

// -----------------------------------------------------------------------------
// DELETE /delete → Delete a user by their identifier
// Body: User identifier
// -----------------------------------------------------------------------------
userRouter.delete(
  '/delete',
  // Step 1: Verify the API key
  checkAPIkey,
  // Step 2: Delegate to the controller
  deleteOneUser
);

// -----------------------------------------------------------------------------
// POST /list-one → List a user by their identifier
// Body: User identifier
// -----------------------------------------------------------------------------
userRouter.post(
  '/list-one',
  // Step 1: Verify the API key
  checkAPIkey,
  // Step 2: Delegate to the controller
  listOneUser
);

// -----------------------------------------------------------------------------
// POST /find-by-email → List a user by their email
// Body: User email
// -----------------------------------------------------------------------------
userRouter.post(
  '/find-by-email',
  // Step 1: Verify the API key
  checkAPIkey,
  // Step 2: Delegate to the controller
  findByEmailUser
);

// -----------------------------------------------------------------------------
// GET /list-all → List al users
// Body:
// -----------------------------------------------------------------------------
userRouter.get(
  '/list-all',
  // Step 1: Verify the API key
  checkAPIkey,
  // Step 2: Delegate to the controller
  listAllUsers
);
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980

export default userRouter;
