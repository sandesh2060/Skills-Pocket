// ============================================
// FILE: frontend/user/src/api/authApi.js
// ============================================
import { userApi, adminApi } from './axios';
import { isAdminEmail } from '../utils/authUtils';

/**
 * Register new user
 */
export const register = async (userData) => {
  const response = await userApi.post('/auth/register', userData);
  return response.data;
};

/**
 * Login user or admin (auto-detected by email)
 */
export const login = async (credentials) => {
  const { email, password } = credentials;
  
  // Auto-detect if admin based on email
  const isAdmin = isAdminEmail(email);
  
  // Choose appropriate API
  const api = isAdmin ? adminApi : userApi;
  const endpoint = isAdmin ? '/admin/auth/login' : '/auth/login';
  
  try {
    const response = await api.post(endpoint, { email, password });
    return {
      ...response.data,
      userType: isAdmin ? 'admin' : 'user'
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Verify email with OTP
 */
export const verifyEmail = async (email, otp) => {
  const response = await userApi.post('/auth/verify-email', { email, otp });
  return response.data;
};

/**
 * Resend verification email
 */
export const resendVerification = async (email) => {
  const response = await userApi.post('/auth/resend-verification', { email });
  return response.data;
};

/**
 * Request password reset
 */
export const forgotPassword = async (email) => {
  const isAdmin = isAdminEmail(email);
  const api = isAdmin ? adminApi : userApi;
  
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

/**
 * Reset password with OTP
 */
export const resetPassword = async (email, otp, newPassword) => {
  const isAdmin = isAdminEmail(email);
  const api = isAdmin ? adminApi : userApi;
  
  const response = await api.post('/auth/reset-password', {
    email,
    otp,
    newPassword
  });
  return response.data;
};

/**
 * Logout user/admin
 */
export const logout = async () => {
  const userType = localStorage.getItem('userType');
  const api = userType === 'admin' ? adminApi : userApi;
  
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    // Even if API call fails, clear local data
    throw error;
  }
};

/**
 * Get current user/admin
 */
export const getCurrentUser = async () => {
  const userType = localStorage.getItem('userType');
  const api = userType === 'admin' ? adminApi : userApi;
  const endpoint = userType === 'admin' ? '/admin/auth/me' : '/auth/me';
  
  const response = await api.get(endpoint);
  return response.data;
};