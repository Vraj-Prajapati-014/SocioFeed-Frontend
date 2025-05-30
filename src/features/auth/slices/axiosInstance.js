import axios from 'axios';
import { AUTH_CONSTANTS } from '../constants/authConstants';

const axiosInstance = axios.create({
  baseURL: AUTH_CONSTANTS.API_BASE_URL,
  withCredentials: true, // Include cookies in requests
});

// Request Interceptor: No need to add token manually since it's in HTTP-only cookie
axiosInstance.interceptors.request.use(
  config => {
    return config;
  },
  error => Promise.reject(error)
);

// Response Interceptor: Handle errors globally
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return Promise.reject({ message: errorMessage });
  }
);

export default axiosInstance;
