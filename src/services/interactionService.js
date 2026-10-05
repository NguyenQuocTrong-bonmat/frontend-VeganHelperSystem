import axiosInstance from '../lib/axios';

export async function toggleLike(postId) {
  try {
    const response = await axiosInstance.post(`/posts/${postId}/like`);
    return response.data;
  } catch (err) {
    let errorMessage = `Failed to like post (${err.response?.status})`;
    if (err.response?.data) {
      errorMessage = err.response.data.message || err.response.data.title || JSON.stringify(err.response.data);
    } else if (err.message) {
      errorMessage = err.message;
    }
    const error = new Error(errorMessage);
    error.status = err.response?.status;
    throw error;
  }
}

export async function toggleSave(postId) {
  try {
    const response = await axiosInstance.post(`/posts/${postId}/save`);
    return response.data;
  } catch (err) {
    let errorMessage = `Failed to save post (${err.response?.status})`;
    if (err.response?.data) {
      errorMessage = err.response.data.message || err.response.data.title || JSON.stringify(err.response.data);
    } else if (err.message) {
      errorMessage = err.message;
    }
    const error = new Error(errorMessage);
    error.status = err.response?.status;
    throw error;
  }
}

export async function getSavedPosts(params = {}) {
  const { pageIndex = 1, pageSize = 10 } = params;
  const query = new URLSearchParams();
  query.append('pageIndex', pageIndex);
  query.append('pageSize', pageSize);

  try {
    const response = await axiosInstance.get(`/users/me/saved-posts?${query.toString()}`);
    return response.data;
  } catch (err) {
    let errorMessage = `HTTP Error ${err.response?.status}`;
    if (err.response?.data) {
      errorMessage = err.response.data.message || err.response.data.title || JSON.stringify(err.response.data);
    } else if (err.message) {
      errorMessage = err.message;
    }
    const error = new Error(errorMessage);
    error.status = err.response?.status;
    throw error;
  }
}
