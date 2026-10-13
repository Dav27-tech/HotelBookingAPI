// Import the jsonwebtoken library to handling JWT operations
import jwt from 'jsonwebtoken';

/**
 * Signs a JSON Web Token (JWT) for a user.
 *
 * @param {object} payload
 * - The payload to be included in the token. Typically includes user information.
 * @param {string} secret
 * - The secret or private key to sign the token.
 * @param {string|number} timer
 * - The expiration time fot the token. This can be a string
 * - (e.g, '1h' for 1 hour) or a number of seconds.
 * @returns {string}
 * - THe signed JWT.
 */
export const signUserToken = (payload, secret, timer) => {
  return jwt.sign(payload, secret, { expiresIn: timer });
};
