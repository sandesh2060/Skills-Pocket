// ============================================
// FILE: frontend/user/src/pages/JobSearch.jsx
// ============================================
import { useState, useEffect } from 'react';
import FreelancerNavbar from '../components/dashboard/freelancer/FreelancerNavbar';
import FreelancerSidebar from '../components/dashboard/freelancer/FreelancerSidebar';
import { searchJobs, saveJob, getCategories } from '../api/jobsApi';

export default function JobSearch() {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: [],
    experience: [],
    minBudget: '',
    maxBudget: '',
    jobType: '',
    sortBy: 'newest'
  });
  const [savedJobs, setSavedJobs] = useState(new Set());

  useEffect(() => {
    fetchCategories();
    fetchJobs();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchJobs();
    }, 300);
    return () => clearTimeout(debounce);
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await searchJobs(filters);
      setJobs(response.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      await saveJob(jobId);
      setSavedJobs(prev => {
        const newSet = new Set(prev);
        if (newSet.has(jobId)) {
          newSet.delete(jobId);
        } else {
          newSet.add(jobId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckboxFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: [],
      experience: [],
      minBudget: '',
      maxBudget: '',
      jobType: '',
      sortBy: 'newest'
    });
  };

  const getTimeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
      }
    }
    return 'Just now';
  };

  return (
    <div className="flex h-screen bg-[#f6f7f8] dark:bg-bg-dark overflow-hidden">
      <FreelancerSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <FreelancerNavbar />
        
        <main className="flex-1 flex overflow-hidden">
          {/* Filters Sidebar */}
          <aside className="hidden lg:flex w-64 flex-col gap-6 p-6 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-bold text-[#0d141b] dark:text-white">Filters</h1>
                <button 
                  onClick={clearFilters}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Clear all
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {/* Category */}
                <div>
                  <p className="text-sm font-bold text-[#0d141b] dark:text-slate-200 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l-5.5 9h11z M17.5 17.5L12 15l-5.5 2.5L12 22z M12 13L1 23h22z"/>
                    </svg>
                    Category
                  </p>
                  <div className="flex flex-col gap-2">
                    {['Web Development', 'UI/UX Design', 'Writing', 'Marketing', 'Video Editing'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.category.includes(cat)}
                          onChange={() => handleCheckboxFilter('category', cat)}
                          className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                        />
                        <span className="text-sm text-[#4c739a] dark:text-slate-400">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <p className="text-sm font-bold text-[#0d141b] dark:text-slate-200 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                    </svg>
                    Experience
                  </p>
                  <div className="flex flex-col gap-2">
                    {['Entry Level', 'Intermediate', 'Expert'].map((level) => (
                      <label key={level} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.experience.includes(level)}
                          onChange={() => handleCheckboxFilter('experience', level)}
                          className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                        />
                        <span className="text-sm text-[#4c739a] dark:text-slate-400">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Budget Range */}
                <div>
                  <p className="text-sm font-bold text-[#0d141b] dark:text-slate-200 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                    </svg>
                    Budget Range
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="$ Min"
                      value={filters.minBudget}
                      onChange={(e) => handleFilterChange('minBudget', e.target.value)}
                      className="w-full text-sm rounded-lg border-[#cfdbe7] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 focus:ring-primary focus:border-primary"
                    />
                    <input
                      type="number"
                      placeholder="$ Max"
                      value={filters.maxBudget}
                      onChange={(e) => handleFilterChange('maxBudget', e.target.value)}
                      className="w-full text-sm rounded-lg border-[#cfdbe7] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                {/* Job Type */}
                <div>
                  <p className="text-sm font-bold text-[#0d141b] dark:text-slate-200 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                    Job Type
                  </p>
                  <div className="flex flex-col gap-2">
                    {['Hourly', 'Fixed-Price'].map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="jobType"
                          checked={filters.jobType === type}
                          onChange={() => handleFilterChange('jobType', type)}
                          className="text-primary focus:ring-primary h-4 w-4"
                        />
                        <span className="text-sm text-[#4c739a] dark:text-slate-400">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={fetchJobs}
                className="mt-6 w-full py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
              >
                Apply Filters
              </button>
            </div>

            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
              <h4 className="text-primary text-sm font-bold mb-1">Pro Tip</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Verified payment methods have a 3x higher response rate from top freelancers.
              </p>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex flex-col gap-4 p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2 text-xs">
                <a className="text-[#4c739a] hover:text-primary font-medium" href="#">Home</a>
                <span className="text-[#4c739a]">/</span>
                <span className="text-[#0d141b] dark:text-slate-200 font-bold">Search Jobs</span>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4c739a]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    <input
                      className="w-full h-12 pl-12 pr-4 border-none bg-white dark:bg-slate-900 rounded-xl focus:ring-2 focus:ring-primary/50 shadow-sm"
                      placeholder="Search for projects, skills or companies"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                  </div>
                </div>

                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full md:w-48 h-12 rounded-xl border-none bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/50 shadow-sm text-sm font-bold px-4"
                >
                  <option value="newest">Newest</option>
                  <option value="highest">Highest Budget</option>
                  <option value="relevance">Relevance</option>
                </select>
              </div>
            </div>

            {/* Job Listings */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#4c739a] dark:text-slate-400">Loading jobs...</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="group bg-white dark:bg-slate-900 border border-[#e7edf3] dark:border-slate-800 p-6 rounded-xl hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h3 className="text-lg md:text-xl font-bold text-[#0d141b] dark:text-white group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        <button
                          onClick={() => handleSaveJob(job.id)}
                          className={`flex items-center justify-center rounded-full h-10 w-10 border transition-colors ${
                            savedJobs.has(job.id)
                              ? 'border-red-500 bg-red-50 text-red-500'
                              : 'border-[#e7edf3] dark:border-slate-700 hover:text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill={savedJobs.has(job.id) ? 'currentColor' : 'none'} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#4c739a] dark:text-slate-400 mb-4">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                          </svg>
                          <span>{job.budgetType}: ${job.budget}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                          </svg>
                          <span>Posted {getTimeSince(job.createdAt)}</span>
                        </div>
                        {job.verified && (
                          <div className="flex items-center gap-1 text-green-600">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                            </svg>
                            <span>Payment Verified</span>
                          </div>
                        )}
                        {job.rating && (
                          <div className="flex items-center gap-1 text-orange-500">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                            <span>{job.rating} ({job.reviews} reviews)</span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills?.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-[#e7edf3] dark:bg-slate-800 rounded-full text-xs font-bold text-[#4c739a] dark:text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <span>{job.location || 'Remote'}</span>
                      </div>
                    </div>
                  ))}

                  {jobs.length === 0 && !loading && (
                    <div className="text-center py-12">
                      <svg className="w-20 h-20 mx-auto mb-4 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                      </svg>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No jobs found</h3>
                      <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters or search query</p>
                    </div>
                  )}

                  {jobs.length > 0 && (
                    <div className="flex items-center justify-center py-6">
                      <button className="flex items-center gap-2 px-8 py-3 bg-white dark:bg-slate-900 border border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm">
                        Load More Jobs
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}