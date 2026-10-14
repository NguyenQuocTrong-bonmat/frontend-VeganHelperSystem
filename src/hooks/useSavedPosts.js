import { useEffect, useRef, useState } from 'react';
import { getSavedPosts, toggleSave } from '../services/interactionService';
import toast from 'react-hot-toast';

// Rehydrate from the authenticated backend; never persist one user's saved IDs in local storage.
export default function useSavedPosts(enabled = true) {
  const [ids, setIds] = useState(new Set());
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);
  const [pending, setPending] = useState(new Set());
  const locks = useRef(new Set());
  const generation = useRef(0);
  useEffect(() => {
    const version = ++generation.current;
    setIds(new Set()); setError(false); setLoading(enabled);
    locks.current = new Set(); setPending(new Set());
    if (!enabled) return;
    async function load() {
      const collected = new Set();
      let page = 1;
      let pages = 1;
      do {
        const data = await getSavedPosts({ pageIndex: page, pageSize: 50 });
        if (generation.current !== version) return;
        if (!Array.isArray(data?.items) || !Number.isInteger(data.totalPages) || data.totalPages < 0) throw new Error('Invalid saved posts response');
        data.items.forEach(post => collected.add(String(post.postId)));
        pages = data.totalPages;
        page += 1;
      } while (page <= pages);
      if (generation.current === version) setIds(collected);
    }
    load().catch(() => { if (generation.current === version) setError(true); })
      .finally(() => { if (generation.current === version) setLoading(false); });
    return () => { generation.current += 1; };
  }, [enabled, revision]);
  async function toggle(postId) {
    const key = String(postId);
    if (!enabled || loading || error || locks.current.has(key)) return;
    const version = generation.current;
    locks.current.add(key); setPending(new Set(locks.current));
    try {
      const result = await toggleSave(postId);
      if (typeof result?.isSaved !== 'boolean') throw new Error('Invalid save response');
      if (generation.current !== version) return;
      setIds(previous => {
        const next = new Set(previous);
        if (result.isSaved) next.add(key); else next.delete(key);
        return next;
      });
      toast.success(result.isSaved ? 'Recipe saved to your collection' : 'Removed from saved posts');
    } catch {
      if (generation.current === version) toast.error('Unable to update saved status. Please try again.');
    } finally {
      if (generation.current === version) {
        locks.current.delete(key); setPending(new Set(locks.current));
      }
    }
  }
  return { isSaved: id => ids.has(String(id)), loading, error, pending, toggle, retry: () => setRevision(value => value + 1) };
}
