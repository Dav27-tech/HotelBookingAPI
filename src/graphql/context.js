// Import the library used to verify JSON Web Tokens (JWTs).
import jwt from "jsonwebtoken";
// Import GraphQLError to represent authentication errors in GraphQL.
import { GraphQLError } from "graphql";
// Import the application configuration, including the JWT secret.
import { config } from "../config/config.js";
// Import the utility responsible for signing user authentication tokens.
import { signUserToken } from "../utils/auth/tokenSign.js";

// Define the lifetime of newly generated access tokens.
// Each rotated token will remain valid for ten minutes.
const TOKEN_TTL = "10m";

/**
 * Builds the GraphQL execution context and validates the user's token.
 *
 * The context is shared across the resolvers executed for a GraphQL
 * operation. It provides authentication information without requiring
 * each resolver to verify the JWT independently.
 *
 * @param {Object} params - Parameters provided by Apollo Server.
 * @param {Object} params.req - Express request object.
 * @param {Object} params.res - Express response object.
 * @returns {Promise<Object>} The GraphQL execution context.
 */
export const buildContext = async ({ req, res }) => {
  // Initialize the context with the request and response objects.
  // The user and authentication error are initially unset.
  const context = {
    req,
    res,
    user: null,
    authError: null,
  };

  // Extract the authentication header from the incoming request.
  // Optional chaining prevents errors if the headers object is missing.
  const header = req.headers?.authentication;

  // Allow the request to continue without authentication credentials.
  // Protected resolvers must enforce authentication when required.
  if (!header) return context;

  // Separate the authentication scheme from the JWT.
  // Expected format: "Bearer <token>".
  const [scheme, token] = header.split(" ");

  // Reject credentials that do not use the Bearer scheme or
  // do not contain a token.
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    context.authError = new GraphQLError(
      "Invalid authentication credentials. Please sign in again.",
      { extensions: { code: "INVALID_TOKEN" } },
    );

    // Return the context with the authentication error available
    // to the GraphQL authorization logic.
    return context;
  }

  try {
    // Verify the JWT signature and validate its standard claims,
    // including expiration when an expiration claim is present.
    // Restrict verification to the HS256 signing algorithm.
    const decoded = jwt.verify(token, config.authAppJwtKey, {
      algorithms: ["HS256"],
    });

    // Store the authenticated user's identity and role in the context.
    // Resolvers can use this information for authorization decisions.
    context.user = {
      id: decoded.id,
      role: decoded.role,
    };

    // Generate a replacement access token using the verified
    // user's identity and role, the configured secret, and the
    // defined ten-minute lifetime.
    const rotated = signUserToken(
      { id: decoded.id, role: decoded.role },
      config.authAppJwtKey,
      TOKEN_TTL,
    );

    // Send the replacement token in the HTTP response header.
    // Clients can read this header and use the token in subsequent
    // authenticated requests.
    res.setHeader("X-Access-Token", rotated);

    // Store the replacement token in the context so that resolvers
    // or other application components can access it if necessary.
    context.rotatedToken = rotated;
  } catch (err) {
    // Determine whether verification failed because the token expired.
    // Other verification failures are treated as invalid credentials.
    const expired = err.name === "TokenExpiredError";

    // Store a GraphQL-compatible error with an appropriate message
    // and a machine-readable code for the authorization logic.
    context.authError = new GraphQLError(
      expired
        ? "Your session has expired. Please sign in again."
        : "Invalid authentication credentials. Please sign in again.",
      {
        extensions: {
          code: expired ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
        },
      },
    );
  }

  // Return the completed context, including the authentication
  // information, rotated token, or authentication error.
  return context;
};
