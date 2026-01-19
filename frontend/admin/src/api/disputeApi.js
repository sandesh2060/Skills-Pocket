// ============================================
// FILE: frontend/admin/src/api/disputeApi.js
// ============================================
import api from './axios';

export const getAllDisputes = async (params) => {
  const response = await api.get('/disputes', { params });
  return response.data;
};

export const getDisputeById = async (id) => {
  const response = await api.get(`/disputes/${id}`);
  return response.data;
};

export const assignDispute = async (id, adminId) => {
  const response = await api.patch(`/disputes/${id}/assign`, { adminId });
  return response.data;
};

export const resolveDispute = async (id, data) => {
  const response = await api.patch(`/disputes/${id}/resolve`, data);
  return response.data;
};

export const addDisputeMessage = async (id, message) => {
  const response = await api.post(`/disputes/${id}/messages`, { message });
  return response.data;
};

export const updateDisputePriority = async (id, priority) => {
  const response = await api.patch(`/disputes/${id}/priority`, { priority });
  return response.data;
};
