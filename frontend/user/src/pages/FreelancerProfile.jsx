
// ============================================
// FILE: frontend/user/src/pages/FreelancerProfile.jsx
// ============================================
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FreelancerNavbar from '../components/dashboard/freelancer/FreelancerNavbar';
import FreelancerSidebar from '../components/dashboard/freelancer/FreelancerSidebar';

export default function FreelancerProfile() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    title: 'Full Stack Developer',
    bio: 'Passionate developer with 5+ years of experience building web applications.',
    hourlyRate: 50,
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
  });

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f7f8] dark:bg-bg-dark">
      <FreelancerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <FreelancerNavbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Profile Header */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800 mb-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                  </button>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-[#0d141b] dark:text-white mb-1">
                    {formData.firstName} {formData.lastName}
                  </h1>
                  <p className="text-[#4c739a] dark:text-slate-400 mb-3">{formData.title}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                      ))}
                      <span className="ml-2 text-sm font-semibold">4.9 (45 reviews)</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(!editing)}
                  className="px-4 py-2 border border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
                >
                  {editing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {/* About */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800 mb-6">
              <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-4">About</h2>
              {editing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                  rows="4"
                />
              ) : (
                <p className="text-[#4c739a] dark:text-slate-400">{formData.bio}</p>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800 mb-6">
              <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span key={index} className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-semibold">
                    {skill}
                  </span>
                ))}
                {editing && (
                  <button className="px-4 py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 text-[#4c739a] rounded-lg font-semibold hover:border-primary hover:text-primary">
                    + Add Skill
                  </button>
                )}
              </div>
            </div>

            {/* Hourly Rate */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800">
              <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-4">Hourly Rate</h2>
              {editing ? (
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-[#0d141b] dark:text-white">$</span>
                  <input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                    className="w-32 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white font-bold text-2xl outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-[#4c739a] dark:text-slate-400">/hour</span>
                </div>
              ) : (
                <p className="text-3xl font-bold text-[#0d141b] dark:text-white">
                  ${formData.hourlyRate} <span className="text-lg text-[#4c739a] dark:text-slate-400 font-normal">/hour</span>
                </p>
              )}
              
              {editing && (
                <div className="mt-6 flex gap-3">
                  <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-6 py-3 border border-slate-300 dark:border-slate-700 text-[#0d141b] dark:text-white rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}