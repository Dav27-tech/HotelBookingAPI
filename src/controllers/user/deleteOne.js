import { UserService } from '../../services/userServices.js';
import Boom from '@hapi/boom';

/**
 * Controller function to delete a user by its id.
 *
 * The rotated JWT is not signed here: authAppVerifyToken already generated it upstream,
 * wrote it to the httpOnly 'authentication' cookie, and exposed the same value via
 * res.locals.newUserToken for clients that also need the raw token in the body.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The validated request body (see userSchema.getUserById).
 * @param {number} req.body.id - The id of the user to delete.
 * @param {Object} res - The Express response object.
 * @param {string} res.locals.newUserToken - The rotated JWT set by authAppVerifyToken.
 * @param {Function} next - The next middleware function in the Express.js stack.
 * @returns {Promise<void>} - Sends a JSON response with the operation result and the rotated token.
 */
export const deleteOneUser = async (req, res, next) => {
  const userId = req.body.userId;

  if (!userId) {
    throw Boom.badRequest('No user identifier provided');
  }

  const userManager = new UserService();

  try {
    const response = await userManager.deleteOne(userId);

    if (response.status === 'DELETED SUCCESSFULLY') {
      return res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    }
  } catch (err) {
    const boomError = Boom.boomify(err, {
      message: 'It is not possible to delete the user in the database.'
    });
    next(boomError);
  }
};
