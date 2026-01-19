// ============================================
// FILE: frontend/user/src/api/supportApi.js
// ============================================
import { userApi } from './axios';

/**
 * Create support ticket
 */
export const createTicket = async (ticketData) => {
  const response = await userApi.post('/support/tickets', ticketData);
  return response.data;
};

/**
 * Get all my tickets
 */
export const getMyTickets = async (params = {}) => {
  const response = await userApi.get('/support/tickets', { params });
  return response.data;
};

/**
 * Get ticket by ID
 */
export const getTicketById = async (ticketId) => {
  const response = await userApi.get(`/support/tickets/${ticketId}`);
  return response.data;
};

/**
 * Add message to ticket
 */
export const addTicketMessage = async (ticketId, message) => {
  const response = await userApi.post(`/support/tickets/${ticketId}/messages`, {
    message,
  });
  return response.data;
};

/**
 * Close ticket
 */
export const closeTicket = async (ticketId) => {
  const response = await userApi.put(`/support/tickets/${ticketId}/close`);
  return response.data;
};

/**
 * Rate ticket
 */
export const rateTicket = async (ticketId, rating) => {
  const response = await userApi.post(`/support/tickets/${ticketId}/rate`, rating);
  return response.data;
};

/**
 * Get ticket stats
 */
export const getTicketStats = async () => {
  const response = await userApi.get('/support/stats');
  return response.data;
};

export default {
  createTicket,
  getMyTickets,
  getTicketById,
  addTicketMessage,
  closeTicket,
  rateTicket,
  getTicketStats,
};