// ============================================
// FILE: backend/user/src/routes/transactionRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const {
  getMyTransactions,
  getTransactionById,
  createTransaction,
  updateTransactionStatus,
  getFinancialSummary,
} = require('../controllers/transactionController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes are protected
router.use(protect);

// Specific routes BEFORE parameterized routes
router.get('/my-transactions', getMyTransactions);
router.get('/summary', getFinancialSummary);
router.post('/', createTransaction);

// Parameterized routes LAST
router.get('/:id', getTransactionById);
router.put('/:id/status', updateTransactionStatus);

module.exports = router;