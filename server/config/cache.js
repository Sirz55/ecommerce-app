const Redis = require('ioredis');
const config = require('./environment');

// Initialize Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  enableReadyCheck: false
});

// Cache service class
class CacheService {
  constructor() {
    this.redis = redis;
    this.ttl = config.cache.ttl;
  }

  // Get cached data
  async get(key) {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Set cached data
  async set(key, value, ttl = this.ttl) {
    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  // Delete cached data
  async delete(key) {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  // Clear cache
  async clear() {
    try {
      await this.redis.flushdb();
      return true;
    } catch (error) {
      console.error('Cache clear error:', error);
      return false;
    }
  }

  // Cache middleware
  cacheMiddleware = async (req, res, next) => {
    try {
      // Generate cache key based on request parameters
      const cacheKey = `${req.method}:${req.path}:${JSON.stringify(req.query)}`;
      
      // Check cache
      const cachedData = await this.get(cacheKey);
      
      if (cachedData) {
        // Set cache headers
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('Cache-Control', `public, max-age=${this.ttl}`);
        
        // Send cached response
        res.json(cachedData);
        return;
      }

      // Store original send method
      const originalSend = res.send;
      
      // Override send method
      res.send = async (...args) => {
        // Store response in cache
        await this.set(cacheKey, args[0]);
        
        // Restore original send method
        res.send = originalSend;
        
        // Call original send
        res.send(...args);
      };

      // Set cache headers
      res.setHeader('X-Cache', 'MISS');
      res.setHeader('Cache-Control', `public, max-age=${this.ttl}`);

      // Continue with request
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };

  // Cache invalidation middleware
  invalidateCacheMiddleware = async (req, res, next) => {
    try {
      // Generate cache key based on request parameters
      const cacheKey = `${req.method}:${req.path}:${JSON.stringify(req.query)}`;
      
      // Invalidate cache
      await this.delete(cacheKey);
      
      next();
    } catch (error) {
      console.error('Cache invalidation error:', error);
      next();
    }
  };
}

// Create cache instance
const cache = new CacheService();

// Export cache instance and middleware
module.exports = {
  cache,
  cacheMiddleware: cache.cacheMiddleware,
  invalidateCacheMiddleware: cache.invalidateCacheMiddleware
};
