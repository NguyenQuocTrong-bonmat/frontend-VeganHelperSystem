import axiosInstance from '../lib/axios';

/**
 * Helper: Extract error message from API response
 */
function extractError(err) {
  let errorMessage = `HTTP Error ${err.response?.status || 'Unknown'}`;
  if (err.response?.data) {
    if (typeof err.response.data === 'string') {
      errorMessage = err.response.data;
    } else {
      errorMessage =
        err.response.data.message ||
        err.response.data.title ||
        err.response.data.error ||
        JSON.stringify(err.response.data);
    }
  } else if (err.message) {
    errorMessage = err.message;
  }
  const error = new Error(errorMessage);
  error.status = err.response?.status;
  return error;
}

/* ========================================================================= */
/* 1. ADMIN MEMBERS API (FN38 - FN39)                                        */
/* ========================================================================= */

/**
 * Get paginated list of members with filters
 * @param {Object} params
 * @param {number} [params.pageIndex=1]
 * @param {number} [params.pageSize=20]
 * @param {string} [params.keyword]
 * @param {string} [params.role] 'member' | 'admin'
 * @param {string} [params.status] 'active' | 'banned' | 'locked' | 'inactive' | 'pending_verification' | 'deleted'
 */
export async function getAdminMembers(params = {}) {
  const { pageIndex = 1, pageSize = 20, keyword, role, status } = params;
  const query = new URLSearchParams();
  query.append('PageIndex', pageIndex);
  query.append('PageSize', pageSize);

  if (keyword) query.append('Keyword', keyword);
  if (role && role !== 'All') query.append('Role', role.toLowerCase());
  if (status && status !== 'All') query.append('Status', status.toLowerCase());

  try {
    const response = await axiosInstance.get(`/admin/members?${query.toString()}`);
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

/**
 * Get single member detail
 * @param {number|string} id
 */
export async function getAdminMemberById(id) {
  try {
    const response = await axiosInstance.get(`/admin/members/${id}`);
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function getAdminMemberSummary() {
  try {
    const response = await axiosInstance.get('/admin/members/summary');
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

async function getDashboardData(resource, params, signal) {
  try {
    const response = await axiosInstance.get(`/admin/dashboard/${resource}`, { params, signal });
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

export const getAdminDashboardOverview = (params, signal) => getDashboardData('overview', params, signal);
export const getAdminDashboardActivity = (params, signal) => getDashboardData('post-activity', params, signal);
export const getAdminDashboardCategories = (params, signal) => getDashboardData('top-categories', params, signal);

/**
 * Ban a member (FN39)
 * @param {number|string} id
 * @param {Object} data { reason: string, expiresAt: string|null }
 */
export async function banMember(id, data) {
  try {
    const response = await axiosInstance.post(`/admin/members/${id}/ban`, {
      reason: data.reason,
      expiresAt: data.expiresAt || null,
    });
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

/**
 * Unban a member (FN39)
 * @param {number|string} id
 * @param {Object} data { reason: string }
 */
export async function unbanMember(id, data) {
  try {
    const response = await axiosInstance.post(`/admin/members/${id}/unban`, {
      reason: data.reason || 'Account unbanned by administrator',
    });
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

/* ========================================================================= */
/* 2. ADMIN CATEGORIES API (FN40)                                            */
/* ========================================================================= */

/**
 * Get paginated list of categories (FN40)
 * @param {Object} params
 * @param {number} [params.pageIndex=1]
 * @param {number} [params.pageSize=20]
 * @param {string} [params.keyword]
 * @param {string} [params.postCategoryKind] 'recipe' | 'food' | 'topic'
 * @param {boolean} [params.isActive]
 */
export async function getAdminCategories(params = {}) {
  const { pageIndex = 1, pageSize = 50, keyword, postCategoryKind, isActive } = params;
  const query = new URLSearchParams();
  query.append('PageIndex', pageIndex);
  query.append('PageSize', pageSize);

  if (keyword) query.append('Keyword', keyword);
  if (postCategoryKind && postCategoryKind !== 'All') query.append('PostCategoryKind', postCategoryKind);
  if (isActive !== undefined && isActive !== null) query.append('IsActive', isActive);

  try {
    const response = await axiosInstance.get(`/admin/categories?${query.toString()}`);
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

/**
 * Get category by ID
 * @param {number|string} id
 */
export async function getAdminCategoryById(id) {
  try {
    const response = await axiosInstance.get(`/admin/categories/${id}`);
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

/**
 * Create a new category
 * @param {Object} data { name: string, slug: string, postCategoryKind: string }
 */
export async function createAdminCategory(data) {
  try {
    const response = await axiosInstance.post('/admin/categories', {
      name: data.name,
      slug: data.slug,
      postCategoryKind: data.postCategoryKind || 'recipe',
    });
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

/**
 * Update existing category
 * @param {number|string} id
 * @param {Object} data { name: string, slug: string, postCategoryKind: string }
 */
export async function updateAdminCategory(id, data) {
  try {
    const response = await axiosInstance.put(`/admin/categories/${id}`, {
      name: data.name,
      slug: data.slug,
      postCategoryKind: data.postCategoryKind || 'recipe',
    });
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

/**
 * Delete category (blocked if posts are linked)
 * @param {number|string} id
 */
export async function deleteAdminCategory(id) {
  try {
    const response = await axiosInstance.delete(`/admin/categories/${id}`);
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

/* ========================================================================= */
/* 3. ADMIN MODERATION & CONTENT API (FN41 - FN43)                          */
/* ========================================================================= */

/**
 * Get posts for moderation
 * @param {Object} params
 * @param {number} [params.pageIndex=1]
 * @param {number} [params.pageSize=20]
 * @param {string} [params.keyword]
 * @param {string} [params.status='pending_review'] 'pending_review' | 'all' | 'published' | 'rejected'
 */
export async function getAdminModerationPosts(params = {}) {
  const { pageIndex = 1, pageSize = 20, keyword, status = 'all' } = params;
  const query = new URLSearchParams();
  query.append('PageIndex', pageIndex);
  query.append('PageSize', pageSize);

  if (keyword) query.append('Keyword', keyword);
  if (status) query.append('Status', status);

  try {
    const response = await axiosInstance.get(`/admin/moderation/posts?${query.toString()}`);
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

/**
 * Get moderation post detail
 * @param {number|string} id
 */
export async function getAdminModerationPostDetail(id) {
  try {
    const response = await axiosInstance.get(`/admin/moderation/posts/${id}`);
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

/**
 * Submit moderation decision on a post (FN41)
 * @param {number|string} id
 * @param {Object} data { action: 'approve' | 'reject', reason: string, expectedRevision: number }
 */
export async function decideModerationPost(id, data) {
  try {
    const response = await axiosInstance.post(`/admin/moderation/posts/${id}/decision`, {
      action: data.action,
      reason: data.reason,
      expectedRevision: data.expectedRevision || 1,
    });
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

/**
 * Get AI flagged queue (FN42)
 * @param {Object} params
 * @param {number} [params.pageIndex=1]
 * @param {number} [params.pageSize=20]
 * @param {number} [params.postId]
 * @param {number} [params.minConfidence]
 */
export async function getAdminAiFlags(params = {}) {
  const { pageIndex = 1, pageSize = 20, postId, minConfidence } = params;
  const query = new URLSearchParams();
  query.append('PageIndex', pageIndex);
  query.append('PageSize', pageSize);

  if (postId) query.append('PostId', postId);
  if (minConfidence !== undefined) query.append('MinConfidence', minConfidence);

  try {
    const response = await axiosInstance.get(`/admin/moderation/ai-flags?${query.toString()}`);
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

/**
 * Decide AI flag (FN43)
 * @param {number|string} id
 * @param {Object} data { action: 'keep' | 'remove', reason: string, expectedRevision: number }
 */
export async function decideAiFlag(id, data) {
  try {
    const response = await axiosInstance.post(`/admin/moderation/ai-flags/${id}/decision`, {
      action: data.action,
      reason: data.reason,
      expectedRevision: data.expectedRevision || 1,
    });
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

/**
 * Get post reports
 * @param {Object} params
 * @param {number} [params.pageIndex=1]
 * @param {number} [params.pageSize=20]
 * @param {string} [params.status='pending'] 'pending' | 'dismissed' | 'resolved' | 'all'
 * @param {number} [params.postId]
 */
export async function getAdminPostReports(params = {}) {
  const { pageIndex = 1, pageSize = 20, status = 'pending', postId } = params;
  const query = new URLSearchParams();
  query.append('PageIndex', pageIndex);
  query.append('PageSize', pageSize);

  if (status) query.append('Status', status);
  if (postId) query.append('PostId', postId);

  try {
    const response = await axiosInstance.get(`/admin/moderation/reports?${query.toString()}`);
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function getAdminPostReportDetail(id) {
  try {
    const response = await axiosInstance.get(`/admin/moderation/reports/${id}`);
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

/**
 * Decide on post report
 * @param {number|string} id
 * @param {Object} data { action: 'dismiss' | 'keep' | 'remove', reason: string, expectedRevision: number }
 */
export async function decidePostReport(id, data) {
  try {
    const response = await axiosInstance.post(`/admin/moderation/reports/${id}/decision`, {
      action: data.action,
      reason: data.reason,
      expectedRevision: data.expectedRevision || 1,
    });
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function getAdminCommentReports(params = {}) {
  const { pageIndex = 1, pageSize = 20, status = 'pending' } = params;
  const query = new URLSearchParams({
    PageIndex: String(pageIndex),
    PageSize: String(pageSize),
    Status: status,
  });

  try {
    const response = await axiosInstance.get(`/admin/moderation/comment-reports?${query.toString()}`);
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function getAdminCommentReportDetail(id) {
  try {
    const response = await axiosInstance.get(`/admin/moderation/comment-reports/${id}`);
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

export async function decideCommentReport(id, data) {
  try {
    const response = await axiosInstance.post(`/admin/moderation/comment-reports/${id}/decision`, {
      action: data.action,
      reason: data.reason,
    });
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

/* ========================================================================= */
/* 4. ADMIN AUDIT LOGS API (FN44)                                            */
/* ========================================================================= */

/**
 * Get paginated list of audit logs (FN44)
 * @param {Object} params
 * @param {number} [params.pageIndex=1]
 * @param {number} [params.pageSize=20]
 * @param {number} [params.adminId]
 * @param {string} [params.action]
 * @param {string} [params.targetType]
 * @param {string} [params.targetId]
 * @param {string} [params.from] ISO timestamp
 * @param {string} [params.to] ISO timestamp
 */
export async function getAdminAuditLogs(params = {}) {
  const { pageIndex = 1, pageSize = 20, adminId, action, targetType, targetId, from, to } = params;
  const query = new URLSearchParams();
  query.append('PageIndex', pageIndex);
  query.append('PageSize', pageSize);

  if (adminId) query.append('AdminId', adminId);
  if (action) query.append('Action', action);
  if (targetType) query.append('TargetType', targetType);
  if (targetId) query.append('TargetId', targetId);
  if (from) query.append('From', from);
  if (to) query.append('To', to);

  try {
    const response = await axiosInstance.get(`/admin/audit-logs?${query.toString()}`);
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}

/**
 * Get audit log by ID
 * @param {number|string} id
 */
export async function getAdminAuditLogById(id) {
  try {
    const response = await axiosInstance.get(`/admin/audit-logs/${id}`);
    return response.data;
  } catch (err) {
    throw extractError(err);
  }
}
