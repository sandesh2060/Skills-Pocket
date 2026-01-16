// ============================================
// FILE: backend/user/src/routes/transactionRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const {
  getWallet,
  getTransactionHistory,
  createPaymentIntent,
  releasePayment,
  requestWithdrawal,
  getTransactionById,
} = require('../controllers/transactionController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/wallet', getWallet);
router.get('/', getTransactionHistory);
router.get('/:id', getTransactionById);
router.post('/payment-intent', authorize('client'), createPaymentIntent);
router.post('/release', authorize('client'), releasePayment);
router.post('/withdraw', authorize('freelancer'), requestWithdrawal);

module.exports = router;