import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import InlinePostCard from './InlinePostCard';
import CommentModal from './CommentModal';
import ImageLightbox from '../ui/ImageLightbox';
import UserProfilePreview from './UserProfilePreview';

const FEED_TABS = [
  { id: 'trending', label: 'Trending' },
  { id: 'latest', label: 'Latest' },
  { id: 'following', label: 'Following' },
];

/**
 * Facebook-style vertical single-column timeline feed for VeganHelper Home.
 * Hosts the inline post cards, comment modal, image lightbox, and profile preview popover.
 */
export default function PostList({ 
  posts = [], 
  loading = false,
  feedError = null,
  onRetryFeed,
  isGuest = false,
  isAuthenticated = false,
  onLoadMore,
  onRetryLoadMore,
  sortBy = 'trending',
  onSortChange,
  isFollowingEmpty = false,
  hasMore = false,
  loadingMore = false,
  loadMoreError = null,
  onAuthRequired,
  onClearFilters,
  onOpenProfilePreview: externalOpenProfilePreview,
}) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.05 });
  const loadSentinelRef = useRef(null);

  useEffect(() => {
    if (!hasMore || loadingMore || loadMoreError || !onLoadMore || !loadSentinelRef.current ||
        typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onLoadMore();
    }, { rootMargin: '400px 0px' });
    observer.observe(loadSentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadMoreError, onLoadMore, posts.length]);

  const handleTabKeyDown = (e, index) => {
    let nextIndex = null;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % FEED_TABS.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + FEED_TABS.length) % FEED_TABS.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = FEED_TABS.length - 1;
    }
    if (nextIndex !== null) {
      e.preventDefault();
      const targetTab = FEED_TABS[nextIndex];
      const targetEl = document.getElementById(`feed-tab-${targetTab.id}`);
      targetEl?.focus();
      if (targetTab.id === 'following' && (isGuest || !isAuthenticated)) {
        onAuthRequired?.('Log in to follow creators and see their latest posts.');
        return;
      }
      onSortChange?.(targetTab.id);
    }
  };

  // Comment Modal state
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [commentTriggerRef, setCommentTriggerRef] = useState(null);
  const countCallbackRef = useRef(null);

  // Profile Preview Popover state
  const [profilePreviewState, setProfilePreviewState] = useState({
    isOpen: false,
    user: null,
    triggerEl: null,
  });

  const handleOpenProfilePreview = useCallback((user, triggerEl) => {
    if (externalOpenProfilePreview) {
      externalOpenProfilePreview(user, triggerEl);
    } else {
      setProfilePreviewState({
        isOpen: true,
        user,
        triggerEl,
      });
    }
  }, [externalOpenProfilePreview]);

  const handleCloseProfilePreview = useCallback(() => {
    setProfilePreviewState({
      isOpen: false,
      user: null,
      triggerEl: null,
    });
  }, []);

  // Lightbox state
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    src: null,
    alt: null,
  });

  const handleOpenComments = useCallback((post, triggerRef, countUpdater) => {
    setActiveCommentPost(post);
    setCommentTriggerRef(triggerRef);
    countCallbackRef.current = countUpdater;
  }, []);

  const handleCloseComments = useCallback(() => {
    setActiveCommentPost(null);
    countCallbackRef.current = null;
  }, []);

  const handleCommentCountChange = useCallback((newCount) => {
    if (typeof countCallbackRef.current === 'function') {
      countCallbackRef.current(newCount);
    }
  }, []);

  const handleOpenLightbox = useCallback((src, alt) => {
    setLightboxState({
      isOpen: true,
      src,
      alt,
    });
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxState({
      isOpen: false,
      src: null,
      alt: null,
    });
  }, []);

  return (
    <section ref={ref} aria-labelledby="explore-recipes-heading" className="w-full">
      {/* Feed Heading and Tabs */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 transform transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <h2 id="explore-recipes-heading" className="font-dm-serif text-2xl sm:text-3xl font-medium text-vh-text-primary">
          Community Feed
        </h2>
        <div
          role="tablist"
          aria-label="Community Feed Tabs"
          className="flex items-center gap-2 sm:gap-5 text-[14px] font-dm-sans text-vh-text-secondary overflow-x-auto no-scrollbar max-w-full pb-1"
        >
          {FEED_TABS.map((tab, index) => {
            const isActive = sortBy === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`feed-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls="community-feed-panel"
                tabIndex={isActive ? 0 : -1}
                onKeyDown={(e) => handleTabKeyDown(e, index)}
                onClick={() => {
                  if (tab.id === 'following' && (isGuest || !isAuthenticated)) {
                    onAuthRequired?.('Log in to follow creators and see their latest posts.');
                    return;
                  }
                  onSortChange?.(tab.id);
                }}
                className={`pb-1 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:ring-offset-2 rounded-xs whitespace-nowrap ${
                  isActive
                    ? 'text-vh-forest font-semibold border-b-2 border-vh-forest'
                    : 'hover:text-vh-forest'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Vertical Single-Column Timeline or Following/Empty State */}
      <div id="community-feed-panel" role="tabpanel" aria-labelledby={`feed-tab-${sortBy}`} className="w-full">
        {loading ? (
          <div className="w-full py-16 flex flex-col items-center justify-center text-vh-text-secondary gap-3 bg-vh-surface/50 rounded-card border border-vh-border/40" role="status" aria-live="polite">
            <div className="w-9 h-9 border-3 border-vh-mint border-t-vh-forest rounded-full animate-spin"></div>
            <p className="font-dm-sans text-sm">Loading posts...</p>
          </div>
        ) : feedError ? (
          <div className="w-full py-14 px-6 flex flex-col items-center justify-center text-center bg-vh-surface/60 rounded-card border border-vh-border/60 gap-3">
            <p className="font-dm-sans text-sm text-vh-error">{feedError}</p>
            {onRetryFeed && (
              <button
                type="button"
                onClick={onRetryFeed}
                className="px-5 py-2.5 bg-vh-forest text-white rounded-full font-dm-sans text-xs font-semibold hover:bg-vh-sage transition-colors shadow-sm cursor-pointer"
              >
                Try again
              </button>
            )}
          </div>
        ) : sortBy === 'following' && isFollowingEmpty ? (
          <div className="w-full py-16 px-6 flex flex-col items-center justify-center text-center bg-vh-surface/60 rounded-card border border-vh-border/60">
            <div className="w-16 h-16 mb-4 bg-vh-mint/80 rounded-full flex items-center justify-center text-2xl text-vh-forest shadow-xs">
              <svg className="w-8 h-8 text-vh-forest" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            </div>
            <h3 className="font-dm-serif text-2xl text-vh-text-primary mb-2">
              Your feed starts with the people you follow.
            </h3>
            <p className="font-dm-sans text-vh-text-secondary mb-6 max-w-md text-sm leading-relaxed">
              Follow other cooks and creators in the community to see their latest recipes and stories right here.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onSortChange?.('trending')}
                className="px-5 py-2.5 bg-vh-forest text-white rounded-full font-dm-sans text-xs font-semibold hover:bg-vh-sage active:scale-95 motion-reduce:transform-none transition-all shadow-sm cursor-pointer focus-ring-vh"
              >
                Explore Trending Recipes
              </button>
            </div>
          </div>
        ) : sortBy === 'following' && posts.length === 0 ? (
          <div className="w-full py-16 px-6 flex flex-col items-center justify-center text-center bg-vh-surface/60 rounded-card border border-vh-border/60">
            <div className="w-16 h-16 mb-4 bg-vh-mint/80 rounded-full flex items-center justify-center text-2xl">🌱</div>
            <h3 className="font-dm-serif text-2xl text-vh-text-primary mb-2">
              No posts from followed creators yet
            </h3>
            <p className="font-dm-sans text-vh-text-secondary mb-6 max-w-md text-sm leading-relaxed">
              The people you follow haven't posted any recipes matching your current filters. Check back soon or explore trending posts!
            </p>
            <button
              type="button"
              onClick={() => onSortChange?.('trending')}
              className="px-5 py-2.5 bg-vh-forest text-white rounded-full font-dm-sans text-xs font-semibold hover:bg-vh-sage transition-all shadow-sm cursor-pointer focus-ring-vh"
            >
              Explore Trending Recipes
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="w-full py-16 px-6 flex flex-col items-center justify-center text-center bg-vh-surface/60 rounded-card border border-vh-border/60">
            <div className="w-16 h-16 mb-4 bg-vh-mint/80 rounded-full flex items-center justify-center text-2xl">🌱</div>
            <h3 className="font-dm-serif text-2xl text-vh-text-primary mb-2">The garden is still growing</h3>
            <p className="font-dm-sans text-vh-text-secondary mb-6 max-w-md text-sm leading-relaxed">
              We couldn't find any posts matching your current filters. Try exploring other categories.
            </p>
            {onClearFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="px-5 py-2.5 bg-vh-forest text-white rounded-full font-dm-sans text-xs font-semibold hover:bg-vh-sage transition-colors shadow-sm cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6 w-full">
            {posts.map((post) => (
              <InlinePostCard
                key={post.id}
                post={post}
                isGuest={isGuest}
                onAuthRequired={onAuthRequired}
                onOpenComments={handleOpenComments}
                onOpenLightbox={handleOpenLightbox}
                onOpenProfilePreview={handleOpenProfilePreview}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Automatically request the next page near the end of the feed. */}
      {hasMore && (
        <div ref={loadSentinelRef} className="mt-10 flex flex-col items-center justify-center gap-3 min-h-14" role="status" aria-live="polite">
          {loadMoreError && (
            <>
              <p className="text-sm font-dm-sans text-vh-error">{loadMoreError}</p>
              <button type="button" onClick={onRetryLoadMore} className="text-vh-forest underline font-dm-sans text-sm focus-ring-vh">Try again</button>
            </>
          )}
          {loadingMore && <span className="flex items-center gap-2 text-sm font-dm-sans text-vh-forest"><span className="w-4 h-4 border-2 border-vh-forest border-t-transparent rounded-full animate-spin" /> Loading posts...</span>}
          {!loadMoreError && !loadingMore && typeof IntersectionObserver === 'undefined' &&
            <button type="button" onClick={onLoadMore} className="text-vh-forest underline font-dm-sans text-sm focus-ring-vh">Load more posts</button>}
        </div>
      )}

      {/* Shared Comment Modal */}
      <CommentModal
        isOpen={Boolean(activeCommentPost)}
        onClose={handleCloseComments}
        post={activeCommentPost}
        isGuest={isGuest}
        onAuthRequired={onAuthRequired}
        onCommentCountChange={handleCommentCountChange}
        triggerRef={commentTriggerRef}
      />

      {/* Shared Image Lightbox */}
      <ImageLightbox
        isOpen={lightboxState.isOpen}
        src={lightboxState.src}
        alt={lightboxState.alt}
        onClose={handleCloseLightbox}
      />

      {/* Shared User Profile Preview Popover */}
      {!externalOpenProfilePreview && (
        <UserProfilePreview
          isOpen={profilePreviewState.isOpen}
          onClose={handleCloseProfilePreview}
          userId={profilePreviewState.user?.id}
          initialUser={profilePreviewState.user}
          triggerEl={profilePreviewState.triggerEl}
          isGuest={isGuest}
          onAuthRequired={onAuthRequired}
        />
      )}
    </section>
  );
}
