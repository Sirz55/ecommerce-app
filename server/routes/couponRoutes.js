const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Coupon = require('../models/Coupon');
const logger = require('../config/logger').logger;

// Create coupon (admin only)
router.post('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    logger.info(`Coupon created: ${coupon.code}`);
    res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
});

// Get all coupons (admin only)
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, isActive } = req.query;
    
    const query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const coupons = await Coupon.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Coupon.countDocuments(query);

    res.status(200).json({
      coupons,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalResults: count
    });
  } catch (error) {
    next(error);
  }
});

// Get single coupon (admin only)
router.get('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.status(200).json(coupon);
  } catch (error) {
    next(error);
  }
});

// Update coupon (admin only)
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    logger.info(`Coupon updated: ${coupon.code}`);
    res.status(200).json(coupon);
  } catch (error) {
    next(error);
  }
});

// Delete coupon (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    await coupon.remove();
    logger.info(`Coupon deleted: ${coupon.code}`);
    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Validate coupon
router.post('/validate', async (req, res, next) => {
  try {
    const { code, orderTotal, orderProducts } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({
        valid: false,
        message: 'Coupon not found'
      });
    }

    if (!coupon.isValid()) {
      return res.status(400).json({
        valid: false,
        message: 'Coupon is not valid'
      });
    }

    const discount = coupon.calculateDiscount(orderTotal, orderProducts);
    res.status(200).json({
      valid: true,
      discount,
      coupon
    });
  } catch (error) {
    next(error);
  }
});

// Apply coupon to order
router.post('/apply', protect, async (req, res, next) => {
  try {
    const { code, orderId } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({
        valid: false,
        message: 'Coupon not found'
      });
    }

    if (!coupon.isValid()) {
      return res.status(400).json({
        valid: false,
        message: 'Coupon is not valid'
      });
    }

    // Update coupon usage count
    coupon.usedCount += 1;
    await coupon.save();

    res.status(200).json({
      message: 'Coupon applied successfully',
      coupon
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
