// Handle uncaught exceptions FIRST (before any other code)
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Server crashed.');
  console.error('Error:', err.name, '-', err.message);
  console.error('Stack:', err.stack);
  process.exit(1);
});

// Handle unhandled promise rejections FIRST
process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED PROMISE REJECTION! Server crashed.');
  console.error('Error:', err.name, '-', err.message);
  console.error('Stack:', err.stack);
  process.exit(1);
});

const http = require('http');
const app = require('./app');
const connectDB = require('./config/database');
const { connectRedis } = require('./config/redis');
const config = require('./config/env');
const { initializeSocket } = require('./socket');
const logger = require('./utils/logger');

// Connect to database
connectDB()
  .then(() => {
    logger.info('Database connection successful');
  })
  .catch((err) => {
    logger.error(`Database connection failed: ${err.message}`);
    process.exit(1);
  });

// Connect to Redis (optional)
if (config.redis.enabled) {
  connectRedis()
    .catch((err) => {
      logger.warn(`Redis connection failed: ${err.message}`);
      logger.info('Continuing without Redis');
    });
} else {
  logger.info('Redis is disabled');
}

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
try {
  initializeSocket(server);
  logger.info('Socket.io initialized successfully');
} catch (err) {
  logger.error(`Socket.io initialization failed: ${err.message}`);
}

const PORT = config.port || 5000;

server.listen(PORT, () => {
  logger.info(`🚀 Server running in ${config.env} mode on port ${PORT}`);
  logger.info(`📍 Frontend URL: ${config.frontend.url}`);
});