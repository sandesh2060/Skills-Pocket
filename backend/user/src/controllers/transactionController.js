// ============================================
// FILE: backend/user/src/controllers/transactionController.js
// ============================================
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Job = require('../models/Job');
const logger = require('../utils/logger');

// @desc    Get my transactions
// @route   GET /api/transactions/my-transactions
// @access  Private
const getMyTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, type } = req.query;
    const userId = req.user.id;

    // Build query - find transactions where user is either sender or receiver
    const query = {
      $or: [
        { from: userId },
        { to: userId }
      ]
    };

    if (status) query.status = status;
    if (type) query.type = type;

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .populate('from', 'firstName lastName email profilePicture')
        .populate('to', 'firstName lastName email profilePicture')
        .populate('job', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Transaction.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: {
        transactions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalTransactions: total,
        }
      }
    });
  } catch (error) {
    logger.error(`Get my transactions error: ${error.message}`, {
      userId: req.user?.id,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('from', 'firstName lastName email profilePicture')
      .populate('to', 'firstName lastName email profilePicture')
      .populate('job', 'title description budget');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if user is authorized to view this transaction
    const userId = req.user.id;
    if (
      transaction.from?._id?.toString() !== userId &&
      transaction.to?._id?.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this transaction'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    logger.error(`Get transaction by ID error: ${error.message}`, {
      transactionId: req.params.id,
      userId: req.user?.id,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Create transaction (for payments)
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const { to, amount, job, type, description, paymentMethod } = req.body;
    const from = req.user.id;

    // Validate required fields
    if (!to || !amount) {
      return res.status(400).json({
        success: false,
        message: 'To and amount are required'
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      from,
      to,
      amount,
      job,
      type: type || 'payment',
      description,
      paymentMethod,
      status: 'pending'
    });

    await transaction.populate([
      { path: 'from', select: 'firstName lastName email' },
      { path: 'to', select: 'firstName lastName email' },
      { path: 'job', select: 'title' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction
    });
  } catch (error) {
    logger.error(`Create transaction error: ${error.message}`, {
      userId: req.user?.id,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Failed to create transaction',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Update transaction status
// @route   PUT /api/transactions/:id/status
// @access  Private (Admin or transaction owner)
const updateTransactionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check authorization
    const userId = req.user.id;
    const isOwner = transaction.from?.toString() === userId || 
                    transaction.to?.toString() === userId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this transaction'
      });
    }

    transaction.status = status;
    if (status === 'completed') {
      transaction.completedAt = new Date();
    }
    
    await transaction.save();

    res.status(200).json({
      success: true,
      message: 'Transaction status updated',
      data: transaction
    });
  } catch (error) {
    logger.error(`Update transaction status error: ${error.message}`, {
      transactionId: req.params.id,
      userId: req.user?.id,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Failed to update transaction',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Get financial summary
// @route   GET /api/transactions/summary
// @access  Private
const getFinancialSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all transactions for this user
    const transactions = await Transaction.find({
      $or: [{ from: userId }, { to: userId }]
    });

    // Calculate totals
    const totalSpent = transactions
      .filter(t => t.from?.toString() === userId && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalReceived = transactions
      .filter(t => t.to?.toString() === userId && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingPayments = transactions
      .filter(t => t.from?.toString() === userId && t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0);

    const completedPayments = transactions
      .filter(t => t.from?.toString() === userId && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        totalSpent,
        totalReceived,
        pendingPayments,
        completedPayments,
        availableBalance: totalReceived - totalSpent,
        transactionCount: transactions.length
      }
    });
  } catch (error) {
    logger.error(`Get financial summary error: ${error.message}`, {
      userId: req.user?.id,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch financial summary',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

module.exports = {
  getMyTransactions,
  getTransactionById,
  createTransaction,
  updateTransactionStatus,
  getFinancialSummary,
};