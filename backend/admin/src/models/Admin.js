// ============================================
// FILE: backend/admin/src/models/Admin.js
// ============================================
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator'],
    default: 'admin',
  },
  permissions: [{
    type: String,
    enum: [
      'manage_users',
      'manage_jobs',
      'manage_transactions',
      'resolve_disputes',
      'view_analytics',
      'manage_admins',
      'delete_users',
      'delete_jobs',
    ],
  }],
  profilePicture: {
    url: String,
    publicId: String,
  },
  phone: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: Date,
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
adminSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if account is locked
adminSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts
adminSchema.methods.incLoginAttempts = function() {
  // If lock has expired, reset attempts
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours
  
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return this.updateOne(updates);
};

// Set default permissions based on role
adminSchema.pre('save', function(next) {
  if (this.isNew) {
    switch (this.role) {
      case 'super_admin':
        this.permissions = [
          'manage_users',
          'manage_jobs',
          'manage_transactions',
          'resolve_disputes',
          'view_analytics',
          'manage_admins',
          'delete_users',
          'delete_jobs',
        ];
        break;
      case 'admin':
        this.permissions = [
          'manage_users',
          'manage_jobs',
          'manage_transactions',
          'resolve_disputes',
          'view_analytics',
        ];
        break;
      case 'moderator':
        this.permissions = [
          'manage_jobs',
          'resolve_disputes',
          'view_analytics',
        ];
        break;
    }
  }
  next();
});

module.exports = mongoose.model('Admin', adminSchema);