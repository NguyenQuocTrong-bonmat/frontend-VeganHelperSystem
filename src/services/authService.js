import axiosInstance from '../lib/axios';

export const authService = {
  // FN02: Đăng nhập hệ thống
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  // FN01: Đăng ký tài khoản
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  // Xác minh email (OTP)
  verifyEmail: async (data) => {
    const response = await axiosInstance.post('/auth/verify-email', data);
    return response.data;
  },

  // Gửi lại mã OTP
  resendVerification: async (data) => {
    const response = await axiosInstance.post('/auth/resend-verification', data);
    return response.data;
  },

  // FN05: Xem hồ sơ cá nhân
  getProfile: async () => {
    const response = await axiosInstance.get('/users/me');
    return response.data;
  },

  // FN03: Đăng xuất
  logout: async () => {
    // Optionally call BE logout if it exists to revoke token
    // await axiosInstance.post('/auth/logout');
    localStorage.removeItem('accessToken');
  },
};
