const { sendEmail } = require('../config/email');
const Notification = require('../models/Notification');
const logger = require('../config/logger').logger;
const config = require('../config/environment');
const User = require('../models/User');

// Notification types
const NOTIFICATION_TYPES = {
  ORDER: {
    CONFIRMATION: 'order_confirmation',
    SHIPPED: 'order_shipped',
    DELIVERED: 'order_delivered',
    CANCELLED: 'order_cancelled',
    REFUND: 'order_refund'
  },
  USER: {
    WELCOME: 'user_welcome',
    PASSWORD_RESET: 'user_password_reset',
    EMAIL_VERIFICATION: 'user_email_verification'
  },
  PROMOTION: {
    NEWSLETTER: 'promotion_newsletter',
    DISCOUNT: 'promotion_discount',
    NEW_PRODUCT: 'promotion_new_product'
  }
};

// Base notification class
class BaseNotification {
  constructor(user, type, data) {
    this.user = user;
    this.type = type;
    this.data = data;
    this.notification = null;
  }

  async createNotification() {
    try {
      this.notification = await Notification.create({
        user: this.user._id,
        type: this.type,
        title: this.getTitle(),
        message: this.getMessage(),
        relatedId: this.data.relatedId,
        relatedModel: this.data.relatedModel,
        metadata: this.data.metadata
      });
      return this.notification;
    } catch (error) {
      logger.error('Error creating notification:', error);
      throw error;
    }
  }

  async sendEmail() {
    if (!this.notification) {
      throw new Error('Notification must be created first');
    }

    try {
      await sendEmail({
        to: this.user.email,
        subject: this.getEmailSubject(),
        template: this.getEmailTemplate(),
        data: {
          user: this.user,
          ...this.data
        }
      });
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }

  async markAsSent() {
    if (!this.notification) {
      throw new Error('Notification must be created first');
    }

    try {
      this.notification.markAsSent();
      await this.notification.save();
    } catch (error) {
      logger.error('Error marking notification as sent:', error);
      throw error;
    }
  }

  getTitle() {
    throw new Error('getTitle must be implemented by subclass');
  }

  getMessage() {
    throw new Error('getMessage must be implemented by subclass');
  }

  getEmailSubject() {
    throw new Error('getEmailSubject must be implemented by subclass');
  }

  getEmailTemplate() {
    throw new Error('getEmailTemplate must be implemented by subclass');
  }
}

// Order notification class
class OrderNotification extends BaseNotification {
  constructor(user, type, order) {
    super(user, type, {
      relatedId: order._id,
      relatedModel: 'Order',
      metadata: {
        orderId: order._id,
        orderTotal: order.totalPrice,
        orderDate: order.createdAt
      }
    });
    this.order = order;
  }

  getTitle() {
    switch (this.type) {
      case NOTIFICATION_TYPES.ORDER.CONFIRMATION:
        return 'Order Confirmation';
      case NOTIFICATION_TYPES.ORDER.SHIPPED:
        return 'Order Shipped';
      case NOTIFICATION_TYPES.ORDER.DELIVERED:
        return 'Order Delivered';
      case NOTIFICATION_TYPES.ORDER.CANCELLED:
        return 'Order Cancelled';
      case NOTIFICATION_TYPES.ORDER.REFUND:
        return 'Order Refund';
      default:
        return 'Order Update';
    }
  }

  getMessage() {
    switch (this.type) {
      case NOTIFICATION_TYPES.ORDER.CONFIRMATION:
        return `Your order ${this.order._id} has been placed successfully`;
      case NOTIFICATION_TYPES.ORDER.SHIPPED:
        return `Your order ${this.order._id} has been shipped`;
      case NOTIFICATION_TYPES.ORDER.DELIVERED:
        return `Your order ${this.order._id} has been delivered`;
      case NOTIFICATION_TYPES.ORDER.CANCELLED:
        return `Your order ${this.order._id} has been cancelled`;
      case NOTIFICATION_TYPES.ORDER.REFUND:
        return `Refund processed for order ${this.order._id}`;
      default:
        return `Update for order ${this.order._id}`;
    }
  }

  getEmailSubject() {
    return this.getTitle();
  }

  getEmailTemplate() {
    return `${this.type.replace('_', '-')}`;
  }
}

// User notification class
class UserNotification extends BaseNotification {
  constructor(user, type, data = {}) {
    super(user, type, {
      relatedId: user._id,
      relatedModel: 'User',
      metadata: data
    });
    this.data = data;
  }

  getTitle() {
    switch (this.type) {
      case NOTIFICATION_TYPES.USER.WELCOME:
        return 'Welcome to our store';
      case NOTIFICATION_TYPES.USER.PASSWORD_RESET:
        return 'Password Reset Request';
      case NOTIFICATION_TYPES.USER.EMAIL_VERIFICATION:
        return 'Email Verification Required';
      default:
        return 'User Update';
    }
  }

