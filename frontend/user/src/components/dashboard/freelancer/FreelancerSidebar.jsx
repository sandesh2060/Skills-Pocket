// ============================================
// FILE: frontend/user/src/components/dashboard/freelancer/FreelancerSidebar.jsx
// COMPLETE VERSION WITH BROWSE JOBS
// ============================================
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import notificationApi from '../../../api/notificationApi';

const RocketIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 13.12l2.23 2.23 1.88-1.88 1.62 1.62-1.88 1.88L8.08 19l.88-3.62c.31-.13 3.6-1.53 5.89-3.57 3.05-2.73 4.15-6.32 4.15-6.32s-3.59 1.1-6.32 4.15l-3.49-.29zM9 18l-4-4-.72 2.9L2 19.18l2.28 2.28 2.28-2.28L9 18zm4.42-13.56c1.24 0 2.25 1.01 2.25 2.25s-1.01 2.25-2.25 2.25-2.25-1.01-2.25-2.25 1.01-2.25 2.25-2.25z"/>
  </svg>
);

export default function FreelancerSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user, isOnline } = useAuth();
  const [stats, setStats] = useState({
    unreadMessages: 0,
    activeJobs: 0,
    pendingProposals: 0,
    walletBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const retryTimeoutRef = useRef(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  useEffect(() => {
    fetchSidebarData();

    // Only set up polling if online
    let interval;
    if (isOnline) {
      interval = setInterval(fetchSidebarData, 60000); // Increased to 60s to reduce load
    }

    return () => {
      if (interval) clearInterval(interval);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [isOnline]);

  const fetchSidebarData = async () => {
    // Don't fetch if offline
    if (!navigator.onLine) {
      console.log('📡 Offline - skipping sidebar data fetch');
      setLoading(false);
      setFetchError(true);
      return;
    }

    try {
      setFetchError(false);
      
      // Fetch unread message count
      const notifResponse = await notificationApi.getUnreadCount();
      
      if (notifResponse.success) {
        setStats(prev => ({
          ...prev,
          unreadMessages: notifResponse.data?.count || 0,
        }));
        retryCountRef.current = 0; // Reset retry count on success
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch sidebar data:', error);
      
      // Check if it's a network error
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        setFetchError(true);
        
        // Implement exponential backoff retry
        if (retryCountRef.current < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 30000); // Max 30s
          console.log(`⏳ Retrying in ${delay}ms (attempt ${retryCountRef.current + 1}/${maxRetries})`);
          
          retryTimeoutRef.current = setTimeout(() => {
            retryCountRef.current++;
            fetchSidebarData();
          }, delay);
        } else {
          console.log('❌ Max retries reached, stopping retry attempts');
          setLoading(false);
        }
      } else {
        // Non-network error, stop loading
        setLoading(false);
      }
    }
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      path: '/freelancer/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
        </svg>
      ),
    },
    {
      path: '/freelancer/browse-jobs',
      label: 'Browse Jobs',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      ),
    },
    {
      path: '/freelancer/jobs',
      label: 'My Jobs',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
        </svg>
      ),
      badge: stats.activeJobs > 0 ? stats.activeJobs : null,
      badgeColor: 'bg-blue-500',
    },
    {
      path: '/freelancer/messages',
      label: 'Messages',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
        </svg>
      ),
      badge: stats.unreadMessages,
      badgeColor: 'bg-primary',
    },
    {
      path: '/freelancer/wallet',
      label: 'Wallet',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        </svg>
      ),
      subLabel: stats.walletBalance > 0 ? `$${stats.walletBalance.toLocaleString()}` : null,
    },
    {
      path: '/freelancer/profile',
      label: 'Profile',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      ),
    },
  ];

  const NavLink = ({ item, onClick }) => (
    <Link
      to={item.path}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg group relative ${
        isActive(item.path)
          ? 'bg-[#e7edf3] dark:bg-slate-800 text-[#0d141b] dark:text-white'
          : 'text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      } transition-colors`}
    >
      <div className={isActive(item.path) ? 'text-primary' : ''}>
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-sm ${isActive(item.path) ? 'font-semibold' : 'font-medium'} truncate block`}>
          {item.label}
        </span>
        {item.subLabel && (
          <span className="text-xs text-[#4c739a] dark:text-slate-400 truncate block">
            {item.subLabel}
          </span>
        )}
      </div>
      {item.badge !== null && item.badge !== undefined && item.badge > 0 && (
        <span className={`${item.badgeColor} text-white text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 font-bold min-w-[20px] text-center`}>
          {item.badge > 9 ? '9+' : item.badge}
        </span>
      )}
    </Link>
  );

  // Offline indicator
  const OfflineIndicator = () => (
    <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
      <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span className="text-xs font-medium">You are offline</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-solid border-[#e7edf3] dark:border-slate-800 bg-white dark:bg-slate-900 flex-col h-screen sticky top-0">
        {/* Logo */}
        <div className="p-6 border-b border-[#e7edf3] dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-lg size-10 flex items-center justify-center text-white flex-shrink-0">
              <RocketIcon />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-[#0d141b] dark:text-white text-lg font-bold leading-tight truncate">SkillsPocket</h1>
              <p className="text-[#4c739a] dark:text-slate-400 text-xs font-normal truncate">Freelancer Portal</p>
            </div>
          </div>
        </div>

        {/* Offline Indicator */}
        {!isOnline && <OfflineIndicator />}

        {/* User Profile Card */}
        <div className="px-4 py-4 border-b border-[#e7edf3] dark:border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div 
              className="w-10 h-10 rounded-full bg-cover bg-center flex-shrink-0 ring-2 ring-primary/20"
              style={{
                backgroundImage: user?.profilePicture 
                  ? `url("${user.profilePicture}")` 
                  : `url("https://ui-avatars.com/api/?name=${user?.firstName || 'User'}&background=137fec&color=fff")`
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#0d141b] dark:text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-[#4c739a] dark:text-slate-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {loading ? (
            // Loading skeleton
            <>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="px-3 py-2.5 rounded-lg animate-pulse">
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                </div>
              ))}
            </>
          ) : (
            navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))
          )}

          {/* Divider */}
          <div className="py-2">
            <div className="border-t border-[#e7edf3] dark:border-slate-800"></div>
          </div>

          {/* Additional Links */}
          <Link
            to="/freelancer/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
            <span className="text-sm font-medium truncate">Settings</span>
          </Link>

          <Link
            to="/help"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
            </svg>
            <span className="text-sm font-medium truncate">Help & Support</span>
          </Link>
        </nav>

        {/* Post Service Button */}
        <div className="p-4 border-t border-[#e7edf3] dark:border-slate-800">
          <button className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Post a Service
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-[#e7edf3] dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="p-4 border-b border-[#e7edf3] dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-lg size-10 flex items-center justify-center text-white flex-shrink-0">
                <RocketIcon />
              </div>
              <div className="flex flex-col min-w-0">
                <h1 className="text-[#0d141b] dark:text-white text-base font-bold leading-tight truncate">SkillsPocket</h1>
                <p className="text-[#4c739a] dark:text-slate-400 text-xs font-normal truncate">Freelancer Portal</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#4c739a] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Offline Indicator */}
          {!isOnline && <OfflineIndicator />}

          {/* Mobile User Profile Card */}
          <div className="px-4 py-4 border-b border-[#e7edf3] dark:border-slate-800">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div 
                className="w-10 h-10 rounded-full bg-cover bg-center flex-shrink-0 ring-2 ring-primary/20"
                style={{
                  backgroundImage: user?.profilePicture 
                    ? `url("${user.profilePicture}")` 
                    : `url("https://ui-avatars.com/api/?name=${user?.firstName || 'User'}&background=137fec&color=fff")`
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#0d141b] dark:text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-[#4c739a] dark:text-slate-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {loading ? (
              <>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="px-3 py-2.5 rounded-lg animate-pulse">
                    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                  </div>
                ))}
              </>
            ) : (
              navItems.map((item) => (
                <NavLink key={item.path} item={item} onClick={onClose} />
              ))
            )}

            <div className="py-2">
              <div className="border-t border-[#e7edf3] dark:border-slate-800"></div>
            </div>

            <Link
              to="/freelancer/settings"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
              </svg>
              <span className="text-sm font-medium">Settings</span>
            </Link>

            <Link
              to="/help"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
              </svg>
              <span className="text-sm font-medium">Help & Support</span>
            </Link>
          </nav>

          {/* Mobile Post Service Button */}
          <div className="p-4 border-t border-[#e7edf3] dark:border-slate-800">
            <button 
              onClick={onClose}
              className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Post a Service
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay - Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
    </>
  );
}