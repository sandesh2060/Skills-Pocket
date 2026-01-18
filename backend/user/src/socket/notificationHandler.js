// ============================================
// FILE: backend/user/src/socket/notificationHandler.js
// ============================================
const logger = require('../utils/logger');

const handleNotificationEvents = (socket, io) => {
  // User comes online
  socket.on('user_online', () => {
    // Broadcast to all users that this user is online
    socket.broadcast.emit('user_status_change', {
      userId: socket.userId,
      status: 'online',
      lastSeen: new Date(),
    });
    logger.info(`User ${socket.userId} is online`);
  });

  // User goes offline (handled in disconnect)
  socket.on('disconnect', () => {
    // Broadcast to all users that this user is offline
    io.emit('user_status_change', {
      userId: socket.userId,
      status: 'offline',
      lastSeen: new Date(),
    });
  });

  // Notification events
  socket.on('send_notification', (data) => {
    const { recipientId, type, message, metadata } = data;
    
    io.to(recipientId).emit('new_notification', {
      type,
      message,
      metadata,
      senderId: socket.userId,
      timestamp: new Date(),
    });
  });
};

module.exports = { handleNotificationEvents };