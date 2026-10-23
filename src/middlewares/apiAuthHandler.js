// Import Boom for HTTP-friendly error objects
import Boom from "@hapi/boom";
// Import the centralized API configuration, which resolves all
// Environment variables
import { config } from "../config/config.js";

/**
 * Middleware to check if the provided API key is valid.
 *
 * @param {Request}   req - The request object.s
 * @param {Response}  res - The response object.
 * @param {Function} next - The next middleware function.
 */
export const checkAPIkey = (req, res, next) => {
  // Extract the API key from the request headers
  const APIKey = req.headers["apikey"];

  // Check if the API key matches the expected value
  if (APIKey === config.APIKey) {
    next(); // Proceed to the next middleware or route handler
  } else {
    // Create an unauthorized error using Boom
    const boomError = Boom.unauthorized("Invalid API key");
    next(boomError); // Pass the error to the next middleware
  }
};
