// ============================================
// FILE: backend/user/src/middlewares/authMiddleware.js
// ============================================
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../utils/logger");

// In authMiddleware.js
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    try {
      // 🔍 ADD THESE DEBUG LOGS
      console.log("🔑 JWT_SECRET exists:", !!process.env.JWT_SECRET);
      console.log("🔑 JWT_SECRET length:", process.env.JWT_SECRET?.length);
      console.log("🔑 Token first 30 chars:", token.substring(0, 30) + "...");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("✅ Token decoded:", decoded);

      req.user = await User.findById(decoded.id);

      console.log("👤 User found:", !!req.user);
      console.log("👤 User ID:", req.user?._id);

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      if (req.user.isSuspended) {
        return res.status(403).json({
          success: false,
          message: "Your account has been suspended",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};
