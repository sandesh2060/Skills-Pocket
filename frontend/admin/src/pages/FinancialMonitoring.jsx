import { useState } from 'react';
import StatsCard from '../components/admin/StatsCard';

const FinancialMonitoring = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const transactions = [
    {
      id: 'TXN-8821',
      type: 'Escrow Release',
      from: 'TechCorp Inc.',
      to: 'Sarah Johnson',
      amount: '$2,500',
      status: 'Completed',
      date: 'Jan 19, 2024, 10:23 AM',
      fee: '$125',
    },
    {
      id: 'TXN-8822',
      type: 'Payment',
      from: 'StartupHub',
      to: 'Platform',
      amount: '$800',
      status: 'Completed',
      date: 'Jan 19, 2024, 09:15 AM',
      fee: '$40',
    },
    {
      id: 'TXN-8823',
      type: 'Withdrawal',
      from: 'Marcus Chen',
      to: 'Bank Account',
      amount: '$1,200',
      status: 'Pending',
      date: 'Jan 19, 2024, 08:45 AM',
      fee: '$0',
    },
    {
      id: 'TXN-8824',
      type: 'Refund',
      from: 'Platform',
      to: 'Digital Media Co.',
      amount: '$650',
      status: 'Processing',
      date: 'Jan 18, 2024, 11:30 PM',
      fee: '$0',
    },
    {
      id: 'TXN-8825',
      type: 'Escrow Deposit',
      from: 'Marketing Pro',
      to: 'Escrow',
      amount: '$3,200',
      status: 'Completed',
      date: 'Jan 18, 2024, 06:12 PM',
      fee: '$160',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'Pending':
        return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400';
      case 'Processing':
        return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Failed':
        return 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      'Escrow Release': 'lock_open',
      'Payment': 'payment',
      'Withdrawal': 'account_balance',
      'Refund': 'undo',
      'Escrow Deposit': 'lock',
    };
    return icons[type] || 'monetization_on';
  };

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-[#0d141b] dark:text-white text-3xl font-extrabold tracking-tight">
            Financial Monitoring
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Track all financial transactions, escrow, and platform revenue.
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold focus:ring-2 focus:ring-primary/20"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined text-lg">download</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Revenue"
          value="$240,500"
          trend="up"
          trendValue="18%"
          icon="monetization_on"
          iconBg="bg-green-50 dark:bg-green-900/20"
          iconColor="text-green-600"
        />
        <StatsCard
          title="Escrow Balance"
          value="$1.2M"
          trend="down"
          trendValue="2%"
          icon="account_balance"
          iconBg="bg-amber-50 dark:bg-amber-900/20"
          iconColor="text-amber-600"
        />
        <StatsCard
          title="Platform Fees"
          value="$48,100"
          trend="up"
          trendValue="15%"
          icon="payments"
          iconBg="bg-blue-50 dark:bg-blue-900/20"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Pending Withdrawals"
          value="$89,300"
          trend="up"
          trendValue="8%"
          icon="pending_actions"
          iconBg="bg-purple-50 dark:bg-purple-900/20"
          iconColor="text-purple-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold">Revenue Breakdown</h3>
            <p className="text-xs text-slate-500">Platform income sources</p>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Transaction Fees (5%)', value: '$28,450', percent: 59, color: 'bg-primary' },
              { label: 'Subscription Plans', value: '$12,300', percent: 26, color: 'bg-green-500' },
              { label: 'Featured Listings', value: '$5,250', percent: 11, color: 'bg-purple-500' },
              { label: 'Other Services', value: '$2,100', percent: 4, color: 'bg-amber-500' },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{item.label}</span>
                  <span className="text-sm font-bold">{item.value}</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Types */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold">Transaction Distribution</h3>
            <p className="text-xs text-slate-500">By transaction type</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Payments', count: '8,234', icon: 'payment', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { label: 'Escrow', count: '5,421', icon: 'lock', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
              { label: 'Withdrawals', count: '3,892', icon: 'account_balance', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
              { label: 'Refunds', count: '234', icon: 'undo', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
            ].map((item, index) => (
              <div key={index} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className={`size-10 rounded-lg ${item.bg} ${item.color} flex items-center justify-center mb-3`}>
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                <p className="text-xl font-extrabold">{item.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Recent Transactions</h3>
            <p className="text-xs text-slate-500">Latest financial activities</p>
          </div>
          <button className="text-primary text-sm font-bold hover:underline">View All</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Transaction
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  From
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  To
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Fee
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((txn) => (
                <tr
                  key={txn.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-lg">
                          {getTypeIcon(txn.type)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{txn.type}</p>
                        <p className="text-xs text-slate-500">{txn.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{txn.from}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{txn.to}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold">{txn.amount}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-500">{txn.fee}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(
                        txn.status
                      )}`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                      <button className="p-1 text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">download</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing <span className="font-semibold">1-5</span> of{' '}
            <span className="font-semibold">15,847</span> transactions
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 rounded-lg bg-primary text-white text-sm font-bold">
              1
            </button>
            <button className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              2
            </button>
            <button className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FinancialMonitoring;