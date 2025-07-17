const { limiter } = require('../config/security');
const logger = require('../config/logger').logger;

const blockedIps = new Set();

// Load blocked IPs from environment
if (process.env.BLOCKED_IPS) {
  process.env.BLOCKED_IPS.split(',').forEach(ip => {
    blockedIps.add(ip.trim());
  });
}

const ipBlocker = async (req, res, next) => {
  try {
    const ip = req.ip;

    // Check if IP is blocked
    if (blockedIps.has(ip)) {
      logger.warn(`Blocked request from blacklisted IP: ${ip}`);
      return res.status(403).json({
        success: false,
        message: 'Access denied from this IP address'
      });
    }

    // Check rate limiting
    const isRateLimited = await limiter.consume(ip);
    if (!isRateLimited) {
      logger.warn(`Rate limit exceeded for IP: ${ip}`);
      return res.status(429).json({
        success: false,
        message: 'Too many requests from this IP address'
      });
    }

    // Add IP to blocked list if suspicious activity detected
    if (await checkSuspiciousActivity(req)) {
      blockedIps.add(ip);
      logger.warn(`IP ${ip} added to block list due to suspicious activity`);
      return res.status(403).json({
        success: false,
        message: 'Access denied due to suspicious activity'
      });
    }

    next();
  } catch (error) {
    logger.error('IP blocking error:', error);
    next(error);
  }
};

// Check for suspicious activity
const checkSuspiciousActivity = async (req) => {
  const suspiciousPatterns = [
    /sql injection/i,
    /union select/i,
    /drop table/i,
    /delete from/i,
    /truncate/i,
    /script>/i,
    /iframe>/i,
    /alert\(/i,
    /onerror=/i,
    /onload=/i,
    /eval\(/i
  ];

  const { body, query, headers } = req;
  const data = { ...body, ...query, ...headers };

  for (const pattern of suspiciousPatterns) {
    for (const key in data) {
      if (typeof data[key] === 'string' && pattern.test(data[key])) {
        return true;
      }
    }
  }

  return false;
};

// Remove IP from block list
const unblockIp = (ip) => {
  blockedIps.delete(ip);
  logger.info(`IP ${ip} removed from block list`);
};

// Block IP manually
const blockIp = (ip) => {
  blockedIps.add(ip);
  logger.warn(`IP ${ip} manually added to block list`);
};

module.exports = {
  ipBlocker,
  blockIp,
  unblockIp
};
