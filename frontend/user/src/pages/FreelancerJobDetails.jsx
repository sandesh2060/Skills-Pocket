// ============================================
// FILE: frontend/user/src/pages/FreelancerJobDetails.jsx
// UPDATED VERSION - With "Message Client" Feature
// ============================================
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import FreelancerNavbar from '../components/dashboard/freelancer/FreelancerNavbar';
import FreelancerSidebar from '../components/dashboard/freelancer/FreelancerSidebar';
import { getJobById } from '../api/jobApi';
import { submitProposal, getMyProposals } from '../api/proposalApi';
import { getOrCreateConversation } from '../api/messageApi';

export default function FreelancerJobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasProposal, setHasProposal] = useState(false);
  const [messagingClient, setMessagingClient] = useState(false);
  const [proposal, setProposal] = useState({
    coverLetter: '',
    proposedBudget: '',
    estimatedDuration: '',
  });

  useEffect(() => {
    fetchJobDetails();
    checkExistingProposal();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await getJobById(id);
      
      if (response.success) {
        setJob(response.data.job);
        // Set initial budget from job
        if (response.data.job.budget) {
          const avgBudget = (response.data.job.budget.min + response.data.job.budget.max) / 2;
          setProposal(prev => ({ ...prev, proposedBudget: avgBudget }));
        }
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job details');
      navigate('/freelancer/browse-jobs');
    } finally {
      setLoading(false);
    }
  };

  const checkExistingProposal = async () => {
    try {
      const response = await getMyProposals({ page: 1, limit: 100 });
      if (response.success) {
        const existing = response.data.proposals.find(p => p.job._id === id);
        setHasProposal(!!existing);
      }
    } catch (error) {
      console.error('Error checking proposals:', error);
    }
  };

  const handleMessageClient = async () => {
    if (!job?.client?._id) {
      toast.error('Client information not available');
      return;
    }

    try {
      setMessagingClient(true);
      
      // Get or create conversation with this client
      const response = await getOrCreateConversation(job.client._id);
      
      if (response.success) {
        // Navigate to messages page with conversation ID
        navigate(`/freelancer/messages?conversation=${response.data.conversation._id}`);
        toast.success('Opening conversation with client...');
      }
    } catch (error) {
      console.error('Error opening conversation:', error);
      toast.error(error.message || 'Failed to open conversation');
    } finally {
      setMessagingClient(false);
    }
  };

  const handleSubmitProposal = async () => {
    // Validation
    if (!proposal.coverLetter.trim()) {
      toast.error('Please write a cover letter');
      return;
    }
    if (!proposal.proposedBudget || proposal.proposedBudget <= 0) {
      toast.error('Please enter a valid budget');
      return;
    }
    if (!proposal.estimatedDuration.trim()) {
      toast.error('Please enter estimated duration');
      return;
    }

    try {
      setSubmitting(true);
      const response = await submitProposal({
        jobId: id,
        coverLetter: proposal.coverLetter,
        proposedBudget: parseFloat(proposal.proposedBudget),
        estimatedDuration: proposal.estimatedDuration,
      });

      if (response.success) {
        toast.success('Proposal submitted successfully!');
        setShowProposalModal(false);
        setHasProposal(true);
        // Update job proposal count
        setJob(prev => ({ ...prev, proposalCount: (prev.proposalCount || 0) + 1 }));
      }
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast.error(error.message || 'Failed to submit proposal');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatBudget = (budget) => {
    if (!budget) return 'N/A';
    if (budget.min === budget.max) {
      return `$${budget.min.toLocaleString()}`;
    }
    return `$${budget.min.toLocaleString()} - $${budget.max.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-[#f6f7f8] dark:bg-bg-dark">
        <FreelancerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <FreelancerNavbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-[#4c739a] dark:text-slate-400">Loading job details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f7f8] dark:bg-bg-dark">
      <FreelancerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <FreelancerNavbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Breadcrumb */}
            <div className="mb-4">
              <button
                onClick={() => navigate('/freelancer/browse-jobs')}
                className="flex items-center gap-2 text-[#4c739a] dark:text-slate-400 hover:text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Browse Jobs
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Job Header */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-[#0d141b] dark:text-white mb-3">
                        {job.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-[#4c739a] dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                          {job.client?.company || 'Remote'}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                          </svg>
                          Posted {formatDate(job.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                          </svg>
                          {job.proposalCount || 0} proposal{job.proposalCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                      {job.category}
                    </span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                      {job.projectType === 'fixed' ? 'Fixed Price' : 'Hourly Rate'}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium capitalize">
                      {job.experienceLevel} Level
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800">
                  <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-4">Job Description</h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-[#4c739a] dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                </div>

                {/* Skills Required */}
                {job.skills && job.skills.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800">
                    <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-4">Skills Required</h2>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {job.attachments && job.attachments.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800">
                    <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-4">Attachments</h2>
                    <div className="space-y-2">
                      {job.attachments.map((file, index) => (
                        <a
                          key={index}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                          </svg>
                          <span className="text-[#0d141b] dark:text-white font-medium">
                            {file.fileName || `Attachment ${index + 1}`}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* About Client */}
                {job.client && (
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800">
                    <h2 className="text-xl font-bold text-[#0d141b] dark:text-white mb-4">About the Client</h2>
                    <div className="flex items-start gap-4">
                      {job.client.profilePicture ? (
                        <img
                          src={job.client.profilePicture}
                          alt={`${job.client.firstName} ${job.client.lastName}`}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                          {job.client.firstName?.[0]}{job.client.lastName?.[0]}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#0d141b] dark:text-white mb-1">
                          {job.client.firstName} {job.client.lastName}
                        </h3>
                        <p className="text-sm text-[#4c739a] dark:text-slate-400 mb-2">
                          {job.client.company || 'Client'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-[#4c739a] dark:text-slate-400 mb-3">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                            {job.client.rating?.toFixed(1) || '0.0'} rating
                          </span>
                        </div>
                        
                        {/* Message Client Button in About Section */}
                        <button
                          onClick={handleMessageClient}
                          disabled={messagingClient}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {messagingClient ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Opening...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              Message Client
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Action Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-[#e7edf3] dark:border-slate-800 sticky top-6">
                  {/* Budget */}
                  <div className="mb-6">
                    <p className="text-sm text-[#4c739a] dark:text-slate-400 mb-1">
                      {job.projectType === 'fixed' ? 'Budget' : 'Hourly Rate'}
                    </p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {formatBudget(job.budget)}
                    </p>
                  </div>

                  {/* Duration */}
                  <div className="mb-6 pb-6 border-b border-[#e7edf3] dark:border-slate-800">
                    <p className="text-sm text-[#4c739a] dark:text-slate-400 mb-1">Project Duration</p>
                    <p className="text-lg font-semibold text-[#0d141b] dark:text-white">{job.duration}</p>
                  </div>

                  {/* CTA Buttons */}
                  {job.status === 'open' && (
                    <div className="space-y-3">
                      {hasProposal ? (
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <svg className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                            Proposal Submitted
                          </p>
                          <button
                            onClick={() => navigate('/freelancer/proposals')}
                            className="mt-3 text-sm text-primary hover:underline"
                          >
                            View My Proposals
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowProposalModal(true)}
                          className="w-full px-6 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                        >
                          Submit Proposal
                        </button>
                      )}
                      
                      {/* Message Client Button in Sidebar */}
                      <button
                        onClick={handleMessageClient}
                        disabled={messagingClient}
                        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {messagingClient ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Opening Conversation...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Message Client
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {job.status !== 'open' && (
                    <div className="text-center p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <p className="text-sm font-semibold text-[#4c739a] dark:text-slate-400 capitalize">
                        Job {job.status.replace('_', ' ')}
                      </p>
                    </div>
                  )}

                  {/* Job Stats */}
                  <div className="mt-6 pt-6 border-t border-[#e7edf3] dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#4c739a] dark:text-slate-400">Proposals</span>
                      <span className="font-semibold text-[#0d141b] dark:text-white">
                        {job.proposalCount || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#4c739a] dark:text-slate-400">Job Views</span>
                      <span className="font-semibold text-[#0d141b] dark:text-white">
                        {job.views || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#4c739a] dark:text-slate-400">Posted</span>
                      <span className="font-semibold text-[#0d141b] dark:text-white">
                        {formatDate(job.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Proposal Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#e7edf3] dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#0d141b] dark:text-white">Submit Proposal</h2>
                <button
                  onClick={() => setShowProposalModal(false)}
                  className="text-[#4c739a] hover:text-[#0d141b] dark:hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-semibold text-[#0d141b] dark:text-white mb-2">
                  Cover Letter <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={proposal.coverLetter}
                  onChange={(e) => setProposal({ ...proposal, coverLetter: e.target.value })}
                  rows={8}
                  maxLength={2000}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Explain why you're the best fit for this job..."
                />
                <p className="text-sm text-[#4c739a] dark:text-slate-400 mt-1 text-right">
                  {proposal.coverLetter.length}/2000 characters
                </p>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-semibold text-[#0d141b] dark:text-white mb-2">
                  Your Proposed {job.projectType === 'fixed' ? 'Budget' : 'Hourly Rate'} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4c739a] dark:text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    value={proposal.proposedBudget}
                    onChange={(e) => setProposal({ ...proposal, proposedBudget: e.target.value })}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-[#4c739a] dark:text-slate-400 mt-1">
                  Client's budget: {formatBudget(job.budget)}
                </p>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-[#0d141b] dark:text-white mb-2">
                  Estimated Duration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={proposal.estimatedDuration}
                  onChange={(e) => setProposal({ ...proposal, estimatedDuration: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0d141b] dark:text-white outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g., 2 weeks, 1 month"
                />
              </div>

              {/* Tips */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Tips for a great proposal:</h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Highlight relevant experience and skills</li>
                  <li>• Explain your approach to the project</li>
                  <li>• Be realistic with budget and timeline</li>
                  <li>• Show enthusiasm for the opportunity</li>
                </ul>
              </div>
            </div>

            <div className="p-6 border-t border-[#e7edf3] dark:border-slate-800 flex gap-3 justify-end sticky bottom-0 bg-white dark:bg-slate-900">
              <button
                onClick={() => setShowProposalModal(false)}
                disabled={submitting}
                className="px-6 py-3 border border-slate-300 dark:border-slate-700 text-[#0d141b] dark:text-white rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitProposal}
                disabled={submitting}
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Proposal'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}