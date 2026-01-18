// ============================================
// FILE: frontend/user/src/api/proposalApi.js
// PRODUCTION-READY - Complete proposal API
// ============================================
import { userApi } from './axios';

/**
 * Submit a proposal for a job
 * Matches: POST /api/proposals
 */
export const submitProposal = async (data) => {
  try {
    const response = await userApi.post('/proposals', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get proposals for a specific job (Client only)
 * Matches: GET /api/proposals/job/:jobId
 */
export const getJobProposals = async (jobId) => {
  try {
    const response = await userApi.get(`/proposals/job/${jobId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get my proposals (Freelancer)
 * Matches: GET /api/proposals/my-proposals
 */
export const getMyProposals = async (params = {}) => {
  try {
    const response = await userApi.get('/proposals/my-proposals', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Accept a proposal (Client only)
 * Matches: PUT /api/proposals/:id/accept
 */
export const acceptProposal = async (proposalId) => {
  try {
    const response = await userApi.put(`/proposals/${proposalId}/accept`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Reject a proposal (Client only)
 * Matches: PUT /api/proposals/:id/reject
 */
export const rejectProposal = async (proposalId) => {
  try {
    const response = await userApi.put(`/proposals/${proposalId}/reject`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Withdraw a proposal (Freelancer - pending only)
 * Matches: DELETE /api/proposals/:id
 */
export const withdrawProposal = async (proposalId) => {
  try {
    const response = await userApi.delete(`/proposals/${proposalId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Proposal status enum
export const PROPOSAL_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
};

export default {
  submitProposal,
  getJobProposals,
  getMyProposals,
  acceptProposal,
  rejectProposal,
  withdrawProposal,
  PROPOSAL_STATUS,
};