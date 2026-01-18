// ============================================
// FILE: frontend/user/src/services/userService.js
// ============================================
import api from './api';

const userService = {
  /**
   * Get current user profile
   */
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user by ID (public profile)
   */
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Upload profile picture
   */
  uploadProfilePicture: async (file) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await api.post('/users/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update notification preferences
   */
  updateNotificationPreferences: async (preferences) => {
    try {
      const response = await api.put('/users/notifications', preferences);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Deactivate account
   */
  deactivateAccount: async () => {
    try {
      const response = await api.post('/users/deactivate');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get dashboard stats
   */
  getDashboardStats: async () => {
    try {
      const response = await api.get('/users/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;