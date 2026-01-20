// ============================================
// FILE: backend/admin/src/models/Transaction.js
// ============================================

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['payment', 'escrow', 'withdrawal', 'refund'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'held', 'failed'],
    default: 'pending'
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  relatedJob: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  description: String,
  fee: {
    type: Number,
    default: 0
  },
  paymentMethod: String,
  transactionId: String
}, {
  timestamps: true
});

// Indexes
transactionSchema.index({ from: 1 });
transactionSchema.index({ to: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);