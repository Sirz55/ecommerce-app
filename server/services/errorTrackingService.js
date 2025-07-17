// const Sentry = require('@sentry/node');
// const { performance } = require('perf_hooks');
// const logger = require('../config/logger').logger;
// const { rateLimitMiddleware } = require('../middleware/rateLimit');
// const { performanceMonitor } = require('./performanceMonitor');

// // Initialize Sentry (v9+ compatible)
// Sentry.init({
//   dsn: process.env.SENTRY_DSN,
//   environment: process.env.NODE_ENV,
//   release: process.env.RELEASE_VERSION,
//   serverName: process.env.HOSTNAME || 'unknown-server',
//   tracesSampleRate: 1.0,
//   integrations: [
//     // HTTP tracing is now automatically included
//     // Express integration (if using Express)
//     // new Sentry.Integrations.Express({ app: yourExpressApp }),
//   ],
//   beforeSend: (event, hint) => {
//     if (event.exception?.values?.[0]?.value) {
//       event.type = event.exception.values[0].type;
//       const stack = event.exception.values[0].stacktrace;
//       if (stack) {
//         event.stackLength = stack.frames.length;
//       }
//     }
//     return event;
//   }
// });
// const errorTrackingService = {
//   trackError: (error, context = {}) => {
//     try {
//       const startTime = performance.now();
//       Sentry.withScope((scope) => {
//         scope.setExtra('timestamp', new Date().toISOString());
//         scope.setExtra('environment', process.env.NODE_ENV);
//         scope.setExtra('release', process.env.RELEASE_VERSION);
//         scope.setExtra('hostname', process.env.HOSTNAME);
//         scope.setExtra('process', process.pid);

//         Object.entries(context).forEach(([key, value]) => {
//           scope.setExtra(key, value);
//         });

//         if (context.userId) {
//           scope.setUser({
//             id: context.userId,
//             email: context.email,
//             ip: context.ip
//           });
//         }

//         if (context.req) {
//           scope.setExtra('request', {
//             method: context.req.method,
//             url: context.req.url,
//             headers: context.req.headers,
//             body: context.req.body,
//             query: context.req.query,
//             params: context.req.params
//           });
//         }

//         scope.setExtra('performance', {
//           memory: process.memoryUsage(),
//           uptime: process.uptime(),
//           activeRequests: performanceMonitor.activeRequests.get()
//         });

//         Sentry.captureException(error);

//         performanceMonitor.trackPerformance('error_tracking', startTime, {
//           errorType: error.name,
//           error: error.message,
//           context
//         });

//         logger.error('Error tracked', {
//           error: error.message,
//           type: error.name,
//           context,
//           sentryId: Sentry.lastEventId(),
//           duration: performance.now() - startTime
//         });
//       });
//     } catch (trackingError) {
//       logger.error('Error tracking failed', {
//         error: trackingError.message,
//         originalError: error.message,
//         context,
//         stack: trackingError.stack
//       });
//     }
//   },

//   trackPerformance: (name, startTime, context = {}) => {
//     const duration = performance.now() - startTime;
//     Sentry.withScope((scope) => {
//       scope.setExtra('duration', duration);
//       scope.setExtra('name', name);
//       scope.setExtra('timestamp', new Date().toISOString());
//       Object.entries(context).forEach(([key, value]) => {
//         scope.setExtra(key, value);
//       });
//       Sentry.captureMessage(`Performance: ${name}`, 'info');
//     });

//     logger.info('Performance tracked', {
//       name,
//       duration,
//       context,
//       timestamp: new Date().toISOString()
//     });

//     performanceMonitor.trackPerformance(name, startTime, context);
//   },

//   trackSecurityEvent: (type, context = {}) => {
//     const startTime = performance.now();
//     Sentry.withScope((scope) => {
//       scope.setExtra('type', type);
//       scope.setExtra('timestamp', new Date().toISOString());
//       scope.setExtra('environment', process.env.NODE_ENV);
//       Object.entries(context).forEach(([key, value]) => {
//         scope.setExtra(key, value);
//       });
//       Sentry.captureMessage(`Security Event: ${type}`, 'warning');
//     });

