const { performance } = require('perf_hooks');
const logger = require('../config/logger').logger;
const errorTrackingService = require('./errorTrackingService');
const performanceMonitor = require('./performanceMonitor');
const { rateLimitMiddleware } = require('../middleware/rateLimit');
const { securityHeaders } = require('../middleware/security');

// Security event types
const SECURITY_EVENTS = {
  LOGIN_ATTEMPT: 'login_attempt',
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILURE: 'login_failure',
  RATE_LIMIT: 'rate_limit',
  IP_BLOCK: 'ip_block',
  IP_UNBLOCK: 'ip_unblock',
  CSRF_ATTEMPT: 'csrf_attempt',
  XSS_ATTEMPT: 'xss_attempt',
  SQL_INJECTION: 'sql_injection',
  AUTH_TOKEN: 'auth_token',
  PASSWORD_RESET: 'password_reset',
  '2FA_ATTEMPT': '2fa_attempt',
  '2FA_SUCCESS': '2fa_success',
  '2FA_FAILURE': '2fa_failure',
  FILE_UPLOAD: 'file_upload',
  FILE_DOWNLOAD: 'file_download',
  API_ACCESS: 'api_access',
  ADMIN_ACTION: 'admin_action',
  DATA_ACCESS: 'data_access',
  DATA_MODIFICATION: 'data_modification'
};

