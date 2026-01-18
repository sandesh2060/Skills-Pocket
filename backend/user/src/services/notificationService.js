// ============================================
// FILE: backend/user/src/services/notificationService.js
// OPTIONAL - Simple notification service
// ============================================
const Notification = require('../models/Notification');
const logger = require('../utils/logger');

/**
 * Create a notification for a user
 * @param {Object} params - Notification parameters
 * @param {String} params.user - User ID to notify
 * @param {String} params.type - Notification type (proposal_received, proposal_accepted, etc.)
 * @param {String} params.title - Notification title
 * @param {String} params.message - Notification message
 * @param {String} params.link - Optional link to related resource
 */
exports.createNotification = async ({ user, type, title, message, link }) => {
  try {
    // If you have a Notification model, use it
    const notification = await Notification.create({
      user,
      type,
      title,
      message,
      link,
      read: false,
      createdAt: new Date(),
    });

    logger.info(`Notification created for user ${user}`, { type, title });
    return notification;
  } catch (error) {
    // Don't fail the main operation if notification fails
    logger.warn(`Notification creation failed: ${error.message}`, {
      user,
      type,
      title,
    });
    return null;
  }
};

/**
 * Get notifications for a user
 * @param {String} userId - User ID
 * @param {Object} options - Query options (limit, skip, unreadOnly)
 */
exports.getUserNotifications = async (userId, options = {}) => {
  try {
    const { limit = 20, skip = 0, unreadOnly = false } = options;
    
    const query = { user: userId };
    if (unreadOnly) {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ user: userId, read: false });

    return {
      notifications,
      total,
      unreadCount,
    };
  } catch (error) {
    logger.error(`Get notifications error: ${error.message}`, { userId });
    throw error;
  }
};

/**
 * Mark notification as read
 * @param {String} notificationId - Notification ID
 * @param {String} userId - User ID (for authorization)
 */
exports.markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      throw new Error('Notification not found or unauthorized');
    }

    return notification;
  } catch (error) {
    logger.error(`Mark as read error: ${error.message}`, { notificationId, userId });
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 * @param {String} userId - User ID
 */
exports.markAllAsRead = async (userId) => {
  try {
    const result = await Notification.updateMany(
      { user: userId, read: false },
      { read: true }
    );

    logger.info(`Marked ${result.modifiedCount} notifications as read for user ${userId}`);
    return result;
  } catch (error) {
    logger.error(`Mark all as read error: ${error.message}`, { userId });
    throw error;
  }
};

/**
 * Delete notification
 * @param {String} notificationId - Notification ID
 * @param {String} userId - User ID (for authorization)
 */
exports.deleteNotification = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      user: userId,
    });

    if (!notification) {
      throw new Error('Notification not found or unauthorized');
    }

    return notification;
  } catch (error) {
    logger.error(`Delete notification error: ${error.message}`, { notificationId, userId });
    throw error;
  }
};