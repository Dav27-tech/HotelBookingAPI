// Import dotenv package to load environment variables from a .env file
import dotenv from "dotenv";

// Load environment variables from .env file into process.env
dotenv.config();

// Export the configuration object containing various API settings
export const config = {
  // Set the environment
  env: process.env.NODE_ENV,
  // Database dialect
  dialect: process.env.DIALECT,
  // API port
  apiPort: process.env.API_PORT,
  // Database user name
  dbUser: process.env.DB_USER,
  // Database user password
  dbPassword: process.env.DB_PASSWORD,
  // Database Host
  dbHost: process.env.DB_HOST,
  // Database name
  dbName: process.env.DB_NAME,
  // Database port
  dbPort: process.env.DB_PORT,
  // API key for the authentication application
  APIkey: process.env.API_KEY,
  // JWT secret key for the user authentication
  authAppJwtKey: process.env.AUTH_API_JWT_SECRET_KEY,
  // Allowed front-end origin for CORS request
  corsOrigin: process.env.CORS_ORIGIN,
  // Proxy hops in front of the API
  trustProxyHops: parseInt(process.env.TRUST_PROXY_HOPS ?? "0") || 0,
};
