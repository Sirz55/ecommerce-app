const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'order_confirmation',
      'order_shipped',
      'order_delivered',
      'order_cancelled',
      'order_refund',
      'user_welcome',
      'user_password_reset',
      'user_email_verification',
      'promotion_newsletter',
      'promotion_discount',
      'promotion_new_product',
      'system'
    ]
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  relatedId: {
    type: Schema.Types.ObjectId,
    refPath: 'relatedModel'
  },
  relatedModel: {
    type: String,
    enum: ['Order', 'User', 'Promotion', 'Product', 'Coupon', 'Review']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isEmailSent: {
    type: Boolean,
    default: false
  },
  isPushSent: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: Schema.Types.Mixed
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  expiresAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update updatedAt field
notificationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set expiresAt if not set
  if (!this.expiresAt) {
    // Notifications expire after 7 days by default
    this.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
  
  next();
});

// Create indexes for efficient querying
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ relatedId: 1, relatedModel: 1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ user: 1, type: 1, isRead: 1 });
notificationSchema.index({ expiresAt: 1 });

// Static methods for querying notifications
notificationSchema.statics = {
  async getUnreadCount(userId) {
    return this.countDocuments({
      user: userId,
      isRead: false
    });
  },

  async markAllAsRead(userId) {
    return this.updateMany(
      { user: userId, isRead: false },
      { $set: { isRead: true, updatedAt: Date.now() } }
    );
  },

  async getRecentNotifications(userId, limit = 10) {
    return this.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user', 'name email')
      .populate('relatedId', 'name title');
  },

  async getNotificationsByType(userId, type, limit = 20) {
    return this.find({
      user: userId,
      type: type
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user', 'name email')
      .populate('relatedId', 'name title');
  },

  async cleanupExpiredNotifications() {
    return this.deleteMany({
      expiresAt: { $lt: new Date() }
    });
  }
};

// Methods for notification handling
notificationSchema.methods = {
  markAsRead() {
    this.isRead = true;
    this.updatedAt = Date.now();
  },

  markAsSent() {
    this.isEmailSent = true;
    this.updatedAt = Date.now();
  },

  markPushSent() {
    this.isPushSent = true;
    this.updatedAt = Date.now();
  },

  toJSON() {
    const obj = this.toObject();
    delete obj.__v;
    return obj;
  }
};

// Add virtuals for better data representation
notificationSchema.virtual('relatedData', {
  ref: 'relatedModel',
  localField: 'relatedId',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Notification', notificationSchema);
