<<<<<<< HEAD
import { Router } from "express";

// ----------------------------- Middlewares -----------------------------------

// -------------------------- Validator Schema ---------------------------------

// ----------------------------- Controllers -----------------------------------
import { createOneUser } from "../controllers/user/index.js";

// Create a new Router instance dedicated to the user resource
const userRouter = Router();

// -----------------------------------------------------------------------------
// POST /create → Create a new user
// Body: New user data
// -----------------------------------------------------------------------------
userRouter.post("/create", createOneUser);
=======
// Import the Router class from Express
import { Router } from "express";

// Import the Services Routes for handle services related-routes
import userRouter from './userRouter.js';

// Function to set up API routes
const routerAPI = (api) => {

  // Create a new router instance
  const router = Router();

  // Use the router instance for the '/api/v1' path
  api.use('/api/v1', router);

  // Catalog of the sub-routes
  router.use('/users', userRouter);
};

// Export the routerAPI function for use in other API modules
export default routerAPI;
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
