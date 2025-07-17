const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const config = {
  // Environment
  env: process.env.NODE_ENV || 'development',
  
  // Server
  port: process.env.PORT || 5000,
  host: process.env.HOST || 'localhost',
  
  // MongoDB
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiration: process.env.JWT_EXPIRATION || '7d',
  
  // Email
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE || false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  },
  
  // Security
  passwordSaltRounds: process.env.PASSWORD_SALT_ROUNDS || 10,
  rateLimit: {
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX || 100
  },
  
  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  },
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Paths
  uploadsPath: path.join(__dirname, '..', '..', 'uploads'),
  
  // Client URL
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  
  // API Documentation
  apiDocsPath: '/api-docs',
  
  // Cache
  cache: {
    enabled: process.env.CACHE_ENABLED === 'true',
    provider: process.env.CACHE_PROVIDER || 'memory',
    ttl: process.env.CACHE_TTL || 3600
  },
  
  // Monitoring
  monitoring: {
    enabled: process.env.MONITORING_ENABLED === 'true',
    provider: process.env.MONITORING_PROVIDER || 'prometheus'
  }
};

module.exports = config;
