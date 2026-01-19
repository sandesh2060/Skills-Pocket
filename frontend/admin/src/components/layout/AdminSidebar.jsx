// ============================================
// FILE: frontend/admin/src/components/layout/AdminSidebar.jsx
// ============================================
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  AlertTriangle, 
  DollarSign, 
  Settings, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';

export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    window.location.href = 'http://localhost:5173/login';
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shrink-0 overflow-y-auto">
        <div className="flex flex-col gap-6">
          {/* Admin Info */}
          <div className="flex gap-3 items-center px-2">
            <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              SP
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-slate-900 dark:text-white text-sm font-bold truncate">SkillsPocket Admin</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider truncate">Master Control</p>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="flex flex-col gap-1">
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                isActive('/dashboard')
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              } transition-colors cursor-pointer`}
            >
              <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
              <p className={`text-sm ${isActive('/dashboard') ? 'font-semibold' : 'font-medium'} truncate`}>Dashboard</p>
            </Link>

            <Link
              to="/users"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                isActive('/users')
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              } transition-colors cursor-pointer`}
            >
              <Users className="w-5 h-5 flex-shrink-0" />
              <p className={`text-sm ${isActive('/users') ? 'font-semibold' : 'font-medium'} truncate`}>User Management</p>
            </Link>

            <Link
              to="/jobs"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                isActive('/jobs')
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              } transition-colors cursor-pointer`}
            >
              <Briefcase className="w-5 h-5 flex-shrink-0" />
              <p className={`text-sm ${isActive('/jobs') ? 'font-semibold' : 'font-medium'} truncate`}>Job Management</p>
            </Link>

            <Link
              to="/disputes"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                isActive('/disputes')
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              } transition-colors cursor-pointer relative`}
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className={`text-sm ${isActive('/disputes') ? 'font-semibold' : 'font-medium'} truncate flex-1`}>Disputes</p>
              <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full flex-shrink-0">3</span>
            </Link>

            <Link
              to="/financial"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                isActive('/financial')
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              } transition-colors cursor-pointer`}
            >
              <DollarSign className="w-5 h-5 flex-shrink-0" />
              <p className={`text-sm ${isActive('/financial') ? 'font-semibold' : 'font-medium'} truncate`}>Financial Monitor</p>
            </Link>
          </div>

          {/* Support Section */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">System</p>
            
            <Link
              to="/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium truncate">Settings</p>
            </Link>

            <Link
              to="/help"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium truncate">Help Center</p>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium truncate">Log Out</p>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex gap-3 items-center">
              <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                SP
              </div>
              <div className="flex flex-col min-w-0">
                <h1 className="text-slate-900 dark:text-white text-sm font-bold truncate">SkillsPocket Admin</h1>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider truncate">Master Control</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex-shrink-0"
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
                to="/dashboard"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                  isActive('/dashboard')
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                } transition-colors`}
              >
                <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                <p className={`text-sm ${isActive('/dashboard') ? 'font-semibold' : 'font-medium'}`}>Dashboard</p>
              </Link>

              <Link
                to="/users"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                  isActive('/users')
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                } transition-colors`}
              >
                <Users className="w-5 h-5 flex-shrink-0" />
                <p className={`text-sm ${isActive('/users') ? 'font-semibold' : 'font-medium'}`}>User Management</p>
              </Link>

              <Link
                to="/jobs"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                  isActive('/jobs')
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                } transition-colors`}
              >
                <Briefcase className="w-5 h-5 flex-shrink-0" />
                <p className={`text-sm ${isActive('/jobs') ? 'font-semibold' : 'font-medium'}`}>Job Management</p>
              </Link>

              <Link
                to="/disputes"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                  isActive('/disputes')
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                } transition-colors`}
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p className={`text-sm ${isActive('/disputes') ? 'font-semibold' : 'font-medium'} flex-1`}>Disputes</p>
                <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">3</span>
              </Link>

              <Link
                to="/financial"
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                  isActive('/financial')
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                } transition-colors`}
              >
                <DollarSign className="w-5 h-5 flex-shrink-0" />
                <p className={`text-sm ${isActive('/financial') ? 'font-semibold' : 'font-medium'}`}>Financial Monitor</p>
              </Link>
            </div>

            {/* Mobile Support Section */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">System</p>
              
              <Link
                to="/settings"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">Settings</p>
              </Link>

              <Link
                to="/help"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <HelpCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">Help Center</p>
              </Link>

              <button
                onClick={() => {
                  onClose();
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">Log Out</p>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}