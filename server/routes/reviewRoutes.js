const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Review = require('../models/Review');
const Product = require('../models/Product');

// Add review
router.post('/add', protect, async (req, res, next) => {
  try {
    const { productId, rating, comment, images } = req.body;
    
    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has already reviewed
    const existingReview = await Review.findOne({
      user: req.user.id,
      product: productId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Create review
    const review = await Review.create({
      user: req.user.id,
      product: productId,
      rating,
      comment,
      images
    });

    // Update product average rating
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    product.rating = avgRating;
    product.numReviews = reviews.length;
    await product.save();

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
});

// Get product reviews
router.get('/product/:productId', async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort('-createdAt');
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
});

// Get user reviews
router.get('/user', protect, async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('product', 'name images')
      .sort('-createdAt');
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
});

// Update review helpfulness
router.put('/helpful/:reviewId', protect, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Prevent user from voting multiple times
    if (review.helpfulUsers.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have already marked this review as helpful' });
    }

    review.helpfulUsers.push(req.user.id);
    review.helpful = review.helpfulUsers.length;
    await review.save();

    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
