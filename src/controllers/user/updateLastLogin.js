import { UserService } from "../../services/userServices.js";
import Boom from "@hapi/boom";

/**
 * Controller function to update the last login timestamp of a user.
 * Intended to be called after a successful authentication so the account
 * record reflects when the user last logged in.
 *
 * The rotated JWT is not signed here: authAppVerifyToken already generated it upstream,
 * wrote it to the httpOnly 'authentication' cookie, and exposed the same value via
 * res.locals.newUserToken for clients that also need the raw token in the body.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The validated request body (see userSchema.getUserById).
 * @param {number} req.body.id - The id of the user whose last login should be updated.
 * @param {Object} res - The Express response object.
 * @param {string} res.locals.newUserToken - The rotated JWT set by authAppVerifyToken.
 * @param {Function} next - The next middleware function in the Express.js stack.
 * @returns {Promise<void>} - Sends a JSON response with the operation result and the rotated token.
 */
export const updateLastLoginUser = async (req, res, next) => {
  const userId = req.body.userId;

  if (!userId) {
    throw Boom.badRequest("No user identifier provided");
  }

  const userManager = new UserService();

  try {
    const response = await userManager.updateLastLogin(userId);

    if (response.status === "LAST LOGIN UPDATED SUCCESSFULLY") {
      return res.status(200).json({
        success: true,
        message: "Last login updated successfully",
        authentication: res.locals.newUserToken,
      });
    }
  } catch (err) {
    const boomError = Boom.boomify(err, {
      message:
        "It is not possible to update the user last Login in the database.",
    });
    next(boomError);
  }
};
