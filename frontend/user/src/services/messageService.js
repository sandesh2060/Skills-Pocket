// ============================================
// FILE: frontend/user/src/services/messageService.js
// ============================================
import api from './api';

const messageService = {
  /**
   * Send a message
   */
  sendMessage: async (data) => {
    try {
      const response = await api.post('/messages', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Upload file attachment
   */
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/messages/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default messageService;