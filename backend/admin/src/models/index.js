// ============================================
// FILE: backend/admin/src/models/index.js
// SIMPLE FIX - Just require the models directly
// ============================================
const mongoose = require('mongoose');

console.log('📍 Loading models for admin backend...');

// Simply require all models - they will register themselves
const Admin = require('./Admin');
const User = require('./User');
const Job = require('./Job');
const Transaction = require('./Transaction');
const SupportTicket = require('./SupportTicket');

// Optional models
let Proposal, Review, HireRequest, Message, Notification;

try {
  Proposal = require('./Proposal');
  console.log('✅ Loaded Proposal model');
} catch (e) {
  console.log('ℹ️  Proposal model not found (optional)');
}

try {
  Review = require('./Review');
  console.log('✅ Loaded Review model');
} catch (e) {
  console.log('ℹ️  Review model not found (optional)');
}

try {
  HireRequest = require('./HireRequest');
  console.log('✅ Loaded HireRequest model');
} catch (e) {
  console.log('ℹ️  HireRequest model not found (optional)');
}

try {
  Message = require('./Message');
  console.log('✅ Loaded Message model');
} catch (e) {
  console.log('ℹ️  Message model not found (optional)');
}

try {
  Notification = require('./Notification');
  console.log('✅ Loaded Notification model');
} catch (e) {
  console.log('ℹ️  Notification model not found (optional)');
}

console.log('📍 Registered mongoose models:', Object.keys(mongoose.models).join(', '));

// Verify models
const verifyModels = () => {
  const requiredModels = ['User', 'Job', 'Transaction', 'Admin', 'SupportTicket'];
  const registeredModels = Object.keys(mongoose.models);
  
  console.log('\n📦 Model Verification:');
  console.log('='.repeat(60));
  console.log(`Total registered models: ${registeredModels.length}`);
  console.log(`Model names: ${registeredModels.join(', ')}`);
  console.log('');
  
  let allRegistered = true;
  requiredModels.forEach(modelName => {
    const model = mongoose.models[modelName];
    if (!model) {
      console.error(`❌ Model ${modelName} NOT registered!`);
      allRegistered = false;
    } else {
      console.log(`✅ Model ${modelName} registered`);
    }
  });
  console.log('='.repeat(60));
  
  if (!allRegistered) {
    console.error('\n⚠️  WARNING: Some required models are missing!');
  } else {
    console.log('\n✅ All required models are registered!\n');
  }
  
  return allRegistered;
};

// Export everything
module.exports = {
  Admin,
  User,
  Job,
  Transaction,
  SupportTicket,
  Proposal,
  Review,
  HireRequest,
  Message,
  Notification,
  verifyModels
};