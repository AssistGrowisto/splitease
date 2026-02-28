import type { CurrencyOption } from '@/types';

// Group Constraints
export const MAX_GROUP_MEMBERS = 15;
export const MAX_GROUP_NAME_LENGTH = 50;

// Expense Constraints
export const MAX_EXPENSE_DESCRIPTION_LENGTH = 200;

// Receipt Upload Constraints
export const MAX_RECEIPT_SIZE = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

// Supported Currencies
export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
  },
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
  },
];

// Password Constraints
export const PASSWORD_MIN_LENGTH = 8;

// Encryption
export const SALT_ROUNDS = 10;

// Rate Limiting Configuration
export const RATE_LIMITS = {
  // Authentication endpoints
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // max 5 attempts
  },
  signup: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // max 3 registrations per hour
  },
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // max 3 reset requests per hour
  },

  // Group endpoints
  createGroup: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10, // max 10 groups per hour
  },
  updateGroup: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 30, // max 30 updates per hour
  },

  // Expense endpoints
  createExpense: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 50, // max 50 expenses per hour
  },
  updateExpense: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 100, // max 100 updates per hour
  },
  deleteExpense: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 50, // max 50 deletions per hour
  },

  // File upload endpoints
  uploadReceipt: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 20, // max 20 uploads per hour
  },

  // User endpoints
  updateProfile: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10, // max 10 profile updates per hour
  },
  getBalance: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // max 30 requests per minute
  },

  // Settlement endpoints
  settleExpense: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 50, // max 50 settlements per hour
  },

  // General API
  default: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // max 100 requests per minute
  },
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Cache Keys
export const CACHE_KEYS = {
  USER: (userId: string) => `user:${userId}`,
  GROUP: (groupId: string) => `group:${groupId}`,
  GROUP_MEMBERS: (groupId: string) => `group:${groupId}:members`,
  GROUP_EXPENSES: (groupId: string) => `group:${groupId}:expenses`,
  GROUP_BALANCES: (groupId: string) => `group:${groupId}:balances`,
  EXCHANGE_RATES: 'exchange:rates',
  USER_GROUPS: (userId: string) => `user:${userId}:groups`,
};

// Time constants
export const TIME_CONSTANTS = {
  MILLISECONDS_PER_SECOND: 1000,
  MILLISECONDS_PER_MINUTE: 60 * 1000,
  MILLISECONDS_PER_HOUR: 60 * 60 * 1000,
  MILLISECONDS_PER_DAY: 24 * 60 * 60 * 1000,
};
