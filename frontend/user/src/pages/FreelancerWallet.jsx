// ============================================
// FILE: frontend/user/src/pages/FreelancerWallet.jsx
// FULLY FUNCTIONAL WITH BACKEND INTEGRATION
// ============================================
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import FreelancerNavbar from '../components/dashboard/freelancer/FreelancerNavbar';
import FreelancerSidebar from '../components/dashboard/freelancer/FreelancerSidebar';
import transactionApi from '../api/transactionApi';
import WithdrawalModal from '../components/wallet/WithdrawModal.jsx';

export default function FreelancerWallet() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    availableBalance: 0,
    totalReceived: 0,
    pendingPayments: 0,
    totalSpent: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTransactions: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    type: '',
  });
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, [pagination.currentPage, filters]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);

      // Fetch summary and transactions in parallel
      const [summaryRes, transactionsRes] = await Promise.all([
        transactionApi.getFinancialSummary(),
        transactionApi.getMyTransactions({
          page: pagination.currentPage,
          limit: 10,
          ...filters,
        }),
      ]);

      if (summaryRes.success) {
        setSummary(summaryRes.data);
      }

      if (transactionsRes.success) {
        setTransactions(transactionsRes.data.transactions);
        setPagination(transactionsRes.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async (withdrawalData) => {
    try {
      const response = await transactionApi.requestWithdrawal(withdrawalData);
      if (response.success) {
        toast.success('Withdrawal request submitted successfully');
        setWithdrawalModalOpen(false);
        fetchWalletData(); // Refresh data
      }
    } catch (error) {
      toast.error(error.message || 'Failed to process withdrawal');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionType = (transaction, userId) => {
    // Determine if it's incoming or outgoing based on user
    if (transaction.to?._id === userId || transaction.to === userId) {
      return 'credit';
    }
    return 'debit';
  };

  const getTransactionDescription = (transaction, type) => {
    if (transaction.description) return transaction.description;
    
    if (type === 'credit') {
      const fromName = transaction.from?.firstName 
        ? `${transaction.from.firstName} ${transaction.from.lastName || ''}`
        : 'Client';
      return `Payment from ${fromName}`;
    } else {
      if (transaction.type === 'withdrawal') return 'Withdrawal to Bank Account';
      const toName = transaction.to?.firstName 
        ? `${transaction.to.firstName} ${transaction.to.lastName || ''}`
        : 'Recipient';
      return `Payment to ${toName}`;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-400',
        label: 'Completed'
      },
      pending: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-400',
        label: 'Pending'
      },
      failed: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-400',
        label: 'Failed'
      },
      cancelled: {
        bg: 'bg-gray-100 dark:bg-gray-900/30',
        text: 'text-gray-700 dark:text-gray-400',
        label: 'Cancelled'
      },
    };

    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f7f8] dark:bg-bg-dark">
      <FreelancerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <FreelancerNavbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-[#0d141b] dark:text-white mb-2">Wallet</h1>
              <p className="text-[#4c739a] dark:text-slate-400">Manage your earnings and withdrawals</p>
            </div>

            {/* Loading State for Balance Cards */}
            {loading && !transactions.length ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800 animate-pulse">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-4"></div>
                    <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              /* Balance Cards */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl p-6 text-white">
                  <p className="text-sm opacity-90 mb-2">Available Balance</p>
                  <p className="text-4xl font-bold mb-4">
                    ${summary.availableBalance?.toLocaleString() || '0'}
                  </p>
                  <button 
                    onClick={() => setWithdrawalModalOpen(true)}
                    disabled={summary.availableBalance <= 0}
                    className="w-full bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed text-white py-2 rounded-lg font-semibold transition-colors backdrop-blur-sm"
                  >
                    Withdraw Funds
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800">
                  <p className="text-sm text-[#4c739a] dark:text-slate-400 mb-2">Pending</p>
                  <p className="text-3xl font-bold text-[#0d141b] dark:text-white mb-2">
                    ${summary.pendingPayments?.toLocaleString() || '0'}
                  </p>
                  <p className="text-xs text-[#4c739a] dark:text-slate-400">
                    Payments in escrow
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800">
                  <p className="text-sm text-[#4c739a] dark:text-slate-400 mb-2">Total Earned</p>
                  <p className="text-3xl font-bold text-[#0d141b] dark:text-white mb-2">
                    ${summary.totalReceived?.toLocaleString() || '0'}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    All-time earnings
                  </p>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-[#e7edf3] dark:border-slate-800 mb-6">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0d141b] dark:text-white mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0d141b] dark:text-white mb-2">
                    Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="payment">Payment</option>
                    <option value="withdrawal">Withdrawal</option>
                    <option value="refund">Refund</option>
                    <option value="escrow_release">Escrow Release</option>
                  </select>
                </div>

                {(filters.status || filters.type) && (
                  <div className="flex items-end">
                    <button
                      onClick={() => setFilters({ status: '', type: '' })}
                      className="px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#e7edf3] dark:border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-[#e7edf3] dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#0d141b] dark:text-white">
                  Transaction History
                </h2>
                <span className="text-sm text-[#4c739a] dark:text-slate-400">
                  {pagination.totalTransactions} transaction{pagination.totalTransactions !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="p-6 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                      </div>
                      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-20"></div>
                    </div>
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                /* Empty State */
                <div className="p-12 text-center">
                  <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="text-lg font-bold text-[#0d141b] dark:text-white mb-2">
                    No transactions yet
                  </h3>
                  <p className="text-[#4c739a] dark:text-slate-400">
                    Your transaction history will appear here
                  </p>
                </div>
              ) : (
                /* Transactions Table */
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#4c739a] dark:text-slate-400 uppercase">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#4c739a] dark:text-slate-400 uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#4c739a] dark:text-slate-400 uppercase">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#4c739a] dark:text-slate-400 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e7edf3] dark:divide-slate-800">
                      {transactions.map((txn) => {
                        const type = getTransactionType(txn, summary.userId);
                        return (
                          <tr key={txn._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  type === 'credit' 
                                    ? 'bg-green-100 dark:bg-green-900/30' 
                                    : 'bg-red-100 dark:bg-red-900/30'
                                }`}>
                                  <svg className={`w-5 h-5 ${
                                    type === 'credit' ? 'text-green-600' : 'text-red-600'
                                  }`} viewBox="0 0 24 24" fill="currentColor">
                                    {type === 'credit' ? (
                                      <path d="M7 14l5-5 5 5z"/>
                                    ) : (
                                      <path d="M7 10l5 5 5-5z"/>
                                    )}
                                  </svg>
                                </div>
                                <div>
                                  <p className="font-medium text-[#0d141b] dark:text-white">
                                    {getTransactionDescription(txn, type)}
                                  </p>
                                  {txn.job && (
                                    <p className="text-xs text-[#4c739a] dark:text-slate-400">
                                      Job: {txn.job.title}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-[#4c739a] dark:text-slate-400 text-sm">
                              {formatDate(txn.createdAt)}
                            </td>
                            <td className={`px-6 py-4 font-bold ${
                              type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {type === 'credit' ? '+' : '-'}${txn.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              {getStatusBadge(txn.status)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {!loading && pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-[#e7edf3] dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                    disabled={pagination.currentPage === 1}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-[#0d141b] dark:text-white"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-[#4c739a] dark:text-slate-400">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-[#0d141b] dark:text-white"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Withdrawal Modal */}
      {withdrawalModalOpen && (
        <WithdrawalModal
          isOpen={withdrawalModalOpen}
          onClose={() => setWithdrawalModalOpen(false)}
          onSubmit={handleWithdrawal}
          availableBalance={summary.availableBalance}
        />
      )}
    </div>
  );
}