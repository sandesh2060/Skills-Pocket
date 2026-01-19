// ============================================
// FILE 3: frontend/admin/src/components/layout/Header.jsx
// ============================================
import { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const Header = () => {
  const { admin } = useAdminAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
    // Implement search functionality
  };

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between z-40 shadow-sm">
      {/* Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <form onSubmit={handleSearch} className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 border-none focus:ring-2 focus:ring-[#137fec]/20 focus:bg-white text-sm placeholder:text-slate-400 transition-all outline-none"
            placeholder="Search for projects, users, or tickets..."
          />
        </form>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors relative">
          <span className="text-xl">🔔</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Messages */}
        <button className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
          <span className="text-xl">💬</span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-200 mx-2"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold leading-none">{admin?.email || 'Admin User'}</p>
            <p className="text-[10px] text-slate-500 font-semibold uppercase mt-1">{admin?.role || 'Administrator'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#137fec] to-[#0f66bd] flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
            {admin?.email?.[0]?.toUpperCase() || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;