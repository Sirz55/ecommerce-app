const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Security and error handling middleware
const securityMiddleware = require('./middleware/security');
const errorHandler = require('./middleware/errorHandler');

// Apply security middleware
securityMiddleware(app);

// Body parser
app.use(express.json());

// Error handler middleware
app.use(errorHandler);
const productRoutes = require('./routes/productRoutes');
app.use('/api', productRoutes);
const orderRoutes = require('./routes/orderRoutes');
app.use('/api', orderRoutes);
const stripeRoutes = require('./routes/stripe');
app.use('/api/stripe', stripeRoutes);
const adminRoutes = require('./routes/adminRoutes');
app.use('/api', adminRoutes);




// 🔗 Connect Auth Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("✅ API is working!");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

const PORT = process.env.PORT || 5000;

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: {
      message: 'Internal Server Error',
      statusCode: 500,
    },
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
