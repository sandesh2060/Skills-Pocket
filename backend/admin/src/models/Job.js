// ============================================
// FILE: backend/admin/src/models/Job.js
// FIXED - Explicitly use admin backend mongoose connection
// ============================================

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  budget: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending_approval', 'active', 'in_progress', 'completed', 'rejected', 'cancelled'],
    default: 'pending_approval'
  },
  skills: [String],
  deadline: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  approvedAt: Date,
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  rejectedAt: Date,
  rejectionReason: String
}, {
  timestamps: true
});

// Indexes
jobSchema.index({ client: 1 });
jobSchema.index({ freelancer: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ createdAt: -1 });

// ✅ FIX: Delete existing model if it exists to prevent caching issues
if (mongoose.models.Job) {
  delete mongoose.models.Job;
}

// ✅ FIX: Use mongoose.connection.model to ensure it uses the current connection
module.exports = mongoose.connection.model('Job', jobSchema);