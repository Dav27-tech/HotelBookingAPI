/**
 * @module services/userServices
 * @description Service layer for user CRUD operations.
 *
 * Handles user creation, update, deletion, and retrieval. Retrieval methods
 * eagerly load related catalog records (role, user status) and the user's
 * phones, and reshape the raw foreign-key ids into nested `{ id, name }`
 * objects. Password hashes are never returned, except for the dedicated
 * `findByEmail` lookup which is meant for internal authentication flows.
 */

// import the user data model
import { User } from "../db/models/user.js";
// import the related catalog models needed to embed FK data as nested objects
import { Role } from "../db/models/userRole.js";
import { UserStatus } from "../db/models/userStatus.js";
// import the child model that stores the user's phone numbers
import { Phone } from "../db/models/phone.js";
// import the promise to encrypt the user's password
import { hashPassword } from "../utils/auth/passwordHash.js";
// boom allows managing possible errors
import Boom from "@hapi/boom";

/**
 * Service class for managing users.
 *
 * Provides methods to create, update, delete, and retrieve users. It also
 * centralizes password hashing, email uniqueness validation, catalog
 * relation embedding, and consistent Boom error handling.
 *
 * @class UserServices
 */
export class UserService {
  /**
   * Creates a new user after verifying that the email is unique and
   * hashing the supplied password.
   *
   * @async
   * @param {Object} newUser - User creation payload.
   * @param {string} newUser.firstName - User first name.
   * @param {string} [newUser.middleName] - User middle name.
   * @param {string} newUser.firstLastName - User first last name.
   * @param {string} [newUser.secondLastName] - User second last name.
   * @param {string} newUser.email - Unique email address.
   * @param {string} newUser.password - Plain-text password to be hashed.
   * @param {number} newUser.role - FK to the user role catalog.
   * @param {number} newUser.status - FK to the user status catalog.
   * @param {Date} [newUser.lastLogin] - Last login date. Defaults to the current date.
   * @param {string[]} [newUser.phones] - Optional list of phone numbers.
   * @returns {Promise<{ status: string }>} Result object with a success status message.
   * @throws {Boom} Throws `Boom.conflict` if the email already exists, or a
   * wrapped Boom error if user creation fails.
   */
  async createOne(newUser) {
    try {
      const existingUserByEmail = await User.findOne({
        where: { email: newUser.email },
      });

      if (existingUserByEmail) {
        throw Boom.conflict("Email already exists");
      }

      const hash = await hashPassword(newUser.password);

      const createUser = await User.create({
        firstName: newUser.firstName,
        middleName: newUser.middleName,
        firstLastName: newUser.firstLastName,
        secondLastName: newUser.secondLastName,
        email: newUser.email,
        password: hash,
        role: newUser.role,
        status: newUser.status,
        lastLogin: newUser.lastLogin ?? new Date(),
      });

      // Optionally persist the user's phone numbers in the same operation
      if (Array.isArray(newUser.phones) && newUser.phones.length > 0) {
        await Phone.bulkCreate(
          newUser.phones.map((number) => ({
            number: String(number).trim(),
            user: createdUser.id,
          })),
        );
      }

      return { status: "CREATED SUCCESSFULLY" };
    } catch (err) {
      throw Boom.boomify(err, { message: "Unable to create new user" });
    }
  }
}
