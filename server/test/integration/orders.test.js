const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../index');
const Order = require('../../models/Order');
const User = require('../../models/User');
const Product = require('../../models/Product');
const Coupon = require('../../models/Coupon');
const logger = require('../../config/logger').logger;

// Mock data
const mockUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'StrongPassword123!'
};

const mockProduct = {
  name: 'Test Product',
  description: 'Test product description',
  price: 100.00,
  stock: 10,
  category: 'Electronics',
  images: ['test.jpg']
};

const mockCoupon = {
  code: 'TEST20',
  discountType: 'percentage',
  discountValue: 20,
  minimumAmount: 100,
  maxUses: 10,
  isActive: true,
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
};

const mockShippingAddress = {
  fullName: 'Test User',
  streetAddress: '123 Test St',
  city: 'Test City',
  state: 'Test State',
  postalCode: '12345',
  country: 'Test Country',
  phone: '+1234567890'
};

// Test suite setup
let server;
let token;
let userId;
let productId;
let couponId;

beforeAll(async () => {
  server = app.listen(0);
  
  // Create test user
  const user = await User.create(mockUser);
  userId = user._id;
  
  // Create test product
  const product = await Product.create({ ...mockProduct, user: userId });
  productId = product._id;
  
  // Create test coupon
  const coupon = await Coupon.create({ ...mockCoupon, user: userId });
  couponId = coupon._id;
  
  // Get JWT token
  const loginResponse = await request(server)
    .post('/api/auth/login')
    .send({ email: mockUser.email, password: mockUser.password });
  token = loginResponse.body.token;
});

afterAll(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});
  await Coupon.deleteMany({});
  await server.close();
});

describe('Order Integration Tests', () => {
  // Test order creation
  describe('POST /api/orders', () => {
    test('should create a new order with valid data', async () => {
      const response = await request(server)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [{
            product: productId,
            quantity: 2
          }],
          shippingAddress: mockShippingAddress,
          paymentMethod: 'credit_card'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('pending');
      expect(response.body.items.length).toBe(1);
    });

    test('should apply coupon to order', async () => {
      const response = await request(server)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [{
            product: productId,
            quantity: 2
          }],
          shippingAddress: mockShippingAddress,
          paymentMethod: 'credit_card',
          couponCode: mockCoupon.code
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('discount');
      expect(response.body.discount.percentage).toBe(20);
    });

    test('should fail with invalid coupon', async () => {
      const response = await request(server)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [{
            product: productId,
            quantity: 2
          }],
          shippingAddress: mockShippingAddress,
          paymentMethod: 'credit_card',
          couponCode: 'INVALIDCOUPON'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should fail with insufficient stock', async () => {
      const response = await request(server)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [{
            product: productId,
            quantity: 15 // More than stock
          }],
          shippingAddress: mockShippingAddress,
          paymentMethod: 'credit_card'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  // Test order retrieval
  describe('GET /api/orders', () => {
    let orderId;

    beforeEach(async () => {
      const order = await Order.create({
        user: userId,
        items: [{
          product: productId,
          quantity: 2
        }],
        shippingAddress: mockShippingAddress,
        paymentMethod: 'credit_card'
      });
      orderId = order._id;
    });

    test('should get user orders', async () => {
      const response = await request(server)
        .get('/api/orders/user')
        .set('Authorization', `Bearer ${token}`)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('should filter orders by status', async () => {
      const response = await request(server)
        .get('/api/orders/user')
        .set('Authorization', `Bearer ${token}`)
        .query({ status: 'pending' });

      expect(response.status).toBe(200);
      expect(response.body.data.every(order => order.status === 'pending')).toBe(true);
    });

    test('should get order details', async () => {
      const response = await request(server)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.items.length).toBe(1);
    });

    test('should get order summary', async () => {
      const response = await request(server)
        .get(`/api/orders/${orderId}/summary`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalItems');
      expect(response.body).toHaveProperty('totalAmount');
    });
  });

  // Test order updates
  describe('PATCH /api/orders/:id', () => {
    let orderId;

    beforeEach(async () => {
      const order = await Order.create({
        user: userId,
        items: [{
          product: productId,
          quantity: 2
        }],
        shippingAddress: mockShippingAddress,
        paymentMethod: 'credit_card'
      });
      orderId = order._id;
    });

    test('should update order status', async () => {
      const response = await request(server)
        .patch(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'shipped' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('shipped');
    });

    test('should update shipping address', async () => {
      const updatedAddress = { ...mockShippingAddress, city: 'Updated City' };
      
      const response = await request(server)
        .patch(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ shippingAddress: updatedAddress });

      expect(response.status).toBe(200);
      expect(response.body.shippingAddress.city).toBe('Updated City');
    });

    test('should fail to update invalid status', async () => {
      const response = await request(server)
        .patch(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'invalid_status' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  // Test order cancellation
  describe('DELETE /api/orders/:id', () => {
    let orderId;

    beforeEach(async () => {
      const order = await Order.create({
        user: userId,
        items: [{
          product: productId,
          quantity: 2
        }],
        shippingAddress: mockShippingAddress,
        paymentMethod: 'credit_card'
      });
      orderId = order._id;
    });

    test('should cancel order', async () => {
      const response = await request(server)
        .delete(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('cancelled');
    });

    test('should fail to cancel already cancelled order', async () => {
      // First cancel the order
      await request(server)
        .delete(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${token}`);

      // Try to cancel again
      const response = await request(server)
        .delete(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
