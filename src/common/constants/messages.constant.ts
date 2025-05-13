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
} as const;
