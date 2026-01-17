// ============================================
// FILE: frontend/user/src/utils/authUtils.js
// ============================================

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
 */
export const storeAuthData = (token, user, userType) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('userType', userType);
};

/**
 * Get authentication data from localStorage
 */
export const getAuthData = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const userType = localStorage.getItem('userType');
  
  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }
  
  return { token, user, userType };
};

/**
 * Clear authentication data from localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userType');
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
  return localStorage.getItem('userType') || null;
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
  return localStorage.getItem('token');
};

/**
 * Check if token is expired (simple check)
 * Note: For production, decode JWT and check exp claim
 */
export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;
  
  try {
    // Simple decode (not secure, just for checking)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= exp;
  } catch (e) {
    return true;
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