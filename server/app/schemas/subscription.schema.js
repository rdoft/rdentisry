const Joi = require("joi");

// pricingId, idNumber, name, surname, address, city, country, phone
const billing = Joi.object({
  pricingId: Joi.number().empty(null).id(),
  idNumber: Joi.string()
    .length(11)
    .pattern(/^\d{11}$/)
    .default(null)
    .empty("")
    .required(),
  name: Joi.string().trim().empty("").required(),
  surname: Joi.string().trim().empty("").required(),
  address: Joi.string().trim().empty("").required(),
  city: Joi.string().trim().empty("").required(),
  country: Joi.string().trim().empty("").required(),
  phone: Joi.string()
    .length(10)
    .pattern(/^\d{10}$/)
    .empty("")
    .required(),
}).unknown();

const token = Joi.object({
  token: Joi.string().empty(null).required(),
});

const id = Joi.object({
  subscriptionId: Joi.number().empty(null).id(),
});

const pricingId = Joi.object({
  pricingId: Joi.number().empty(null).id(),
});

const address = Joi.string().trim().empty("").required();
const city = Joi.string().trim().empty("").required();
const country = Joi.string().trim().empty("").required();
const idNumber = Joi.string()
  .length(11)
  .pattern(/^\d{11}$/)
  .default(null)
  .empty("")
  .required();

const name = Joi.string().trim().empty("").required();
const surname = Joi.string().trim().empty("").required();
const phone = Joi.string()
  .length(10)
  .pattern(/^\d{10}$/)
  .empty("")
  .required();

module.exports = {
  billing,
  pricingId,
  token,
  id,
  address,
  city,
  country,
  idNumber,
  name,
  surname,
  phone,
};
