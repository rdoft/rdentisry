const Joi = require("joi");

const visit = Joi.object({
  patient: Joi.object().required(),
  title: Joi.string().trim().required(),
  description: Joi.string().trim().empty("").allow(null),
  discount: Joi.number().min(0).max(100).empty("").allow(null),
  approvedDate: Joi.date().allow(null),
}).unknown();

const id = Joi.object({
  visitId: Joi.number().empty(null).id(),
  patientId: Joi.number().empty(null).id(),
});

module.exports = {
  visit,
  id,
};
