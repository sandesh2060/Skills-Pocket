// ============================================
// FILE: backend/admin/src/controllers/userManagementController.js
// ============================================
const User = require('../../../user/src/models/User');
const Job = require('../../../user/src/models/Job');
const Transaction = require('../../../user/src/models/Transaction');
const { sendResponse, sendError } = require('../utils/responseHandler');

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
    if (status === 'suspended') query.isSuspended = true;
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

    sendResponse(res, {
      users,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
    }, 'Users retrieved successfully');

  } catch (error) {
    console.error('Get users error:', error);
    sendError(res, 'Failed to retrieve users', 500);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const jobsPosted = user.role === 'client' 
      ? await Job.countDocuments({ client: user._id })
      : 0;

    const jobsCompleted = user.role === 'freelancer'
      ? await Job.countDocuments({ hiredFreelancer: user._id, status: 'completed' })
      : 0;

    const transactions = await Transaction.find({
      $or: [{ from: user._id }, { to: user._id }],
    }).limit(10).sort('-createdAt');

    sendResponse(res, {
      user,
      stats: {
        jobsPosted,
        jobsCompleted,
        recentTransactions: transactions,
      },
    }, 'User details retrieved');

  } catch (error) {
    console.error('Get user error:', error);
    sendError(res, 'Failed to get user', 500);
  }
};

exports.suspendUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    user.isSuspended = true;
    user.suspensionReason = reason;
    await user.save();

    await req.admin.logActivity(
      'suspend_user',
      `Suspended user ${user.email}. Reason: ${reason}`,
      req.ip
    );

    sendResponse(res, user, 'User suspended successfully');

  } catch (error) {
    console.error('Suspend user error:', error);
    sendError(res, 'Failed to suspend user', 500);
  }
};

exports.unsuspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    user.isSuspended = false;
    user.suspensionReason = null;
    await user.save();

    await req.admin.logActivity(
      'unsuspend_user',
      `Unsuspended user ${user.email}`,
      req.ip
    );

    sendResponse(res, user, 'User unsuspended successfully');

  } catch (error) {
    console.error('Unsuspend user error:', error);
    sendError(res, 'Failed to unsuspend user', 500);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    await user.deleteOne();

    await req.admin.logActivity(
      'delete_user',
      `Deleted user ${user.email}`,
      req.ip
    );

    sendResponse(res, null, 'User deleted successfully');

  } catch (error) {
    console.error('Delete user error:', error);
    sendError(res, 'Failed to delete user', 500);
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    user.isVerified = true;
    await user.save();

    await req.admin.logActivity(
      'verify_user',
      `Verified user ${user.email}`,
      req.ip
    );

    sendResponse(res, user, 'User verified successfully');

  } catch (error) {
    console.error('Verify user error:', error);
    sendError(res, 'Failed to verify user', 500);
  }
};