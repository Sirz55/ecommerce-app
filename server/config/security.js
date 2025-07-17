const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const helmetCsp = require('helmet-csp');
const crypto = require('crypto');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { doubleCsrf } = require('csrf-csrf');

// In-memory rate limiter configuration
const limiter = {
  consume: async (key, points) => {
    return { remainingPoints: 100 - points, points: points, msBeforeNext: 0 };
  }
};

// Rate limiters
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.'
  }
});

const passwordResetLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: 'Too many password reset requests. Please try again tomorrow.'
  }
});

// Security headers
const securityHeaders = helmet();

// Content Security Policy
const csp = helmetCsp({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https:"],
    fontSrc: ["'self'", "data:"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'", "data:"],
    frameSrc: ["'self'"]
  }
});

// CSRF Protection
const { generateToken } = require('./security');
const { doubleCsrfProtection } = doubleCsrf({
  getSecret: () => generateToken(32),
  cookieName: '__Host-psifi.x-csrf-token',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    httpOnly: true,
    path: '/'
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getTokenFromRequest: (req) => req.headers['x-csrf-token']
});

// Other security middleware
const securityMiddleware = {
  ...helmet(),
  hsts: helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }),
  referrerPolicy: helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }),
  frameguard: helmet.frameguard({ action: 'deny' }),
  dnsPrefetchControl: helmet.dnsPrefetchControl({ allow: false }),
  noSniff: helmet.noSniff(),
  ieNoOpen: helmet.ieNoOpen(),
  permittedCrossDomainPolicies: helmet.permittedCrossDomainPolicies()
};

module.exports = {
  limiter,
  apiLimiter,
  loginLimiter,
  passwordResetLimiter,
  csp,
  securityHeaders: securityMiddleware,
  csrfProtection: doubleCsrfProtection,
  generateToken: (length = 32) => crypto.randomBytes(length).toString('hex'),
  hashPassword: async (password) => bcryptjs.hash(password, 10),
  comparePassword: async (password, hash) => bcryptjs.compare(password, hash),
  generateJwt: (payload, expiresIn = '24h') => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn }),
  verifyJwt: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
};