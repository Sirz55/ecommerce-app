const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

/**
 * @swagger
 * components:
 *   schemas:
 *     WishlistItem:
 *       type: object
 *       required:
 *         - product
 *       properties:
 *         product:
 *           type: string
 *           description: Product ID
 *         name:
 *           type: string
 *           description: Product name
 *         price:
 *           type: number
 *           description: Product price
 *         image:
 *           type: string
 *           description: Product image URL
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Wishlist:
 *       type: object
 *       required:
 *         - items
 *         - totalItems
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WishlistItem'
 *         totalItems:
 *           type: number
 *           description: Total number of items in wishlist
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's wishlist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wishlist'
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate('products.product');
    
    if (!wishlist) {
      return res.status(200).json({ products: [] });
    }
    
    res.status(200).json(wishlist);
  } catch (error) {
    next(error);
  }
});

// Add product to wishlist
router.post('/add', protect, async (req, res, next) => {
  try {
    const { productId } = req.body;
    
    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id });
    }

    // Check if product is already in wishlist
    const existingProduct = wishlist.products.find(p => p.product.toString() === productId);
    if (existingProduct) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    // Add product to wishlist
    wishlist.products.push({ product: productId });
    await wishlist.save();

    res.status(200).json(wishlist);
  } catch (error) {
    next(error);
  }
});

// Remove product from wishlist
router.delete('/remove/:productId', protect, async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    // Remove product from wishlist
    wishlist.products = wishlist.products.filter(
      p => p.product.toString() !== req.params.productId
    );

    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (error) {
    next(error);
  }
});

// Clear entire wishlist
router.delete('/', protect, async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    // Clear all products
    wishlist.products = [];
    await wishlist.save();

    res.status(200).json(wishlist);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
