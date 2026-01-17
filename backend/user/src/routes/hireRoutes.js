// ============================================
// FILE: backend/user/src/routes/hireRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createHireRequest,
  getMyHireRequests,
  getReceivedHireRequests,
  getHireRequestById,
  acceptHireRequest,
  rejectHireRequest,
  withdrawHireRequest,
} = require('../controllers/hireController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validator');

// All routes require authentication
router.use(protect);

// Validation rules
const createHireRequestValidation = [
  body('freelancerId').notEmpty().withMessage('Freelancer ID is required'),
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('budget.amount').isNumeric().withMessage('Budget amount must be a number'),
  body('budget.type').isIn(['fixed', 'hourly']).withMessage('Budget type must be fixed or hourly'),
  body('duration.value').isNumeric().withMessage('Duration value must be a number'),
  body('duration.unit').isIn(['days', 'weeks', 'months']).withMessage('Invalid duration unit'),
];

// Client routes
router.post(
  '/',
  authorize('client'),
  createHireRequestValidation,
  validate,
  createHireRequest
);
router.get('/client', authorize('client'), getMyHireRequests);
router.delete('/:id', authorize('client'), withdrawHireRequest);

// Freelancer routes
router.get('/freelancer', authorize('freelancer'), getReceivedHireRequests);
router.put('/:id/accept', authorize('freelancer'), acceptHireRequest);
router.put('/:id/reject', authorize('freelancer'), rejectHireRequest);

// Common routes (both client and freelancer)
router.get('/:id', getHireRequestById);

module.exports = router;