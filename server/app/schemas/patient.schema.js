const Joi = require("joi");

const patient = Joi.object({
  id: Joi.number().empty(null).id(),

  idNumber: Joi.string()
    .empty("")
    .length(11)
    .pattern(/^\d{11}$/)
    .required(),

  name: Joi.string().empty("").required(),

  surname: Joi.string().empty("").required(),

  phone: Joi.string()
    .empty("")
    .length(10)
    .pattern(/^\d{10}$/)
    .required(),

  birthYear: Joi.number().integer().min(1900).max(new Date().getFullYear()),
});

const patientId = Joi.object({
  patientId: Joi.number().integer().empty().required(),
});

const patientIds = Joi.object({
  patientId: Joi.string()
    .empty()
    .empty("")
    .pattern(/^((\d)+,)*(\d)+$/),
});

module.exports = {
  patient,
  patientId,
  patientIds,
};
