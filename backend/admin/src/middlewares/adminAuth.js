// ============================================
// FILE: backend/admin/src/middlewares/adminAuth.js
// FIXED: Import User model from admin models index
// ============================================
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { User } = require('../models'); // ✅ Import from models/index.js

exports.adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required',
        code: 'NO_TOKEN'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try Admin collection first
    let admin = await Admin.findById(decoded.id).select('-password');

    // If not found, check User collection with admin role
    if (!admin && decoded.role === 'admin') {
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.role === 'admin') {
        admin = {
          _id: user._id,
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: 'admin',
          permissions: ['all'],
          profilePicture: user.profilePicture,
          isActive: user.isActive !== false,
        };
      }
    }

    if (!admin) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid authentication token',
        code: 'INVALID_TOKEN'
      });
    }

    if (admin.isActive === false) {
      return res.status(403).json({ 
        success: false,
        error: 'Account is deactivated',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('❌ Admin auth error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};