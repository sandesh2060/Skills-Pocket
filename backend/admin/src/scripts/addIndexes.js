// ============================================
// FILE 7: Add Database Indexes (Run this script once)
// backend/admin/src/scripts/addIndexes.js
// ============================================
const mongoose = require('mongoose');
require('dotenv').config();

async function addIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 Connected to MongoDB');

    const db = mongoose.connection.db;

    // Add indexes for better performance
    console.log('Creating indexes...');

    // Jobs collection
    await db.collection('jobs').createIndex({ status: 1, createdAt: -1 });
    await db.collection('jobs').createIndex({ category: 1, status: 1 });
    await db.collection('jobs').createIndex({ client: 1 });
    console.log('✅ Jobs indexes created');

    // Transactions collection
    await db.collection('transactions').createIndex({ type: 1, status: 1 });
    await db.collection('transactions').createIndex({ createdAt: 1 });
    await db.collection('transactions').createIndex({ type: 1, status: 1, createdAt: 1 });
    console.log('✅ Transactions indexes created');

    // Users collection
    await db.collection('users').createIndex({ createdAt: 1 });
    await db.collection('users').createIndex({ role: 1 });
    console.log('✅ Users indexes created');

    // Tickets collection
    await db.collection('tickets').createIndex({ status: 1, priority: -1, createdAt: -1 });
    await db.collection('tickets').createIndex({ user: 1 });
    await db.collection('tickets').createIndex({ category: 1 });
    console.log('✅ Tickets indexes created');

    console.log('\n🎉 All indexes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  }
}

addIndexes();