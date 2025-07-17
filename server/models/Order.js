const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  coupon: {
    type: Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  discount: {
    amount: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    }
  },
  shippingAddress: {
    fullName: {
      type: String,
      required: true
    },
    streetAddress: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  shipping: {
    type: Schema.Types.ObjectId,
    ref: 'Shipping'
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer']
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  stripeSessionId: {
    type: String
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

// Calculate subtotal, shipping cost, and total amount
orderSchema.pre('save', async function(next) {
  try {
    const order = this;
    
    // Calculate subtotal
    order.subtotal = order.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Calculate shipping cost
    if (order.shippingAddress) {
      const shipping = await mongoose.model('Shipping').calculateShippingCost(
        order.subtotal,
        order.shippingAddress
      );
      order.shippingCost = shipping;
    }

    // Calculate total amount
    let total = order.subtotal + order.shippingCost;

    // Apply discount if coupon is present
    if (order.coupon) {
      const coupon = await mongoose.model('Coupon').findById(order.coupon);
      if (coupon && coupon.isValid()) {
        const discount = coupon.calculateDiscount(order.subtotal, order.items);
        order.discount.amount = discount;
        order.discount.percentage = (discount / order.subtotal) * 100;
        total -= discount;
      }
    }

    order.totalAmount = total;
    next();
  } catch (error) {
    next(error);
  }
});

// Update product stock
orderSchema.post('save', async function(doc) {
  const order = doc;
  
  // Update product stock
  const products = await Promise.all(
    order.items.map(async item => {
      const product = await mongoose.model('Product').findById(item.product);
      product.stock -= item.quantity;
      await product.save();
      return product;
    })
  );

  // Update coupon usage if coupon was used
  if (order.coupon) {
    const coupon = await mongoose.model('Coupon').findById(order.coupon);
    if (coupon) {
      coupon.usedCount += 1;
      await coupon.save();
    }
  }
});

// Update order status
orderSchema.methods.updateStatus = async function(newStatus) {
  this.status = newStatus;
  this.updatedAt = Date.now();
  
  // Update related shipping status if applicable
  if (this.shipping && ['shipped', 'delivered', 'cancelled'].includes(newStatus)) {
    const shipping = await mongoose.model('Shipping').findById(this.shipping);
    if (shipping) {
      shipping.updateStatus(newStatus);
      await shipping.save();
    }
  }

  await this.save();
  return this;
};

// Get order summary
orderSchema.methods.getSummary = async function() {
  const order = this;
  const products = await Promise.all(
    order.items.map(async item => {
      const product = await mongoose.model('Product').findById(item.product);
      return {
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      };
    })
  );

  return {
    id: order._id,
    status: order.status,
    paymentStatus: order.paymentStatus,
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    discount: order.discount,
    totalAmount: order.totalAmount,
    products,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };
};

module.exports = mongoose.model('Order', orderSchema);
