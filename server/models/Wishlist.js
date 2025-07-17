const mongoose = require('mongoose');
const { Schema } = mongoose;

const wishlistSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
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
wishlistSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware to prevent duplicate products
wishlistSchema.pre('save', async function(next) {
  if (this.isModified('products')) {
    const productIds = this.products.map(p => p.product.toString());
    const uniqueIds = [...new Set(productIds)];
    
    if (uniqueIds.length !== productIds.length) {
      const duplicates = productIds.filter(id => uniqueIds.indexOf(id) === -1);
      this.products = this.products.filter(p => !duplicates.includes(p.product.toString()));
    }
  }
  next();
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
