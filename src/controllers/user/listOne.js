import { UserService } from '../../services/userServices.js';
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve a single user by its id.
 * The password is automatically excluded by the service.
 *
 * The rotated JWT is not signed here: authAppVerifyToken already generated it upstream,
 * wrote it to the httpOnly 'authentication' cookie, and exposed the same value via
 * res.locals.newUserToken for clients that also need the raw token in the body.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The validated request body (see userSchema.getUserById).
 * @param {string} req.body.id - The id of the user to retrieve.
 * @param {Object} res - The Express response object.
 * @param {string} res.locals.newUserToken - The rotated JWT set by authAppVerifyToken.
 * @param {Function} next - The next middleware function in the Express.js stack.
 * @returns {Promise<void>} - Sends a JSON response with the requested user and the rotated token.
 */
export const listOneUser = async (req, res, next) => {
  const userId = req.body.userId;

  if (!userId) {
    throw Boom.badRequest('No user identifier provided');
  }

  const userManager = new UserService();

  try {
    const response = await userManager.listOne(userId);

    if (response.status === 'USER FOUND SUCCESSFULLY') {
      return res.status(200).json({
        success: true,
        message: 'User found successfully',
        user: userData,
      });
    }
  } catch (err) {
    const boomError = Boom.boomify(err, {
      message: 'It is not possible to find the user in the database.'
    });
    next(boomError);
  }
};
