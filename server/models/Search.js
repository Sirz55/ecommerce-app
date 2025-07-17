const mongoose = require('mongoose');
const { Schema } = mongoose;

const searchSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  query: {
    type: String,
    required: true,
    trim: true
  },
  resultsCount: {
    type: Number,
    default: 0
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for efficient searching
searchSchema.index({ query: 'text' });
searchSchema.index({ location: '2dsphere' });

// Middleware to update results count
searchSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Get search results count
    const products = await mongoose.model('Product').find({
      $text: { $search: this.query }
    });
    this.resultsCount = products.length;
  }
  next();
});

module.exports = mongoose.model('Search', searchSchema);
