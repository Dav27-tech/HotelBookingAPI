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
import { User } from '../db/models/user.js';
// import the related catalog models needed to embed FK data as nested objects
import { UserRole } from '../db/models/userRole.js';
import { UserStatus } from '../db/models/userStatus.js';
// import the child model that stores the user's phone numbers
import { Phone } from '../db/models/phone.js';
// import the promise to encrypt the user's password
import { hashPassword } from '../utils/auth/passwordHash.js';
// boom allows managing possible errors
import Boom from '@hapi/boom';

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
        where: { email: newUser.email }
      });

      if (existingUserByEmail) {
        throw Boom.conflict('Email already exists');
      }

      const hash = await hashPassword(newUser.password);

      const createdUser = await User.create({
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
          }))
        );
      }

      return { status: 'CREATED SUCCESSFULLY' };

    } catch (err) {
      throw Boom.boomify(err, { message: 'Unable to create new user' });
    }
  }

  /**
   * Updates an existing user by id.
   *
   * Password and last login are intentionally not updated by this method.
   *
   * @async
   * @param {number} userId - Id of the user to update.
   * @param {Object} newUserData - Fields to update.
   * @param {string} newUserData.firstName - User first name.
   * @param {string} [newUserData.middleName] - User middle name.
   * @param {string} newUserData.firstLastName - User first last name.
   * @param {string} [newUserData.secondLastName] - User second last name.
   * @param {string} newUserData.email - User email address.
   * @param {number} newUserData.role - FK to the user role catalog.
   * @param {number} newUserData.status - FK to the user status catalog.
   * @returns {Promise<{ status: string }>} Result object with a success status message.
   * @throws {Boom} Throws `Boom.badRequest` if no data is provided,
   * `Boom.notFound` if the user does not exist, or a wrapped Boom error if
   * the update fails.
   */
  async updateOne(userId, newUserData) {

    if (!newUserData) {
      throw Boom.badRequest('No data provided');
    }

    try {
      const [updatedRows] = await User.update(
        {
          firstName: newUserData.firstName,
          middleName: newUserData.middleName,
          firstLastName: newUserData.firstLastName,
          secondLastName: newUserData.secondLastName,
          email: newUserData.email,
          role: newUserData.role,
          status: newUserData.status,
        },
        {
          where: { id: userId }
        }
      );

      if (!updatedRows) {
        throw Boom.notFound('User not found');
      }

      return { status: 'UPDATED SUCCESSFULLY' };

    } catch (err) {
      throw Boom.boomify(err, { message: 'Unable to update user' });
    }
  }

  /**
   * Replaces the phone numbers associated with a user.
   *
   * The list is treated as a whole collection: the user's existing phone
   * rows are removed and the supplied numbers are inserted in their place,
   * so the caller must send the complete desired list (not a delta). An
   * empty array clears the user's phones. The destroy + insert pair runs
   * inside a transaction so a failure halfway cannot leave the user with
   * no phones at all.
   *
   * @async
   * @param {number} userId - Id of the user whose phones will be replaced.
   * @param {string[]} phones - Full list of the user's phone numbers.
   * @returns {Promise<{status: string, phones: Object[]}>} Result object with
   * a success status message and the persisted `{ id, number }` records.
   * @throws {Boom} Throws `Boom.badRequest` if no user ID is provided or
   * `phones` is not an array, `Boom.notFound` if the user does not exist, or
   * a wrapped Boom error if the update fails.
   */
  async updatePhones(userId, phones) {

    if (!userId) {
      throw Boom.badRequest('No user identifier provided');
    }

    if (!Array.isArray(phones)) {
      throw Boom.badRequest('Phones must be an array');
    }

    // Normalize: stringify, trim, drop blanks, remove duplicates.
    const normalizedPhones = [
      ...new Set(
        phones
          .map((number) => String(number).trim())
          .filter((number) => number.length > 0)
      ),
    ];

    const transaction = await User.sequelize.transaction();

    try {
      const existingUser = await User.findOne({
        where: { id: userId },
        transaction,
      });

      if (!existingUser) {
        throw Boom.notFound('User not found');
      }

      await Phone.destroy({
        where: { user: userId },
        transaction,
      });

      const createdPhones = normalizedPhones.length
        ? await Phone.bulkCreate(
          normalizedPhones.map((number) => ({
            number,
            user: userId,
          })),
          { transaction }
        )
        : [];

      await transaction.commit();

      return {
        status: 'PHONES UPDATED SUCCESSFULLY',
        phones: createdPhones.map(({ id, number }) => ({ id, number })),
      };

    } catch (err) {
      await transaction.rollback();
      throw Boom.boomify(err, { message: 'Unable to update user phones' });
    }
  }

  /**
   * Updates the `last_login` timestamp for the given user to the current
   * date. Intended to be called after a successful authentication so the
   * account record reflects when the user last logged in.
   *
   * @async
   * @param {number} userId - Id of the user whose last login should be
   * updated.
   * @returns {Promise<{ status: string }>} Result object with a success
   * status message.
   * @throws {Boom} Throws `Boom.badRequest` if no user ID is provided,
   * `Boom.notFound` if the user does not exist, or a wrapped Boom error if
   * the update fails.
   */
  async updateLastLogin(userId) {

    if (!userId) {
      throw Boom.badRequest('No user identifier provided');
    }

    try {
      const [updatedRows] = await User.update(
        { lastLogin: new Date() },
        { where: { id: userId } }
      );

      if (!updatedRows) {
        throw Boom.notFound('User not found');
      }

      return { status: 'LAST LOGIN UPDATED SUCCESSFULLY' };

    } catch (err) {
      throw Boom.boomify(err, { message: 'Unable to update last login' });
    }
  }

  /**
   * Deletes a user by id.
   *
   * @async
   * @param {number} userId - Id of the user to delete.
   * @returns {Promise<{ status: string }>} Result object with a success status message.
   * @throws {Boom} Throws `Boom.badRequest` if no user ID is provided,
   * `Boom.notFound` if the user does not exist, or a wrapped Boom error if
   * deletion fails.
   */
  async deleteOne(userId) {

    if(!userId) {
      throw Boom.badRequest('No user identifier provided');
    }

    const transaction = await User.sequelize.transaction();

    try {
      const user =  await User.findByPk(userId, { transaction });

      if(!user) {
        throw Boom.notFound('user not found');
      }

      await Phone.destroy({
        where: { user: userId },
        transaction
      });

      const deleteRows = await User.destroy({
        where: { id: userId },
        transaction
      });

      if (!deleteRows) {
        throw Boom.notFound('User not found');
      }

      await transaction.commit();

      return { status: 'DELETED SUCCESSFULLY' };

    } catch (err) {
      await transaction.rollback();
      throw Boom.boomify(err, { message: 'Unable to delete user' });
    }
  }

  /**
   * Retrieves a single user by id, embedding its foreign-key catalog
   * records (role, user status) as nested `{ id, name }` objects and
   * attaching the user's phone list.
   *
   * @async
   * @param {number} userId - The id of the user to retrieve.
   * @returns {Promise<Object>} The formatted user record.
   * @throws {Boom} Throws `Boom.badRequest` if no user ID is provided,
   * `Boom.notFound` if the user does not exist, or a wrapped Boom error if
   * the lookup fails.
   */
  async listOne(userId) {

    if(!userId) {
      throw Boom.badRequest('No user identifier provided');
    }

    try {
      const theUser = await User.findOne({
        where: { id: userId },
        include: UserService.CATALOG_INCLUDES,
      });

      if(!theUser) {
        throw Boom.notFound('User not found');
      }

      return {
        status: 'USER FOUND SUCCESSFULLY',
        userData: UserService._formatUser(theUser)
      };

    } catch (err) {
      throw Boom.boomify(err, { message: 'Unable to find user' });
    }
  }

  /**
   * Retrieves a single user by email, embedding its foreign-key catalog
   * records (role, user status) as nested `{ id, name }` objects and
   * attaching the user's phone list.
   *
   * Unlike `listOne` and `listAll`, the returned object KEEPS the
   * `password` hash so the caller (typically the authentication/login
   * flow) can compare it against a supplied plain-text password. Callers
   * MUST NOT forward this object to a client response.
   *
   * @async
   * @param {string} email - Email of the user to retrieve.
   * @returns {Promise<Object>} The formatted user record, including the
   * password hash.
   * @throws {Boom} Throws `Boom.badRequest` if no email is provided,
   * `Boom.notFound` if the user does not exist, or a wrapped Boom error if
   * the lookup fails.
   */
  async findByEmail(email) {

    if(!email) {
      throw Boom.badRequest('No email provided');
    }

    try {

      const theUser = await User.findOne({
        where: { email },
        include: UserService.CATALOG_INCLUDES,
      });

      if (!theUser) {
        throw Boom.notFound('User not found');
      }

      return {
        status: 'USER FOUND SUCCESSFULLY',
        // includePassword: true — this object is for internal auth use only.
        userData: UserService._formatUser(theUser, { includePassword: false })
      };

    } catch (err) {
      throw Boom.boomify(err, { message: 'Unable to find user by email' });
    }
  }

  /**
   * Retrieves every user, ordered by id ascending, embedding each
   * user's foreign-key catalog records as nested `{ id, name }` objects.
   *
   * @async
   * @returns {Promise<{total: number, records: Object[]}>} An object
   * containing the count of records returned by this request and the list
   * itself, so the controller can surface `total` alongside the collection.
   * @throws {Boom} Throws a wrapped Boom error if the lookup fails.
   */
  async listAll() {

    try {
      const allUsers = await User.findAll({
        order: [['id', 'ASC']],
        include: UserService.CATALOG_INCLUDES,
      });

      const records = allUsers.map(UserService._formatUser);

      return {
        status: 'USERS FOUND SUCCESSFULLY',
        total: records.length,
        usersData: records,
      };

    } catch (err) {
      throw Boom.boomify(err, { message: 'Unable to find users' });
    }
  }

  // ---------------------------------------------------------------------------
  // STATIC UTILITIES
  // ---------------------------------------------------------------------------
  /**
   * The set of Sequelize includes shared by `listOne` and `listAll` to embed
   * each foreign-key catalog record as its full row (`id` + `name`), so the
   * response can be reshaped into nested objects rather than bare FK ids.
   *
   * `phones` is included as a plain child collection so the formatted user
   * also carries its phone numbers.
   *
   * @static
   * @type {Array<Object>}
   */
  static CATALOG_INCLUDES = [
    { model: UserRole, as: 'roleData', attributes: ['id', 'name'] },
    { model: UserStatus, as: 'statusData', attributes: ['id', 'name'] },
    { model: Phone, as: 'phones', attributes: ['id', 'number'] },
  ];

  /**
   * Reshapes a User Sequelize instance (with its catalog associations
   * eagerly loaded via `CATALOG_INCLUDES`) into a plain object where the
   * raw FK ids (`role`, `status`) are replaced by nested `{ id, name }`
   * objects, and the user's `phones` array is preserved.
   *
   * By default the password hash is stripped, since responses returned to
   * clients must never leak it. Pass `{ includePassword: true }` only for
   * internal flows (e.g. authentication) that need to compare the hash.
   *
   * @private
   * @static
   * @param {User} user - The Sequelize User instance to format.
   * @param {Object} [options] - Formatting options.
   * @param {boolean} [options.includePassword=false] - When `true`, the
   * password hash is kept in the returned object.
   * @returns {Object} The formatted, plain user object.
   */
  static _formatUser(user, { includePassword = false } = {}) {
    const {
      password,
      role,
      status,
      roleData,
      statusData,
      phones,
      ...rest
    } = user.toJSON();

    return {
      ...rest,
      ...(includePassword ? { password } : {}),
      role: roleData ?? null,
      status: statusData ?? null,
      phones: phones ?? [],
    };
  }
}
