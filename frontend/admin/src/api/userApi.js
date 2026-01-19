// ============================================
// FILE: frontend/admin/src/api/userApi.js
// ============================================
import api from './axios';

export const getAllUsers = async (params) => {
  const response = await api.get('/users', { params });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const suspendUser = async (id, reason) => {
  const response = await api.patch(`/users/${id}/suspend`, { reason });
  return response.data;
};

export const unsuspendUser = async (id) => {
  const response = await api.patch(`/users/${id}/unsuspend`);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const verifyUser = async (id) => {
  const response = await api.patch(`/users/${id}/verify`);
  return response.data;
};
