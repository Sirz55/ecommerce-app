const os = require('os');
const { performance } = require('perf_hooks');
const logger = require('../config/logger').logger;

// Performance monitoring
const performanceMonitor = (req, res, next) => {
  const start = performance.now();
  
  res.on('finish', () => {
    const duration = performance.now() - start;
    logger.info(`Performance: ${req.method} ${req.originalUrl} - ${duration.toFixed(2)}ms`);

    // Log performance metrics if response time is high
    if (duration > 1000) {
      logger.warn(`Slow request: ${req.method} ${req.originalUrl} - ${duration.toFixed(2)}ms`);
    }
  });

  next();
};

// Memory monitoring
const memoryMonitor = () => {
  const memoryUsage = process.memoryUsage();
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const memoryPercentage = ((totalMemory - freeMemory) / totalMemory) * 100;

  logger.info(`Memory Usage: ${memoryPercentage.toFixed(2)}%`);
  logger.info(`Heap Used: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`);

  // Check for high memory usage
  if (memoryPercentage > 80) {
    logger.warn('High memory usage detected');
  }
};

// Health check endpoint
const healthCheck = (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  const loadAvg = os.loadavg();

  res.json({
    status: 'healthy',
    uptime,
    memoryUsage,
    loadAvg,
    timestamp: new Date().toISOString()
  });
};

// Error tracking
const trackError = (error) => {
  logger.error('Error:', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  performanceMonitor,
  memoryMonitor,
  healthCheck,
  trackError
};
