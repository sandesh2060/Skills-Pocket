// ============================================
// FILE: backend/admin/src/models/PlatformSettings.js
// Singleton model - only one document for platform settings
// ============================================
const mongoose = require('mongoose');

const platformSettingsSchema = new mongoose.Schema(
  {
    // Financial Settings
    platformCommissionRate: {
      type: Number,
      default: 10,
      min: 0,
      max: 50,
      required: true,
    },
    minimumWithdrawalAmount: {
      type: Number,
      default: 50,
      min: 0,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'NPR', 'INR'],
      required: true,
    },

    // System Settings
    maintenanceMode: {
      enabled: {
        type: Boolean,
        default: false,
      },
      message: {
        type: String,
        default: 'We are currently performing maintenance. Please check back soon.',
      },
      scheduledStart: {
        type: Date,
        default: null,
      },
      scheduledEnd: {
        type: Date,
        default: null,
      },
    },

    // User Registration
    userRegistration: {
      enabled: {
        type: Boolean,
        default: true,
      },
      requireEmailVerification: {
        type: Boolean,
        default: true,
      },
      allowSocialLogin: {
        type: Boolean,
        default: true,
      },
    },

    // Notification Settings
    notifications: {
      email: {
        disputes: { type: Boolean, default: true },
        newUsers: { type: Boolean, default: true },
        supportTickets: { type: Boolean, default: true },
        paymentIssues: { type: Boolean, default: true },
        largeTransactions: { type: Boolean, default: true },
      },
      adminEmail: {
        type: String,
        default: 'admin@skillspocket.com',
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
      },
    },

    // Security Settings
    security: {
      sessionTimeout: {
        type: Number,
        default: 60, // minutes
        min: 15,
        max: 480,
      },
      maxLoginAttempts: {
        type: Number,
        default: 5,
        min: 3,
        max: 10,
      },
      lockoutDuration: {
        type: Number,
        default: 120, // minutes
        min: 15,
        max: 1440,
      },
      require2FA: {
        type: Boolean,
        default: false,
      },
    },

    // Payment Gateway
    paymentGateway: {
      provider: {
        type: String,
        enum: ['stripe', 'paypal', 'razorpay', 'esewa', 'khalti'],
        default: 'stripe',
      },
      testMode: {
        type: Boolean,
        default: true,
      },
      webhookUrl: {
        type: String,
        default: '',
      },
    },

    // Content Moderation
    contentModeration: {
      autoApproveJobs: {
        type: Boolean,
        default: false,
      },
      requireJobApproval: {
        type: Boolean,
        default: true,
      },
      profanityFilter: {
        type: Boolean,
        default: true,
      },
    },

    // Last updated info
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
platformSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

// Update settings
platformSettingsSchema.statics.updateSettings = async function (updates, adminId) {
  const settings = await this.getSettings();
  Object.assign(settings, updates);
  settings.lastUpdatedBy = adminId;
  await settings.save();
  return settings;
};

module.exports = mongoose.model('PlatformSettings', platformSettingsSchema);