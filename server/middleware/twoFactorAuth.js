const totpService = require('../services/totpService');
const logger = require('../config/logger').logger;

const twoFactorAuthMiddleware = {
  // Verify 2FA token
  verifyToken: async (req, res, next) => {
    try {
      const { token } = req.body;
      const { totpSecret } = req.user;

      if (!totpSecret) {
        logger.warn('2FA not enabled for user', { userId: req.user._id });
        return res.status(400).json({
          success: false,
          error: '2FA not enabled for this account'
        });
      }

      const isValid = await totpService.verifyToken(totpSecret, token);

      if (!isValid) {
        logger.warn('Invalid 2FA token', { userId: req.user._id });
        return res.status(401).json({
          success: false,
          error: 'Invalid 2FA token'
        });
      }

      logger.info('2FA token verified successfully', { userId: req.user._id });
      next();
    } catch (error) {
      logger.error('Error verifying 2FA token', { error, userId: req.user?._id });
      res.status(500).json({
        success: false,
        error: 'Error verifying 2FA token'
      });
    }
  },

  // Require 2FA for sensitive operations
  require2FA: async (req, res, next) => {
    try {
      const { is2FAEnabled } = req.user;

      if (!is2FAEnabled) {
        logger.warn('2FA required but not enabled', { userId: req.user._id });
        return res.status(403).json({
          success: false,
          error: '2FA is required for this operation'
        });
      }

      logger.info('2FA requirement verified', { userId: req.user._id });
      next();
    } catch (error) {
      logger.error('Error checking 2FA requirement', { error, userId: req.user?._id });
      res.status(500).json({
        success: false,
        error: 'Error checking 2FA requirement'
      });
    }
  },

  // 2FA bypass for certain routes
  bypass2FA: (req, res, next) => {
    const bypassRoutes = [
      '/api/auth/2fa/setup',
      '/api/auth/2fa/verify',
      '/api/auth/2fa/disable',
      '/api/auth/backup-codes'
    ];

    const isBypassRoute = bypassRoutes.some(route => 
      req.path.startsWith(route)
    );

    if (isBypassRoute) {
      logger.info('2FA bypassed for route', { route: req.path });
      return next();
    }

    next();
  }
};

module.exports = twoFactorAuthMiddleware;
