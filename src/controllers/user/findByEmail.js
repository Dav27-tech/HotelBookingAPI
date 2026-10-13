import { UserService } from '../../services/userServices.js';
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single user by its email.
 *
 * The password hash IS included in the service's response because this
 * lookup is intended for internal authentication flows. This controller
 * therefore strips it before sending the payload to the client, so the
 * hash never leaves the API boundary.
 *
 * The rotated JWT is not signed here: authAppVerifyToken already generated it upstream,
 * wrote it to the httpOnly 'authentication' cookie, and exposed the same value via
 * res.locals.newUserToken for clients that also need the raw token in the body.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The validated request body (see userSchema.getUserByEmail).
 * @param {string} req.body.email - The email of the user to retrieve.
 * @param {Object} res - The Express response object.
 * @param {string} res.locals.newUserToken - The rotated JWT set by authAppVerifyToken.
 * @param {Function} next - The next middleware function in the Express.js stack.
 * @returns {Promise<void>} - Sends a JSON response with the requested user (password stripped) and the rotated token.
 */
export const findByEmailUser = async (req, res, next) => {

  const email = req.body.email;

  const userManager = new UserService();

  try {

    const response = await userManager.findByEmail(email);

    if (response.status === 'USER FOUND SUCCESSFULLY') {
      return res.status(200).json({
        success: true,
        message: 'User found successfully',
        user: response.userData,
      });
    }
  } catch (err) {
    const boomError = Boom.boomify(err, {
      message: 'It is not possible to find the user in the database.'
    });
    next(boomError);
  }
};
