const rateLimit = require('express-rate-limit');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const { performance } = require('perf_hooks');
const logger = require('../config/logger').logger;

// Create rate limiter instances
const apiLimiter = new RateLimiterMemory({
  points: 100, // Number of points
  duration: 15 * 60, // 15 minutes
  blockDuration: 60 * 60 // 1 hour
});

const loginLimiter = new RateLimiterMemory({
  points: 5, // Number of attempts
  duration: 15 * 60, // 15 minutes
  blockDuration: 60 * 60 // 1 hour
});

const passwordResetLimiter = new RateLimiterMemory({
  points: 3, // Number of attempts
  duration: 15 * 60, // 15 minutes
  blockDuration: 60 * 60 // 1 hour
});

// Rate limiting middleware
const rateLimitMiddleware = async (req, res, next) => {
  try {
    const start = performance.now();
    const { ip } = req;
    
    // Check API rate limit
    const apiResult = await apiLimiter.consume(ip);
    
    // Log rate limit metrics
    logger.info('Rate limit check', {
      ip,
      points: apiResult.points,
      remainingPoints: apiResult.remainingPoints,
      consumedPoints: apiResult.consumedPoints,
      duration: performance.now() - start
    });

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', apiResult.points);
    res.setHeader('X-RateLimit-Remaining', apiResult.remainingPoints);
    res.setHeader('X-RateLimit-Reset', apiResult.msBeforeNext / 1000);

    next();
  } catch (error) {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      error: error.message
    });

    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
      retryAfter: error.msBeforeNext / 1000
    });
  }
};

// Login rate limiting middleware
const loginRateLimit = async (req, res, next) => {
  try {
    const { ip, body: { email } } = req;
    const key = `login:${ip}:${email}`;
    
    const result = await loginLimiter.consume(key);
    
    logger.info('Login rate limit check', {
      ip,
      email,
      points: result.points,
      remainingPoints: result.remainingPoints
    });

    next();
  } catch (error) {
    logger.warn('Login rate limit exceeded', {
      ip: req.ip,
      email: req.body?.email,
      error: error.message
    });

    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again later.',
      retryAfter: error.msBeforeNext / 1000
    });
  }
};

// Password reset rate limiting middleware
const passwordResetRateLimit = async (req, res, next) => {
  try {
    const { ip, body: { email } } = req;
    const key = `password-reset:${ip}:${email}`;
    
    const result = await passwordResetLimiter.consume(key);
    
    logger.info('Password reset rate limit check', {
      ip,
      email,
      points: result.points,
      remainingPoints: result.remainingPoints
    });

    next();
  } catch (error) {
    logger.warn('Password reset rate limit exceeded', {
      ip: req.ip,
      email: req.body?.email,
      error: error.message
    });

    res.status(429).json({
      success: false,
      message: 'Too many password reset attempts. Please try again later.',
      retryAfter: error.msBeforeNext / 1000
    });
  }
};

// IP blocking middleware
const ipBlockList = new Set();

const blockIP = (ip) => {
  ipBlockList.add(ip);
  logger.warn(`IP ${ip} has been blocked`);
};

const unblockIP = (ip) => {
  ipBlockList.delete(ip);
  logger.info(`IP ${ip} has been unblocked`);
};

const isIPBlocked = (ip) => ipBlockList.has(ip);

const ipBlocker = (req, res, next) => {
  const { ip } = req;

  if (isIPBlocked(ip)) {
    logger.warn(`Blocked request from IP: ${ip}`);
    res.status(403).json({
      success: false,
      message: 'Access denied. Your IP has been blocked.'
    });
    return;
  }

  next();
};

module.exports = {
  rateLimitMiddleware,
  loginRateLimit,
  passwordResetRateLimit,
  ipBlocker,
  blockIP,
  unblockIP,
  isIPBlocked
};
