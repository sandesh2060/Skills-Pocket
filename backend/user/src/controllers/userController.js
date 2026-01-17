// ============================================
// FILE: backend/user/src/controllers/userController.js
// ============================================
const User = require('../models/User');
const logger = require('../utils/logger');

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

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

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

// @desc    Get user by ID (public profile)
// @route   GET /api/users/:id
// @access  Public
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      '-password -email -verificationToken -resetPasswordToken -resetPasswordExpire'
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

// @desc    Upload profile picture
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

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: `/uploads/profiles/${req.file.filename}` },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: user,
    });
  } catch (error) {
    logger.error(`Upload profile picture error: ${error.message}`, { 
      userId: req.user?.id,
      stack: error.stack 
    });
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile picture',
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

    // Get all jobs for this client
    const allJobs = await Job.find({ client: userId });

    // Calculate stats
    const activeJobs = allJobs.filter(job => 
      job.status === 'open' || job.status === 'in_progress'
    );

    const completedJobs = allJobs.filter(job => 
      job.status === 'completed'
    );

    const totalSpent = completedJobs.reduce((sum, job) => {
      return sum + (job.budget?.max || 0);
    }, 0);

    // Get unique hired freelancers
    const hiredFreelancers = new Set(
      allJobs
        .filter(job => job.hiredFreelancer)
        .map(job => job.hiredFreelancer.toString())
    );

    // Get user's rating
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

// Export all functions
module.exports = {
  getProfile,
  updateProfile,
  getUserById,
  uploadProfilePicture,
  getDashboardStats,
};