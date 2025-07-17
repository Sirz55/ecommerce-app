const { performance } = require('perf_hooks');
const Prometheus = require('prom-client');
const logger = require('../config/logger').logger;

// Initialize Prometheus metrics
const httpRequestDuration = new Prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 1, 3, 5, 10]
});

const requestCount = new Prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeRequests = new Prometheus.Gauge({
  name: 'active_requests',
  help: 'Number of active requests',
  labelNames: ['method', 'route']
});

const memoryUsage = new Prometheus.Gauge({
  name: 'nodejs_memory_usage_bytes',
  help: 'Node.js memory usage in bytes',
  labelNames: ['type']
});

const cpuUsage = new Prometheus.Gauge({
  name: 'nodejs_cpu_usage_seconds_total',
  help: 'Node.js CPU usage in seconds',
  labelNames: ['type']
});

const performanceMonitor = {
  // Start monitoring
  startMonitoring: function() {
    // Memory monitoring
    setInterval(() => {
      const memory = process.memoryUsage();
      Object.entries(memory).forEach(([key, value]) => {
        memoryUsage.set({ type: key }, value);
      });
    }, 5000);

    // CPU monitoring
    let lastCpuTime = process.cpuUsage();
    setInterval(() => {
      const cpuTime = process.cpuUsage(lastCpuTime);
      lastCpuTime = process.cpuUsage();
      
      Object.entries(cpuTime).forEach(([key, value]) => {
        cpuUsage.set({ type: key }, value / 1000000); // Convert to seconds
      });
    }, 5000);

    logger.info('Performance monitoring started');
  },

  // Request monitoring middleware
  requestMonitor: function(req, res, next) {
    const start = performance.now();
    
    // Track active requests
    activeRequests.inc({ method: req.method, route: req.route.path });

    res.on('finish', () => {
      const duration = performance.now() - start;
      
      // Track request duration
      httpRequestDuration
        .labels(req.method, req.route.path, res.statusCode)
        .observe(duration / 1000);

      // Track request count
      requestCount
        .labels(req.method, req.route.path, res.statusCode)
        .inc();

      // Decrement active requests
      activeRequests.dec({ method: req.method, route: req.route.path });

      // Log performance metrics
      logger.info('Request metrics', {
        method: req.method,
        route: req.route.path,
        statusCode: res.statusCode,
        duration: duration,
        memory: process.memoryUsage(),
        activeRequests: activeRequests.get({
          method: req.method,
          route: req.route.path
        })
      });
    });

    next();
  },

  // Database query monitoring
  trackQuery: (query, operation, collection) => {
    const start = performance.now();

    return query.then(result => {
      const duration = performance.now() - start;
      
      logger.info('Database query metrics', {
        operation,
        collection,
        duration,
        resultCount: Array.isArray(result) ? result.length : 1
      });

      return result;
    }).catch(error => {
      logger.error('Database query error', {
        operation,
        collection,
        error: error.message
      });

      throw error;
    });
  },

  // Cache performance monitoring
  trackCache: (cacheKey, operation) => {
    const start = performance.now();

    return Promise.resolve().then(() => {
      const duration = performance.now() - start;
      
      logger.info('Cache operation metrics', {
        key: cacheKey,
        operation,
        duration
      });

      return { duration };
    });
  },

  // API performance monitoring
  trackApi: (endpoint, operation, startTime, context = {}) => {
    const duration = performance.now() - startTime;

    logger.info('API performance metrics', {
      endpoint,
      operation,
      duration,
      ...context
    });

    return {
      duration,
      timestamp: new Date().toISOString(),
      ...context
    };
  },

  // Health check endpoint
  getHealthMetrics: () => {
    return {
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      httpRequests: requestCount.get(),
      activeRequests: activeRequests.get(),
      cpuUsage: cpuUsage.get(),
      performance: {
        avgResponseTime: httpRequestDuration.get(),
        requestCount: requestCount.get(),
        activeRequests: activeRequests.get()
      }
    };
  }
};

// Export Prometheus metrics
performanceMonitor.register = Prometheus.register;

module.exports = performanceMonitor;
