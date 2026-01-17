// ============================================
// FILE: frontend/user/src/components/dashboard/freelancer/DashboardStats.jsx
// ============================================
import React from 'react';

export default function DashboardStats() {
  const stats = [
    {
      label: 'Total Earnings',
      value: '$12,450',
      change: '+12.5%',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
        </svg>
      ),
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      label: 'Active Jobs',
      value: '8',
      change: '+2 this week',
      changeType: 'neutral',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
        </svg>
      ),
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-600',
    },
    {
      label: 'Pending Proposals',
      value: '5',
      change: '3 awaiting response',
      changeType: 'neutral',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
      ),
      bgColor: 'bg-orange-500/10',
      iconColor: 'text-orange-600',
    },
    {
      label: 'Success Rate',
      value: '94%',
      change: '+5% from last month',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      ),
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-slate-900 rounded-xl shadow-soft border border-[#e7edf3] dark:border-slate-800 p-6 hover:shadow-card transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center ${stat.iconColor}`}>
              {stat.icon}
            </div>
            {stat.changeType === 'positive' && (
              <span className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            )}
          </div>
          
          <div>
            <p className="text-[#4c739a] dark:text-slate-400 text-sm font-medium mb-1">
              {stat.label}
            </p>
            <p className="text-3xl font-bold text-[#0d141b] dark:text-white mb-2">
              {stat.value}
            </p>
            {stat.changeType === 'neutral' && (
              <p className="text-xs text-[#4c739a] dark:text-slate-400">
                {stat.change}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}