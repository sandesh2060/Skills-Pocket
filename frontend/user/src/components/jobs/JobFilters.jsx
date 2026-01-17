// ============================================
// FILE: frontend/user/src/components/jobs/JobFilters.jsx
// ============================================
import React, { useState } from 'react';
import { JOB_CATEGORIES, EXPERIENCE_LEVELS, PROJECT_TYPES } from '../../utils/constants';

export default function JobFilters({ filters, onFilterChange, onReset }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleSkillToggle = (skill) => {
    const currentSkills = filters.skills || [];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    handleChange('skills', newSkills);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#e7edf3] dark:border-slate-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-[#0d141b] dark:text-white">Filters</h3>
        <button
          onClick={onReset}
          className="text-sm font-semibold text-primary hover:underline"
        >
          Reset All
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-[#0d141b] dark:text-white mb-3">
          Category
        </label>
        <select
          value={filters.category || ''}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all"
        >
          <option value="">All Categories</option>
          {JOB_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Experience Level */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-[#0d141b] dark:text-white mb-3">
          Experience Level
        </label>
        <div className="space-y-2">
          {EXPERIENCE_LEVELS.map((level) => (
            <label key={level.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="experienceLevel"
                value={level.value}
                checked={filters.experienceLevel === level.value}
                onChange={(e) => handleChange('experienceLevel', e.target.value)}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-sm text-[#4c739a] dark:text-slate-400 group-hover:text-[#0d141b] dark:group-hover:text-white transition-colors">
                {level.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Project Type */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-[#0d141b] dark:text-white mb-3">
          Project Type
        </label>
        <div className="space-y-2">
          {PROJECT_TYPES.map((type) => (
            <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="projectType"
                value={type.value}
                checked={filters.projectType === type.value}
                onChange={(e) => handleChange('projectType', e.target.value)}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-sm text-[#4c739a] dark:text-slate-400 group-hover:text-[#0d141b] dark:group-hover:text-white transition-colors">
                {type.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-[#0d141b] dark:text-white mb-3">
          Budget Range
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="number"
              placeholder="Min"
              value={filters.minBudget || ''}
              onChange={(e) => handleChange('minBudget', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxBudget || ''}
              onChange={(e) => handleChange('maxBudget', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none"
            />
          </div>
        </div>
      </div>

      {/* Expandable Skills Section */}
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-sm font-bold text-[#0d141b] dark:text-white mb-3"
        >
          <span>Required Skills</span>
          <svg
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
        </button>

        {isExpanded && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {['React', 'Node.js', 'Python', 'UI/UX Design', 'JavaScript', 'TypeScript', 'Figma', 'MongoDB'].map((skill) => (
              <label key={skill} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(filters.skills || []).includes(skill)}
                  onChange={() => handleSkillToggle(skill)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <span className="text-sm text-[#4c739a] dark:text-slate-400 group-hover:text-[#0d141b] dark:group-hover:text-white transition-colors">
                  {skill}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}