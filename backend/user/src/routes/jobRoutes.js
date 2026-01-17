// ============================================
// FILE: backend/user/src/routes/jobRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// ⚠️ CRITICAL: Specific routes MUST come BEFORE parameterized routes
// Place /my-jobs BEFORE /:id to prevent route collision

// Public routes
router.get('/', getAllJobs);

// Protected routes - MUST be defined before /:id route
router.use(protect);
router.get('/my-jobs', authorize('client'), getMyJobs); // ✅ This MUST come before /:id
router.post('/', authorize('client'), createJob);

// Parameterized routes - MUST come AFTER specific routes
router.get('/:id', getJobById); // ✅ This catches everything else
router.put('/:id', authorize('client'), updateJob);
router.delete('/:id', authorize('client'), deleteJob);

module.exports = router;