const securityMonitor = {
  // Track security events
  trackEvent: (type, context = {}) => {
    const startTime = performance.now();
    
    // Validate event type
    if (!SECURITY_EVENTS[type]) {
      errorTrackingService.trackError(new Error(`Invalid security event type: ${type}`), {
        type,
        context
      });
      return;
    }

    // Track event
    errorTrackingService.trackSecurityEvent(type, {
      ...context,
      timestamp: new Date().toISOString(),
      duration: performance.now() - startTime
    });

    // Track performance
    performanceMonitor.trackPerformance('security_event', startTime, {
      type,
      ...context
    });
  },

  // Track authentication events
  trackAuthEvent: (type, context = {}) => {
    const startTime = performance.now();
    
    // Track authentication event
    errorTrackingService.trackAuthEvent(type, {
      ...context,
      timestamp: new Date().toISOString(),
      duration: performance.now() - startTime
    });

    // Track performance
    performanceMonitor.trackPerformance('auth_event', startTime, {
      type,
      ...context
    });
  },

  // Track rate limiting
  trackRateLimit: (ip, endpoint, attempts) => {
    const startTime = performance.now();
    
    // Track rate limit event
    errorTrackingService.trackRateLimit(ip, endpoint, attempts);

    // Track performance
    performanceMonitor.trackPerformance('rate_limit', startTime, {
      ip,
      endpoint,
      attempts
    });
  },

  // Track IP blocking
  trackIPBlock: (ip, reason) => {
    const startTime = performance.now();
    
    // Track IP block event
    errorTrackingService.trackSecurityEvent(SECURITY_EVENTS.IP_BLOCK, {
      ip,
      reason,
      timestamp: new Date().toISOString(),
      duration: performance.now() - startTime
    });

    // Track performance
    performanceMonitor.trackPerformance('ip_block', startTime, {
      ip,
      reason
    });
  },

  // Track IP unblock
  trackIPUnblock: (ip) => {
    const startTime = performance.now();
    
    // Track IP unblock event
    errorTrackingService.trackSecurityEvent(SECURITY_EVENTS.IP_UNBLOCK, {
      ip,
      timestamp: new Date().toISOString(),
      duration: performance.now() - startTime
    });

    // Track performance
    performanceMonitor.trackPerformance('ip_unblock', startTime, {
      ip
    });
  },

  // Track CSRF attempts
  trackCSRF: (req, success) => {
    const startTime = performance.now();
    
    // Track CSRF event
    errorTrackingService.trackSecurityEvent(
      success ? SECURITY_EVENTS.CSRF_ATTEMPT : SECURITY_EVENTS.CSRF_ATTEMPT,
      {
        ip: req.ip,
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString(),
        duration: performance.now() - startTime
      }
    );

    // Track performance
    performanceMonitor.trackPerformance('csrf_event', startTime, {
      ip: req.ip,
      success
    });
  },

  // Track XSS attempts
  trackXSS: (req, success) => {
    const startTime = performance.now();
    
    // Track XSS event
    errorTrackingService.trackSecurityEvent(
      success ? SECURITY_EVENTS.XSS_ATTEMPT : SECURITY_EVENTS.XSS_ATTEMPT,
      {
        ip: req.ip,
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString(),
        duration: performance.now() - startTime
      }
    );

    // Track performance
    performanceMonitor.trackPerformance('xss_event', startTime, {
      ip: req.ip,
      success
    });
  },

  // Track SQL injection attempts
  trackSQLInjection: (req, success) => {
    const startTime = performance.now();
    
    // Track SQL injection event
    errorTrackingService.trackSecurityEvent(
      success ? SECURITY_EVENTS.SQL_INJECTION : SECURITY_EVENTS.SQL_INJECTION,
      {
        ip: req.ip,
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString(),
        duration: performance.now() - startTime
      }
    );

    // Track performance
    performanceMonitor.trackPerformance('sql_injection', startTime, {
      ip: req.ip,
      success
    });
  },

  // Track authentication token events
  trackAuthToken: (req, success) => {
    const startTime = performance.now();
    
    // Track auth token event
    errorTrackingService.trackSecurityEvent(
      success ? SECURITY_EVENTS.AUTH_TOKEN : SECURITY_EVENTS.AUTH_TOKEN,
      {
        ip: req.ip,
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString(),
        duration: performance.now() - startTime
      }
    );

    // Track performance
    performanceMonitor.trackPerformance('auth_token', startTime, {
      ip: req.ip,
      success
    });
  },

  // Track password reset events
  trackPasswordReset: (req, success) => {
    const startTime = performance.now();
    
    // Track password reset event
    errorTrackingService.trackSecurityEvent(
      success ? SECURITY_EVENTS.PASSWORD_RESET : SECURITY_EVENTS.PASSWORD_RESET,
      {
        ip: req.ip,
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString(),
        duration: performance.now() - startTime
      }
    );

    // Track performance
    performanceMonitor.trackPerformance('password_reset', startTime, {
      ip: req.ip,
      success
    });
  },

  // Track 2FA events
  track2FA: (req, success) => {
    const startTime = performance.now();
    
    // Track 2FA event
    errorTrackingService.trackSecurityEvent(
      success ? SECURITY_EVENTS._2FA_SUCCESS : SECURITY_EVENTS._2FA_FAILURE,
      {
        ip: req.ip,
        method: req.method,
        url: req.url,
        timestamp: new Date().toISOString(),
        duration: performance.now() - startTime
      }
    );

    // Track performance
    performanceMonitor.trackPerformance('2fa_event', startTime, {
      ip: req.ip,
      success
    });
  },

  // Track file operations
  trackFileOperation: (type, context = {}) => {
    const startTime = performance.now();
    
    // Track file operation
    errorTrackingService.trackSecurityEvent(
      type === 'upload' ? SECURITY_EVENTS.FILE_UPLOAD : SECURITY_EVENTS.FILE_DOWNLOAD,
      {
        ...context,
        timestamp: new Date().toISOString(),
        duration: performance.now() - startTime
      }
    );

    // Track performance
    performanceMonitor.trackPerformance('file_operation', startTime, {
      type,
      ...context
    });
  },

  // Track API access
  trackAPIAccess: (req, context = {}) => {
    const startTime = performance.now();
    
    // Track API access
    errorTrackingService.trackSecurityEvent(SECURITY_EVENTS.API_ACCESS, {
      ...context,
      ip: req.ip,
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString(),
      duration: performance.now() - startTime
    });

    // Track performance
    performanceMonitor.trackPerformance('api_access', startTime, {
      ip: req.ip,
      method: req.method,
      url: req.url,
      ...context
    });
  },

  // Track admin actions
  trackAdminAction: (req, action, context = {}) => {
    const startTime = performance.now();
    
    // Track admin action
    errorTrackingService.trackSecurityEvent(SECURITY_EVENTS.ADMIN_ACTION, {
      ...context,
      ip: req.ip,
      method: req.method,
      url: req.url,
      action,
      timestamp: new Date().toISOString(),
      duration: performance.now() - startTime
    });

    // Track performance
    performanceMonitor.trackPerformance('admin_action', startTime, {
      ip: req.ip,
      action,
      ...context
    });
  },

  // Track data access
  trackDataAccess: (req, context = {}) => {
    const startTime = performance.now();
    
    // Track data access
    errorTrackingService.trackSecurityEvent(SECURITY_EVENTS.DATA_ACCESS, {
      ...context,
      ip: req.ip,
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString(),
      duration: performance.now() - startTime
    });

    // Track performance
    performanceMonitor.trackPerformance('data_access', startTime, {
      ip: req.ip,
      ...context
    });
  },

  // Track data modification
  trackDataModification: (req, context = {}) => {
    const startTime = performance.now();
    
    // Track data modification
    errorTrackingService.trackSecurityEvent(SECURITY_EVENTS.DATA_MODIFICATION, {
      ...context,
      ip: req.ip,
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString(),
      duration: performance.now() - startTime
    });

    // Track performance
    performanceMonitor.trackPerformance('data_modification', startTime, {
      ip: req.ip,
      ...context
    });
  },

  // Get security statistics
  getStatistics: () => {
    return {
      loginAttempts: performanceMonitor.requestCount.get({
        method: 'POST',
        route: '/api/auth/login'
      }),
      failedLogins: performanceMonitor.requestCount.get({
        method: 'POST',
        route: '/api/auth/login',
        status_code: 401
      }),
      rateLimitEvents: performanceMonitor.requestCount.get({
        method: 'GET',
        route: '/api/health'
      }),
      ipBlocks: performanceMonitor.requestCount.get({
        method: 'POST',
        route: '/api/security/ip-block'
      }),
      csrfAttempts: performanceMonitor.requestCount.get({
        method: '*',
        route: '/api/*',
        status_code: 403
      }),
      xssAttempts: performanceMonitor.requestCount.get({
        method: '*',
        route: '/api/*',
        status_code: 400
      }),
      sqlInjectionAttempts: performanceMonitor.requestCount.get({
        method: '*',
        route: '/api/*',
        status_code: 400
      }),
      authTokenEvents: performanceMonitor.requestCount.get({
        method: '*',
        route: '/api/auth/*'
      }),
      passwordResetEvents: performanceMonitor.requestCount.get({
        method: 'POST',
        route: '/api/auth/reset-password'
      }),
      fileOperations: performanceMonitor.requestCount.get({
        method: '*',
        route: '/api/files/*'
      }),
      apiAccess: performanceMonitor.requestCount.get({
        method: '*',
        route: '/api/*'
      }),
      adminActions: performanceMonitor.requestCount.get({
        method: '*',
        route: '/api/admin/*'
      })
    };
  }
};

module.exports = {
  securityMonitor,
  SECURITY_EVENTS
};
