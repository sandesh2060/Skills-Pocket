
// ============================================
// FILE: frontend/user/src/components/wallet/WalletStats.jsx
// ============================================
import React from 'react';
import { formatCurrency } from '../../utils/helpers';

export default function WalletStats({ walletData }) {
  const {
    balance = 0,
    pendingAmount = 0,
    totalEarnings = 0,
    totalWithdrawals = 0,
  } = walletData || {};

  const stats = [
    {
      label: 'Available Balance',
      value: formatCurrency(balance),
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
        </svg>
      ),
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
      trend: null,
    },
    {
      label: 'Pending Clearance',
      value: formatCurrency(pendingAmount),
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
        </svg>
      ),
      bgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-600',
      trend: null,
    },
    {
      label: 'Total Earnings',
      value: formatCurrency(totalEarnings),
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
        </svg>
      ),
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-600',
      trend: '+12.5%',
    },
    {
      label: 'Total Withdrawals',
      value: formatCurrency(totalWithdrawals),
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/>
        </svg>
      ),
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-600',
      trend: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-slate-900 rounded-xl shadow-soft border border-[#e7edf3] dark:border-slate-800 p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center ${stat.iconColor}`}>
              {stat.icon}
            </div>
            {stat.trend && (
              <span className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            )}
          </div>
          
          <div>
            <p className="text-[#4c739a] dark:text-slate-400 text-sm font-medium mb-1">
              {stat.label}
            </p>
            <p className="text-3xl font-bold text-[#0d141b] dark:text-white">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}