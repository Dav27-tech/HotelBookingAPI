// Import the utility to validate the request token
import { verifyToken } from "../utils/auth/tokenVerify.js";
// Import the centralized API configuration, which resolves all
// Environment variables
import { config } from "../config/config.js";

/**
 * Middleware to check user roles based on the decoded JWT payload
 *
 * @param {Array<string>}} roles
 * - The roles that are allowed to access the route.
 * @returns {Function}
 * - Middleware function for role checking.
 */
export const checkRole = (roles) => {
  return (req, res, next) => {
    // req.user is populate by authAppVerifyToken upstream; if it's
    // missing, either the pipeline order is wrong or the session was
    // never established
    if (!req.user) {
      return res.status(403).json({
        error: "Access Denied: Not authentication token provided.",
      });
    }

    // Check if the user's role is present and authorized for this route
    if (!req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Unauthorized: Insufficient permissions.",
      });
    }

    // req.user is already attached by authAppVerifyToken; nothing further to set
    next();
  };
};
