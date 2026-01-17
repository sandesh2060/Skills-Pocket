// ============================================
// FILE: backend/user/src/models/Transaction.js
// ============================================
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient is required'],
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    type: {
      type: String,
      enum: ['payment', 'refund', 'withdrawal', 'deposit', 'escrow_release'],
      default: 'payment',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: {
        type: String,
        enum: ['card', 'bank', 'paypal', 'stripe', 'wallet'],
      },
      last4: String,
      brand: String,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    metadata: {
      type: Map,
      of: String,
    },
    stripePaymentIntentId: String,
    stripeChargeId: String,
    completedAt: Date,
    failedAt: Date,
    failureReason: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
transactionSchema.index({ from: 1, createdAt: -1 });
transactionSchema.index({ to: 1, createdAt: -1 });
transactionSchema.index({ job: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });

// Virtual for transaction age
transactionSchema.virtual('age').get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Method to check if transaction is editable
transactionSchema.methods.isEditable = function () {
  return this.status === 'pending';
};

// Static method to get user transactions summary
transactionSchema.statics.getUserSummary = async function (userId) {
  const summary = await this.aggregate([
    {
      $match: {
        $or: [
          { from: mongoose.Types.ObjectId(userId) },
          { to: mongoose.Types.ObjectId(userId) },
        ],
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        total: { $sum: '$amount' },
      },
    },
  ]);

  return summary;
};

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;