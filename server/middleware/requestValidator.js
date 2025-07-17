const { Joi } = require('joi');
const logger = require('../config/logger').logger;

// Schema validation functions
const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      logger.warn('Request validation error:', error.details);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(err => ({
          field: err.context?.key,
          message: err.message
        }))
      });
    }
    next();
  };
};

// Common schemas
const schemas = {
  // User registration
  registerUser: Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
  }),

  // User login
  loginUser: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Password reset
  resetPassword: Joi.object({
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
  }),

  // Order creation
  createOrder: Joi.object({
    items: Joi.array().items(Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
      price: Joi.number().required()
    })).required(),
    shippingAddress: Joi.object({
      fullName: Joi.string().required(),
      streetAddress: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().required(),
      phone: Joi.string().required()
    }).required(),
    paymentMethod: Joi.string().valid('credit_card', 'debit_card', 'paypal', 'bank_transfer').required()
  }),

  // Product creation
  createProduct: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).required(),
    price: Joi.number().min(0).required(),
    stock: Joi.number().min(0).required(),
    category: Joi.string().required(),
    images: Joi.array().items(Joi.string()).required()
  }),

  // Coupon creation
  createCoupon: Joi.object({
    code: Joi.string().min(3).max(20).required(),
    type: Joi.string().valid('percentage', 'fixed').required(),
    value: Joi.number().min(0).required(),
    minOrderAmount: Joi.number().min(0).required(),
    maxDiscount: Joi.number().min(0).required(),
    validFrom: Joi.date().required(),
    validUntil: Joi.date().required(),
    usageLimit: Joi.number().min(1).required(),
    products: Joi.array().items(Joi.string()).required(),
    categories: Joi.array().items(Joi.string()).required()
  })
};

// Input sanitization
const sanitizeInput = (req, res, next) => {
  const { body, query, params } = req;
  
  // Remove potentially dangerous characters
  const sanitize = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/[<>]/g, '');
  };

  // Sanitize all string values
  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        sanitizeObject(obj[key]);
      } else if (typeof obj[key] === 'string') {
        obj[key] = sanitize(obj[key]);
      }
    }
  };

  sanitizeObject(body);
  sanitizeObject(query);
  sanitizeObject(params);

  next();
};

module.exports = {
  validateSchema,
  schemas,
  sanitizeInput
};
