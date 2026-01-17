// ============================================
// FILE: backend/user/src/socket/notificationHandler.js
// ============================================
const logger = require('../utils/logger');

const handleNotificationEvents = (socket, io) => {
  // Subscribe to notifications
  socket.on('subscribe_notifications', () => {
    socket.join(`notifications_${socket.userId}`);
    logger.info(`User ${socket.userId} subscribed to notifications`);
  });

  // Unsubscribe from notifications
  socket.on('unsubscribe_notifications', () => {
    socket.leave(`notifications_${socket.userId}`);
    logger.info(`User ${socket.userId} unsubscribed from notifications`);
  });

  // Mark notification as read
  socket.on('mark_notification_read', (notificationId) => {
    logger.info(`Notification ${notificationId} marked as read by user ${socket.userId}`);
  });
};

// Helper function to emit notification to user
const emitNotification = (io, userId, notification) => {
  io.to(userId).emit('notification', notification);
  io.to(`notifications_${userId}`).emit('notification', notification);
};

module.exports = { handleNotificationEvents, emitNotification };