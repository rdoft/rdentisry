const Joi = require("joi").extend(require("@joi/date"));

const note = Joi.object({
  id: Joi.number().empty(null).id(),
  patient: Joi.object().required(),
  date: Joi.date().min("now").required(),
  detail: Joi.string().default(null).empty("").allow(null),
});

const id = Joi.object({
  noteId: Joi.number().empty(null).id(),
});

const patientId = Joi.number().required();
const date = Joi.date().min("now").required();

module.exports = {
  note,
  id,
  patientId,
  date,
};
