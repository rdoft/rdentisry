const Joi = require("joi").extend(require("@joi/date"));

const appointment = Joi.object({
  id: Joi.number().empty(null).id(),
  patientId: Joi.number().required(),
  doctorId: Joi.number().empty(null),
  date: Joi.date().min("now").required(),
  startTime: Joi.date()
    .format("HH:mm")
    // .pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .required(),
  endTime: Joi.date()
    // .pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .min(Joi.ref("startTime"))
    .format("HH:mm")
    .required(),
  didCome: Joi.boolean().empty(null).allow(null),
  didAction: Joi.boolean().empty(null).allow(null),
});

const id = Joi.object({
  appointmentId: Joi.number().empty(null).id(),
});

const patientId = Joi.number().required();
const doctorId = Joi.number().empty(null);
const date = Joi.date().min("now").required();
const startTime = Joi.date()
  .format("HH:mm")
  // .pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
  .required();
const endTime = Joi.date()
  .format("HH:mm")
  // .pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
  .required();

module.exports = {
  appointment,
  id,
  patientId,
  doctorId,
  date,
  startTime,
  endTime,
};
