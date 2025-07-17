const { ApiError } = require('../utils/errors');
const errorTrackingService = require('../services/errorTrackingService');
const logger = require('../config/logger').logger;

const errorHandler = (err, req, res, next) => {
  try {
    // Track error with Sentry
    errorTrackingService.trackError(err, {
      url: req.url,
      method: req.method,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params,
      user: req.user ? {
        id: req.user._id,
        email: req.user.email
      } : null
    });

    // Determine error type
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = err.errors || [];
    let isOperational = err.isOperational;

    // Handle specific error types
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation failed';
    } else if (err.name === 'CastError') {
      statusCode = 400;
      message = 'Invalid ID format';
    } else if (err.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token expired';
    } else if (err.name === 'MongoError' && err.code === 11000) {
      statusCode = 409;
      message = 'Duplicate entry';
    }

    // Track specific error types
    if (err.name === 'ValidationError') {
      errorTrackingService.trackUserError(err, req.user?._id, {
        type: 'validation',
        fields: errors.map(e => e.path)
      });
    } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      errorTrackingService.trackAuthEvent('failure', {
        type: err.name === 'TokenExpiredError' ? 'token_expired' : 'invalid_token'
      });
    } else if (err.name === 'MongoError') {
      errorTrackingService.trackDatabaseError(err, 'operation', {
        operation: req.method + ' ' + req.url,
        collection: err.collectionName
      });
    }

    // Format error response
    const errorResponse = {
      success: false,
      error: {
        message: isOperational ? message : 'Internal Server Error',
        statusCode,
        ...(errors.length > 0 && { errors })
      }
    };

    // Log detailed error for debugging
    if (process.env.NODE_ENV === 'development') {
      errorResponse.error.stack = err.stack;
    }

    // Track response time
    const responseTime = performance.now() - req.startTime;
    errorTrackingService.trackPerformance('response_time', req.startTime, {
      url: req.url,
      method: req.method,
      statusCode,
      responseTime
    });

    res.status(statusCode).json(errorResponse);
  } catch (trackingError) {
    // If error tracking fails, log it but don't affect the response
    logger.error('Error tracking failed', {
      error: trackingError.message,
      originalError: err.message
    });
    
    // Send the original error response
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal Server Error'
      }
    });
  }
};

// Error validation middleware
const validateError = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const validationError = new ApiError(400, 'Validation failed', error.details);
      errorTrackingService.trackUserError(validationError, req.user?._id, {
        type: 'validation',
        fields: error.details.map(e => e.path)
      });
      throw validationError;
    }
    next();
  };
};

// Rate limit error handler
const handleRateLimitError = (req, res, next) => {
  const error = new ApiError(429, 'Too many requests');
  errorTrackingService.trackRateLimit(req.ip, req.url, req.rateLimitAttempts);
  next(error);
};

module.exports = {
  errorHandler,
  validateError,
  handleRateLimitError
};
