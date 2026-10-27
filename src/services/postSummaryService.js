import axiosInstance from '../lib/axios';

export async function getPostSummary(postId) {
  const response = await axiosInstance.get(`/posts/${postId}/summary`);
  return response.data;
}

export async function requestPostSummary(postId) {
  const response = await axiosInstance.post(`/posts/${postId}/summary`);
  return response.data;
}
