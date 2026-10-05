import axiosInstance from '../lib/axios';

export async function searchUsers(params = {}) {
  const { keyword = '', pageIndex = 1, pageSize = 10 } = params;
  const query = new URLSearchParams();
  if (keyword) query.append('keyword', keyword);
  query.append('pageIndex', pageIndex);
  query.append('pageSize', pageSize);

  try {
    const response = await axiosInstance.get(`/users/search?${query.toString()}`);
    return response.data;
  } catch (err) {
    let errorMessage = `HTTP Error ${err.response?.status}`;
    if (err.response?.data) {
      errorMessage = err.response.data.message || err.response.data.error || JSON.stringify(err.response.data);
    } else if (err.message) {
      errorMessage = err.message;
    }
    const error = new Error(errorMessage);
    error.status = err.response?.status;
    throw error;
  }
}

export async function getPublicProfile(userId) {
  try {
    const response = await axiosInstance.get(`/users/${userId}/profile`);
    return response.data;
  } catch (err) {
    let errorMessage = `HTTP Error ${err.response?.status}`;
    if (err.response?.data) {
      errorMessage = err.response.data.message || err.response.data.error || JSON.stringify(err.response.data);
    } else if (err.message) {
      errorMessage = err.message;
    }
    const error = new Error(errorMessage);
    error.status = err.response?.status;
    throw error;
  }
}
