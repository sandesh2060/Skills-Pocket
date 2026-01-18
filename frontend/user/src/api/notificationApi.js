// ============================================
// FILE: frontend/user/src/api/notificationApi.js
// FIXED - Prevents infinite retries on network errors
// ============================================
import axios from './axios';

// Track failed requests to prevent infinite retries
const failedRequests = new Map();
const MAX_RETRIES = 2;
const RETRY_DELAY = 10000; // 10 seconds

/**
 * Check if we should skip request due to recent failures
 */
const shouldSkipRequest = (key) => {
  const lastFailure = failedRequests.get(key);
  if (!lastFailure) return false;
  
  const { count, timestamp } = lastFailure;
  const timeSinceFailure = Date.now() - timestamp;
  
  // If we've hit max retries and it's been less than RETRY_DELAY, skip
  if (count >= MAX_RETRIES && timeSinceFailure < RETRY_DELAY) {
    return true;
  }
  
  // Reset if enough time has passed
  if (timeSinceFailure >= RETRY_DELAY) {
    failedRequests.delete(key);
    return false;
  }
  
  return false;
};

/**
 * Record a failed request
 */
const recordFailure = (key) => {
  const existing = failedRequests.get(key);
  failedRequests.set(key, {
    count: existing ? existing.count + 1 : 1,
    timestamp: Date.now()
  });
};

/**
 * Clear failure record on success
 */
const clearFailure = (key) => {
  failedRequests.delete(key);
};

const notificationApi = {
  /**
   * Get user's notifications
   */
  getNotifications: async (params = {}) => {
    try {
      const response = await axios.get('/notifications', { params });
      return response.data;
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  },

  /**
   * Get unread notification count
   * WITH RETRY PREVENTION - Won't spam requests when offline
   */
  getUnreadCount: async () => {
    const requestKey = 'getUnreadCount';
    
    // Skip if we've recently failed multiple times
    if (shouldSkipRequest(requestKey)) {
      console.log('⏭️ Skipping getUnreadCount - too many recent failures');
      return { 
        success: false, 
        data: { count: 0 },
        skipped: true
      };
    }
    
    try {
      const response = await axios.get('/notifications/unread-count');
      clearFailure(requestKey);
      return response.data;
    } catch (error) {
      // Only record network errors
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        recordFailure(requestKey);
        const failureCount = failedRequests.get(requestKey)?.count || 1;
        console.log(`⚠️ Network error in getUnreadCount (attempt ${failureCount}/${MAX_RETRIES})`);
      } else {
        console.error('Get unread count error:', error);
      }
      
      // Return default structure on error instead of throwing
      return { 
        success: false, 
        data: { count: 0 } 
      };
    }
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (notificationId) => {
    try {
      const response = await axios.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    try {
      const response = await axios.patch('/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Mark all as read error:', error);
      throw error;
    }
  },

  /**
   * Delete notification
   */
  deleteNotification: async (notificationId) => {
    try {
      const response = await axios.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  },

  /**
   * Get notification preferences
   */
  getPreferences: async () => {
    try {
      const response = await axios.get('/notifications/preferences');
      return response.data;
    } catch (error) {
      console.error('Get preferences error:', error);
      throw error;
    }
  },

  /**
   * Update notification preferences
   */
  updatePreferences: async (preferences) => {
    try {
      const response = await axios.put('/notifications/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Update preferences error:', error);
      throw error;
    }
  },
};

export default notificationApi;