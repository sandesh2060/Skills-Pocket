// ============================================
// FILE: backend/user/src/routes/reviewRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const {
  createReview,
  getUserReviews,
  getJobReviews,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/user/:userId', getUserReviews);
router.get('/job/:jobId', getJobReviews);

router.use(protect);
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

module.exports = router;