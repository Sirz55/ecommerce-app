const express = require('express');
const router = express.Router();
const performanceMonitor = require('../services/performanceMonitor');
const logger = require('../config/logger').logger;

/**
 * @swagger
 * components:
 *   schemas:
 *     HealthCheck:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Health status
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Timestamp of the health check
 *         memory:
 *           type: object
 *           properties:
 *             rss:
 *               type: number
 *               description: Resident Set Size
 *             heapTotal:
 *               type: number
 *               description: Total heap size
 *             heapUsed:
 *               type: number
 *               description: Used heap size
 *             external:
 *               type: number
 *               description: External memory size
 *         uptime:
 *           type: number
 *           description: Server uptime in seconds
 *         metrics:
 *           type: object
 *           description: Performance metrics
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Get server health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 */
router.get('/', async (req, res) => {
  try {
    const metrics = performanceMonitor.getHealthMetrics();
    
    // Check system health
    const isHealthy = metrics.memory.heapUsed < (metrics.memory.heapTotal * 0.8) &&
                     metrics.cpuUsage.user < 0.8 &&
                     metrics.activeRequests < 100;

    const response = {
      status: isHealthy ? 'healthy' : 'warning',
      timestamp: new Date().toISOString(),
      memory: metrics.memory,
      uptime: metrics.uptime,
      metrics: {
        httpRequests: metrics.httpRequests,
        activeRequests: metrics.activeRequests,
        cpuUsage: metrics.cpuUsage,
        performance: metrics.performance
      }
    };

    logger.info('Health check response', response);
    res.status(200).json(response);
  } catch (error) {
    logger.error('Health check failed', error);
    res.status(500).json({
      status: 'error',
      error: 'Health check failed'
    });
  }
});

/**
 * @swagger
 * /metrics:
 *   get:
 *     summary: Get Prometheus metrics
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Prometheus metrics
 */
router.get('/metrics', async (req, res) => {
  try {
    const metrics = await performanceMonitor.register.metrics();
    res.set('Content-Type', performanceMonitor.register.contentType);
    res.send(metrics);
  } catch (error) {
    logger.error('Metrics endpoint failed', error);
    res.status(500).send('Error getting metrics');
  }
});

module.exports = router;
