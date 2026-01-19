// ============================================
// FILE: backend/admin/src/models/index.js
// FIXED - Properly import schemas and register on admin mongoose instance
// ============================================
const mongoose = require('mongoose');
const path = require('path');

console.log('📍 Loading models for admin backend...');

// Import Admin model (local to admin backend)
const Admin = require('./Admin');

// For User models, we need to get the SCHEMA and register it on OUR mongoose instance
// Because the user backend's mongoose.model() registers on THEIR instance

let User, Job, Transaction, Proposal, Review, HireRequest, Message, Notification;

// Helper function to get or create model
const getModel = (modelName, schemaPath) => {
  // Check if already registered
  if (mongoose.models[modelName]) {
    return mongoose.models[modelName];
  }
  
  try {
    // Require the model file (this will register it on the user backend's instance)
    const ModelFromUserBackend = require(schemaPath);
    
    // Get the schema from the model
    const schema = ModelFromUserBackend.schema;
    
    // Register on OUR mongoose instance
    return mongoose.model(modelName, schema);
  } catch (error) {
    console.error(`❌ Failed to load ${modelName}:`, error.message);
    return null;
  }
};

console.log('📦 Registering models on admin mongoose instance...');

User = getModel('User', '../../../user/src/models/User');
Job = getModel('Job', '../../../user/src/models/Job');
Transaction = getModel('Transaction', '../../../user/src/models/Transaction');
Proposal = getModel('Proposal', '../../../user/src/models/Proposal');
Review = getModel('Review', '../../../user/src/models/Review');
HireRequest = getModel('HireRequest', '../../../user/src/models/HireRequest');
Message = getModel('Message', '../../../user/src/models/Message');
Notification = getModel('Notification', '../../../user/src/models/Notification');

console.log('✅ Models registered');
console.log('📍 Registered mongoose models:', Object.keys(mongoose.models).join(', '));

// Verify models are registered
const verifyModels = () => {
  const requiredModels = ['User', 'Job', 'Transaction', 'Proposal', 'Review', 'Admin'];
  const registeredModels = Object.keys(mongoose.models);
  
  console.log('\n📦 Model Verification:');
  console.log('='.repeat(60));
  console.log(`Total registered models: ${registeredModels.length}`);
  console.log(`Model names: ${registeredModels.join(', ')}`);
  console.log('');
  
  let allRegistered = true;
  requiredModels.forEach(modelName => {
    if (!mongoose.models[modelName]) {
      console.error(`❌ Model ${modelName} NOT registered!`);
      allRegistered = false;
    } else {
      console.log(`✅ Model ${modelName} registered`);
    }
  });
  console.log('='.repeat(60));
  
  if (!allRegistered) {
    console.error('\n⚠️  WARNING: Some models are missing!');
    console.error('Database queries for missing models will fail.');
  } else {
    console.log('\n✅ All required models are registered!\n');
  }
  
  return allRegistered;
};

// Export models
module.exports = {
  Admin,
  User,
  Job,
  Transaction,
  Proposal,
  Review,
  HireRequest,
  Message,
  Notification,
  verifyModels
};