const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { verifyEmail, resendVerificationEmail } = require('../middleware/emailVerification');

// Email verification routes
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', auth, async (req, res, next) => {
  try {
    await resendVerificationEmail(req, res, next);
    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;