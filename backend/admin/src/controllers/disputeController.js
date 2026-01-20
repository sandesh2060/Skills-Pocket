// ============================================
// FILE: backend/admin/src/controllers/disputeController.js
// COMPLETE IMPLEMENTATION - Matches Frontend Expectations
// ============================================
const Dispute = require('../models/Dispute');
const User = require('../models/User');
const Job = require('../models/Job');

// Get all disputes with filters
exports.getAllDisputes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      priority,
      type,
    } = req.query;

    const query = {};
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (type) query.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [disputes, total] = await Promise.all([
      Dispute.find(query)
        .populate('raisedBy', 'firstName lastName email')
        .populate('against', 'firstName lastName email')
        .populate('job', 'title budget')
        .populate('assignedTo', 'firstName lastName email')
        .sort({ priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Dispute.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        disputes,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalDisputes: total
      }
    });

  } catch (error) {
    console.error('Get disputes error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch disputes' 
    });
  }
};

// Get single dispute by ID
exports.getDisputeById = async (req, res) => {
  try {
    const { disputeId } = req.params;

    const dispute = await Dispute.findById(disputeId)
      .populate('raisedBy', 'firstName lastName email profilePicture')
      .populate('against', 'firstName lastName email profilePicture')
      .populate('job', 'title description budget status')
      .populate('assignedTo', 'firstName lastName email')
      .lean();

    if (!dispute) {
      return res.status(404).json({ 
        success: false, 
        error: 'Dispute not found' 
      });
    }

    res.json({
      success: true,
      data: dispute
    });

  } catch (error) {
    console.error('Get dispute error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch dispute' 
    });
  }
};

// Assign dispute to current admin
exports.assignDispute = async (req, res) => {
  try {
    const { disputeId } = req.params;

    const dispute = await Dispute.findById(disputeId);
    
    if (!dispute) {
      return res.status(404).json({ 
        success: false, 
        error: 'Dispute not found' 
      });
    }

    if (dispute.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        error: 'Can only assign pending disputes' 
      });
    }

    dispute.assignedTo = req.admin._id;
    dispute.status = 'under_review';
    dispute.assignedAt = new Date();
    await dispute.save();

    console.log(`✅ Admin ${req.admin.email} assigned dispute ${disputeId}`);

    res.json({
      success: true,
      message: 'Dispute assigned successfully',
      data: dispute
    });

  } catch (error) {
    console.error('Assign dispute error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to assign dispute' 
    });
  }
};

// Resolve dispute
exports.resolveDispute = async (req, res) => {
  try {
    const { disputeId } = req.params;
    const { decision, summary, refundAmount = 0 } = req.body;

    if (!decision || !summary) {
      return res.status(400).json({ 
        success: false, 
        error: 'Decision and summary are required' 
      });
    }

    const dispute = await Dispute.findById(disputeId);
    
    if (!dispute) {
      return res.status(404).json({ 
        success: false, 
        error: 'Dispute not found' 
      });
    }

    if (dispute.status === 'resolved' || dispute.status === 'closed') {
      return res.status(400).json({ 
        success: false, 
        error: 'Dispute already resolved' 
      });
    }

    dispute.status = 'resolved';
    dispute.resolution = {
      decision,
      summary,
      refundAmount: parseFloat(refundAmount) || 0,
      resolvedBy: req.admin._id,
      resolvedAt: new Date()
    };
    await dispute.save();

    console.log(`✅ Admin ${req.admin.email} resolved dispute ${disputeId} - Decision: ${decision}`);

    res.json({
      success: true,
      message: 'Dispute resolved successfully',
      data: dispute
    });

  } catch (error) {
    console.error('Resolve dispute error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to resolve dispute' 
    });
  }
};

// Update dispute priority
exports.updateDisputePriority = async (req, res) => {
  try {
    const { disputeId } = req.params;
    const { priority } = req.body;

    const validPriorities = ['low', 'medium', 'high', 'critical'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid priority level' 
      });
    }

    const dispute = await Dispute.findByIdAndUpdate(
      disputeId,
      { priority },
      { new: true }
    );

    if (!dispute) {
      return res.status(404).json({ 
        success: false, 
        error: 'Dispute not found' 
      });
    }

    console.log(`✅ Admin ${req.admin.email} updated dispute ${disputeId} priority to ${priority}`);

    res.json({
      success: true,
      message: 'Priority updated successfully',
      data: dispute
    });

  } catch (error) {
    console.error('Update priority error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update priority' 
    });
  }
};

// Escalate dispute
exports.escalateDispute = async (req, res) => {
  try {
    const { disputeId } = req.params;
    const { reason } = req.body;

    const dispute = await Dispute.findById(disputeId);
    
    if (!dispute) {
      return res.status(404).json({ 
        success: false, 
        error: 'Dispute not found' 
      });
    }

    dispute.status = 'escalated';
    dispute.escalation = {
      reason,
      escalatedBy: req.admin._id,
      escalatedAt: new Date()
    };
    await dispute.save();

    console.log(`✅ Admin ${req.admin.email} escalated dispute ${disputeId}`);

    res.json({
      success: true,
      message: 'Dispute escalated successfully',
      data: dispute
    });

  } catch (error) {
    console.error('Escalate dispute error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to escalate dispute' 
    });
  }
};

// Close dispute
exports.closeDispute = async (req, res) => {
  try {
    const { disputeId } = req.params;
    const { note } = req.body;

    const dispute = await Dispute.findById(disputeId);
    
    if (!dispute) {
      return res.status(404).json({ 
        success: false, 
        error: 'Dispute not found' 
      });
    }

    if (dispute.status !== 'resolved') {
      return res.status(400).json({ 
        success: false, 
        error: 'Can only close resolved disputes' 
      });
    }

    dispute.status = 'closed';
    dispute.closedBy = req.admin._id;
    dispute.closedAt = new Date();
    dispute.closeNote = note;
    await dispute.save();

    console.log(`✅ Admin ${req.admin.email} closed dispute ${disputeId}`);

    res.json({
      success: true,
      message: 'Dispute closed successfully',
      data: dispute
    });

  } catch (error) {
    console.error('Close dispute error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to close dispute' 
    });
  }
};