// ============================================
// FILE 2: frontend/admin/src/api/axios.js
// Enhanced axios instance with interceptors
// ============================================
import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';

const API_BASE_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5001/api/admin';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.error || error.message,
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
