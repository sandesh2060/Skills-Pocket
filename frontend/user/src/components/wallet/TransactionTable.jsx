
// ============================================
// FILE: frontend/user/src/components/wallet/TransactionTable.jsx
// ============================================
import React, { useState } from 'react';
import { formatCurrency, formatDate, capitalize } from '../../utils/helpers';

export default function TransactionTable({ transactions = [], onLoadMore, hasMore = false }) {
  const [filter, setFilter] = useState('all'); // all, earning, withdrawal, payment

  const getTransactionIcon = (type) => {
    const icons = {
      earning: (
        <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 14l5-5 5 5z"/>
        </svg>
      ),
      payment: (
        <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      ),
      withdrawal: (
        <svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      ),
      deposit: (
        <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 14l5-5 5 5z"/>
        </svg>
      ),
      refund: (
        <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 14l5-5 5 5z"/>
        </svg>
      ),
    };
    return icons[type] || icons.payment;
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 dark:bg-green-900/20 text-green-600',
      pending: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600',
      failed: 'bg-red-100 dark:bg-red-900/20 text-red-600',
      cancelled: 'bg-slate-100 dark:bg-slate-800 text-slate-600',
    };

    return (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status] || styles.pending}`}>
        {capitalize(status)}
      </span>
    );
  };

  const filteredTransactions = filter === 'all'
    ? transactions
    : transactions.filter(t => t.type === filter);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-soft border border-[#e7edf3] dark:border-slate-800">
      {/* Header */}
      <div className="p-6 border-b border-[#e7edf3] dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#0d141b] dark:text-white">
            Transaction History
          </h3>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'earning', 'payment', 'withdrawal', 'deposit'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                filter === type
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-[#4c739a] dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {capitalize(type)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filteredTransactions.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-[#e7edf3] dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#4c739a] dark:text-slate-400 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#4c739a] dark:text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#4c739a] dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-[#4c739a] dark:text-slate-400 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7edf3] dark:divide-slate-800">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0d141b] dark:text-white">
                            {transaction.description}
                          </p>
                          {transaction.job && (
                            <p className="text-xs text-[#4c739a] dark:text-slate-400 mt-0.5">
                              {transaction.job.title}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#4c739a] dark:text-slate-400">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className={`text-lg font-bold ${
                        transaction.type === 'earning' || transaction.type === 'deposit' || transaction.type === 'refund'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'earning' || transaction.type === 'deposit' || transaction.type === 'refund' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                      {transaction.platformFee > 0 && (
                        <p className="text-xs text-[#4c739a] dark:text-slate-400 mt-0.5">
                          Fee: {formatCurrency(transaction.platformFee)}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="p-4 border-t border-[#e7edf3] dark:border-slate-800 text-center">
              <button
                onClick={onLoadMore}
                className="px-6 py-2 text-sm font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                Load More Transactions
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-[#4c739a] dark:text-slate-600 mb-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-9-1c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-6v11c0 1.1-.9 2-2 2H4v-2h17V7h2z"/>
          </svg>
          <p className="text-[#4c739a] dark:text-slate-400">
            No {filter !== 'all' ? filter : ''} transactions found
          </p>
        </div>
      )}
    </div>
  );
}