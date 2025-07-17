const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const logger = require('../config/logger').logger;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordPepper: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  totpSecret: {
    type: String,
    default: null,
  },
  is2FAEnabled: {
    type: Boolean,
    default: false,
  },
  backupCodes: [{
    type: String,
    used: {
      type: Boolean,
      default: false,
    },
  }],
  last2FAVerification: {
    type: Date,
    default: null,
  },
  failed2FAAttempts: {
    type: Number,
    default: 0,
  },
  lastFailed2FAAttempt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    const { hash, pepper } = await passwordService.hashPassword(this.password);
    this.password = hash;
    this.passwordPepper = pepper;
    
    logger.info('Password hashed before saving', { userId: this._id });
    next();
  } catch (error) {
    logger.error('Error hashing password before save', { error, userId: this._id });
    next(error);
  }
});

// Generate JWT token
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
      audience: 'ecommerce-app',
      issuer: 'ecommerce-app',
      subject: this.email
    }
  );
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await passwordService.verifyPassword(
      enteredPassword,
      this.password,
      this.passwordPepper
    );
  } catch (error) {
    logger.error('Error verifying password', { error, userId: this._id });
    throw error;
  }
};

// Verify backup code
userSchema.methods.verifyBackupCode = function(code) {
  const backupCode = this.backupCodes.find(
    bc => bc.code === code && !bc.used
  );

  if (!backupCode) {
    return false;
  }

  // Mark code as used
  backupCode.used = true;
  return true;
};

// Reset failed 2FA attempts
userSchema.methods.reset2FAAttempts = function() {
  this.failed2FAAttempts = 0;
  this.lastFailed2FAAttempt = null;
  return this.save();
};

// Reset 2FA
userSchema.methods.reset2FA = async function() {
  this.totpSecret = null;
  this.is2FAEnabled = false;
  this.backupCodes = [];
  this.last2FAVerification = null;
  this.failed2FAAttempts = 0;
  this.lastFailed2FAAttempt = null;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
