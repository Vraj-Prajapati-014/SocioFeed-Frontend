import axios from 'axios';
import { AUTH_CONSTANTS } from '../constants/authConstants';
import store from '../../../store/store';
import { refreshTokenAsync } from '../slices/authSlice';

const axiosInstance = axios.create({
  baseURL: AUTH_CONSTANTS.API_BASE_URL,
  withCredentials: true,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  config => {
    console.log('Request sent:', config.url); // Debug log
    return config;
  },
  error => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const errorResponse = {
      status: error.response?.status,
      data: error.response?.data || { message: 'An error occurred' },
      message: error.response?.data?.message || 'An error occurred',
    };

    console.log('Error response:', errorResponse); // Debug log

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== AUTH_CONSTANTS.AUTH_REFRESH // Prevent retry on /refresh
    ) {
      originalRequest._retry = true;
      try {
        console.log('Attempting token refresh'); // Debug log
        const result = await store.dispatch(refreshTokenAsync());
        if (refreshTokenAsync.fulfilled.match(result)) {
          console.log('Token refresh successful'); // Debug log
          return axiosInstance(originalRequest); // Retry original request
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError); // Debug log
        return Promise.reject(errorResponse);
      }
    }

    return Promise.reject(errorResponse);
  }
);

export default axiosInstance;
