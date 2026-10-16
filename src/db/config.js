// Import the centralized API configuration, which resolves all
// Environment variables
import { config } from '../config/config.js'

/**
 * Sequelize database configuration object
 *
 * Defines connection settings per environment (development, production).
 * All values are sourced from environment variables via the `config` module
 */
const databaseConfig = {
  // Configuration use when NODE_ENV=development
  development: {
    username: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    host: config.dbHost,
    port: config.dbPort,
    dialect: config.dialect,
  },

  // Configuration use when NODE_ENV=production
  // kept structurally identical to development; environment variables
  // are expected to differ per deployment target.
  production: {
    username: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    host: config.dbHost,
    port: config.dbPort,
    dialect: config.dialect,
  },
};

// Exported as the single source of truth for Sequelize CLI and model
// initialization across the API.
export default databaseConfig;
