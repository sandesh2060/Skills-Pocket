// ============================================
// FILE: backend/admin/src/routes/analyticsRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { adminAuth } = require('../middlewares/adminAuth');

router.use(adminAuth);

router.get('/dashboard/stats', analyticsController.getDashboardStats);
router.get('/dashboard/revenue', analyticsController.getRevenueData);
router.get('/dashboard/job-distribution', analyticsController.getJobDistribution);

module.exports = router;