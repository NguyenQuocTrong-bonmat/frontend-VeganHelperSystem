import axios from 'axios';

// Create an Axios instance with base configuration
const axiosInstance = axios.create({
  // Use environment variable for API URL. If not set, use localhost as fallback
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7087/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token to every request if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
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
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // TODO: Implement refresh token logic here when BE supports it
        // const refreshToken = localStorage.getItem('refreshToken');
        // const res = await axios.post('/api/auth/refresh', { token: refreshToken });
        // localStorage.setItem('accessToken', res.data.accessToken);
        // return axiosInstance(originalRequest);
        
        // For now, if 401, just clear token and force logout
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
