const mongoose = require('mongoose');
const { Schema } = mongoose;

const auditLogSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'CREATE',
      'UPDATE',
      'DELETE',
      'LOGIN',
      'LOGOUT',
      'ORDER',
      'PAYMENT',
      'REVIEW'
    ]
  },
  resource: {
    type: String,
    required: true,
    enum: [
      'PRODUCT',
      'ORDER',
      'USER',
      'CART',
      'REVIEW',
      'WISHLIST',
      'CATEGORY'
    ]
  },
  resourceId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  data: {
    type: Schema.Types.Mixed,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
auditLogSchema.index({ user: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, resource: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
