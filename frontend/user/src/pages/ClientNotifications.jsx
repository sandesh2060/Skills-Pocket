// ============================================
// FILE: frontend/user/src/pages/ClientNotifications.jsx
// FULLY INTEGRATED NOTIFICATIONS PAGE FOR CLIENT
// ============================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientSidebar from '../components/dashboard/client/ClientSidebar';
import ClientNavbar from '../components/dashboard/client/ClientNavbar';
import { useNotifications } from '../hooks/useNotifications';
import proposalService from '../services/proposalService';
import { toast } from 'react-hot-toast';

export default function ClientNotifications() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [processingAction, setProcessingAction] = useState(null);

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
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

  const handleAcceptProposal = async (proposalId, notificationId) => {
    setProcessingAction(notificationId);
    try {
      const response = await proposalService.acceptProposal(proposalId);
      if (response.success) {
        toast.success('Proposal accepted successfully!');
        await markAsRead(notificationId);
        await refresh();
      }
    } catch (error) {
      console.error('Error accepting proposal:', error);
      toast.error(error.response?.data?.message || 'Failed to accept proposal');
    } finally {
      setProcessingAction(null);
    }
  };

  const handleRejectProposal = async (proposalId, notificationId) => {
    setProcessingAction(notificationId);
    try {
      const response = await proposalService.rejectProposal(proposalId);
      if (response.success) {
        toast.success('Proposal rejected');
        await markAsRead(notificationId);
        await refresh();
      }
    } catch (error) {
      console.error('Error rejecting proposal:', error);
      toast.error(error.response?.data?.message || 'Failed to reject proposal');
    } finally {
      setProcessingAction(null);
    }
  };

  const getNotificationIcon = (type) => {
    const iconClasses = "w-10 h-10 rounded-full flex items-center justify-center";
    
    switch (type) {
      case 'proposal_received':
        return (
          <div className={`${iconClasses} bg-blue-100 dark:bg-blue-900/30`}>
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      case 'proposal_accepted':
      case 'proposal_rejected':
        return (
          <div className={`${iconClasses} bg-purple-100 dark:bg-purple-900/30`}>
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'new_message':
        return (
          <div className={`${iconClasses} bg-green-100 dark:bg-green-900/30`}>
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className={`${iconClasses} bg-indigo-100 dark:bg-indigo-900/30`}>
            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

  const getProposalId = (notification) => {
    if (notification.data && notification.data.get('proposalId')) {
      return notification.data.get('proposalId');
    }
    const match = notification.link?.match(/\/proposals\/([a-f0-9]+)/i);
    return match ? match[1] : null;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#0b1219]">
      <ClientSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <ClientNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0d141b] dark:text-white mb-2">
                Notifications
              </h1>
              <p className="text-sm sm:text-base text-[#4c739a] dark:text-slate-400">
                Stay updated with your projects and proposals
              </p>
            </div>

            {/* Filters & Actions */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 mb-6 border border-[#e7edf3] dark:border-slate-800 shadow-soft">
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
                  <option value="proposal_received">Proposals</option>
                  <option value="new_message">Messages</option>
                  <option value="payment_received">Payments</option>
                  <option value="milestone_completed">Milestones</option>
                  <option value="job_completed">Jobs</option>
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
                filteredNotifications.map((notification) => {
                  const proposalId = getProposalId(notification);
                  const isProposalNotification = notification.type === 'proposal_received';
                  const isProcessing = processingAction === notification._id;

                  return (
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

                              {isProposalNotification && proposalId && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleAcceptProposal(proposalId, notification._id)}
                                    disabled={isProcessing}
                                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isProcessing ? 'Processing...' : 'Accept'}
                                  </button>
                                  <button
                                    onClick={() => handleRejectProposal(proposalId, notification._id)}
                                    disabled={isProcessing}
                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}

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
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}