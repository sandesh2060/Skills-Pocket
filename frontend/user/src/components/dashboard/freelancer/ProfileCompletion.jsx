// ============================================
// FILE: frontend/user/src/components/dashboard/freelancer/ProfileCompletion.jsx
// ============================================
import React from 'react';

export default function ProfileCompletion() {
  const completionPercentage = 75;
  
  const tasks = [
    { label: 'Add profile photo', completed: true },
    { label: 'Write bio & description', completed: true },
    { label: 'Add skills & expertise', completed: true },
    { label: 'Upload portfolio items', completed: false },
    { label: 'Add certifications', completed: false },
    { label: 'Set hourly rate', completed: true },
  ];

  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-soft border border-[#e7edf3] dark:border-slate-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#0d141b] dark:text-white">
          Profile Completion
        </h3>
        <span className="text-2xl font-bold text-primary">
          {completionPercentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-[#4c739a] dark:text-slate-400 mt-2">
          {completedTasks} of {tasks.length} tasks completed
        </p>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                task.completed
                  ? 'bg-primary border-primary'
                  : 'border-slate-300 dark:border-slate-600'
              }`}
            >
              {task.completed && (
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              )}
            </div>
            <span
              className={`text-sm flex-1 ${
                task.completed
                  ? 'text-[#4c739a] dark:text-slate-400 line-through'
                  : 'text-[#0d141b] dark:text-white font-medium'
              }`}
            >
              {task.label}
            </span>
            {!task.completed && (
              <button className="text-xs text-primary hover:underline font-semibold">
                Complete
              </button>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <button className="w-full mt-6 bg-primary hover:bg-primary-dark text-white rounded-lg py-3 text-sm font-bold transition-colors">
        Complete Your Profile
      </button>
    </div>
  );
}