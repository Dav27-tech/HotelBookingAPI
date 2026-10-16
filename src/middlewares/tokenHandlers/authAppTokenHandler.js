// Import the jsonwebtoken library to handling JWT operations
import jwt from "jsonwebtoken";
// Import the centralized API configuration, which resolves all
// Environment variables
import { config } from "../../config/config.js";
// Import the authentication utility module to sign JWT token
import { signUserToken } from "../../utils/auth/tokenSign.js";

/**
 * Middleware to authenticate API request using a JWT stored in HTTP header
 *
 * If the token is valid, a new token is generated.
 *
 * @param {Request} req   - Express request object.
 * @param {Response} res  - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Response|void}
 */
export const authAppVerifyToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      success: false,
      message:
        "Authentication required. Please sign in to access this resource.",
      error: "AUTHENTICATION_REQUIRED",
    });
  }

  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication credentials. Please sign in again.",
      error: "INVALID_TOKEN",
    });
  }

  jwt.verify(
    token,
    config.authAppJwtKey,
    { algorithms: ["HS256"] },
    (err, decoded) => {
      if (err) {
        const expired = err.name === "TokenExpiredError";
        return res.status(401).json({
          success: false,
          message: expired
            ? "Your session has expired. Please sign in again."
            : "Invalid authentication credentials. Please sign in again.",
          error: expired ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
        });
      }

      const userData = { id: decoded.id, role: decoded.role };
      const newUserToken = signUserToken(userData, config.authAppJwtKey, "10m");

      res.locals.newUserToken = newUserToken;
      res.setHeader("X-Access-Token", newUserToken);
      req.user = userData;
      return next();
    },
  );
};
