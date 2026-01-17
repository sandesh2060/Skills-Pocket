// ============================================
// FILE: frontend/user/src/api/jobApi.js
// ============================================
import { userApi } from './axios';

/**
 * Get all jobs with filters and pagination
 * Matches: GET /api/jobs
 * @param {Object} params - { page, limit, category, skills, budget_min, budget_max, experienceLevel, search, status }
 */
export const getAllJobs = async (params = {}) => {
  try {
    const response = await userApi.get('/jobs', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get job by ID
 * Matches: GET /api/jobs/:id
 */
export const getJobById = async (jobId) => {
  try {
    const response = await userApi.get(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create a new job (Client only)
 * Matches: POST /api/jobs
 * @param {Object} data - Job data matching Job model
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
 * @param {Object} params - { page, limit, status }
 */
export const getMyJobs = async (params = {}) => {
  try {
    const response = await userApi.get('/jobs/my-jobs', { params });
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
  JOB_CATEGORIES,
  EXPERIENCE_LEVELS,
  PROJECT_TYPES,
  JOB_STATUSES,
};