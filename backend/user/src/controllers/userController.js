// ============================================
// FILE: backend/user/src/controllers/userController.js
// ============================================
const User = require('../models/User');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const logger = require('../utils/logger');
const fs = require('fs');

// @desc    Update profile
// @route   PUT /api/users/me
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'bio',
      'skills',
      'hourlyRate',
      'location',
      'education',
      'experience',
      'certifications',
      'languages',
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    logger.error(`Update profile error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

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
    logger.error(`Get user by ID error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message,
    });
  }
};

// @desc    Upload profile picture
// @route   POST /api/users/upload-profile-picture
// @access  Private
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const user = await User.findById(req.user.id);

    // Delete old profile picture if exists
    if (user.profilePicture?.publicId) {
      await deleteFromCloudinary(user.profilePicture.publicId);
    }

    // Upload new picture
    const result = await uploadToCloudinary(req.file, 'skillsprocket/profiles');

    user.profilePicture = {
      url: result.url,
      publicId: result.publicId,
    };

    await user.save();

    // Delete local file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: user.profilePicture,
    });
  } catch (error) {
    logger.error(`Upload profile picture error: ${error.message}`);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile picture',
      error: error.message,
    });
  }
};

// @desc    Update password
// @route   PUT /api/users/me/password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    logger.error(`Update password error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to update password',
      error: error.message,
    });
  }
};

// @desc    Add portfolio item
// @route   POST /api/users/portfolio
// @access  Private
exports.addPortfolioItem = async (req, res) => {
  try {
    const { title, description, url, technologies } = req.body;
    const user = await User.findById(req.user.id);

    const portfolioItem = {
      title,
      description,
      url,
      technologies,
    };

    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'skillsprocket/portfolio');
      portfolioItem.image = {
        url: result.url,
        publicId: result.publicId,
      };
      fs.unlinkSync(req.file.path);
    }

    user.portfolio.push(portfolioItem);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Portfolio item added successfully',
      data: user.portfolio[user.portfolio.length - 1],
    });
  } catch (error) {
    logger.error(`Add portfolio error: ${error.message}`);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({
      success: false,
      message: 'Failed to add portfolio item',
      error: error.message,
    });
  }
};

// @desc    Delete portfolio item
// @route   DELETE /api/users/portfolio/:itemId
// @access  Private
exports.deletePortfolioItem = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const item = user.portfolio.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found',
      });
    }

    if (item.image?.publicId) {
      await deleteFromCloudinary(item.image.publicId);
    }

    item.remove();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Portfolio item deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete portfolio error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to delete portfolio item',
      error: error.message,
    });
  }
};
