
// ============================================
// FILE: backend/admin/src/routes/jobManagementRoutes.js
// ============================================
const express = require('express');
const {
  getAllJobs,
  deleteJob,
  toggleJobFeature,
} = require('../controllers/jobManagementController');
const { protect, authorize } = require('../middlewares/adminAuth');

const router = express.Router();

router.use(protect, authorize('manage_jobs'));

router.get('/', getAllJobs);
router.delete('/:jobId', deleteJob);
router.put('/:jobId/feature', toggleJobFeature);

module.exports = router;