const config = require('./deployment');

// Environment-specific configurations
const environmentConfig = {
  development: {
    logLevel: 'debug',
    mongoUri: 'mongodb://localhost:27017/ecommerce-dev',
    jwtExpiration: '7d',
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100
    },
    cors: {
      origin: 'http://localhost:3000',
      credentials: true
    }
  },
  production: {
    logLevel: 'info',
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 50
    },
    cors: {
      origin: process.env.PROD_CORS_ORIGIN,
      credentials: true
    },
    cache: {
      enabled: true,
      provider: 'redis',
      ttl: 3600
    },
    monitoring: {
      enabled: true,
      provider: 'prometheus'
    }
  },
  test: {
    logLevel: 'error',
    mongoUri: 'mongodb://localhost:27017/ecommerce-test',
    jwtExpiration: '1h',
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 1000
    },
    cors: {
      origin: 'http://localhost:3000',
      credentials: true
    }
  }
};

// Merge environment-specific config with base config
const environment = config.env;
const envConfig = environmentConfig[environment] || {};

// Create final config by merging base and environment-specific configs
const finalConfig = {
  ...config,
  ...envConfig
};

module.exports = finalConfig;
