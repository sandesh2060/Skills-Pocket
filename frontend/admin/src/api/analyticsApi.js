// ============================================
// FILE: frontend/admin/src/api/analyticsApi.js
// ============================================
import api from './axios';

export const getDashboardStats = async (period = '30') => {
  const response = await api.get('/analytics/dashboard', {
    params: { period },
  });
  return response.data;
};

export const getTransactionAnalytics = async (period = '30') => {
  const response = await api.get('/analytics/transactions', {
    params: { period },
  });
  return response.data;
};