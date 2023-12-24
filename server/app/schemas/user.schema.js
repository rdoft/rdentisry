const Joi = require("joi");

const register = Joi.object({
  id: Joi.number().empty(null).id(),
  name: Joi.string().trim().empty("").required(),
  email: Joi.string().trim().empty("").email().required(),
  password: Joi.string().trim().empty("").min(8).required(),
});

const login = Joi.object({
  email: Joi.string().trim().empty("").email().required(),
  password: Joi.string().trim().empty("").min(8).required(),
});

const id = Joi.object({
  userId: Joi.number().empty(null).id(),
});

const email = Joi.string().trim().empty("").email().required();
const password = Joi.string().trim().empty("").min(8).required();

module.exports = {
  login,
  register,
  id,
  email,
  password,
};
