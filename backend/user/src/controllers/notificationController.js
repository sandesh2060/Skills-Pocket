// ============================================
// FILE: backend/user/src/controllers/notificationController.js
// ============================================
const Notification = require('../models/Notification');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * @desc    Get all notifications for current user
 * @route   GET /api/notifications
 * @access  Private
 */
exports.getNotifications = async (req, res) => {
  try {
    const { limit = 20, skip = 0, isRead } = req.query;
    
    const query = { user: req.user._id };
    
    // Filter by read status if provided
    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean();

    const total = await Notification.countDocuments(query);

    res.json({
      success: true,
      data: {
        notifications,
        total,
        hasMore: parseInt(skip) + notifications.length < total,
      },
    });
  } catch (error) {
    logger.error(`Get notifications error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message,
    });
  }
};

/**
 * @desc    Get unread notification count
 * @route   GET /api/notifications/unread-count
 * @access  Private
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    res.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    logger.error(`Get unread count error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count',
      error: error.message,
    });
  }
};

/**
 * @desc    Mark notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { 
        _id: req.params.id, 
        user: req.user._id 
      },
      { 
        isRead: true, 
        readAt: new Date() 
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.json({
      success: true,
      data: { notification },
    });
  } catch (error) {
    logger.error(`Mark as read error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message,
    });
  }
};

/**
 * @desc    Mark all notifications as read
 * @route   PATCH /api/notifications/mark-all-read
 * @access  Private
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { 
        user: req.user._id, 
        isRead: false 
      },
      { 
        isRead: true, 
        readAt: new Date() 
      }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read',
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    logger.error(`Mark all as read error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error marking all as read',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete notification error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message,
    });
  }
};

/**
 * @desc    Create a notification (system/admin use)
 * @route   POST /api/notifications
 * @access  Private
 */
exports.createNotification = async (req, res) => {
  try {
    const { user, type, title, message, link, data } = req.body;

    // Validation
    if (!user || !type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide user, type, title, and message',
      });
    }

    const notification = await Notification.create({
      user,
      type,
      title,
      message,
      link,
      data,
    });

    res.status(201).json({
      success: true,
      data: { notification },
    });
  } catch (error) {
    logger.error(`Create notification error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error creating notification',
      error: error.message,
    });
  }
};

/**
 * @desc    Get notification preferences
 * @route   GET /api/notifications/preferences
 * @access  Private
 */
exports.getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notificationPreferences');
    
    const defaultPreferences = {
      email: true,
      push: true,
      sms: false,
      proposalUpdates: true,
      messages: true,
      payments: true,
      jobAlerts: true,
      marketing: false,
    };

    res.json({
      success: true,
      data: {
        preferences: user.notificationPreferences || defaultPreferences,
      },
    });
  } catch (error) {
    logger.error(`Get preferences error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching preferences',
      error: error.message,
    });
  }
};

/**
 * @desc    Update notification preferences
 * @route   PUT /api/notifications/preferences
 * @access  Private
 */
exports.updatePreferences = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { notificationPreferences: req.body },
      { new: true, runValidators: true }
    ).select('notificationPreferences');

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: { 
        preferences: user.notificationPreferences 
      },
    });
  } catch (error) {
    logger.error(`Update preferences error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating preferences',
      error: error.message,
    });
  }
};