const Joi = require('joi');

const model = Joi.object({
  id: Joi.string(),
  name: Joi.string(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string()
});

module.exports = model;