const Joi = require("joi");

const invoice = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().empty("").allow(null),
  discount: Joi.number().min(0).max(100).empty("").allow(null),
  date: Joi.date().allow(null),
}).unknown();

const id = Joi.object({
  invoiceId: Joi.number().empty(null).id(),
  patientId: Joi.number().empty(null).id(),
});

module.exports = {
  invoice,
  id,
};
