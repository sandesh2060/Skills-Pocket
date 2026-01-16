// ============================================
// FILE: backend/admin/src/models/Proposal.js
// ============================================
const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  coverLetter: {
    type: String,
    required: [true, 'Cover letter is required'],
    maxlength: [2000, 'Cover letter cannot exceed 2000 characters'],
  },
  proposedBudget: {
    type: Number,
    required: [true, 'Proposed budget is required'],
    min: [0, 'Budget cannot be negative'],
  },
  estimatedDuration: {
    type: String,
    required: [true, 'Estimated duration is required'],
  },
  milestones: [{
    title: String,
    amount: Number,
    duration: String,
    description: String,
  }],
  attachments: [{
    url: String,
    publicId: String,
    fileName: String,
  }],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  respondedAt: Date,
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
proposalSchema.index({ job: 1, freelancer: 1 }, { unique: true });
proposalSchema.index({ freelancer: 1, status: 1 });
proposalSchema.index({ job: 1, status: 1 });

module.exports = mongoose.model('Proposal', proposalSchema);