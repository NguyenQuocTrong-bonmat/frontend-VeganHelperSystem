import axiosInstance from '../lib/axios';

export const authService = {
  // FN02: Đăng nhập hệ thống
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  // Google Login
  googleLogin: async (data) => {
    const response = await axiosInstance.post('/auth/google', data);
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

  // FN04: Quên mật khẩu
  forgotPassword: async (data) => {
    const response = await axiosInstance.post('/auth/forgot-password', data);
    return response.data;
  },

  // FN04: Đặt lại mật khẩu
  resetPassword: async (data) => {
    const response = await axiosInstance.post('/auth/reset-password', data);
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

  // FN05: Cập nhật hồ sơ cá nhân (bao gồm avatar)
  updateProfile: async (formData) => {
    const response = await axiosInstance.put('/users/me', formData);
    return response.data;
  },

  // Link Google Account
  linkGoogle: async (data) => {
    const response = await axiosInstance.post('/auth/google/link', data);
    return response.data;
  },

  // Set Password (trước khi unlink Google)
  setPassword: async (data) => {
    const response = await axiosInstance.post('/auth/set-password', data);
    return response.data;
  },

  // Request Unlink Google Account
  requestUnlinkGoogle: async (data) => {
    const response = await axiosInstance.post('/auth/google/unlink/request', data);
    return response.data;
  },

  // Confirm Unlink Google Account
  confirmUnlinkGoogle: async (data) => {
    const response = await axiosInstance.post('/auth/google/unlink/confirm', data);
    return response.data;
  }
};
