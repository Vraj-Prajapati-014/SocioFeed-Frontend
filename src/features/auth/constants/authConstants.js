const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const METHOD_GET = 'get';
const METHOD_POST = 'post';

const AUTH_LOGIN = '/auth/login';
const AUTH_REGISTER = '/auth/register';
const AUTH_ACTIVATE = '/auth/activate/:token';
const AUTH_FORGOT_PASSWORD = '/auth/forgot-password';
const AUTH_RESET_PASSWORD = '/auth/reset-password/:token';
const AUTH_RESEND_ACTIVATION = '/auth/resend-activation';
const AUTH_ME = '/auth/me';
const AUTH_REFRESH = '/auth/refresh';

// Validation Constants
const REGEX_USERNAME = /^[a-zA-Z0-9]+$/;
const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!#])[A-Za-z\d@#$%^&*!#]{8,}$/;
const MIN_PASSWORD_LENGTH = 8;

export const AUTH_CONSTANTS = {
  API_BASE_URL,
  METHOD_GET,
  METHOD_POST,
  AUTH_LOGIN,
  AUTH_REGISTER,
  AUTH_ACTIVATE,
  AUTH_FORGOT_PASSWORD,
  AUTH_RESET_PASSWORD,
  AUTH_RESEND_ACTIVATION,
  AUTH_ME,
  REGEX_USERNAME,
  REGEX_PASSWORD,
  MIN_PASSWORD_LENGTH,
  AUTH_REFRESH,
};
