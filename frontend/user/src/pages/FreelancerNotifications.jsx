// ============================================
// FILE: frontend/user/src/pages/FreelancerNotifications.jsx
// FULLY INTEGRATED NOTIFICATIONS PAGE FOR FREELANCER
// ============================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FreelancerNavbar from '../components/dashboard/freelancer/FreelancerNavbar';
import FreelancerSidebar from '../components/dashboard/freelancer/FreelancerSidebar';
import { useNotifications } from '../hooks/useNotifications';

export default function FreelancerNotifications() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread' && notif.isRead) return false;
    if (filter === 'read' && !notif.isRead) return false;
    if (selectedType !== 'all' && notif.type !== selectedType) return false;
    return true;
  });

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const getNotificationIcon = (type) => {
    const iconClasses = "w-10 h-10 rounded-full flex items-center justify-center";
    
    switch (type) {
      case 'new_job':
        return (
          <div className={`${iconClasses} bg-indigo-100 dark:bg-indigo-900/30`}>
            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'proposal_accepted':
        return (
          <div className={`${iconClasses} bg-green-100 dark:bg-green-900/30`}>
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'proposal_rejected':
        return (
          <div className={`${iconClasses} bg-red-100 dark:bg-red-900/30`}>
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'new_message':
        return (
          <div className={`${iconClasses} bg-blue-100 dark:bg-blue-900/30`}>
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        );
      case 'payment_received':
        return (
          <div className={`${iconClasses} bg-yellow-100 dark:bg-yellow-900/30`}>
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'milestone_completed':
      case 'job_completed':
        return (
          <div className={`${iconClasses} bg-purple-100 dark:bg-purple-900/30`}>
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'review_received':
        return (
          <div className={`${iconClasses} bg-pink-100 dark:bg-pink-900/30`}>
            <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className={`${iconClasses} bg-gray-100 dark:bg-gray-900/30`}>
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now - notifTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return notifTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f7f8] dark:bg-bg-dark">
      <FreelancerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <FreelancerNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0d141b] dark:text-white mb-2">
                Notifications
              </h1>
              <p className="text-sm sm:text-base text-[#4c739a] dark:text-slate-400">
                Stay updated with job opportunities and project updates
              </p>
            </div>

            {/* Filters & Actions */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-soft border border-[#e7edf3] dark:border-slate-800 p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'all'
                        ? 'bg-primary text-white'
                        : 'bg-[#e7edf3] dark:bg-slate-800 text-[#0d141b] dark:text-white hover:bg-[#d0dae4] dark:hover:bg-slate-700'
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'unread'
                        ? 'bg-primary text-white'
                        : 'bg-[#e7edf3] dark:bg-slate-800 text-[#0d141b] dark:text-white hover:bg-[#d0dae4] dark:hover:bg-slate-700'
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                  <button
                    onClick={() => setFilter('read')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'read'
                        ? 'bg-primary text-white'
                        : 'bg-[#e7edf3] dark:bg-slate-800 text-[#0d141b] dark:text-white hover:bg-[#d0dae4] dark:hover:bg-slate-700'
                    }`}
                  >
                    Read ({notifications.length - unreadCount})
                  </button>
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-[#e7edf3] dark:border-slate-700">
                <label className="text-sm font-medium text-[#0d141b] dark:text-white mb-2 block">
                  Filter by type:
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-[#e7edf3] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#0d141b] dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="new_job">New Jobs</option>
                  <option value="proposal_accepted">Accepted Proposals</option>
                  <option value="proposal_rejected">Rejected Proposals</option>
                  <option value="new_message">Messages</option>
                  <option value="payment_received">Payments</option>
                  <option value="milestone_completed">Milestones</option>
                  <option value="review_received">Reviews</option>
                </select>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
              {loading ? (
                <div className="bg-white dark:bg-slate-900 rounded-xl p-8 text-center border border-[#e7edf3] dark:border-slate-800">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-[#4c739a] dark:text-slate-400">Loading notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-[#e7edf3] dark:border-slate-800">
                  <svg className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <h3 className="text-lg font-semibold text-[#0d141b] dark:text-white mb-2">
                    No notifications
                  </h3>
                  <p className="text-[#4c739a] dark:text-slate-400">
                    You're all caught up! Check back later for updates.
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`bg-white dark:bg-slate-900 rounded-xl border transition-all hover:shadow-md ${
                      !notification.isRead
                        ? 'border-primary/30 bg-blue-50/30 dark:bg-blue-900/10'
                        : 'border-[#e7edf3] dark:border-slate-800'
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex gap-4">
                        {getNotificationIcon(notification.type)}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <h3 className="text-base font-semibold text-[#0d141b] dark:text-white mb-1">
                                {notification.title}
                              </h3>
                              <p className="text-sm text-[#4c739a] dark:text-slate-400 line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <span className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0 mt-1.5"></span>
                            )}
                          </div>

                          <div className="flex items-center gap-4 mt-3 flex-wrap">
                            <span className="text-xs text-[#4c739a] dark:text-slate-500">
                              {formatTime(notification.createdAt)}
                            </span>

                            {notification.link && (
                              <button
                                onClick={() => handleNotificationClick(notification)}
                                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                              >
                                View Details →
                              </button>
                            )}

                            <button
                              onClick={() => deleteNotification(notification._id)}
                              className="ml-auto text-xs text-[#4c739a] hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}