const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Register error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    // Placeholder logout logic
    res.json({ message: 'Logout successful' });
  } catch (err) {
    res.status(500).json({ message: 'Logout error', error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // Placeholder logic for sending password reset email
    res.json({ message: `Password reset link sent to ${email}` });
  } catch (err) {
    res.status(500).json({ message: 'Forgot password error', error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;
    // Placeholder logic for password reset
    res.json({ message: `Password reset with token ${resetToken}` });
  } catch (err) {
    res.status(500).json({ message: 'Reset password error', error: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    // Placeholder logic for updating password
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Update password error', error: err.message });
  }
};

exports.updateDetails = async (req, res) => {
  try {
    const { name, email } = req.body;
    // Placeholder logic for updating user details
    res.json({ message: 'User details updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Update details error', error: err.message });
  }
};
