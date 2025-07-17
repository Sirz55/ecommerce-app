const { sendOrderConfirmationEmail, sendOrderShippedEmail, sendOrderDeliveredEmail } = require('../services/notificationService');
const logger = require('../config/logger').logger;

// Middleware to handle order status changes
const handleOrderStatusChange = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = req.order;

    // Send appropriate notification based on status
    switch (status) {
      case 'pending':
        await sendOrderConfirmationEmail(order);
        break;
      case 'shipped':
        await sendOrderShippedEmail(order);
        break;
      case 'delivered':
        await sendOrderDeliveredEmail(order);
        break;
      default:
        break;
    }

    next();
  } catch (error) {
    logger.error('Error handling order status change notification:', error);
    next(error);
  }
};

// Middleware to handle order creation
const handleOrderCreation = async (req, res, next) => {
  try {
    const order = req.order;
    await sendOrderConfirmationEmail(order);
    next();
  } catch (error) {
    logger.error('Error handling order creation notification:', error);
    next(error);
  }
};

// Middleware to handle user registration
const handleUserRegistration = async (req, res, next) => {
  try {
    const user = req.user;
    await sendWelcomeEmail(user);
    next();
  } catch (error) {
    logger.error('Error handling user registration notification:', error);
    next(error);
  }
};

module.exports = {
  handleOrderStatusChange,
  handleOrderCreation,
  handleUserRegistration
};
