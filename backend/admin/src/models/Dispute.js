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
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Dispute title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Dispute description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  category: {
    type: String,
    enum: [
      'payment_issue',
      'quality_issue',
      'deadline_missed',
      'scope_change',
      'communication_issue',
      'other',
    ],
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open',
  },
  evidence: [{
    type: {
      type: String,
      enum: ['document', 'image', 'screenshot', 'other'],
    },
    url: String,
    publicId: String,
    fileName: String,
    description: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'messages.senderModel',
    },
    senderModel: {
      type: String,
      enum: ['User', 'Admin'],
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  resolution: {
    type: String,
    maxlength: [2000, 'Resolution cannot exceed 2000 characters'],
  },
  refundAmount: Number,
  refundTransaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  resolvedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
disputeSchema.index({ job: 1 });
disputeSchema.index({ client: 1 });
disputeSchema.index({ freelancer: 1 });
disputeSchema.index({ status: 1, priority: 1 });
disputeSchema.index({ assignedTo: 1 });
disputeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Dispute', disputeSchema);