import * as Yup from 'yup';
import { AUTH_CONSTANTS } from '../../features/auth/constants/authConstants';

const schemas = {
  login: Yup.object({
    usernameOrEmail: Yup.string().required('Username or email is required'),
    password: Yup.string().required('Password is required'),
  }),
  register: Yup.object({
    username: Yup.string()
      .matches(AUTH_CONSTANTS.REGEX_USERNAME, 'Username must be alphanumeric')
      .max(50, 'Username must be at most 50 characters')
      .required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string()
      .min(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH, 'Password must be at least 8 characters')
      .matches(
        AUTH_CONSTANTS.REGEX_PASSWORD,
        'Password must include uppercase, lowercase, number, and special character (@#$%^&*!#)'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  }),
  'forgot-password': Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
  }),
  'reset-password': Yup.object({
    password: Yup.string()
      .min(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH, 'Password must be at least 8 characters')
      .matches(
        AUTH_CONSTANTS.REGEX_PASSWORD,
        'Password must include uppercase, lowercase, number, and special character (@#$%^&*!#)'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  }),
  activate: Yup.object({
    token: Yup.string().required('Token is required'),
  }),
  'resend-activation': Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
  }),
  post: Yup.object({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
  }),
  comment: Yup.object({
    content: Yup.string().required('Comment is required'),
  }),
};

export const validateForm = (formType, data) => {
  const schema = schemas[formType];
  if (!schema) return {};

  try {
    schema.validateSync(data, { abortEarly: false });
    return {};
  } catch (err) {
    const errors = {};
    if (err.inner) {
      err.inner.forEach(error => {
        errors[error.path] = error.message;
      });
    }
    return errors;
  }
};
