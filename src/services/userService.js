import axiosInstance from '../lib/axios';

function extractError(err) {
  let errorMessage = `HTTP Error ${err.response?.status}`;
  if (err.response?.data) {
    errorMessage = err.response.data.message || err.response.data.error || JSON.stringify(err.response.data);
  } else if (err.message) {
    errorMessage = err.message;
  }
  const error = new Error(errorMessage);
  error.status = err.response?.status;
  return error;
}

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
    throw extractError(err);
  }
}

export async function getPublicProfile(userId) {
  try {
    const response = await axiosInstance.get(`/users/${userId}/profile`);
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function getFollowStatus(userId) {
  try {
    const response = await axiosInstance.get(`/users/${userId}/follow-status`);
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function followUser(userId) {
  try {
    const response = await axiosInstance.post(`/users/${userId}/follow`);
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function unfollowUser(userId) {
  try {
    const response = await axiosInstance.delete(`/users/${userId}/follow`);
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function getFollowers(userId, pageIndex = 1, pageSize = 10) {
  try {
    const query = new URLSearchParams({ pageIndex, pageSize });
    const response = await axiosInstance.get(`/users/${userId}/followers?${query.toString()}`);
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function getFollowing(userId, pageIndex = 1, pageSize = 10) {
  try {
    const query = new URLSearchParams({ pageIndex, pageSize });
    const response = await axiosInstance.get(`/users/${userId}/following?${query.toString()}`);
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

