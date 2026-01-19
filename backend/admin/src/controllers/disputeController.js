// ============================================
// FILE 3: backend/admin/src/controllers/disputeController.js
// FIXED: Proper error handling + ALL exports
// ============================================
const Ticket = require('../models/Ticket');

const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 604800)}w ago`;
};

exports.getSupportTickets = async (req, res) => {
  try {
    const { status, priority, type, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;
    if (type && type !== 'all') query.category = type;

    const tickets = await Ticket.find(query)
      .populate('user', 'firstName lastName email avatar')
      .sort({ priority: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Ticket.countDocuments(query);

    const formattedTickets = tickets.map(ticket => ({
      _id: ticket._id,
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      status: ticket.status,
      category: ticket.category,
      author: ticket.user ? 
        `${ticket.user.firstName} ${ticket.user.lastName}` : 
        'Unknown',
      authorEmail: ticket.user?.email,
      timeAgo: getTimeAgo(ticket.createdAt),
      createdAt: ticket.createdAt
    }));

    res.json({
      success: true,
      data: formattedTickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('❌ Get support tickets error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch support tickets',
      code: 'TICKETS_ERROR'
    });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;
    
    const ticket = await Ticket.findById(ticketId)
      .populate('user', 'firstName lastName email avatar')
      .populate('assignedTo', 'firstName lastName email')
      .populate('responses.admin', 'firstName lastName');

    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        error: 'Ticket not found',
        code: 'TICKET_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    console.error('❌ Get ticket by ID error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ticket',
      code: 'TICKET_ERROR'
    });
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    if (!['new', 'open', 'pending', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value',
        code: 'INVALID_STATUS'
      });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        error: 'Ticket not found',
        code: 'TICKET_NOT_FOUND'
      });
    }

    res.json({ 
      success: true,
      message: 'Ticket status updated',
      data: ticket
    });
  } catch (error) {
    console.error('❌ Update ticket status error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to update ticket status',
      code: 'UPDATE_ERROR'
    });
  }
};

exports.respondToTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
        code: 'MISSING_MESSAGE'
      });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $push: {
          responses: {
            admin: req.admin._id,
            message: message.trim(),
            createdAt: new Date()
          }
        },
        status: 'pending'
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        error: 'Ticket not found',
        code: 'TICKET_NOT_FOUND'
      });
    }

    res.json({ 
      success: true,
      message: 'Response added successfully',
      data: ticket
    });
  } catch (error) {
    console.error('❌ Respond to ticket error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to add response',
      code: 'RESPONSE_ERROR'
    });
  }
};