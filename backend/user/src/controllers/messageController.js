// ============================================
// FILE: backend/user/src/controllers/messageController.js
// ============================================
const { Message, Conversation } = require("../models/Message");
const { uploadToCloudinary } = require("../config/cloudinary");
const logger = require("../utils/logger");
const fs = require("fs");

// @desc    Send message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, text, jobId, conversationId } = req.body;

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    } else {
      conversation = await Conversation.findOne({
        participants: { $all: [req.user.id, recipientId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [req.user.id, recipientId],
          job: jobId,
          unreadCount: new Map([[recipientId, 1]]),
        });
      } else {
        const count = conversation.unreadCount.get(recipientId) || 0;
        conversation.unreadCount.set(recipientId, count + 1);
      }
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user.id,
      recipient: recipientId,
      text,
      job: jobId,
    });

    conversation.lastMessage = {
      text,
      sender: req.user.id,
      timestamp: Date.now(),
    };
    await conversation.save();

    await message.populate("sender", "firstName lastName profilePicture");

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    logger.error(`Send message error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// @desc    Get all conversations
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
    })
      .populate("participants", "firstName lastName profilePicture")
      .populate("lastMessage.sender", "firstName lastName")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    logger.error(`Get conversations error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
      error: error.message,
    });
  }
};

// @desc    Get messages in conversation
// @route   GET /api/messages/conversation/:conversationId
// @access  Private
exports.getConversationMessages = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const conversation = await Conversation.findById(req.params.conversationId);

    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this conversation",
      });
    }

    const [messages, total] = await Promise.all([
      Message.find({ conversation: req.params.conversationId })
        .populate("sender", "firstName lastName profilePicture")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Message.countDocuments({ conversation: req.params.conversationId }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        messages: messages.reverse(),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalMessages: total,
        },
      },
    });
  } catch (error) {
    logger.error(`Get conversation messages error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

// @desc    Mark conversation as read
// @route   PUT /api/messages/conversation/:conversationId/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);

    conversation.unreadCount.set(req.user.id, 0);
    await conversation.save();

    await Message.updateMany(
      {
        conversation: req.params.conversationId,
        recipient: req.user.id,
        isRead: false,
      },
      {
        isRead: true,
        readAt: Date.now(),
      }
    );

    res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    logger.error(`Mark as read error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to mark messages as read",
      error: error.message,
    });
  }
};

// @desc    Upload file attachment
// @route   POST /api/messages/upload
// @access  Private
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    const result = await uploadToCloudinary(req.file, "skillspocket/messages");
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
        fileName: req.file.originalname,
        fileType: result.format,
        size: result.size,
      },
    });
  } catch (error) {
    logger.error(`Upload file error: ${error.message}`);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({
      success: false,
      message: "Failed to upload file",
      error: error.message,
    });
  }
};
