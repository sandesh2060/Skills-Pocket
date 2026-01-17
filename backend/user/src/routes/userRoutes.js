// ============================================
// FILE: backend/user/src/routes/userRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getUserById,
  uploadProfilePicture,
  getDashboardStats,
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// ⚠️ CRITICAL: Specific routes MUST come BEFORE parameterized routes
// Place all specific paths (/profile, /dashboard/stats) BEFORE /:id

// Protected routes - MUST come BEFORE /:id route
router.use(protect);
router.get('/profile', getProfile); // ✅ This MUST come before /:id
router.put('/profile', updateProfile);
router.post('/profile-picture', upload.single('profilePicture'), uploadProfilePicture);

// Client-specific routes
router.get('/dashboard/stats', authorize('client'), getDashboardStats);

// Public routes with params - MUST come LAST
router.get('/:id', getUserById); // ✅ This catches everything else after auth routes

module.exports = router;