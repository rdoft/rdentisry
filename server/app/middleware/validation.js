const log = require("../config/log.config");
const Joi = require("joi");

// Validate the request body with given schema
const validate = (schema, property) => {
  return (req, res, next) => {
    const { value, error } = schema.validate(req[property]);

    if (!error) {
      // If ıt is valid, then return
      req[property] = value;
      next();
    } else {
      // Get error message
      const message = error.details
        .map((item) => item.message)
        .join(",")
        .replaceAll('"', "");
      res.status(400).send({ message: message });
      log.app.warn(`Request validation failed: ${message}`);
      return;
    }
  };
};

// Validate two properties with given schemas
function validateOR(schema1, schema2, property) {
  return function (req, res, next) {
    const { value: value1, error: error1 } = schema1.validate(req[property]);
    const { value: value2, error: error2 } = schema2.validate(req[property]);

    if (error1 && error2) {
      const message = error1.details
        .concat(error2.details)
        .map((item) => item.message)
        .join(" OR ")
        .replaceAll('"', "");
      res.status(400).send({ message: message });
      log.app.warn(`Request validation failed: ${message}`);
      return;
    } else {
      next();
    }
  };
}

module.exports = {
  validate,
  validateOR,
};
