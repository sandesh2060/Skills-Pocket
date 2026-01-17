// ============================================
// FILE: frontend/user/src/pages/ClientFinances.jsx
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientSidebar from "../components/dashboard/client/ClientSidebar";
import ClientNavbar from "../components/dashboard/client/ClientNavbar";
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function ClientFinances() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, transactions, invoices

  // Financial data state
  const [financialStats, setFinancialStats] = useState({
    totalSpent: 0,
    pendingPayments: 0,
    completedPayments: 0,
    availableBalance: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch financial data from multiple endpoints
      const [transactionsRes, jobsRes] = await Promise.all([
        axios.get(`${API_URL}/transactions/my-transactions`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 50 }
        }).catch(() => ({ data: { data: { transactions: [] } } })), // Graceful fallback
        
        axios.get(`${API_URL}/jobs/my-jobs`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 100 }
        })
      ]);

      const transactionsData = transactionsRes.data.data?.transactions || [];
      const jobsData = jobsRes.data.data?.jobs || [];

      // Calculate financial statistics
      const completedJobs = jobsData.filter(job => job.status === 'completed');
      const inProgressJobs = jobsData.filter(job => job.status === 'in_progress');

      const totalSpent = completedJobs.reduce((sum, job) => 
        sum + (job.budget?.max || 0), 0
      );

      const pendingPayments = inProgressJobs.reduce((sum, job) => 
        sum + (job.budget?.max || 0), 0
      );

      const completedTransactions = transactionsData.filter(t => 
        t.status === 'completed'
      );

      const completedPayments = completedTransactions.reduce((sum, t) => 
        sum + (t.amount || 0), 0
      );

      setFinancialStats({
        totalSpent,
        pendingPayments,
        completedPayments,
        availableBalance: 0, // Would come from wallet/balance API
      });

      // Process transactions
      const processedTransactions = transactionsData
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
      
      setTransactions(processedTransactions);

      // Generate invoices from completed jobs
      const invoices = completedJobs.map(job => ({
        id: job._id,
        jobTitle: job.title,
        amount: job.budget?.max || 0,
        status: 'paid',
        date: job.updatedAt,
        freelancer: job.hiredFreelancer
      })).slice(0, 10);

      setRecentInvoices(invoices);

    } catch (err) {
      console.error('Financial data fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load financial data');
      
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      unpaid: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const getTransactionTypeIcon = (type) => {
    if (type === 'payment' || type === 'withdrawal') {
      return (
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#0b1219]">
        <ClientSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ClientNavbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading financial data...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#0b1219]">
      <ClientSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <ClientNavbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Finances
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Track your payments and financial activity
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-400 flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Financial Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            {/* Total Spent */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Total Spent</h3>
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(financialStats.totalSpent)}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                All time
              </p>
            </div>

            {/* Pending Payments */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Pending</h3>
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(financialStats.pendingPayments)}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                In progress jobs
              </p>
            </div>

            {/* Completed Payments */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Completed</h3>
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(financialStats.completedPayments)}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Successfully paid
              </p>
            </div>

            {/* Available Balance */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Balance</h3>
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(financialStats.availableBalance)}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                In wallet
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['overview', 'transactions', 'invoices'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              {activeTab === 'overview' && (
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Recent Transactions
                  </h3>
                  {transactions.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-slate-600 dark:text-slate-400">No transactions yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {transactions.slice(0, 5).map((transaction) => (
                        <div
                          key={transaction._id}
                          className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              {getTransactionTypeIcon(transaction.type)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {transaction.description || 'Payment'}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {formatDate(transaction.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-900 dark:text-white">
                              {formatCurrency(transaction.amount)}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'transactions' && (
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    All Transactions
                  </h3>
                  {transactions.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-slate-600 dark:text-slate-400">No transactions found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">Date</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">Description</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">Type</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">Amount</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((transaction) => (
                            <tr key={transaction._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                                {formatDate(transaction.createdAt)}
                              </td>
                              <td className="py-3 px-4 text-sm text-slate-900 dark:text-white">
                                {transaction.description || 'Payment'}
                              </td>
                              <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 capitalize">
                                {transaction.type}
                              </td>
                              <td className="py-3 px-4 text-sm text-right font-semibold text-slate-900 dark:text-white">
                                {formatCurrency(transaction.amount)}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                                  {transaction.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'invoices' && (
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Invoices
                  </h3>
                  {recentInvoices.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-slate-600 dark:text-slate-400">No invoices yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentInvoices.map((invoice) => (
                        <div
                          key={invoice.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {invoice.jobTitle}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {formatDate(invoice.date)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-900 dark:text-white">
                              {formatCurrency(invoice.amount)}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(invoice.status)}`}>
                              {invoice.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                    Add Funds
                  </button>
                  <button className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">
                    Download Statement
                  </button>
                  <button 
                    onClick={() => navigate('/client/jobs')}
                    className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
                  >
                    View Jobs
                  </button>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                  Payment Methods
                </h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-slate-900 dark:text-white">Visa ****4242</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Expires 12/25</p>
                      </div>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 border border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm">
                    + Add Payment Method
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}