
// ============================================
// FILE 1: backend/admin/src/config/database.js
// FIXED - Better connection handling
// ============================================
require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Configure mongoose
mongoose.set('strictQuery', false);
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 10000);

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const options = {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority',
    };

    logger.info('Attempting to connect to MongoDB...');
    
    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    logger.info(`📊 Database: ${conn.connection.name}`);
    logger.info(`🔌 Ready State: ${conn.connection.readyState}`);

    // Test connection
    await mongoose.connection.db.admin().ping();
    logger.info('✅ MongoDB ping successful');

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    return conn;
  } catch (error) {
    logger.error(`❌ MongoDB connection error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;