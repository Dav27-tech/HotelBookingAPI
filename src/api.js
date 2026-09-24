// Import necessary modules and dependencies
// Express framework for creating the api
import express from "express";
// function to manage files and directories since the node.js api
import path from "path";
// function to have access to the directory or file path
import { fileURLToPath } from "url";
// Middleware to handle body request
import bodyParser from "body-parser";
// Middleware to cross origins request
import cors from "cors";
// Middleware for logging HTTP requests
import morgan from "morgan";

// Create the API with Express.js
const api = express();

// -----------------------------------------------------------------------------
// Use Middlewares
// -----------------------------------------------------------------------------

// HTTP request logger middleware
api.use(morgan("dev"));

// Middleware to parse URL-encoded data
api.use(express.urlencoded({ extended: false }));
// Middleware to parse JSON data
api.use(express.json());
// Middleware for parsing JSON bodies
api.use(bodyParser.json());

// Static files path
// Store in the constant the project dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Export the API for the use in other files
export default api;
