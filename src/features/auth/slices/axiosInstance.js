import axios from 'axios';
import { AUTH_CONSTANTS } from '../constants/authConstants';
import store from '../../../store/store';
import { refreshTokenAsync } from './authSlice';

const axiosInstance = axios.create({
  baseURL: AUTH_CONSTANTS.API_BASE_URL,
  withCredentials: true, // Keep for refresh token cookie, if used
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token; // Get token from Redux
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request sent:', config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errorResponse = {
      status: error.response?.status,
      data: error.response?.data || { message: 'An error occurred' },
      message: error.response?.data?.message || 'An error occurred',
    };

    console.log('Error response:', errorResponse);

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== AUTH_CONSTANTS.AUTH_REFRESH
    ) {
      originalRequest._retry = true;
      try {
        console.log('Attempting token refresh');
        const result = await store.dispatch(refreshTokenAsync());
        if (refreshTokenAsync.fulfilled.match(result)) {
          console.log('Token refresh successful');
          const newToken = store.getState().auth.token;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
        throw new Error('Token refresh failed');
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Redirect to login on failed refresh
        window.location.href = '/login';
        return Promise.reject(errorResponse);
      }
    }

    return Promise.reject(errorResponse);
  }
);

export default axiosInstance;