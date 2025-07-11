const express = require('express');
const router = express.Router();
const { createProduct, getProducts } = require('../controllers/productController');

// Import the Joi schema and validator middleware
const productValidator = require('../validators/productValidator');
const validateRequest = require('../middleware/validateRequest');

// Add validation middleware to the POST route
router.post('/products', validateRequest(productValidator), createProduct);
router.get('/products', getProducts);

module.exports = router;
