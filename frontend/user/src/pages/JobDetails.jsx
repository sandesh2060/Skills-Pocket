// ============================================
// FILE: frontend/user/src/pages/JobDetails.jsx
// ============================================
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import FreelancerNavbar from '../components/dashboard/freelancer/FreelancerNavbar';
import FreelancerSidebar from '../components/dashboard/freelancer/FreelancerSidebar';
import { getJobById } from '../api/jobApi';
import Loader from '../components/common/Loader';
import { formatMoney } from '../utils/formatters';
import { timeAgo } from '../utils/helpers';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await getJobById(id);
      
      if (response.success) {
        setJob(response.data);
      }
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <FreelancerSidebar />
        <div className="flex-1">
          <FreelancerNavbar />
          <Loader fullScreen text="Loading job details..." />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <FreelancerSidebar />
        <div className="flex-1">
          <FreelancerNavbar />
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Job Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This job may have been removed or doesn't exist
              </p>
              <Link to="/jobs" className="text-primary hover:underline">
                ← Back to Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <FreelancerSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <FreelancerNavbar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary mb-6"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Jobs
            </Link>

            {/* Job Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {job.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Posted {timeAgo(job.createdAt)}
                  </p>
                </div>
                <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  Submit Proposal
                </button>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">Budget:</span>
                  <span className="text-primary font-bold">
                    {formatMoney(job.budget?.min)} - {formatMoney(job.budget?.max)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">Type:</span>
                  <span className="capitalize">{job.projectType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">Duration:</span>
                  <span>{job.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">Experience:</span>
                  <span className="capitalize">{job.experienceLevel}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Description
              </h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Skills Required */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Skills Required
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Client Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                About the Client
              </h2>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full bg-cover bg-center"
                  style={{
                    backgroundImage: job.client?.profilePicture?.url
                      ? `url(${job.client.profilePicture.url})`
                      : `url(https://ui-avatars.com/api/?name=${job.client?.firstName}+${job.client?.lastName}&background=137fec&color=fff)`
                  }}
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {job.client?.firstName} {job.client?.lastName}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    {job.client?.rating?.toFixed(1) || '0.0'} ({job.client?.totalReviews || 0} reviews)
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
