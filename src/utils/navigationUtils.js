/**
 * Navigation utilities for header logo and brand actions.
 * Navigates to the designated home page, resets scroll position to the top,
 * and forces a clean refresh/reload.
 */

export function navigateHomeAndRefresh(e, targetUrl = '/home') {
  // Allow browser default behavior for modified clicks (e.g. Ctrl/Cmd+click, middle click)
  if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (e.button && e.button !== 0))) {
    return;
  }

  if (e && typeof e.preventDefault === 'function') {
    e.preventDefault();
  }

  // Prevent browser from restoring old scroll position on reload
  if (typeof window !== 'undefined') {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const currentPath = window.location.pathname;
    const hasQueryOrHash = Boolean(window.location.search || window.location.hash);

    if (currentPath === targetUrl && !hasQueryOrHash) {
      window.location.reload();
    } else {
      window.location.href = targetUrl;
    }
  }
}
