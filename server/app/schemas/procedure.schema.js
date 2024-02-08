const Joi = require("joi");

const procedure = Joi.object({
  id: Joi.number().empty(null).id(),
  code: Joi.string().trim().empty("").required(),
  name: Joi.string().trim().empty("").required(),
  price: Joi.number().min(0).required(),
  procedureCategory: Joi.object().allow(null),
}).unknown();

const id = Joi.object({
  procedureId: Joi.number().empty(null).id(),
});

const ids = Joi.object({
  procedureId: Joi.string()
    .empty()
    .empty("")
    .pattern(/^((\d)+,)*(\d)+$/),
});

const code = Joi.string().trim().empty("").required();
const name = Joi.string().trim().empty("").required();
const price = Joi.number().min(0).required();
const procedureCategory = Joi.object().allow(null);

module.exports = {
  procedure,
  id,
  ids,
  code,
  name,
  price,
  procedureCategory,
};
