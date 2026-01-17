// ============================================
// FILE: frontend/user/src/services/freelancerService.js
// ============================================
import api from './api';

const freelancerService = {
  /**
   * Get all freelancers with filters and pagination
   */
  getFreelancers: async (params = {}) => {
    try {
      const response = await api.get('/freelancers', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get single freelancer by ID
   */
  getFreelancerById: async (id) => {
    try {
      const response = await api.get(`/freelancers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get featured/top freelancers
   */
  getFeaturedFreelancers: async (limit = 6) => {
    try {
      const response = await api.get('/freelancers/featured', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all unique skills
   */
  getAllSkills: async () => {
    try {
      const response = await api.get('/freelancers/skills/all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Search freelancers by skill
   */
  searchBySkill: async (skill, limit = 10) => {
    try {
      const response = await api.get('/freelancers/search/skills', {
        params: { skill, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default freelancerService;