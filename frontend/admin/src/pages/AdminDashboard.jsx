import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Briefcase, DollarSign, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, Download, Calendar } from 'lucide-react';

// API Service
const API_BASE_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5001/api/admin';

const apiService = {
  async getDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  async getRevenueData(range = '30d') {
    const response = await fetch(`${API_BASE_URL}/dashboard/revenue?range=${range}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch revenue data');
    return response.json();
  },

  async getJobDistribution() {
    const response = await fetch(`${API_BASE_URL}/dashboard/job-distribution`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch job distribution');
    return response.json();
  },

  async getPendingProjects() {
    const response = await fetch(`${API_BASE_URL}/projects/pending`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch pending projects');
    return response.json();
  },

  async getSupportTickets() {
    const response = await fetch(`${API_BASE_URL}/support/tickets?status=open`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch support tickets');
    return response.json();
  },

  async approveProject(projectId) {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/approve`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to approve project');
    return response.json();
  },

  async downloadReport(range) {
    const response = await fetch(`${API_BASE_URL}/reports/download?range=${range}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
    if (!response.ok) throw new Error('Failed to download report');
    return response.blob();
  }
};

// Stats Card Component
const StatsCard = ({ title, value, trend, trendValue, icon: Icon, iconBg, iconColor, loading }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2 ${iconBg} ${iconColor} rounded-lg`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</p>
      <div className="flex items-center gap-2 mt-2">
        <span className={`text-sm font-bold flex items-center gap-1 ${
          trend === 'up' ? 'text-green-600' : 'text-red-500'
        }`}>
          {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {trendValue}
        </span>
        <span className="text-slate-400 text-xs font-medium">vs last month</span>
      </div>
    </div>
  );
};

// Main Dashboard Component
const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('30d');
  
  const [stats, setStats] = useState({
    totalUsers: { value: 0, trend: 'up', trendValue: '0%' },
    activeJobs: { value: 0, trend: 'up', trendValue: '0%' },
    totalRevenue: { value: 0, trend: 'up', trendValue: '0%' },
    escrowBalance: { value: 0, trend: 'down', trendValue: '0%' }
  });

  const [revenueData, setRevenueData] = useState([]);
  const [jobDistribution, setJobDistribution] = useState([]);
  const [pendingProjects, setPendingProjects] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, revenueData, jobData, projectsData, ticketsData] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getRevenueData(dateRange),
        apiService.getJobDistribution(),
        apiService.getPendingProjects(),
        apiService.getSupportTickets()
      ]);

      setStats(statsData);
      setRevenueData(revenueData);
      setJobDistribution(jobData);
      setPendingProjects(projectsData);
      setSupportTickets(ticketsData);
    } catch (err) {
      setError(err.message);
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProject = async (projectId) => {
    try {
      await apiService.approveProject(projectId);
      await loadDashboardData();
    } catch (err) {
      alert('Failed to approve project: ' + err.message);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const blob = await apiService.downloadReport(dateRange);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `skillspocket-report-${dateRange}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Failed to download report: ' + err.message);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
      high: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
      medium: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      low: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
    };
    return colors[priority.toLowerCase()] || colors.low;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto mb-4 text-red-600" size={48} />
          <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-2">Failed to load dashboard</h3>
          <p className="text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={loadDashboardData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight">
              Dashboard Overview
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Real-time performance analytics for SkillsPocket marketplace
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold shadow-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Download Report</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers.value.toLocaleString()}
            trend={stats.totalUsers.trend}
            trendValue={stats.totalUsers.trendValue}
            icon={Users}
            iconBg="bg-blue-50 dark:bg-blue-900/20"
            iconColor="text-blue-600"
            loading={loading}
          />
          <StatsCard
            title="Active Jobs"
            value={stats.activeJobs.value.toLocaleString()}
            trend={stats.activeJobs.trend}
            trendValue={stats.activeJobs.trendValue}
            icon={Briefcase}
            iconBg="bg-green-50 dark:bg-green-900/20"
            iconColor="text-green-600"
            loading={loading}
          />
          <StatsCard
            title="Total Revenue"
            value={`$${(stats.totalRevenue.value / 1000).toFixed(1)}k`}
            trend={stats.totalRevenue.trend}
            trendValue={stats.totalRevenue.trendValue}
            icon={DollarSign}
            iconBg="bg-purple-50 dark:bg-purple-900/20"
            iconColor="text-purple-600"
            loading={loading}
          />
          <StatsCard
            title="Escrow Balance"
            value={`$${(stats.escrowBalance.value / 1000000).toFixed(1)}M`}
            trend={stats.escrowBalance.trend}
            trendValue={stats.escrowBalance.trendValue}
            icon={DollarSign}
            iconBg="bg-amber-50 dark:bg-amber-900/20"
            iconColor="text-amber-600"
            loading={loading}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Growth</h3>
                <p className="text-xs text-slate-500">Gross platform volume trends</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-xs font-bold text-slate-500">Earnings</span>
              </div>
            </div>
            {loading ? (
              <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Job Distribution */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Job Distribution</h3>
                <p className="text-xs text-slate-500">Active project categories</p>
              </div>
            </div>
            {loading ? (
              <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={jobDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="category" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Pending Projects */}
          <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pending Project Approvals</h3>
              <span className="text-blue-600 text-sm font-bold">{pendingProjects.length} pending</span>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : pendingProjects.length === 0 ? (
                <div className="p-12 text-center">
                  <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
                  <p className="text-slate-500">No pending approvals</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Project</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Client</th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Budget</th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {pendingProjects.map((project) => (
                      <tr key={project._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{project.title}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-600 dark:text-slate-400">{project.clientName}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">${project.budget}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApproveProject(project._id)}
                              className="px-3 py-1 rounded-md bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 text-xs font-bold hover:bg-green-100 dark:hover:bg-green-900/30"
                            >
                              Approve
                            </button>
                            <button className="px-3 py-1 rounded-md bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700">
                              Review
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Support Tickets */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Support Tickets</h3>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-600 text-white">
                {supportTickets.filter(t => t.status === 'new').length} New
              </span>
            </div>
            <div className="flex-1 overflow-y-auto max-h-96">
              {loading ? (
                <div className="p-4 space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : supportTickets.length === 0 ? (
                <div className="p-12 text-center">
                  <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
                  <p className="text-slate-500">No open tickets</p>
                </div>
              ) : (
                <div className="p-1">
                  {supportTickets.map((ticket) => (
                    <div
                      key={ticket._id}
                      className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-lg cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-0"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{ticket.title}</p>
                        <span className="text-xs text-slate-400">{ticket.timeAgo}</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2 line-clamp-2">{ticket.description}</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                        <span className="text-xs text-slate-400">By {ticket.author}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
              <button className="w-full py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-bold hover:bg-white dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300">
                Go to Support Inbox
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;