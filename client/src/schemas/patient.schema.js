const Joi = require("joi");

const patient = Joi.object({
  id: Joi.number().empty(null).id(),
  idNumber: Joi.string()
    .empty("")
    .length(11)
    .pattern(/^\d{11}$/)
    .required(),
  name: Joi.string().trim().empty("").required(),
  surname: Joi.string().trim().empty(" ").required(),
  phone: Joi.string()
    .empty("")
    .length(10)
    .pattern(/^\d{10}$/)
    .required(),
  birthYear: Joi.number().integer().min(1900).max(new Date().getFullYear()),
});

const id = Joi.object({
  patientId: Joi.number().integer().empty().required(),
});

const ids = Joi.object({
  patientId: Joi.string()
    .empty()
    .empty("")
    .pattern(/^((\d)+,)*(\d)+$/),
});

const idNumber = Joi.string()
  .empty("")
  .length(11)
  .pattern(/^\d{11}$/)
  .required();
const name = Joi.string().trim().empty("").required();
const surname = Joi.string().trim().empty("").required();
const phone = Joi.string()
  .empty("")
  .length(10)
  .pattern(/^\d{10}$/)
  .required();
const birthYear = Joi.number()
  .integer()
  .min(1900)
  .max(new Date().getFullYear());

module.exports = {
  patient,
  id,
  ids,
  idNumber,
  name,
  surname,
  phone,
  birthYear,
};
