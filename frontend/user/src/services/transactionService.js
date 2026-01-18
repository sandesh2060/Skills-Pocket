// ============================================
// FILE: frontend/user/src/services/transactionService.js
// ============================================
import api from './api';

const transactionService = {
  /**
   * Get user's transactions
   */
  getMyTransactions: async (params = {}) => {
    try {
      const response = await api.get('/transactions/my-transactions', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get transaction by ID
   */
  getTransactionById: async (id) => {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new transaction
   */
  createTransaction: async (transactionData) => {
    try {
      const response = await api.post('/transactions', transactionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update transaction status
   */
  updateTransactionStatus: async (id, status) => {
    try {
      const response = await api.put(`/transactions/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get financial summary
   */
  getFinancialSummary: async () => {
    try {
      const response = await api.get('/transactions/summary');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default transactionService;