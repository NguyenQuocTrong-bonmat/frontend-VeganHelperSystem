import { getPostDetail } from './postService';

/**
 * In-memory bounded cache and deduplicated concurrency queue for post details.
 * Prevents redundant fetches and limits concurrency so the Home feed does not
 * flood the API when scrolling or loading multiple cards.
 */

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_CONCURRENT_REQUESTS = 3;

const cache = new Map();
const pendingRequests = new Map();
const requestQueue = [];
let activeRequestsCount = 0;

function processQueue() {
  if (activeRequestsCount >= MAX_CONCURRENT_REQUESTS || requestQueue.length === 0) {
    return;
  }

  const { postId, resolve, reject } = requestQueue.shift();
  activeRequestsCount++;

  getPostDetail(postId)
    .then((data) => {
      cache.set(String(postId), {
        data,
        timestamp: Date.now(),
      });
      resolve(data);
    })
    .catch((err) => {
      reject(err);
    })
    .finally(() => {
      activeRequestsCount--;
      pendingRequests.delete(String(postId));
      processQueue();
    });
}

/**
 * Fetch post details with cache, promise deduplication, and concurrency limiting.
 * @param {string|number} postId
 * @returns {Promise<Object>}
 */
export function fetchPostDetailsWithCache(postId) {
  if (!postId) return Promise.reject(new Error('Missing postId'));
  const key = String(postId);

  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return Promise.resolve(cached.data);
  }

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const promise = new Promise((resolve, reject) => {
    requestQueue.push({ postId, resolve, reject });
    processQueue();
  });

  pendingRequests.set(key, promise);
  return promise;
}

/**
 * Synchronously retrieves cached details if available and fresh.
 * @param {string|number} postId
 * @returns {Object|null}
 */
export function getCachedPostDetails(postId) {
  if (!postId) return null;
  const cached = cache.get(String(postId));
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }
  return null;
}

/**
 * Optimistically updates the cached post details (e.g. after like, save, or comment).
 * @param {string|number} postId
 * @param {Function} updater - (prevData) => updatedData
 * @returns {Object|null}
 */
export function updatePostDetailsCache(postId, updater) {
  if (!postId || typeof updater !== 'function') return null;
  const key = String(postId);
  const cached = cache.get(key);
  if (cached && cached.data) {
    const updatedData = updater(cached.data);
    cache.set(key, {
      ...cached,
      data: updatedData,
    });
    return updatedData;
  }
  return null;
}

/**
 * Clears the cache (useful for tests).
 */
export function clearPostDetailsCache() {
  cache.clear();
  pendingRequests.clear();
  requestQueue.length = 0;
  activeRequestsCount = 0;
}
