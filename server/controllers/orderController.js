const Order = require('../models/Order');

exports.placeOrder = async (req, res) => {
  try {
    const { items, address, phone } = req.body;

    const order = new Order({ items, address, phone });
    await order.save();

    res.status(201).json({ message: "✅ Order placed!", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
