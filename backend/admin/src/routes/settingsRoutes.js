// ============================================
// FILE: backend/admin/src/routes/settingsRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  getPlatformSettings,
  updatePlatformSettings,
  getNotificationSettings,
  updateNotificationSettings,
  getSecuritySettings,
  updateSecuritySettings,
} = require('../controllers/settingsController');
const { adminAuth } = require('../middlewares/adminAuth');

// All routes require admin authentication
router.use(adminAuth);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', changePassword);

// Platform settings
router.get('/platform', getPlatformSettings);
router.put('/platform', updatePlatformSettings);

// Notification settings
router.get('/notifications', getNotificationSettings);
router.put('/notifications', updateNotificationSettings);

// Security settings
router.get('/security', getSecuritySettings);
router.put('/security', updateSecuritySettings);

module.exports = router;