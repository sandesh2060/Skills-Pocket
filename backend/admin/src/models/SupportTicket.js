//File : backend/admin/src/models/SupportTicket.js

const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: {
    type: String,
    enum: ['payment', 'technical', 'account', 'dispute', 'general'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['new', 'open', 'in_progress', 'resolved', 'closed'],
    default: 'new'
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  responses: [{
    message: String,
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    respondedAt: Date
  }],
  resolvedAt: Date,
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);