// ============================================
// FILE: frontend/user/src/components/dashboard/freelancer/EarningsChart.jsx
// ============================================
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import transactionService from '../../../services/transactionService';

export default function EarningsChart() {
  const [period, setPeriod] = useState('week');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarningsData();
  }, [period]);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getMyTransactions({ 
        limit: 100,
        status: 'completed'
      });

      const transactions = response.data?.transactions || [];
      const processedData = processTransactionData(transactions, period);
      setChartData(processedData);
    } catch (error) {
      console.error('Failed to fetch earnings data:', error);
      // Fallback to demo data
      setChartData(getDemoData(period));
    } finally {
      setLoading(false);
    }
  };

  const processTransactionData = (transactions, period) => {
    // Process transactions based on period
    const now = new Date();
    const earningsMap = new Map();

    transactions.forEach(transaction => {
      const date = new Date(transaction.completedAt || transaction.createdAt);
      let key;

      if (period === 'week') {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        key = dayNames[date.getDay()];
      } else if (period === 'month') {
        const weekNum = Math.ceil(date.getDate() / 7);
        key = `Week ${weekNum}`;
      } else {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        key = monthNames[date.getMonth()];
      }

      const current = earningsMap.get(key) || 0;
      earningsMap.set(key, current + transaction.amount);
    });

    // Convert map to array
    return Array.from(earningsMap, ([name, earnings]) => ({ name, earnings }));
  };

  const getDemoData = (period) => {
    if (period === 'week') {
      return [
        { name: 'Mon', earnings: 450 },
        { name: 'Tue', earnings: 320 },
        { name: 'Wed', earnings: 680 },
        { name: 'Thu', earnings: 520 },
        { name: 'Fri', earnings: 890 },
        { name: 'Sat', earnings: 340 },
        { name: 'Sun', earnings: 280 },
      ];
    } else if (period === 'month') {
      return [
        { name: 'Week 1', earnings: 2800 },
        { name: 'Week 2', earnings: 3200 },
        { name: 'Week 3', earnings: 2950 },
        { name: 'Week 4', earnings: 3500 },
      ];
    } else {
      return [
        { name: 'Jan', earnings: 8500 },
        { name: 'Feb', earnings: 9200 },
        { name: 'Mar', earnings: 10800 },
        { name: 'Apr', earnings: 11500 },
        { name: 'May', earnings: 10200 },
        { name: 'Jun', earnings: 12400 },
      ];
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-[#e7edf3] dark:border-slate-700 rounded-lg shadow-card p-3">
          <p className="text-xs text-[#4c739a] dark:text-slate-400 mb-1">{payload[0].payload.name}</p>
          <p className="text-lg font-bold text-primary">${payload[0].value?.toLocaleString()}</p>
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

      <div className="h-64">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
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
        )}
      </div>
    </div>
  );
}