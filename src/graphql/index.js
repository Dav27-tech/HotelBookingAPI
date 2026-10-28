/**
 * @module graphql
 * @description Bootstraps the GraphQL layer and mounts it on the Express app.
 *
 * The GraphQL server reuses every building block of the REST layer:
 *
 *   - the Sequelize models          (via the services)
 *   - `UserService` / `AuthenticationServices`
 *   - the Joi schemas               (`userSchema`, `authenticationSchema`)
 *   - the JWT secret                (`config.authAppJwtKey`)
 *   - the `checkAPIkey` middleware  (same shared-secret as REST)
 *   - the rate-limit helpers        (`graphqlIpLimiter`)
 *
 * Mounted at `/api/v1/graphql`. This endpoint is protected by:
 *
 *   1. `graphqlIpLimiter` – coarse per-IP flood protection.
 *   2. `checkAPIkey`      – shared-secret header, matching the REST routes.
 *   3. `@auth`-style guards inside resolvers (`requireAuth`, `requireRole`).
 *
 * IMPORTANT: `useGraphql` must be called BEFORE the body parsers
 * (`express.json()`, `express.urlencoded()`, `bodyParser.json()`).
 * Apollo Server reads the request stream itself; a prior body parser would
 * consume it and every GraphQL request would fail with an empty body.
 */

// function to manage files and directories since the node.js api
import path from "node:path";
// function to have access to the directory or file path
import { fileURLToPath } from "node:url";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { loadFilesSync } from "@graphql-tools/load-files";
import {
  typeDefs as scalarTypeDefs,
  resolvers as scalarResolvers,
} from "graphql-scalars";

import { resolvers } from "./resolvers/index.js";
import { buildContext } from "./context.js";
// Import the centralized API configuration, which resolves all
// Environment variables
import { config } from "../config/config.js";
// Middleware that verifies the API key sent by the client app
import { checkAPIkey } from "../middlewares/apiAuthHandler.js";
import { graphqlIpLimiter } from "../middlewares/rateLimitHandler.js";

// Static files path
// Store in the constant the project dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Creates the Apollo Server, applies the landing-page plugin based on the
 * environment, and mounts the GraphQL endpoint on the given Express app.
 *
 * The landing page (interactive GraphiQL) is enabled ONLY in development.
 * In every other environment it is disabled, so the endpoint exposes only
 * the API surface and no browsing UI.
 *
 * `csrfPrevention` is disabled because access is already gated by the
 * `apikey` header (a shared secret), which is not sent automatically by
 * browsers — the attack CSRF prevention defends against is not applicable
 * to this API-only endpoint.
 *
 * @async
 * @param {import('express').Express} api - The Express application instance.
 * @returns {Promise<void>} Resolves once the middleware is mounted.
 */
export const useGraphql = async (api) => {
  // Load the schema.graphql file. It's a single file today; `loadFilesSync`
  // is used so the pattern still works if the schema is split later.
  const schemaTypeDefs = loadFilesSync(path.join(__dirname, "schema.graphql"));

  const server = new ApolloServer({
    // Merge our domain schema with the scalar type definitions
    // (DateTime, etc.) provided by `graphql-scalars`.
    typeDefs: [schemaTypeDefs, ...scalarTypeDefs],
    resolvers: [resolvers, scalarResolvers],
    // See module docblock: access is gated by `checkAPIkey` below.
    csrfPrevention: false,
    plugins: [
      // Development → interactive GraphiQL landing page.
      // Anything else → no landing page at all.
      config.env === "development"
        ? ApolloServerPluginLandingPageLocalDefault({ embed: true })
        : ApolloServerPluginLandingPageDisabled(),
    ],
  });

  // Required before `expressMiddleware` can be used.
  await server.start();

  // Mount at /api/v1/graphql so the prefix matches the REST routes
  // (`/api/v1/auth`, `/api/v1/users`, …).
  //
  // Middleware order:
  //   1. graphqlIpLimiter – reject abusive IPs before any parsing cost.
  //   2. checkAPIkey      – reject requests without a valid apikey header.
  //   3. expressMiddleware – parse the request and run the GraphQL engine.
  //
  // `buildContext` mirrors `authAppVerifyToken`: it verifies the Bearer
  // token (if present), exposes `{ id, role }` on `context.user`, and
  // rotates the JWT into the `X-Access-Token` response header.
  api.use(
    "/api/v1/graphql",
    graphqlIpLimiter,
    //checkAPIkey,
    expressMiddleware(server, {
      context: async ({ req, res }) => buildContext({ req, res }),
    }),
  );
};
