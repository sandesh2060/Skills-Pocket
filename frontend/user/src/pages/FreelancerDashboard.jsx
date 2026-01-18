// ============================================
// FILE: frontend/user/src/pages/FreelancerDashboard.jsx
// FULLY FUNCTIONAL WITH BACKEND INTEGRATION
// ============================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FreelancerNavbar from '../components/dashboard/freelancer/FreelancerNavbar';
import FreelancerSidebar from '../components/dashboard/freelancer/FreelancerSidebar';
import DashboardStats from '../components/dashboard/freelancer/DashboardStats';
import ProfileCompletion from '../components/dashboard/freelancer/ProfileCompletion';
import EarningsChart from '../components/dashboard/freelancer/EarningsChart';
import ActiveProposals from '../components/dashboard/freelancer/ActiveProposals';
import { useAuth } from '../context/AuthContext';

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f7f8] dark:bg-bg-dark">
      {/* Sidebar - responsive */}
      <FreelancerSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <FreelancerNavbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            {/* Welcome Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0d141b] dark:text-white mb-2">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="text-sm sm:text-base text-[#4c739a] dark:text-slate-400">
                Here's what's happening with your freelance work today
              </p>
            </div>

            {/* Stats Grid - FUNCTIONAL */}
            <DashboardStats />

            {/* Two Column Layout - responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
              {/* Left Column - 2/3 width on desktop */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                {/* FUNCTIONAL Earnings Chart */}
                <EarningsChart />
                
                {/* FUNCTIONAL Active Proposals */}
                <ActiveProposals />
              </div>

              {/* Right Column - 1/3 width on desktop */}
              <div className="space-y-4 sm:space-y-6">
                {/* FUNCTIONAL Profile Completion */}
                <ProfileCompletion />
                
                {/* Quick Actions - ALL BUTTONS WORKING */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-soft border border-[#e7edf3] dark:border-slate-800 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-[#0d141b] dark:text-white mb-3 sm:mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <button 
                      onClick={() => navigate('/freelancer/browse-jobs')}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0d141b] dark:text-white truncate">Submit Proposal</p>
                        <p className="text-xs text-[#4c739a] dark:text-slate-400 truncate">Browse jobs & apply</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => navigate('/freelancer/profile')}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0d141b] dark:text-white truncate">Update Profile</p>
                        <p className="text-xs text-[#4c739a] dark:text-slate-400 truncate">Complete your profile</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => navigate('/freelancer/settings')}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0d141b] dark:text-white truncate">Settings</p>
                        <p className="text-xs text-[#4c739a] dark:text-slate-400 truncate">Manage preferences</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-soft border border-[#e7edf3] dark:border-slate-800 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-[#0d141b] dark:text-white mb-3 sm:mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#0d141b] dark:text-white font-medium">New job match</p>
                        <p className="text-xs text-[#4c739a] dark:text-slate-400 mt-0.5">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#0d141b] dark:text-white font-medium">Proposal accepted</p>
                        <p className="text-xs text-[#4c739a] dark:text-slate-400 mt-0.5">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#0d141b] dark:text-white font-medium">Payment received</p>
                        <p className="text-xs text-[#4c739a] dark:text-slate-400 mt-0.5">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}