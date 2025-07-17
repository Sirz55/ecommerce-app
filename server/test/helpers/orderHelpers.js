const mongoose = require('mongoose');
const Order = require('../../models/Order');
const Product = require('../../models/Product');
const User = require('../../models/User');
const logger = require('../../config/logger').logger;

// Helper functions for order tests

// Create test order
const createTestOrder = async (userId, productId, options = {}) => {
  const defaults = {
    items: [{
      product: productId,
      quantity: 1
    }],
    shippingAddress: {
      fullName: 'Test User',
      streetAddress: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      postalCode: '12345',
      country: 'Test Country',
      phone: '+1234567890'
    },
    paymentMethod: 'credit_card',
    status: 'pending',
    paymentStatus: 'pending'
  };

  const order = await Order.create({
    user: userId,
    ...defaults,
    ...options
  });

  logger.info('Created test order', { orderId: order._id });
  return order;
};

// Update product stock
const updateProductStock = async (productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  product.stock = quantity;
  await product.save();

  logger.info('Updated product stock', { productId, quantity });
  return product;
};

// Create test coupon
const createTestCoupon = async (userId, options = {}) => {
  const defaults = {
    code: 'TEST' + Math.random().toString(36).substr(2, 5),
    discountType: 'percentage',
    discountValue: 20,
    minimumAmount: 100,
    maxUses: 10,
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  };

  const coupon = await Coupon.create({
    user: userId,
    ...defaults,
    ...options
  });

  logger.info('Created test coupon', { couponId: coupon._id });
  return coupon;
};

// Calculate order total
const calculateOrderTotal = (items, coupon = null) => {
  let subtotal = 0;
  items.forEach(item => {
    subtotal += item.price * item.quantity;
  });

  let total = subtotal;
  let discount = 0;

  if (coupon) {
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
      total = subtotal - discount;
    } else if (coupon.discountType === 'fixed') {
      discount = coupon.discountValue;
      total = subtotal - discount;
    }
  }

  return { subtotal, discount, total };
};

// Clean up test data
const cleanupTestData = async () => {
  await Order.deleteMany({});
  await Product.deleteMany({});
  await User.deleteMany({});
  await Coupon.deleteMany({});
  logger.info('Cleaned up test data');
};

module.exports = {
  createTestOrder,
  updateProductStock,
  createTestCoupon,
  calculateOrderTotal,
  cleanupTestData
};
