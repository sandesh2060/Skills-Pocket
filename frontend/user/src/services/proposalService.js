// ============================================
// FILE: frontend/user/src/services/proposalService.js
// ============================================
import api from './api';

const proposalService = {
  /**
   * Submit a new proposal
   */
  submitProposal: async (proposalData) => {
    try {
      const response = await api.post('/proposals', proposalData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get freelancer's proposals with filters
   */
  getMyProposals: async (params = {}) => {
    try {
      const response = await api.get('/proposals/my-proposals', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get proposals for a specific job (client only)
   */
  getJobProposals: async (jobId) => {
    try {
      const response = await api.get(`/proposals/job/${jobId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Withdraw a proposal
   */
  withdrawProposal: async (proposalId) => {
    try {
      const response = await api.delete(`/proposals/${proposalId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Accept a proposal (client only)
   */
  acceptProposal: async (proposalId) => {
    try {
      const response = await api.put(`/proposals/${proposalId}/accept`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reject a proposal (client only)
   */
  rejectProposal: async (proposalId) => {
    try {
      const response = await api.put(`/proposals/${proposalId}/reject`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default proposalService;