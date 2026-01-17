// ============================================
// FILE: frontend/user/src/api/messageApi.js
// ============================================
import { userApi } from './axios';

/**
 * Get all conversations for current user
 * Matches: GET /api/messages/conversations
 */
export const getConversations = async () => {
  try {
    const response = await userApi.get('/messages/conversations');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get messages in a specific conversation
 * Matches: GET /api/messages/conversation/:conversationId
 * @param {String} conversationId
 * @param {Object} params - { page, limit }
 */
export const getConversationMessages = async (conversationId, params = {}) => {
  try {
    const response = await userApi.get(`/messages/conversation/${conversationId}`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Send a new message
 * Matches: POST /api/messages
 * @param {Object} data - { recipientId, text, jobId?, conversationId? }
 */
export const sendMessage = async (data) => {
  try {
    const response = await userApi.post('/messages', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Mark conversation as read
 * Matches: PUT /api/messages/conversation/:conversationId/read
 */
export const markAsRead = async (conversationId) => {
  try {
    const response = await userApi.put(`/messages/conversation/${conversationId}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Upload file attachment
 * Matches: POST /api/messages/upload
 * @param {File} file - File object from input
 */
export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await userApi.post('/messages/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Export all functions as default object
export default {
  getConversations,
  getConversationMessages,
  sendMessage,
  markAsRead,
  uploadFile,
};