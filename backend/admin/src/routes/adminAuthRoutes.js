// ============================================
// FILE: backend/admin/src/routes/adminAuthRoutes.js
// ============================================
const express = require('express');
const { body } = require('express-validator');
const {
  login,
  getMe,
  logout,
  changePassword,
} = require('../controllers/adminAuthController');
const { protect } = require('../middlewares/adminAuth');
const { validate } = require('../middlewares/validator');

const router = express.Router();

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  login
);

// Get current admin
router.get('/me', protect, getMe);

// Logout
router.post('/logout', protect, logout);

// Change password
router.put(
  '/change-password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters'),
    validate,
  ],
  changePassword
);

module.exports = router;
