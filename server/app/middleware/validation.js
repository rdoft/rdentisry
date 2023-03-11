const Joi = require("joi");

const validate = (schema, property) => {
  return (req, res, next) => {
    // Validate the request body with given schema
    const { value, error } = schema.validate(req[property]);
  

    if (!error) {
      // If ıt is valid, then return
      req[property] = value;
      next();
    } else {
      // Get error message
      const message = error.details.map((item) => item.message).join(",");
      res.status(400).json({ error: message });
    }
  };
};

module.exports = {
  validate,
};
