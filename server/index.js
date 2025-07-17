const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') }); // Load env vars

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const errorTrackingService = require('./services/errorTrackingService');
const performanceMonitor = require('./services/performanceMonitor');

// ======================
// INIT APP
// ======================
const app = express();

// ======================
// SECURITY MIDDLEWARE
// ======================
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', apiLimiter);

// ======================
// PERFORMANCE MONITORING
// ======================
performanceMonitor.startMonitoring();
app.use(performanceMonitor.requestMonitor);

// ======================
// BODY PARSERS
// ======================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ======================
// ROUTES
// ======================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// ======================
// ERROR HANDLING
// ======================
app.use((err, req, res, next) => {
  errorTrackingService.trackError(err, {
    route: req.path,
    method: req.method,
    userId: req.user?.id
  });

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    ...(res.sentry && { sentryId: res.sentry })
  });
});

// ======================
// DATABASE CONNECTION
// ======================
const connectDB = async () => {
  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    retryWrites: true,
    w: 'majority'
  };

  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(`⌛ Connecting to MongoDB (Attempt ${retries + 1}/${maxRetries})...`);
      await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
      console.log('✅ MongoDB connected successfully');
      return;
    } catch (err) {
      retries++;
      console.error(`❌ Connection failed: ${err.message}`);

      if (retries === maxRetries) {
        console.error('❌ Max retries reached. Could not connect to MongoDB.');
        console.log('🔍 Please check:\n1. Internet connection\n2. MongoDB Atlas cluster status\n3. IP whitelist in MongoDB Atlas\n4. Database user permissions');
        process.exit(1);
      }

      console.log('🔄 Retrying in 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

// ======================
// SERVER START
// ======================
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Access the API at: http://localhost:${PORT}`);
      errorTrackingService.initialize();
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();

// ======================
// PROCESS HANDLERS
// ======================
process.on('uncaughtException', (error) => {
  console.error('🛑 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('🛑 Unhandled Rejection:', reason);
});
