// Import the Sequelize constructor form the 'sequelize` library
import { Sequelize } from "sequelize";
// Import the configuration settings
import { config } from "../config/config.js";

// Create a new instance of Sequelize with the provided credentials and options
export const sequelize = new Sequelize(
  config.dbName,
  config.dbUser,
  config.dbPassword,
  {
    // Specify the database host
    host: config.dbHost,
    // Specify the database port
    port: config.dbPort,
    // Specify the dialect as PostgreSQL
    dialect: config.dialect,
    // Enable logging of SQL queries to console
    logging: console.log,
    // Set the timezone to (UTC+2)
    dialectOptions: {
      timezone: "+2:00",
    },
  },
);

/**
 * Function to test database connection
 * @param {Function} next
 * - Optional callback function to execute after the test
 */
export const testConnection = async (next) => {
  try {
    // attempt to authenticate the connection
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (err) {
    // Log an error message if the connections fails
    console.error("Impossible to connect the database:", err);
  }
};
