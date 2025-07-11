const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        name: String,
        price: Number,
      },
    ],
    address: String,
    phone: String,
    paymentStatus: { type: String, default: "pending" }, 
    stripeSessionId: String,                                },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
