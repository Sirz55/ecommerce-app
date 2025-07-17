const crypto = require('crypto');

// Generate secure token
const generateToken = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate CSRF token
const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = {
  generateToken,
  generateCsrfToken
};
