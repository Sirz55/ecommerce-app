const winston = require('winston');
const { format } = winston;
const { combine, timestamp, label, printf } = format;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    label({ label: 'ecommerce-api' }),
    timestamp(),
    logFormat
  ),
  transports: [
    // Console transport
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
    }),
    // File transport for error logs
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    // File transport for combined logs
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
});

// Add request/response logging middleware
const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`);
  next();
};

// Add error logging middleware
const errorLogger = (err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  next(err);
};

module.exports = {
  logger,
  requestLogger,
  errorLogger
};
