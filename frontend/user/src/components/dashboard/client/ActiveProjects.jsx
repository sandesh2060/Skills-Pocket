// ============================================
// FILE: frontend/user/src/components/dashboard/client/ActiveProjects.jsx
// ============================================
import React, { useState } from 'react';

export default function ActiveProjects() {
  const [projects] = useState([
    {
      id: 1,
      title: 'Website Redesign Project',
      freelancer: {
        name: 'John Doe',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=137fec&color=fff',
        rating: 4.9,
      },
      status: 'in_progress',
      progress: 65,
      budget: '$2,500',
      deadline: 'Dec 30, 2024',
      description: 'Complete redesign of company website with modern UI/UX',
    },
    {
      id: 2,
      title: 'Mobile App Development',
      freelancer: {
        name: 'Sarah Smith',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=10b981&color=fff',
        rating: 5.0,
      },
      status: 'in_progress',
      progress: 45,
      budget: '$5,800',
      deadline: 'Jan 15, 2025',
      description: 'iOS and Android app for customer engagement',
    },
    {
      id: 3,
      title: 'Brand Identity Design',
      freelancer: {
        name: 'Mike Johnson',
        avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=f59e0b&color=fff',
        rating: 4.8,
      },
      status: 'review',
      progress: 90,
      budget: '$1,200',
      deadline: 'Dec 20, 2024',
      description: 'Logo, color palette, and brand guidelines',
    },
  ]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      in_progress: {
        label: 'In Progress',
        className: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
      },
      review: {
        label: 'In Review',
        className: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
      },
      completed: {
        label: 'Completed',
        className: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
      },
    };

    const config = statusConfig[status] || statusConfig.in_progress;

    return (
      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-[#e7edf3] dark:border-slate-800 shadow-soft">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-[#0d141b] dark:text-white">
          Active Projects
        </h3>
        <button className="text-primary hover:text-primary-dark text-sm font-semibold">
          View All
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-colors"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <h4 className="font-semibold text-sm sm:text-base text-[#0d141b] dark:text-white">
                {project.title}
              </h4>
              {getStatusBadge(project.status)}
            </div>

            {/* Freelancer Info */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={project.freelancer.avatar}
                alt={project.freelancer.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0d141b] dark:text-white truncate">
                  {project.freelancer.name}
                </p>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  <span className="text-xs text-[#4c739a] dark:text-slate-400">
                    {project.freelancer.rating}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-[#4c739a] dark:text-slate-400 mb-3 line-clamp-2">
              {project.description}
            </p>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-[#4c739a] dark:text-slate-400 mb-1">
                <span>Progress</span>
                <span className="font-semibold">{project.progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-4 text-xs sm:text-sm text-[#4c739a] dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                  <span className="hidden sm:inline">Due:</span> {project.deadline}
                </span>
                <span className="font-semibold text-[#0d141b] dark:text-white">
                  {project.budget}
                </span>
              </div>
              <button className="px-3 sm:px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}