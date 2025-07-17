const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const logger = require('../config/logger').logger;

const totpService = {
  // Generate TOTP secret
  generateSecret: () => {
    try {
      const secret = speakeasy.generateSecret({
        name: 'E-Commerce App',
        length: 32
      });
      
      logger.info('Generated TOTP secret');
      return secret;
    } catch (error) {
      logger.error('Error generating TOTP secret', error);
      throw error;
    }
  },

  // Generate QR code for TOTP setup
  async generateQRCode(secret, email) {
    try {
      const otpauthUrl = speakeasy.otpauthURL({
        secret: secret.base32,
        label: email,
        issuer: 'E-Commerce App'
      });
      
      const qrCode = await qrcode.toDataURL(otpauthUrl);
      logger.info('Generated QR code for TOTP setup');
      return qrCode;
    } catch (error) {
      logger.error('Error generating QR code', error);
      throw error;
    }
  },

  // Verify TOTP token
  verifyToken: (secret, token) => {
    try {
      const verified = speakeasy.totp.verify({
        secret: secret.base32,
        encoding: 'base32',
        token,
        window: 1
      });
      
      logger.info('TOTP verification result', { success: verified });
      return verified;
    } catch (error) {
      logger.error('Error verifying TOTP token', error);
      throw error;
    }
  },

  // Generate backup codes
  generateBackupCodes: () => {
    const codes = Array.from({ length: 10 }, () => {
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    });
    
    logger.info('Generated backup codes');
    return codes;
  }
};

module.exports = totpService;
