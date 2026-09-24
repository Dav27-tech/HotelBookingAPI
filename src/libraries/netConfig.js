// Import the 'os' module to interact with the operating system
import os from "os";

// Import the configuration object from the config file
import { config } from "../config/config.js";

// Get the network interfaces from the operating system
const interfaces = os.networkInterfaces();

// Variable to store the machine's IP address
let ipAddress;

// Loop through the network interfaces to find a non-internal IPv4 address
for (const interfaceName in interfaces) {
  const theInterface = interfaces[interfaceName];
  for (const network of theInterface) {
    // Check if the network is not internal
    // (i.e., not a loopback address) and is IPv4
    if (!network.internal && network.family === "IPv4") {
      // Store the IP address
      ipAddress = network.address;
      // Break the loop once the IP address is found
      break;
    }
  }
  // Break the outer loop if the IP address is already found
  if (ipAddress) break;
}

// If no IP address is found, log an error message and exit the
// process with an error code
if (!ipAddress) {
  console.error(`Could not obtain the machine's IP address.`);
  process.exit(1);
}

// Export the obtained IP address for use in other parts of the application
export const theIPAddress = ipAddress;

// Export the port from the configuration, defaulting to 3333 if not set
export const port = config.apiPort || 3333;
