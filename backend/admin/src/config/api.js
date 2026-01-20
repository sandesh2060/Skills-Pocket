export const API_BASE_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5001/api/admin';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  
  // Settings
  PROFILE: '/settings/profile',
  PASSWORD: '/settings/password',
  PLATFORM: '/settings/platform',
  NOTIFICATIONS: '/settings/notifications',
  SECURITY: '/settings/security',
  
  // Users
  USERS: '/users',
  
  // Jobs
  JOBS: '/jobs',
  
  // Disputes
  DISPUTES: '/disputes',
  
  // Analytics
  DASHBOARD_STATS: '/dashboard/stats',
  REVENUE: '/dashboard/revenue',
};