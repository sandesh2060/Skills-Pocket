// ============================================
// FILE: backend/admin/src/routes/supportRoutes.js
// ✅ FIXED: Removed duplicate /support prefix
// ============================================
const express = require('express');
const router = express.Router();
const {
  getSupportTickets,
  getTicketById,
  updateTicketStatus,
  respondToTicket
} = require('../controllers/supportController');
const { adminAuth } = require('../middlewares/adminAuth');

// All routes require admin authentication
router.use(adminAuth);

// ✅ FIXED: Routes are now /tickets instead of /support/tickets
// Because app.js already mounts this at /api/admin/support
// Final URL: /api/admin/support/tickets ✅
router.get('/tickets', getSupportTickets);
router.get('/tickets/:ticketId', getTicketById);
router.put('/tickets/:ticketId/status', updateTicketStatus);
router.post('/tickets/:ticketId/respond', respondToTicket);

module.exports = router;