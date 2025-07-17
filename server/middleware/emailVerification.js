const crypto = require('crypto');
const { sendEmail } = require('../services/notificationService');
const logger = require('../config/logger').logger;
const { generateToken } = require('../config/security');

// Generate verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send verification email
const sendVerificationEmail = async (user) => {
  const verificationToken = generateVerificationToken();
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email Address',
      template: 'email-verification',
      context: {
        name: user.name,
        verificationUrl,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    });

    logger.info(`Verification email sent to ${user.email}`);
    return verificationToken;
  } catch (error) {
    logger.error('Error sending verification email:', error);
    throw error;
  }
};

// Verify email middleware
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    // Check if token has expired
    if (Date.now() > user.verificationExpires) {
      return res.status(400).json({
        success: false,
        message: 'Verification token has expired'
      });
    }

    // Mark email as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    logger.info(`Email verified for user: ${user.email}`);
    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    logger.error('Email verification error:', error);
    next(error);
  }
};

// Check email verification middleware
const checkEmailVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email address'
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Resend verification email
const resendVerificationEmail = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    user.verificationToken = verificationToken;
    user.verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await user.save();

    // Send new verification email
    await sendVerificationEmail(user);

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyEmail,
  checkEmailVerification,
  resendVerificationEmail
};
