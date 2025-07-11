const express = require('express');
const router = express.Router();
const { createProduct, getProducts } = require('../controllers/productController');

router.post('/products', createProduct);
router.get('/products', getProducts);

module.exports = router;
