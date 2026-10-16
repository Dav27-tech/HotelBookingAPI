// Import the bcryptjs library for handling password hashing
import bcrypt from 'bcryptjs';

/**
 * Hashes a given password using bcrypt.
 *
 * @param {string} userPassword
 * - The plain text password to be hashed.
 * @returns {Promise<string>}
 * - A promise that resolves to the hashed password.
 */
export const hashPassword = async (userPassword) => {
  return new Promise((resolve, reject) => {
    try {
      // Define the number of salt rounds to use
      const saltRounds = 11;
      // Generate a salt with the defined number of rounds
      bcrypt.genSalt(saltRounds)
        // Hash the password with the generated salt
        .then((salt) => bcrypt.hash(userPassword, salt))
        // Resolve the promise with the hashed password
        .then((hashedPass) => resolve(hashedPass))
        // Catch and reject any error during hashing
        .catch((err) => reject(`Error in the encryption: ${err.message}`));
    } catch (err) {
      // Catch and reject any error during salt generation
      reject(`Error when generating the salt: ${err.message}`);
    }
  });
};
