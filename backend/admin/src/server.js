// ============================================
// FILE: backend/admin/src/server.js
// ============================================

// MUST BE FIRST - Load environment variables before anything else
require('dotenv').config();

const http = require('http');
const app = require('./app');
const connectDB = require('./config/database');
const logger = require('./utils/logger');

// Connect to database
connectDB();

// Create HTTP server
const server = http.createServer(app);

const PORT = process.env.PORT || process.env.ADMIN_PORT || 5001;

server.listen(PORT, () => {
  logger.info(`🚀 Admin server running on port ${PORT}`);
  logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});