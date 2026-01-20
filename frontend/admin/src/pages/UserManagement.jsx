import { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    freelancers: 0,
    clients: 0,
    pending: 0
  });

  const API_BASE_URL = 'http://localhost:5001/api/admin';

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(filterRole !== 'all' && { role: filterRole }),
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(searchQuery && { search: searchQuery })
      });

      const response = await axios.get(`${API_BASE_URL}/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { users, totalPages, totalUsers, currentPage: page } = response.data.data;
      
      setUsers(users);
      setTotalPages(totalPages);
      setTotalUsers(totalUsers);
      setCurrentPage(page);

    } catch (error) {
      console.error('Failed to fetch users:', error);
      alert('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user stats
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const [allUsers, freelancers, clients, pending] = await Promise.all([
        axios.get(`${API_BASE_URL}/users?limit=1`, { headers: { Authorization: `Bearer ${token}` }}),
        axios.get(`${API_BASE_URL}/users?role=freelancer&limit=1`, { headers: { Authorization: `Bearer ${token}` }}),
        axios.get(`${API_BASE_URL}/users?role=client&limit=1`, { headers: { Authorization: `Bearer ${token}` }}),
        axios.get(`${API_BASE_URL}/users?status=pending&limit=1`, { headers: { Authorization: `Bearer ${token}` }})
      ]);

      setStats({
        total: allUsers.data.data.totalUsers,
        freelancers: freelancers.data.data.totalUsers,
        clients: clients.data.data.totalUsers,
        pending: pending.data.data.totalUsers
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // Handle user actions
  const handleSuspendUser = async (userId) => {
    if (!confirm('Are you sure you want to suspend this user?')) return;
    
    const reason = prompt('Enter suspension reason:');
    if (!reason) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `${API_BASE_URL}/users/${userId}/suspend`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert('User suspended successfully');
      fetchUsers();
    } catch (error) {
      console.error('Failed to suspend user:', error);
      alert('Failed to suspend user');
    }
  };

  const handleUnsuspendUser = async (userId) => {
    if (!confirm('Are you sure you want to unsuspend this user?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `${API_BASE_URL}/users/${userId}/unsuspend`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert('User unsuspended successfully');
      fetchUsers();
    } catch (error) {
      console.error('Failed to unsuspend user:', error);
      alert('Failed to unsuspend user');
    }
  };

  const handleVerifyUser = async (userId) => {
    if (!confirm('Are you sure you want to verify this user?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `${API_BASE_URL}/users/${userId}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert('User verified successfully');
      fetchUsers();
    } catch (error) {
      console.error('Failed to verify user:', error);
      alert('Failed to verify user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(
        `${API_BASE_URL}/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      alert('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [currentPage, filterRole, filterStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchUsers();
      } else {
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getStatusColor = (user) => {
    if (user.isSuspended) {
      return 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400';
    }
    if (!user.isVerified) {
      return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400';
    }
    if (user.isActive) {
      return 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400';
    }
    return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
  };

  const getStatusText = (user) => {
    if (user.isSuspended) return 'Suspended';
    if (!user.isVerified) return 'Pending';
    if (user.isActive) return 'Active';
    return 'Inactive';
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-semibold">Total Users</span>
            <span className="material-symbols-outlined text-blue-600">group</span>
          </div>
          <p className="text-2xl font-extrabold">{stats.total.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-semibold">Freelancers</span>
            <span className="material-symbols-outlined text-green-600">person</span>
          </div>
          <p className="text-2xl font-extrabold">{stats.freelancers.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-semibold">Clients</span>
            <span className="material-symbols-outlined text-purple-600">business</span>
          </div>
          <p className="text-2xl font-extrabold">{stats.clients.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm font-semibold">Pending</span>
            <span className="material-symbols-outlined text-amber-600">pending</span>
          </div>
          <p className="text-2xl font-extrabold">{stats.pending.toLocaleString()}</p>
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
                  placeholder="Search by name, email..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Roles</option>
              <option value="freelancer">Freelancers</option>
              <option value="client">Clients</option>
            </select>

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
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-300 border-t-primary"></div>
              <p className="mt-4 text-slate-500">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No users found
            </div>
          ) : (
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
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold">
                              {user.firstName} {user.lastName}
                            </p>
                            {user.isVerified && (
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
                      <span className="text-sm font-medium capitalize">{user.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(user)}`}>
                        {getStatusText(user)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!user.isVerified && (
                          <button
                            onClick={() => handleVerifyUser(user._id)}
                            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Verify
                          </button>
                        )}
                        {user.isSuspended ? (
                          <button
                            onClick={() => handleUnsuspendUser(user._id)}
                            className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Unsuspend
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSuspendUser(user._id)}
                            className="px-3 py-1 text-xs bg-amber-500 text-white rounded hover:bg-amber-600"
                          >
                            Suspend
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
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
              Showing page {currentPage} of {totalPages} ({totalUsers} total users)
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

export default UserManagement;