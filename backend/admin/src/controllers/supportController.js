// ============================================
// FILE: backend/admin/src/controllers/supportController.js
// ============================================
const SupportTicket = require('../models/SupportTicket');
const { sendResponse, sendError } = require('../utils/responseHandler');
const logger = require('../utils/logger');

/**
 * Get all support tickets with optional filters
 * GET /api/admin/support/tickets?status=open&priority=high
 */
exports.getSupportTickets = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 50 } = req.query;
    
    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tickets = await SupportTicket.find(filter)
      .populate('user', 'name email profileImage')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await SupportTicket.countDocuments(filter);

    // Format for frontend
    const formattedTickets = tickets.map(ticket => ({
      _id: ticket._id,
      title: ticket.subject,
      description: ticket.message,
      priority: ticket.priority,
      status: ticket.status,
      author: ticket.user?.name || 'Unknown User',
      authorEmail: ticket.user?.email,
      timeAgo: getTimeAgo(ticket.createdAt),
      createdAt: ticket.createdAt
    }));

    return sendResponse(res, formattedTickets, 'Support tickets fetched', 200);
  } catch (error) {
    logger.error('Error fetching support tickets:', error);
    return sendError(res, 'Failed to fetch support tickets', 500);
  }
};

/**
 * Get single support ticket by ID
 * GET /api/admin/support/tickets/:ticketId
 */
exports.getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await SupportTicket.findById(ticketId)
      .populate('user', 'name email profileImage phone')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return sendError(res, 'Support ticket not found', 404);
    }

    return sendResponse(res, ticket, 'Ticket fetched successfully', 200);
  } catch (error) {
    logger.error('Error fetching ticket:', error);
    return sendError(res, 'Failed to fetch ticket', 500);
  }
};

/**
 * Update ticket status
 * PUT /api/admin/support/tickets/:ticketId/status
 */
exports.updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return sendError(res, 'Invalid status', 400);
    }

    const ticket = await SupportTicket.findByIdAndUpdate(
      ticketId,
      { 
        status,
        resolvedAt: status === 'resolved' ? new Date() : undefined
      },
      { new: true }
    ).populate('user', 'name email');

    if (!ticket) {
      return sendError(res, 'Support ticket not found', 404);
    }

    logger.info(`Ticket ${ticketId} status updated to ${status} by admin ${req.admin.email}`);
    return sendResponse(res, ticket, 'Ticket status updated', 200);
  } catch (error) {
    logger.error('Error updating ticket status:', error);
    return sendError(res, 'Failed to update ticket status', 500);
  }
};

/**
 * Respond to support ticket
 * POST /api/admin/support/tickets/:ticketId/respond
 */
exports.respondToTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return sendError(res, 'Response message is required', 400);
    }

    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket) {
      return sendError(res, 'Support ticket not found', 404);
    }

    // Add admin response to ticket
    ticket.responses = ticket.responses || [];
    ticket.responses.push({
      message,
      respondedBy: req.admin._id,
      respondedAt: new Date(),
      isAdmin: true
    });

    ticket.status = 'in-progress';
    ticket.lastResponseAt = new Date();
    
    await ticket.save();

    const updatedTicket = await SupportTicket.findById(ticketId)
      .populate('user', 'name email')
      .populate('responses.respondedBy', 'name email');

    // TODO: Send email notification to user

    logger.info(`Admin ${req.admin.email} responded to ticket ${ticketId}`);
    return sendResponse(res, updatedTicket, 'Response added successfully', 200);
  } catch (error) {
    logger.error('Error responding to ticket:', error);
    return sendError(res, 'Failed to respond to ticket', 500);
  }
};

// Helper function to calculate time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }

  return 'Just now';
}