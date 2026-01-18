// ============================================
// FILE: frontend/user/src/hooks/useSidebarData.js
// Custom hook for fetching sidebar data
// ============================================
import { useState, useEffect } from 'react';
import notificationApi from '../api/notificationApi';
// import jobApi from '../api/jobApi';
// import walletApi from '../api/walletApi';
// import messageApi from '../api/messageApi';

export const useSidebarData = () => {
  const [data, setData] = useState({
    unreadMessages: 0,
    activeJobs: 0,
    pendingProposals: 0,
    walletBalance: 0,
    profileCompletion: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [notifResponse] = await Promise.all([
        notificationApi.getUnreadCount().catch(() => ({ data: { count: 0 } })),
        // Add more API calls as you implement them:
        // jobApi.getActiveCount().catch(() => ({ data: { count: 0 } })),
        // messageApi.getUnreadCount().catch(() => ({ data: { count: 0 } })),
        // walletApi.getBalance().catch(() => ({ data: { balance: 0 } })),
      ]);

      setData({
        unreadMessages: notifResponse.data?.count || 0,
        activeJobs: 0, // TODO: Replace with actual API call
        pendingProposals: 0, // TODO: Replace with actual API call
        walletBalance: 0, // TODO: Replace with actual API call
        profileCompletion: 0, // TODO: Replace with actual API call
      });
    } catch (err) {
      console.error('Error fetching sidebar data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchData };
};