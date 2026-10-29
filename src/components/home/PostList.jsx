import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import InlinePostCard from './InlinePostCard';
import CommentModal from './CommentModal';
import ImageLightbox from '../ui/ImageLightbox';
import UserProfilePreview from './UserProfilePreview';

/**
 * Facebook-style vertical single-column timeline feed for VeganHelper Home.
 * Hosts the inline post cards, comment modal, image lightbox, and profile preview popover.
 */
export default function PostList({ 
  posts = [], 
  isGuest = false, 
  onLoadMore,
  onRetryLoadMore,
  sortBy = 'latest',
  onSortChange,
  hasMore = false,
  loadingMore = false,
  loadMoreError = null,
  onAuthRequired,
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
      {/* Feed Heading */}
      <div
        className={`flex items-center justify-between mb-6 transform transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <h2 id="explore-recipes-heading" className="font-dm-serif text-2xl sm:text-3xl font-medium text-vh-text-primary">
          Community Feed
        </h2>
        <div className="flex items-center gap-4 text-[14px] font-dm-sans text-vh-text-secondary">
          <button type="button" onClick={() => onSortChange?.('latest')} aria-pressed={sortBy === 'latest'}
            className={`pb-1 cursor-pointer focus-ring-vh ${sortBy === 'latest' ? 'text-vh-forest font-semibold border-b-2 border-vh-forest' : 'hover:text-vh-forest'}`}>
            Latest Posts
          </button>
          <button type="button" onClick={() => onSortChange?.('trending')} aria-pressed={sortBy === 'trending'}
            className={`pb-1 cursor-pointer focus-ring-vh ${sortBy === 'trending' ? 'text-vh-forest font-semibold border-b-2 border-vh-forest' : 'hover:text-vh-forest'}`}>
            Trending
          </button>
        </div>
      </div>
      
      {/* Vertical Single-Column Timeline */}
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
