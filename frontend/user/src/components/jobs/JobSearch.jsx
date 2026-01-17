
// ============================================
// FILE: frontend/user/src/components/jobs/JobSearch.jsx
// ============================================
import React, { useState } from 'react';

export default function JobSearch({ onSearch, placeholder = "Search for jobs..." }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4c739a] dark:text-slate-400">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>

        {/* Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-24 py-4 rounded-xl border border-[#e7edf3] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white placeholder:text-[#4c739a] focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
        />

        {/* Clear & Search Buttons */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-[#4c739a] hover:text-[#0d141b] dark:hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          )}
          
          <button
            type="submit"
            className="px-5 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Quick Filters (Optional) */}
      <div className="flex flex-wrap gap-2 mt-3">
        {['React', 'Design', 'Writing', 'Marketing'].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => {
              setSearchTerm(tag);
              onSearch(tag);
            }}
            className="px-3 py-1.5 text-xs font-medium text-[#4c739a] dark:text-slate-400 hover:text-primary hover:bg-primary/5 rounded-full border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </form>
  );
}