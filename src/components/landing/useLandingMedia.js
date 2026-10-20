import { useCallback, useSyncExternalStore } from 'react';

// Keep optional cinematic scenes responsive to live viewport/accessibility changes.
export default function useLandingMedia(query) {
  const subscribe = useCallback(listener => {
    if (typeof window.matchMedia !== 'function') return () => {};
    const media = window.matchMedia(query);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  const snapshot = useCallback(() => typeof window.matchMedia === 'function' && window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, snapshot, () => false);
}
