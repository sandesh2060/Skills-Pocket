// ============================================
// FILE: backend/admin/src/controllers/analyticsController.js
// ============================================
const User = require('../models/User');
const Job = require('../models/Job');
const Transaction = require('../models/Transaction');
const Proposal = require('../models/Proposal');
const logger = require('../utils/logger');

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getPlatformAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    // Calculate date range
    const periodDays = parseInt(period) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // Parallel queries for better performance
    const [
      totalUsers,
      totalJobs,
      totalTransactions,
      newUsersCount,
      activeJobsCount,
      completedJobsCount,
      totalRevenue,
      usersByRole,
      jobsByCategory,
      recentTransactions,
    ] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Transaction.countDocuments(),
      User.countDocuments({ createdAt: { $gte: startDate } }),
      Job.countDocuments({ status: 'open' }),
      Job.countDocuments({ status: 'completed' }),
      Transaction.aggregate([
        { $match: { status: 'completed', type: 'payment' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      User.aggregate([
        { $group: { _id: '$role', count: { $count: {} } } },
      ]),
      Job.aggregate([
        { $group: { _id: '$category', count: { $count: {} } } },
      ]),
      Transaction.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('from', 'firstName lastName')
        .populate('to', 'firstName lastName'),
    ]);

    // User growth data
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $count: {} },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Revenue trend
    const revenueTrend = await Transaction.aggregate([
      {
        $match: {
          status: 'completed',
          type: 'payment',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalJobs,
          totalTransactions,
          newUsers: newUsersCount,
          activeJobs: activeJobsCount,
          completedJobs: completedJobsCount,
          totalRevenue: totalRevenue[0]?.total || 0,
        },
        usersByRole,
        jobsByCategory,
        userGrowth,
        revenueTrend,
        recentTransactions,
      },
    });
  } catch (error) {
    logger.error(`Get analytics error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
    });
  }
};

// @desc    Get financial analytics
// @route   GET /api/admin/analytics/financial
// @access  Private (Admin)
exports.getFinancialAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const [paymentStats, withdrawalStats, escrowBalance] = await Promise.all([
      Transaction.aggregate([
        { $match: { type: 'payment', ...(Object.keys(dateFilter).length && { createdAt: dateFilter }) } },
        {
          $group: {
            _id: '$status',
            count: { $count: {} },
            total: { $sum: '$amount' },
          },
        },
      ]),
      Transaction.aggregate([
        { $match: { type: 'withdrawal', ...(Object.keys(dateFilter).length && { createdAt: dateFilter }) } },
        {
          $group: {
            _id: '$status',
            count: { $count: {} },
            total: { $sum: '$amount' },
          },
        },
      ]),
      Transaction.aggregate([
        { $match: { status: 'escrow' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        payments: paymentStats,
        withdrawals: withdrawalStats,
        escrowBalance: escrowBalance[0]?.total || 0,
      },
    });
  } catch (error) {
    logger.error(`Get financial analytics error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching financial analytics',
    });
  }
};