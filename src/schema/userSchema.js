// ─────────────────────────────────────────────────────────────────────────────
// USER SCHEMA — Joi Validation
// Entity: User | Table: user
// ─────────────────────────────────────────────────────────────────────────────
//
// Maps 1:1 to the public methods of UserService. Every value travels in
// the request body (never in params / query string), so every schema is
// applied as validatorHandler(schema, 'body').
//
// Column → model → regex mapping (see src/db/models/user.js):
//   first_name       VARCHAR(50)  NOT NULL   → userFirstName
//   middle_name      VARCHAR(50)  NULL       → userMiddleName
//   first_lastname   VARCHAR(50)  NOT NULL   → userFirstLastName
//   second_lastname  VARCHAR(50)  NULL       → userSecondLastName
//   email            VARCHAR(100) NOT NULL   → userEmail + max(100)
//   password         VARCHAR(100) NOT NULL   → userPassword (pre-hash)
//   role             INTEGER      NOT NULL   → userRoleId
//   status           INTEGER      NOT NULL   → userStatusId
//   last_login       DATE         NOT NULL   → Joi.date()
//   id               INTEGER      PK         → userId
//   phone.number     VARCHAR(20)  NOT NULL   → userPhoneNumber
// ─────────────────────────────────────────────────────────────────────────────

// Import the Joi library
import Joi from "joi";
// Import the user RegEx
import {
  userId,
  userFirstName,
  userMiddleName,
  userFirstLastName,
  userSecondLastName,
  userEmail,
  userPassword,
  userRoleId,
  userStatusId,
  userPhoneNumber,
} from "../utils/RegEx/userRegEx.js";

// -------------------------- Primitive Joi Types ------------------------------

export const joiId = Joi.string().pattern(userId).messages({
  "string.base": "The identifier must be a string.",
  "string.pattern.base":
    "The identifier must contain digits only (1 to 10 digits).",
});

export const joiFirstName = Joi.string().pattern(userFirstName).messages({
  "string.base": "The first name must be a string.",
  "string.pattern.base":
    "The first name must be between 1 and 50 characters and contain only letters and spaces.",
});

export const joiMiddleName = Joi.string()
  .pattern(userMiddleName)
  .allow("")
  .messages({
    "string.base": "The middle name must be a string.",
    "string.pattern.base":
      "The middle name must be at most 50 characters and contain only letters and spaces.",
  });

export const joiFirstLastName = Joi.string()
  .pattern(userFirstLastName)
  .messages({
    "string.base": "The first last name must be a string.",
    "string.pattern.base":
      "The first last name must be between 1 and 50 characters and contain only letters and spaces.",
  });

export const joiSecondLastName = Joi.string()
  .pattern(userSecondLastName)
  .allow("")
  .messages({
    "string.base": "The second last name must be a string.",
    "string.pattern.base":
      "The second last name must be at most 50 characters and contain only letters and spaces.",
  });

// Email additionally enforce `.max(100)` to match the VARCHAR(100) column.
export const joiEmail = Joi.string().max(100).pattern(userEmail).messages({
  "string.base": "The email must be a string.",
  "string.max": "The email must not exceed 100 characters.",
  "string.pattern.base":
    "The email must have a valid format (example@domain,com).",
});

export const joiPassword = Joi.string()
  .max(100)
  .pattern(userPassword)
  .messages({
    "string.base": "The password must be a string.",
    "string.pattern.base":
      "The password must be between 8 and 100 characters and contain at least one letter and one digit.",
  });

export const joiRoleId = Joi.string().pattern(userRoleId).messages({
  "string.base": "THe role id must be a string",
  "string.pattern.base":
    "The role id must contain digits only (1 to 10 digits),",
});

export const joiStatusId = Joi.string().pattern(userStatusId).messages({
  "string.base": "THe status id must be a string",
  "string.pattern.base":
    "The status id must contain digits only (1 to 10 digits),",
});

export const joiPhoneNumber = Joi.string().pattern(userPhoneNumber).messages({
  "string.base": "The phone number must be a string.",
  "string.pattern.base":
    'The phone number must be an optional "+" followed by 7 to 20 digits.',
});

export const joiPhones = Joi.array().items(joiPhoneNumber).messages({
  "array.base": "The phones must be an array pg phone numbers",
});

export const joiLastLogin = Joi.date().messages({
  "date.base": "The last login must be a valid date.",
});

// ----------------------------- Schema export ---------------------------------

export const userSchema = {
  // POST /users/list-one (body: { userId })
  // Validate UserService.listOne(userId)

  // POST /users/update-last-login (body: { userId })
  // Validate UserService.updateLastLogin(userId)

  // DELETE /users/delete (body: { userId })
  // Validate UserService.deleteOne(userId)
  getUserById: Joi.object({
    userId: joiId.required(),
  }),

  // POST /users/create (body: { firstName, email, ... })
  // Validate UserService.createOne(newUser)
  newUserData: Joi.object({
    firstName: joiFirstName.required(),
    middleName: joiMiddleName,
    firstLastName: joiFirstLastName.required(),
    secondLastName: joiSecondLastName,
    email: joiEmail.required(),
    password: joiPassword.required(),
    role: joiRoleId.required(),
    status: joiStatusId.required(),
    phones: joiPhones,
    lastLogin: joiLastLogin,
  }),

  // PATCH /users/update (body: { userId, firstName, email, ... })
  // Validate UserService.updateOne(userId, newUserData)
  updateUserData: Joi.object({
    userId: joiId.required(),
    firstName: joiFirstName,
    middleName: joiMiddleName,
    firstLastName: joiFirstLastName,
    secondLastName: joiSecondLastName,
    email: joiEmail,
    role: joiRoleId,
    status: joiStatusId,
  }),

  // PUT /users/update-phones (body: { userId, phones })
  // Validate UserService.updatePhones(userId, phones)
  updateUserPhones: Joi.object({
    userId: joiId.required(),
    phones: joiPhones.required(),
  }),

  // POST /users/find-by-email (body: { email })
  // Validate userService.findByEmail(email)
  getByEmail: Joi.object({
    email: joiEmail.required(),
  }),
};
