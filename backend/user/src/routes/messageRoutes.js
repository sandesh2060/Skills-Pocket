// ============================================
// FILE: backend/user/src/routes/messageRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversations,
  getConversationMessages,
  markAsRead,
  uploadFile,
} = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadLimiter } = require('../middlewares/rateLimiter');
const upload = require('../middlewares/upload');

router.use(protect);

router.get('/conversations', getConversations);
router.get('/conversation/:conversationId', getConversationMessages);
router.post('/', sendMessage);
router.post('/upload', uploadLimiter, upload.single('file'), uploadFile);
router.put('/conversation/:conversationId/read', markAsRead);

module.exports = router;