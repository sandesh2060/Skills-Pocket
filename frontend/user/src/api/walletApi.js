// ============================================
// FILE: frontend/user/src/api/walletApi.js
// ============================================
import { userApi } from './axios';

/**
 * Get wallet balance and statistics
 * Matches: GET /api/transactions/wallet
 */
export const getWallet = async () => {
  try {
    const response = await userApi.get('/transactions/wallet');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get transaction history with filters and pagination
 * Matches: GET /api/transactions
 * @param {Object} params - { page, limit, type, status }
 */
export const getTransactionHistory = async (params = {}) => {
  try {
    const response = await userApi.get('/transactions', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get single transaction by ID
 * Matches: GET /api/transactions/:id
 */
export const getTransactionById = async (transactionId) => {
  try {
    const response = await userApi.get(`/transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create payment intent (Client only)
 * Matches: POST /api/transactions/payment-intent
 * @param {Object} data - { jobId, amount, milestoneId? }
 */
export const createPaymentIntent = async (data) => {
  try {
    const response = await userApi.post('/transactions/payment-intent', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Release payment to freelancer (Client only)
 * Matches: POST /api/transactions/release
 * @param {Object} data - { transactionId, jobId }
 */
export const releasePayment = async (data) => {
  try {
    const response = await userApi.post('/transactions/release', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Request withdrawal (Freelancer only)
 * Matches: POST /api/transactions/withdraw
 * @param {Object} data - { amount, method, accountDetails }
 */
export const requestWithdrawal = async (data) => {
  try {
    const response = await userApi.post('/transactions/withdraw', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Export all functions as default object
export default {
  getWallet,
  getTransactionHistory,
  getTransactionById,
  createPaymentIntent,
  releasePayment,
  requestWithdrawal,
};