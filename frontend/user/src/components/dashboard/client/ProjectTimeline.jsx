// ============================================
// FILE: frontend/user/src/components/dashboard/client/ProjectTimeline.jsx
// ============================================
import React from 'react';

export default function ProjectTimeline() {
  const events = [
    {
      id: 1,
      type: 'milestone',
      title: 'Project Milestone Completed',
      description: 'Website redesign phase 1 delivered by John Doe',
      time: '2 hours ago',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      ),
      iconBg: 'bg-green-500',
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Released',
      description: '$1,250 released to Sarah Smith for mobile app development',
      time: '5 hours ago',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
        </svg>
      ),
      iconBg: 'bg-blue-500',
    },
    {
      id: 3,
      type: 'proposal',
      title: 'New Proposal Received',
      description: 'Alex Turner submitted proposal for e-commerce project',
      time: '1 day ago',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
      ),
      iconBg: 'bg-purple-500',
    },
    {
      id: 4,
      type: 'message',
      title: 'New Message',
      description: 'Mike Johnson sent you a message about brand guidelines',
      time: '2 days ago',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
        </svg>
      ),
      iconBg: 'bg-orange-500',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-[#e7edf3] dark:border-slate-800 shadow-soft">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-[#0d141b] dark:text-white">
          Recent Activity
        </h3>
        <button className="text-primary hover:text-primary-dark text-sm font-semibold">
          View All
        </button>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {events.map((event, index) => (
          <div key={event.id} className="flex gap-3 sm:gap-4 relative">
            {/* Timeline Line */}
            {index !== events.length - 1 && (
              <div className="absolute left-[18px] sm:left-[22px] top-12 bottom-0 w-[2px] bg-slate-200 dark:bg-slate-700" />
            )}

            {/* Icon */}
            <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full ${event.iconBg} flex items-center justify-center text-white flex-shrink-0 relative z-10`}>
              {event.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pb-2">
              <h4 className="text-sm sm:text-base font-semibold text-[#0d141b] dark:text-white mb-1">
                {event.title}
              </h4>
              <p className="text-xs sm:text-sm text-[#4c739a] dark:text-slate-400 mb-2">
                {event.description}
              </p>
              <span className="text-xs text-[#4c739a] dark:text-slate-400">
                {event.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}