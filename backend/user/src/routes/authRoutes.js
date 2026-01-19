// ============================================
// FILE: backend/user/src/routes/authRoutes.js
// FIXED - Corrected function names
// ============================================
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  register,
  login,
  logout,
  getMe, // ✅ FIXED: Changed from getCurrentUser to getMe
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validator');
const { authLimiter } = require('../middlewares/rateLimiter');

// ============================================
// VALIDATION RULES
// ============================================

const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  body('role').isIn(['client', 'freelancer']).withMessage('Invalid role'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain uppercase, lowercase, and number'),
];

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

router.post('/register', authLimiter, registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================

router.post('/logout', protect, logout);
router.get('/me', protect, getMe); // ✅ FIXED: Using getMe instead of getCurrentUser
router.put('/change-password', protect, changePasswordValidation, validate, changePassword);

module.exports = router;