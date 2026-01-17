// ============================================
// FILE: frontend/user/src/components/dashboard/freelancer/FreelancerSidebar.jsx
// ============================================
import { Link, useLocation } from 'react-router-dom';

const RocketIcon = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.19 6.35c-2.04 2.29-3.44 5.58-3.57 5.89L2 13.12l2.23 2.23 1.88-1.88 1.62 1.62-1.88 1.88L8.08 19l.88-3.62c.31-.13 3.6-1.53 5.89-3.57 3.05-2.73 4.15-6.32 4.15-6.32s-3.59 1.1-6.32 4.15l-3.49-.29zM9 18l-4-4-.72 2.9L2 19.18l2.28 2.28 2.28-2.28L9 18zm4.42-13.56c1.24 0 2.25 1.01 2.25 2.25s-1.01 2.25-2.25 2.25-2.25-1.01-2.25-2.25 1.01-2.25 2.25-2.25z"/>
  </svg>
);

export default function FreelancerSidebar({ isOpen, onClose }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-solid border-[#e7edf3] dark:border-slate-800 bg-white dark:bg-slate-900 flex-col h-screen sticky top-0">
        {/* Logo */}
        <div className="p-6">
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

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <Link
            to="/freelancer/dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg group ${
              isActive('/freelancer/dashboard')
                ? 'bg-[#e7edf3] dark:bg-slate-800 text-[#0d141b] dark:text-white'
                : 'text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            } transition-colors`}
          >
            <svg className={`w-5 h-5 flex-shrink-0 ${isActive('/freelancer/dashboard') ? 'text-primary' : ''}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
            <span className={`text-sm ${isActive('/freelancer/dashboard') ? 'font-semibold' : 'font-medium'} truncate`}>
              Dashboard
            </span>
          </Link>

          <Link
            to="/freelancer/jobs"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
              isActive('/freelancer/jobs')
                ? 'bg-[#e7edf3] dark:bg-slate-800 text-[#0d141b] dark:text-white'
                : 'text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            } transition-colors`}
          >
            <svg className={`w-5 h-5 flex-shrink-0 ${isActive('/freelancer/jobs') ? 'text-primary' : ''}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
            </svg>
            <span className={`text-sm ${isActive('/freelancer/jobs') ? 'font-semibold' : 'font-medium'} truncate`}>
              My Jobs
            </span>
          </Link>

          <Link
            to="/freelancer/messages"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
              isActive('/freelancer/messages')
                ? 'bg-[#e7edf3] dark:bg-slate-800 text-[#0d141b] dark:text-white'
                : 'text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            } transition-colors`}
          >
            <svg className={`w-5 h-5 flex-shrink-0 ${isActive('/freelancer/messages') ? 'text-primary' : ''}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
            </svg>
            <span className={`text-sm ${isActive('/freelancer/messages') ? 'font-semibold' : 'font-medium'} truncate flex-1`}>
              Messages
            </span>
            <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0">3</span>
          </Link>

          <Link
            to="/freelancer/wallet"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
              isActive('/freelancer/wallet')
                ? 'bg-[#e7edf3] dark:bg-slate-800 text-[#0d141b] dark:text-white'
                : 'text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            } transition-colors`}
          >
            <svg className={`w-5 h-5 flex-shrink-0 ${isActive('/freelancer/wallet') ? 'text-primary' : ''}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
            <span className={`text-sm ${isActive('/freelancer/wallet') ? 'font-semibold' : 'font-medium'} truncate`}>
              Wallet
            </span>
          </Link>

          <Link
            to="/freelancer/profile"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
              isActive('/freelancer/profile')
                ? 'bg-[#e7edf3] dark:bg-slate-800 text-[#0d141b] dark:text-white'
                : 'text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            } transition-colors`}
          >
            <svg className={`w-5 h-5 flex-shrink-0 ${isActive('/freelancer/profile') ? 'text-primary' : ''}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span className={`text-sm ${isActive('/freelancer/profile') ? 'font-semibold' : 'font-medium'} truncate`}>
              Profile
            </span>
          </Link>
        </nav>

        {/* Post Service Button */}
        <div className="p-4 border-t border-[#e7edf3] dark:border-slate-800">
          <button className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Post a Service
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-[#e7edf3] dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:hidden ${
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
              className="p-2 text-[#4c739a] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            <Link
              to="/freelancer/dashboard"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                isActive('/freelancer/dashboard')
                  ? 'bg-[#e7edf3] dark:bg-slate-800 text-[#0d141b] dark:text-white'
                  : 'text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              } transition-colors`}
            >
              <svg className={`w-5 h-5 flex-shrink-0 ${isActive('/freelancer/dashboard') ? 'text-primary' : ''}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
              <span className={`text-sm ${isActive('/freelancer/dashboard') ? 'font-semibold' : 'font-medium'}`}>Dashboard</span>
            </Link>

            <Link
              to="/freelancer/jobs"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                isActive('/freelancer/jobs')
                  ? 'bg-[#e7edf3] dark:bg-slate-800 text-[#0d141b] dark:text-white'
                  : 'text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              } transition-colors`}
            >
              <svg className={`w-5 h-5 flex-shrink-0 ${isActive('/freelancer/jobs') ? 'text-primary' : ''}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
              </svg>
              <span className={`text-sm ${isActive('/freelancer/jobs') ? 'font-semibold' : 'font-medium'}`}>My Jobs</span>
            </Link>

            <Link
              to="/freelancer/messages"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                isActive('/freelancer/messages')
                  ? 'bg-[#e7edf3] dark:bg-slate-800 text-[#0d141b] dark:text-white'
                  : 'text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              } transition-colors`}
            >
              <svg className={`w-5 h-5 flex-shrink-0 ${isActive('/freelancer/messages') ? 'text-primary' : ''}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
              </svg>
              <span className={`text-sm ${isActive('/freelancer/messages') ? 'font-semibold' : 'font-medium'} flex-1`}>Messages</span>
              <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">3</span>
            </Link>

            <Link
              to="/freelancer/wallet"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                isActive('/freelancer/wallet')
                  ? 'bg-[#e7edf3] dark:bg-slate-800 text-[#0d141b] dark:text-white'
                  : 'text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              } transition-colors`}
            >
              <svg className={`w-5 h-5 flex-shrink-0 ${isActive('/freelancer/wallet') ? 'text-primary' : ''}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
              <span className={`text-sm ${isActive('/freelancer/wallet') ? 'font-semibold' : 'font-medium'}`}>Wallet</span>
            </Link>

            <Link
              to="/freelancer/profile"
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                isActive('/freelancer/profile')
                  ? 'bg-[#e7edf3] dark:bg-slate-800 text-[#0d141b] dark:text-white'
                  : 'text-[#4c739a] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              } transition-colors`}
            >
              <svg className={`w-5 h-5 flex-shrink-0 ${isActive('/freelancer/profile') ? 'text-primary' : ''}`} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span className={`text-sm ${isActive('/freelancer/profile') ? 'font-semibold' : 'font-medium'}`}>Profile</span>
            </Link>
          </nav>

          {/* Mobile Post Service Button */}
          <div className="p-4 border-t border-[#e7edf3] dark:border-slate-800">
            <button className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Post a Service
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}