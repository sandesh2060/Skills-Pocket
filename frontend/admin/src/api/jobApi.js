
// ============================================
// FILE: frontend/admin/src/api/jobApi.js
// ============================================
import api from './axios';

export const getAllJobs = async (params) => {
  const response = await api.get('/jobs', { params });
  return response.data;
};

export const getJobById = async (id) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

export const updateJobStatus = async (id, status) => {
  const response = await api.patch(`/jobs/${id}/status`, { status });
  return response.data;
};

export const deleteJob = async (id) => {
  const response = await api.delete(`/jobs/${id}`);
  return response.data;
};
