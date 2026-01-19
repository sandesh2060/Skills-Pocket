// ============================================
// FILE: backend/admin/src/models/Dispute.js
// ============================================
const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  against: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['payment', 'quality', 'delivery', 'communication', 'other'],
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  evidence: [{
    type: {
      type: String,
      enum: ['image', 'document', 'link'],
    },
    url: String,
    description: String,
  }],
  status: {
    type: String,
    enum: ['pending', 'under_review', 'resolved', 'closed', 'escalated'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  resolution: {
    decision: {
      type: String,
      enum: ['favor_client', 'favor_freelancer', 'partial', 'dismissed'],
    },
    summary: String,
    refundAmount: Number,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    resolvedAt: Date,
  },
  messages: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'messages.fromModel',
    },
    fromModel: {
      type: String,
      enum: ['User', 'Admin'],
    },
    message: String,
    attachments: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  timeline: [{
    event: String,
    description: String,
    by: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'timeline.byModel',
    },
    byModel: {
      type: String,
      enum: ['User', 'Admin'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

// Indexes
disputeSchema.index({ job: 1 });
disputeSchema.index({ raisedBy: 1 });
disputeSchema.index({ status: 1, priority: 1 });
disputeSchema.index({ assignedTo: 1 });
disputeSchema.index({ createdAt: -1 });

// Add timeline entry
disputeSchema.methods.addTimelineEvent = function(event, description, by, byModel) {
  this.timeline.push({
    event,
    description,
    by,
    byModel,
    timestamp: new Date(),
  });
  return this.save();
};

module.exports = mongoose.model('Dispute', disputeSchema);