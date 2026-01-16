
// ============================================
// FILE: backend/admin/src/routes/analyticsRoutes.js
// ============================================
const express = require('express');
const {
  getPlatformAnalytics,
  getFinancialAnalytics,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middlewares/adminAuth');

const router = express.Router();

router.use(protect, authorize('view_analytics'));

router.get('/', getPlatformAnalytics);
router.get('/financial', getFinancialAnalytics);

module.exports = router;