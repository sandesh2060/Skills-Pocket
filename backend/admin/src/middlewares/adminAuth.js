// ============================================
// FILE: backend/admin/src/middlewares/adminAuth.js
// FIXED - Check both Admin and User collections
// ============================================
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

exports.adminAuth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No authorization header found');
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('🔑 Token received:', token.substring(0, 30) + '...');

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded:', {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });

    console.log('🔍 Searching for admin with ID:', decoded.id);

    // ✅ STEP 1: Try to find in Admin collection first
    let admin = await Admin.findById(decoded.id).select('-password');
    
    if (admin) {
      console.log('✅ Admin found in Admin collection:', admin.email);
    } else {
      // ✅ STEP 2: If not found, try User collection (for admins created as users)
      console.log('⚠️ Not found in Admin collection, checking User collection...');
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.role === 'admin') {
        console.log('✅ Admin found in User collection:', user.email);
        // Create a virtual admin object from user
        admin = {
          _id: user._id,
          id: user._id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePicture: user.profilePicture,
          isActive: user.isActive,
          permissions: [], // Default empty permissions for user-based admins
        };
      } else {
        console.log('❌ Admin not found in either collection');
        return res.status(401).json({ error: 'Admin not found' });
      }
    }

    // Check if admin is active
    if (!admin.isActive) {
      console.log('⚠️ Admin account is inactive');
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // Attach admin to request
    req.admin = admin;
    console.log('✅ Authentication successful for:', admin.email);
    next();
  } catch (error) {
    console.error('❌ Admin auth error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }

    res.status(500).json({ error: 'Authentication failed' });
  }
};