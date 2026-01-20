// ============================================
// FILE: frontend/admin/src/api/disputeApi.js
// API Helper Functions for Dispute Management
// ============================================
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/admin';

// Get authentication token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Get all disputes with filters
export const getAllDisputes = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.type) params.append('type', filters.type);

    const response = await axios.get(
      `${API_BASE_URL}/disputes?${params}`,
      getAuthHeader()
    );

    return response.data;
  } catch (error) {
    console.error('Get disputes error:', error);
    throw error;
  }
};

// Get single dispute by ID
export const getDisputeById = async (disputeId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/disputes/${disputeId}`,
      getAuthHeader()
    );

    return response.data;
  } catch (error) {
    console.error('Get dispute error:', error);
    throw error;
  }
};

// Assign dispute to current admin
export const assignDispute = async (disputeId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/disputes/${disputeId}/assign`,
      {},
      getAuthHeader()
    );

    return response.data;
  } catch (error) {
    console.error('Assign dispute error:', error);
    throw error;
  }
};

// Resolve dispute
export const resolveDispute = async (disputeId, resolutionData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/disputes/${disputeId}/resolve`,
      resolutionData,
      getAuthHeader()
    );

    return response.data;
  } catch (error) {
    console.error('Resolve dispute error:', error);
    throw error;
  }
};

// Update dispute priority
export const updateDisputePriority = async (disputeId, priority) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/disputes/${disputeId}/priority`,
      { priority },
      getAuthHeader()
    );

    return response.data;
  } catch (error) {
    console.error('Update priority error:', error);
    throw error;
  }
};

// Escalate dispute
export const escalateDispute = async (disputeId, reason) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/disputes/${disputeId}/escalate`,
      { reason },
      getAuthHeader()
    );

    return response.data;
  } catch (error) {
    console.error('Escalate dispute error:', error);
    throw error;
  }
};

// Close dispute
export const closeDispute = async (disputeId, note) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/disputes/${disputeId}/close`,
      { note },
      getAuthHeader()
    );

    return response.data;
  } catch (error) {
    console.error('Close dispute error:', error);
    throw error;
  }
};