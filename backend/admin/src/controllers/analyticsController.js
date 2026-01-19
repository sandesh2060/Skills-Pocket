// ============================================
// FILE 2: backend/admin/src/controllers/analyticsController.js
// FIXED: Proper timeouts, error handling, and indexes
// ============================================
const { User, Job, Transaction } = require('../models');

// Helper to add timeout to queries
const withTimeout = (promise, timeoutMs = 5000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Query timeout')), timeoutMs)
    )
  ]);
};

exports.getDashboardStats = async (req, res) => {
  try {
    console.log('📊 Fetching dashboard stats...');

    const now = new Date();
    const lastMonth = new Date(now);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Run queries with timeout protection
    const [
      totalUsers,
      activeJobs,
      revenueResult,
      escrowResult
    ] = await Promise.all([
      withTimeout(User.countDocuments()),
      withTimeout(Job.countDocuments({ status: { $in: ['active', 'in_progress'] } })),
      withTimeout(Transaction.aggregate([
        { $match: { type: 'payment', status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])),
      withTimeout(Transaction.aggregate([
        { $match: { type: 'escrow', status: 'held' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]))
    ]);

    console.log('✅ Stats fetched successfully');

    // Get comparison data
    const [lastMonthUsers, lastMonthJobs, lastMonthRevenueResult] = await Promise.all([
      withTimeout(User.countDocuments({ createdAt: { $lt: lastMonth } })),
      withTimeout(Job.countDocuments({ 
        status: { $in: ['active', 'in_progress'] },
        createdAt: { $lt: lastMonth }
      })),
      withTimeout(Transaction.aggregate([
        { $match: { 
          type: 'payment',
          status: 'completed',
          createdAt: { $lt: lastMonth }
        }},
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]))
    ]);

    const calculateTrend = (current, previous) => {
      if (previous === 0) return { trend: 'up', trendValue: '100%' };
      const change = ((current - previous) / previous) * 100;
      return {
        trend: change >= 0 ? 'up' : 'down',
        trendValue: `${Math.abs(change).toFixed(1)}%`
      };
    };

    const currentRevenue = revenueResult[0]?.total || 0;
    const lastMonthRevenue = lastMonthRevenueResult[0]?.total || 0;

    res.json({
      success: true,
      data: {
        totalUsers: {
          value: totalUsers,
          ...calculateTrend(totalUsers, lastMonthUsers)
        },
        activeJobs: {
          value: activeJobs,
          ...calculateTrend(activeJobs, lastMonthJobs)
        },
        totalRevenue: {
          value: currentRevenue,
          ...calculateTrend(currentRevenue, lastMonthRevenue)
        },
        escrowBalance: {
          value: escrowResult[0]?.total || 0,
          trend: 'stable',
          trendValue: '0%'
        }
      }
    });
  } catch (error) {
    console.error('❌ Dashboard stats error:', error.message);
    
    if (error.message === 'Query timeout') {
      return res.status(504).json({
        success: false,
        error: 'Database query took too long. Please try again.',
        code: 'QUERY_TIMEOUT'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics',
      code: 'STATS_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getRevenueData = async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    const days = parseInt(range.replace('d', '')) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    console.log('📊 Fetching revenue data...');

    const revenueData = await withTimeout(
      Transaction.aggregate([
        {
          $match: {
            type: 'payment',
            status: 'completed',
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$amount' }
          }
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            date: '$_id',
            revenue: 1,
            _id: 0
          }
        }
      ])
    );

    console.log('✅ Revenue data fetched:', revenueData.length, 'records');

    res.json({
      success: true,
      data: revenueData
    });
  } catch (error) {
    console.error('❌ Revenue data error:', error.message);
    
    if (error.message === 'Query timeout') {
      return res.status(504).json({
        success: false,
        error: 'Database query took too long',
        code: 'QUERY_TIMEOUT'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch revenue data',
      code: 'REVENUE_ERROR'
    });
  }
};

exports.getJobDistribution = async (req, res) => {
  try {
    console.log('📊 Fetching job distribution...');

    const distribution = await withTimeout(
      Job.aggregate([
        { $match: { status: { $in: ['active', 'in_progress'] } } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            category: { $toUpper: '$_id' },
            count: 1,
            _id: 0
          }
        },
        { $sort: { count: -1 } }
      ])
    );

    console.log('✅ Job distribution fetched:', distribution.length, 'categories');

    res.json({
      success: true,
      data: distribution
    });
  } catch (error) {
    console.error('❌ Job distribution error:', error.message);
    
    if (error.message === 'Query timeout') {
      return res.status(504).json({
        success: false,
        error: 'Database query took too long',
        code: 'QUERY_TIMEOUT'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch job distribution',
      code: 'DISTRIBUTION_ERROR'
    });
  }
};