  getMessage() {
    switch (this.type) {
      case NOTIFICATION_TYPES.USER.WELCOME:
        return `Welcome ${this.user.name}! Thanks for joining us`;
      case NOTIFICATION_TYPES.USER.PASSWORD_RESET:
        return 'Password reset requested';
      case NOTIFICATION_TYPES.USER.EMAIL_VERIFICATION:
        return 'Please verify your email address';
      default:
        return 'User account update';
    }
  }

  getEmailSubject() {
    return this.getTitle();
  }

  getEmailTemplate() {
    return `${this.type.replace('_', '-')}`;
  }
}

// Promotion notification class
class PromotionNotification extends BaseNotification {
  constructor(user, type, data) {
    super(user, type, {
      relatedId: data.promotionId,
      relatedModel: 'Promotion',
      metadata: data
    });
    this.data = data;
  }

  getTitle() {
    switch (this.type) {
      case NOTIFICATION_TYPES.PROMOTION.NEWSLETTER:
        return 'Newsletter Update';
      case NOTIFICATION_TYPES.PROMOTION.DISCOUNT:
        return 'Special Discount Available';
      case NOTIFICATION_TYPES.PROMOTION.NEW_PRODUCT:
        return 'New Product Alert';
      default:
        return 'Promotion Update';
    }
  }

  getMessage() {
    switch (this.type) {
      case NOTIFICATION_TYPES.PROMOTION.NEWSLETTER:
        return 'Check out our latest newsletter';
      case NOTIFICATION_TYPES.PROMOTION.DISCOUNT:
        return `Enjoy ${this.data.discountPercentage}% off!`;
      case NOTIFICATION_TYPES.PROMOTION.NEW_PRODUCT:
        return `New product: ${this.data.productName}`;
      default:
        return 'Promotion update available';
    }
  }

  getEmailSubject() {
    return this.getTitle();
  }

  getEmailTemplate() {
    return `${this.type.replace('_', '-')}`;
  }
}

// Factory function to create notifications
const createNotification = async (user, type, data) => {
  try {
    let notification;

    // Determine notification type based on prefix
    if (type.startsWith('order_')) {
      notification = new OrderNotification(user, type, data);
    } else if (type.startsWith('user_')) {
      notification = new UserNotification(user, type, data);
    } else if (type.startsWith('promotion_')) {
      notification = new PromotionNotification(user, type, data);
    } else {
      throw new Error('Invalid notification type');
    }

    // Create notification and send email
    await notification.createNotification();
    await notification.sendEmail();
    await notification.markAsSent();

    return notification.notification;
  } catch (error) {
    logger.error('Error creating notification:', error);
    throw error;
  }
};

// Export specific notification functions
module.exports = {
  // Order notifications
  sendOrderConfirmationEmail: async (order) => {
    const user = await User.findById(order.user);
    return createNotification(user, NOTIFICATION_TYPES.ORDER.CONFIRMATION, order);
  },

  sendOrderShippedEmail: async (order) => {
    const user = await User.findById(order.user);
    return createNotification(user, NOTIFICATION_TYPES.ORDER.SHIPPED, order);
  },

  sendOrderDeliveredEmail: async (order) => {
    const user = await User.findById(order.user);
    return createNotification(user, NOTIFICATION_TYPES.ORDER.DELIVERED, order);
  },

  sendOrderCancelledEmail: async (order) => {
    const user = await User.findById(order.user);
    return createNotification(user, NOTIFICATION_TYPES.ORDER.CANCELLED, order);
  },

  sendOrderRefundEmail: async (order) => {
    const user = await User.findById(order.user);
    return createNotification(user, NOTIFICATION_TYPES.ORDER.REFUND, order);
  },

  // User notifications
  sendWelcomeEmail: async (user) => {
    return createNotification(user, NOTIFICATION_TYPES.USER.WELCOME, {});
  },

  sendPasswordResetEmail: async (user, resetToken) => {
    return createNotification(user, NOTIFICATION_TYPES.USER.PASSWORD_RESET, {
      resetToken,
      resetUrl: `${config.clientUrl}/reset-password/${resetToken}`
    });
  },

  sendEmailVerificationEmail: async (user, verificationToken) => {
    return createNotification(user, NOTIFICATION_TYPES.USER.EMAIL_VERIFICATION, {
      verificationToken,
      verificationUrl: `${config.clientUrl}/verify-email/${verificationToken}`
    });
  },

  // Promotion notifications
  sendNewsletterEmail: async (user, newsletter) => {
    return createNotification(user, NOTIFICATION_TYPES.PROMOTION.NEWSLETTER, {
      newsletterId: newsletter._id,
      newsletterTitle: newsletter.title,
      newsletterContent: newsletter.content
    });
  },

  sendDiscountEmail: async (user, discount) => {
    return createNotification(user, NOTIFICATION_TYPES.PROMOTION.DISCOUNT, {
      promotionId: discount._id,
      discountPercentage: discount.percentage,
      discountCode: discount.code,
      expiryDate: discount.expiryDate
    });
  },

  sendNewProductEmail: async (user, product) => {
    return createNotification(user, NOTIFICATION_TYPES.PROMOTION.NEW_PRODUCT, {
      promotionId: product._id,
      productName: product.name,
      productPrice: product.price,
      productImage: product.image
    });
  }
};
