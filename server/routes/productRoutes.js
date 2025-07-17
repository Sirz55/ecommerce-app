const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Product = require('../models/Product');
const upload = require('../middleware/upload');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - stock
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *           description: Name of the product
 *         description:
 *           type: string
 *           description: Description of the product
 *         price:
 *           type: number
 *           description: Price of the product
 *         stock:
 *           type: number
 *           description: Available stock quantity
 *         category:
 *           type: string
 *           description: Category ID of the product
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of product image URLs
 *         ratings:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               rating:
 *                 type: number
 *               review:
 *                 type: string
 *         averageRating:
 *           type: number
 *           description: Average rating of the product
 *         numReviews:
 *           type: number
 *           description: Number of reviews for the product
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation date of the product
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update date of the product
 *       example:
 *         id: 123
 *         name: Sample Product
 *         description: This is a sample product
 *         price: 99.99
 *         stock: 100
 *         category: 456
 *         images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *         ratings: []
 *         averageRating: 0
 *         numReviews: 0
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 */
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const products = await Product.find(query)
      .populate('category')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Product.countDocuments(query);

    res.status(200).json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
});

// Get single product
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('reviews.user', 'name avatar');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

// Update product with image upload (admin only)
router.put('/:id', auth, 
  authorize('admin'),
  upload.uploadImage,
  async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete old images from Cloudinary
    if (product.images) {
      await Promise.all(product.images.map(img => upload.deleteImage(img.public_id)));
    }

    // Update product with new image
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images: [req.body.image]
      },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

// Delete product (admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete images from Cloudinary
    if (product.images) {
      await Promise.all(product.images.map(img => upload.deleteImage(img.public_id)));
    }

    await product.remove();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
