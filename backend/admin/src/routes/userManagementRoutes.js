// ============================================
// FILE 6: backend/admin/src/routes/userManagementRoutes.js
// FIXED: Consistent middleware usage
// ============================================
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  suspendUser,
  unsuspendUser,
  deleteUser,
  verifyUser,
} = require('../controllers/userManagementController');
const { adminAuth } = require('../middlewares/adminAuth');

// Use adminAuth consistently
router.get('/', adminAuth, getAllUsers);
router.get('/:id', adminAuth, getUserById);
router.patch('/:id/suspend', adminAuth, suspendUser);
router.patch('/:id/unsuspend', adminAuth, unsuspendUser);
router.patch('/:id/verify', adminAuth, verifyUser);
router.delete('/:id', adminAuth, deleteUser);

module.exports = router;
