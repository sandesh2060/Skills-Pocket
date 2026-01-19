// ============================================
// FILE 1: backend/admin/src/server.js
// FIXED - Connect to DB BEFORE loading app
// ============================================
const connectDB = require('./config/database');
const logger = require('./utils/logger');
require('dotenv').config();

const PORT = process.env.PORT || 5001;

// Error handlers
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION!', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION!', err);
  process.exit(1);
});

// Async startup function
async function startServer() {
  try {
    logger.info('🚀 Starting Admin server...');

    // STEP 1: Connect to MongoDB FIRST
    logger.info('📦 Step 1: Connecting to database...');
    await connectDB();
    logger.info('✅ Database connected');

    // STEP 2: Wait a moment for connection to stabilize
    await new Promise(resolve => setTimeout(resolve, 500));

    // STEP 3: NOW load the app (which loads models)
    logger.info('📦 Step 2: Loading application...');
    const app = require('./app');
    logger.info('✅ Application loaded');

    // STEP 4: Start listening
    app.listen(PORT, () => {
      logger.info('='.repeat(60));
      logger.info(`✅ Admin server running on port ${PORT}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/api/admin/health`);
      logger.info('='.repeat(60));
    });

  } catch (error) {
    logger.error('❌ Server startup failed:', error.message);
    logger.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Start the server
startServer();
