const mongoose = require('mongoose');
const { Schema } = mongoose;

const shippingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  shippingAddress: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    streetAddress: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    postalCode: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },
  shippingMethod: {
    type: String,
    required: true,
    enum: ['standard', 'express', 'priority']
  },
  shippingCost: {
    type: Number,
    required: true,
    min: 0
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: [
      'pending',
      'processing',
      'shipped',
      'out_for_delivery',
      'delivered',
      'cancelled'
    ],
    default: 'pending'
  },
  carrier: {
    type: String,
    trim: true
  },
  expectedDeliveryDate: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
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
shippingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set expected delivery date based on shipping method
  if (!this.expectedDeliveryDate) {
    const days = {
      standard: 5,
      express: 2,
      priority: 1
    };
    this.expectedDeliveryDate = new Date(Date.now() + days[this.shippingMethod] * 24 * 60 * 60 * 1000);
  }
  
  next();
});

// Calculate shipping cost based on method
shippingSchema.methods.calculateShippingCost = function(orderTotal, shippingAddress) {
  const baseCosts = {
    standard: 5.00,
    express: 10.00,
    priority: 15.00
  };
  
  // Add surcharge for international shipping
  const isInternational = shippingAddress.country !== 'India';
  const surcharge = isInternational ? 15.00 : 0;
  
  return baseCosts[this.shippingMethod] + surcharge;
};

// Update shipping status
shippingSchema.methods.updateStatus = function(newStatus, trackingNumber = null) {
  this.status = newStatus;
  if (trackingNumber) this.trackingNumber = trackingNumber;
  if (newStatus === 'delivered') this.deliveredAt = new Date();
};

module.exports = mongoose.model('Shipping', shippingSchema);
