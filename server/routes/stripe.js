const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
require('dotenv').config();
const Order = require('../models/Order');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Create Stripe checkout session + save pending order
router.post('/create-checkout-session', async (req, res) => {
  const { cart, address, phone } = req.body;

  const line_items = cart.map(item => ({
    price_data: {
      currency: 'inr',
      product_data: { name: item.name },
      unit_amount: item.price * 100,
    },
    quantity: 1,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/cancel',
    });

    await Order.create({
      items: cart,
      address,
      phone,
      paymentStatus: "pending",
      stripeSessionId: session.id,
    });

    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/verify-payment', async (req, res) => {
  const session_id = req.query.session_id;

  if (!session_id) {
    return res.status(400).json({ success: false, message: "Session ID missing" });
  }

  try {
    // Get session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      // Update Order in DB
      await Order.findOneAndUpdate(
        { stripeSessionId: session_id },
        { paymentStatus: 'paid' }
      );

      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});



// ✅ Verify Stripe payment success & update order
router.get('/verify-payment', async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      await Order.findOneAndUpdate(
        { stripeSessionId: session_id },
        { paymentStatus: "paid" }
      );
      return res.json({ success: true });
    }

    res.json({ success: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
