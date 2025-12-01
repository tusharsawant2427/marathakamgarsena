// Payment Gateway Configuration
export const PAYMENT_CONFIG = {
  // Replace with your actual backend API URL
  API_BASE_URL: 'https://marathikamgarsena.com/api',
  
  // Replace with your actual API key (or use environment variables)
  API_KEY: 'KAMGARUNION_API_KEY',
  
  // Environment: 'SANDBOX' or 'PRODUCTION'
  ENVIRONMENT: 'SANDBOX',

  // Cashfree credentials (stored on backend, not needed in app)
  // CASHFREE_APP_ID: 'TEST108331441b77e330bc1df802693d44133801',
  // CASHFREE_SECRET_KEY: 'REDACTED',
};

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];
