
// ============================================
// FILE: frontend/user/src/components/jobs/JobCard.jsx
// ============================================
import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers';

export default function JobCard({ job }) {
  const {
    _id,
    title,
    description,
    category,
    skills,
    budget,
    duration,
    experienceLevel,
    projectType,
    client,
    proposalCount,
    createdAt,
  } = job;

  const getExperienceBadge = (level) => {
    const styles = {
      entry: 'bg-green-100 dark:bg-green-900/20 text-green-600',
      intermediate: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600',
      expert: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600',
    };
    
    const labels = {
      entry: 'Entry Level',
      intermediate: 'Intermediate',
      expert: 'Expert',
    };

    return (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[level]}`}>
        {labels[level]}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#e7edf3] dark:border-slate-800 p-6 hover:shadow-card transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link 
            to={`/jobs/${_id}`}
            className="text-xl font-bold text-[#0d141b] dark:text-white hover:text-primary transition-colors inline-block mb-2"
          >
            {title}
          </Link>
          
          <div className="flex items-center gap-3 text-sm text-[#4c739a] dark:text-slate-400">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
              </svg>
              {category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              {client?.location || 'Remote'}
            </span>
            <span>•</span>
            <span>{formatRelativeTime(createdAt)}</span>
          </div>
        </div>
        
        {getExperienceBadge(experienceLevel)}
      </div>

      {/* Description */}
      <p className="text-[#4c739a] dark:text-slate-400 text-sm mb-4 line-clamp-3">
        {description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {skills.slice(0, 5).map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full"
          >
            {skill}
          </span>
        ))}
        {skills.length > 5 && (
          <span className="px-3 py-1 text-primary text-xs font-medium">
            +{skills.length - 5} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#e7edf3] dark:border-slate-800">
        <div className="flex items-center gap-6">
          {/* Budget */}
          <div>
            <p className="text-xs text-[#4c739a] dark:text-slate-400 mb-1">Budget</p>
            <p className="text-lg font-bold text-[#0d141b] dark:text-white">
              {formatCurrency(budget.min)} - {formatCurrency(budget.max)}
            </p>
          </div>

          {/* Project Type */}
          <div>
            <p className="text-xs text-[#4c739a] dark:text-slate-400 mb-1">Type</p>
            <p className="text-sm font-semibold text-[#0d141b] dark:text-white capitalize">
              {projectType === 'fixed' ? 'Fixed Price' : 'Hourly'}
            </p>
          </div>

          {/* Duration */}
          <div>
            <p className="text-xs text-[#4c739a] dark:text-slate-400 mb-1">Duration</p>
            <p className="text-sm font-semibold text-[#0d141b] dark:text-white">
              {duration}
            </p>
          </div>
        </div>

        {/* Proposals Count */}
        <div className="flex items-center gap-2 text-sm text-[#4c739a] dark:text-slate-400">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
          <span className="font-medium">{proposalCount || 0} proposals</span>
        </div>
      </div>
    </div>
  );
}