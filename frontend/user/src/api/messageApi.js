// ============================================
// FILE: frontend/user/src/api/messageApi.js
// FIXED VERSION - Removed /api prefix (already in axios baseURL)
// ============================================
import axios from './axios';

/**
 * Get or create a conversation with a specific user
 * @param {string} userId - The ID of the user to message
 * @returns {Promise} Response with conversation data
 */
export const getOrCreateConversation = async (userId) => {
  try {
    const response = await axios.post('/messages/conversations', {
      participantId: userId
    });
    return response.data;
  } catch (error) {
    console.error('Error getting/creating conversation:', error);
    throw error.response?.data || { message: 'Failed to open conversation' };
  }
};

/**
 * Get all conversations for the current user
 * @returns {Promise} Response with conversations list
 */
export const getConversations = async () => {
  try {
    const response = await axios.get('/messages/conversations');
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error.response?.data || { message: 'Failed to fetch conversations' };
  }
};

/**
 * Get messages from a specific conversation
 * @param {string} conversationId - The conversation ID
 * @param {number} page - Page number for pagination
 * @param {number} limit - Number of messages per page
 * @returns {Promise} Response with messages
 */
export const getMessages = async (conversationId, page = 1, limit = 50) => {
  try {
    const response = await axios.get(`/messages/conversation/${conversationId}`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error.response?.data || { message: 'Failed to fetch messages' };
  }
};

/**
 * Send a message in a conversation
 * @param {string} conversationId - The conversation ID
 * @param {string} content - Message content
 * @param {Array} attachments - Optional file attachments
 * @returns {Promise} Response with sent message
 */
export const sendMessage = async (conversationId, content, attachments = []) => {
  try {
    const response = await axios.post('/messages', {
      conversationId,
      content,
      attachments
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error.response?.data || { message: 'Failed to send message' };
  }
};

/**
 * Mark messages as read
 * @param {string} conversationId - The conversation ID
 * @returns {Promise} Response confirming messages marked as read
 */
export const markAsRead = async (conversationId) => {
  try {
    const response = await axios.put(`/messages/conversation/${conversationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error.response?.data || { message: 'Failed to mark as read' };
  }
};

/**
 * Delete a conversation
 * @param {string} conversationId - The conversation ID
 * @returns {Promise} Response confirming deletion
 */
export const deleteConversation = async (conversationId) => {
  try {
    const response = await axios.delete(`/messages/conversation/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error.response?.data || { message: 'Failed to delete conversation' };
  }
};

/**
 * Search messages
 * @param {string} query - Search query
 * @returns {Promise} Response with search results
 */
export const searchMessages = async (query) => {
  try {
    const response = await axios.get('/messages/search', {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching messages:', error);
    throw error.response?.data || { message: 'Failed to search messages' };
  }
};

/**
 * Upload file for message attachment
 * @param {File} file - File to upload
 * @returns {Promise} Response with uploaded file URL
 */
export const uploadMessageAttachment = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/messages/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading attachment:', error);
    throw error.response?.data || { message: 'Failed to upload file' };
  }
};