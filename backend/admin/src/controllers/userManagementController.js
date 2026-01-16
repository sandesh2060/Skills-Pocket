// ============================================
// FILE: backend/admin/src/controllers/userManagementController.js
// ============================================
const User = require('../models/User');
const Job = require('../models/Job');
const Proposal = require('../models/Proposal');
const Transaction = require('../models/Transaction');
const logger = require('../utils/logger');

// @desc    Get all users with filters
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      status,
      search,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};

    if (role) query.role = role;
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;
    if (status === 'verified') query.isVerified = true;
    if (status === 'unverified') query.isVerified = false;
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalUsers: count,
          hasNext: page * limit < count,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    logger.error(`Get users error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
    });
  }
};

// @desc    Get user by ID with detailed info
// @route   GET /api/admin/users/:userId
// @access  Private (Admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get additional stats
    const [jobsPosted, proposalsSubmitted, transactions] = await Promise.all([
      Job.countDocuments({ client: user._id }),
      Proposal.countDocuments({ freelancer: user._id }),
      Transaction.find({ $or: [{ sender: user._id }, { recipient: user._id }] })
        .limit(10)
        .sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        user,
        stats: {
          jobsPosted,
          proposalsSubmitted,
          recentTransactions: transactions,
        },
      },
    });
  } catch (error) {
    logger.error(`Get user error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
    });
  }
};

// @desc    Suspend/Unsuspend user
// @route   PUT /api/admin/users/:userId/suspend
// @access  Private (Admin)
exports.toggleUserSuspension = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isActive = !user.isActive;
    user.suspensionReason = user.isActive ? undefined : reason;
    await user.save();

    logger.info(`User ${user.isActive ? 'activated' : 'suspended'}: ${user.email} by admin: ${req.admin.email}`);

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'suspended'} successfully`,
      data: user,
    });
  } catch (error) {
    logger.error(`Toggle user suspension error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/admin/users/:userId
// @access  Private (Super Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Soft delete - mark as deleted instead of removing
    user.isDeleted = true;
    user.deletedAt = Date.now();
    user.deletedBy = req.admin.id;
    await user.save();

    logger.warn(`User deleted: ${user.email} by admin: ${req.admin.email}`);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    logger.error(`Delete user error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
    });
  }
};

// @desc    Verify user manually
// @route   PUT /api/admin/users/:userId/verify
// @access  Private (Admin)
exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isVerified = true;
    await user.save();

    logger.info(`User verified manually: ${user.email} by admin: ${req.admin.email}`);

    res.status(200).json({
      success: true,
      message: 'User verified successfully',
      data: user,
    });
  } catch (error) {
    logger.error(`Verify user error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error verifying user',
    });
  }
};