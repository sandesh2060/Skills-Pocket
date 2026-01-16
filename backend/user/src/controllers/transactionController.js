// ============================================
// FILE: backend/user/src/controllers/transactionController.js
// ============================================
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Job = require('../models/Job');
const { createPaymentIntent, releasePayment, processWithdrawal } = require('../services/paymentService');
const logger = require('../utils/logger');

// @desc    Get wallet balance
// @route   GET /api/transactions/wallet
// @access  Private
exports.getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        balance: user.wallet.balance,
        pendingAmount: user.wallet.pendingAmount,
        totalEarnings: user.totalEarnings,
        availableForWithdrawal: user.wallet.balance,
      },
    });
  } catch (error) {
    logger.error(`Get wallet error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet data',
      error: error.message,
    });
  }
};

// @desc    Get transaction history
// @route   GET /api/transactions
// @access  Private
exports.getTransactionHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status } = req.query;
    const query = {
      $or: [{ from: req.user.id }, { to: req.user.id }],
    };

    if (type) query.type = type;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .populate('from', 'firstName lastName')
        .populate('to', 'firstName lastName')
        .populate('job', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Transaction.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        transactions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalTransactions: total,
        },
      },
    });
  } catch (error) {
    logger.error(`Get transaction history error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message,
    });
  }
};

// @desc    Create payment intent
// @route   POST /api/transactions/payment-intent
// @access  Private (Client)
exports.createPaymentIntent = async (req, res) => {
  try {
    const { jobId, amount, milestoneId } = req.body;

    const result = await createPaymentIntent({
      amount,
      userId: req.user.id,
      jobId,
      milestoneId,
    });

    res.status(201).json({
      success: true,
      data: {
        clientSecret: result.paymentIntent.client_secret,
        transaction: result.transaction,
      },
    });
  } catch (error) {
    logger.error(`Create payment intent error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message,
    });
  }
};

// @desc    Release payment
// @route   POST /api/transactions/release
// @access  Private (Client)
exports.releasePayment = async (req, res) => {
  try {
    const { transactionId, jobId } = req.body;

    const job = await Job.findById(jobId);

    if (!job || job.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const transaction = await releasePayment({
      transactionId,
      freelancerId: job.hiredFreelancer,
      amount: job.totalBudget,
    });

    res.status(200).json({
      success: true,
      message: 'Payment released successfully',
      data: transaction,
    });
  } catch (error) {
    logger.error(`Release payment error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to release payment',
      error: error.message,
    });
  }
};

// @desc    Request withdrawal
// @route   POST /api/transactions/withdraw
// @access  Private (Freelancer)
exports.requestWithdrawal = async (req, res) => {
  try {
    const { amount, method, accountDetails } = req.body;

    const transaction = await processWithdrawal({
      userId: req.user.id,
      amount,
      accountDetails,
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: transaction,
    });
  } catch (error) {
    logger.error(`Withdrawal error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to process withdrawal',
      error: error.message,
    });
  }
};

// @desc    Get transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('from', 'firstName lastName')
      .populate('to', 'firstName lastName')
      .populate('job', 'title');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    logger.error(`Get transaction error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction',
      error: error.message,
    });
  }
};
