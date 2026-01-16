// ============================================
// FILE: backend/admin/src/app.js
// ============================================
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');

// Route imports
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const userManagementRoutes = require('./routes/userManagementRoutes');
const jobManagementRoutes = require('./routes/jobManagementRoutes');
const disputeRoutes = require('./routes/disputeRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ADMIN_FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
}));
app.use(mongoSanitize());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/users', userManagementRoutes);
app.use('/api/admin/jobs', jobManagementRoutes);
app.use('/api/admin/disputes', disputeRoutes);
app.use('/api/admin/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;