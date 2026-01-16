// ============================================
// FILE: backend/user/src/config/env.js
// ============================================
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const validateEnv = () => {
  // Required variables that must be present
  const required = [
    'NODE_ENV',
    'PORT',
    'JWT_SECRET',
  ];

  // Check for MongoDB URI (accept either MONGO_URI or MONGODB_URI)
  const hasMongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!hasMongoUri) {
    throw new Error('Missing required environment variable: MONGO_URI or MONGODB_URI');
  }

  // Normalize - if only MONGODB_URI exists, copy it to MONGO_URI
  if (!process.env.MONGO_URI && process.env.MONGODB_URI) {
    process.env.MONGO_URI = process.env.MONGODB_URI;
  }

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Warn about optional but recommended variables
  const optional = [
    'CLOUDINARY_CLOUD_NAME',
    'STRIPE_SECRET_KEY',
    'EMAIL_USER',
    'FRONTEND_URL'
  ];

  const missingOptional = optional.filter((key) => !process.env[key]);
  if (missingOptional.length > 0 && process.env.NODE_ENV !== 'test') {
    console.warn(`⚠️  Optional environment variables not set: ${missingOptional.join(', ')}`);
    console.warn('   Some features may not work until these are configured.');
  }
};

// Validate on module load
validateEnv();

// Export configuration object
module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  
  database: {
    uri: process.env.MONGO_URI || process.env.MONGODB_URI,
  },
  
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
  },
  
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@skillsprocket.com',
  },
  
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  },
  
  redis: {
    enabled: process.env.REDIS_ENABLED === 'true',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || '',
  },
  
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};