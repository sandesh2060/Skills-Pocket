import { useState } from 'react';

const JobManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const jobs = [
    {
      id: 'PRJ-1001',
      title: 'E-commerce Website Development',
      client: 'TechCorp Inc.',
      freelancer: 'Sarah Johnson',
      category: 'Web Development',
      budget: '$4,500',
      status: 'In Progress',
      progress: 65,
      deadline: 'Jan 30, 2024',
      posted: 'Jan 10, 2024',
    },
    {
      id: 'PRJ-1002',
      title: 'Mobile App UI/UX Design',
      client: 'StartupHub',
      freelancer: 'Marcus Chen',
      category: 'Design',
      budget: '$2,800',
      status: 'Completed',
      progress: 100,
      deadline: 'Jan 25, 2024',
      posted: 'Jan 5, 2024',
    },
    {
      id: 'PRJ-1003',
      title: 'Content Writing - Blog Posts',
      client: 'Digital Media Co.',
      freelancer: 'Emma Rodriguez',
      category: 'Writing',
      budget: '$850',
      status: 'Under Review',
      progress: 90,
      deadline: 'Jan 28, 2024',
      posted: 'Jan 12, 2024',
    },
    {
      id: 'PRJ-1004',
      title: 'Brand Video Production',
      client: 'Marketing Pro',
      freelancer: 'Not Assigned',
      category: 'Video',
      budget: '$3,200',
      status: 'Open',
      progress: 0,
      deadline: 'Feb 15, 2024',
      posted: 'Jan 18, 2024',
    },
    {
      id: 'PRJ-1005',
      title: 'SEO Optimization Services',
      client: 'WebGrow Solutions',
      freelancer: 'David Kim',
      category: 'Marketing',
      budget: '$1,500',
      status: 'Disputed',
      progress: 75,
      deadline: 'Jan 27, 2024',
      posted: 'Jan 8, 2024',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'In Progress':
        return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Under Review':
        return 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Open':
        return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400';
      case 'Disputed':
        return 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Web Development': 'code',
      'Design': 'palette',
      'Writing': 'edit_note',
      'Video': 'videocam',
      'Marketing': 'campaign',
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
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            <span>Advanced Filters</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined text-lg">download</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-semibold">Total Jobs</span>
            <span className="material-symbols-outlined text-blue-600">work</span>
          </div>
          <p className="text-2xl font-extrabold">12,840</p>
          <p className="text-xs text-slate-400 mt-1">+5.4% this month</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-semibold">In Progress</span>
            <span className="material-symbols-outlined text-blue-600">pending</span>
          </div>
          <p className="text-2xl font-extrabold">4,523</p>
          <p className="text-xs text-slate-400 mt-1">Active projects</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-semibold">Completed</span>
            <span className="material-symbols-outlined text-green-600">check_circle</span>
          </div>
          <p className="text-2xl font-extrabold">7,892</p>
          <p className="text-xs text-slate-400 mt-1">Successfully finished</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-semibold">Disputed</span>
            <span className="material-symbols-outlined text-red-600">gavel</span>
          </div>
          <p className="text-2xl font-extrabold">42</p>
          <p className="text-xs text-slate-400 mt-1">Requires attention</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by job title, ID, or client..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Categories</option>
              <option value="web">Web Development</option>
              <option value="design">Design</option>
              <option value="writing">Writing</option>
              <option value="video">Video</option>
              <option value="marketing">Marketing</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="progress">In Progress</option>
              <option value="review">Under Review</option>
              <option value="completed">Completed</option>
              <option value="disputed">Disputed</option>
            </select>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="overflow-x-auto">
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
                  Freelancer
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Budget
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Progress
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {jobs.map((job) => (
                <tr
                  key={job.id}
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
                        <p className="text-xs text-slate-500">
                          {job.id} • {job.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{job.client}</p>
                    <p className="text-xs text-slate-500">Posted {job.posted}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{job.freelancer}</p>
                    <p className="text-xs text-slate-500">
                      Due: {job.deadline}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold">{job.budget}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold">{job.progress}%</span>
                      </div>
                      <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${job.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                      <button className="p-1 text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-lg">cancel</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing <span className="font-semibold">1-5</span> of{' '}
            <span className="font-semibold">12,840</span> jobs
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 rounded-lg bg-primary text-white text-sm font-bold">
              1
            </button>
            <button className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              2
            </button>
            <button className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              3
            </button>
            <button className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobManagement;