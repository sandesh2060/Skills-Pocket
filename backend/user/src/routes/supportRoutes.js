// ============================================
// FILE: backend/user/src/routes/supportRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const {
  createTicket,
  getMyTickets,
  getTicketById,
  addMessage,
  closeTicket,
  rateTicket,
  getTicketStats,
} = require('../controllers/supportController');
const { protect } = require('../middlewares/authMiddleware');

// Apply protect middleware to all routes
router.use(protect);

// Ticket routes
router.post('/tickets', createTicket);
router.get('/tickets', getMyTickets);
router.get('/tickets/:id', getTicketById);
router.post('/tickets/:id/messages', addMessage);
router.put('/tickets/:id/close', closeTicket);
router.post('/tickets/:id/rate', rateTicket);

// Stats
router.get('/stats', getTicketStats);

module.exports = router;