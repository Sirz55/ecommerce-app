const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const logger = require('../config/logger').logger;

const passwordService = {
  // Enhanced password hashing with additional security
  async hashPassword(password) {
    try {
      // Generate salt with higher rounds for stronger hashing
      const saltRounds = 12; // Increased from default 10
      const salt = await bcrypt.genSalt(saltRounds);
      
      // Create pepper for additional security
      const pepper = crypto.randomBytes(32).toString('hex');
      
      // Combine password with pepper
      const pepperedPassword = `${password}${pepper}`;
      
      // Hash the peppered password
      const hash = await bcrypt.hash(pepperedPassword, salt);
      
      // Store pepper and hash separately
      logger.info('Password hashed successfully');
      return { hash, pepper };
    } catch (error) {
      logger.error('Error hashing password', error);
      throw error;
    }
  },

  // Enhanced password verification
  async verifyPassword(password, storedHash, storedPepper) {
    try {
      // Combine password with stored pepper
      const pepperedPassword = `${password}${storedPepper}`;
      
      // Verify the peppered password
      const isValid = await bcrypt.compare(pepperedPassword, storedHash);
      
      logger.info('Password verification result', { success: isValid });
      return isValid;
    } catch (error) {
      logger.error('Error verifying password', error);
      throw error;
    }
  },

  // Password strength validation
  validatePasswordStrength(password) {
    const requirements = {
      minLength: 12,
      maxLength: 100,
      requiresLowercase: true,
      requiresUppercase: true,
      requiresNumbers: true,
      requiresSpecialChars: true
    };

    if (password.length < requirements.minLength) {
      throw new Error(`Password must be at least ${requirements.minLength} characters long`);
    }

    if (password.length > requirements.maxLength) {
      throw new Error(`Password cannot be longer than ${requirements.maxLength} characters`);
    }

    if (requirements.requiresLowercase && !/[a-z]/.test(password)) {
      throw new Error('Password must contain at least one lowercase letter');
    }

    if (requirements.requiresUppercase && !/[A-Z]/.test(password)) {
      throw new Error('Password must contain at least one uppercase letter');
    }

    if (requirements.requiresNumbers && !/[0-9]/.test(password)) {
      throw new Error('Password must contain at least one number');
    }

    if (requirements.requiresSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw new Error('Password must contain at least one special character');
    }

    logger.info('Password meets all security requirements');
    return true;
  },

  // Generate password reset token
  generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
  },

  // Generate password reset token expiration
  generateTokenExpiration() {
    return Date.now() + (24 * 60 * 60 * 1000); // 24 hours
  }
};

module.exports = passwordService;
