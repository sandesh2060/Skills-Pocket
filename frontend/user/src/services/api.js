// ============================================
// FILE: frontend/user/src/services/api.js
// ============================================
import axios from 'axios';

const API_URL = import.meta.env.VITE_USER_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: false,
});

let isRedirecting = false;

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    // Try multiple possible token storage keys
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('authToken') || 
                  localStorage.getItem('auth_token');
    
    console.log('🔑 Token found:', !!token); // Debug log
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No token found in localStorage');
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    isRedirecting = false;
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const errorMessage = data?.message || data?.error || 'An error occurred';

      console.error(`API Error [${status}]:`, errorMessage);

      if (status === 401) {
        if (!isRedirecting) {
          isRedirecting = true;
          
          // Clear all possible token keys
          localStorage.removeItem('token');
          localStorage.removeItem('authToken');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          localStorage.removeItem('userType');
          
          window.dispatchEvent(new CustomEvent('auth:unauthorized', {
            detail: { message: 'Session expired. Please login again.' }
          }));

          setTimeout(() => {
            window.location.href = '/login';
          }, 100);
        }

        return Promise.reject(new Error('Session expired. Please login again.'));
      }

      if (status === 403) {
        return Promise.reject(new Error(errorMessage || 'Access forbidden'));
      }

      if (status === 404) {
        return Promise.reject(new Error(errorMessage || 'Resource not found'));
      }

      if (status === 500) {
        return Promise.reject(new Error('Server error. Please try again later.'));
      }

      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      console.error('Network error - no response:', error.request);
      
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(new Error('Request timeout. Please try again.'));
      }
      
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      console.error('Request setup error:', error.message);
      return Promise.reject(new Error(error.message || 'An unexpected error occurred'));
    }
  }
);

export default api;