//     logger.warn('Security event tracked', {
//       type,
//       context,
//       timestamp: new Date().toISOString(),
//       duration: performance.now() - startTime
//     });

//     performanceMonitor.trackPerformance('security_event', startTime, {
//       type,
//       ...context
//     });
//   },

//   trackRateLimit: (ip, endpoint, attempts) => {
//     const startTime = performance.now();
//     Sentry.withScope((scope) => {
//       scope.setExtra('ip', ip);
//       scope.setExtra('endpoint', endpoint);
//       scope.setExtra('attempts', attempts);
//       scope.setExtra('timestamp', new Date().toISOString());
//       Sentry.captureMessage('Rate Limit Exceeded', 'warning');
//     });

//     logger.warn('Rate limit exceeded', {
//       ip,
//       endpoint,
//       attempts,
//       timestamp: new Date().toISOString(),
//       duration: performance.now() - startTime
//     });

//     performanceMonitor.trackPerformance('rate_limit', startTime, {
//       ip,
//       endpoint,
//       attempts
//     });
//   },

//   trackAuthEvent: (type, context = {}) => {
//     const startTime = performance.now();
//     Sentry.withScope((scope) => {
//       scope.setExtra('type', type);
//       scope.setExtra('timestamp', new Date().toISOString());
//       Object.entries(context).forEach(([key, value]) => {
//         scope.setExtra(key, value);
//       });
//       Sentry.captureMessage(
//         `Authentication Event: ${type}`,
//         type === 'success' ? 'info' : 'warning'
//       );
//     });

//     logger[type === 'success' ? 'info' : 'warn']('Authentication event', {
//       type,
//       context,
//       timestamp: new Date().toISOString(),
//       duration: performance.now() - startTime
//     });

//     performanceMonitor.trackPerformance('auth_event', startTime, {
//       type,
//       ...context
//     });
//   },

//   trackDatabaseError: (error, operation, context = {}) => {
//     const startTime = performance.now();
//     Sentry.withScope((scope) => {
//       scope.setExtra('operation', operation);
//       scope.setExtra('timestamp', new Date().toISOString());
//       Object.entries(context).forEach(([key, value]) => {
//         scope.setExtra(key, value);
//       });
//       Sentry.captureException(error);
//     });

//     logger.error('Database error', {
//       operation,
//       error: error.message,
//       context,
//       timestamp: new Date().toISOString(),
//       duration: performance.now() - startTime
//     });

//     performanceMonitor.trackPerformance('db_error', startTime, {
//       operation,
//       error: error.message,
//       ...context
//     });
//   },

//   trackApiError: (error, endpoint, context = {}) => {
//     const startTime = performance.now();
//     Sentry.withScope((scope) => {
//       scope.setExtra('endpoint', endpoint);
//       scope.setExtra('timestamp', new Date().toISOString());
//       Object.entries(context).forEach(([key, value]) => {
//         scope.setExtra(key, value);
//       });
//       Sentry.captureException(error);
//     });

//     logger.error('API error', {
//       endpoint,
//       error: error.message,
//       context,
//       timestamp: new Date().toISOString(),
//       duration: performance.now() - startTime
//     });

//     performanceMonitor.trackPerformance('api_error', startTime, {
//       endpoint,
//       error: error.message,
//       ...context
//     });
//   },

//   trackUserError: (error, userId, context = {}) => {
//     const startTime = performance.now();
//     Sentry.withScope((scope) => {
//       scope.setUser({
//         id: userId,
//         email: context.email,
//         ip: context.ip
//       });
//       scope.setExtra('error', error.message);
//       scope.setExtra('timestamp', new Date().toISOString());
//       Object.entries(context).forEach(([key, value]) => {
//         scope.setExtra(key, value);
//       });
//       Sentry.captureException(error);
//     });

