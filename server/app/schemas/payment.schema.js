const Joi = require("joi").extend(require("@joi/date"));

const payment = Joi.object({
  id: Joi.number().empty(null).id(),
  patient: Joi.object().required(),
  type: Joi.string().empty("").allow(null),
  amount: Joi.number().min(0).required(),
  plannedDate: Joi.date().empty(null).allow(null),
  actualDate: Joi.date().when("plannedDate", {
    is: Joi.exist(),
    then: Joi.allow(null),
  }),
});

const id = Joi.object({
  paymentId: Joi.number().empty(null).id(),
});

const patientId = Joi.number().required();
const type = Joi.string().empty("").allow(null);
const amount = Joi.number().min(0).required();
const plannedDate = Joi.date().empty(null).allow(null);
const actualDate = Joi.date().empty(null).allow(null);

module.exports = {
  payment,
  id,
  patientId,
  type,
  amount,
  plannedDate,
  actualDate,
};
