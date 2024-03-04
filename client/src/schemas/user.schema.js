const Joi = require("joi");

const register = Joi.object({
  name: Joi.string().trim().default("").allow(""),
  email: Joi.string().trim().empty("").email({ tlds: false }).required(),
  password: Joi.string().trim().empty("").min(8).required(),
});

const login = Joi.object({
  email: Joi.string().trim().empty("").email({ tlds: false }).required(),
  password: Joi.string().trim().empty("").required(),
});

const forgot = Joi.object({
  email: Joi.string().trim().empty("").email({ tlds: false }).required(),
});

const reset = Joi.object({
  password: Joi.string().trim().empty("").min(8).required(),
});

const id = Joi.object({
  userId: Joi.number().empty(null).id(),
});

const email = Joi.string().trim().empty("").email({ tlds: false }).required();
const password = Joi.string().trim().empty("").min(8).required();

module.exports = {
  login,
  register,
  forgot,
  reset,
  id,
  email,
  password,
};
