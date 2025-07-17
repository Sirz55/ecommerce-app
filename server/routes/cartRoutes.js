const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { addToCart, removeFromCart, updateCart, getCart } = require('../controllers/cartController');

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - product
 *         - quantity
 *       properties:
 *         product:
 *           type: string
 *           description: Product ID
 *         quantity:
 *           type: number
 *           description: Quantity of the product
 *         price:
 *           type: number
 *           description: Price per unit
 *         total:
 *           type: number
 *           description: Total price for quantity
 *         name:
 *           type: string
 *           description: Product name
 *         image:
 *           type: string
 *           description: Product image URL
 *       example:
 *         product: 123
 *         quantity: 2
 *         price: 99.99
 *         total: 199.98
 *         name: Sample Product
 *         image: https://example.com/product.jpg
 * 
 *     Cart:
 *       type: object
 *       required:
 *         - items
 *         - totalQuantity
 *         - totalPrice
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         totalQuantity:
 *           type: number
 *           description: Total quantity of all items
 *         totalPrice:
 *           type: number
 *           description: Total price of all items
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
});

// Add item to cart
router.post('/add', protect, async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    
    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id });
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
});

// Remove item from cart
router.delete('/remove/:itemId', protect, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
});

// Update item quantity
router.put('/update/:itemId', protect, async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item._id.toString() === req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity = quantity;
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
