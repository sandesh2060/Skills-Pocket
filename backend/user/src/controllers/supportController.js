// ============================================
// FILE: backend/user/src/controllers/supportController.js
// ============================================
const SupportTicket = require('../models/SupportTicket');
const logger = require('../utils/logger');
const { sendEmail } = require('../services/emailService');

// @desc    Create support ticket
// @route   POST /api/support/tickets
// @access  Private
exports.createTicket = async (req, res) => {
  try {
    const { subject, category, priority, description } = req.body;

    if (!subject || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject, category, and description',
      });
    }

    const ticket = await SupportTicket.create({
      user: req.user.id,
      subject,
      category,
      priority: priority || 'medium',
      description,
    });

    // Send confirmation email
    try {
      await sendEmail({
        to: req.user.email,
        template: 'supportTicketCreated',
        data: {
          name: req.user.firstName,
          ticketId: ticket._id,
          subject: ticket.subject,
        },
      });
    } catch (emailError) {
      logger.warn(`Failed to send ticket confirmation email: ${emailError.message}`);
    }

    logger.info(`Support ticket created: ${ticket._id} by user: ${req.user.id}`);

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      data: ticket,
    });
  } catch (error) {
    logger.error(`Create ticket error: ${error.message}`, {
      userId: req.user?.id,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: 'Failed to create support ticket',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Get all my tickets
// @route   GET /api/support/tickets
// @access  Private
exports.getMyTickets = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };
    
    if (status) query.status = status;
    if (category) query.category = category;

    const skip = (page - 1) * limit;

    const tickets = await SupportTicket.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-messages');

    const total = await SupportTicket.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        tickets,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error(`Get tickets error: ${error.message}`, {
      userId: req.user?.id,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tickets',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Get single ticket with messages
// @route   GET /api/support/tickets/:id
// @access  Private
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate('messages.sender', 'firstName lastName email profilePicture');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    logger.error(`Get ticket error: ${error.message}`, {
      ticketId: req.params.id,
      userId: req.user?.id,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Add message to ticket
// @route   POST /api/support/tickets/:id/messages
// @access  Private
exports.addMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty',
      });
    }

    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    if (ticket.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot add message to closed ticket',
      });
    }

    ticket.messages.push({
      sender: req.user.id,
      senderRole: 'user',
      message: message.trim(),
    });

    // Update ticket status to open if it was resolved
    if (ticket.status === 'resolved') {
      ticket.status = 'open';
    }

    await ticket.save();

    res.status(200).json({
      success: true,
      message: 'Message added successfully',
      data: ticket,
    });
  } catch (error) {
    logger.error(`Add message error: ${error.message}`, {
      ticketId: req.params.id,
      userId: req.user?.id,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: 'Failed to add message',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Close ticket
// @route   PUT /api/support/tickets/:id/close
// @access  Private
exports.closeTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    ticket.status = 'closed';
    ticket.closedAt = new Date();
    await ticket.save();

    res.status(200).json({
      success: true,
      message: 'Ticket closed successfully',
      data: ticket,
    });
  } catch (error) {
    logger.error(`Close ticket error: ${error.message}`, {
      ticketId: req.params.id,
      userId: req.user?.id,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: 'Failed to close ticket',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Rate ticket resolution
// @route   POST /api/support/tickets/:id/rate
// @access  Private
exports.rateTicket = async (req, res) => {
  try {
    const { score, feedback } = req.body;

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating score must be between 1 and 5',
      });
    }

    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    if (ticket.status !== 'resolved' && ticket.status !== 'closed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate resolved or closed tickets',
      });
    }

    ticket.rating = {
      score: parseInt(score),
      feedback: feedback || '',
      ratedAt: new Date(),
    };

    await ticket.save();

    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully',
      data: ticket,
    });
  } catch (error) {
    logger.error(`Rate ticket error: ${error.message}`, {
      ticketId: req.params.id,
      userId: req.user?.id,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: 'Failed to submit rating',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Get ticket stats
// @route   GET /api/support/stats
// @access  Private
exports.getTicketStats = async (req, res) => {
  try {
    const stats = await SupportTicket.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedStats = {
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
      total: 0,
    };

    stats.forEach((stat) => {
      formattedStats[stat._id] = stat.count;
      formattedStats.total += stat.count;
    });

    res.status(200).json({
      success: true,
      data: formattedStats,
    });
  } catch (error) {
    logger.error(`Get ticket stats error: ${error.message}`, {
      userId: req.user?.id,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket stats',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};