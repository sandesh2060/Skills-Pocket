// ============================================
// FILE: frontend/user/src/components/dashboard/freelancer/ProfileCompletion.jsx
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../../../services/userService';

export default function ProfileCompletion() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletion = () => {
    if (!profile) return { percentage: 0, tasks: [] };

    const tasks = [
      { 
        label: 'Add profile photo', 
        completed: !!profile.profilePicture,
        action: () => navigate('/freelancer/profile')
      },
      { 
        label: 'Write bio & description', 
        completed: !!profile.bio && profile.bio.length > 50,
        action: () => navigate('/freelancer/profile')
      },
      { 
        label: 'Add skills & expertise', 
        completed: profile.skills && profile.skills.length >= 3,
        action: () => navigate('/freelancer/profile')
      },
      { 
        label: 'Upload portfolio items', 
        completed: profile.portfolio && profile.portfolio.length > 0,
        action: () => navigate('/freelancer/profile')
      },
      { 
        label: 'Add work experience', 
        completed: profile.experience && profile.experience.length > 0,
        action: () => navigate('/freelancer/profile')
      },
      { 
        label: 'Set hourly rate', 
        completed: !!profile.hourlyRate && profile.hourlyRate > 0,
        action: () => navigate('/freelancer/profile')
      },
    ];

    const completedTasks = tasks.filter(task => task.completed).length;
    const percentage = Math.round((completedTasks / tasks.length) * 100);

    return { percentage, tasks, completedTasks };
  };

  const { percentage, tasks, completedTasks } = calculateCompletion();

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-soft border border-[#e7edf3] dark:border-slate-800 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
          <div className="h-3 bg-slate-200 rounded w-full mb-6"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-soft border border-[#e7edf3] dark:border-slate-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#0d141b] dark:text-white">
          Profile Completion
        </h3>
        <span className="text-2xl font-bold text-primary">
          {percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
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
              <button 
                onClick={task.action}
                className="text-xs text-primary hover:underline font-semibold"
              >
                Complete
              </button>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <button 
        onClick={() => navigate('/freelancer/profile')}
        className="w-full mt-6 bg-primary hover:bg-primary-dark text-white rounded-lg py-3 text-sm font-bold transition-colors"
      >
        Complete Your Profile
      </button>
    </div>
  );
}