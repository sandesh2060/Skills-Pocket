// ============================================
// FILE: backend/user/src/socket/messageHandler.js
// ============================================
const { Message, Conversation } = require('../models/Message');
const logger = require('../utils/logger');

exports.handleMessageEvents = (socket, io) => {
  socket.on('send_message', async (data) => {
    try {
      const { conversationId, recipientId, text, jobId } = data;

      let conversation;
      if (conversationId) {
        conversation = await Conversation.findById(conversationId);
      } else {
        // Create or find conversation
        conversation = await Conversation.findOne({
          participants: { $all: [socket.userId, recipientId] },
        });

        if (!conversation) {
          conversation = await Conversation.create({
            participants: [socket.userId, recipientId],
            job: jobId,
          });
        }
      }

      const message = await Message.create({
        conversation: conversation._id,
        sender: socket.userId,
        recipient: recipientId,
        text,
        job: jobId,
      });

      await message.populate('sender', 'firstName lastName profilePicture');

      // Update conversation
      conversation.lastMessage = {
        text,
        sender: socket.userId,
        timestamp: Date.now(),
      };
      await conversation.save();

      // Emit to recipient
      io.to(recipientId).emit('new_message', message);

      // Emit to sender for confirmation
      socket.emit('message_sent', message);
    } catch (error) {
      logger.error(`Send message error: ${error.message}`);
      socket.emit('message_error', { error: error.message });
    }
  });

  socket.on('typing', ({ conversationId, recipientId }) => {
    io.to(recipientId).emit('user_typing', {
      conversationId,
      userId: socket.userId,
    });
  });

  socket.on('stop_typing', ({ conversationId, recipientId }) => {
    io.to(recipientId).emit('user_stop_typing', {
      conversationId,
      userId: socket.userId,
    });
  });
};