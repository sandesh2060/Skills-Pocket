// ============================================
// FILE: backend/user/src/controllers/hireController.js
// ============================================
const HireRequest = require('../models/HireRequest');
const User = require('../models/User');
const logger = require('../utils/logger');

// @desc    Create hire request
// @route   POST /api/hire-requests
// @access  Private (Client only)
exports.createHireRequest = async (req, res) => {
  try {
    const {
      freelancerId,
      jobId,
      title,
      description,
      budget,
      duration,
      startDate,
      skills,
      clientMessage,
    } = req.body;

    // Check if freelancer exists
    const freelancer = await User.findOne({
      _id: freelancerId,
      role: 'freelancer',
      isActive: true,
    });

    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: 'Freelancer not found or inactive',
      });
    }

    // Check for existing pending hire request
    const existingRequest = await HireRequest.findOne({
      client: req.user.id,
      freelancer: freelancerId,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending hire request with this freelancer',
      });
    }

    // Create hire request
    const hireRequest = await HireRequest.create({
      client: req.user.id,
      freelancer: freelancerId,
      job: jobId,
      title,
      description,
      budget,
      duration,
      startDate,
      skills,
      clientMessage,
    });

    // Populate client and freelancer details
    await hireRequest.populate([
      { path: 'client', select: 'firstName lastName email profilePicture' },
      { path: 'freelancer', select: 'firstName lastName email profilePicture' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Hire request sent successfully',
      data: hireRequest,
    });
  } catch (error) {
    logger.error(`Create hire request error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to create hire request',
      error: error.message,
    });
  }
};

// @desc    Get my hire requests (as client)
// @route   GET /api/hire-requests/client
// @access  Private (Client only)
exports.getMyHireRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { client: req.user.id };
    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [requests, total] = await Promise.all([
      HireRequest.find(query)
        .populate('freelancer', 'firstName lastName email profilePicture skills hourlyRate rating')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      HireRequest.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        requests,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalItems: total,
        },
      },
    });
  } catch (error) {
    logger.error(`Get my hire requests error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hire requests',
      error: error.message,
    });
  }
};

// @desc    Get hire requests received (as freelancer)
// @route   GET /api/hire-requests/freelancer
// @access  Private (Freelancer only)
exports.getReceivedHireRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { freelancer: req.user.id };
    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [requests, total] = await Promise.all([
      HireRequest.find(query)
        .populate('client', 'firstName lastName email profilePicture')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      HireRequest.countDocuments(query),
    ]);

    // Mark as viewed
    await HireRequest.updateMany(
      { freelancer: req.user.id, 'metadata.viewedByFreelancer': false },
      { 
        'metadata.viewedByFreelancer': true,
        'metadata.viewedAt': new Date(),
      }
    );

    res.status(200).json({
      success: true,
      data: {
        requests,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          totalItems: total,
        },
      },
    });
  } catch (error) {
    logger.error(`Get received hire requests error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hire requests',
      error: error.message,
    });
  }
};

// @desc    Get hire request by ID
// @route   GET /api/hire-requests/:id
// @access  Private
exports.getHireRequestById = async (req, res) => {
  try {
    const hireRequest = await HireRequest.findById(req.params.id)
      .populate('client', 'firstName lastName email profilePicture')
      .populate('freelancer', 'firstName lastName email profilePicture skills hourlyRate rating');

    if (!hireRequest) {
      return res.status(404).json({
        success: false,
        message: 'Hire request not found',
      });
    }

    // Check authorization
    if (
      hireRequest.client._id.toString() !== req.user.id &&
      hireRequest.freelancer._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this hire request',
      });
    }

    res.status(200).json({
      success: true,
      data: hireRequest,
    });
  } catch (error) {
    logger.error(`Get hire request by ID error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hire request',
      error: error.message,
    });
  }
};

// @desc    Accept hire request
// @route   PUT /api/hire-requests/:id/accept
// @access  Private (Freelancer only)
exports.acceptHireRequest = async (req, res) => {
  try {
    const { message } = req.body;

    const hireRequest = await HireRequest.findById(req.params.id);

    if (!hireRequest) {
      return res.status(404).json({
        success: false,
        message: 'Hire request not found',
      });
    }

    // Check authorization
    if (hireRequest.freelancer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Check if already responded
    if (hireRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Hire request already ${hireRequest.status}`,
      });
    }

    hireRequest.status = 'accepted';
    hireRequest.acceptedAt = Date.now();
    hireRequest.freelancerResponse = {
      message,
      respondedAt: Date.now(),
    };

    await hireRequest.save();

    res.status(200).json({
      success: true,
      message: 'Hire request accepted successfully',
      data: hireRequest,
    });
  } catch (error) {
    logger.error(`Accept hire request error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to accept hire request',
      error: error.message,
    });
  }
};

// @desc    Reject hire request
// @route   PUT /api/hire-requests/:id/reject
// @access  Private (Freelancer only)
exports.rejectHireRequest = async (req, res) => {
  try {
    const { message } = req.body;

    const hireRequest = await HireRequest.findById(req.params.id);

    if (!hireRequest) {
      return res.status(404).json({
        success: false,
        message: 'Hire request not found',
      });
    }

    // Check authorization
    if (hireRequest.freelancer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Check if already responded
    if (hireRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Hire request already ${hireRequest.status}`,
      });
    }

    hireRequest.status = 'rejected';
    hireRequest.rejectedAt = Date.now();
    hireRequest.freelancerResponse = {
      message,
      respondedAt: Date.now(),
    };

    await hireRequest.save();

    res.status(200).json({
      success: true,
      message: 'Hire request rejected',
      data: hireRequest,
    });
  } catch (error) {
    logger.error(`Reject hire request error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to reject hire request',
      error: error.message,
    });
  }
};

// @desc    Withdraw hire request
// @route   DELETE /api/hire-requests/:id
// @access  Private (Client only)
exports.withdrawHireRequest = async (req, res) => {
  try {
    const hireRequest = await HireRequest.findById(req.params.id);

    if (!hireRequest) {
      return res.status(404).json({
        success: false,
        message: 'Hire request not found',
      });
    }

    // Check authorization
    if (hireRequest.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Can only withdraw pending requests
    if (hireRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only withdraw pending requests',
      });
    }

    hireRequest.status = 'withdrawn';
    hireRequest.withdrawnAt = Date.now();
    await hireRequest.save();

    res.status(200).json({
      success: true,
      message: 'Hire request withdrawn successfully',
    });
  } catch (error) {
    logger.error(`Withdraw hire request error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to withdraw hire request',
      error: error.message,
    });
  }
};