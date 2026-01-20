// ============================================
// FILE: backend/admin/src/routes/disputeRoutes.js
// Complete Dispute Routes
// ============================================
const express = require('express');
const router = express.Router();
const {
  getAllDisputes,
  getDisputeById,
  assignDispute,
  resolveDispute,
  updateDisputePriority,
  escalateDispute,
  closeDispute
} = require('../controllers/disputeController');
const { adminAuth } = require('../middlewares/adminAuth');

// All routes require admin authentication
router.use(adminAuth);

// Get all disputes with filters
router.get('/disputes', getAllDisputes);

// Get single dispute
router.get('/disputes/:disputeId', getDisputeById);

// Assign dispute to admin
router.post('/disputes/:disputeId/assign', assignDispute);

// Resolve dispute
router.post('/disputes/:disputeId/resolve', resolveDispute);

// Update priority
router.patch('/disputes/:disputeId/priority', updateDisputePriority);

// Escalate dispute
router.post('/disputes/:disputeId/escalate', escalateDispute);

// Close dispute
router.post('/disputes/:disputeId/close', closeDispute);

module.exports = router;