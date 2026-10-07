import { UserService } from "../../services/userServices.js";
import { Boom } from "@hapi/boom";

/**
 * Controller function to create a new user.
 *
 * Extracts the new user data from the request body, delegates the creation
 * to UserServices, and responds according to the outcome.
 * The rotated JWT is not signed here: authAppVerifyToken already generated it upstream,
 * wrote it to the httpOnly 'authentication' cookie, and exposed the same value via
 * res.locals.newUserToken for clients that also need the raw token in the body.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The validated request body (see userSchema.newUserData).
 * @param {string} req.body.firstName - The user's first name.
 * @param {string} [req.body.middleName] - The user's middle name.
 * @param {string} req.body.firstLastName - The user's first last name.
 * @param {string} [req.body.secondLastName] - The user's second last name.
 * @param {string} req.body.email - The user's email.
 * @param {string} req.body.password - The plain-text password.
 * @param {number} req.body.role - The id of the role.
 * @param {number} req.body.status - The id of the user status.
 * @param {string[]} [req.body.phones] - Optional list of phone numbers.
 * @param {string} [req.body.lastLogin] - The last login date (optional).
 * @param {Object} res - The Express response object.
 * @param {string} res.locals.newUserToken - The rotated JWT set by authAppVerifyToken.
 * @param {Function} next - The next middleware function in the Express.js stack.
 * @returns {Promise<void>} - Sends a JSON response with the operation result and the rotated token.
 */
export const createOneUser = async (req, res, next) => {
  const newUser = {
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    firstLastName: req.body.firstLastName,
    secondLastName: req.body.secondLastName,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    status: req.body.status,
    phones: req.body.phones,
    lastLogin: req.body.lastLogin,
  };

  const userManager = new UserService();

  try {
    const response = await userManager.createOne(newUser);

    if (response.status === "CREATED SUCCESSFULLY") {
      return res.status(201).json({
        success: true,
        message: "User created successfully",
      });
    }
  } catch (err) {
    const boomError = Boom.boomify(err, {
      message: "It is not possible to create the user in the database.",
    });
    next(boomError);
  }
};
