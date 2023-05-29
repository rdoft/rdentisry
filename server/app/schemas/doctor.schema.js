const Joi = require("joi");

const doctor = Joi.object({
  id: Joi.number().empty(null).id(),
  name: Joi.string().trim().empty("").required(),
  surname: Joi.string().trim().empty("").required(),
});

const id = Joi.object({
  doctorId: Joi.number().empty(null).id(),
});

const name = Joi.string().trim().empty("").required();
const surname = Joi.string().trim().empty("").required();

module.exports = {
  doctor,
  id,
  name,
  surname,
};
