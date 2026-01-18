// ============================================
// FILE: frontend/user/src/api/jobApi.js
// FIXED - Prevents infinite retries on network errors
// ============================================
import { userApi } from './axios';

// Track failed requests to prevent infinite retries
const failedRequests = new Map();
const MAX_RETRIES = 2;
const RETRY_DELAY = 10000; // 10 seconds

/**
 * Check if we should skip request due to recent failures
 */
const shouldSkipRequest = (key) => {
  const lastFailure = failedRequests.get(key);
  if (!lastFailure) return false;
  
  const { count, timestamp } = lastFailure;
  const timeSinceFailure = Date.now() - timestamp;
  
  // If we've hit max retries and it's been less than RETRY_DELAY, skip
  if (count >= MAX_RETRIES && timeSinceFailure < RETRY_DELAY) {
    return true;
  }
  
  // Reset if enough time has passed
  if (timeSinceFailure >= RETRY_DELAY) {
    failedRequests.delete(key);
    return false;
  }
  
  return false;
};

/**
 * Record a failed request
 */
const recordFailure = (key) => {
  const existing = failedRequests.get(key);
  failedRequests.set(key, {
    count: existing ? existing.count + 1 : 1,
    timestamp: Date.now()
  });
};

/**
 * Clear failure record on success
 */
const clearFailure = (key) => {
  failedRequests.delete(key);
};

/**
 * Wrapper for API calls with retry prevention
 */
const apiCallWithRetryPrevention = async (requestKey, apiCall) => {
  // Skip if we've recently failed multiple times
  if (shouldSkipRequest(requestKey)) {
    console.log(`⏭️ Skipping ${requestKey} - too many recent failures`);
    return {
      success: false,
      data: null,
      message: 'Request skipped due to recent failures',
      skipped: true
    };
  }
  
  try {
    const result = await apiCall();
    clearFailure(requestKey);
    return result;
  } catch (error) {
    // Only record network errors
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      recordFailure(requestKey);
      const failureCount = failedRequests.get(requestKey)?.count || 1;
      console.log(`⚠️ Network error in ${requestKey} (attempt ${failureCount}/${MAX_RETRIES})`);
    }
    throw error;
  }
};

/**
 * Get all jobs with filters and pagination
 * Matches: GET /api/jobs
 */
export const getAllJobs = async (params = {}) => {
  return apiCallWithRetryPrevention('getAllJobs', async () => {
    const response = await userApi.get('/jobs', { params });
    return response.data;
  });
};

/**
 * Get job by ID
 * Matches: GET /api/jobs/:id
 */
export const getJobById = async (jobId) => {
  return apiCallWithRetryPrevention(`getJobById-${jobId}`, async () => {
    const response = await userApi.get(`/jobs/${jobId}`);
    return response.data;
  });
};

/**
 * Create a new job (Client only)
 * Matches: POST /api/jobs
 */
export const createJob = async (data) => {
  try {
    const response = await userApi.post('/jobs', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update job (Client - owner only)
 * Matches: PUT /api/jobs/:id
 */
export const updateJob = async (jobId, data) => {
  try {
    const response = await userApi.put(`/jobs/${jobId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete job (Client - owner only)
 * Matches: DELETE /api/jobs/:id
 */
export const deleteJob = async (jobId) => {
  try {
    const response = await userApi.delete(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get my posted jobs (Client only)
 * Matches: GET /api/jobs/my-jobs
 */
export const getMyJobs = async (params = {}) => {
  return apiCallWithRetryPrevention('getMyJobs', async () => {
    const response = await userApi.get('/jobs/my-jobs', { params });
    return response.data;
  });
};

/**
 * Get freelancer's jobs (accepted proposals)
 * Matches: GET /api/jobs/freelancer/my-jobs
 * @param {Object} params - { page, limit, status }
 * WITH RETRY PREVENTION
 */
export const getFreelancerJobs = async (params = {}) => {
  const requestKey = 'getFreelancerJobs';
  
  return apiCallWithRetryPrevention(requestKey, async () => {
    const response = await userApi.get('/jobs/freelancer/my-jobs', { params });
    return response.data;
  });
};

/**
 * Get active jobs count for freelancer
 * Matches: GET /api/jobs/freelancer/active-count
 * WITH RETRY PREVENTION
 */
export const getFreelancerActiveJobsCount = async () => {
  const requestKey = 'getFreelancerActiveJobsCount';
  
  return apiCallWithRetryPrevention(requestKey, async () => {
    const response = await userApi.get('/jobs/freelancer/active-count');
    return response.data;
  });
};

/**
 * Update milestone status (Freelancer)
 * Matches: PATCH /api/jobs/:jobId/milestones/:milestoneId
 */
export const updateMilestoneStatus = async (jobId, milestoneId, status) => {
  try {
    const response = await userApi.patch(`/jobs/${jobId}/milestones/${milestoneId}`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Job categories matching backend enum
export const JOB_CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Design',
  'Writing',
  'Marketing',
  'Data Science',
  'DevOps',
  'Other',
];

// Experience levels matching backend enum
export const EXPERIENCE_LEVELS = {
  ENTRY: 'entry',
  INTERMEDIATE: 'intermediate',
  EXPERT: 'expert',
};

// Project types matching backend enum
export const PROJECT_TYPES = {
  FIXED: 'fixed',
  HOURLY: 'hourly',
};

// Job statuses matching backend enum
export const JOB_STATUSES = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  CLOSED: 'closed',
};

// Export all functions as default object
export default {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
  getFreelancerJobs,
  getFreelancerActiveJobsCount,
  updateMilestoneStatus,
  JOB_CATEGORIES,
  EXPERIENCE_LEVELS,
  PROJECT_TYPES,
  JOB_STATUSES,
};