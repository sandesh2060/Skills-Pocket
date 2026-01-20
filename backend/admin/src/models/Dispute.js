// ============================================
// FILE: backend/admin/src/models/Dispute.js
// Complete Dispute Schema
// ============================================
const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['payment', 'quality', 'delivery', 'communication', 'other'],
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  against: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'resolved', 'closed', 'escalated'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  assignedAt: Date,
  evidence: [{
    type: {
      type: String,
      enum: ['file', 'screenshot', 'message', 'other']
    },
    url: String,
    description: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolution: {
    decision: {
      type: String,
      enum: ['favor_client', 'favor_freelancer', 'partial', 'dismissed']
    },
    summary: String,
    refundAmount: {
      type: Number,
      default: 0
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    resolvedAt: Date
  },
  escalation: {
    reason: String,
    escalatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    escalatedAt: Date
  },
  closedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  closedAt: Date,
  closeNote: String,
  notes: [{
    message: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
disputeSchema.index({ status: 1 });
disputeSchema.index({ priority: 1 });
disputeSchema.index({ type: 1 });
disputeSchema.index({ job: 1 });
disputeSchema.index({ raisedBy: 1 });
disputeSchema.index({ against: 1 });
disputeSchema.index({ assignedTo: 1 });
disputeSchema.index({ createdAt: -1 });

// Delete existing model if it exists to prevent caching issues
if (mongoose.models.Dispute) {
  delete mongoose.models.Dispute;
}

module.exports = mongoose.connection.model('Dispute', disputeSchema);