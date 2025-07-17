const mongoose = require('mongoose');
const User = require('../../models/User');
const logger = require('../../config/logger').logger;

// Helper functions for security tests

// Create test user with specified security settings
const createTestUser = async (options = {}) => {
  const defaults = {
    name: 'Test User',
    email: `test${Math.random().toString(36).substr(2, 5)}@example.com`,
    password: 'StrongPassword123!',
    confirmPassword: 'StrongPassword123!',
    isEmailVerified: false,
    is2FAEnabled: false
  };

  const user = await User.create({
    ...defaults,
    ...options
  });

  logger.info('Created test user', { userId: user._id });
  return user;
};

// Create test admin user
const createTestAdmin = async () => {
  const admin = await createTestUser({
    isAdmin: true,
    is2FAEnabled: true
  });

  logger.info('Created test admin user', { userId: admin._id });
  return admin;
};

// Generate JWT token
const generateToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const token = user.getSignedJwtToken();
  logger.info('Generated JWT token', { userId });
  return token;
};

// Simulate rate limiting
const simulateRateLimiting = async (endpoint, attempts = 10) => {
  for (let i = 0; i < attempts; i++) {
    await request(server)
      .post(endpoint)
      .send({ email: 'test@example.com', password: 'password123' });
  }

  logger.info('Simulated rate limiting', { endpoint, attempts });
};

// Block IP address
const blockIP = async (ip) => {
  await User.updateMany({}, {
    $push: {
      blockedIPs: ip
    }
  });

  logger.info('Blocked IP address', { ip });
};

// Clean up test data
const cleanupTestData = async () => {
  await User.deleteMany({});
  logger.info('Cleaned up test data');
};

// Test password strength
const testPasswordStrength = async (password) => {
  const user = await createTestUser({
    password,
    confirmPassword: password
  });

  const isValid = user.password === await user.matchPassword(password);
  logger.info('Tested password strength', { isValid });
  return isValid;
};

// Test email verification
const testEmailVerification = async (email) => {
  const user = await createTestUser({
    email
  });

  const verificationToken = user.verificationToken;
  const isVerified = await User.findOne({
    verificationToken,
    isEmailVerified: true
  });

  logger.info('Tested email verification', { isVerified });
  return isVerified;
};

module.exports = {
  createTestUser,
  createTestAdmin,
  generateToken,
  simulateRateLimiting,
  blockIP,
  cleanupTestData,
  testPasswordStrength,
  testEmailVerification
};
