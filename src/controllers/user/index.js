// Barrel file for the user controllers.
// Re-exports every controller function so that routers and other modules can
// import them from a single path, instead of importing each module individually.

<<<<<<< HEAD
export { createOneUser } from "./createOne.js";
=======
export { createOneUser } from './createOne.js';
export { updateOneUser } from './updateOne.js';
export { updateUserPhones } from './updatePhones.js';
export { updateLastLoginUser } from './updateLastLogin.js';
export { deleteOneUser } from './deleteOne.js';
export { listOneUser } from './listOne.js';
export { findByEmailUser } from './findByEmail.js';
export { listAllUsers } from './listAll.js';
>>>>>>> 13b261be075e9cf2861cf2d9da8ee9103eaf3980
