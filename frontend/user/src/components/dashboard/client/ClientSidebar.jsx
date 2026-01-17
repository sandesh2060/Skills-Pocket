// ============================================
// FILE: frontend/user/src/components/dashboard/client/ClientSidebar.jsx
// ============================================
import { Link, useLocation } from 'react-router-dom';

export default function ClientSidebar({ isOpen, onClose }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[#cfdbe7] dark:border-slate-800 bg-white dark:bg-background-dark p-4 shrink-0 overflow-y-auto">
        <div className="flex flex-col gap-6">
          {/* Company Info */}
          <div className="flex gap-3 items-center px-2">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-10 flex-shrink-0"
              style={{backgroundImage: 'url("https://ui-avatars.com/api/?name=Company&background=137fec&color=fff&rounded=true")'}}
            ></div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-[#0d141b] dark:text-white text-sm font-bold truncate">Client Dashboard</h1>
              <p className="text-[#4c739a] text-xs font-medium uppercase tracking-wider truncate">Premium Enterprise</p>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="flex flex-col gap-1">
            <Link
              to="/client/dashboard"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                isActive('/client/dashboard')
                  ? 'bg-primary/10 text-primary'
                  : 'text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              } transition-colors cursor-pointer`}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
              <p className={`text-sm ${isActive('/client/dashboard') ? 'font-semibold' : 'font-medium'} truncate`}>Home</p>
            </Link>

            <Link
              to="/client/jobs"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                isActive('/client/jobs')
                  ? 'bg-primary/10 text-primary'
                  : 'text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              } transition-colors cursor-pointer`}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
              </svg>
              <p className={`text-sm ${isActive('/client/jobs') ? 'font-semibold' : 'font-medium'} truncate`}>All Jobs</p>
            </Link>

            <Link
              to="/client/hire"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                isActive('/client/hire')
                  ? 'bg-primary/10 text-primary'
                  : 'text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              } transition-colors cursor-pointer`}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
              <p className={`text-sm ${isActive('/client/hire') ? 'font-semibold' : 'font-medium'} truncate`}>Hire Freelancers</p>
            </Link>

            <Link
              to="/client/inbox"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                isActive('/client/inbox')
                  ? 'bg-primary/10 text-primary'
                  : 'text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              } transition-colors cursor-pointer relative`}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <p className={`text-sm ${isActive('/client/inbox') ? 'font-semibold' : 'font-medium'} truncate flex-1`}>Inbox</p>
              <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full flex-shrink-0">4</span>
            </Link>

            <Link
              to="/client/finances"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                isActive('/client/finances')
                  ? 'bg-primary/10 text-primary'
                  : 'text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              } transition-colors cursor-pointer`}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
              <p className={`text-sm ${isActive('/client/finances') ? 'font-semibold' : 'font-medium'} truncate`}>Finances</p>
            </Link>
          </div>

          {/* Support Section */}
          <div className="pt-6 border-t border-[#cfdbe7] dark:border-slate-800">
            <p className="px-3 text-xs font-bold text-[#4c739a] uppercase tracking-widest mb-2">Support</p>
            
            <Link
              to="/client/help"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
              </svg>
              <p className="text-sm font-medium truncate">Help Center</p>
            </Link>

            <Link
              to="/client/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
              </svg>
              <p className="text-sm font-medium truncate">Settings</p>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-background-dark border-r border-[#cfdbe7] dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#cfdbe7] dark:border-slate-800">
            <div className="flex gap-3 items-center">
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-10 flex-shrink-0"
                style={{backgroundImage: 'url("https://ui-avatars.com/api/?name=Company&background=137fec&color=fff&rounded=true")'}}
              ></div>
              <div className="flex flex-col min-w-0">
                <h1 className="text-[#0d141b] dark:text-white text-sm font-bold truncate">Client Dashboard</h1>
                <p className="text-[#4c739a] text-xs font-medium uppercase tracking-wider truncate">Premium</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#4c739a] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
            <div className="flex flex-col gap-1">
              <Link
                to="/client/dashboard"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                  isActive('/client/dashboard')
                    ? 'bg-primary/10 text-primary'
                    : 'text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                } transition-colors`}
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
                <p className={`text-sm ${isActive('/client/dashboard') ? 'font-semibold' : 'font-medium'}`}>Home</p>
              </Link>

              <Link
                to="/client/jobs"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                  isActive('/client/jobs')
                    ? 'bg-primary/10 text-primary'
                    : 'text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                } transition-colors`}
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                </svg>
                <p className={`text-sm ${isActive('/client/jobs') ? 'font-semibold' : 'font-medium'}`}>All Jobs</p>
              </Link>

              <Link
                to="/client/hire"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                  isActive('/client/hire')
                    ? 'bg-primary/10 text-primary'
                    : 'text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                } transition-colors`}
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
                <p className={`text-sm ${isActive('/client/hire') ? 'font-semibold' : 'font-medium'}`}>Hire Freelancers</p>
              </Link>

              <Link
                to="/client/inbox"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                  isActive('/client/inbox')
                    ? 'bg-primary/10 text-primary'
                    : 'text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                } transition-colors`}
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <p className={`text-sm ${isActive('/client/inbox') ? 'font-semibold' : 'font-medium'} flex-1`}>Inbox</p>
                <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">4</span>
              </Link>

              <Link
                to="/client/finances"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                  isActive('/client/finances')
                    ? 'bg-primary/10 text-primary'
                    : 'text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                } transition-colors`}
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
                <p className={`text-sm ${isActive('/client/finances') ? 'font-semibold' : 'font-medium'}`}>Finances</p>
              </Link>
            </div>

            {/* Mobile Support Section */}
            <div className="pt-4 border-t border-[#cfdbe7] dark:border-slate-800">
              <p className="px-3 text-xs font-bold text-[#4c739a] uppercase tracking-widest mb-2">Support</p>
              
              <Link
                to="/client/help"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                </svg>
                <p className="text-sm font-medium">Help Center</p>
              </Link>

              <Link
                to="/client/settings"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                </svg>
                <p className="text-sm font-medium">Settings</p>
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}