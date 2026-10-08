import axiosInstance from '../lib/axios';
import { getAccessToken } from '../utils/authStorage';

/**
 * Lấy danh sách bài viết cho trang Feed
 * @param {Object} params Các tham số phân trang và bộ lọc
 * @param {number} params.pageIndex Trang hiện tại (mặc định: 1)
 * @param {number} params.pageSize Số lượng bài trên 1 trang (mặc định: 10)
 * @param {number} [params.categoryId] Id danh mục (tùy chọn)
 * @param {string} [params.difficultyLevel] Độ khó (tùy chọn)
 * @param {string} [params.dietType] Chế độ ăn (tùy chọn)
 * @param {number} [params.prepTimeMax] Thời gian chuẩn bị tối đa (tùy chọn)
 */
export async function getPostsFeed(params = {}) {
  const {
    pageIndex = 1,
    pageSize = 10,
    categoryId,
    difficultyLevel,
    dietType,
    prepTimeMax,
  } = params;

  // Tạo URLSearchParams để tự động build query string hợp lệ
  const queryParams = new URLSearchParams();
  queryParams.append('PageIndex', pageIndex);
  queryParams.append('PageSize', pageSize);

  if (categoryId !== undefined && categoryId !== null) {
    queryParams.append('CategoryId', categoryId);
  }
  if (difficultyLevel) {
    queryParams.append('DifficultyLevel', difficultyLevel);
  }
  if (dietType) {
    queryParams.append('DietType', dietType);
  }
  if (prepTimeMax !== undefined && prepTimeMax !== null) {
    queryParams.append('PrepTimeMax', prepTimeMax);
  }

  try {
    const response = await axiosInstance.get(`/Posts?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    const errorBody = error.response?.data ? JSON.stringify(error.response.data) : error.message;
    throw new Error(`Lỗi kết nối API Posts (${error.response?.status || 'Unknown'}): ${errorBody}`);
  }
}

export async function getPostDetail(id) {
  try {
    const response = await axiosInstance.get(`/Posts/${id}`);
    return response.data;
  } catch (err) {
    const errorText = err.response?.data ? JSON.stringify(err.response.data) : err.message;
    const error = new Error(errorText || `HTTP Error ${err.response?.status}`);
    error.status = err.response?.status;
    throw error;
  }
}

export function getAuthToken() {
  return getAccessToken();
}

export async function getMyPosts(params = {}) {
  const { pageIndex = 1, pageSize = 10, status } = params;

  const query = new URLSearchParams();
  query.append('PageIndex', pageIndex);
  query.append('PageSize', pageSize);
  if (status) {
    query.append('Status', status);
  }

  try {
    const response = await axiosInstance.get(`/Posts/my-posts?${query.toString()}`);
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

// FN13: Tạo bài viết mới (multipart/form-data)
export async function createPost(postData) {
  const formData = new FormData();

  formData.append('Title', postData.title);
  formData.append('PostType', (postData.postType || 'recipe').toLowerCase());
  formData.append('CategoryId', postData.categoryId);
  formData.append('Content', postData.content);
  formData.append('DifficultyLevel', (postData.difficultyLevel || 'easy').toLowerCase());
  formData.append('PrepTimeMins', postData.prepTimeMins || 0);
  formData.append('CookingTimeMins', postData.cookingTimeMins || 0);
  formData.append('DietType', (postData.dietType || 'vegan').toLowerCase());

  // Gắn file ảnh nếu có
  if (postData.mediaFiles && postData.mediaFiles.length > 0) {
    for (let i = 0; i < postData.mediaFiles.length; i++) {
      formData.append('MediaFiles', postData.mediaFiles[i]);
    }
  }

  // Serialize Ingredients và Steps thành chuỗi JSON
  const mappedIngredients = (postData.ingredients || []).map(i => ({ Name: i.trim() }));
  const mappedSteps = (postData.steps || []).map((s, idx) => ({ StepNumber: idx + 1, Description: s.trim() }));
  formData.append('IngredientsJson', JSON.stringify(mappedIngredients));
  formData.append('StepsJson', JSON.stringify(mappedSteps));

  try {
    const response = await axiosInstance.post('/Posts', formData);
    return response.data;
  } catch (err) {
    let errorMessage = `Failed to create post (${err.response?.status})`;
    if (err.response?.data) {
      const errorJson = err.response.data;
      errorMessage = errorJson.message || errorJson.title || JSON.stringify(errorJson);
      
      if (errorJson.errors) {
        let details = '';
        if (Array.isArray(errorJson.errors)) {
          details = errorJson.errors.map(e => {
            if (typeof e === 'string') return e;
            if (e.Field && e.Error) return `${e.Field}: ${e.Error}`;
            return e.errorMessage || e.message || e.description || JSON.stringify(e);
          }).join(' | ');
        } else if (typeof errorJson.errors === 'object') {
          details = Object.entries(errorJson.errors)
            .map(([field, msgs]) => {
              const cleanField = field.replace('$.', '');
              const msgsStr = Array.isArray(msgs) ? msgs.join(', ') : (typeof msgs === 'object' ? JSON.stringify(msgs) : msgs);
              return `${cleanField}: ${msgsStr}`;
            })
            .join(' | ');
        }
        if (details) {
          errorMessage = `${errorJson.title || 'Validation failed'}: ${details}`;
        }
      }
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    const error = new Error(errorMessage);
    error.status = err.response?.status;
    throw error;
  }
}

export async function getCategories() {
  try {
    const response = await axiosInstance.get('/Categories');
    return response.data;
  } catch (err) {
    const errorText = err.response?.data ? JSON.stringify(err.response.data) : err.message;
    const error = new Error(errorText || `HTTP Error ${err.response?.status}`);
    error.status = err.response?.status;
    throw error;
  }
}



export async function deletePost(id) {
  try {
    await axiosInstance.delete(`/Posts/${id}`);
  } catch (err) {
    let errorMessage = `Failed to delete post (${err.response?.status})`;
    if (err.response?.data) {
      const errorJson = err.response.data;
      errorMessage = errorJson.message || errorJson.title || JSON.stringify(errorJson);
    } else if (err.message) {
      errorMessage = err.message;
    }
    const error = new Error(errorMessage);
    error.status = err.response?.status;
    throw error;
  }
}



export async function updatePost(id, postData) {
  const formData = new FormData();

  for (const mediaId of postData.mediaIdsToRemove || []) {
    formData.append('MediaIdsToRemove', mediaId);
  }

  formData.append('Title', postData.title);
  formData.append('PostType', (postData.postType || 'recipe').toLowerCase());
  formData.append('CategoryId', postData.categoryId);
  formData.append('Content', postData.content);
  formData.append('DifficultyLevel', (postData.difficultyLevel || 'easy').toLowerCase());
  formData.append('PrepTimeMins', postData.prepTimeMins || 0);
  formData.append('CookingTimeMins', postData.cookingTimeMins || 0);
  formData.append('DietType', (postData.dietType || 'vegan').toLowerCase());

  // Gắn file ảnh nếu có
  if (postData.mediaFiles && postData.mediaFiles.length > 0) {
    for (let i = 0; i < postData.mediaFiles.length; i++) {
      formData.append('MediaFilesToAdd', postData.mediaFiles[i]);
    }
  }

  // Serialize Ingredients và Steps
  const mappedIngredients = (postData.ingredients || []).map(i => ({ Name: i.trim() }));
  const mappedSteps = (postData.steps || []).map((s, idx) => ({ StepNumber: idx + 1, Description: s.trim() }));
  formData.append('IngredientsJson', JSON.stringify(mappedIngredients));
  formData.append('StepsJson', JSON.stringify(mappedSteps));

  try {
    const response = await axiosInstance.put(`/Posts/${id}`, formData);
    return response.data;
  } catch (err) {
    let errorMessage = `Failed to update post (${err.response?.status})`;
    if (err.response?.data) {
      const errorJson = err.response.data;
      errorMessage = errorJson.message || errorJson.title || JSON.stringify(errorJson);
      if (errorJson.errors) {
        let details = '';
        if (Array.isArray(errorJson.errors)) {
          details = errorJson.errors.map(e => {
            if (typeof e === 'string') return e;
            if (e.Field && e.Error) return `${e.Field}: ${e.Error}`;
            return e.errorMessage || e.message || e.description || JSON.stringify(e);
          }).join(' | ');
        } else if (typeof errorJson.errors === 'object') {
          details = Object.entries(errorJson.errors)
            .map(([field, msgs]) => {
              const cleanField = field.replace('$.', '');
              const msgsStr = Array.isArray(msgs) ? msgs.join(', ') : (typeof msgs === 'object' ? JSON.stringify(msgs) : msgs);
              return `${cleanField}: ${msgsStr}`;
            })
            .join(' | ');
        }
        if (details) {
          errorMessage = `${errorJson.title || 'Validation failed'}: ${details}`;
        }
      }
    } else if (err.message) {
      errorMessage = err.message;
    }
    const error = new Error(errorMessage);
    error.status = err.response?.status;
    throw error;
  }
}

export async function searchPosts(params = {}) {
  const { keyword = '', pageIndex = 1, pageSize = 10 } = params;
  const query = new URLSearchParams();
  if (keyword) query.append('keyword', keyword);
  query.append('pageIndex', pageIndex);
  query.append('pageSize', pageSize);

  try {
    const response = await axiosInstance.get(`/Posts/search?${query.toString()}`);
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
