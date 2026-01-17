
// ============================================
// FILE: frontend/user/src/components/dashboard/client/ClientStats.jsx
// ============================================
import React from 'react';

export default function ClientStats() {
  const stats = [
    {
      label: 'Active Projects',
      value: '12',
      change: '+2 this week',
      changeType: 'positive',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      ),
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Total Spent',
      value: '$24,500',
      change: 'Last 30 days',
      changeType: 'neutral',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
        </svg>
      ),
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-600',
    },
    {
      label: 'Freelancers Hired',
      value: '38',
      change: 'All time',
      changeType: 'neutral',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      ),
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Avg. Rating',
      value: '4.8',
      change: 'From freelancers',
      changeType: 'neutral',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      ),
      bgColor: 'bg-yellow-500/10',
      iconColor: 'text-yellow-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-[#e7edf3] dark:border-slate-800 shadow-soft hover:shadow-card transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-medium text-[#4c739a] dark:text-slate-400">
              {stat.label}
            </h3>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${stat.bgColor} flex items-center justify-center ${stat.iconColor}`}>
              {stat.icon}
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#0d141b] dark:text-white">
            {stat.value}
          </p>
          <p className={`text-xs sm:text-sm mt-1 ${
            stat.changeType === 'positive' 
              ? 'text-green-600 dark:text-green-500' 
              : 'text-[#4c739a] dark:text-slate-400'
          }`}>
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  );
}
