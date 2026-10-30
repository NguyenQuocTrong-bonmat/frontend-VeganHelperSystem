import axiosInstance from '../lib/axios';

export async function getPostSummary(postId, config) {
  const response = await axiosInstance.get(`/posts/${postId}/summary`, config);
  return response.data;
}

export async function requestPostSummary(postId, config) {
  const response = await axiosInstance.post(`/posts/${postId}/summary`, undefined, config);
  return response.data;
}
