// ============================================
// FILE: frontend/user/src/services/hireService.js
// ============================================
import api from './api';

const hireService = {
  /**
   * Create hire request
   */
  createHireRequest: async (data) => {
    try {
      const response = await api.post('/hire-requests', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get my hire requests (as client)
   */
  getMyHireRequests: async (params = {}) => {
    try {
      const response = await api.get('/hire-requests/client', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get hire requests received (as freelancer)
   */
  getReceivedHireRequests: async (params = {}) => {
    try {
      const response = await api.get('/hire-requests/freelancer', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get hire request by ID
   */
  getHireRequestById: async (id) => {
    try {
      const response = await api.get(`/hire-requests/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Accept hire request (freelancer)
   */
  acceptHireRequest: async (id, message) => {
    try {
      const response = await api.put(`/hire-requests/${id}/accept`, { message });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reject hire request (freelancer)
   */
  rejectHireRequest: async (id, message) => {
    try {
      const response = await api.put(`/hire-requests/${id}/reject`, { message });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Withdraw hire request (client)
   */
  withdrawHireRequest: async (id) => {
    try {
      const response = await api.delete(`/hire-requests/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default hireService;