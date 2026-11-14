import { getAccessToken } from '../../utils/authStorage';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getImageUrl, isVideoMedia } from '../../utils/imageUtils';
import { formatDate } from '../../utils/dateUtils';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { fetchPostDetailsWithCache, updatePostDetailsCache } from '../../services/postDetailsCache';
import { toggleLike } from '../../services/interactionService';
import UserProfilePreview from './UserProfilePreview';

export default function FeaturedPost({ 
  post, 
  isTrending = false,
  isGuest = false,
  onOpenProfilePreview,
  onAuthRequired,
}) {
  const { ref, isVisible } = useScrollReveal();
  const videoRef = useRef(null);
  const [mediaError, setMediaError] = useState(false);
  const [likedState, setIsLiked] = useState(Boolean(post?.isLiked));
  const [likeCount, setLikeCount] = useState(Number(post?.likeCount) || 0);
  const isLiked = !isGuest && likedState;
  const [isLikeUpdating, setIsLikeUpdating] = useState(false);

  const [localProfilePreview, setLocalProfilePreview] = useState({
    isOpen: false,
    triggerEl: null,
    resolvedAuthor: null,
  });

  // Sync like count and liked status from post or cached details
  useEffect(() => {
    let cancelled = false;

    if (post?.likeCount !== undefined && post?.isLiked !== undefined) {
      setIsLiked(Boolean(post.isLiked));
      setLikeCount(Number(post.likeCount) || 0);
      return;
    }

    async function loadPostLikeStatus() {
      if (!post?.id) return;
      try {
        const full = await fetchPostDetailsWithCache(post.id);
        if (!cancelled && full) {
          if (full.isLiked !== undefined) setIsLiked(Boolean(full.isLiked));
          if (full.likeCount !== undefined) setLikeCount(Number(full.likeCount) || 0);
        }
      } catch {
        // Silently keep initial state
      }
    }

    loadPostLikeStatus();

    return () => {
      cancelled = true;
    };
  }, [post?.id, post?.isLiked, post?.likeCount, isGuest]);

  if (!post) return null;

  const linkTo = `/posts/${post.id}`;

  // Robust video candidate detection
  const isExplicitVideo = Boolean(
    post.mediaType === 'video' ||
    post.postType === 'video' ||
    post.media?.[0]?.mediaType === 'video'
  );

  const videoCandidate =
    post.videoUrl ||
    (isVideoMedia(post.thumbnailUrl) || isExplicitVideo ? post.thumbnailUrl : null) ||
    (isVideoMedia(post.mediaUrl) || isExplicitVideo ? post.mediaUrl : null) ||
    post.media?.find((m) => m.mediaType === 'video' || isVideoMedia(m.mediaUrl))?.mediaUrl;

  const resolvedVideoUrl = videoCandidate ? getImageUrl(videoCandidate) : null;
  const isVideo = Boolean(resolvedVideoUrl || isExplicitVideo || isVideoMedia(post.thumbnailUrl));

  // Robust image candidate detection
  const imageCandidate =
    (videoCandidate && post.thumbnailUrl && !isVideoMedia(post.thumbnailUrl) ? post.thumbnailUrl : null) ||
    (post.videoUrl && !isVideoMedia(post.thumbnailUrl) && !isExplicitVideo ? post.thumbnailUrl : null) ||
    post.posterUrl ||
    post.thumbnailImage ||
    (!isVideo ? (post.thumbnailUrl || post.mediaUrl || post.imageUrl || post.thumbnail) : null) ||
    post.media?.find((m) => (m.mediaType === 'image' || !isVideoMedia(m.mediaUrl)) && m.mediaUrl !== videoCandidate)?.mediaUrl;

  const resolvedImageUrl = imageCandidate ? getImageUrl(imageCandidate) : null;

  const handleAuthorClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    let authorId = post.authorId;
    let authorName = post.authorName;
    let avatarUrl = post.avatarUrl;

    if (!authorId && post.id) {
      try {
        const details = await fetchPostDetailsWithCache(post.id);
        if (details?.authorId) {
          authorId = details.authorId;
          authorName = details.authorName || authorName;
          avatarUrl = details.avatarUrl || avatarUrl;
        }
      } catch (err) {
        console.error('Failed to resolve author details for featured post:', err);
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
        resolvedAuthor: authorData,
      });
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isGuest) {
      if (onAuthRequired) {
        onAuthRequired();
      } else {
        toast.error('Please log in to like posts.');
      }
      return;
    }

    if (isLikeUpdating || !post.id) return;

    const previousLiked = isLiked;
    const previousCount = likeCount;
    const nextLiked = !isLiked;
    const nextCount = Math.max(0, isLiked ? likeCount - 1 : likeCount + 1);

    // Optimistic update
    setIsLiked(nextLiked);
    setLikeCount(nextCount);
    setIsLikeUpdating(true);

    try {
      const actorToken = getAccessToken();
      const res = await toggleLike(post.id);
      if (actorToken !== getAccessToken()) return;
      const authoritativeLiked = Boolean(res.isLiked);
      const authoritativeCount = res.likeCount !== undefined ? res.likeCount : nextCount;

      setIsLiked(authoritativeLiked);
      setLikeCount(authoritativeCount);

      updatePostDetailsCache(post.id, (prev) => ({
        ...prev,
        isLiked: authoritativeLiked,
        likeCount: authoritativeCount,
      }));
    } catch {
      // Rollback on error
      setIsLiked(previousLiked);
      setLikeCount(previousCount);
      toast.error('Failed to update like. Please try again.');
    } finally {
      setIsLikeUpdating(false);
    }
  };

  return (
    <section ref={ref} className={`mb-12 transform transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-dm-serif text-2xl sm:text-3xl font-medium text-vh-text-primary">
          {isTrending ? 'Trending Now' : "Editor's Pick"}
        </h2>
      </div>
      
      <Link 
        className="block bg-vh-surface border border-vh-border/70 rounded-card-lg overflow-hidden hover:shadow-lg hover:shadow-vh-sage/15 hover:border-vh-sage/60 hover:-translate-y-0.5 motion-reduce:transform-none transition-all duration-200 ease-out cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest"
        to={linkTo}
      >
        {/* Media Container: Supports both video and image with full visibility (no hard cropping) */}
        <div 
          className="relative w-full min-h-[260px] max-h-[580px] sm:max-h-[640px] bg-[#0E1712] overflow-hidden flex items-center justify-center"
          onClick={(e) => {
            if (isVideo) {
              e.stopPropagation();
            }
          }}
        >
          {/* Ambient blurred backdrop for letterboxed/pillarboxed space */}
          {!mediaError && resolvedImageUrl && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
              <img
                src={resolvedImageUrl}
                alt=""
                className="w-full h-full object-cover blur-2xl opacity-25 scale-125"
                tabIndex="-1"
              />
              <div className="absolute inset-0 bg-[#0E1712]/40 backdrop-blur-[1px]" />
            </div>
          )}

          {!mediaError && isVideo && resolvedVideoUrl ? (
            <video
              ref={videoRef}
              src={resolvedVideoUrl}
              poster={resolvedImageUrl || undefined}
              className="relative z-10 w-full h-auto max-h-[580px] sm:max-h-[640px] object-contain mx-auto block"
              muted
              playsInline
              autoPlay
              loop
              controls
              preload="metadata"
              onError={() => setMediaError(true)}
              onClick={(e) => {
                e.stopPropagation();
              }}
              aria-label={post.title || 'Recipe video preview'}
            />
          ) : !mediaError && resolvedImageUrl ? (
            <img 
              src={resolvedImageUrl} 
              alt={post.title} 
              className="relative z-10 w-full h-auto max-h-[580px] sm:max-h-[640px] object-contain mx-auto block transition-transform duration-200 ease-out group-hover:scale-[1.01] motion-reduce:transform-none"
              onError={() => setMediaError(true)}
              loading="lazy"
            />
          ) : (
            /* Deliberate botanical fallback card when media is missing or encounters an error */
            <div className="w-full h-72 sm:h-80 flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-br from-[#EBF2E8] via-[#FDFBF6] to-[#E2EBE0] relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/90 border border-vh-border/60 shadow-xs flex items-center justify-center text-vh-forest mb-3">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="font-dm-serif text-lg text-vh-text-primary font-medium line-clamp-1 max-w-[85%]">
                {post.title || 'Plant-Based Recipe'}
              </span>
              <span className="font-dm-sans text-xs text-vh-text-secondary mt-1">
                Vietnamese Botanical Cuisine
              </span>
            </div>
          )}

          {/* Badges on top of media */}
          <div className="absolute top-4 left-4 flex items-center gap-2 z-20 pointer-events-none select-none">
            <span className="px-3.5 py-1 bg-white/85 backdrop-blur-md rounded-full border border-white/60 text-vh-forest font-dm-sans text-xs font-semibold shadow-xs">
              {post.categoryName || post.category?.name || 'Recipe'}
            </span>
            {isVideo && !mediaError && (
              <span className="px-2.5 py-1 bg-black/65 backdrop-blur-md rounded-full text-white font-dm-sans text-xs font-medium flex items-center gap-1 shadow-xs">
                <span>📹</span>
                <span>Video</span>
              </span>
            )}
          </div>
        </div>
        
        {/* Editorial Text Content */}
        <div className="w-full flex flex-col justify-center p-6 md:p-8 text-left bg-gradient-to-br from-vh-surface to-vh-cream/50">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[13px] font-semibold font-dm-sans text-vh-forest uppercase tracking-wider">
                {isTrending ? 'Popular in the last 3 days' : 'Featured'}
              </span>
              <span className="text-xs text-vh-text-secondary">•</span>
              <time dateTime={post.createdAt} className="text-[13px] font-dm-sans text-vh-text-secondary">
                {formatDate(post.createdAt)}
              </time>
            </div>
            
            <h3 className="font-dm-serif text-2xl md:text-3xl font-medium text-vh-text-primary mb-3 leading-snug group-hover:text-vh-forest transition-colors line-clamp-2">
              {post.title}
            </h3>
            
            <p className="text-[15px] leading-relaxed font-dm-sans text-vh-text-secondary mb-6 line-clamp-3">
              {post.content}
            </p>
          </div>
          
          <div className="pt-5 border-t border-vh-border/60 flex items-center justify-between text-[13px] font-dm-sans text-vh-text-secondary">
            <button
              type="button"
              onClick={handleAuthorClick}
              className="flex items-center gap-2.5 text-left group/author hover:opacity-85 active:scale-95 motion-reduce:transform-none transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:ring-offset-1 rounded-lg p-1 -m-1 z-10"
              aria-label={`View ${post.authorName || 'Vegan Helper'}'s profile`}
            >
              <div className="w-9 h-9 rounded-full bg-vh-mint border border-vh-border flex items-center justify-center overflow-hidden shrink-0 group-hover/author:ring-2 group-hover/author:ring-vh-forest/40 transition-all">
                {post.avatarUrl ? (
                  <img src={getImageUrl(post.avatarUrl)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-4 h-4 text-vh-text-secondary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="7" r="4"></circle>
                    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                  </svg>
                )}
              </div>
              <span className="font-medium text-vh-text-primary group-hover/author:text-vh-forest transition-colors truncate max-w-[120px]">
                {post.authorName || 'Vegan Helper'}
              </span>
            </button>

            <div className="flex items-center gap-3.5 shrink-0">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-vh-text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                <strong className="font-semibold text-vh-text-primary">{post.viewCount || 0}</strong>
              </span>

              {/* Interactive Like/Heart Button */}
              <button
                type="button"
                onClick={handleLike}
                disabled={isLikeUpdating}
                className={`flex items-center gap-1.5 transition-all p-1.5 -m-1 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest cursor-pointer active:scale-90 motion-reduce:transform-none z-10 ${
                  isLiked
                    ? 'text-vh-error bg-vh-error/10 hover:bg-vh-error/15'
                    : 'text-vh-text-secondary hover:text-vh-error hover:bg-vh-cream'
                }`}
                aria-label={isLiked ? 'Unlike post' : 'Like post'}
              >
                <svg
                  className={`w-4 h-4 transition-transform active:scale-125 ${isLiked ? 'fill-current' : 'fill-none'}`}
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                </svg>
                <strong className={`font-semibold ${isLiked ? 'text-vh-error' : 'text-vh-text-primary'}`}>
                  {likeCount}
                </strong>
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Fallback local profile preview if no container-level modal is passed */}
      {!onOpenProfilePreview && (
        <UserProfilePreview
          isOpen={localProfilePreview.isOpen}
          onClose={() => setLocalProfilePreview({ isOpen: false, triggerEl: null, resolvedAuthor: null })}
          userId={localProfilePreview.resolvedAuthor?.id || post.authorId}
          initialUser={localProfilePreview.resolvedAuthor || {
            id: post.authorId,
            displayName: post.authorName,
            avatarUrl: post.avatarUrl,
          }}
          triggerEl={localProfilePreview.triggerEl}
          isGuest={isGuest}
          onAuthRequired={onAuthRequired}
        />
      )}
    </section>
  );
}
