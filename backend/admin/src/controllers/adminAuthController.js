// ============================================
// FILE: backend/admin/src/controllers/adminAuthController.js
// FIXED: Added missing closing brace for logout function
// ============================================
const Admin = require("../models/Admin");
const { sendResponse, sendError } = require("../utils/responseHandler");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, "Please provide email and password", 400);
    }

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return sendError(res, "Invalid credentials", 401);
    }

    if (!admin.isActive) {
      return sendError(res, "Account is deactivated", 403);
    }

    if (admin.isLocked()) {
      return sendError(res, "Account is locked. Please try again later", 423);
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      await admin.incLoginAttempts();
      return sendError(res, "Invalid credentials", 401);
    }

    await admin.resetLoginAttempts();
    admin.lastLogin = new Date();
    await admin.save();

    await admin.logActivity("login", "Admin logged in", req.ip);

    const token = admin.generateToken();

    const adminData = {
      id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      profilePicture: admin.profilePicture,
    };

    sendResponse(
      res,
      {
        token,
        admin: adminData,
      },
      "Login successful",
    );
  } catch (error) {
    console.error("Admin login error:", error);
    sendError(res, "Login failed", 500);
  }
};

exports.getCurrentAdmin = async (req, res) => {
  try {
    // FIXED: req.admin is already set by the middleware
    // No need to query database again - just return it
    const admin = req.admin;

    if (!admin) {
      return sendError(res, "Admin not found", 404);
    }

    // Return admin data (works for both real Admin and virtual admin from User)
    sendResponse(
      res,
      {
        id: admin._id || admin.id,
        email: admin.email,
        role: admin.role,
        firstName: admin.firstName,
        lastName: admin.lastName,
        permissions: admin.permissions,
        profilePicture: admin.profilePicture,
        isActive: admin.isActive,
      },
      "Admin retrieved successfully",
    );
  } catch (error) {
    console.error("Get admin error:", error);
    sendError(res, "Failed to get admin", 500);
  }
};

exports.logout = async (req, res) => {
  try {
    // Only log activity if it's a real Admin model with the method
    if (typeof req.admin.logActivity === "function") {
      await req.admin.logActivity("logout", "Admin logged out", req.ip);
    }
    sendResponse(res, null, "Logout successful");
  } catch (error) {
    console.error("Logout error:", error);
    sendError(res, "Logout failed", 500);
  }
};
