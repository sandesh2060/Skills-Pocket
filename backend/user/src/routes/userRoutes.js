// ============================================
// FILE: backend/user/src/routes/userRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const {
  updateProfile,
  getUserById,
  uploadProfilePicture,
  updatePassword,
  addPortfolioItem,
  deletePortfolioItem,
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { uploadLimiter } = require('../middlewares/rateLimiter');
const upload = require('../middlewares/upload');

router.get('/:id', getUserById);

// Protected routes
router.use(protect);
router.put('/me', updateProfile);
router.put('/me/password', updatePassword);
router.post('/upload-profile-picture', uploadLimiter, upload.single('profilePicture'), uploadProfilePicture);
router.post('/portfolio', upload.single('image'), addPortfolioItem);
router.delete('/portfolio/:itemId', deletePortfolioItem);

module.exports = router;
