import axiosInstance from '../lib/axios';

export const authService = {
  // FN02: Đăng nhập hệ thống
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  // Google Login
  googleLogin: async (data) => {
    const response = await axiosInstance.post('/auth/google-login', data);
    return response.data;
  },

  // FN01: Đăng ký tài khoản
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  // FN05: Xem hồ sơ cá nhân
  getProfile: async () => {
    const response = await axiosInstance.get('/users/me');
    return response.data;
  },

  // FN03: Đăng xuất
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
      await axiosInstance.post('/auth/logout', { refreshToken });
    } catch (e) {
      console.error("Logout API failed", e);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
    }
  },
};
