const winston = require('winston');
const { format } = winston;
const { combine, timestamp, json, prettyPrint, colorize } = format;
const config = require('./environment');

// Create Winston logger configuration
const logger = winston.createLogger({
  level: config.logLevel,
  format: combine(
    timestamp(),
    json()
  ),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp(),
        prettyPrint()
      )
    }),
    // File transport
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Add request logging middleware
const requestLogger = (req, res, next) => {
  const { method, url, params, query, body } = req;
  const start = process.hrtime();

  res.on('finish', () => {
    const duration = process.hrtime(start);
    const responseTime = duration[0] * 1000 + duration[1] / 1000000;
    
    logger.info('Request', {
      method,
      url,
      params,
      query,
      body,
      responseTime,
      status: res.statusCode
    });
  });

  next();
};

// Add error logging middleware
const errorLogger = (err, req, res, next) => {
  logger.error('Error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    params: req.params,
    query: req.query,
    body: req.body
  });

  next(err);
};

// Add performance monitoring
const performanceMonitor = (req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const duration = process.hrtime(start);
    const responseTime = duration[0] * 1000 + duration[1] / 1000000;
    
    // Log slow requests
    if (responseTime > 1000) {
      logger.warn('Slow request', {
        method: req.method,
        url: req.url,
        responseTime
      });
    }
  });

  next();
};

// Add memory usage monitoring
setInterval(() => {
  const memoryUsage = process.memoryUsage();
  logger.info('Memory Usage', {
    rss: memoryUsage.rss,
    heapTotal: memoryUsage.heapTotal,
    heapUsed: memoryUsage.heapUsed,
    external: memoryUsage.external
  });
}, 60000); // Every minute

// Add CPU usage monitoring
setInterval(() => {
  const cpuUsage = process.cpuUsage();
  logger.info('CPU Usage', {
    user: cpuUsage.user,
    system: cpuUsage.system
  });
}, 60000); // Every minute

module.exports = {
  logger,
  requestLogger,
  errorLogger,
  performanceMonitor
};
