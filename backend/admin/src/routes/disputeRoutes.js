// ============================================
// FILE 5: backend/admin/src/routes/disputeRoutes.js
// FIXED: Proper route structure
// ============================================
const express = require('express');
const router = express.Router();
const disputeController = require('../controllers/disputeController');
const { adminAuth } = require('../middlewares/adminAuth');

router.use(adminAuth);

// Match the frontend's expected route
router.get('/disputes', disputeController.getSupportTickets);
router.get('/disputes/:ticketId', disputeController.getTicketById);
router.put('/disputes/:ticketId/status', disputeController.updateTicketStatus);
router.post('/disputes/:ticketId/respond', disputeController.respondToTicket);

module.exports = router;