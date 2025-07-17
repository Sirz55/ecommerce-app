const { cacheMiddleware, invalidateCacheMiddleware } = require('../config/cache');
const { requestLogger, errorLogger, performanceMonitor } = require('../config/monitoring');
const { performance } = require('perf_hooks');
const os = require('os');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

// Health check middleware
const healthCheck = async (req, res) => {
  try {
    // Check system resources
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();
    const loadAvg = os.loadavg();
    const cpuCount = os.cpus().length;
    
    // Check Redis connection
    const redisCheck = await exec('redis-cli ping');
    
    // Check MongoDB connection
    const dbCheck = await exec('mongo --eval "db.runCommand({ping:1})"');
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      system: {
        uptime,
        memory: memoryUsage,
        cpu: {
          count: cpuCount,
          loadAvg
        }
      },
      services: {
        redis: redisCheck.stdout.includes('PONG'),
        mongodb: dbCheck.stdout.includes('ok: 1')
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
};

// Metrics middleware
const metrics = async (req, res) => {
  try {
    // Get system metrics
    const metrics = {
      timestamp: Date.now(),
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      cpu: {
        count: os.cpus().length,
        loadAvg: os.loadavg()
      },
      requests: {
        total: req.app.locals.metrics?.requests?.total || 0,
        success: req.app.locals.metrics?.requests?.success || 0,
        error: req.app.locals.metrics?.requests?.error || 0
      }
    };

    res.set('Content-Type', 'text/plain');
    res.send(`
      # HELP system_memory_usage_bytes Current memory usage in bytes
      # TYPE system_memory_usage_bytes gauge
      system_memory_usage_bytes ${metrics.memory.heapUsed}

      # HELP system_uptime_seconds Uptime in seconds
      # TYPE system_uptime_seconds gauge
      system_uptime_seconds ${metrics.uptime}

      # HELP system_cpu_count Number of CPU cores
      # TYPE system_cpu_count gauge
      system_cpu_count ${metrics.cpu.count}

      # HELP system_cpu_load Load average
      # TYPE system_cpu_load gauge
      system_cpu_load ${metrics.cpu.loadAvg[0]}

      # HELP request_total Total number of requests
      # TYPE request_total counter
      request_total ${metrics.requests.total}

      # HELP request_success Success requests
      # TYPE request_success counter
      request_success ${metrics.requests.success}

      # HELP request_error Error requests
      # TYPE request_error counter
      request_error ${metrics.requests.error}
    `);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Request metrics middleware
const requestMetrics = (req, res, next) => {
  // Increment total requests
  req.app.locals.metrics = req.app.locals.metrics || {};
  req.app.locals.metrics.requests = req.app.locals.metrics.requests || {
    total: 0,
    success: 0,
    error: 0
  };
  req.app.locals.metrics.requests.total++;

  // Track start time
  const startTime = performance.now();

  res.on('finish', () => {
    // Calculate response time
    const responseTime = performance.now() - startTime;
    
    // Increment success/error count
    if (res.statusCode >= 200 && res.statusCode < 300) {
      req.app.locals.metrics.requests.success++;
    } else {
      req.app.locals.metrics.requests.error++;
    }

    // Log metrics
    console.log(`Request metrics - Method: ${req.method}, Path: ${req.path}, Status: ${res.statusCode}, Response Time: ${responseTime}ms`);
  });

  next();
};

module.exports = {
  healthCheck,
  metrics,
  requestMetrics,
  cacheMiddleware,
  invalidateCacheMiddleware
};
