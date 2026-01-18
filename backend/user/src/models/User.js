// ============================================
// FILE: backend/user/src/models/User.js
// ============================================
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide first name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please provide last name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 8,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["client", "freelancer"],
      required: [true, "Please specify user role"],
    },
    profilePicture: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    skills: [String],
    hourlyRate: {
      type: Number,
      min: 0,
    },
    notificationPreferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      jobAlerts: {
        type: Boolean,
        default: true,
      },
      proposalUpdates: {
        type: Boolean,
        default: true,
      },
      messageNotifications: {
        type: Boolean,
        default: true,
      },
      marketingEmails: {
        type: Boolean,
        default: false,
      },
    },
    location: String,
    languages: [String],
    education: [
      {
        degree: String,
        school: String,
        year: Number,
      },
    ],
    experience: [
      {
        title: String,
        company: String,
        duration: String,
        description: String,
      },
    ],
    portfolio: [
      {
        title: String,
        description: String,
        url: String,
        image: String,
      },
    ],
    socialLinks: {
      linkedin: String,
      github: String,
      website: String,
      twitter: String,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    completedJobs: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    suspensionReason: String,
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.generateToken = function () {
  const payload = {
    id: this._id,
    email: this.email,
    role: this.role,
  };

  // IMPORTANT: Make sure JWT_EXPIRE is set correctly in .env (e.g., '7d')
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d", // Default to 7 days if not set
  });

  return token;
};

// Generate email verification token
userSchema.methods.generateVerificationToken = function () {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  this.emailVerificationToken = otp;
  this.emailVerificationExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

  return otp;
};

// Generate password reset token
userSchema.methods.generateResetToken = function () {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  this.resetPasswordToken = otp;
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

  return otp;
};

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ skills: 1 });

module.exports = mongoose.model("User", userSchema);
