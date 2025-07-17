const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Shipping = require('../models/Shipping');
const Order = require('../models/Order');
const logger = require('../config/logger').logger;

// Create shipping (for orders)
router.post('/', protect, async (req, res, next) => {
  try {
    const { orderId, shippingAddress, shippingMethod } = req.body;

    // Validate order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Calculate shipping cost
    const shippingCost = await Shipping.calculateShippingCost(
      order.totalAmount,
      shippingAddress
    );

    const shipping = await Shipping.create({
      user: req.user.id,
      order: orderId,
      shippingAddress,
      shippingMethod,
      shippingCost
    });

    logger.info(`Shipping created for order: ${orderId}`);
    res.status(201).json(shipping);
  } catch (error) {
    next(error);
  }
});

// Get shipping by order
router.get('/order/:orderId', protect, async (req, res, next) => {
  try {
    const shipping = await Shipping.findOne({
      order: req.params.orderId,
      user: req.user.id
    });

    if (!shipping) {
      return res.status(404).json({ message: 'Shipping details not found' });
    }

    res.status(200).json(shipping);
  } catch (error) {
    next(error);
  }
});

// Update shipping status (admin only)
router.put('/:id/status', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { status, trackingNumber } = req.body;
    const shipping = await Shipping.findById(req.params.id);

    if (!shipping) {
      return res.status(404).json({ message: 'Shipping not found' });
    }

    shipping.updateStatus(status, trackingNumber);
    await shipping.save();

    logger.info(`Shipping status updated: ${shipping._id} - ${status}`);
    res.status(200).json(shipping);
  } catch (error) {
    next(error);
  }
});

// Get shipping history (admin only)
router.get('/history', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const shipping = await Shipping.find(query)
      .populate('order', 'totalAmount status')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Shipping.countDocuments(query);

    res.status(200).json({
      shipping,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalResults: count
    });
  } catch (error) {
    next(error);
  }
});

// Get user's shipping history
router.get('/user', protect, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const shipping = await Shipping.find({ user: req.user.id })
      .populate('order', 'totalAmount status')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Shipping.countDocuments({ user: req.user.id });

    res.status(200).json({
      shipping,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalResults: count
    });
  } catch (error) {
    next(error);
  }
});

// Calculate shipping cost
router.post('/calculate', async (req, res, next) => {
  try {
    const { orderTotal, shippingAddress, shippingMethod } = req.body;
    
    const shippingCost = await Shipping.calculateShippingCost(
      orderTotal,
      shippingAddress,
      shippingMethod
    );

    res.status(200).json({
      shippingCost,
      estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
