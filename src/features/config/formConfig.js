import { routeConstants } from '../auth/constants/routeConstants';

export const formConfig = {
  login: {
    fields: [
      { name: 'usernameOrEmail', type: 'text', label: 'Username or Email', required: true },
      { name: 'password', type: 'password', label: 'Password', required: true },
    ],
    submitButtonText: 'Login',
    additionalLinks: [
      { text: 'Forgot Password?', href: routeConstants.ROUTE_FORGOT_PASSWORD },
      { text: 'Don’t have an account? Register', href: routeConstants.ROUTE_REGISTER },
    ],
  },
  register: {
    fields: [
      { name: 'username', type: 'text', label: 'Username', required: true },
      { name: 'email', type: 'email', label: 'Email', required: true },
      { name: 'password', type: 'password', label: 'Password', required: true },
      { name: 'confirmPassword', type: 'password', label: 'Confirm Password', required: true },
    ],
    submitButtonText: 'Register',
    additionalLinks: [{ text: 'Already have an account? Login', href: routeConstants.ROUTE_LOGIN }],
  },
  'forgot-password': {
    fields: [{ name: 'email', type: 'email', label: 'Email', required: true }],
    submitButtonText: 'Send Reset Link',
    additionalLinks: [{ text: 'Back to Login', href: routeConstants.ROUTE_LOGIN }],
  },
  'reset-password': {
    fields: [
      { name: 'password', type: 'password', label: 'New Password', required: true },
      { name: 'confirmPassword', type: 'password', label: 'Confirm Password', required: true },
    ],
    submitButtonText: 'Reset Password',
    additionalLinks: [{ text: 'Back to Login', href: routeConstants.ROUTE_LOGIN }],
  },
  post: {
    fields: [
      { name: 'title', type: 'text', label: 'Title', required: true },
      { name: 'content', type: 'textarea', label: 'Content', required: true },
    ],
    submitButtonText: 'Create Post',
    additionalLinks: [],
  },
  comment: {
    fields: [{ name: 'content', type: 'textarea', label: 'Comment', required: true }],
    submitButtonText: 'Add Comment',
    additionalLinks: [],
  },
};
