// ============================================
// FILE: frontend/user/src/api/axios.js
// ============================================
import axios from 'axios';
import { getAuthData, clearAuthData } from '../utils/authUtils';

// Create axios instance
const createApiInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const { token } = getAuthData();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
          clearAuthData();
          window.location.href = '/login';
        }
        
        // Handle 403 Forbidden
        if (error.response.status === 403) {
          console.error('Access forbidden:', error.response.data.message);
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