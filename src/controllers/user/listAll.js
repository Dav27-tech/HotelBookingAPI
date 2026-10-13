import { UserService } from '../../services/userServices.js';
import Boom from '@hapi/boom';

/**
 * Controller function to retrieve every user.
 * The password is automatically excluded by the service, and each user's
 * role and status catalogs are embedded as nested `{ id, name }` objects.
 *
 * The rotated JWT is not signed here: authAppVerifyToken already generated it upstream,
 * wrote it to the httpOnly 'authentication' cookie, and exposed the same value via
 * res.locals.newUserToken for clients that also need the raw token in the body.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {string} res.locals.newUserToken - The rotated JWT set by authAppVerifyToken.
 * @param {Function} next - The next middleware function in the Express.js stack.
 * @returns {Promise<void>} - Sends a JSON response with the collection, its total and the rotated token.
 */
export const listAllUsers = async (req, res, next) => {

  const userManager = new UserService();

  try {
    const response = await userManager.listAll();

    if (response.status === 'USERS FOUND SUCCESSFULLY') {
      return res.status(200).json({
        success: true,
        message: 'Users found successfully',
        total: response.total,
        users: response.usersData,
      });
    }
  } catch (err) {
    const boomError = Boom.boomify(err, {
      message: 'It is not possible to find all the users in the database.'
    });
    next(boomError);
  }
};
