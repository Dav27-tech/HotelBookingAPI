import { UserService } from '../../services/userServices.js';
import Boom from '@hapi/boom';

/**
 * Controller function to replace the phone numbers of an existing user.
 *
 * The list is treated as a complete collection: the user's current phones are
 * removed and the supplied ones are inserted in their place. Sending an empty
 * array clears the user's phones.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The validated request body (see userSchema.updateUserPhones).
 * @param {number} req.body.userId - The id of the user whose phones will be updated.
 * @param {string[]} req.body.phones - The full list of the user's phone numbers.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the Express.js stack.
 * @returns {Promise<void>} - Sends a JSON response with the operation result and the persisted phones.
 */
export const updateUserPhones = async (req, res, next) => {

  const userId = req.body.userId;
  const phones = req.body.phones;

  if(!userId) {
    throw Boom.badRequest('No user identifier provided');
  }

  if(!Array.isArray(phones)) {
    throw Boom.badRequest('No phones provided');
  }

  const userManager = new UserService();

  try {
    const response = await userManager.updatePhones(userId, phones);

    if (response.status === 'PHONES UPDATED SUCCESSFULLY') {
      return res.status(200).json({
        success: true,
        message: 'User phones updated successfully',
        phones: response.phones,
      });
    }
  } catch (err) {
    const boomError = Boom.boomify(err, {
      message: 'It is not possible to update the user phones in the database.'
    });
    next(boomError);
  }
};
