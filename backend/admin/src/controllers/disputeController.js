// ============================================
// FILE: backend/admin/src/controllers/disputeController.js
// ============================================
const Dispute = require('../models/Dispute');
const Job = require('../models/Job');
const Transaction = require('../models/Transaction');
const logger = require('../utils/logger');

// @desc    Get all disputes
// @route   GET /api/admin/disputes
// @access  Private (Admin)
exports.getAllDisputes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const disputes = await Dispute.find(query)
      .populate('job', 'title')
      .populate('client', 'firstName lastName email')
      .populate('freelancer', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Dispute.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        disputes,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalDisputes: count,
        },
      },
    });
  } catch (error) {
    logger.error(`Get disputes error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching disputes',
    });
  }
};

// @desc    Get dispute by ID
// @route   GET /api/admin/disputes/:disputeId
// @access  Private (Admin)
exports.getDisputeById = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.disputeId)
      .populate('job')
      .populate('client', 'firstName lastName email profilePicture')
      .populate('freelancer', 'firstName lastName email profilePicture')
      .populate('assignedTo', 'firstName lastName')
      .populate('resolvedBy', 'firstName lastName');

    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: 'Dispute not found',
      });
    }

    res.status(200).json({
      success: true,
      data: dispute,
    });
  } catch (error) {
    logger.error(`Get dispute error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching dispute',
    });
  }
};

// @desc    Assign dispute to admin
// @route   PUT /api/admin/disputes/:disputeId/assign
// @access  Private (Admin)
exports.assignDispute = async (req, res) => {
  try {
    const { adminId } = req.body;
    const dispute = await Dispute.findById(req.params.disputeId);

    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: 'Dispute not found',
      });
    }

    dispute.assignedTo = adminId || req.admin.id;
    dispute.status = 'in_progress';
    await dispute.save();

    logger.info(`Dispute ${dispute._id} assigned to admin ${dispute.assignedTo}`);

    res.status(200).json({
      success: true,
      message: 'Dispute assigned successfully',
      data: dispute,
    });
  } catch (error) {
    logger.error(`Assign dispute error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error assigning dispute',
    });
  }
};

// @desc    Resolve dispute
// @route   PUT /api/admin/disputes/:disputeId/resolve
// @access  Private (Admin)
exports.resolveDispute = async (req, res) => {
  try {
    const { resolution, refundAmount, refundTo } = req.body;
    const dispute = await Dispute.findById(req.params.disputeId);

    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: 'Dispute not found',
      });
    }

    dispute.status = 'resolved';
    dispute.resolution = resolution;
    dispute.resolvedBy = req.admin.id;
    dispute.resolvedAt = Date.now();

    // Handle refund if specified
    if (refundAmount && refundTo) {
      const transaction = await Transaction.create({
        type: 'refund',
        amount: refundAmount,
        recipient: refundTo,
        job: dispute.job,
        description: `Refund from dispute resolution: ${dispute._id}`,
        status: 'completed',
      });

      dispute.refundTransaction = transaction._id;
    }

    await dispute.save();

    logger.info(`Dispute ${dispute._id} resolved by admin ${req.admin.email}`);

    res.status(200).json({
      success: true,
      message: 'Dispute resolved successfully',
      data: dispute,
    });
  } catch (error) {
    logger.error(`Resolve dispute error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error resolving dispute',
    });
  }
};

// @desc    Add message to dispute
// @route   POST /api/admin/disputes/:disputeId/messages
// @access  Private (Admin)
exports.addDisputeMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const dispute = await Dispute.findById(req.params.disputeId);

    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: 'Dispute not found',
      });
    }

    dispute.messages.push({
      sender: req.admin.id,
      senderModel: 'Admin',
      message,
      timestamp: Date.now(),
    });

    await dispute.save();

    res.status(200).json({
      success: true,
      message: 'Message added successfully',
      data: dispute,
    });
  } catch (error) {
    logger.error(`Add dispute message error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error adding message',
    });
  }
};