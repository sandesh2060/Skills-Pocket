// ============================================
// FILE: frontend/user/src/api/transactionApi.js
// Complete Transaction API Service
// ============================================
import { userApi } from './axios';

const transactionApi = {
  /**
   * Get my transactions with filters and pagination
   * @param {Object} params - { page, limit, status, type }
   */
  getMyTransactions: async (params = {}) => {
    try {
      const response = await userApi.get('/transactions/my-transactions', { params });
      return response.data;
    } catch (error) {
      console.error('Get transactions error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Get transaction by ID
   * @param {string} transactionId
   */
  getTransactionById: async (transactionId) => {
    try {
      const response = await userApi.get(`/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error('Get transaction by ID error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Create new transaction
   * @param {Object} data - { to, amount, job, type, description, paymentMethod }
   */
  createTransaction: async (data) => {
    try {
      const response = await userApi.post('/transactions', data);
      return response.data;
    } catch (error) {
      console.error('Create transaction error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Update transaction status
   * @param {string} transactionId
   * @param {string} status - 'pending' | 'completed' | 'failed' | 'cancelled'
   */
  updateTransactionStatus: async (transactionId, status) => {
    try {
      const response = await userApi.put(`/transactions/${transactionId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update transaction status error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Get financial summary (balance, earnings, pending, etc.)
   */
  getFinancialSummary: async () => {
    try {
      const response = await userApi.get('/transactions/summary');
      return response.data;
    } catch (error) {
      console.error('Get financial summary error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Request withdrawal
   * @param {Object} data - { amount, method, accountDetails }
   */
  requestWithdrawal: async (data) => {
    try {
      // This creates a withdrawal transaction
      const response = await userApi.post('/transactions', {
        ...data,
        type: 'withdrawal',
      });
      return response.data;
    } catch (error) {
      console.error('Request withdrawal error:', error);
      throw error.response?.data || error;
    }
  },
};

export default transactionApi;