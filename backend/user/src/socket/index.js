// ============================================
// FILE: backend/user/src/socket/index.js
// ============================================
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { handleMessageEvents } = require('./messageHandler');
const { handleNotificationEvents } = require('./notificationHandler');

let io;

const initializeSocket = (server) => {
  // FIXED: Enhanced CORS configuration for production
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  io = socketIO(server, {
    cors: {
      origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          logger.warn(`Socket.IO connection attempt from unauthorized origin: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST'],
    },
    // CRITICAL: Add these configurations
    transports: ['websocket', 'polling'], // Support both transports
    allowEIO3: true, // Support older clients
    pingTimeout: 60000, // 60 seconds
    pingInterval: 25000, // 25 seconds
    upgradeTimeout: 30000, // 30 seconds
    maxHttpBufferSize: 1e6, // 1MB
    // Path configuration
    path: '/socket.io/',
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        logger.warn('Socket connection attempt without token');
        return next(new Error('Authentication token required'));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (!decoded || !decoded.id) {
        logger.warn('Invalid token payload');
        return next(new Error('Invalid authentication token'));
      }

      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      
      logger.info(`Socket authenticated for user: ${socket.userId}`);
      next();
    } catch (error) {
      logger.error(`Socket authentication error: ${error.message}`);
      
      if (error.name === 'TokenExpiredError') {
        next(new Error('Token expired'));
      } else if (error.name === 'JsonWebTokenError') {
        next(new Error('Invalid token'));
      } else {
        next(new Error('Authentication error'));
      }
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    logger.info(`✅ User connected - Socket ID: ${socket.id}, User ID: ${socket.userId}`);

    // Join user's personal room for notifications
    socket.join(socket.userId);
    logger.info(`User ${socket.userId} joined personal room`);

    // Emit connection success to client
    socket.emit('connection_success', {
      socketId: socket.id,
      userId: socket.userId,
      timestamp: new Date().toISOString(),
    });

    // Handle message events
    handleMessageEvents(socket, io);

    // Handle notification events
    handleNotificationEvents(socket, io);

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      logger.info(`❌ User disconnected - Socket ID: ${socket.id}, User ID: ${socket.userId}, Reason: ${reason}`);
      
      // Notify others that user is offline
      socket.broadcast.emit('user_status_change', {
        userId: socket.userId,
        status: 'offline',
        lastSeen: new Date(),
      });
    });

    // Handle connection errors
    socket.on('error', (error) => {
      logger.error(`Socket error for user ${socket.userId}:`, error);
    });
  });

  // Global error handler
  io.engine.on('connection_error', (err) => {
    logger.error('Socket.IO Engine connection error:', {
      message: err.message,
      code: err.code,
      context: err.context,
    });
  });

  logger.info('✅ Socket.IO initialized successfully');
  logger.info(`Allowed origins: ${allowedOrigins.join(', ')}`);

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initializeSocket first.');
  }
  return io;
};

module.exports = { initializeSocket, getIO };