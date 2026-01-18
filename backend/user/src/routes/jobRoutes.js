// ============================================
// FILE: backend/user/src/routes/jobRoutes.js
// FIXED VERSION - Proper route ordering & error handling
// ============================================
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');

// Import ALL controller functions - add fallback for missing ones
let jobController;
try {
  jobController = require('../controllers/jobController');
} catch (error) {
  console.error('Error loading job controller:', error.message);
  jobController = {};
}

// Destructure with fallbacks to prevent undefined errors
const {
  createJob = (req, res) => res.status(501).json({ success: false, message: 'createJob not implemented' }),
  getAllJobs = (req, res) => res.status(501).json({ success: false, message: 'getAllJobs not implemented' }),
  getJobById = (req, res) => res.status(501).json({ success: false, message: 'getJobById not implemented' }),
  updateJob = (req, res) => res.status(501).json({ success: false, message: 'updateJob not implemented' }),
  deleteJob = (req, res) => res.status(501).json({ success: false, message: 'deleteJob not implemented' }),
  getMyJobs = (req, res) => res.status(501).json({ success: false, message: 'getMyJobs not implemented' }),
  getFreelancerJobs = (req, res) => res.status(501).json({ success: false, message: 'getFreelancerJobs not implemented' }),
  getFreelancerActiveJobsCount = (req, res) => res.status(501).json({ success: false, message: 'getFreelancerActiveJobsCount not implemented' }),
  updateMilestoneStatus = (req, res) => res.status(501).json({ success: false, message: 'updateMilestoneStatus not implemented' }),
} = jobController;

// ============================================
// PUBLIC ROUTES
// ============================================
router.get('/', getAllJobs);

// ============================================
// PROTECTED ROUTES (All routes below require authentication)
// ============================================
router.use(protect);

// ============================================
// CLIENT-SPECIFIC ROUTES
// ============================================
router.get('/my-jobs', authorize('client'), getMyJobs);
router.post('/', authorize('client'), createJob);

// ============================================
// FREELANCER-SPECIFIC ROUTES
// IMPORTANT: These MUST come BEFORE the /:id route
// ============================================
router.get('/freelancer/my-jobs', authorize('freelancer'), getFreelancerJobs);
router.get('/freelancer/active-count', authorize('freelancer'), getFreelancerActiveJobsCount);

// ============================================
// MILESTONE ROUTES
// ============================================
router.patch('/:jobId/milestones/:milestoneId', authorize('freelancer'), updateMilestoneStatus);

// ============================================
// PARAMETERIZED ROUTES
// IMPORTANT: These MUST come LAST to avoid route conflicts
// ============================================
router.get('/:id', getJobById);
router.put('/:id', authorize('client'), updateJob);
router.delete('/:id', authorize('client'), deleteJob);

module.exports = router;