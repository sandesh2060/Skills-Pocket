
// ============================================
// FILE: frontend/user/src/components/jobs/JobDetails.jsx
// ============================================
import React, { useState } from 'react';
import { formatCurrency, formatRelativeTime, formatDate } from '../../utils/helpers';

export default function JobDetails({ job, onApply, isApplied = false }) {
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalData, setProposalData] = useState({
    coverLetter: '',
    proposedBudget: '',
    proposedDuration: '',
  });

  if (!job) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#e7edf3] dark:border-slate-800 p-8 text-center">
        <p className="text-[#4c739a] dark:text-slate-400">Job not found</p>
      </div>
    );
  }

  const {
    title,
    description,
    category,
    skills,
    budget,
    duration,
    experienceLevel,
    projectType,
    client,
    proposalCount,
    views,
    createdAt,
    attachments,
  } = job;

  const handleSubmitProposal = (e) => {
    e.preventDefault();
    onApply(proposalData);
    setShowProposalModal(false);
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#e7edf3] dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-[#e7edf3] dark:border-slate-800">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#0d141b] dark:text-white mb-3">
                {title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#4c739a] dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                  </svg>
                  {category}
                </span>
                
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  {client?.location || 'Remote'}
                </span>
                
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                  {views || 0} views
                </span>
                
                <span>•</span>
                <span>Posted {formatRelativeTime(createdAt)}</span>
              </div>
            </div>

            {!isApplied ? (
              <button
                onClick={() => setShowProposalModal(true)}
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
                Submit Proposal
              </button>
            ) : (
              <div className="px-6 py-3 bg-green-100 dark:bg-green-900/20 text-green-600 font-bold rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Applied
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mt-6">
            <div>
              <p className="text-xs text-[#4c739a] dark:text-slate-400 mb-1">Budget</p>
              <p className="text-xl font-bold text-[#0d141b] dark:text-white">
                {formatCurrency(budget.min)} - {formatCurrency(budget.max)}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-[#4c739a] dark:text-slate-400 mb-1">Project Type</p>
              <p className="text-xl font-bold text-[#0d141b] dark:text-white capitalize">
                {projectType === 'fixed' ? 'Fixed Price' : 'Hourly'}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-[#4c739a] dark:text-slate-400 mb-1">Experience</p>
              <p className="text-xl font-bold text-[#0d141b] dark:text-white capitalize">
                {experienceLevel}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-[#4c739a] dark:text-slate-400 mb-1">Proposals</p>
              <p className="text-xl font-bold text-[#0d141b] dark:text-white">
                {proposalCount || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-8 border-b border-[#e7edf3] dark:border-slate-800">
          <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-4">
            Job Description
          </h2>
          <div className="text-[#4c739a] dark:text-slate-400 leading-relaxed whitespace-pre-line">
            {description}
          </div>
        </div>

        {/* Skills */}
        <div className="p-8 border-b border-[#e7edf3] dark:border-slate-800">
          <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-4">
            Required Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-lg"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Client Info */}
        <div className="p-8">
          <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-4">
            About the Client
          </h2>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
              {client?.firstName?.charAt(0)}{client?.lastName?.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#0d141b] dark:text-white mb-1">
                {client?.firstName} {client?.lastName}
              </h3>
              <div className="flex items-center gap-4 text-sm text-[#4c739a] dark:text-slate-400 mb-3">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  {client?.rating || 0}/5
                </span>
                <span>•</span>
                <span>{client?.completedJobs || 0} jobs posted</span>
                <span>•</span>
                <span>Member since {formatDate(client?.createdAt)}</span>
              </div>
              <p className="text-sm text-[#4c739a] dark:text-slate-400">
                {client?.bio || 'No bio available'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowProposalModal(false)} />
          
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full">
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Submit Proposal
                </h3>
                <button onClick={() => setShowProposalModal(false)} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmitProposal} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    value={proposalData.coverLetter}
                    onChange={(e) => setProposalData({...proposalData, coverLetter: e.target.value})}
                    rows={6}
                    required
                    placeholder="Explain why you're the best fit for this job..."
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Your Bid ($)
                    </label>
                    <input
                      type="number"
                      value={proposalData.proposedBudget}
                      onChange={(e) => setProposalData({...proposalData, proposedBudget: e.target.value})}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={proposalData.proposedDuration}
                      onChange={(e) => setProposalData({...proposalData, proposedDuration: e.target.value})}
                      required
                      placeholder="e.g., 2 weeks"
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowProposalModal(false)}
                    className="px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg"
                  >
                    Submit Proposal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}