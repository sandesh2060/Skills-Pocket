// ============================================
// FILE: frontend/user/src/api/profileApi.js
// PRODUCTION-READY - Complete profile API with error handling
// ============================================
import { userApi } from './axios';

/**
 * Get my profile
 */
export const getMyProfile = async () => {
  const response = await userApi.get('/users/profile');
  return response.data;
};

/**
 * Update my profile
 */
export const updateProfile = async (profileData) => {
  const response = await userApi.put('/users/profile', profileData);
  return response.data;
};

/**
 * Upload profile picture
 */
export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('profilePicture', file);
  
  const response = await userApi.post('/users/profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

/**
 * Add skill
 */
export const addSkill = async (skill) => {
  const response = await userApi.post('/users/skills', { skill });
  return response.data;
};

/**
 * Remove skill
 */
export const removeSkill = async (skill) => {
  const response = await userApi.delete(`/users/skills/${encodeURIComponent(skill)}`);
  return response.data;
};

/**
 * Add portfolio item
 */
export const addPortfolioItem = async (portfolioData) => {
  const response = await userApi.post('/users/portfolio', portfolioData);
  return response.data;
};

/**
 * Update portfolio item
 */
export const updatePortfolioItem = async (itemId, portfolioData) => {
  const response = await userApi.put(`/users/portfolio/${itemId}`, portfolioData);
  return response.data;
};

/**
 * Delete portfolio item
 */
export const deletePortfolioItem = async (itemId) => {
  const response = await userApi.delete(`/users/portfolio/${itemId}`);
  return response.data;
};

/**
 * Get public user profile by ID
 */
export const getUserById = async (userId) => {
  const response = await userApi.get(`/users/${userId}`);
  return response.data;
};

/**
 * Update notification preferences
 */
export const updateNotificationPreferences = async (preferences) => {
  const response = await userApi.put('/users/notifications', preferences);
  return response.data;
};

/**
 * Deactivate account
 */
export const deactivateAccount = async () => {
  const response = await userApi.post('/users/deactivate');
  return response.data;
};