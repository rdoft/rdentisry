const Joi = require("joi");

const patient = Joi.object({
  id: Joi.number().empty(null).id(),
  idNumber: Joi.string()
    .length(11)
    .pattern(/^\d{11}$/)
    .default(null)
    .empty("")
    .allow(null),
  name: Joi.string().trim().empty("").required(),
  surname: Joi.string().trim().empty("").required(),
  phone: Joi.string()
    .length(10)
    .pattern(/^\d{10}$/)
    .empty("")
    .required(),
  birthYear: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .default(null)
    .empty("")
    .allow(null),
  isSMS: Joi.boolean().empty(null).default(false),
}).unknown();

const id = Joi.object({
  patientId: Joi.number().empty(null).id(),
});

const ids = Joi.object({
  patientId: Joi.string()
    .empty()
    .empty("")
    .pattern(/^((\d)+,)*(\d)+$/),
});

const idNumber = Joi.string()
  .length(11)
  .pattern(/^\d{11}$/)
  .default(null)
  .empty("")
  .allow(null);
const name = Joi.string().trim().empty("").required();
const surname = Joi.string().trim().empty("").required();
const phone = Joi.string()
  .length(10)
  .pattern(/^\d{10}$/)
  .empty("")
  .required();
const birthYear = Joi.number()
  .integer()
  .min(1900)
  .max(new Date().getFullYear())
  .default(null)
  .empty("")
  .allow(null);

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
