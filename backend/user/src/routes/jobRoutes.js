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

router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Protected routes
router.use(protect);
router.post('/', authorize('client'), createJob);
router.get('/my-jobs', authorize('client'), getMyJobs);
router.put('/:id', authorize('client'), updateJob);
router.delete('/:id', authorize('client'), deleteJob);

module.exports = router;