const StatsCard = ({ title, value, trend, trendValue, icon, iconBg, iconColor }) => {
  const isPositive = trend === 'up';
  
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2 ${iconBg} ${iconColor} rounded-lg`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      </div>
      
      <p className="text-3xl font-extrabold">{value}</p>
      
      <div className="flex items-center gap-2 mt-2">
        <span
          className={`text-sm font-bold flex items-center ${
            isPositive ? 'text-[#078838]' : 'text-red-500'
          }`}
        >
          <span className="material-symbols-outlined text-sm">
            {isPositive ? 'trending_up' : 'trending_down'}
          </span>{' '}
          {trendValue}
        </span>
        <span className="text-slate-400 text-xs font-medium">vs last month</span>
      </div>
    </div>
  );
};

export default StatsCard;