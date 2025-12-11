const Joi = require('joi');

/**
 * Validation middleware factory
 * @param {Object} schema - Joi schema object with optional body, params, query keys
 * @returns {Function} Express middleware function
 */
const validate = (schema) => {
  return (req, res, next) => {
    const validationOptions = {
      abortEarly: false, // Return all errors
      allowUnknown: true, // Allow unknown keys (like headers, etc.)
      stripUnknown: { body: true, query: true, params: true }, // Remove unknown keys
    };

    const toValidate = {};
    if (schema.body) toValidate.body = req.body;
    if (schema.params) toValidate.params = req.params;
    if (schema.query) toValidate.query = req.query;

    const validationSchema = Joi.object(schema);
    const { error, value } = validationSchema.validate(toValidate, validationOptions);

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации',
        errors,
      });
    }

    // Replace req values with validated values
    if (value.body) req.body = value.body;
    if (value.params) req.params = value.params;
    if (value.query) req.query = value.query;

    next();
  };
};

module.exports = validate;
