// ============================================
// FILE: backend/user/src/models/HireRequest.js
// ============================================
const mongoose = require('mongoose');

const hireRequestSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Client is required'],
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Freelancer is required'],
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters'],
  },
  budget: {
    amount: {
      type: Number,
      required: [true, 'Budget amount is required'],
      min: [0, 'Budget cannot be negative'],
    },
    type: {
      type: String,
      enum: ['fixed', 'hourly'],
      required: [true, 'Budget type is required'],
    },
  },
  duration: {
    value: {
      type: Number,
      required: [true, 'Duration is required'],
    },
    unit: {
      type: String,
      enum: ['days', 'weeks', 'months'],
      default: 'weeks',
    },
  },
  startDate: {
    type: Date,
  },
  skills: [String],
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now },
  }],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn', 'expired'],
    default: 'pending',
  },
  clientMessage: {
    type: String,
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
  },
  freelancerResponse: {
    message: String,
    respondedAt: Date,
  },
  acceptedAt: Date,
  rejectedAt: Date,
  withdrawnAt: Date,
  expiresAt: {
    type: Date,
    default: function() {
      // Expires in 14 days by default
      return new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    },
  },
  metadata: {
    viewedByFreelancer: { type: Boolean, default: false },
    viewedAt: Date,
    lastReminderSent: Date,
  },
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

// Indexes for performance
hireRequestSchema.index({ client: 1, status: 1 });
hireRequestSchema.index({ freelancer: 1, status: 1 });
hireRequestSchema.index({ createdAt: -1 });
hireRequestSchema.index({ expiresAt: 1 });

// Prevent duplicate active hire requests
hireRequestSchema.index(
  { client: 1, freelancer: 1, status: 1 },
  { 
    unique: true,
    partialFilterExpression: { status: 'pending' }
  }
);

// Auto-expire hire requests
hireRequestSchema.pre('save', function(next) {
  if (this.isNew && !this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  }
  next();
});

// Virtual for formatted budget
hireRequestSchema.virtual('formattedBudget').get(function() {
  if (this.budget.type === 'hourly') {
    return `$${this.budget.amount}/hr`;
  }
  return `$${this.budget.amount.toLocaleString()}`;
});

// Virtual for formatted duration
hireRequestSchema.virtual('formattedDuration').get(function() {
  return `${this.duration.value} ${this.duration.unit}`;
});

// Ensure virtuals are included in JSON
hireRequestSchema.set('toJSON', { virtuals: true });
hireRequestSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('HireRequest', hireRequestSchema);