//     logger.error('User error', {
//       userId,
//       error: error.message,
//       context,
//       timestamp: new Date().toISOString(),
//       duration: performance.now() - startTime
//     });

//     performanceMonitor.trackPerformance('user_error', startTime, {
//       userId,
//       error: error.message,
//       ...context
//     });
//   },

//   trackSystemError: (error, context = {}) => {
//     const startTime = performance.now();
//     Sentry.withScope((scope) => {
//       scope.setExtra('error', error.message);
//       scope.setExtra('timestamp', new Date().toISOString());
//       scope.setExtra('environment', process.env.NODE_ENV);
//       scope.setExtra('release', process.env.RELEASE_VERSION);
//       Object.entries(context).forEach(([key, value]) => {
//         scope.setExtra(key, value);
//       });
//       Sentry.captureException(error);
//     });

//     logger.error('System error', {
//       error: error.message,
//       context,
//       timestamp: new Date().toISOString(),
//       duration: performance.now() - startTime
//     });

//     performanceMonitor.trackPerformance('system_error', startTime, {
//       error: error.message,
//       ...context
//     });
//   },

//   trackUnhandledException: (error) => {
//     const startTime = performance.now();
//     Sentry.withScope((scope) => {
//       scope.setExtra('error', error.message);
//       scope.setExtra('stack', error.stack);
//       scope.setExtra('timestamp', new Date().toISOString());
//       scope.setExtra('process', process.pid);
//       Sentry.captureException(error);
//     });

//     logger.error('Unhandled exception', {
//       error: error.message,
//       stack: error.stack,
//       timestamp: new Date().toISOString(),
//       duration: performance.now() - startTime
//     });
//   },

//   trackUnhandledRejection: (reason) => {
//     const startTime = performance.now();
//     Sentry.withScope((scope) => {
//       scope.setExtra('reason', reason);
//       scope.setExtra('timestamp', new Date().toISOString());
//       scope.setExtra('process', process.pid);
//       Sentry.captureMessage('Unhandled Promise Rejection', 'error');
//     });

//     logger.error('Unhandled promise rejection', {
//       reason,
//       timestamp: new Date().toISOString(),
//       duration: performance.now() - startTime
//     });
//   },

//   initialize: () => {
//     process.on('uncaughtException', errorTrackingService.trackUnhandledException);
//     process.on('unhandledRejection', errorTrackingService.trackUnhandledRejection);
//     logger.info('Error tracking initialized');
//   }
// };

// errorTrackingService.initialize();

// module.exports = errorTrackingService;





const Sentry = require('@sentry/node');
const { performance } = require('perf_hooks');
const logger = require('../config/logger').logger;

module.exports = {
  /**
   * Track errors with context
   */
  trackError: (error, context = {}) => {
    const startTime = performance.now();
    
    Sentry.withScope((scope) => {
      // Set user context if available
      if (context.userId) {
        scope.setUser({
          id: context.userId,
          email: context.email,
          ip: context.ip
        });
      }

      // Add all context as extra data
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });

      // Capture the error
      Sentry.captureException(error);
    });

    // Log to local logger
    logger.error({
      message: error.message,
      stack: error.stack,
      type: error.name,
      context,
      duration: performance.now() - startTime
    });
  },

  /**
   * Initialize background monitoring
   */
  initialize: () => {
    // Optional: Add heartbeat monitoring
    setInterval(() => {
      Sentry.captureMessage('Server heartbeat', 'info');
    }, 3600000); // Every hour

    logger.info('Error tracking initialized');
  },

  /**
   * Track performance metrics
   */
  trackPerformance: (name, startTime, context = {}) => {
    const duration = performance.now() - startTime;
    Sentry.addBreadcrumb({
      category: 'performance',
      message: name,
      data: { ...context, duration },
      level: 'info'
    });
  }
};