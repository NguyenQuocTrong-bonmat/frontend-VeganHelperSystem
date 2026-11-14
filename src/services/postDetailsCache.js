import { getPostDetail } from './postService';
import { getAccessToken } from '../utils/authStorage';

const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_CONCURRENT_REQUESTS = 3;
const cache = new Map();
const pendingRequests = new Map();
const requestQueue = [];
let activeRequestsCount = 0;
let sessionToken = getAccessToken();
let generation = 0;

function currentGeneration() {
  const token = getAccessToken();
  if (token !== sessionToken) {
    sessionToken = token;
    generation++;
    cache.clear();
    pendingRequests.clear();
  }
  return generation;
}

function processQueue() {
  while (activeRequestsCount < MAX_CONCURRENT_REQUESTS && requestQueue.length) {
    const job = requestQueue.shift();
    if (job.generation !== currentGeneration()) {
      job.reject(new Error('Post request belongs to a previous session.'));
      continue;
    }
    activeRequestsCount++;
    Promise.resolve().then(() => {
      if (job.generation !== currentGeneration()) throw new Error('Session changed before loading post.');
      return getPostDetail(job.postId);
    }).then(data => {
      if (job.generation !== currentGeneration()) throw new Error('Session changed while loading post.');
      cache.set(job.key, { data, timestamp: Date.now() });
      job.resolve(data);
    }).catch(job.reject).finally(() => {
      activeRequestsCount--;
      pendingRequests.delete(job.key);
      processQueue();
    });
  }
}

export function fetchPostDetailsWithCache(postId) {
  if (!postId) return Promise.reject(new Error('Missing postId'));
  const scope = currentGeneration();
  const key = `${scope}:${postId}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) return Promise.resolve(cached.data);
  if (pendingRequests.has(key)) return pendingRequests.get(key);
  const promise = new Promise((resolve, reject) => {
    requestQueue.push({ postId, key, generation: scope, resolve, reject });
    processQueue();
  });
  pendingRequests.set(key, promise);
  return promise;
}

export function getCachedPostDetails(postId) {
  const key = `${currentGeneration()}:${postId}`;
  const cached = cache.get(key);
  return cached && Date.now() - cached.timestamp < CACHE_TTL_MS ? cached.data : null;
}

export function updatePostDetailsCache(postId, updater) {
  if (!postId || typeof updater !== 'function') return null;
  const key = `${currentGeneration()}:${postId}`;
  const cached = cache.get(key);
  if (!cached?.data) return null;
  const data = updater(cached.data);
  cache.set(key, { ...cached, data });
  return data;
}

export function clearPostDetailsCache() {
  generation++;
  cache.clear();
  pendingRequests.clear();
  for (const job of requestQueue.splice(0)) job.reject(new Error('Post cache was cleared.'));
  // In-flight requests retain their slots and release them in finally.
}
