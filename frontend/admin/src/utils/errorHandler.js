// ============================================
// FILE 1: frontend/admin/src/utils/errorHandler.js
// Centralized error handling utility
// ============================================
export const ERROR_CODES = {
  NO_TOKEN: 'NO_TOKEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  ACCOUNT_DEACTIVATED: 'ACCOUNT_DEACTIVATED',
  QUERY_TIMEOUT: 'QUERY_TIMEOUT',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
};

export const ERROR_MESSAGES = {
  [ERROR_CODES.NO_TOKEN]: 'Please log in to continue',
  [ERROR_CODES.INVALID_TOKEN]: 'Your session is invalid. Please log in again',
  [ERROR_CODES.TOKEN_EXPIRED]: 'Your session has expired. Please log in again',
  [ERROR_CODES.ACCOUNT_DEACTIVATED]: 'Your account has been deactivated',
  [ERROR_CODES.QUERY_TIMEOUT]: 'Request timed out. Please try again',
  [ERROR_CODES.NETWORK_ERROR]: 'Network error. Please check your connection',
  [ERROR_CODES.SERVER_ERROR]: 'Server error. Please try again later',
};

export class AppError extends Error {
  constructor(message, code, statusCode = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export const handleApiError = (error, options = {}) => {
  const { onAuthError, showToast } = options;

  // Network error
  if (error.code === 'ERR_NETWORK' || !error.response) {
    const message = ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR];
    showToast?.(message, 'error');
    return new AppError(message, ERROR_CODES.NETWORK_ERROR, 0);
  }

  const response = error.response;
  const data = response?.data;
  const code = data?.code;
  const statusCode = response?.status;

  // Authentication errors
  const authErrorCodes = [
    ERROR_CODES.NO_TOKEN,
    ERROR_CODES.INVALID_TOKEN,
    ERROR_CODES.TOKEN_EXPIRED,
    ERROR_CODES.ACCOUNT_DEACTIVATED,
  ];

  if (authErrorCodes.includes(code) || statusCode === 401) {
    const message = data?.error || ERROR_MESSAGES[code] || 'Authentication failed';
    showToast?.(message, 'error');
    onAuthError?.();
    return new AppError(message, code || ERROR_CODES.INVALID_TOKEN, statusCode);
  }

  // Timeout error
  if (code === ERROR_CODES.QUERY_TIMEOUT || statusCode === 504) {
    const message = data?.error || ERROR_MESSAGES[ERROR_CODES.QUERY_TIMEOUT];
    showToast?.(message, 'warning');
    return new AppError(message, ERROR_CODES.QUERY_TIMEOUT, 504);
  }

  // Server error
  const message = data?.error || data?.message || 'Something went wrong';
  showToast?.(message, 'error');
  return new AppError(
    message,
    code || ERROR_CODES.SERVER_ERROR,
    statusCode || 500
  );
};
