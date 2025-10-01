const { validationResult } = require('express-validator');
const createError = require('http-errors');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const extractedErrors = errors.array().map((err) => ({
      [err.path]: err.msg,
    }));
    next(createError(400, 'Validation failed', { errors: extractedErrors }));
  };
};

module.exports = validate;