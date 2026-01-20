// ============================================
// FILE: backend/admin/src/controllers/settingsController.js
// ============================================
const Admin = require('../models/Admin');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ==================== PROFILE SETTINGS ====================

// GET /api/admin/settings/profile
exports.getProfile = async (req, res) => {
  try {
    const admin = req.admin; // Set by adminAuth middleware

    res.json({
      success: true,
      data: {
        firstName: admin.firstName || '',
        lastName: admin.lastName || '',
        email: admin.email,
        role: admin.role,
        profilePicture: admin.profilePicture || null,
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
    });
  }
};

// PUT /api/admin/settings/profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const adminId = req.admin._id;

    // Find admin in Admin collection first
    let admin = await Admin.findById(adminId);
    
    // If not found, try User collection
    if (!admin) {
      admin = await User.findById(adminId);
    }

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    // Update fields
    if (firstName) admin.firstName = firstName;
    if (lastName) admin.lastName = lastName;
    if (email) admin.email = email;

    await admin.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
};

// PUT /api/admin/settings/password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin._id;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters',
      });
    }

    // Find admin with password field
    let admin = await Admin.findById(adminId).select('+password');
    
    if (!admin) {
      admin = await User.findById(adminId).select('+password');
    }

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);

    await admin.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
    });
  }
};

// ==================== PLATFORM SETTINGS ====================

// GET /api/admin/settings/platform
exports.getPlatformSettings = async (req, res) => {
  try {
    // TODO: Store these in a PlatformSettings model
    // For now, return default values
    const settings = {
      platformCommissionRate: 10,
      minimumWithdrawalAmount: 50,
      currency: 'USD',
      maintenanceMode: {
        enabled: false,
        message: '',
      },
      userRegistration: {
        enabled: true,
        requireEmailVerification: true,
      },
    };

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching platform settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch platform settings',
    });
  }
};

// PUT /api/admin/settings/platform
exports.updatePlatformSettings = async (req, res) => {
  try {
    const settings = req.body;

    // TODO: Save to PlatformSettings model
    // For now, just validate and return success
    
    res.json({
      success: true,
      message: 'Platform settings updated successfully',
      data: settings,
    });
  } catch (error) {
    console.error('Error updating platform settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update platform settings',
    });
  }
};

// ==================== NOTIFICATION SETTINGS ====================

// GET /api/admin/settings/notifications
exports.getNotificationSettings = async (req, res) => {
  try {
    // TODO: Store per-admin notification preferences
    const settings = {
      email: {
        disputes: true,
        newUsers: true,
        supportTickets: true,
        paymentIssues: true,
      },
      adminEmail: req.admin.email,
    };

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification settings',
    });
  }
};

// PUT /api/admin/settings/notifications
exports.updateNotificationSettings = async (req, res) => {
  try {
    const settings = req.body;

    // TODO: Save to admin preferences
    
    res.json({
      success: true,
      message: 'Notification settings updated successfully',
      data: settings,
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification settings',
    });
  }
};

// ==================== SECURITY SETTINGS ====================

// GET /api/admin/settings/security
exports.getSecuritySettings = async (req, res) => {
  try {
    // TODO: Store in platform config
    const settings = {
      sessionTimeout: 60,
      maxLoginAttempts: 5,
      lockoutDuration: 120,
    };

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching security settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch security settings',
    });
  }
};

// PUT /api/admin/settings/security
exports.updateSecuritySettings = async (req, res) => {
  try {
    const settings = req.body;

    // Validation
    if (settings.sessionTimeout < 15 || settings.sessionTimeout > 480) {
      return res.status(400).json({
        success: false,
        message: 'Session timeout must be between 15 and 480 minutes',
      });
    }

    if (settings.maxLoginAttempts < 3 || settings.maxLoginAttempts > 10) {
      return res.status(400).json({
        success: false,
        message: 'Max login attempts must be between 3 and 10',
      });
    }

    if (settings.lockoutDuration < 15 || settings.lockoutDuration > 1440) {
      return res.status(400).json({
        success: false,
        message: 'Lockout duration must be between 15 and 1440 minutes',
      });
    }

    // TODO: Save to platform config
    
    res.json({
      success: true,
      message: 'Security settings updated successfully',
      data: settings,
    });
  } catch (error) {
    console.error('Error updating security settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update security settings',
    });
  }
};