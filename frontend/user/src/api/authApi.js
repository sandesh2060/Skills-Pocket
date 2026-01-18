// ============================================
// FILE: frontend/user/src/api/authApi.js
// FIXED - Prevents infinite retries on network errors
// ============================================
import { userApi, adminApi } from './axios';
import { isAdminEmail } from '../utils/authUtils';

// Track failed requests to prevent infinite retries
const failedRequests = new Map();
const MAX_RETRIES = 2;
const RETRY_DELAY = 5000; // 5 seconds

/**
 * Check if we should skip request due to recent failures
 */
const shouldSkipRequest = (key) => {
  const lastFailure = failedRequests.get(key);
  if (!lastFailure) return false;
  
  const { count, timestamp } = lastFailure;
  const timeSinceFailure = Date.now() - timestamp;
  
  // If we've hit max retries and it's been less than RETRY_DELAY, skip
  if (count >= MAX_RETRIES && timeSinceFailure < RETRY_DELAY) {
    return true;
  }
  
  // Reset if enough time has passed
  if (timeSinceFailure >= RETRY_DELAY) {
    failedRequests.delete(key);
    return false;
  }
  
  return false;
};

/**
 * Record a failed request
 */
const recordFailure = (key) => {
  const existing = failedRequests.get(key);
  failedRequests.set(key, {
    count: existing ? existing.count + 1 : 1,
    timestamp: Date.now()
  });
};

/**
 * Clear failure record on success
 */
const clearFailure = (key) => {
  failedRequests.delete(key);
};

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
    clearFailure('login');
    return {
      ...response.data,
      userType: isAdmin ? 'admin' : 'user'
    };
  } catch (error) {
    recordFailure('login');
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
    clearFailure('getCurrentUser');
    return response.data;
  } catch (error) {
    // Even if API call fails, clear local data
    throw error;
  }
};

/**
 * Get current user/admin
 * WITH RETRY PREVENTION - Won't spam requests when offline
 */
export const getCurrentUser = async () => {
  const requestKey = 'getCurrentUser';
  
  // Skip if we've recently failed multiple times
  if (shouldSkipRequest(requestKey)) {
    console.log('⏭️ Skipping getCurrentUser - too many recent failures');
    throw new Error('Skipping request due to recent failures');
  }
  
  const userType = localStorage.getItem('userType');
  const api = userType === 'admin' ? adminApi : userApi;
  const endpoint = userType === 'admin' ? '/admin/auth/me' : '/auth/me';
  
  try {
    const response = await api.get(endpoint);
    clearFailure(requestKey);
    return response.data;
  } catch (error) {
    // Only record network errors, not 401s
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      recordFailure(requestKey);
      console.log(`⚠️ Network error in getCurrentUser (attempt ${failedRequests.get(requestKey)?.count || 1}/${MAX_RETRIES})`);
    }
    throw error;
  }
};