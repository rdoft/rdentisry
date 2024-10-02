const Joi = require("joi");

const appointmentId = Joi.object({
  appointmentId: Joi.number().empty(null).id(),
});

const pateintId = Joi.object({
  patientId: Joi.number().empty(null).id(),
});

module.exports = {
  appointmentId,
  pateintId,
};
