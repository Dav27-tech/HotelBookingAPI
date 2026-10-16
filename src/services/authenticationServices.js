/**
 * @module service/authenticationServices
 * @description Service layer for usher authentication.
 *
 *  Handles credentials-based login (returning a signed JWT) and unauthenticated
 * password reset. Password comparison and hashing are performed with bcrypt.
 */

// import the user data model
import { User } from "../db/models/user.js";
// import the related catalog models needed to embed FK data as nested objects
import { UserRole } from "../db/models/userRole.js";
import { UserStatus } from "../db/models/userStatus.js";
// Import the authentication utility module to sign JWT token
import { signUserToken } from "../utils/auth/tokenSign.js";
// Import bcrypt takes care of hashing the user's password
import bcrypt from "bcryptjs";
// import the promise to encrypt the user's password
import { hashPassword } from "../utils/auth/passwordHash.js";
// Import the centralized API configuration, which resolves all
// Environment variables
import { config } from "../config/config.js";
// boom allows managing possible errors
import Boom from "@hapi/boom";

/**
 * Service class for authentication-related operations.
 *
 * Encapsulates the two unauthenticated entry points of the auth flow:
 * logging in with username/password, and resetting a forgotten password
 * by verifying identity through other unique user fields.
 *
 * @class AuthenticationService
 */
export class AuthenticationServices {
  /**
   * Authenticates a user by email + password.
   *
   * Order of checks is deliberate:
   *   1. Look up the user (embed role + status catalogs in one query).
   *   2. Verify the password.
   *   3. Verify the account status is "Active".
   *   4. Verify the account has a role (defensive).
   *   5. Stamp `last_login`, sign a fresh JWT, and return it.
   *
   * Status is checked AFTER the password so that an attacker probing with
   * a wrong password cannot use the response to enumerate which accounts
   * are active/suspended.
   *
   * @param {string} email - Registered email address.
   * @param {string} password - Plain-text password to compare.
   * @returns {Promise<{status: string, token?: string}>}
   *   `{ status: 'user not found' }`   – no matching email.
   *   `{ status: 'wrong password' }`   – password mismatch.
   *   `{ status: 'inactive user' }`    – account is not Active.
   *   `{ status: 'logged', token }`    – success; `token` is the signed JWT.
   * @throws {Boom} Throws a wrapped Boom error on unexpected failures
   *   (e.g. DB errors, missing role assignment).
   */
  async login(email, password) {
    try {
      const userRecord = await User.findOne({
        where: { email },
        include: [
          { model: UserStatus, as: "statusData", attributes: ["id", "name"] },
          { model: UserRole, as: "roleData", attributes: ["id", "name"] },
        ],
      });

      if (!userRecord) {
        return { status: "User not found" };
      }

      const validPassword = await bcrypt.compare(password, userRecord.password);

      if (!validPassword) {
        return { status: "Wrong password" };
      }

      // Only active accounts can start a session. Checked after the
      // password so status is not disclosed to unauthenticated callers.
      if (userRecord.statusData?.name !== "Active") {
        return { status: "Inactive user" };
      }

      // Defensive guard: without a role there is nothing to authorize with.
      if (!userRecord.roleData) {
        throw Boom.internal("The user has no valid role assigned");
      }

      // Refresh the last-login stamp.
      await User.update(
        { lastLogin: new Date() },
        { where: { id: userRecord.id } },
      );

      const userToken = signUserToken(
        { id: userRecord.id, role: userRecord.roleData.name },
        config.authAppJwtKey,
        "2m",
      );

      return { status: "logged", token: userToken };
    } catch (err) {
      throw Boom.boomify(err, {
        message: "Unable to verify user credentials ",
      });
    }
  }
}
