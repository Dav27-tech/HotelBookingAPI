import { AuthenticationServices } from "../../services/authenticationServices.js";
import Boom from "@hapi/boom";

/**
 * Controller function to reset a user's password when they cannot log
 * in and do not remember their current password.
 *
 * Since the user is not authenticated at this point, there is no
 * session and no JWT is signed, verified, or rotated here — this
 * endpoint sits outside the authAppVerifyToken pipeline entirely.
 * Identity is verified by the service using two independent unique
 * fields (email + firstName + firstLastName) that must both match the same user
 * record before the password is replaced.
 *
 * After a successful reset, the user must log in again through the
 * normal /auth/login endpoint with their new password.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The validated request body (see userSchema.resetPasswordData).
 * @param {string} req.body.email - The user's registered email.x
 * @param {string} req.body.firstName - The user's registered first name.
 * @param {string} req.body.firstLastName - The user's registered first last name.
 * @param {string} req.body.newPassword - The new plain-text password to set.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the Express.js stack.
 *
 * @returns {Promise<void>} - Sends a JSON response confirming the password was reset.
 */
export const resetPassword = async (req, res, next) => {
  // Extract the identify-verification fields and the new password from the request body
  const { email, firstName, firstLastName, newPassword } = req.body;

  // Instantiate the service that manages user operations
  const authenticationManager = new AuthenticationServices();

  try {
    // Attempt to reset the password
    const response = await authenticationManager.resetPassword(
      email,
      firstName,
      firstLastName,
      newPassword,
    );

    if (response.status === "PASSWORD RESET SUCCESSFULLY") {
      return res.status(200).json({
        success: true,
        message:
          "Password reset successfully. Please log in your new password.",
      });
    }
  } catch (err) {
    const boomError = Boom.boomify(err, {
      message: "It is not possible to reset the password.",
    });
    next(boomError);
  }
};
