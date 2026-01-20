// ============================================
// FILE: frontend/user/src/api/axios.js
// FIXED - Added token debugging and validation
// ============================================
import axios from 'axios';
import { getAuthData, clearAuthData } from '../utils/authUtils';

// Helper to decode JWT and extract user info
const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      userId: payload.userId || payload.id || payload.sub,
      role: payload.role,
      email: payload.email,
      exp: payload.exp,
    };
  } catch (e) {
    console.error('❌ Failed to decode token:', e);
    return null;
  }
};

// Create axios instance
const createApiInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  });

  // Request interceptor with debugging
  instance.interceptors.request.use(
    (config) => {
      const { token, user } = getAuthData();
      
      if (token) {
        // Decode token to verify it matches current user
        const tokenData = decodeToken(token);
        
        console.log('🔐 Token Debug:', {
          endpoint: config.url,
          userInLocalStorage: user?.role,
          userInToken: tokenData?.role,
          tokenUserId: tokenData?.userId,
          localStorageUserId: user?.id,
          tokensMatch: tokenData?.role === user?.role,
          tokenPreview: token.substring(0, 30) + '...',
        });
        
        // ⚠️ WARNING: If token role doesn't match user role, clear auth
        if (tokenData && user && tokenData.role !== user.role) {
          console.error('🚨 TOKEN MISMATCH DETECTED!');
          console.error('Token says role:', tokenData.role);
          console.error('LocalStorage says role:', user.role);
          console.error('🧹 Clearing auth data and redirecting to login...');
          
          clearAuthData();
          window.location.href = '/login';
          return Promise.reject(new Error('Token role mismatch - please login again'));
        }
        
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log('⚠️ No token found for request:', config.url);
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        // Handle 401 Unauthorized
        if (error.response.status === 401) {
          console.log('🚫 401 Unauthorized - clearing auth and redirecting');
          clearAuthData();
          window.location.href = '/login';
        }
        
        // Handle 403 Forbidden
        if (error.response.status === 403) {
          const message = error.response.data?.message || 'Access forbidden';
          console.error('🚫 403 Forbidden:', message);
          
          // Check if it's a role mismatch issue
          const { user } = getAuthData();
          if (user && message.includes('role')) {
            console.error('🚨 Role-based 403 error detected');
            console.error('Current user role:', user.role);
            console.error('This might be a token/role mismatch');
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// User API instance
export const userApi = createApiInstance(
  import.meta.env.VITE_USER_API_URL || 'http://localhost:5000/api'
);

// Admin API instance
export const adminApi = createApiInstance(
  import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5001/api'
);

// Default export (will be set based on context)
export default userApi;