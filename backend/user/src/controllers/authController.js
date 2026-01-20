// ============================================
// FILE: backend/user/src/controllers/authController.js
// FIXED: Added Admin model check for admin login
// ============================================
const User = require("../models/User");
const Admin = require("../models/Admin"); // ✅ ADD THIS LINE
const { sendEmail } = require("../services/emailService");
const logger = require("../utils/logger");
const { generateOTP } = require("../utils/helpers");
const jwt = require("jsonwebtoken"); // ✅ ADD THIS LINE

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      phone,
    });

    // Generate verification token
    const verificationToken = user.generateVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send verification email
    try {
      await sendEmail({
        to: user.email,
        subject: "Email Verification - skillspocket",
        template: "emailVerification",
        data: {
          name: user.firstName,
          otp: verificationToken,
        },
      });
    } catch (emailError) {
      logger.error(`Email sending failed: ${emailError.message}`);
    }

    // Generate JWT token
    const token = user.generateToken();

    res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
        token,
      },
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // ✅ STEP 1: Check if this is an admin login
    const admin = await Admin.findOne({ email }).select("+password");
    
    if (admin) {
      console.log("🔐 Admin login detected:", email);
      
      // Check if admin account is active
      if (!admin.isActive) {
        return res.status(403).json({
          success: false,
          message: "Admin account is deactivated",
        });
      }

      // Check if admin account is locked
      if (admin.isLocked()) {
        return res.status(423).json({
          success: false,
          message: "Account is locked. Please try again later",
        });
      }

      // Verify password
      const isPasswordValid = await admin.comparePassword(password);
      
      if (!isPasswordValid) {
        await admin.incLoginAttempts();
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // ✅ Password is correct - reset login attempts
      await admin.resetLoginAttempts();
      admin.lastLogin = new Date();
      await admin.save();

      // Log admin activity
      await admin.logActivity("login", "Admin logged in via user API", req.ip);

      // ✅ CRITICAL: Generate token with ADMIN ID, not user ID
      const token = jwt.sign(
        {
          id: admin._id, // ✅ Use admin._id
          email: admin.email,
          role: "admin", // ✅ Set role as 'admin'
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || "7d" }
      );

      console.log("✅ Admin token generated with ID:", admin._id);

      // Return admin data
      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        data: {
          admin: {
            id: admin._id,
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            role: admin.role,
            permissions: admin.permissions,
            profilePicture: admin.profilePicture,
          },
          token,
        },
      });
    }

    // ✅ STEP 2: Not an admin, proceed with regular user login
    const user = await User.findOne({ email }).select("+password");
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if account is suspended
    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended",
        reason: user.suspensionReason,
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Generate token
    const token = user.generateToken();

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          profilePicture: user.profilePicture,
        },
        token,
      },
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      emailVerificationToken: otp,
      emailVerificationExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    logger.error(`Email verification error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Email verification failed",
      error: error.message,
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters',
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    logger.info(`Password changed for user: ${user._id}`);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    logger.error(`Change password error: ${error.message}`, {
      userId: req.user?.id,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    const verificationToken = user.generateVerificationToken();
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: user.email,
      subject: "Email Verification - skillspocket",
      template: "emailVerification",
      data: {
        name: user.firstName,
        otp: verificationToken,
      },
    });

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    logger.error(`Resend verification error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to resend verification email",
      error: error.message,
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = user.generateResetToken();
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: user.email,
      subject: "Password Reset - skillspocket",
      template: "passwordReset",
      data: {
        name: user.firstName,
        otp: resetToken,
      },
    });

    res.status(200).json({
      success: true,
      message: "Password reset code sent to your email",
    });
  } catch (error) {
    logger.error(`Forgot password error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to send reset code",
      error: error.message,
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset code",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    logger.error(`Reset password error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Password reset failed",
      error: error.message,
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // Optionally, you can blacklist the token in Redis

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error(`Get current user error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user data",
      error: error.message,
    });
  }
};