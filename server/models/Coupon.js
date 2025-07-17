const mongoose = require('mongoose');
const { Schema } = mongoose;

const couponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  type: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed']
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number,
    default: 0
  },
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    default: 1
  },
  usedCount: {
    type: Number,
    default: 0
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  isActive: {
    type: Boolean,
    default: true
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
couponSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.validFrom &&
    now <= this.validUntil &&
    this.usedCount < this.usageLimit
  );
};

// Calculate discount amount
couponSchema.methods.calculateDiscount = function(orderTotal, orderProducts) {
  if (!this.isValid()) return 0;

  // Check if coupon applies to specific products/categories
  if (this.products.length > 0) {
    const hasValidProduct = orderProducts.some(product => 
      this.products.includes(product._id)
    );
    if (!hasValidProduct) return 0;
  }

  if (this.categories.length > 0) {
    const hasValidCategory = orderProducts.some(product => 
      this.categories.includes(product.category)
    );
    if (!hasValidCategory) return 0;
  }

  // Check minimum order amount
  if (orderTotal < this.minOrderAmount) return 0;

  // Calculate discount
  let discount;
  if (this.type === 'percentage') {
    discount = (orderTotal * this.value) / 100;
  } else {
    discount = this.value;
  }

  // Apply max discount limit
  if (this.maxDiscount > 0) {
    discount = Math.min(discount, this.maxDiscount);
  }

  return Math.min(discount, orderTotal);
};

module.exports = mongoose.model('Coupon', couponSchema);
