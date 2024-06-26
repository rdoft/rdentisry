const Joi = require("joi").extend(require("@joi/date"));

const payment = Joi.object({
  id: Joi.number().empty(null).id(),
  patient: Joi.object().required(),
  type: Joi.string().empty("").allow(null),
  amount: Joi.number().min(0).required(),
  actualDate: Joi.date().empty(null).default(new Date()),
  isPlanned: Joi.boolean().default(false).required(),
}).unknown();

const paymentPlan = Joi.object({
  id: Joi.number().empty(null).id(),
  patient: Joi.object().required(),
  amount: Joi.number().min(0).required(),
  plannedDate: Joi.date().empty(null).required(),
}).unknown();

const id = Joi.object({
  paymentId: Joi.number().empty(null).id(),
});

const patientId = Joi.number().required();
const type = Joi.string().empty("").allow(null);
const amount = Joi.number().min(0).required();
const actualDate = Joi.date().empty(null).allow(null);
const plannedDate = Joi.date().empty(null).allow(null);
const isPlanned = Joi.boolean().default(false);

module.exports = {
  payment,
  paymentPlan,
  id,
  patientId,
  type,
  amount,
  actualDate,
  plannedDate,
  isPlanned,
};
