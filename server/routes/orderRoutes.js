const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const logger = require('../config/logger').logger;
const { handleOrderCreation, handleOrderStatusChange } = require('../middleware/notificationMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - items
 *         - shippingAddress
 *         - paymentMethod
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the order
 *         user:
 *           type: string
 *           description: User ID who placed the order
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *         coupon:
 *           type: string
 *           description: Coupon ID if used
 *         discount:
 *           type: object
 *           properties:
 *             amount:
 *               type: number
 *             percentage:
 *               type: number
 *         shippingAddress:
 *           type: object
 *           properties:
 *             fullName:
 *               type: string
 *             streetAddress:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             postalCode:
 *               type: string
 *             country:
 *               type: string
 *             phone:
 *               type: string
 *         paymentMethod:
 *           type: string
 *           enum: [credit_card, debit_card, paypal, bank_transfer]
 *         shippingCost:
 *           type: number
 *         subtotal:
 *           type: number
 *         totalAmount:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, failed]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - shippingAddress
 *               - paymentMethod
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *               couponCode:
 *                 type: string
 *                 description: Optional coupon code
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   fullName:
 *                     type: string
 *                   streetAddress:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *                   country:
 *                     type: string
 *                   phone:
 *                     type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [credit_card, debit_card, paypal, bank_transfer]
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid coupon or other validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, async (req, res, next) => {
  try {
    const { items, couponCode, shippingAddress, paymentMethod } = req.body;

    // Validate coupon if provided
    let coupon = null;
    let discount = { amount: 0, percentage: 0 };

    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (!coupon) {
        return res.status(404).json({
          message: 'Coupon not found',
          success: false
        });
      }

      if (!coupon.isValid()) {
        return res.status(400).json({
          message: 'Coupon is not valid',
          success: false
        });
      }

      // Calculate discount
      const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
      const discountAmount = coupon.calculateDiscount(subtotal, items);
      discount = {
        amount: discountAmount,
        percentage: (discountAmount / subtotal) * 100
      };
    }

    // Calculate shipping cost
    const shippingCost = await Order.calculateShippingCost(
      subtotal - discount.amount,
      shippingAddress
    );

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items,
      coupon: coupon ? coupon._id : null,
      discount,
      shippingAddress,
      paymentMethod,
      shippingCost,
      subtotal: subtotal - discount.amount,
      totalAmount: subtotal - discount.amount + shippingCost
    });

    // Add order to request for notification handling
    req.order = order;
    next();
  } catch (error) {
    next(error);
  }
});

// Handle order creation notification
router.use('/', handleOrderCreation);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
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
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by order status
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *         description: Filter by payment status
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, paymentStatus } = req.query;

    const query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const orders = await Order.find(query)
      .sort('-createdAt')
      .populate('user', 'name email')
      .populate('coupon', 'code type value')
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Order.countDocuments(query);

    res.status(200).json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalResults: count
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/orders/user:
 *   get:
 *     summary: Get user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
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
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by order status
 *     responses:
 *       200:
 *         description: List of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/user', protect, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.user.id };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .sort('-createdAt')
      .populate('coupon', 'code type value')
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Order.countDocuments(query);

    res.status(200).json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalResults: count
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get single order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('coupon', 'code type value');

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
        success: false
      });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
router.put('/:id/status', protect, authorize('admin'), async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Add order to request for notification handling
    req.order = order;
    next();
  } catch (error) {
    next(error);
  }
});

// Handle order status change notification
router.use('/:id/status', handleOrderStatusChange);

/**
 * @swagger
 * /api/orders/{id}/payment:
 *   put:
 *     summary: Update order payment status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order payment status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Order already paid
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.put('/:id/payment', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = req.body.paymentStatus;
    order.stripeSessionId = req.body.stripeSessionId;
    await order.save();

    logger.info(`Order payment updated: ${order._id}`);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/orders/{id}/summary:
 *   get:
 *     summary: Get order summary
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 summary:
 *                   type: object
 *                   properties:
 *                     subtotal:
 *                       type: number
 *                     discount:
 *                       type: number
 *                     shipping:
 *                       type: number
 *                     total:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
router.get('/:id/summary', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const summary = await order.getSummary();
    res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
});

// Delete order (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.remove();
    logger.info(`Order deleted: ${order._id}`);
    res.status(200).json({ message: 'Order removed' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
