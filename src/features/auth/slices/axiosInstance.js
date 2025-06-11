import axios from 'axios';
import { AUTH_CONSTANTS } from '../constants/authConstants';
import store from '../../../store/store';
import { refreshTokenAsync } from './authSlice';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: AUTH_CONSTANTS.API_BASE_URL,
  withCredentials: true,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
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
      if (isRefreshing) {
        // Queue the request while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('Attempting token refresh');
        const result = await store.dispatch(refreshTokenAsync());
        if (refreshTokenAsync.fulfilled.match(result)) {
          console.log('Token refresh successful');
          const newToken = store.getState().auth.token;
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
        throw new Error('Token refresh failed');
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        processQueue(refreshError, null);
       
        return Promise.reject(errorResponse);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(errorResponse);
  }
);

export default axiosInstance;