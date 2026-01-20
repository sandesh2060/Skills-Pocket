// ============================================
// FILE: backend/admin/src/controllers/settingsController.js
// ============================================
const Admin = require('../models/Admin');
const PlatformSettings = require('../models/PlatformSettings');
const { sendResponse, sendError } = require('../utils/responseHandler');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');

/**
 * Get admin profile
 * GET /api/admin/settings/profile
 */
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    
    if (!admin) {
      return sendError(res, 'Admin not found', 404);
    }

    return sendResponse(res, admin, 'Profile fetched successfully', 200);
  } catch (error) {
    logger.error('Error fetching admin profile:', error);
    return sendError(res, 'Failed to fetch profile', 500);
  }
};

/**
 * Update admin profile
 * PUT /api/admin/settings/profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, profilePicture } = req.body;
    
    const admin = await Admin.findById(req.admin._id);
    
    if (!admin) {
      return sendError(res, 'Admin not found', 404);
    }

    // Check if email is being changed and if it already exists
    if (email && email !== admin.email) {
      const emailExists = await Admin.findOne({ email, _id: { $ne: admin._id } });
      if (emailExists) {
        return sendError(res, 'Email already in use', 400);
      }
    }

    // Update fields
    if (firstName) admin.firstName = firstName;
    if (lastName) admin.lastName = lastName;
    if (email) admin.email = email;
    if (profilePicture !== undefined) admin.profilePicture = profilePicture;

    await admin.save();

    logger.info(`Admin profile updated: ${admin.email}`);

    return sendResponse(res, admin, 'Profile updated successfully', 200);
  } catch (error) {
    logger.error('Error updating admin profile:', error);
    return sendError(res, 'Failed to update profile', 500);
  }
};

/**
 * Change password
 * PUT /api/admin/settings/password
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return sendError(res, 'All password fields are required', 400);
    }

    if (newPassword !== confirmPassword) {
      return sendError(res, 'New passwords do not match', 400);
    }

    if (newPassword.length < 8) {
      return sendError(res, 'Password must be at least 8 characters', 400);
    }

    const admin = await Admin.findById(req.admin._id).select('+password');
    
    if (!admin) {
      return sendError(res, 'Admin not found', 404);
    }

    // Verify current password
    const isPasswordValid = await admin.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return sendError(res, 'Current password is incorrect', 401);
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    logger.info(`Admin password changed: ${admin.email}`);

    return sendResponse(res, null, 'Password changed successfully', 200);
  } catch (error) {
    logger.error('Error changing password:', error);
    return sendError(res, 'Failed to change password', 500);
  }
};

/**
 * Get platform settings
 * GET /api/admin/settings/platform
 */
exports.getPlatformSettings = async (req, res) => {
  try {
    const settings = await PlatformSettings.getSettings();
    
    return sendResponse(res, settings, 'Platform settings fetched successfully', 200);
  } catch (error) {
    logger.error('Error fetching platform settings:', error);
    return sendError(res, 'Failed to fetch platform settings', 500);
  }
};

/**
 * Update platform settings
 * PUT /api/admin/settings/platform
 */
exports.updatePlatformSettings = async (req, res) => {
  try {
    const updates = req.body;
    
    // Only super_admin can update platform settings
    if (req.admin.role !== 'super_admin' && req.admin.role !== 'admin') {
      return sendError(res, 'Insufficient permissions', 403);
    }

    const settings = await PlatformSettings.updateSettings(updates, req.admin._id);

    logger.info(`Platform settings updated by: ${req.admin.email}`);

    return sendResponse(res, settings, 'Platform settings updated successfully', 200);
  } catch (error) {
    logger.error('Error updating platform settings:', error);
    return sendError(res, 'Failed to update platform settings', 500);
  }
};

/**
 * Get notification settings
 * GET /api/admin/settings/notifications
 */
exports.getNotificationSettings = async (req, res) => {
  try {
    const settings = await PlatformSettings.getSettings();
    
    return sendResponse(res, settings.notifications, 'Notification settings fetched successfully', 200);
  } catch (error) {
    logger.error('Error fetching notification settings:', error);
    return sendError(res, 'Failed to fetch notification settings', 500);
  }
};

/**
 * Update notification settings
 * PUT /api/admin/settings/notifications
 */
exports.updateNotificationSettings = async (req, res) => {
  try {
    const notificationUpdates = req.body;
    
    const settings = await PlatformSettings.getSettings();
    settings.notifications = { ...settings.notifications, ...notificationUpdates };
    settings.lastUpdatedBy = req.admin._id;
    await settings.save();

    logger.info(`Notification settings updated by: ${req.admin.email}`);

    return sendResponse(res, settings.notifications, 'Notification settings updated successfully', 200);
  } catch (error) {
    logger.error('Error updating notification settings:', error);
    return sendError(res, 'Failed to update notification settings', 500);
  }
};

/**
 * Get security settings
 * GET /api/admin/settings/security
 */
exports.getSecuritySettings = async (req, res) => {
  try {
    const settings = await PlatformSettings.getSettings();
    
    return sendResponse(res, settings.security, 'Security settings fetched successfully', 200);
  } catch (error) {
    logger.error('Error fetching security settings:', error);
    return sendError(res, 'Failed to fetch security settings', 500);
  }
};

/**
 * Update security settings
 * PUT /api/admin/settings/security
 */
exports.updateSecuritySettings = async (req, res) => {
  try {
    const securityUpdates = req.body;
    
    // Only super_admin can update security settings
    if (req.admin.role !== 'super_admin' && req.admin.role !== 'admin') {
      return sendError(res, 'Insufficient permissions', 403);
    }

    const settings = await PlatformSettings.getSettings();
    settings.security = { ...settings.security, ...securityUpdates };
    settings.lastUpdatedBy = req.admin._id;
    await settings.save();

    logger.info(`Security settings updated by: ${req.admin.email}`);

    return sendResponse(res, settings.security, 'Security settings updated successfully', 200);
  } catch (error) {
    logger.error('Error updating security settings:', error);
    return sendError(res, 'Failed to update security settings', 500);
  }
};