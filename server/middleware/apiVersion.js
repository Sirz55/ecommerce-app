const express = require('express');
const { performance } = require('perf_hooks');
const logger = require('../config/logger').logger;

// API version configuration
const apiVersions = {
  v1: {
    prefix: '/api/v1',
    deprecated: false,
    minVersion: '1.0.0',
    maxVersion: '1.1.0',
    routes: [],
    middleware: []
  },
  v2: {
    prefix: '/api/v2',
    deprecated: false,
    minVersion: '2.0.0',
    maxVersion: '2.0.0',
    routes: [],
    middleware: []
  }
};

// Version validation middleware
const validateVersion = (req, res, next) => {
  const start = performance.now();
  const version = req.params.version || 'v1';
  const clientVersion = req.headers['x-api-version'] || '1.0.0';

  if (!apiVersions[version]) {
    logger.warn('Invalid API version requested', {
      version,
      clientVersion,
      ip: req.ip,
      url: req.url
    });
    
    return res.status(400).json({
      success: false,
      error: `Invalid API version: ${version}`
    });
  }

  const { minVersion, maxVersion } = apiVersions[version];
  
  // Compare versions
  const isCompatible = compareVersions(clientVersion, minVersion) >= 0 &&
                      compareVersions(clientVersion, maxVersion) <= 0;

  if (!isCompatible) {
    logger.warn('API version mismatch', {
      version,
      clientVersion,
      minVersion,
      maxVersion,
      ip: req.ip,
      url: req.url
    });
    
    return res.status(400).json({
      success: false,
      error: `Client version ${clientVersion} is not compatible with API version ${version}`,
      minVersion,
      maxVersion
    });
  }

  // Add version information to request
  req.apiVersion = {
    version,
    clientVersion,
    minVersion,
    maxVersion,
    deprecated: apiVersions[version].deprecated
  };

  logger.info('API version validated', {
    version,
    clientVersion,
    duration: performance.now() - start,
    ip: req.ip,
    url: req.url
  });

  next();
};

// Version comparison function
const compareVersions = (version1, version2) => {
  const v1 = version1.split('.').map(Number);
  const v2 = version2.split('.').map(Number);
  
  for (let i = 0; i < 3; i++) {
    if (v1[i] === undefined) return -1;
    if (v2[i] === undefined) return 1;
    if (v1[i] !== v2[i]) return v1[i] - v2[i];
  }
  
  return 0;
};

// API versioning middleware
const apiVersioning = (app) => {
  // Register version-specific routes
  Object.entries(apiVersions).forEach(([version, config]) => {
    const router = express.Router();
    
    // Apply version-specific middleware
    config.middleware.forEach(middleware => {
      router.use(middleware);
    });
    
    // Register version-specific routes
    config.routes.forEach(route => {
      router[route.method](route.path, route.handler);
    });
    
    // Add version prefix
    app.use(config.prefix, validateVersion, router);
  });
};

// Version deprecation middleware
const checkDeprecation = (req, res, next) => {
  if (req.apiVersion.deprecated) {
    logger.warn('Deprecated API version used', {
      version: req.apiVersion.version,
      clientVersion: req.apiVersion.clientVersion,
      ip: req.ip,
      url: req.url
    });
    
    res.setHeader('X-API-Deprecated', 'true');
    res.setHeader('X-API-Deprecation-Date', '2025-12-31');
    res.setHeader('X-API-Replacement-Version', 'v2');
  }
  
  next();
};

module.exports = {
  apiVersioning,
  validateVersion,
  checkDeprecation,
  apiVersions
};
