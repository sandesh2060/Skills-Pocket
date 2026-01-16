// ============================================
// FILE: backend/admin/src/routes/disputeRoutes.js
// ============================================
const express = require('express');
const {
  getAllDisputes,
  getDisputeById,
  assignDispute,
  resolveDispute,
  addDisputeMessage,
} = require('../controllers/disputeController');
const { protect, authorize } = require('../middlewares/adminAuth');

const router = express.Router();

router.use(protect, authorize('manage_disputes'));

router.get('/', getAllDisputes);
router.get('/:disputeId', getDisputeById);
router.put('/:disputeId/assign', assignDispute);
router.put('/:disputeId/resolve', resolveDispute);
router.post('/:disputeId/messages', addDisputeMessage);

module.exports = router;
