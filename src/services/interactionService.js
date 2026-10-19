import axiosInstance from '../lib/axios';

export const COMMENT_DELETE_REASON_MAX_LENGTH = 500;

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

export async function getComments(postId, { maxDepth = 4 } = {}) {
  try {
    const response = await axiosInstance.get(`/posts/${postId}/comments`, {
      params: { maxDepth },
    });
    return response.data;
  } catch (err) {
    let errorMessage = `Failed to load comments (${err.response?.status || 'network error'})`;
    if (err.response?.data) {
      errorMessage = err.response.data.message
        || err.response.data.title
        || JSON.stringify(err.response.data);
    } else if (err.message) {
      errorMessage = err.message;
    }
    const error = new Error(errorMessage);
    error.status = err.response?.status;
    throw error;
  }
}

export async function createComment(postId, { content, parentCommentId = null }) {
  try {
    const response = await axiosInstance.post(`/posts/${postId}/comments`, {
      content,
      parentCommentId,
    });
    return response.data;
  } catch (err) {
    let errorMessage = `Failed to post comment (${err.response?.status || 'network error'})`;
    if (err.response?.data) {
      errorMessage = err.response.data.message
        || err.response.data.title
        || JSON.stringify(err.response.data);
    } else if (err.message) {
      errorMessage = err.message;
    }
    const error = new Error(errorMessage);
    error.status = err.response?.status;
    throw error;
  }
}

export async function updateComment(postId, commentId, content) {
  try {
    const response = await axiosInstance.put(`/posts/${postId}/comments/${commentId}`, {
      content,
    });
    return response.data;
  } catch (err) {
    let errorMessage = `Failed to update comment (${err.response?.status || 'network error'})`;
    if (err.response?.data) {
      errorMessage = err.response.data.message
        || err.response.data.title
        || JSON.stringify(err.response.data);
    } else if (err.message) {
      errorMessage = err.message;
    }
    const error = new Error(errorMessage);
    error.status = err.response?.status;
    throw error;
  }
}

export async function deleteComment(postId, commentId, reason = null) {
  if (reason != null && typeof reason !== 'string') {
    const error = new Error('Deletion reason must be text.');
    error.status = 400;
    throw error;
  }

  const normalizedReason = reason?.trim() || '';
  if (normalizedReason.length > COMMENT_DELETE_REASON_MAX_LENGTH) {
    const error = new Error(
      `Deletion reason must not exceed ${COMMENT_DELETE_REASON_MAX_LENGTH} characters.`
    );
    error.status = 400;
    throw error;
  }

  try {
    const config = normalizedReason ? { data: { reason: normalizedReason } } : {};
    await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`, config);
  } catch (err) {
    let errorMessage = `Failed to delete comment (${err.response?.status || 'network error'})`;
    if (err.response?.data) {
      errorMessage = err.response.data.message
        || err.response.data.title
        || JSON.stringify(err.response.data);
    } else if (err.message) {
      errorMessage = err.message;
    }
    const error = new Error(errorMessage);
    error.status = err.response?.status;
    throw error;
  }
}

export async function reportComment(postId, commentId, reason) {
  try {
    const response = await axiosInstance.post(`/posts/${postId}/comments/${commentId}/reports`, {
      reason,
    });
    return response.data;
  } catch (err) {
    let errorMessage = `Failed to report comment (${err.response?.status || 'network error'})`;
    if (err.response?.data) {
      errorMessage = err.response.data.message
        || err.response.data.title
        || JSON.stringify(err.response.data);
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
