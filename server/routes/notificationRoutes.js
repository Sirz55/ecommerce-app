const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Notification = require('../models/Notification');
const logger = require('../config/logger').logger;

// Get user notifications
router.get('/', protect, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type, isRead } = req.query;

    const query = { user: req.user.id };
    if (type) query.type = type;
    if (isRead !== undefined) query.isRead = isRead === 'true';

    const notifications = await Notification.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Notification.countDocuments(query);

    res.status(200).json({
      notifications,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalResults: count
    });
  } catch (error) {
    next(error);
  }
});

// Mark notification as read
router.put('/:id/read', protect, async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.markAsRead();
    await notification.save();

    logger.info(`Notification marked as read: ${notification._id}`);
    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
});

// Mark all notifications as read
router.put('/read-all', protect, async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
      isRead: false
    });

    await Promise.all(
      notifications.map(notification => {
        notification.markAsRead();
        return notification.save();
      })
    );

    logger.info(`All notifications marked as read for user: ${req.user.id}`);
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
});

// Get unread notification count
router.get('/unread-count', protect, async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      isRead: false
    });

    res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
});

// Get notification by ID
router.get('/:id', protect, async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
});

// Delete notification
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.remove();
    logger.info(`Notification deleted: ${notification._id}`);
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Create notification (admin only)
router.post('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const notification = await Notification.create(req.body);
    logger.info(`Notification created: ${notification._id}`);
    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
});

// Get notifications by type (admin only)
router.get('/type/:type', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const notifications = await Notification.find({ type: req.params.type })
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Notification.countDocuments({ type: req.params.type });

    res.status(200).json({
      notifications,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalResults: count
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
