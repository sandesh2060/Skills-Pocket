// ============================================
// FILE: frontend/user/src/utils/authUtils.js
// FIXED - Consistent token storage with proper cleanup
// ============================================

// Storage keys - centralized for consistency
const STORAGE_KEYS = {
  TOKEN: 'authToken',
  USER: 'user',
  USER_TYPE: 'userType'
};

/**
 * Get admin email domains from environment
 */
const getAdminEmailDomains = () => {
  const domains = import.meta.env.VITE_ADMIN_EMAIL_DOMAINS || '@admin.skillspocket.com';
  return domains.split(',').map(d => d.trim());
};

/**
 * Check if email belongs to admin
 */
export const isAdminEmail = (email) => {
  if (!email) return false;
  const adminDomains = getAdminEmailDomains();
  return adminDomains.some(domain => email.toLowerCase().endsWith(domain.toLowerCase()));
};

/**
 * Store authentication data in localStorage
 * IMPORTANT: This clears ALL old data first to prevent token mismatches
 */
export const storeAuthData = (token, user, userType) => {
  // ✅ CRITICAL: Clear all auth data first to prevent stale tokens
  clearAuthData();
  
  // ✅ Then store new data
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEYS.USER_TYPE, userType);
  
  console.log('✅ Auth data stored:', { 
    hasToken: !!token, 
    userId: user?.id, 
    userRole: user?.role,
    userType 
  });
};

/**
 * Get authentication data from localStorage
 */
export const getAuthData = () => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  const userType = localStorage.getItem(STORAGE_KEYS.USER_TYPE);
  
  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user data:', e);
      // If user data is corrupted, clear everything
      clearAuthData();
    }
  }
  
  return { token, user, userType };
};

/**
 * Clear authentication data from localStorage
 * Also clears any legacy keys that might exist
 */
export const clearAuthData = () => {
  // Clear current keys
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.USER_TYPE);
  
  // ✅ Also clear legacy keys (in case old code used different keys)
  localStorage.removeItem('token'); // Old key
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
  
  console.log('🧹 Auth data cleared');
};

/**
 * Get redirect path based on user type and role
 */
export const getRedirectPath = (userType, role) => {
  if (userType === 'admin') {
    return '/admin/dashboard';
  }
  
  if (role === 'freelancer') {
    return '/freelancer/dashboard';
  }
  
  if (role === 'client') {
    return '/client/dashboard';
  }
  
  return '/';
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const { token, user } = getAuthData();
  return !!(token && user);
};

/**
 * Get user role
 */
export const getUserRole = () => {
  const { user } = getAuthData();
  return user?.role || null;
};

/**
 * Get user type (user or admin)
 */
export const getUserType = () => {
  return localStorage.getItem(STORAGE_KEYS.USER_TYPE) || null;
};

/**
 * Check if current user is freelancer
 */
export const isFreelancer = () => {
  return getUserRole() === 'freelancer';
};

/**
 * Check if current user is client
 */
export const isClient = () => {
  return getUserRole() === 'client';
};

/**
 * Check if current user is admin
 */
export const isAdmin = () => {
  return getUserType() === 'admin';
};

/**
 * Format user name
 */
export const formatUserName = (user) => {
  if (!user) return 'User';
  return `${user.firstName} ${user.lastName}`.trim() || user.email || 'User';
};

/**
 * Get user initials for avatar
 */
export const getUserInitials = (user) => {
  if (!user) return 'U';
  
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 
         user.email?.charAt(0).toUpperCase() || 'U';
};

/**
 * Get auth token
 */
export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Check if token is expired (simple check)
 */
export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;
  
  try {
    // Decode JWT payload (not secure, just for checking exp)
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    if (!payload.exp) {
      console.warn('Token has no expiration field');
      return false; // If no exp field, assume not expired
    }
    
    const exp = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    const isExpired = now >= exp;
    
    if (isExpired) {
      console.log('⏰ Token expired at:', new Date(exp));
    }
    
    return isExpired;
  } catch (e) {
    console.error('Error checking token expiration:', e);
    return true; // If can't decode, assume expired
  }
};

/**
 * Get token expiration time
 */
export const getTokenExpiration = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? new Date(payload.exp * 1000) : null;
  } catch (e) {
    console.error('Error getting token expiration:', e);
    return null;
  }
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber,
    minLength: password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
  };
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};