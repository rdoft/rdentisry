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
      return res.status(400).send({ message: message });
    }
  };
};

// Validate two properties with given schemas
function validateOR(schema1, schema2, property) {
  return function (req, res, next) {
    const { value1, error1 } = schema1.validate(req[property]);
    const { value2, error2 } = schema2.validate(req[property]);

    if (error1 && error2) {
      const message = error1.details
        .concat(error2.details)
        .map((item) => item.message)
        .join(",")
        .replaceAll('"', "");
      return res.status(400).send({ message: message });
    } else {
      next();
    }
  };
}

module.exports = {
  validate,
  validateOR,
};
