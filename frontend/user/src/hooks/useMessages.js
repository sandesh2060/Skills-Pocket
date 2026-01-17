// frontend/user/src/hooks/useMessages.js
import { useState, useEffect } from 'react';
import { getConversations } from '../api/messageApi';

export const useMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await getConversations();
      
      if (response.success) {
        setConversations(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return {
    conversations,
    loading,
    error,
    refetch: fetchConversations
  };
};