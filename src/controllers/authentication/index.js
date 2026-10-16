// Barrel file for the authentication controllers.
// Re-exports every controller function so that routers and other modules can
// import them from a single path, instead of importing each module individually.

export { login } from "./login.js";
export { resetPassword } from "./resetPassword.js";
