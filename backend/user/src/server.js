// ============================================
// FILE: backend/user/src/server.js
// ============================================
const http = require('http');
const app = require('./app');
const connectDB = require('./config/database');
const { connectRedis } = require('./config/redis');
const config = require('./config/env'); // Just require it - validation happens automatically
const { initializeSocket } = require('./socket');
const logger = require('./utils/logger');

// Environment is already validated when env.js is required
// No need to call validateEnv() separately

// Connect to database
connectDB();

// Connect to Redis (optional)
if (config.redis.enabled) {
  connectRedis();
} else {
  logger.info('Redis is disabled');
}

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

const PORT = config.port || 5000;

server.listen(PORT, () => {
  logger.info(`🚀 Server running in ${config.env} mode on port ${PORT}`);
  logger.info(`📍 Frontend URL: ${config.frontend.url}`);
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