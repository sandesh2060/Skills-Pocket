// ============================================
// FILE: backend/admin/src/app.js
// FIXED: Added settings routes + CORS for both frontends
// ============================================
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

// Import models FIRST (after DB is connected in server.js)
const { verifyModels } = require('./models');

// Import all routes
const analyticsRoutes = require('./routes/analyticsRoutes');
const jobManagementRoutes = require('./routes/jobManagementRoutes');
const disputeRoutes = require('./routes/disputeRoutes');
const supportRoutes = require('./routes/supportRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const userManagementRoutes = require('./routes/userManagementRoutes');
const settingsRoutes = require('./routes/settingsRoutes'); // ✅ ADDED

const app = express();

// Middleware
app.use(helmet());

// ✅ CORS: Allow both user frontend (5173) and admin frontend (5174)
const allowedOrigins = [
  'http://localhost:5173', // User frontend
  'http://localhost:5174', // Admin frontend
  process.env.ADMIN_FRONTEND_URL,
  process.env.USER_FRONTEND_URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      console.log('✅ Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Verify models immediately (DB is already connected)
verifyModels();

// Health check route
app.get('/api/admin/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected',
    models: Object.keys(require('mongoose').models)
  });
});

// Routes - ORDER MATTERS!
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/users', userManagementRoutes);
app.use('/api/admin/support', supportRoutes);
app.use('/api/admin/settings', settingsRoutes); // ✅ ADDED
app.use('/api/admin', analyticsRoutes); // Handles /dashboard/*
app.use('/api/admin', jobManagementRoutes); // Handles /projects/*
app.use('/api/admin', disputeRoutes); // Handles /disputes/*

// 404 handler
app.use('*', (req, res) => {
  console.log('❌ 404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      'GET  /api/admin/health',
      'POST /api/admin/auth/login',
      'GET  /api/admin/auth/me',
      'GET  /api/admin/users',
      'GET  /api/admin/dashboard/stats',
      'GET  /api/admin/dashboard/revenue',
      'GET  /api/admin/dashboard/job-distribution',
      'GET  /api/admin/projects/pending',
      'GET  /api/admin/support/tickets',
      'GET  /api/admin/disputes',
      'GET  /api/admin/settings/profile',        // ✅ ADDED
      'PUT  /api/admin/settings/profile',        // ✅ ADDED
      'PUT  /api/admin/settings/password',       // ✅ ADDED
      'GET  /api/admin/settings/platform',       // ✅ ADDED
      'PUT  /api/admin/settings/platform',       // ✅ ADDED
      'GET  /api/admin/settings/notifications',  // ✅ ADDED
      'PUT  /api/admin/settings/notifications',  // ✅ ADDED
      'GET  /api/admin/settings/security',       // ✅ ADDED
      'PUT  /api/admin/settings/security'        // ✅ ADDED
    ]
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;