const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../index');
const User = require('../../models/User');
const logger = require('../../config/logger').logger;
const { rateLimitMiddleware } = require('../../middleware/rateLimit');
const { twoFactorAuthMiddleware } = require('../../middleware/twoFactorAuth');

// Mock data
const mockUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'StrongPassword123!',
  confirmPassword: 'StrongPassword123!'
};

const mockAdmin = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'AdminPassword123!',
  confirmPassword: 'AdminPassword123!',
  isAdmin: true
};

const mockInvalidUser = {
  email: 'invalid@example.com',
  password: 'Short123' // Invalid password
};

// Test suite setup
let server;
let userId;
let adminId;
let token;

beforeAll(async () => {
  server = app.listen(0);
});

afterAll(async () => {
  await User.deleteMany({});
  await server.close();
});

describe('Authentication Security Tests', () => {
  // Test registration security
  describe('POST /api/auth/register', () => {
    test('should fail with weak password', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .send({
          ...mockUser,
          password: 'weak',
          confirmPassword: 'weak'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should fail with mismatched passwords', async () => {
      const response = await request(server)
        .post('/api/auth/register')
        .send({
          ...mockUser,
          confirmPassword: 'DifferentPassword123!'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should fail with existing email', async () => {
      // Register user first
      await request(server)
        .post('/api/auth/register')
        .send(mockUser);

      // Try to register again
      const response = await request(server)
        .post('/api/auth/register')
        .send(mockUser);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error');
    });
  });

  // Test login security
  describe('POST /api/auth/login', () => {
    let loginCount = 0;

    beforeEach(async () => {
      // Create test users
      const user = await User.create(mockUser);
      userId = user._id;

      const admin = await User.create(mockAdmin);
      adminId = admin._id;
    });

    test('should fail with invalid credentials', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send(mockInvalidUser);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('should fail with rate limiting', async () => {
      // Try to login multiple times
      for (let i = 0; i < 10; i++) {
        await request(server)
          .post('/api/auth/login')
          .send(mockInvalidUser);
      }

      // Next attempt should be rate limited
      const response = await request(server)
        .post('/api/auth/login')
        .send(mockInvalidUser);

      expect(response.status).toBe(429);
      expect(response.body).toHaveProperty('retryAfter');
    });

    test('should fail with IP blocking', async () => {
      // Block IP
      await twoFactorAuthMiddleware.blockIP('123.45.67.89');

      const response = await request(server)
        .post('/api/auth/login')
        .set('X-Forwarded-For', '123.45.67.89')
        .send(mockUser);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    test('should require email verification', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send({
          email: mockUser.email,
          password: mockUser.password
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should require 2FA for admin login', async () => {
      // Login as admin
      const loginResponse = await request(server)
        .post('/api/auth/login')
        .send({
          email: mockAdmin.email,
          password: mockAdmin.password
        });

      expect(loginResponse.status).toBe(200);
      token = loginResponse.body.token;

      // Try to access admin route without 2FA
      const response = await request(server)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });
  });

  // Test password reset security
  describe('Password Reset Security', () => {
    let resetToken;

    beforeEach(async () => {
      // Create test user
      const user = await User.create(mockUser);
      userId = user._id;
    });

    test('should fail with invalid email', async () => {
      const response = await request(server)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    test('should fail with invalid reset token', async () => {
      const response = await request(server)
        .post('/api/auth/reset-password')
        .send({
          resetToken: 'invalid-token',
          password: 'NewPassword123!',
          confirmPassword: 'NewPassword123!'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should fail with expired reset token', async () => {
      // Create expired token
      const user = await User.findById(userId);
      user.resetPasswordToken = 'expired-token';
      user.resetPasswordExpire = new Date(Date.now() - 24 * 60 * 60 * 1000);
      await user.save();

      const response = await request(server)
        .post('/api/auth/reset-password')
        .send({
          resetToken: 'expired-token',
          password: 'NewPassword123!',
          confirmPassword: 'NewPassword123!'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  // Test JWT security
  describe('JWT Security', () => {
    let invalidToken;

    beforeEach(async () => {
      // Create test user and get token
      const user = await User.create(mockUser);
      userId = user._id;
      
      const loginResponse = await request(server)
        .post('/api/auth/login')
        .send({
          email: mockUser.email,
          password: mockUser.password
        });

      token = loginResponse.body.token;

      // Create invalid token
      invalidToken = 'invalid.' + token.split('.')[1] + '.invalid';
    });

    test('should fail with invalid token', async () => {
      const response = await request(server)
        .get('/api/orders/user')
        .set('Authorization', `Bearer ${invalidToken}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('should fail with expired token', async () => {
      // Wait for token to expire
      await new Promise(resolve => setTimeout(resolve, 10000));

      const response = await request(server)
        .get('/api/orders/user')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    test('should fail with tampered token', async () => {
      const response = await request(server)
        .get('/api/orders/user')
        .set('Authorization', `Bearer ${invalidToken}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  // Test rate limiting
  describe('Rate Limiting', () => {
    test('should limit login attempts', async () => {
      // Try to login multiple times
      for (let i = 0; i < 10; i++) {
        await request(server)
          .post('/api/auth/login')
          .send(mockInvalidUser);
      }

      // Next attempt should be rate limited
      const response = await request(server)
        .post('/api/auth/login')
        .send(mockInvalidUser);

      expect(response.status).toBe(429);
      expect(response.body).toHaveProperty('retryAfter');
    });

    test('should limit password reset requests', async () => {
      // Try to request password reset multiple times
      for (let i = 0; i < 5; i++) {
        await request(server)
          .post('/api/auth/forgot-password')
          .send({ email: mockUser.email });
      }

      // Next attempt should be rate limited
      const response = await request(server)
        .post('/api/auth/forgot-password')
        .send({ email: mockUser.email });

      expect(response.status).toBe(429);
      expect(response.body).toHaveProperty('retryAfter');
    });
  });

  // Test email verification
  describe('Email Verification', () => {
    test('should require email verification', async () => {
      // Create user without verification
      const user = await User.create(mockUser);
      userId = user._id;

      // Try to login
      const response = await request(server)
        .post('/api/auth/login')
        .send({
          email: mockUser.email,
          password: mockUser.password
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should verify email', async () => {
      // Create user
      const user = await User.create(mockUser);
      userId = user._id;

      // Get verification token
      const verificationToken = user.verificationToken;

      // Verify email
      const response = await request(server)
        .get(`/api/auth/verify/${verificationToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
    });
  });
});
