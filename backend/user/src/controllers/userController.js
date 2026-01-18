// ============================================
// FILE: backend/user/src/controllers/userController.js
// PRODUCTION-READY - Full profile management with Cloudinary
// ============================================
const User = require('../models/User');
const logger = require('../utils/logger');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const fs = require('fs').promises;
const path = require('path');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error(`Get profile error: ${error.message}`, { 
      userId: req.user?.id,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'firstName',
      'lastName',
      'phone',
      'bio',
      'skills',
      'hourlyRate',
      'location',
      'languages',
      'education',
      'experience',
      'portfolio',
      'socialLinks',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Validate hourly rate if provided
    if (updates.hourlyRate !== undefined) {
      const rate = Number(updates.hourlyRate);
      if (isNaN(rate) || rate < 0 || rate > 10000) {
        return res.status(400).json({
          success: false,
          message: 'Hourly rate must be between 0 and 10000',
        });
      }
      updates.hourlyRate = rate;
    }

    // Validate bio length if provided
    if (updates.bio && updates.bio.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Bio cannot exceed 500 characters',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    logger.info(`Profile updated for user: ${user._id}`);

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    logger.error(`Update profile error: ${error.message}`, { 
      userId: req.user?.id,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Upload profile picture (Cloudinary)
// @route   POST /api/users/profile-picture
// @access  Private
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    // Get user to check for existing profile picture
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file, 'skillspocket/profiles');

    // Delete old profile picture from Cloudinary if exists
    if (user.profilePicture && user.profilePicture.includes('cloudinary')) {
      try {
        const publicId = user.profilePicture.split('/').slice(-2).join('/').split('.')[0];
        await deleteFromCloudinary(publicId);
      } catch (deleteError) {
        logger.warn(`Failed to delete old profile picture: ${deleteError.message}`);
      }
    }

    // Delete local file after upload
    try {
      await fs.unlink(req.file.path);
    } catch (unlinkError) {
      logger.warn(`Failed to delete local file: ${unlinkError.message}`);
    }

    // Update user with new profile picture URL
    user.profilePicture = uploadResult.url;
    await user.save({ validateBeforeSave: false });

    logger.info(`Profile picture uploaded for user: ${user._id}`);

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        profilePicture: uploadResult.url,
      },
    });
  } catch (error) {
    logger.error(`Upload profile picture error: ${error.message}`, { 
      userId: req.user?.id,
      stack: error.stack 
    });

    // Clean up uploaded file if exists
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        logger.warn(`Failed to delete file after error: ${unlinkError.message}`);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to upload profile picture',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Add skill
// @route   POST /api/users/skills
// @access  Private
const addSkill = async (req, res) => {
  try {
    const { skill } = req.body;

    if (!skill || skill.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Skill name is required',
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if skill already exists
    const skillLower = skill.trim().toLowerCase();
    const skillExists = user.skills.some(s => s.toLowerCase() === skillLower);

    if (skillExists) {
      return res.status(400).json({
        success: false,
        message: 'Skill already exists',
      });
    }

    // Add skill
    user.skills.push(skill.trim());
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Skill added successfully',
      data: { skills: user.skills },
    });
  } catch (error) {
    logger.error(`Add skill error: ${error.message}`, { 
      userId: req.user?.id,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to add skill',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Remove skill
// @route   DELETE /api/users/skills/:skill
// @access  Private
const removeSkill = async (req, res) => {
  try {
    const { skill } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Remove skill (case-insensitive)
    const skillLower = skill.toLowerCase();
    user.skills = user.skills.filter(s => s.toLowerCase() !== skillLower);
    
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Skill removed successfully',
      data: { skills: user.skills },
    });
  } catch (error) {
    logger.error(`Remove skill error: ${error.message}`, { 
      userId: req.user?.id,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to remove skill',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Add portfolio item
// @route   POST /api/users/portfolio
// @access  Private
const addPortfolioItem = async (req, res) => {
  try {
    const { title, description, url, image } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Portfolio title is required',
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.portfolio.push({
      title,
      description,
      url,
      image,
    });

    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      message: 'Portfolio item added successfully',
      data: { portfolio: user.portfolio },
    });
  } catch (error) {
    logger.error(`Add portfolio error: ${error.message}`, { 
      userId: req.user?.id,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to add portfolio item',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Update portfolio item
// @route   PUT /api/users/portfolio/:id
// @access  Private
const updatePortfolioItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, url, image } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const portfolioItem = user.portfolio.id(id);
    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found',
      });
    }

    if (title !== undefined) portfolioItem.title = title;
    if (description !== undefined) portfolioItem.description = description;
    if (url !== undefined) portfolioItem.url = url;
    if (image !== undefined) portfolioItem.image = image;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Portfolio item updated successfully',
      data: { portfolio: user.portfolio },
    });
  } catch (error) {
    logger.error(`Update portfolio error: ${error.message}`, { 
      userId: req.user?.id,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to update portfolio item',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Delete portfolio item
// @route   DELETE /api/users/portfolio/:id
// @access  Private
const deletePortfolioItem = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const portfolioItem = user.portfolio.id(id);
    if (!portfolioItem) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found',
      });
    }

    portfolioItem.deleteOne();
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Portfolio item deleted successfully',
      data: { portfolio: user.portfolio },
    });
  } catch (error) {
    logger.error(`Delete portfolio error: ${error.message}`, { 
      userId: req.user?.id,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to delete portfolio item',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Get user by ID (public profile)
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      '-password -emailVerificationToken -resetPasswordToken -resetPasswordExpire -emailVerificationExpire'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error(`Get user by ID error: ${error.message}`, { 
      requestedUserId: req.params.id,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Deactivate account
// @route   POST /api/users/deactivate
// @access  Private
const deactivateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isActive = false;
    user.isSuspended = true;
    user.suspensionReason = 'User requested account deactivation';
    await user.save({ validateBeforeSave: false });

    logger.info(`Account deactivated for user: ${user._id}`);

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully',
    });
  } catch (error) {
    logger.error(`Deactivate account error: ${error.message}`, { 
      userId: req.user?.id,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate account',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Update notification preferences
// @route   PUT /api/users/notifications
// @access  Private
const updateNotificationPreferences = async (req, res) => {
  try {
    const allowedPreferences = [
      'emailNotifications',
      'jobAlerts',
      'proposalUpdates',
      'messageNotifications',
      'marketingEmails',
    ];

    const preferences = {};
    allowedPreferences.forEach((pref) => {
      if (req.body[pref] !== undefined) {
        preferences[`notificationPreferences.${pref}`] = req.body[pref];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: preferences },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: user,
    });
  } catch (error) {
    logger.error(`Update notification preferences error: ${error.message}`, { 
      userId: req.user?.id,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to update notification preferences',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Get dashboard stats (for client)
// @route   GET /api/users/dashboard/stats
// @access  Private (Client)
const getDashboardStats = async (req, res) => {
  try {
    const Job = require('../models/Job');
    const userId = req.user.id;

    const allJobs = await Job.find({ client: userId });

    const activeJobs = allJobs.filter(job => 
      job.status === 'open' || job.status === 'in_progress'
    );

    const completedJobs = allJobs.filter(job => 
      job.status === 'completed'
    );

    const totalSpent = completedJobs.reduce((sum, job) => {
      return sum + (job.budget?.max || 0);
    }, 0);

    const hiredFreelancers = new Set(
      allJobs
        .filter(job => job.hiredFreelancer)
        .map(job => job.hiredFreelancer.toString())
    );

    const user = await User.findById(userId).select('rating');

    res.status(200).json({
      success: true,
      data: {
        activeProjects: activeJobs.length,
        totalSpent,
        freelancersHired: hiredFreelancers.size,
        avgRating: user.rating || 0,
        totalJobs: allJobs.length,
        completedJobs: completedJobs.length,
      },
    });
  } catch (error) {
    logger.error(`Get dashboard stats error: ${error.message}`, { 
      userId: req.user?.id,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getUserById,
  uploadProfilePicture,
  addSkill,
  removeSkill,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  getDashboardStats,
  deactivateAccount,
  updateNotificationPreferences,
};