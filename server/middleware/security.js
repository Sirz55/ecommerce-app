const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const { performance } = require('perf_hooks');
const logger = require('../config/logger').logger;
const { rateLimitMiddleware, loginRateLimit, passwordResetRateLimit, ipBlocker } = require('./rateLimit');

// Security configuration
const securityConfig = {
  // Content Security Policy
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      reportUri: "/csp-violation-report"
    }
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
  },

  // Request body size limits
  bodySizeLimits: {
    json: '50mb',
    urlencoded: '50mb',
    multipart: '50mb'
  },

  // CORS configuration
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset']
  },

  // Security headers
  securityHeaders: {
    xssProtection: '1; mode=block',
    contentSecurityPolicy: true,
    referrerPolicy: 'strict-origin-when-cross-origin',
    frameguard: { action: 'deny' },
    hsts: { maxAge: 31536000 },
    dnsPrefetchControl: { allow: false },
    ieNoOpen: true,
    noSniff: true,
    hidePoweredBy: true,
    expectCt: {
      maxAge: 0,
      enforce: true,
      reportUri: 'https://example.com/csp-report'
    }
  }
};

const securityMiddleware = (app) => {
  // Set security headers with configuration
  app.use(helmet(securityConfig.securityHeaders));

  // Rate limiting middleware
  app.use(rateLimitMiddleware);
  
  // Login rate limiting
  app.use('/api/auth/login', loginRateLimit);
  
  // Password reset rate limiting
  app.use('/api/auth/reset-password', passwordResetRateLimit);

  // IP blocking
  app.use(ipBlocker);

  // Prevent XSS attacks
  app.use(xss());

  // Prevent NoSQL injection
  app.use(mongoSanitize());

  // Prevent HTTP Parameter Pollution
  app.use(hpp());

  // CORS configuration
  app.use(cors(securityConfig.cors));

  // Request body size limits
  app.use(express.json({
    limit: securityConfig.bodySizeLimits.json
  }));
  app.use(express.urlencoded({
    extended: true,
    limit: securityConfig.bodySizeLimits.urlencoded
  }));
  app.use(express.multipart({
    limit: securityConfig.bodySizeLimits.multipart
  }));

  // Add security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', securityConfig.securityHeaders.xssProtection);
    res.setHeader('Referrer-Policy', securityConfig.securityHeaders.referrerPolicy);
    res.setHeader('Strict-Transport-Security', `max-age=${securityConfig.securityHeaders.hsts.maxAge}; includeSubDomains`);
    
    // Log security headers
    logger.debug('Security headers added', {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': securityConfig.securityHeaders.xssProtection,
        'Referrer-Policy': securityConfig.securityHeaders.referrerPolicy,
        'Strict-Transport-Security': `max-age=${securityConfig.securityHeaders.hsts.maxAge}; includeSubDomains`
      }
    });

    next();
  });

  // Security monitoring middleware
  app.use((req, res, next) => {
    const start = performance.now();

    res.on('finish', () => {
      const duration = performance.now() - start;
      
      logger.info('Security monitoring', {
        ip: req.ip,
        method: req.method,
        url: req.url,
        responseTime: duration,
        statusCode: res.statusCode,
        headers: res.getHeaders()
      });
    });

    next();
  });

  // Request validation middleware
  app.use((req, res, next) => {
    // Validate request body
    if (req.body) {
      try {
        JSON.stringify(req.body);
      } catch (error) {
        logger.warn('Invalid request body', {
          ip: req.ip,
          method: req.method,
          url: req.url,
          error: error.message
        });
        return res.status(400).json({
          success: false,
          error: 'Invalid request body'
        });
      }
    }

    // Validate request headers
    if (req.headers) {
      const suspiciousHeaders = ['x-forwarded-for', 'x-client-ip', 'x-real-ip'];
      const hasSuspiciousHeaders = suspiciousHeaders.some(header => header in req.headers);
      
      if (hasSuspiciousHeaders) {
        logger.warn('Suspicious headers detected', {
          ip: req.ip,
          headers: suspiciousHeaders.filter(header => header in req.headers)
        });
      }
    }

    next();
  });

  // Security audit middleware
  app.use((req, res, next) => {
    const suspiciousPatterns = [
      /%0A|%0D|%00|%09|%0B|%0C|%0E|%0F|%10|%11|%12|%13|%14|%15|%16|%17|%18|%19|%1A|%1B|%1C|%1D|%1E|%1F/g,
      /script|iframe|object|embed|alert|prompt|eval|exec|cmd|system|shell|powershell/gi,
      /select.*from|update.*set|delete.*from|insert.*into|drop.*table|create.*table|alter.*table|grant.*privilege/gi,
      /union.*select|order.*by.*rand|sleep\(.*\)|benchmark\(.*\)/gi
    ];

    const hasSuspiciousContent = suspiciousPatterns.some(pattern => {
      const bodyStr = JSON.stringify(req.body || {});
      const queryStr = JSON.stringify(req.query || {});
      const paramsStr = JSON.stringify(req.params || {});
      return pattern.test(bodyStr) || pattern.test(queryStr) || pattern.test(paramsStr);
    });

    if (hasSuspiciousContent) {
      logger.warn('Security violation detected', {
        ip: req.ip,
        method: req.method,
        url: req.url,
        patterns: suspiciousPatterns.filter(pattern => pattern.test(JSON.stringify(req.body || {})) || 
                                               pattern.test(JSON.stringify(req.query || {})) || 
                                               pattern.test(JSON.stringify(req.params || {})))
      });
      
      // Block the request
      return res.status(403).json({
        success: false,
        error: 'Security violation detected'
      });
    }

    next();
  });
};

module.exports = {
  securityMiddleware,
  securityConfig
};
