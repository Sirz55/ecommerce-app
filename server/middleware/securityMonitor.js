const { securityMonitor, SECURITY_EVENTS } = require('../services/securityMonitor');
const { performanceMonitor } = require('../services/performanceMonitor');
const { rateLimitMiddleware } = require('./rateLimit');

const securityMonitorMiddleware = {
  // Initialize security monitoring
  initialize: (app) => {
    // Add security monitoring middleware
    app.use((req, res, next) => {
      const startTime = performance.now();
      
      // Track API access
      securityMonitor.trackAPIAccess(req, {
        user: req.user ? {
          id: req.user._id,
          email: req.user.email,
          role: req.user.role
        } : null
      });

      // Track performance
      performanceMonitor.trackPerformance('api_access', startTime, {
        ip: req.ip,
        method: req.method,
        url: req.url
      });

      next();
    });

    // Add security headers
    app.use((req, res, next) => {
      // Track security headers
      securityMonitor.trackEvent(SECURITY_EVENTS.SECURITY_HEADERS, {
        headers: Object.keys(res.getHeaders())
      });

      next();
    });

    // Add CSRF protection
    app.use((req, res, next) => {
      // Track CSRF protection
      securityMonitor.trackCSRF(req, true);

      next();
    });

    // Add XSS protection
    app.use((req, res, next) => {
      // Track XSS protection
      securityMonitor.trackXSS(req, true);

      next();
    });

    // Add SQL injection protection
    app.use((req, res, next) => {
      // Track SQL injection protection
      securityMonitor.trackSQLInjection(req, true);

      next();
    });

    // Add rate limiting
    app.use((req, res, next) => {
      // Track rate limiting
      securityMonitor.trackRateLimit(req.ip, req.url, 0);

      next();
    });

    // Add auth token tracking
    app.use((req, res, next) => {
      // Track auth token
      securityMonitor.trackAuthToken(req, true);

      next();
    });

    // Add 2FA tracking
    app.use((req, res, next) => {
      // Track 2FA
      if (req.user && req.user.is2FAEnabled) {
        securityMonitor.track2FA(req, true);
      }

      next();
    });

    // Add file operation tracking
    app.use('/api/files/*', (req, res, next) => {
      // Track file operations
      securityMonitor.trackFileOperation(req.method.toLowerCase(), {
        filename: req.params.filename,
        size: req.headers['content-length']
      });

      next();
    });

    // Add admin action tracking
    app.use('/api/admin/*', (req, res, next) => {
      // Track admin actions
      securityMonitor.trackAdminAction(req, req.route.path);

      next();
    });

    // Add data access tracking
    app.use('/api/*', (req, res, next) => {
      // Track data access
      securityMonitor.trackDataAccess(req);

      next();
    });

    // Add data modification tracking
    app.use('/api/*', (req, res, next) => {
      if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
        // Track data modification
        securityMonitor.trackDataModification(req);
      }

      next();
    });

    logger.info('Security monitoring initialized');
  },

  // Track authentication
  trackAuth: (req, res, next) => {
    const startTime = performance.now();
    
    // Track authentication attempt
    securityMonitor.trackAuthEvent('attempt', {
      ip: req.ip,
      method: req.method,
      url: req.url
    });

    next();
  },

  // Track login success
  trackLoginSuccess: (req, res, next) => {
    const startTime = performance.now();
    
    // Track login success
    securityMonitor.trackAuthEvent('success', {
      ip: req.ip,
      method: req.method,
      url: req.url,
      user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role
      }
    });

    next();
  },

  // Track login failure
  trackLoginFailure: (req, res, next) => {
    const startTime = performance.now();
    
    // Track login failure
    securityMonitor.trackAuthEvent('failure', {
      ip: req.ip,
      method: req.method,
      url: req.url,
      error: res.locals.error
    });

    next();
  },

  // Track 2FA
  track2FA: (req, res, next) => {
    const startTime = performance.now();
    
    // Track 2FA attempt
    securityMonitor.track2FA(req, true);

    next();
  },

  // Track password reset
  trackPasswordReset: (req, res, next) => {
    const startTime = performance.now();
    
    // Track password reset
    securityMonitor.trackPasswordReset(req, true);

    next();
  },

  // Track file upload
  trackFileUpload: (req, res, next) => {
    const startTime = performance.now();
    
    // Track file upload
    securityMonitor.trackFileOperation('upload', {
      filename: req.file?.filename,
      size: req.file?.size,
      mimetype: req.file?.mimetype
    });

    next();
  },

  // Track file download
  trackFileDownload: (req, res, next) => {
    const startTime = performance.now();
    
    // Track file download
    securityMonitor.trackFileOperation('download', {
      filename: req.params.filename
    });

    next();
  },

  // Track admin actions
  trackAdminAction: (req, res, next) => {
    const startTime = performance.now();
    
    // Track admin action
    securityMonitor.trackAdminAction(req, req.route.path, {
      action: req.body?.action,
      data: req.body?.data
    });

    next();
  },

  // Track data access
  trackDataAccess: (req, res, next) => {
    const startTime = performance.now();
    
    // Track data access
    securityMonitor.trackDataAccess(req);

    next();
  },

  // Track data modification
  trackDataModification: (req, res, next) => {
    const startTime = performance.now();
    
    // Track data modification
    securityMonitor.trackDataModification(req);

    next();
  },

  // Get security statistics
  getStatistics: () => securityMonitor.getStatistics()
};

module.exports = securityMonitorMiddleware;
