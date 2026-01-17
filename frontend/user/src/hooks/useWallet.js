// frontend/user/src/hooks/useWallet.js
import { useState, useEffect } from 'react';
import { getWallet, getTransactionHistory } from '../api/walletApi';

export const useWallet = () => {
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const [walletResponse, transactionsResponse] = await Promise.all([
        getWallet(),
        getTransactionHistory({ limit: 10 })
      ]);
      
      if (walletResponse.success) {
        setWalletData(walletResponse.data);
      }
      
      if (transactionsResponse.success) {
        setTransactions(transactionsResponse.data.transactions);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return {
    walletData,
    transactions,
    loading,
    error,
    refetch: fetchWallet
  };
};