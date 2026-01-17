
// ============================================
// FILE: frontend/user/src/components/dashboard/client/NewProposals.jsx
// ============================================
import React, { useState } from 'react';

export default function NewProposals() {
  const [proposals] = useState([
    {
      id: 1,
      jobTitle: 'E-commerce Platform Development',
      freelancer: {
        name: 'Alex Turner',
        avatar: 'https://ui-avatars.com/api/?name=Alex+Turner&background=6366f1&color=fff',
        rating: 4.9,
        completedJobs: 47,
      },
      proposedBudget: '$4,200',
      deliveryTime: '3 weeks',
      coverLetter: "I've built 15+ e-commerce platforms with React and Node.js. I can deliver a scalable solution with payment integration...",
      submittedAt: '2 hours ago',
    },
    {
      id: 2,
      jobTitle: 'Marketing Campaign Design',
      freelancer: {
        name: 'Emma Wilson',
        avatar: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=ec4899&color=fff',
        rating: 5.0,
        completedJobs: 89,
      },
      proposedBudget: '$1,800',
      deliveryTime: '1 week',
      coverLetter: "With 5+ years in digital marketing design, I can create engaging visuals that convert. My portfolio includes campaigns for Fortune 500 companies...",
      submittedAt: '5 hours ago',
    },
    {
      id: 3,
      jobTitle: 'Mobile App UI/UX Design',
      freelancer: {
        name: 'David Chen',
        avatar: 'https://ui-avatars.com/api/?name=David+Chen&background=f59e0b&color=fff',
        rating: 4.8,
        completedJobs: 62,
      },
      proposedBudget: '$2,500',
      deliveryTime: '2 weeks',
      coverLetter: "I specialize in creating intuitive mobile experiences. I'll provide wireframes, high-fidelity mockups, and interactive prototypes...",
      submittedAt: '1 day ago',
    },
  ]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 border border-[#e7edf3] dark:border-slate-800 shadow-soft">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0d141b] dark:text-white mb-1">
            New Proposals
          </h3>
          <p className="text-xs sm:text-sm text-[#4c739a] dark:text-slate-400">
            {proposals.length} freelancers interested in your projects
          </p>
        </div>
        <button className="text-primary hover:text-primary-dark text-sm font-semibold">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {proposals.map((proposal) => (
          <div
            key={proposal.id}
            className="border border-[#e7edf3] dark:border-slate-800 rounded-lg p-4 hover:shadow-soft transition-shadow"
          >
            {/* Job Title */}
            <h4 className="text-sm sm:text-base font-bold text-[#0d141b] dark:text-white mb-3">
              {proposal.jobTitle}
            </h4>

            {/* Freelancer Info */}
            <div className="flex items-start gap-3 mb-3">
              <img
                src={proposal.freelancer.avatar}
                alt={proposal.freelancer.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm sm:text-base text-[#0d141b] dark:text-white truncate">
                  {proposal.freelancer.name}
                </p>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-[#4c739a] dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    {proposal.freelancer.rating}
                  </span>
                  <span>•</span>
                  <span>{proposal.freelancer.completedJobs} jobs completed</span>
                </div>
              </div>
            </div>

            {/* Cover Letter Preview */}
            <p className="text-sm text-[#4c739a] dark:text-slate-400 mb-3 line-clamp-2">
              {proposal.coverLetter}
            </p>

            {/* Proposal Details */}
            <div className="flex items-center gap-4 mb-3 text-xs sm:text-sm">
              <div className="flex items-center gap-1 text-[#0d141b] dark:text-white">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
                <span className="font-bold">{proposal.proposedBudget}</span>
              </div>
              <div className="flex items-center gap-1 text-[#4c739a] dark:text-slate-400">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                <span>{proposal.deliveryTime}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#e7edf3] dark:border-slate-800">
              <span className="text-xs text-[#4c739a] dark:text-slate-400">
                {proposal.submittedAt}
              </span>
              <div className="flex items-center gap-2">
                <button className="px-3 sm:px-4 py-2 text-sm font-semibold text-[#4c739a] hover:text-[#0d141b] dark:hover:text-white transition-colors">
                  Decline
                </button>
                <button className="px-3 sm:px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-colors">
                  Review
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
