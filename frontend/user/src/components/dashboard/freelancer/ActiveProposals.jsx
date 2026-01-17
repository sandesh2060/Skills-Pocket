// ============================================
// FILE: frontend/user/src/components/dashboard/freelancer/ActiveProposals.jsx
// ============================================
import React from 'react';

export default function ActiveProposals() {
  const proposals = [
    {
      id: 1,
      title: 'E-commerce Website Redesign',
      client: 'TechCorp Inc.',
      budget: '$3,500',
      status: 'pending',
      submittedDate: '2 days ago',
      description: 'Looking for a UI/UX designer to redesign our e-commerce platform...',
    },
    {
      id: 2,
      title: 'Mobile App UI Design',
      client: 'StartupXYZ',
      budget: '$2,800',
      status: 'interview',
      submittedDate: '5 days ago',
      description: 'Need a creative designer for our new fitness tracking app...',
    },
    {
      id: 3,
      title: 'Brand Identity Package',
      client: 'GreenLeaf Co.',
      budget: '$1,500',
      status: 'pending',
      submittedDate: '1 week ago',
      description: 'Complete brand identity including logo, colors, and guidelines...',
    },
    {
      id: 4,
      title: 'Dashboard Analytics Design',
      client: 'DataViz Solutions',
      budget: '$4,200',
      status: 'shortlisted',
      submittedDate: '3 days ago',
      description: 'Design modern analytics dashboard with data visualization...',
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600',
      interview: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600',
      shortlisted: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600',
    };

    return (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-soft border border-[#e7edf3] dark:border-slate-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#0d141b] dark:text-white mb-1">
            Active Proposals
          </h3>
          <p className="text-sm text-[#4c739a] dark:text-slate-400">
            {proposals.length} proposals awaiting response
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
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-base font-bold text-[#0d141b] dark:text-white mb-1">
                  {proposal.title}
                </h4>
                <div className="flex items-center gap-3 text-sm text-[#4c739a] dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                    {proposal.client}
                  </span>
                  <span>•</span>
                  <span>{proposal.submittedDate}</span>
                </div>
              </div>
              {getStatusBadge(proposal.status)}
            </div>

            <p className="text-sm text-[#4c739a] dark:text-slate-400 mb-3 line-clamp-2">
              {proposal.description}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-[#e7edf3] dark:border-slate-800">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
                <span className="text-base font-bold text-[#0d141b] dark:text-white">
                  {proposal.budget}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-sm font-semibold text-[#4c739a] hover:text-[#0d141b] dark:hover:text-white transition-colors">
                  View Details
                </button>
                <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-colors">
                  Message Client
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}