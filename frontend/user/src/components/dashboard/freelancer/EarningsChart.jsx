// ============================================
// FILE: frontend/user/src/components/dashboard/freelancer/EarningsChart.jsx
// ============================================
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function EarningsChart() {
  const [period, setPeriod] = useState('week');

  const weekData = [
    { name: 'Mon', earnings: 450 },
    { name: 'Tue', earnings: 320 },
    { name: 'Wed', earnings: 680 },
    { name: 'Thu', earnings: 520 },
    { name: 'Fri', earnings: 890 },
    { name: 'Sat', earnings: 340 },
    { name: 'Sun', earnings: 280 },
  ];

  const monthData = [
    { name: 'Week 1', earnings: 2800 },
    { name: 'Week 2', earnings: 3200 },
    { name: 'Week 3', earnings: 2950 },
    { name: 'Week 4', earnings: 3500 },
  ];

  const yearData = [
    { name: 'Jan', earnings: 8500 },
    { name: 'Feb', earnings: 9200 },
    { name: 'Mar', earnings: 10800 },
    { name: 'Apr', earnings: 11500 },
    { name: 'May', earnings: 10200 },
    { name: 'Jun', earnings: 12400 },
    { name: 'Jul', earnings: 13100 },
    { name: 'Aug', earnings: 12800 },
    { name: 'Sep', earnings: 14200 },
    { name: 'Oct', earnings: 13500 },
    { name: 'Nov', earnings: 15800 },
    { name: 'Dec', earnings: 14900 },
  ];

  const data = period === 'week' ? weekData : period === 'month' ? monthData : yearData;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-[#e7edf3] dark:border-slate-700 rounded-lg shadow-card p-3">
          <p className="text-xs text-[#4c739a] dark:text-slate-400 mb-1">{payload[0].payload.name}</p>
          <p className="text-lg font-bold text-primary">${payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-soft border border-[#e7edf3] dark:border-slate-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#0d141b] dark:text-white mb-1">
            Earnings Overview
          </h3>
          <p className="text-sm text-[#4c739a] dark:text-slate-400">
            Track your income performance
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {['week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                period === p
                  ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                  : 'text-[#4c739a] dark:text-slate-400 hover:text-[#0d141b] dark:hover:text-white'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7edf3" />
            <XAxis 
              dataKey="name" 
              stroke="#4c739a"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#4c739a"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#137fec"
              strokeWidth={3}
              dot={{ fill: '#137fec', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}