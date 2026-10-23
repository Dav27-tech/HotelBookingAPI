// Import the Joi library
import Joi from "joi";

// -------------------------- Primitive Joi Types ------------------------------

import {
  joiFirstName,
  joiFirstLastName,
  joiEmail,
  joiPassword,
} from "./userSchema.js";

// ----------------------------- Schema export ---------------------------------

export const authenticationSchema = {
  // POST /auth/login (body: { email, password })
  // Validate AuthenticationServices.login(email, password)
  loginData: Joi.object({
    email: joiEmail.required(),
    password: joiPassword.required(),
  }),

  // POST /auth/reset-password (body: { firstName, firstLastName, email, password })
  // Validate AuthenticationServices.resetPassword(email, firstName, firstLastName, newPassword)
  resetPasswordData: Joi.object({
    firstName: joiFirstName.required(),
    firstLastName: joiFirstLastName.required(),
    email: joiEmail.required(),
    password: joiPassword.required(),
  }),
};
