// ============================================
// FILE: backend/user/src/socket/messageHandler.js
// ============================================
const logger = require('../utils/logger');

const handleMessageEvents = (socket, io) => {
  // Join conversation room
  socket.on('join_conversation', (conversationId) => {
    socket.join(`conversation_${conversationId}`);
    logger.info(`User ${socket.userId} joined conversation ${conversationId}`);
  });

  // Leave conversation room
  socket.on('leave_conversation', (conversationId) => {
    socket.leave(`conversation_${conversationId}`);
    logger.info(`User ${socket.userId} left conversation ${conversationId}`);
  });

  // Send message
  socket.on('send_message', (data) => {
    const { conversationId, recipientId, message } = data;
    
    // Emit to recipient
    io.to(recipientId).emit('new_message', {
      conversationId,
      message,
      senderId: socket.userId,
    });
    
    // Emit to conversation room
    io.to(`conversation_${conversationId}`).emit('message_sent', {
      conversationId,
      message,
      senderId: socket.userId,
    });
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { conversationId, recipientId } = data;
    io.to(recipientId).emit('user_typing', {
      conversationId,
      userId: socket.userId,
    });
  });

  // Stop typing indicator
  socket.on('stop_typing', (data) => {
    const { conversationId, recipientId } = data;
    io.to(recipientId).emit('user_stop_typing', {
      conversationId,
      userId: socket.userId,
    });
  });

  // Mark as read
  socket.on('mark_read', (data) => {
    const { conversationId, recipientId } = data;
    io.to(recipientId).emit('messages_read', {
      conversationId,
      userId: socket.userId,
    });
  });
};

module.exports = { handleMessageEvents };