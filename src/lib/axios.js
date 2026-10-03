import axios from 'axios';

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
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

// Response Interceptor: Handle global errors like 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't already retried this request, and it's not the refresh endpoint itself
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh')) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const isLocalStorage = !!localStorage.getItem('refreshToken');
      const refreshToken = isLocalStorage 
        ? localStorage.getItem('refreshToken') 
        : sessionStorage.getItem('refreshToken');

      if (!refreshToken) {
        processQueue(new Error('No refresh token'), null);
        isRefreshing = false;
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      return new Promise(function (resolve, reject) {
         // Use a direct axios call to avoid interceptors causing infinite loops just in case
         axios.post((process.env.REACT_APP_API_BASE_URL || 'https://localhost:7180/api') + '/auth/refresh', { refreshToken })
           .then(({ data }) => {
               const newAccessToken = data.accessToken;
               const newRefreshToken = data.refreshToken;
               
               if (isLocalStorage) {
                 localStorage.setItem('accessToken', newAccessToken);
                 localStorage.setItem('refreshToken', newRefreshToken);
               } else {
                 sessionStorage.setItem('accessToken', newAccessToken);
                 sessionStorage.setItem('refreshToken', newRefreshToken);
               }

               axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
               originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
               
               processQueue(null, newAccessToken);
               resolve(axiosInstance(originalRequest));
           })
           .catch((err) => {
               processQueue(err, null);
               localStorage.clear();
               sessionStorage.clear();
               window.location.href = '/login';
               reject(err);
           })
           .finally(() => {
               isRefreshing = false;
           });
      });
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
