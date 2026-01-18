// ============================================
// FILE: backend/user/src/routes/userRoutes.js
// PRODUCTION-READY - Complete profile management routes
// ============================================
const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getUserById,
  uploadProfilePicture,
  addSkill,
  removeSkill,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  getDashboardStats,
  deactivateAccount,
  updateNotificationPreferences,
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// ⚠️ CRITICAL: Specific routes MUST come BEFORE parameterized routes
// Protected routes - Apply protect middleware to all routes below
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/profile-picture', upload.single('profilePicture'), uploadProfilePicture);

// Skills management
router.post('/skills', addSkill);
router.delete('/skills/:skill', removeSkill);

// Portfolio management
router.post('/portfolio', addPortfolioItem);
router.put('/portfolio/:id', updatePortfolioItem);
router.delete('/portfolio/:id', deletePortfolioItem);

// Account management
router.post('/deactivate', deactivateAccount);
router.put('/notifications', updateNotificationPreferences);

// Client-specific routes
router.get('/dashboard/stats', authorize('client'), getDashboardStats);

// Public profile by ID - MUST come LAST to avoid catching other routes
router.get('/:id', getUserById);

module.exports = router;