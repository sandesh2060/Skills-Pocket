// ============================================
// FILE 3: backend/admin/src/app.js
// UPDATED - Model verification after import
// ============================================
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

// Import models FIRST (after DB is connected in server.js)
const { verifyModels } = require('./models');

const analyticsRoutes = require('./routes/analyticsRoutes');
const jobManagementRoutes = require('./routes/jobManagementRoutes');
const disputeRoutes = require('./routes/disputeRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ADMIN_FRONTEND_URL || 'http://localhost:5174',
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

// Routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin', analyticsRoutes);
app.use('/api/admin', jobManagementRoutes);
app.use('/api/admin', disputeRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;