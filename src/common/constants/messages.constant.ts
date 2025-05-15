export const MESSAGES = {
  PHONE_REQUIRED: 'Phone number is required',
  NAME_REQUIRED: 'Name is required',
  INVALID_PHONE: 'Invalid phone number format',
  PHONE_ALREADY_EXISTS: 'Phone number already registered',
  INVALID_ROLE: 'Invalid role provided',
  FAILED_CREATE_USER: 'Failed to create user',
  TOKEN_MISSING: 'Authorization token missing',
  TOKEN_INVALID: 'Invalid or expired token',
  COOKIES_UNAWAILABLE:
    'Cookies not available. Ensure cookie-parser is configured.',
  TOKEN_TYPE_MISMATCH: 'Token type does not match expected value',
  FIREBASE_CONFIG_MISSING: 'Firebase configuration is missing or invalid',
  PHONE_NOT_VERIFIED: 'Phone number not verified',
  INVALID_VERIFICATION: 'Invalid phone verification',
  SIGNUP_SESSION_EXPIRED: 'Signup session has expired. Please try again.',
  PHONE_VERIFICATION_MISMATCH:
    'Phone verification failed. The verified phone number does not match the registered one.',
  FIREBASE_TOKEN_REQUIRED: 'Firebase ID token is required.',
  TEMP_USER_ID_REQUIRED: 'Temporary user ID is required.',
} as const;
