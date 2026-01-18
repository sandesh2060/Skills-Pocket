// ============================================
// FILE: frontend/user/src/components/dashboard/freelancer/ActiveProposals.jsx
// ============================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import proposalService from '../../../services/proposalService';

export default function ActiveProposals() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await proposalService.getMyProposals({ 
        limit: 4, 
        status: 'pending' 
      });
      setProposals(response.data?.proposals || []);
    } catch (err) {
      console.error('Failed to fetch proposals:', err);
      setError('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (proposalId) => {
    if (!confirm('Are you sure you want to withdraw this proposal?')) return;

    try {
      await proposalService.withdrawProposal(proposalId);
      fetchProposals(); // Refresh list
    } catch (err) {
      alert('Failed to withdraw proposal');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600',
      accepted: 'bg-green-100 dark:bg-green-900/20 text-green-600',
      rejected: 'bg-red-100 dark:bg-red-900/20 text-red-600',
      withdrawn: 'bg-gray-100 dark:bg-gray-900/20 text-gray-600',
    };

    return (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (date) => {
    const now = new Date();
    const proposalDate = new Date(date);
    const diffTime = Math.abs(now - proposalDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-soft border border-[#e7edf3] dark:border-slate-800 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
        <button 
          onClick={() => navigate('/freelancer/proposals')}
          className="text-primary hover:text-primary-dark text-sm font-semibold"
        >
          View All
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {proposals.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No active proposals</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Start browsing jobs and submit your first proposal
          </p>
          <button 
            onClick={() => navigate('/freelancer/browse-jobs')}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark"
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div
              key={proposal._id}
              className="border border-[#e7edf3] dark:border-slate-800 rounded-lg p-4 hover:shadow-soft transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-base font-bold text-[#0d141b] dark:text-white mb-1">
                    {proposal.job?.title || 'Job Title'}
                  </h4>
                  <div className="flex items-center gap-3 text-sm text-[#4c739a] dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                      </svg>
                      {proposal.job?.client?.firstName || 'Client'}
                    </span>
                    <span>•</span>
                    <span>{formatDate(proposal.submittedAt)}</span>
                  </div>
                </div>
                {getStatusBadge(proposal.status)}
              </div>

              <p className="text-sm text-[#4c739a] dark:text-slate-400 mb-3 line-clamp-2">
                {proposal.coverLetter}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-[#e7edf3] dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                  </svg>
                  <span className="text-base font-bold text-[#0d141b] dark:text-white">
                    ${proposal.proposedBudget?.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => navigate(`/freelancer/proposals/${proposal._id}`)}
                    className="px-4 py-2 text-sm font-semibold text-[#4c739a] hover:text-[#0d141b] dark:hover:text-white transition-colors"
                  >
                    View Details
                  </button>
                  {proposal.status === 'pending' && (
                    <button 
                      onClick={() => handleWithdraw(proposal._id)}
                      className="px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}