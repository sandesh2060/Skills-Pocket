// ============================================
// FILE: backend/user/src/routes/proposalRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const {
  submitProposal,
  getJobProposals,
  getMyProposals,
  acceptProposal,
  rejectProposal,
  withdrawProposal,
} = require('../controllers/proposalController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', authorize('freelancer'), submitProposal);
router.get('/my-proposals', authorize('freelancer'), getMyProposals);
router.get('/job/:jobId', authorize('client'), getJobProposals);
router.put('/:id/accept', authorize('client'), acceptProposal);
router.put('/:id/reject', authorize('client'), rejectProposal);
router.delete('/:id', authorize('freelancer'), withdrawProposal);

module.exports = router;
