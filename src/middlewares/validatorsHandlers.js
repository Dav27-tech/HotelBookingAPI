// Import the Boom library fpr HTTP-friendly error objects
import Boom from "@hapi/boom";

/**
 * Middleware for validating request data against a Joi schema.
 *
 * if validation fails, a Boom bad request error is forwarded to the
 * error-handling middlewares and the request pipeline STOPS there: the
 * controller is never reached with a invalid payload.a
 *
 * @param {object} schema - The Joi schema to validate against.
 * @param {string} property - The property of the request object
 * to validate (e.g 'body', 'params', 'query').
 * @returns {function} - A middleware function fro validation.
 */
export const validatorHandler = (schema, property) => {
  // Return a middleware function
  return (req, res, next) => {
    // Extract the data from the specified property of the request object.
    // req.body is undefined when the request carries a no body,
    // so fall back to empty object to make Joi report the missing required
    // fields instated of letting the request through.
    const data = req[property] ?? {};

    // Validate the data against the provided Joi schema
    const { error } = schema.validate(data, { abortEarly: false });

    // If there is a validation error, create a Boom bad request error and
    // forward it. Execution falls through to te next() call below and the
    // controller runs anyway.
    if (error) {
      return next(Boom.badRequest(error));
    }

    // If no error, proceed to the next middleware
    return next();
  };
};
