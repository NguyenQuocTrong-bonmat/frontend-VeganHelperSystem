import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUtils';
import { formatDate } from '../../utils/dateUtils';
import { toggleLike, toggleSave } from '../../services/interactionService';
import { fetchPostDetailsWithCache, updatePostDetailsCache } from '../../services/postDetailsCache';
import UserProfilePreview from './UserProfilePreview';

function isVideoMedia(url) {
  if (!url || typeof url !== 'string') return false;
  const cleanUrl = url.split('?')[0].toLowerCase();
  return /\.(mp4|webm|ogg|mov|m4v)$/i.test(cleanUrl) || url.includes('/videos/') || url.includes('Screen_Recording');
}

/**
 * Facebook-style Inline Post Card for the VeganHelper Home feed.
 * Features:
 * - Direct inline reading with "See more" / "See less".
 * - Inline image with Lightbox zoom trigger (stops propagation).
 * - Real Like and Save APIs with optimistic updates and error rollback.
 * - Comment action button that triggers the comment modal.
 * - Profile preview popover when clicking author avatar or name.
 * - Explicit navigation to Post Detail.
 * - Graceful post detail fetching via bounded cache & concurrency queue.
 */
export default function InlinePostCard({
  post,
  isGuest = false,
  onAuthRequired,
  onOpenComments,
  onOpenLightbox,
  onOpenProfilePreview,
}) {
  const navigate = useNavigate();
  const commentButtonRef = useRef(null);

  // Expanded text toggle
  const [isExpanded, setIsExpanded] = useState(false);
  const [mediaError, setMediaError] = useState(false);

  // Cached detailed post information (content, likeCount, isLiked, isSaved, recipe metadata)
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Interaction states
  const [isLiked, setIsLiked] = useState(Boolean(post.isLiked));
  const [likeCount, setLikeCount] = useState(Number(post.likeCount) || 0);
  const [isLikeUpdating, setIsLikeUpdating] = useState(false);

  const [isSaved, setIsSaved] = useState(Boolean(post.isSaved));
  const [isSaveUpdating, setIsSaveUpdating] = useState(false);

  const [commentCount, setCommentCount] = useState(Number(post.commentCount) || 0);

  // Local profile preview popover state (when no container-level modal is passed)
  const [localProfilePreview, setLocalProfilePreview] = useState({
    isOpen: false,
    triggerEl: null,
  });

  const handleAuthorClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    let authorId = post.authorId || details?.authorId;
    let authorName = post.authorName || details?.authorName;
    let avatarUrl = post.avatarUrl || details?.avatarUrl;

    if (!authorId && postId) {
      try {
        const full = await fetchPostDetailsWithCache(postId);
        if (full?.authorId) {
          authorId = full.authorId;
          authorName = full.authorName || authorName;
          avatarUrl = full.avatarUrl || avatarUrl;
        }
      } catch (err) {
        console.error('Failed to resolve author for profile preview:', err);
      }
    }

    if (!authorId) return;

    const authorData = {
      id: authorId,
      displayName: authorName,
      avatarUrl: avatarUrl,
    };

    if (onOpenProfilePreview) {
      onOpenProfilePreview(authorData, e.currentTarget);
    } else {
      setLocalProfilePreview({
        isOpen: true,
        triggerEl: e.currentTarget,
      });
    }
  };

  const postId = post.id;
  const postLink = isGuest ? `/posts/${postId}/guest` : `/posts/${postId}`;

  // Fetch full details if needed (for content, recipe metadata, and authoritative like/save status)
  useEffect(() => {
    let isCancelled = false;

    async function loadDetails() {
      // If post already has full content and interactions, use it
      if (post.content && post.likeCount !== undefined && post.isLiked !== undefined) {
        setDetails(post);
        setIsLiked(Boolean(post.isLiked));
        setLikeCount(Number(post.likeCount) || 0);
        setIsSaved(Boolean(post.isSaved));
        return;
      }

      setDetailsLoading(true);
      try {
        const full = await fetchPostDetailsWithCache(postId);
        if (!isCancelled && full) {
          setDetails(full);
          if (full.isLiked !== undefined) setIsLiked(Boolean(full.isLiked));
          if (full.likeCount !== undefined) setLikeCount(Number(full.likeCount) || 0);
          if (full.isSaved !== undefined) setIsSaved(Boolean(full.isSaved));
        }
      } catch (err) {
        // Silently keep basic metadata on network error
      } finally {
        if (!isCancelled) setDetailsLoading(false);
      }
    }

    loadDetails();

    return () => {
      isCancelled = true;
    };
  }, [postId, post]);

  // Handle Like
  const handleLike = async (e) => {
    e.stopPropagation();
    if (isGuest) {
      onAuthRequired?.();
      return;
    }
    if (isLikeUpdating) return;

    const previousLiked = isLiked;
    const previousCount = likeCount;

    // Optimistic UI update
    const nextLiked = !isLiked;
    const nextCount = Math.max(0, isLiked ? likeCount - 1 : likeCount + 1);

    setIsLiked(nextLiked);
    setLikeCount(nextCount);
    setIsLikeUpdating(true);

    try {
      const res = await toggleLike(postId);
      const authoritativeLiked = Boolean(res.isLiked);
      const authoritativeCount = res.likeCount !== undefined ? res.likeCount : nextCount;

      setIsLiked(authoritativeLiked);
      setLikeCount(authoritativeCount);

      // Keep cache in sync
      updatePostDetailsCache(postId, (prev) => ({
        ...prev,
        isLiked: authoritativeLiked,
        likeCount: authoritativeCount,
      }));
    } catch (err) {
      // Rollback on error
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      toast.error('Failed to update like. Please try again.');
    } finally {
      setIsLikeUpdating(false);
    }
  };

  // Handle Save
  const handleSave = async (e) => {
    e.stopPropagation();
    if (isGuest) {
      onAuthRequired?.();
      return;
    }
    if (isSaveUpdating) return;

    const previousSaved = isSaved;
    const nextSaved = !isSaved;

    setIsSaved(nextSaved);
    setIsSaveUpdating(true);

    try {
      const res = await toggleSave(postId);
      const authoritativeSaved = Boolean(res.isSaved);
      setIsSaved(authoritativeSaved);

      if (authoritativeSaved) {
        toast.success('Saved to your collection');
      } else {
        toast.success('Removed from your collection');
      }

      // Keep cache in sync
      updatePostDetailsCache(postId, (prev) => ({
        ...prev,
        isSaved: authoritativeSaved,
      }));
    } catch (err) {
      // Rollback on error
      setIsSaved(previousSaved);
      toast.error('Failed to update saved collection.');
    } finally {
      setIsSaveUpdating(false);
    }
  };

  // Handle Share
  const handleShare = async (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${postLink}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Post link copied to clipboard!');
      } else {
        toast.success(shareUrl);
      }
    } catch {
      toast.success('Post link ready to share');
    }
  };

  // Resolve media URL
  const rawThumbnail = details?.media?.[0]?.mediaUrl || post.thumbnailUrl;
  const resolvedMediaUrl = rawThumbnail ? getImageUrl(rawThumbnail) : null;
  const isVideo = isVideoMedia(rawThumbnail);

  // Content text
  const bodyText = details?.content || post.content || '';
  const isTextLong = bodyText.length > 240;
  const displayedText = isTextLong && !isExpanded
    ? `${bodyText.slice(0, 240).trim()}...`
    : bodyText;

  // Optional cooking metadata
  const cookingTime = details?.cookingTimeMins;
  const prepTime = details?.prepTimeMins;
  const difficulty = details?.difficultyLevel;
  const dietType = details?.dietType;
  const ingredientsCount = details?.ingredients?.length;

  return (
    <>
      <article
        className="w-full bg-vh-surface border border-vh-border/75 hover:border-vh-sage/60 rounded-card-lg shadow-xs hover:shadow-md transition-all duration-200 text-left overflow-hidden flex flex-col"
        aria-labelledby={`post-title-${postId}`}
      >
        {/* 1. Post Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-vh-border/40">
          <div className="flex items-center gap-3 min-w-0">
            {/* Author avatar */}
            <button
              type="button"
              onClick={handleAuthorClick}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-vh-mint/60 border border-vh-border flex items-center justify-center shrink-0 overflow-hidden focus-ring-vh active:scale-95 motion-reduce:transform-none cursor-pointer"
              aria-label={`View ${post.authorName || 'author'}'s profile`}
            >
              {post.avatarUrl ? (
                <img src={getImageUrl(post.avatarUrl)} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="font-semibold text-sm text-vh-forest">
                  {post.authorName ? post.authorName.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAuthorClick}
                  className="font-dm-sans font-semibold text-sm sm:text-base text-vh-text-primary hover:text-vh-forest truncate text-left transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest rounded px-0.5 active:opacity-80"
                >
                  {post.authorName || 'Anonymous'}
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs font-dm-sans text-vh-text-secondary mt-0.5">
                <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                {post.categoryName && (
                  <>
                    <span>•</span>
                    <span>{post.categoryName}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Explicit View Link */}
          <Link
            to={postLink}
            className="text-xs font-dm-sans font-medium text-vh-forest hover:text-vh-sage px-3 py-1.5 rounded-full hover:bg-vh-mint/40 transition-colors shrink-0 cursor-pointer inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest active:scale-95 motion-reduce:transform-none"
          >
            View Post →
          </Link>
        </div>

        {/* 2. Post Title & Body */}
        <div className="px-4 sm:px-5 pt-4 pb-2">
          <h2 id={`post-title-${postId}`} className="leading-snug mb-2.5">
            <Link
              to={postLink}
              className="font-dm-serif text-xl sm:text-2xl font-medium text-vh-text-primary hover:text-vh-forest transition-colors cursor-pointer block focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest rounded"
            >
              {post.title}
            </Link>
          </h2>

          {bodyText ? (
            <div className="text-sm sm:text-[15px] font-dm-sans text-vh-text-primary/90 leading-relaxed space-y-2">
              <p className="whitespace-pre-wrap break-words">{displayedText}</p>
              {isTextLong && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className="text-xs font-semibold text-vh-forest hover:underline focus-ring-vh inline-block cursor-pointer pt-0.5 active:opacity-80"
                >
                  {isExpanded ? 'See less' : 'See more'}
                </button>
              )}
            </div>
          ) : detailsLoading ? (
            <div className="h-4 w-3/4 bg-vh-cream animate-pulse rounded my-2" />
          ) : null}
        </div>

        {/* 3. Cooking/Recipe Metadata Badges (if present) */}
        {(cookingTime || prepTime || difficulty || dietType || ingredientsCount) && (
          <div className="px-4 sm:px-5 py-2.5 flex flex-wrap items-center gap-2 text-xs font-dm-sans">
            {cookingTime && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-vh-cream border border-vh-border/70 text-vh-text-primary">
                <svg className="w-3.5 h-3.5 text-vh-forest" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Cook: {cookingTime}m</span>
              </span>
            )}
            {prepTime && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-vh-cream border border-vh-border/70 text-vh-text-primary">
                <span>Prep: {prepTime}m</span>
              </span>
            )}
            {difficulty && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-vh-mint/40 border border-vh-border/70 text-vh-forest font-medium">
                <span>Level: {difficulty}</span>
              </span>
            )}
            {dietType && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-vh-mint/40 border border-vh-border/70 text-vh-forest font-medium">
                <span>{dietType}</span>
              </span>
            )}
            {ingredientsCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-vh-cream border border-vh-border/70 text-vh-text-secondary">
                <span>{ingredientsCount} ingredients</span>
              </span>
            )}
          </div>
        )}

        {/* 4. Media Section */}
        {resolvedMediaUrl && !mediaError && (
          <div className="mt-2.5 w-full bg-vh-mint/20 border-y border-vh-border/60 relative overflow-hidden flex items-center justify-center max-h-[500px]">
            {isVideo ? (
              <video
                src={resolvedMediaUrl}
                className="w-full max-h-[500px] object-cover sm:object-contain bg-black/5"
                controls
                playsInline
                preload="metadata"
                onError={() => setMediaError(true)}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                src={resolvedMediaUrl}
                alt={post.title}
                className="w-full max-h-[500px] object-cover sm:object-contain cursor-zoom-in transition-transform duration-200 ease-out hover:scale-[1.03] motion-reduce:transform-none"
                loading="lazy"
                onError={() => setMediaError(true)}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenLightbox?.(resolvedMediaUrl, post.title);
                }}
              />
            )}
          </div>
        )}

        {/* 5. Engagement Counts Row */}
        <div className="px-4 sm:px-5 py-2.5 flex items-center justify-between text-xs font-dm-sans text-vh-text-secondary border-b border-vh-border/40">
          <div className="flex items-center gap-1.5">
            {likeCount > 0 && (
              <span className="flex items-center gap-1 text-vh-forest font-medium">
                <span className="w-4 h-4 rounded-full bg-vh-forest text-white flex items-center justify-center text-[10px]">
                  ♥
                </span>
                <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenComments?.(post, commentButtonRef, (newCount) => setCommentCount(newCount));
              }}
              className="hover:underline hover:text-vh-forest transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest rounded px-1 active:opacity-80"
            >
              {commentCount > 0 ? `${commentCount} comments` : 'Leave a comment'}
            </button>
            <span>•</span>
            <span>{post.viewCount || 0} views</span>
          </div>
        </div>

        {/* 6. Social Action Bar */}
        <div className="px-1.5 sm:px-4 py-1.5 flex items-center justify-between gap-0.5 sm:gap-1 text-[11px] min-[360px]:text-xs sm:text-sm font-dm-sans font-medium text-vh-text-secondary">
          {/* Like Button */}
          <button
            type="button"
            onClick={handleLike}
            disabled={isLikeUpdating}
            aria-label={isLiked ? 'Unlike post' : 'Like post'}
            className={`flex-1 py-2 sm:py-2.5 px-1 sm:px-2 rounded-lg flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap transition-all cursor-pointer focus-ring-vh active:scale-95 motion-reduce:transform-none disabled:active:scale-100 ${isLiked
                ? 'text-vh-error bg-vh-error/10 hover:bg-vh-error/15 font-semibold'
                : 'hover:bg-vh-cream hover:text-vh-forest text-vh-text-secondary'
              }`}
          >
            <svg
              className={`w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4 sm:w-5 sm:h-5 shrink-0 transition-transform active:scale-125 ${isLiked ? 'fill-current' : 'fill-none'
                }`}
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <span>{isLiked ? 'Liked' : 'Like'}</span>
          </button>

          {/* Comment Button */}
          <button
            ref={commentButtonRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenComments?.(post, commentButtonRef, (newCount) => setCommentCount(newCount));
            }}
            aria-label="Open comments dialog"
            className="flex-1 py-2 sm:py-2.5 px-1 sm:px-2 rounded-lg flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap hover:bg-vh-cream hover:text-vh-forest transition-colors cursor-pointer focus-ring-vh active:scale-95 motion-reduce:transform-none"
          >
            <svg className="w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.861-.861 5.973 5.973 0 011.058-2.035C4.03 16.556 3 14.417 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
            <span>Comment</span>
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaveUpdating}
            aria-label={isSaved ? 'Remove recipe from saved' : 'Save recipe'}
            className={`flex-1 py-2 sm:py-2.5 px-1 sm:px-2 rounded-lg flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap transition-all cursor-pointer focus-ring-vh active:scale-95 motion-reduce:transform-none disabled:active:scale-100 ${isSaved
                ? 'text-vh-forest bg-vh-mint/40 font-semibold'
                : 'hover:bg-vh-cream hover:text-vh-forest text-vh-text-secondary'
              }`}
          >
            <svg
              className={`w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4 sm:w-5 sm:h-5 shrink-0 ${isSaved ? 'fill-current' : 'fill-none'}`}
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
              />
            </svg>
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share post link"
            className="flex-1 py-2 sm:py-2.5 px-1 sm:px-2 rounded-lg flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap hover:bg-vh-cream hover:text-vh-forest transition-colors cursor-pointer focus-ring-vh active:scale-95 motion-reduce:transform-none"
          >
            <svg className="w-3.5 h-3.5 min-[360px]:w-4 min-[360px]:h-4 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
              />
            </svg>
            <span>Share</span>
          </button>
        </div>
      </article>

      {/* Fallback local profile preview if no container-level modal is provided */}
      {!onOpenProfilePreview && (
        <UserProfilePreview
          isOpen={localProfilePreview.isOpen}
          onClose={() => setLocalProfilePreview({ isOpen: false, triggerEl: null })}
          userId={post.authorId || details?.authorId}
          initialUser={{
            id: post.authorId || details?.authorId,
            displayName: post.authorName || details?.authorName,
            avatarUrl: post.avatarUrl || details?.avatarUrl,
          }}
          triggerEl={localProfilePreview.triggerEl}
          isGuest={isGuest}
          onAuthRequired={onAuthRequired}
        />
      )}
    </>
  );
}
