// ============================================
// FILE: frontend/user/src/utils/constants.js
// ============================================

// API URLs
export const API_URL = import.meta.env.VITE_USER_API_URL || 'http://localhost:5000/api';
export const ADMIN_API_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5001/api';

// App Info
export const APP_NAME = 'SkillsPocket';
export const APP_TAGLINE = 'Premium Freelancing Marketplace';

// User Roles
export const USER_ROLES = {
  FREELANCER: 'freelancer',
  CLIENT: 'client',
};

// User Types
export const USER_TYPES = {
  USER: 'user',
  ADMIN: 'admin',
};

// Job Categories
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

// Experience Levels
export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'expert', label: 'Expert' },
];

// Project Types
export const PROJECT_TYPES = [
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'hourly', label: 'Hourly Rate' },
];

// Job Status
export const JOB_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  CLOSED: 'closed',
};

// Proposal Status
export const PROPOSAL_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
};

// Transaction Types
export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  PAYMENT: 'payment',
  REFUND: 'refund',
  PLATFORM_FEE: 'platform_fee',
  EARNING: 'earning',
};

// Transaction Status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

// Message Types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  SYSTEM: 'system',
  PROPOSAL_UPDATE: 'proposal_update',
  JOB_UPDATE: 'job_update',
  PAYMENT: 'payment',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  PROPOSAL_RECEIVED: 'proposal_received',
  PROPOSAL_ACCEPTED: 'proposal_accepted',
  PROPOSAL_REJECTED: 'proposal_rejected',
  JOB_COMPLETED: 'job_completed',
  PAYMENT_RECEIVED: 'payment_received',
  PAYMENT_SENT: 'payment_sent',
  REVIEW_RECEIVED: 'review_received',
  MESSAGE_RECEIVED: 'message_received',
  JOB_INVITATION: 'job_invitation',
  MILESTONE_COMPLETED: 'milestone_completed',
  DISPUTE_OPENED: 'dispute_opened',
  SYSTEM: 'system',
};

// File Upload
export const MAX_FILE_SIZE_MB = 5;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Date Formats
export const DATE_FORMAT = 'MMM DD, YYYY';
export const DATETIME_FORMAT = 'MMM DD, YYYY HH:mm';

// Skills (Sample)
export const POPULAR_SKILLS = [
  'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript',
  'Vue.js', 'Angular', 'PHP', 'Laravel', 'Django',
  'UI/UX Design', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator',
  'Content Writing', 'SEO', 'Social Media Marketing', 'Email Marketing',
  'Data Analysis', 'Machine Learning', 'SQL', 'MongoDB',
];

// Language Proficiency
export const LANGUAGE_PROFICIENCY = [
  { value: 'basic', label: 'Basic' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'fluent', label: 'Fluent' },
  { value: 'native', label: 'Native' },
];

// Rating Stars
export const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};