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
// Function to test database connection
import { testConnection } from "./libraries/DBConnection.js";
// Import the IP adress and port from the network configuration module
import { theIPAddress, port } from "./libraries/netConfig.js";

// Create the API with Express.js
const api = express();

// Trust proxy: number of proxy hops in front of the API (e.g. the Next.js
// server = 1). Express then derives req.ip from X-Forwarded-For, which the
// rate limiters use as their key. Only enabled when TRUST_PROXY_HOPS is set,
// so local development (API called directly) keeps req.ip as the socket IP.
// Never use `true`: clients could then spoof X-Forwarded-For and dodge the
// limiters. This must be set BEFORE any middleware that reads req.ip.
if (config.trustProxyHops > 0) {
  api.set("trust proxy", config.trustProxyHops);
}

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

api.get("/", (req, res) => {
  res.send("IP adress and port working");
});

// Immediately Invoked function Expression (IEFE) to run the server
(async () => {
  // Await the API to start listening onj the specified IP adress and port
  const createApi = await api.listen(port, theIPAddress, (req, res) => {
    // Log the server start information to the console
    console.log(`server on port http://${theIPAddress}:${port}`);
  });
})();

// Test database connection
// Call the function to ensure the datatbase connection is working
testConnection();

// Export the API for the use in other files
export default api;
