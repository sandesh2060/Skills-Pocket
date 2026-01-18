// ============================================
// FILE: backend/user/src/routes/proposalRoutes.js
// PRODUCTION-READY - Proposal routes
// ============================================
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
  submitProposal,
  getJobProposals,
  getMyProposals,
  acceptProposal,
  rejectProposal,
  withdrawProposal,
} = require('../controllers/proposalController');

// All routes require authentication
router.use(protect);

// Freelancer routes
router.post('/', authorize('freelancer'), submitProposal);
router.get('/my-proposals', authorize('freelancer'), getMyProposals);
router.delete('/:id', authorize('freelancer'), withdrawProposal);

// Client routes
router.get('/job/:jobId', authorize('client'), getJobProposals);
router.put('/:id/accept', authorize('client'), acceptProposal);
router.put('/:id/reject', authorize('client'), rejectProposal);

module.exports = router;