import { useState } from 'react';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const users = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      role: 'Freelancer',
      status: 'Active',
      joined: 'Jan 15, 2023',
      totalJobs: 24,
      earnings: '$12,450',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMeNn8fh9U6-bnw1PgmITU_xy4OxR1PK2ak-NLrrtuVJGNSCAUaLAdXnxJDFimVrfiRnOqBucwv7OlOooVAFhW1qCKcg6X56oyuE_1eKsPifV_OfNrxECYxjC97cqKJYp4hkx_xppjI9umULl6TNnJ7_0pgZobyVunJatiWUjmdNyZqJkUmQqG0nxSmzxveiZe2UhQBgpVxKx3ZHUAx1DceitWiBUtY7vl1o2VtKhQSEt2AW9vOTDX6-n_hUJbbOsHPFkpmjqVz-DW',
      verified: true,
    },
    {
      id: 2,
      name: 'Marcus Chen',
      email: 'marcus.c@example.com',
      role: 'Client',
      status: 'Active',
      joined: 'Feb 22, 2023',
      totalJobs: 8,
      spending: '$8,900',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHusEjo9OmFbf1pq8SGDqJ9SJEGxrs7_HjjpXcf4jGowKrfBRfFFBzP4iN9w3ICCUndRltrysgm5atQzKkSDffXHHbiYUjqbUtCWcBRSwjMWueAVNI_9G84TuWJPqdqiuvFvVplVhuD7PuVE9ITkWE7f3lM5aZRWRlshkAsIAvEbi1uK6flWFkR04mlnodV_52GF7uHKi7HydwP_8h5BBT71Z6TvWMSDXjt_Ny2TFrNXWMS9si-MqmWJ2wD8uXX_jMW7eluNPY_oZo',
      verified: true,
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      email: 'emma.r@example.com',
      role: 'Freelancer',
      status: 'Suspended',
      joined: 'Mar 10, 2023',
      totalJobs: 15,
      earnings: '$6,200',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBa31wR9Fmq4PPPrLZ-3WuuJ7Znj5oQRQRfmqV9fvI7dtPFAqv58vmPXfT5_uW7IQL-ME4wxTLB_zK4W4BSddaZA5mbuhmweq_F4x2ynfFl7PAsl4C2cTUV2EREBRigy7-tELUQcM9Rjs2xMTaV2YY9fK3zU1CDbtpFpSvIS-EdGWlpjCsuYMYXxOBabiZ13ZeX-tB3tf-WE8QXJ6pJyVl_00qeFJRcZmQJ_t7nhGf8moOVOQRtLta4ZPGqgBczcPtaHmhzc7D80lVx',
      verified: false,
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.k@example.com',
      role: 'Client',
      status: 'Active',
      joined: 'Apr 5, 2023',
      totalJobs: 12,
      spending: '$15,300',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2khDLPaFMv3e_cuqgtrAvWov1BKV5RSS0Fq_aTugaiAkWWLx0J76s1Pn-wgHYFjPD30rnX4KYNCKHHaErc88zFw7zf4xnTuTasFWVGdbtVMX2d8AFQ-UnTvDrk9gKjj_j4l7hk2OrSlMQYa3ndXr6_-mfmaASoeFlKjpf6xvVG536Nx6PiOONRCQSGIri7bDpm_5Co19fWmqnIxTaZ6wsChIdQbnuCQYi-288M92fTp17Yt_y714sUDUSQQVAHsAQAj_X62KBcIGk',
      verified: true,
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      email: 'lisa.a@example.com',
      role: 'Freelancer',
      status: 'Pending',
      joined: 'May 18, 2023',
      totalJobs: 0,
      earnings: '$0',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMeNn8fh9U6-bnw1PgmITU_xy4OxR1PK2ak-NLrrtuVJGNSCAUaLAdXnxJDFimVrfiRnOqBucwv7OlOooVAFhW1qCKcg6X56oyuE_1eKsPifV_OfNrxECYxjC97cqKJYp4hkx_xppjI9umULl6TNnJ7_0pgZobyVunJatiWUjmdNyZqJkUmQqG0nxSmzxveiZe2UhQBgpVxKx3ZHUAx1DceitWiBUtY7vl1o2VtKhQSEt2AW9vOTDX6-n_hUJbbOsHPFkpmjqVz-DW',
      verified: false,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'Suspended':
        return 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400';
      case 'Pending':
        return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400';
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-[#0d141b] dark:text-white text-3xl font-extrabold tracking-tight">
            User Management
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage all users, freelancers, and clients on the platform.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
          <span className="material-symbols-outlined text-lg">person_add</span>
          <span>Add New User</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-semibold">Total Users</span>
            <span className="material-symbols-outlined text-blue-600">group</span>
          </div>
          <p className="text-2xl font-extrabold">124,500</p>
          <p className="text-xs text-slate-400 mt-1">+12% this month</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-semibold">Freelancers</span>
            <span className="material-symbols-outlined text-green-600">person</span>
          </div>
          <p className="text-2xl font-extrabold">89,340</p>
          <p className="text-xs text-slate-400 mt-1">+8% this month</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-semibold">Clients</span>
            <span className="material-symbols-outlined text-purple-600">business</span>
          </div>
          <p className="text-2xl font-extrabold">35,160</p>
          <p className="text-xs text-slate-400 mt-1">+15% this month</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-semibold">Pending</span>
            <span className="material-symbols-outlined text-amber-600">pending</span>
          </div>
          <p className="text-2xl font-extrabold">142</p>
          <p className="text-xs text-slate-400 mt-1">Verification needed</p>
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
                  placeholder="Search by name, email, or ID..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
            </div>

            {/* Role Filter */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Roles</option>
              <option value="freelancer">Freelancers</option>
              <option value="client">Clients</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>

            {/* Export Button */}
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-lg">download</span>
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Activity
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-10 rounded-full bg-cover bg-center border-2 border-slate-200 dark:border-slate-700"
                        style={{ backgroundImage: `url('${user.avatar}')` }}
                      ></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{user.name}</p>
                          {user.verified && (
                            <span className="material-symbols-outlined text-blue-500 text-sm">
                              verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">{user.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {user.joined}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-semibold">
                        {user.totalJobs} {user.role === 'Freelancer' ? 'jobs' : 'projects'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {user.earnings || user.spending}
                      </p>
                    </div>
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
                        <span className="material-symbols-outlined text-lg">delete</span>
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
            <span className="font-semibold">124,500</span> users
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

export default UserManagement;