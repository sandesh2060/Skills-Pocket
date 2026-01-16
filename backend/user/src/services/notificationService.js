// ============================================
// FILE: backend/user/src/services/notificationService.js
// ============================================
const Notification = require('../models/Notification');
const { getIO } = require('../socket');

exports.createNotification = async ({ user, type, title, message, link, data }) => {
  try {
    const notification = await Notification.create({
      user,
      type,
      title,
      message,
      link,
      data,
    });

    // Emit real-time notification via Socket.io
    const io = getIO();
    if (io) {
      io.to(user.toString()).emit('notification', notification);
    }

    return notification;
  } catch (error) {
    throw error;
  }
};

exports.markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true, readAt: Date.now() },
      { new: true }
    );

    return notification;
  } catch (error) {
    throw error;
  }
};

exports.markAllAsRead = async (userId) => {
  try {
    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true, readAt: Date.now() }
    );
  } catch (error) {
    throw error;
  }
};
