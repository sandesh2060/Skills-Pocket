// ============================================
// FILE: frontend/user/src/pages/FreelancerJobs.jsx
// FULLY FUNCTIONAL WITH BACKEND INTEGRATION
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import FreelancerNavbar from '../components/dashboard/freelancer/FreelancerNavbar';
import FreelancerSidebar from '../components/dashboard/freelancer/FreelancerSidebar';
import { getFreelancerJobs } from '../api/jobApi';

export default function FreelancerJobs() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
  });

  useEffect(() => {
    fetchJobs();
  }, [activeTab, pagination.currentPage]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.currentPage,
        limit: 10,
      };

      // Add status filter if not 'all'
      if (activeTab !== 'all') {
        params.status = activeTab;
      }

      const response = await getFreelancerJobs(params);

      if (response.success) {
        setJobs(response.data.jobs);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.message || 'Failed to fetch jobs');
      toast.error('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleViewDetails = (jobId) => {
    navigate(`/freelancer/jobs/${jobId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatBudget = (budget, budgetType) => {
    if (!budget) return 'N/A';
    const formatted = `$${budget.toLocaleString()}`;
    return budgetType === 'hourly' ? `${formatted}/hr` : formatted;
  };

  const getStatusBadge = (status) => {
    const badges = {
      in_progress: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-400',
        label: 'In Progress'
      },
      completed: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-400',
        label: 'Completed'
      },
      cancelled: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-400',
        label: 'Cancelled'
      },
    };

    const badge = badges[status] || badges.in_progress;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  // Calculate counts for tabs
  const activeCount = jobs.filter(j => j.status === 'in_progress').length;
  const completedCount = jobs.filter(j => j.status === 'completed').length;
  const allCount = pagination.totalJobs;

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f7f8] dark:bg-bg-dark">
      <FreelancerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <FreelancerNavbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-[#0d141b] dark:text-white mb-2">My Jobs</h1>
              <p className="text-[#4c739a] dark:text-slate-400">Manage your active and completed projects</p>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-[#e7edf3] dark:border-slate-800">
              <div className="flex gap-6">
                <button
                  onClick={() => handleTabChange('all')}
                  className={`pb-3 px-1 border-b-2 transition-colors ${
                    activeTab === 'all'
                      ? 'border-primary text-primary font-semibold'
                      : 'border-transparent text-[#4c739a] dark:text-slate-400 hover:text-[#0d141b] dark:hover:text-white'
                  }`}
                >
                  All ({allCount})
                </button>
                <button
                  onClick={() => handleTabChange('active')}
                  className={`pb-3 px-1 border-b-2 transition-colors ${
                    activeTab === 'active'
                      ? 'border-primary text-primary font-semibold'
                      : 'border-transparent text-[#4c739a] dark:text-slate-400 hover:text-[#0d141b] dark:hover:text-white'
                  }`}
                >
                  Active ({activeCount})
                </button>
                <button
                  onClick={() => handleTabChange('completed')}
                  className={`pb-3 px-1 border-b-2 transition-colors ${
                    activeTab === 'completed'
                      ? 'border-primary text-primary font-semibold'
                      : 'border-transparent text-[#4c739a] dark:text-slate-400 hover:text-[#0d141b] dark:hover:text-white'
                  }`}
                >
                  Completed ({completedCount})
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800 animate-pulse">
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-6"></div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-full mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600 dark:text-red-400 font-semibold mb-2">Failed to load jobs</p>
                <p className="text-red-500 dark:text-red-500 text-sm mb-4">{error}</p>
                <button
                  onClick={fetchJobs}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && jobs.length === 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl p-12 border border-[#e7edf3] dark:border-slate-800 text-center">
                <svg className="w-20 h-20 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-xl font-bold text-[#0d141b] dark:text-white mb-2">
                  No {activeTab !== 'all' ? activeTab : ''} jobs yet
                </h3>
                <p className="text-[#4c739a] dark:text-slate-400 mb-6">
                  Start applying to projects to see them here
                </p>
                <button
                  onClick={() => navigate('/freelancer/browse-jobs')}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Browse Available Jobs
                </button>
              </div>
            )}

            {/* Jobs List */}
            {!loading && !error && jobs.length > 0 && (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job._id} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800 hover:shadow-card transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#0d141b] dark:text-white mb-2">{job.title}</h3>
                        <p className="text-[#4c739a] dark:text-slate-400 flex items-center gap-2">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                          </svg>
                          {job.client?.name || 'Client'}
                        </p>
                      </div>
                      {getStatusBadge(job.status)}
                    </div>

                    {job.status === 'in_progress' ? (
                      <>
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-[#4c739a] dark:text-slate-400">
                              {job.currentMilestone 
                                ? `Current: ${job.currentMilestone.title}`
                                : 'In Progress'}
                            </span>
                            <span className="font-semibold text-[#0d141b] dark:text-white">{job.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-500" 
                              style={{ width: `${job.progress}%` }} 
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold">
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                              </svg>
                              {formatBudget(job.budget, job.budgetType)}
                            </span>
                            {job.deadline && (
                              <span className="text-[#4c739a] dark:text-slate-400">
                                Due: {formatDate(job.deadline)}
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => handleViewDetails(job._id)}
                            className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </>
                    ) : job.status === 'completed' ? (
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                            </svg>
                            {formatBudget(job.budget, job.budgetType)}
                          </span>
                          {job.completedAt && (
                            <span className="text-[#4c739a] dark:text-slate-400">
                              Completed: {formatDate(job.completedAt)}
                            </span>
                          )}
                        </div>
                        <button 
                          onClick={() => handleViewDetails(job._id)}
                          className="px-4 py-2 border border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && pagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-[#4c739a] dark:text-slate-400">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}