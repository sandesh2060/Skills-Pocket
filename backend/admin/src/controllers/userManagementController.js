// ============================================
// FILE: backend/admin/src/controllers/userManagementController.js
// FIXED: Use admin backend's own models (not user backend's)
// ============================================
const User = require('../models/User');  // ✅ Changed from '../../../user/src/models/User'
const Job = require('../models/Job');    // ✅ Changed from '../../../user/src/models/Job'
const Transaction = require('../models/Transaction'); // ✅ Changed from '../../../user/src/models/Transaction'

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

    // Fixed: Handle 'all' filter properly
    if (role && role !== 'all') query.role = role;
    
    if (status === 'active') query.isActive = true;
    if (status === 'suspended') query.isSuspended = true;
    if (status === 'pending') query.isVerified = false;
    if (status === 'inactive') query.isActive = false;

    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    const users = await User.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password');

    const total = await User.countDocuments(query);

    // Fixed: Return data in the format frontend expects
    res.json({
      success: true,
      data: {
        users,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
      },
      message: 'Users retrieved successfully'
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    const jobsPosted = user.role === 'client' 
      ? await Job.countDocuments({ client: user._id })
      : 0;

    const jobsCompleted = user.role === 'freelancer'
      ? await Job.countDocuments({ freelancer: user._id, status: 'completed' })
      : 0;

    const transactions = await Transaction.find({
      $or: [{ from: user._id }, { to: user._id }],
    }).limit(10).sort('-createdAt');

    res.json({
      success: true,
      data: {
        user,
        stats: {
          jobsPosted,
          jobsCompleted,
          recentTransactions: transactions,
        },
      },
      message: 'User details retrieved'
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.suspendUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    user.isSuspended = true;
    user.suspensionReason = reason;
    await user.save();

    console.log(`✅ Admin ${req.admin.email} suspended user ${user.email}. Reason: ${reason}`);

    res.json({
      success: true,
      data: user,
      message: 'User suspended successfully'
    });

  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.unsuspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    user.isSuspended = false;
    user.suspensionReason = null;
    await user.save();

    console.log(`✅ Admin ${req.admin.email} unsuspended user ${user.email}`);

    res.json({
      success: true,
      data: user,
      message: 'User unsuspended successfully'
    });

  } catch (error) {
    console.error('Unsuspend user error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    await user.deleteOne();

    console.log(`✅ Admin ${req.admin.email} deleted user ${user.email}`);

    res.json({
      success: true,
      data: null,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    user.isVerified = true;
    await user.save();

    console.log(`✅ Admin ${req.admin.email} verified user ${user.email}`);

    res.json({
      success: true,
      data: user,
      message: 'User verified successfully'
    });

  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};