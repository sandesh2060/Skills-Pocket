// ============================================
// FILE: frontend/user/src/api/profileApi.js
// ============================================
import { userApi } from './axios';

/**
 * Get public freelancer profile
 */
export const getFreelancerProfile = async (freelancerId) => {
  const response = await userApi.get(`/profiles/freelancer/${freelancerId}`);
  return response.data;
};

/**
 * Get my profile
 */
export const getMyProfile = async () => {
  const response = await userApi.get('/profiles/me');
  return response.data;
};

/**
 * Update my profile
 */
export const updateProfile = async (profileData) => {
  const response = await userApi.put('/profiles/me', profileData);
  return response.data;
};

/**
 * Upload profile photo
 */
export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append('photo', file);
  
  const response = await userApi.post('/profiles/photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

/**
 * Add portfolio item
 */
export const addPortfolioItem = async (portfolioData) => {
  const response = await userApi.post('/profiles/portfolio', portfolioData);
  return response.data;
};

/**
 * Update portfolio item
 */
export const updatePortfolioItem = async (itemId, portfolioData) => {
  const response = await userApi.put(`/profiles/portfolio/${itemId}`, portfolioData);
  return response.data;
};

/**
 * Delete portfolio item
 */
export const deletePortfolioItem = async (itemId) => {
  const response = await userApi.delete(`/profiles/portfolio/${itemId}`);
  return response.data;
};

/**
 * Add skill
 */
export const addSkill = async (skill, proficiency) => {
  const response = await userApi.post('/profiles/skills', { skill, proficiency });
  return response.data;
};

/**
 * Remove skill
 */
export const removeSkill = async (skillId) => {
  const response = await userApi.delete(`/profiles/skills/${skillId}`);
  return response.data;
};

/**
 * Get freelancer reviews
 */
export const getReviews = async (freelancerId) => {
  const response = await userApi.get(`/profiles/freelancer/${freelancerId}/reviews`);
  return response.data;
};