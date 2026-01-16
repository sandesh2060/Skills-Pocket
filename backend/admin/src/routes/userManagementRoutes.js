// ============================================
// FILE: backend/admin/src/routes/userManagementRoutes.js
// ============================================
const express = require('express');
const {
  getAllUsers,
  getUserById,
  toggleUserSuspension,
  deleteUser,
  verifyUser,
} = require('../controllers/userManagementController');
const { protect, authorize } = require('../middlewares/adminAuth');

const router = express.Router();

router.use(protect);

router.get('/', authorize('manage_users'), getAllUsers);
router.get('/:userId', authorize('manage_users'), getUserById);
router.put('/:userId/suspend', authorize('manage_users'), toggleUserSuspension);
router.put('/:userId/verify', authorize('manage_users'), verifyUser);
router.delete('/:userId', authorize('manage_admins'), deleteUser); // Super admin only

module.exports = router;

