
// ============================================
// FILE: frontend/user/src/components/dashboard/freelancer/FreelancerNavbar.jsx
// ============================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function FreelancerNavbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-14 sm:h-16 border-b border-solid border-[#e7edf3] dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Left Section - Mobile Menu + Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-[#4c739a] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#4c739a]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              className="w-full bg-[#f0f2f5] dark:bg-slate-800 border-none rounded-lg pl-9 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-primary/50 placeholder:text-[#4c739a] outline-none"
              placeholder="Search jobs..."
              type="text"
            />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-6">
        {/* Desktop Links - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <a className="text-[#4c739a] dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">
            Find Work
          </a>
          <a className="text-[#4c739a] dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">
            My Reports
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications */}
          <button className="p-1.5 sm:p-2 text-[#4c739a] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
            <span className="absolute top-1 right-1 sm:top-2 sm:right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>

          {/* Settings - Hidden on small mobile */}
          <button className="hidden sm:block p-2 text-[#4c739a] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
          </button>

          {/* Divider - Hidden on small mobile */}
          <div className="hidden sm:block h-8 w-[1px] bg-[#e7edf3] dark:bg-slate-800 mx-2"></div>

          {/* Profile */}
          <div className="relative">
            <div 
              className="flex items-center gap-2 sm:gap-3 cursor-pointer"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div 
                className="size-8 sm:size-9 rounded-full bg-cover bg-center ring-2 ring-primary/10 flex-shrink-0"
                style={{
                  backgroundImage: `url("https://ui-avatars.com/api/?name=${user?.firstName || 'User'}&background=137fec&color=fff")`
                }}
              ></div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-bold leading-none truncate max-w-[120px]">{user?.firstName} {user?.lastName}</p>
                <p className="text-[10px] text-[#4c739a] mt-1 font-medium">Expert Designer</p>
              </div>
            </div>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}