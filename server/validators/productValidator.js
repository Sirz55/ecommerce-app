// server/validators/productValidator.js
const Joi = require('joi');

const productValidator = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().required(),
  image: Joi.string().required(), // ✅ Add this
  category: Joi.string().valid('Phones', 'Laptops', 'Accessories', 'Electronics').required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required()
});

module.exports = productValidator;
