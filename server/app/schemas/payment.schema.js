const Joi = require("joi").extend(require("@joi/date"));

const payment = Joi.object({
  id: Joi.number().empty(null).id(),
  patient: Joi.object().required(),
  type: Joi.string().empty("").allow(true),
  amount: Joi.number().min(0).required(),
  plannedDate: Joi.date().min("now"),
  actualDate: Joi.date().when("plannedDate", {
    not: Joi.exist(),
    then: Joi.required(),
  }),
});

const id = Joi.object({
  paymentId: Joi.number().empty(null).id(),
});

const patientId = Joi.number().required();
const type = Joi.string().empty("").allow(true);
const amount = Joi.number().min(0).required();
const plannedDate = Joi.date().min("now");
const actualDate = Joi.date().when("plannedDate", {
  not: Joi.exist(),
  then: Joi.required(),
});

module.exports = {
  payment,
  id,
  patientId,
  type,
  amount,
  plannedDate,
  actualDate,
};
