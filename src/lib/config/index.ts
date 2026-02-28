// Environment configuration
export const config = {
  // Google Services
  google: {
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
    privateKey: process.env.GOOGLE_PRIVATE_KEY || '',
    sheetId: process.env.GOOGLE_SHEET_ID || '',
    driveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID || '',
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expiry: process.env.JWT_EXPIRY || '7d',
  },

  // SMTP Configuration
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },

  // Application Configuration
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
  },

  // Data Backend Configuration
  dataBackend: process.env.DATA_BACKEND || 'google-sheets',

  // Cache Configuration
  cache: {
    defaultTtl: parseInt(process.env.CACHE_DEFAULT_TTL || '60', 10),
  },
};

// Helper function to validate required environment variables
export function validateConfig(): string[] {
  const errors: string[] = [];

  if (!config.google.serviceAccountEmail) {
    errors.push('GOOGLE_SERVICE_ACCOUNT_EMAIL is not set');
  }
  if (!config.google.privateKey) {
    errors.push('GOOGLE_PRIVATE_KEY is not set');
  }
  if (!config.google.sheetId) {
    errors.push('GOOGLE_SHEET_ID is not set');
  }
  if (!config.google.driveFolderId) {
    errors.push('GOOGLE_DRIVE_FOLDER_ID is not set');
  }
  if (!config.jwt.secret) {
    errors.push('JWT_SECRET is not set');
  }
  if (!config.smtp.host) {
    errors.push('SMTP_HOST is not set');
  }
  if (!config.smtp.user) {
    errors.push('SMTP_USER is not set');
  }
  if (!config.smtp.pass) {
    errors.push('SMTP_PASS is not set');
  }

  return errors;
}
