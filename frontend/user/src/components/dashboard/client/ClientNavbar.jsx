// ============================================
// FILE: frontend/user/src/components/dashboard/client/ClientNavbar.jsx
// ============================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const RocketIcon = () => (
  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_6_319)">
      <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor" />
    </g>
  </svg>
);

export default function ClientNavbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#cfdbe7] dark:border-slate-700 bg-white dark:bg-background-dark px-4 sm:px-6 lg:px-10 py-3 sticky top-0 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-3 sm:gap-6 lg:gap-8 flex-1">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-[#4c739a] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 sm:gap-4 text-primary">
          <div className="size-5 sm:size-6 flex-shrink-0">
            <RocketIcon />
          </div>
          <h2 className="text-base sm:text-xl font-bold leading-tight tracking-[-0.015em] text-[#0d141b] dark:text-white hidden sm:block">
            SkillsPocket
          </h2>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-[#e7edf3] dark:bg-slate-800">
            <div className="text-[#4c739a] flex items-center justify-center pl-4 rounded-l-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              className="form-input flex w-full min-w-0 flex-1 border-none bg-transparent focus:outline-0 focus:ring-0 placeholder:text-[#4c739a] px-4 pl-2 text-sm font-normal dark:text-white"
              placeholder="Search projects or talent"
            />
          </div>
        </label>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Desktop Navigation - Hidden on mobile/tablet */}
        <nav className="hidden xl:flex items-center gap-6">
          <a className="text-[#0d141b] dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors" href="#">
            Dashboard
          </a>
          <a className="text-[#0d141b] dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">
            My Jobs
          </a>
          <a className="text-[#0d141b] dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">
            Talent
          </a>
          <a className="text-[#0d141b] dark:text-slate-300 text-sm font-medium hover:text-primary transition-colors" href="#">
            Reports
          </a>
        </nav>

        {/* Actions */}
        <div className="flex gap-2 sm:gap-3">
          {/* Notifications */}
          <button className="flex items-center justify-center rounded-lg h-9 sm:h-10 bg-[#e7edf3] dark:bg-slate-800 text-[#0d141b] dark:text-white px-2.5 sm:px-3 hover:bg-[#d0dae4] transition-colors">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 sm:size-10 border border-[#cfdbe7] dark:border-slate-700 cursor-pointer"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                backgroundImage: `url("https://ui-avatars.com/api/?name=${user?.firstName || 'User'}&background=137fec&color=fff")`
              }}
            ></div>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
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