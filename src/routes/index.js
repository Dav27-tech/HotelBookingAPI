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
