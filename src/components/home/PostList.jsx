import React, { useState, useRef, useCallback } from 'react';
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
  hasMore = false,
  loadingMore = false,
  loadMoreError = null,
  onAuthRequired,
  onOpenProfilePreview: externalOpenProfilePreview,
}) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.05 });

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

  if (!posts || posts.length === 0) return null;

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
          <span className="text-vh-forest font-semibold border-b-2 border-vh-forest pb-1">
            Latest Posts
          </span>
          <span
            className="text-vh-text-secondary/50 cursor-not-allowed pb-1 select-none hidden sm:inline"
            title="Trending feed is planned for a future update"
          >
            Trending (Coming soon)
          </span>
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
      
      {/* Load More Section */}
      {hasMore && (
        <div 
          className={`mt-10 flex flex-col items-center justify-center gap-3 transform transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {loadMoreError && (
            <p className="text-sm font-dm-sans text-vh-error">
              {loadMoreError} — please try again.
            </p>
          )}

          <button 
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className={`h-12 px-8 rounded-full border border-vh-forest font-dm-sans text-[15px] font-medium transition-all duration-300 focus-ring-vh flex items-center justify-center gap-2.5 ${
              loadingMore 
                ? 'bg-vh-mint/40 text-vh-forest cursor-wait border-vh-sage' 
                : 'bg-transparent text-vh-forest hover:bg-vh-forest hover:text-white hover:-translate-y-0.5 hover:shadow-md active:scale-95 motion-reduce:transform-none cursor-pointer'
            }`}
          >
            {loadingMore ? (
              <>
                <span className="w-4 h-4 border-2 border-vh-forest border-t-transparent rounded-full animate-spin" />
                <span>Harvesting Recipes...</span>
              </>
            ) : (
              <span>Load More Recipes</span>
            )}
          </button>
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
