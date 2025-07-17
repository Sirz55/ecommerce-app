const nodemailer = require('nodemailer');
const logger = require('../config/logger').logger;

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS // ✅ FIXED ENV VARIABLE NAME
  }  
});

// Test connection
transporter.verify((error, success) => {
  if (error) {
    logger.error('SMTP connection error:', error);
  } else {
    logger.info('SMTP connection ready');
  }
});

// Email templates
const emailTemplates = {
  ORDER_CONFIRMATION: 'order-confirmation',
  ORDER_SHIPPED: 'order-shipped',
  ORDER_DELIVERED: 'order-delivered',
  PASSWORD_RESET: 'password-reset',
  WELCOME: 'welcome'
};

const sendEmail = async ({
  to,
  subject,
  template,
  data = {},
  from = process.env.SMTP_FROM || 'noreply@ecommerce.com'
}) => {
  try {
    const mailOptions = {
      from,
      to,
      subject,
      template,
      context: data
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully: ${subject}`);
    return result;
  } catch (error) {
    logger.error('Email sending error:', error);
    throw error;
  }
};

module.exports = {
  transporter,
  emailTemplates,
  sendEmail
};
