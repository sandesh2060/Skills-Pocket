// ============================================
// FILE: frontend/user/src/services/conversationService.js
// ============================================
import api from './api';

const conversationService = {
  /**
   * Get all conversations for current user
   */
  getConversations: async () => {
    try {
      const response = await api.get('/messages/conversations');
      return response.data;
    } catch (error) {
      console.error('Get conversations error:', error);
      throw error;
    }
  },

  /**
   * Get messages in a conversation
   */
  getConversationMessages: async (conversationId, page = 1, limit = 50) => {
    try {
      const response = await api.get(`/messages/conversation/${conversationId}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Get conversation messages error:', error);
      throw error;
    }
  },

  /**
   * Mark conversation as read
   */
  markAsRead: async (conversationId) => {
    try {
      const response = await api.put(`/messages/conversation/${conversationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  },

  /**
   * Start a new conversation
   */
  startConversation: async (recipientId, initialMessage, jobId = null) => {
    try {
      const response = await api.post('/messages', {
        recipientId,
        text: initialMessage,
        jobId,
      });
      return response.data;
    } catch (error) {
      console.error('Start conversation error:', error);
      throw error;
    }
  },
};

export default conversationService;