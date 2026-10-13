import { UserService } from '../../services/userServices.js';
import Boom from '@hapi/boom';

/**
 * Controller function to update an existing user by its id.
 * Password and last login are intentionally not updated by the service.
 *
 * The rotated JWT is not signed here: authAppVerifyToken already generated it upstream,
 * wrote it to the httpOnly 'authentication' cookie, and exposed the same value via
 * res.locals.newUserToken for clients that also need the raw token in the body.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The validated request body (see userSchema.updateUserData).
 * @param {number} req.body.id - The id of the user to update.
 * @param {string} req.body.firstName - The user's first name.
 * @param {string} [req.body.middleName] - The user's middle name.
 * @param {string} req.body.firstLastName - The user's first last name.
 * @param {string} [req.body.secondLastName] - The user's second last name.
 * @param {string} req.body.email - The user's email.
 * @param {number} req.body.role - The id of the role.
 * @param {number} req.body.status - The id of the user status.
 * @param {Object} res - The Express response object.
 * @param {string} res.locals.newUserToken - The rotated JWT set by authAppVerifyToken.
 * @param {Function} next - The next middleware function in the Express.js stack.
 * @returns {Promise<void>} - Sends a JSON response with the operation result and the rotated token.
 */
export const updateOneUser = async (req, res, next) => {

  const userId = req.body.userId;

  const newUserData = {
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    firstLastName: req.body.firstLastName,
    secondLastName: req.body.secondLastName,
    email: req.body.email,
    role: req.body.role,
    status: req.body.status,
  };

  if (!userId) {
    throw Boom.badRequest('No user identifier provided');
  }

  if (!newUserData) {
    throw Boom.badRequest('No user data provided');
  }

  const userManager = new UserService();

  try {
    const response = await userManager.updateOne(userId, newUserData);

    if (response.status === 'UPDATED SUCCESSFULLY') {
      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
      });
    }
  } catch (err) {
    const boomError = Boom.boomify(err, {
      message: 'It is not possible to update the user in the database.'
    });
    next(boomError);
  }
};
