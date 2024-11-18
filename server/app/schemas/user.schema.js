const Joi = require("joi");

const register = Joi.object({
  name: Joi.string().trim().default("").allow(""),
  email: Joi.string().trim().empty("").email({ tlds: false }).required(),
  password: Joi.string()
    .trim()
    .min(8)
    .max(20)
    .regex(/[a-z]/, "küçük harf")
    .regex(/[A-Z]/, "büyük harf")
    .regex(/\d/, "rakam")
    .regex(/[@$!%*?&#.^()_+\-={};':"|,.<>?]/, "özel karakter")
    .required(),
  referralCode: Joi.string().trim().empty("").allow(null),
});

const login = Joi.object({
  email: Joi.string().trim().empty("").email({ tlds: false }).required(),
  password: Joi.string().trim().empty("").required(),
});

const forgot = Joi.object({
  email: Joi.string().trim().empty("").email({ tlds: false }).required(),
});

const reset = Joi.object({
  password: Joi.string()
    .trim()
    .min(8)
    .max(20)
    .regex(/[a-z]/, "küçük harf")
    .regex(/[A-Z]/, "büyük harf")
    .regex(/\d/, "rakam")
    .regex(/[@$!%*?&#.^()_+\-={};':"|,.<>?]/, "özel karakter")
    .required(),
});

const id = Joi.object({
  userId: Joi.number().empty(null).id(),
});

const email = Joi.string().trim().empty("").email({ tlds: false }).required();
const password = Joi.string()
  .trim()
  .min(8)
  .max(20)
  .regex(/[a-z]/, "küçük harf")
  .regex(/[A-Z]/, "büyük harf")
  .regex(/\d/, "rakam")
  .regex(/[@$!%*?&#.^()_+\-={};':"|,.<>?]/, "özel karakter")
  .required();

const user = Joi.object({
  name: Joi.string().trim().default("").allow(""),
  password: Joi.string()
    .trim()
    .min(8)
    .max(20)
    .regex(/[a-z]/, "küçük harf")
    .regex(/[A-Z]/, "büyük harf")
    .regex(/\d/, "rakam")
    .regex(/[@$!%*?&#.^()_+\-={};':"|,.<>?]/, "özel karakter"),
}).unknown(true);

module.exports = {
  user,
  login,
  register,
  forgot,
  reset,
  id,
  email,
  password,
};
