// ============================================
// FILE: backend/user/src/services/paymentService.js
// ============================================
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const logger = require('../utils/logger');

exports.createPaymentIntent = async ({ amount, userId, jobId, milestoneId }) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: userId.toString(),
        jobId: jobId.toString(),
        milestoneId: milestoneId ? milestoneId.toString() : null,
      },
    });

    const transaction = await Transaction.create({
      type: 'escrow',
      amount,
      status: 'pending',
      from: userId,
      job: jobId,
      milestone: milestoneId,
      paymentIntentId: paymentIntent.id,
      paymentMethod: 'stripe',
    });

    return { paymentIntent, transaction };
  } catch (error) {
    logger.error(`Payment intent error: ${error.message}`);
    throw error;
  }
};

exports.releasePayment = async ({ transactionId, freelancerId, amount }) => {
  try {
    const platformFee = amount * 0.1; // 10% platform fee
    const netAmount = amount - platformFee;

    // Update freelancer wallet
    await User.findByIdAndUpdate(freelancerId, {
      $inc: {
        'wallet.balance': netAmount,
        totalEarnings: netAmount,
      },
    });

    // Update transaction
    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      {
        status: 'completed',
        to: freelancerId,
        platformFee,
        netAmount,
        processedAt: Date.now(),
      },
      { new: true }
    );

    // Create transaction record for freelancer
    await Transaction.create({
      type: 'payment',
      amount: netAmount,
      status: 'completed',
      to: freelancerId,
      job: transaction.job,
      paymentMethod: 'wallet',
      description: 'Payment received from client',
      processedAt: Date.now(),
    });

    return transaction;
  } catch (error) {
    logger.error(`Release payment error: ${error.message}`);
    throw error;
  }
};

exports.processWithdrawal = async ({ userId, amount, accountDetails }) => {
  try {
    const user = await User.findById(userId);

    if (user.wallet.balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Create Stripe transfer (in production, you'd use Stripe Connect)
    // For now, we'll just create a transaction record
    const transaction = await Transaction.create({
      type: 'withdrawal',
      amount,
      status: 'pending',
      from: userId,
      paymentMethod: 'bank_transfer',
      metadata: new Map(Object.entries(accountDetails)),
    });

    // Deduct from wallet
    user.wallet.balance -= amount;
    await user.save();

    // In production, process the actual transfer here
    // For demo purposes, mark as completed after 24 hours (simulated)
    setTimeout(async () => {
      transaction.status = 'completed';
      transaction.processedAt = Date.now();
      await transaction.save();
    }, 1000); // Immediate for demo

    return transaction;
  } catch (error) {
    logger.error(`Withdrawal error: ${error.message}`);
    throw error;
  }
};