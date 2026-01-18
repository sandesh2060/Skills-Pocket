// ============================================
// FILE: backend/user/src/controllers/messageController.js
// CORRECTED VERSION - Works with separate Message and Conversation models
// ============================================
const { Message, Conversation } = require('../models/Message');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

/**
 * Get or create a conversation with a specific user
 * POST /api/messages/conversations
 */
exports.getOrCreateConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    const currentUserId = req.user._id;

    // Validation
    if (!participantId) {
      return res.status(400).json({
        success: false,
        message: 'Participant ID is required'
      });
    }

    if (participantId === currentUserId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create conversation with yourself'
      });
    }

    // Check if participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if conversation already exists between these users
    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, participantId] },
      $expr: { $eq: [{ $size: "$participants" }, 2] } // Ensure only 2 participants
    }).populate('participants', 'firstName lastName email profilePicture role company');

    // If conversation doesn't exist, create it
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [currentUserId, participantId],
        lastMessage: null,
        unreadCount: {
          [currentUserId]: 0,
          [participantId]: 0
        }
      });

      // Populate the participants
      conversation = await Conversation.findById(conversation._id)
        .populate('participants', 'firstName lastName email profilePicture role company');
    }

    res.status(200).json({
      success: true,
      message: 'Conversation ready',
      data: {
        conversation
      }
    });

  } catch (error) {
    console.error('Error in getOrCreateConversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get or create conversation',
      error: error.message
    });
  }
};

/**
 * Get all conversations for current user
 * GET /api/messages/conversations
 */
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId
    })
      .populate('participants', 'firstName lastName email profilePicture role company')
      .populate('lastMessage.sender', 'firstName lastName profilePicture')
      .sort({ updatedAt: -1 });

    // Format conversations with unread count
    const formattedConversations = conversations.map(conv => {
      const unreadCount = conv.unreadCount?.get(userId.toString()) || 0;
      
      return {
        _id: conv._id,
        participants: conv.participants,
        lastMessage: conv.lastMessage?.text || null,
        lastMessageAt: conv.lastMessage?.timestamp || conv.updatedAt,
        unreadCount
      };
    });

    res.status(200).json({
      success: true,
      data: {
        conversations: formattedConversations
      }
    });

  } catch (error) {
    console.error('Error in getConversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations',
      error: error.message
    });
  }
};

/**
 * Get messages from a specific conversation
 * GET /api/messages/conversation/:conversationId
 */
exports.getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    // Find conversation and verify user is participant
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      p => p.toString() === userId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this conversation'
      });
    }

    // Get paginated messages
    const skip = (page - 1) * limit;
    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'firstName lastName profilePicture')
      .populate('recipient', 'firstName lastName profilePicture')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const totalMessages = await Message.countDocuments({ conversation: conversationId });

    // Format messages
    const formattedMessages = messages.map(msg => ({
      _id: msg._id,
      sender: msg.sender,
      recipient: msg.recipient,
      content: msg.text,
      attachments: msg.attachments,
      read: msg.isRead,
      createdAt: msg.createdAt
    }));

    res.status(200).json({
      success: true,
      data: {
        messages: formattedMessages,
        pagination: {
          currentPage: page,
          totalMessages,
          totalPages: Math.ceil(totalMessages / limit),
          hasMore: skip + messages.length < totalMessages
        }
      }
    });

  } catch (error) {
    console.error('Error in getConversationMessages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};

/**
 * Send a message in a conversation
 * POST /api/messages
 */
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, content, attachments } = req.body;
    const senderId = req.user._id;

    // Validation
    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: 'Conversation ID is required'
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    // Find conversation
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      p => p.toString() === senderId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this conversation'
      });
    }

    // Get recipient (the other participant)
    const recipientId = conversation.participants.find(
      p => p.toString() !== senderId.toString()
    );

    // Create new message
    const newMessage = await Message.create({
      conversation: conversationId,
      sender: senderId,
      recipient: recipientId,
      text: content.trim(),
      attachments: attachments || [],
      isRead: false
    });

    // Update conversation
    conversation.lastMessage = {
      text: content.trim(),
      sender: senderId,
      timestamp: new Date()
    };
    
    // Increment unread count for recipient
    if (!conversation.unreadCount) {
      conversation.unreadCount = new Map();
    }
    const currentUnread = conversation.unreadCount.get(recipientId.toString()) || 0;
    conversation.unreadCount.set(recipientId.toString(), currentUnread + 1);
    
    conversation.updatedAt = new Date();
    await conversation.save();

    // Populate sender info for response
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'firstName lastName profilePicture')
      .populate('recipient', 'firstName lastName profilePicture');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message: {
          _id: populatedMessage._id,
          sender: populatedMessage.sender,
          recipient: populatedMessage.recipient,
          content: populatedMessage.text,
          attachments: populatedMessage.attachments,
          read: populatedMessage.isRead,
          createdAt: populatedMessage.createdAt
        }
      }
    });

  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

/**
 * Mark conversation as read
 * PUT /api/messages/conversation/:conversationId/read
 */
exports.markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      p => p.toString() === userId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this conversation'
      });
    }

    // Mark all messages from other users as read
    await Message.updateMany(
      {
        conversation: conversationId,
        recipient: userId,
        isRead: false
      },
      {
        $set: {
          isRead: true,
          readAt: new Date()
        }
      }
    );

    // Reset unread count for this user
    if (!conversation.unreadCount) {
      conversation.unreadCount = new Map();
    }
    conversation.unreadCount.set(userId.toString(), 0);
    await conversation.save();

    res.status(200).json({
      success: true,
      message: 'Conversation marked as read'
    });

  } catch (error) {
    console.error('Error in markAsRead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark as read',
      error: error.message
    });
  }
};

/**
 * Upload file attachment
 * POST /api/messages/upload
 */
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // If cloudinary is configured, upload there
    if (cloudinary && cloudinary.config().cloud_name) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'skillpocket/messages',
        resource_type: 'auto'
      });

      res.status(200).json({
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          fileName: req.file.originalname,
          fileType: req.file.mimetype,
          fileSize: req.file.size
        }
      });
    } else {
      // If no cloudinary, return local file path
      res.status(200).json({
        success: true,
        data: {
          url: `/uploads/${req.file.filename}`,
          fileName: req.file.originalname,
          fileType: req.file.mimetype,
          fileSize: req.file.size
        }
      });
    }

  } catch (error) {
    console.error('Error in uploadFile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error.message
    });
  }
};