// ============================================
// FILE: backend/user/src/models/Job.js
// ============================================
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Web Development',
      'Mobile Development',
      'Design',
      'Writing',
      'Marketing',
      'Data Science',
      'DevOps',
      'Other',
    ],
  },
  skills: {
    type: [String],
    required: [true, 'At least one skill is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one skill is required',
    },
  },
  budget: {
    min: {
      type: Number,
      required: [true, 'Minimum budget is required'],
      min: [0, 'Budget cannot be negative'],
    },
    max: {
      type: Number,
      required: [true, 'Maximum budget is required'],
      min: [0, 'Budget cannot be negative'],
    },
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'intermediate', 'expert'],
    required: [true, 'Experience level is required'],
  },
  projectType: {
    type: String,
    enum: ['fixed', 'hourly'],
    required: [true, 'Project type is required'],
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'completed', 'cancelled', 'closed'],
    default: 'open',
  },
  attachments: [{
    url: String,
    publicId: String,
    fileName: String,
    fileType: String,
  }],
  proposals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal',
  }],
  hiredFreelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  acceptedProposal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal',
  },
  milestones: [{
    title: String,
    description: String,
    amount: Number,
    dueDate: Date,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'approved'],
      default: 'pending',
    },
    completedAt: Date,
  }],
  totalBudget: Number,
  views: {
    type: Number,
    default: 0,
  },
  proposalCount: {
    type: Number,
    default: 0,
  },
  startDate: Date,
  endDate: Date,
  completedAt: Date,
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
jobSchema.index({ client: 1, status: 1 });
jobSchema.index({ category: 1, status: 1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);
