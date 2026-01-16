// ============================================
// FILE: backend/user/src/socket/notificationHandler.js
// ============================================
const logger = require('../utils/logger');

exports.handleNotificationEvents = (socket, io) => {
  socket.on('mark_notification_read', async (notificationId) => {
    try {
      // Update notification status
      logger.info(`Notification ${notificationId} marked as read`);
    } catch (error) {
      logger.error(`Mark notification error: ${error.message}`);
    }
  });
};