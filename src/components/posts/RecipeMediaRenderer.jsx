import React, { useState, useRef } from 'react';
import { getImageUrl, isVideoMedia } from '../../utils/imageUtils';

/**
 * Reusable Media Renderer for recipe and post cards across My Posts and Saved Recipes.
 * 
 * Supports:
 * - Proper <img> decoding for static images.
 * - Proper <video> decoding with muted, playsInline, metadata-preload for video media.
 * - Controlled preview on hover without sound or concurrent playback chaos.
 * - Video badge indicator with play status.
 * - Graceful fallback to the Botanical Kitchen placeholder illustration when media is missing or fails.
 */
export default function RecipeMediaRenderer({
  post,
  alt = '',
  className = 'w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03] motion-reduce:transform-none',
  showVideoBadge = true,
}) {
  const [mediaError, setMediaError] = useState(false);
  const [videoHovered, setVideoHovered] = useState(false);
  const videoRef = useRef(null);

  const isExplicitVideo = Boolean(
    post?.mediaType === 'video' ||
    post?.postType === 'video' ||
    post?.media?.[0]?.mediaType === 'video'
  );

  // 1. Identify video URL candidate
  const videoCandidate =
    post?.videoUrl ||
    (isVideoMedia(post?.thumbnailUrl) || isExplicitVideo ? post?.thumbnailUrl : null) ||
    (isVideoMedia(post?.mediaUrl) || isExplicitVideo ? post?.mediaUrl : null) ||
    post?.media?.find(m => m.mediaType === 'video' || isVideoMedia(m.mediaUrl))?.mediaUrl;

  const resolvedVideoUrl = videoCandidate ? getImageUrl(videoCandidate) : null;
  const isVideo = Boolean(resolvedVideoUrl || isExplicitVideo || isVideoMedia(post?.thumbnailUrl));

  // 2. Identify separate image thumbnail candidate (distinct from video source)
  const imageCandidate =
    (post?.videoUrl && !isVideoMedia(post?.thumbnailUrl) && !isExplicitVideo ? post?.thumbnailUrl : null) ||
    post?.posterUrl ||
    post?.thumbnailImage ||
    (!isVideo ? (post?.thumbnailUrl || post?.mediaUrl || post?.imageUrl || post?.thumbnail) : null) ||
    post?.media?.find(m => (m.mediaType === 'image' || !isVideoMedia(m.mediaUrl)) && m.mediaUrl !== videoCandidate)?.mediaUrl;

  const resolvedImageUrl = imageCandidate ? getImageUrl(imageCandidate) : null;

  // 3. Fallback when neither video nor image is available or media has error
  if (mediaError || (!resolvedVideoUrl && !resolvedImageUrl)) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#EAF0E9] via-[#F3F6EE] to-[#DDE6D8] text-[#2F5233] select-none p-4 relative overflow-hidden"
        aria-label={alt ? `Recipe illustration for ${alt}` : 'Botanical recipe placeholder'}
      >
        <svg
          className="absolute -right-6 -bottom-6 w-36 h-36 opacity-15 text-[#2F5233] pointer-events-none"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
        <div className="w-11 h-11 rounded-full bg-white/80 border border-[#DCE3D5] flex items-center justify-center text-[#2F5233] shadow-2xs mb-1.5 z-10 transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <span className="font-fraunces font-medium text-[11px] text-[#2F5233]/85 tracking-wider uppercase z-10">
          Botanical Kitchen
        </span>
      </div>
    );
  }

  // 4. Video media rendering: <video> element with muted preview & controls-safe hover strategy
  if (isVideo && resolvedVideoUrl) {
    const showThumbnailPoster = resolvedImageUrl && !videoHovered;

    return (
      <div
        className="w-full h-full relative"
        onMouseEnter={() => {
          setVideoHovered(true);
          if (videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        }}
        onMouseOver={() => {
          if (!videoHovered) {
            setVideoHovered(true);
            if (videoRef.current) {
              videoRef.current.play().catch(() => {});
            }
          }
        }}
        onMouseLeave={() => {
          setVideoHovered(false);
          if (videoRef.current) {
            videoRef.current.pause();
          }
        }}
      >
        {showThumbnailPoster ? (
          <img
            src={resolvedImageUrl}
            alt={alt || post?.title || 'Recipe cover'}
            loading="lazy"
            onError={() => {
              setVideoHovered(true);
            }}
            className={className}
          />
        ) : (
          <video
            ref={videoRef}
            src={resolvedVideoUrl}
            poster={resolvedImageUrl || undefined}
            className={className}
            muted
            playsInline
            loop
            preload="metadata"
            onError={() => {
              if (!resolvedImageUrl) {
                setMediaError(true);
              }
            }}
            aria-label={alt || post?.title || 'Recipe video preview'}
          />
        )}

        {/* Video pill indicator */}
        {showVideoBadge && (
          <div className="absolute bottom-2.5 right-2.5 z-10 pointer-events-none select-none">
            <span className="px-2 py-0.5 bg-black/65 backdrop-blur-xs rounded-full text-white font-dm-sans text-[11px] font-medium flex items-center gap-1 shadow-xs">
              <svg className="w-3 h-3 text-white fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>{videoHovered ? 'Playing' : 'Video'}</span>
            </span>
          </div>
        )}
      </div>
    );
  }

  // 5. Static Image media rendering: <img> element
  return (
    <img
      src={resolvedImageUrl || resolvedVideoUrl}
      alt={alt || post?.title || 'Recipe cover'}
      loading="lazy"
      onError={() => setMediaError(true)}
      className={className}
    />
  );
}
