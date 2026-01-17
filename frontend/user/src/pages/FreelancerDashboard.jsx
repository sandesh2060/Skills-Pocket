// ============================================
// FILE: frontend/user/src/pages/FreelancerDashboard.jsx
// ============================================
import { useState } from 'react';
import FreelancerNavbar from '../components/dashboard/freelancer/FreelancerNavbar';
import FreelancerSidebar from '../components/dashboard/freelancer/FreelancerSidebar';
import DashboardStats from '../components/dashboard/freelancer/DashboardStats';
import ProfileCompletion from '../components/dashboard/freelancer/ProfileCompletion';
import EarningsChart from '../components/dashboard/freelancer/EarningsChart';
import ActiveProposals from '../components/dashboard/freelancer/ActiveProposals';
import { useAuth } from '../context/AuthContext';

export default function FreelancerDashboard() {
  const { user } = useAuth();
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

            {/* Stats Grid */}
            <DashboardStats />

            {/* Two Column Layout - responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
              {/* Left Column - 2/3 width on desktop */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <EarningsChart />
                <ActiveProposals />
              </div>

              {/* Right Column - 1/3 width on desktop */}
              <div className="space-y-4 sm:space-y-6">
                <ProfileCompletion />
                
                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-soft border border-[#e7edf3] dark:border-slate-800 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-[#0d141b] dark:text-white mb-3 sm:mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
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

                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0d141b] dark:text-white truncate">Update Availability</p>
                        <p className="text-xs text-[#4c739a] dark:text-slate-400 truncate">Set your work hours</p>
                      </div>
                    </button>

                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0d141b] dark:text-white truncate">Get Help</p>
                        <p className="text-xs text-[#4c739a] dark:text-slate-400 truncate">Contact support</p>
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
