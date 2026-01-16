
// ============================================
// FILE: backend/user/src/utils/constants.js
// ============================================
module.exports = {
  USER_ROLES: {
    CLIENT: 'client',
    FREELANCER: 'freelancer',
    ADMIN: 'admin',
  },

  JOB_STATUS: {
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    CLOSED: 'closed',
  },

  PROPOSAL_STATUS: {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    WITHDRAWN: 'withdrawn',
  },

  TRANSACTION_TYPES: {
    PAYMENT: 'payment',
    WITHDRAWAL: 'withdrawal',
    REFUND: 'refund',
    ESCROW: 'escrow',
    RELEASE: 'release',
  },

  TRANSACTION_STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
  },

  NOTIFICATION_TYPES: {
    NEW_JOB: 'new_job',
    PROPOSAL_RECEIVED: 'proposal_received',
    PROPOSAL_ACCEPTED: 'proposal_accepted',
    PROPOSAL_REJECTED: 'proposal_rejected',
    JOB_COMPLETED: 'job_completed',
    PAYMENT_RECEIVED: 'payment_received',
    NEW_MESSAGE: 'new_message',
    REVIEW_RECEIVED: 'review_received',
    MILESTONE_COMPLETED: 'milestone_completed',
    GENERAL: 'general',
  },

  JOB_CATEGORIES: [
    'Web Development',
    'Mobile Development',
    'Design',
    'Writing',
    'Marketing',
    'Data Science',
    'DevOps',
    'Other',
  ],

  EXPERIENCE_LEVELS: ['entry', 'intermediate', 'expert'],

  PROJECT_TYPES: ['fixed', 'hourly'],
};