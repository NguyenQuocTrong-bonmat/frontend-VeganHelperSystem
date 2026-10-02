import axios from 'axios';
import { getAccessToken, clearAuthTokens } from '../utils/authStorage';

// Create an Axios instance with base configuration
const axiosInstance = axios.create({
  // Use environment variable for API URL. If not set, use localhost as fallback
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://localhost:7180/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token to every request if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors like 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config || {};
    
    // If error is 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest.skipAuthRedirect && !originalRequest._retry && getAccessToken()) {
      originalRequest._retry = true;
      
      clearAuthTokens();
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
