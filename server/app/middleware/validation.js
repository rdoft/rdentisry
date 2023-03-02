const Joi = require("joi");

const validate = (schema, property) => {
  return (req, res, next) => {
    // Validate the request body with given schema
    const { error } = schema.validate(req[property]);
  

    if (!error) {
      // If ıt is valid, then return
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
