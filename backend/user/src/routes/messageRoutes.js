// ============================================
// FILE: backend/user/src/routes/messageRoutes.js
// UPDATED VERSION - Matches controller functions
// ============================================
const express = require('express');
const router = express.Router();
const {
  getOrCreateConversation,
  sendMessage,
  getConversations,
  getConversationMessages,
  markAsRead,
  uploadFile,
} = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadLimiter } = require('../middlewares/rateLimiter');
const upload = require('../middlewares/upload');

// Apply authentication middleware to all routes
router.use(protect);

// Conversation routes
router.post('/conversations', getOrCreateConversation); // NEW: Get or create conversation
router.get('/conversations', getConversations); // Get all conversations
router.get('/conversation/:conversationId', getConversationMessages); // Get messages from conversation

// Message routes
router.post('/', sendMessage); // Send message
router.put('/conversation/:conversationId/read', markAsRead); // Mark as read

// File upload
router.post('/upload', uploadLimiter, upload.single('file'), uploadFile);

module.exports = router;