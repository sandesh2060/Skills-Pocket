// ============================================
// FILE: frontend/user/src/pages/ClientDashboard.jsx
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientSidebar from "../components/dashboard/client/ClientSidebar";
import ClientNavbar from "../components/dashboard/client/ClientNavbar";
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Dashboard data state
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalSpent: 0,
    freelancersHired: 0,
    avgRating: 0
  });
  const [activeProjects, setActiveProjects] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch all dashboard data in parallel
      const [jobsRes, userRes] = await Promise.all([
        axios.get(`${API_URL}/jobs/my-jobs`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 100 } // Get all jobs for stats
        }),
        axios.get(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const allJobs = jobsRes.data.data?.jobs || [];
      const userData = userRes.data.data || {};

      // Calculate stats
      const activeJobs = allJobs.filter(job => 
        job.status === 'open' || job.status === 'in_progress'
      );
      
      const completedJobs = allJobs.filter(job => 
        job.status === 'completed'
      );

      const totalSpent = allJobs.reduce((sum, job) => {
        if (job.status === 'completed' && job.budget) {
          return sum + (job.budget.max || 0);
        }
        return sum;
      }, 0);

      // Get unique hired freelancers
      const hiredFreelancers = new Set(
        allJobs
          .filter(job => job.hiredFreelancer)
          .map(job => job.hiredFreelancer._id || job.hiredFreelancer)
      );

      setStats({
        activeProjects: activeJobs.length,
        totalSpent: totalSpent,
        freelancersHired: hiredFreelancers.size,
        avgRating: userData.rating || 0
      });

      // Set active projects (in progress jobs)
      const inProgressJobs = allJobs
        .filter(job => job.status === 'in_progress')
        .slice(0, 3);
      setActiveProjects(inProgressJobs);

      // Generate recent activity from jobs
      const activities = generateRecentActivity(allJobs);
      setRecentActivity(activities);

    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      
      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateRecentActivity = (jobs) => {
    const activities = [];
    
    // Sort jobs by date
    const sortedJobs = [...jobs].sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    sortedJobs.slice(0, 5).forEach(job => {
      if (job.proposalCount > 0 && job.status === 'open') {
        activities.push({
          id: `proposal-${job._id}`,
          type: 'proposal',
          message: `${job.proposalCount} proposal(s) received for "${job.title}"`,
          time: getTimeAgo(job.updatedAt),
          color: 'blue'
        });
      }
      
      if (job.status === 'completed') {
        activities.push({
          id: `completed-${job._id}`,
          type: 'completed',
          message: `Project "${job.title}" completed`,
          time: getTimeAgo(job.updatedAt),
          color: 'green'
        });
      }
      
      if (job.hiredFreelancer && job.status === 'in_progress') {
        activities.push({
          id: `hired-${job._id}`,
          type: 'hired',
          message: `Freelancer hired for "${job.title}"`,
          time: getTimeAgo(job.updatedAt),
          color: 'purple'
        });
      }
    });

    return activities.slice(0, 5);
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getActivityColor = (type) => {
    const colors = {
      proposal: 'bg-blue-500',
      completed: 'bg-green-500',
      hired: 'bg-purple-500',
      payment: 'bg-yellow-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const handlePostJob = () => {
    navigate('/client/jobs');
    // Could trigger modal to open in ClientJobs page
  };

  const handleBrowseFreelancers = () => {
    navigate('/browse-freelancers');
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
              <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#0b1219]">
      <ClientSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <ClientNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            {/* Welcome Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0d141b] dark:text-white mb-2">
                Client Dashboard
              </h1>
              <p className="text-sm sm:text-base text-[#4c739a] dark:text-slate-400">
                Manage your projects and find the perfect freelancers
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

            {/* Stats Grid - Backend Data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
              {/* Active Projects */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-[#e7edf3] dark:border-slate-800 shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs sm:text-sm font-medium text-[#4c739a] dark:text-slate-400">Active Projects</h3>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-[#0d141b] dark:text-white">{stats.activeProjects}</p>
                <p className="text-xs sm:text-sm text-green-600 dark:text-green-500 mt-1">
                  {stats.activeProjects > 0 ? 'In progress' : 'No active projects'}
                </p>
              </div>

              {/* Total Spent */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-[#e7edf3] dark:border-slate-800 shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs sm:text-sm font-medium text-[#4c739a] dark:text-slate-400">Total Spent</h3>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                    </svg>
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-[#0d141b] dark:text-white">
                  {formatCurrency(stats.totalSpent)}
                </p>
                <p className="text-xs sm:text-sm text-[#4c739a] dark:text-slate-400 mt-1">On completed projects</p>
              </div>

              {/* Freelancers Hired */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-[#e7edf3] dark:border-slate-800 shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs sm:text-sm font-medium text-[#4c739a] dark:text-slate-400">Freelancers Hired</h3>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-[#0d141b] dark:text-white">{stats.freelancersHired}</p>
                <p className="text-xs sm:text-sm text-[#4c739a] dark:text-slate-400 mt-1">All time</p>
              </div>

              {/* Avg Rating */}
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-[#e7edf3] dark:border-slate-800 shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs sm:text-sm font-medium text-[#4c739a] dark:text-slate-400">Avg. Rating</h3>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-[#0d141b] dark:text-white">
                  {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : 'N/A'}
                </p>
                <p className="text-xs sm:text-sm text-[#4c739a] dark:text-slate-400 mt-1">From freelancers</p>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Active Projects - Backend Data */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-[#e7edf3] dark:border-slate-800 shadow-soft">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base sm:text-lg font-bold text-[#0d141b] dark:text-white">Active Projects</h3>
                    <button 
                      onClick={() => navigate('/client/jobs')}
                      className="text-sm text-primary hover:text-primary/80"
                    >
                      View All
                    </button>
                  </div>
                  
                  {activeProjects.length === 0 ? (
                    <div className="text-center py-8">
                      <svg className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">No active projects yet</p>
                      <button 
                        onClick={handlePostJob}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm"
                      >
                        Post Your First Job
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeProjects.map((job) => (
                        <div 
                          key={job._id} 
                          className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-colors cursor-pointer"
                          onClick={() => navigate(`/client/jobs/${job._id}`)}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <h4 className="font-semibold text-sm sm:text-base text-[#0d141b] dark:text-white">
                              {job.title}
                            </h4>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 w-fit">
                              In Progress
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#4c739a] dark:text-slate-400 mb-2">
                            Freelancer: {job.hiredFreelancer?.firstName || 'Not assigned yet'} {job.hiredFreelancer?.lastName || ''}
                          </p>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#4c739a] dark:text-slate-400">
                            <span>Created: {new Date(job.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{formatCurrency(job.budget?.max || 0)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4 sm:space-y-6">
                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-[#e7edf3] dark:border-slate-800 shadow-soft">
                  <h3 className="text-base sm:text-lg font-bold text-[#0d141b] dark:text-white mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={handlePostJob}
                      className="w-full px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                      Post New Job
                    </button>
                    <button 
                      onClick={handleBrowseFreelancers}
                      className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-[#0d141b] dark:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
                    >
                      Browse Freelancers
                    </button>
                  </div>
                </div>

                {/* Recent Activity - Backend Data */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-[#e7edf3] dark:border-slate-800 shadow-soft">
                  <h3 className="text-base sm:text-lg font-bold text-[#0d141b] dark:text-white mb-4">Recent Activity</h3>
                  {recentActivity.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                      No recent activity
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex gap-3">
                          <div className={`w-2 h-2 rounded-full ${getActivityColor(activity.type)} mt-2 flex-shrink-0`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#0d141b] dark:text-white font-medium line-clamp-2">
                              {activity.message}
                            </p>
                            <p className="text-xs text-[#4c739a] dark:text-slate-400 mt-0.5">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}