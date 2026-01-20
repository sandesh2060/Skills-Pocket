import { useState, useEffect } from 'react';
import axios from 'axios';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    disputed: 0
  });

  const API_BASE_URL = 'http://localhost:5001/api/admin';

  // Fetch jobs from backend
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(searchQuery && { search: searchQuery })
      });

      const response = await axios.get(`${API_BASE_URL}/projects?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { projects, pagination } = response.data;
      
      setJobs(projects);
      setTotalPages(pagination.pages);
      setTotalJobs(pagination.total);
      setCurrentPage(pagination.page);

    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
      } else {
        alert('Failed to load jobs. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch job stats
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const [all, inProgress, completed, disputed] = await Promise.all([
        axios.get(`${API_BASE_URL}/projects?limit=1`, { headers: { Authorization: `Bearer ${token}` }}),
        axios.get(`${API_BASE_URL}/projects?status=in_progress&limit=1`, { headers: { Authorization: `Bearer ${token}` }}),
        axios.get(`${API_BASE_URL}/projects?status=completed&limit=1`, { headers: { Authorization: `Bearer ${token}` }}),
        axios.get(`${API_BASE_URL}/projects?status=disputed&limit=1`, { headers: { Authorization: `Bearer ${token}` }})
      ]);

      setStats({
        total: all.data.pagination?.total || 0,
        inProgress: inProgress.data.pagination?.total || 0,
        completed: completed.data.pagination?.total || 0,
        disputed: disputed.data.pagination?.total || 0
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // Handle job approval
  const handleApproveJob = async (jobId) => {
    if (!confirm('Are you sure you want to approve this job?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_BASE_URL}/projects/${jobId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert('Job approved successfully');
      fetchJobs();
      fetchStats();
    } catch (error) {
      console.error('Failed to approve job:', error);
      alert('Failed to approve job');
    }
  };

  // Handle job rejection
  const handleRejectJob = async (jobId) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_BASE_URL}/projects/${jobId}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert('Job rejected successfully');
      fetchJobs();
      fetchStats();
    } catch (error) {
      console.error('Failed to reject job:', error);
      alert('Failed to reject job');
    }
  };

  // Handle job cancellation
  const handleCancelJob = async (jobId) => {
    if (!confirm('Are you sure you want to cancel this job?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_BASE_URL}/projects/${jobId}/reject`,
        { reason: 'Cancelled by admin' },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert('Job cancelled successfully');
      fetchJobs();
    } catch (error) {
      console.error('Failed to cancel job:', error);
      alert('Failed to cancel job');
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, [currentPage, filterStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchJobs();
      } else {
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'in_progress':
        return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending_approval':
        return 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
      case 'active':
        return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400';
      case 'disputed':
      case 'rejected':
      case 'cancelled':
        return 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'pending_approval': 'Pending Approval',
      'active': 'Active',
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'rejected': 'Rejected',
      'cancelled': 'Cancelled',
      'disputed': 'Disputed'
    };
    return labels[status] || status;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Web Development': 'code',
      'Design': 'palette',
      'Writing': 'edit_note',
      'Video': 'videocam',
      'Marketing': 'campaign',
      'Programming': 'code',
      'Graphics': 'palette'
    };
    return icons[category] || 'work';
  };

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-[#0d141b] dark:text-white text-3xl font-extrabold tracking-tight">
            Job Management
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Monitor and manage all active projects and jobs on the platform.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-semibold">Total Jobs</span>
            <span className="material-symbols-outlined text-blue-600">work</span>
          </div>
          <p className="text-2xl font-extrabold">{stats.total.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-semibold">In Progress</span>
            <span className="material-symbols-outlined text-blue-600">pending</span>
          </div>
          <p className="text-2xl font-extrabold">{stats.inProgress.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-semibold">Completed</span>
            <span className="material-symbols-outlined text-green-600">check_circle</span>
          </div>
          <p className="text-2xl font-extrabold">{stats.completed.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-semibold">Disputed</span>
            <span className="material-symbols-outlined text-red-600">gavel</span>
          </div>
          <p className="text-2xl font-extrabold">{stats.disputed.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by job title..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Status</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="active">Active</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-300 border-t-primary"></div>
              <p className="mt-4 text-slate-500">Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No jobs found
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Job Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Budget
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Posted
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {jobs.map((job) => (
                  <tr
                    key={job._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-lg">
                            {getCategoryIcon(job.category)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{job.title}</p>
                          <p className="text-xs text-slate-500">{job.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">
                        {job.client?.firstName} {job.client?.lastName}
                      </p>
                      <p className="text-xs text-slate-500">{job.client?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold">${job.budget?.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(job.status)}`}>
                        {getStatusLabel(job.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-500">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {job.status === 'pending_approval' && (
                          <>
                            <button
                              onClick={() => handleApproveJob(job._id)}
                              className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectJob(job._id)}
                              className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {(job.status === 'active' || job.status === 'in_progress') && (
                          <button
                            onClick={() => handleCancelJob(job._id)}
                            className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        )}
                        <button className="p-1 text-slate-400 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-lg">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Showing page {currentPage} of {totalPages} ({totalJobs} total jobs)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded-lg text-sm font-bold transition-colors ${
                      currentPage === pageNum
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default JobManagement;