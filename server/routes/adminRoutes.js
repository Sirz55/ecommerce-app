const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Admin login (mock)
router.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    res.json({ token: "mock-admin-token" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Get all orders
router.get("/admin/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Error fetching orders" });
  }
});

module.exports = router;
