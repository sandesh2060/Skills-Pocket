// ============================================
// FILE: frontend/user/src/hooks/useNotifications.js
// CUSTOM HOOK FOR NOTIFICATIONS
// ============================================
import { useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';
import { toast } from 'react-hot-toast';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  /**
   * Fetch notifications
   */
  const fetchNotifications = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await notificationService.getNotifications(params);
      
      if (response.success) {
        setNotifications(response.data.notifications);
        setHasMore(response.data.hasMore);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError(err.message || 'Failed to load notifications');
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch unread count
   */
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadCount();
      
      if (response.success) {
        setUnreadCount(response.data.count);
      }
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, []);

  /**
   * Mark single notification as read
   */
  const markAsRead = useCallback(async (notificationId) => {
    try {
      const response = await notificationService.markAsRead(notificationId);
      
      if (response.success) {
        // Update local state
        setNotifications(prev =>
          prev.map(n =>
            n._id === notificationId
              ? { ...n, isRead: true, readAt: new Date() }
              : n
          )
        );
        
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
      toast.error('Failed to mark notification as read');
    }
  }, []);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await notificationService.markAllAsRead();
      
      if (response.success) {
        // Update local state
        setNotifications(prev =>
          prev.map(n => ({ ...n, isRead: true, readAt: new Date() }))
        );
        
        // Reset unread count
        setUnreadCount(0);
        
        toast.success('All notifications marked as read');
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      toast.error('Failed to mark all as read');
    }
  }, []);

  /**
   * Delete notification
   */
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      const response = await notificationService.deleteNotification(notificationId);
      
      if (response.success) {
        // Update local state
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        
        toast.success('Notification deleted');
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
      toast.error('Failed to delete notification');
    }
  }, []);

  /**
   * Refresh notifications and unread count
   */
  const refresh = useCallback(async () => {
    await Promise.all([
      fetchNotifications(),
      fetchUnreadCount()
    ]);
  }, [fetchNotifications, fetchUnreadCount]);

  // Initial fetch on mount
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
  };
};