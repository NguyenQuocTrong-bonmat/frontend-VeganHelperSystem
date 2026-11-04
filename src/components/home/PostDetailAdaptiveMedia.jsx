import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../../utils/imageUtils';

/**
 * PostDetailAdaptiveMedia
 * 
 * Adaptive media renderer for Post Detail (/posts/:id).
 * Dynamically measures intrinsic image dimensions (naturalWidth/naturalHeight)
 * and video metadata (videoWidth/videoHeight) to render each media item at
 * its native aspect ratio without cropping, stretching, or content loss.
 *
 * Supports:
 * - Square (1:1)
 * - Landscape (4:3, 16:9, 21:9)
 * - Portrait (3:4, 9:16)
 * - Panoramic and arbitrary ratios
 * - Mixed media posts with independent ratios per item
 * - Bounded height constraint (max-h-[min(640px,75vh)]) to keep portrait media usable
 * - Touch-friendly navigation (>= 44x44px touch targets)
 */
export default function PostDetailAdaptiveMedia({
  media = [],
  postTitle = '',
  activeMediaIndex = 0,
  onActiveMediaChange,
  onEnlargeImage,
}) {
  // Map of mediaIndex -> { width, height, ratio, loaded, error }
  const [dimensionsMap, setDimensionsMap] = useState({});

  if (!media || media.length === 0) return null;

  const currentIndex = Math.max(0, Math.min(activeMediaIndex, media.length - 1));
  const currentItem = media[currentIndex] || media[0];

  const handleImageLoad = (index, event) => {
    const img = event.currentTarget || event.target;
    if (!img) return;
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    if (width > 0 && height > 0) {
      setDimensionsMap((prev) => {
        const existing = prev[index];
        if (existing && existing.width === width && existing.height === height) {
          return prev;
        }
        return {
          ...prev,
          [index]: {
            width,
            height,
            ratio: width / height,
            loaded: true,
            error: false,
          },
        };
      });
    }
  };

  const handleVideoMetadata = (index, event) => {
    const video = event.currentTarget || event.target;
    if (!video) return;
    const width = video.videoWidth;
    const height = video.videoHeight;
    if (width > 0 && height > 0) {
      setDimensionsMap((prev) => {
        const existing = prev[index];
        if (existing && existing.width === width && existing.height === height) {
          return prev;
        }
        return {
          ...prev,
          [index]: {
            width,
            height,
            ratio: width / height,
            loaded: true,
            error: false,
          },
        };
      });
    }
  };

  const handleMediaError = (index) => {
    setDimensionsMap((prev) => ({
      ...prev,
      [index]: {
        ...(prev[index] || {}),
        loaded: false,
        error: true,
      },
    }));
  };

  // Safe aspect ratio resolution:
  // If intrinsic dimensions are known, clamp between 0.4 (tallest portrait) and 3.0 (widest panorama).
  // Otherwise use 16/9 as a safe initial loading placeholder.
  const currentDim = dimensionsMap[currentIndex];
  const rawRatio = currentDim?.ratio;
  const hasValidRatio = Number.isFinite(rawRatio) && rawRatio > 0;
  const activeRatio = hasValidRatio
    ? Math.max(0.4, Math.min(3.0, rawRatio))
    : 16 / 9;

  // Max display height prevents extremely tall portrait media from dominating the viewport
  const maxDisplayHeight = 'min(640px, 75vh)';

  // Proportional width calculation ensuring the container stays exactly at its intrinsic
  // aspect ratio while respecting maximum height and maximum available container width.
  const containerStyle = {
    aspectRatio: `${activeRatio}`,
    maxHeight: maxDisplayHeight,
    maxWidth: '100%',
    width: `min(100%, calc(${maxDisplayHeight} * ${activeRatio}))`,
    margin: '0 auto',
  };

  const handlePrev = () => {
    const nextIdx = currentIndex === 0 ? media.length - 1 : currentIndex - 1;
    onActiveMediaChange?.(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = currentIndex === media.length - 1 ? 0 : currentIndex + 1;
    onActiveMediaChange?.(nextIdx);
  };

  const isVideo = currentItem?.mediaType === 'video';
  const resolvedMediaUrl = getImageUrl(currentItem?.mediaUrl);

  return (
    <div className="space-y-3 w-full" data-testid="post-detail-adaptive-media">
      {/* Outer centering wrapper */}
      <div className="w-full flex justify-center items-center">
        {/* Adaptive Media Stage Container */}
        <div
          data-testid="adaptive-media-stage"
          data-media-index={currentIndex}
          data-media-ratio={activeRatio}
          className="relative bg-[#121B13] border border-[#DCE3D5] rounded-xl sm:rounded-2xl flex items-center justify-center text-white overflow-hidden group select-none shadow-xs transition-all duration-300"
          style={containerStyle}
        >
          {currentDim?.error ? (
            <div className="flex flex-col items-center justify-center p-6 text-center text-[#E5E9E1] space-y-2">
              <svg className="w-10 h-10 text-[#A63446]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm font-medium text-[#E5E9E1]">
                Unable to load {isVideo ? 'video' : 'photo'}
              </p>
              <p className="text-xs text-[#9EAA96]">The file may be unavailable or deleted.</p>
            </div>
          ) : isVideo ? (
            <video
              key={`video-${currentIndex}-${currentItem.mediaUrl}`}
              data-testid="adaptive-video-element"
              data-media-index={currentIndex}
              src={resolvedMediaUrl}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain bg-black/40"
              onLoadedMetadata={(e) => handleVideoMetadata(currentIndex, e)}
              onError={() => handleMediaError(currentIndex)}
            />
          ) : (
            <div
              className="w-full h-full cursor-zoom-in relative flex items-center justify-center group/img"
              onClick={() => onEnlargeImage?.()}
              role="button"
              tabIndex={0}
              aria-label="Enlarge image"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onEnlargeImage?.();
                }
              }}
            >
              <img
                key={`img-${currentIndex}-${currentItem.mediaUrl}`}
                data-testid="adaptive-image-element"
                data-media-index={currentIndex}
                src={resolvedMediaUrl}
                alt={postTitle || 'Recipe photo'}
                className="w-full h-full object-contain transition-transform duration-300 group-hover/img:scale-[1.01]"
                onLoad={(e) => handleImageLoad(currentIndex, e)}
                onError={() => handleMediaError(currentIndex)}
                loading="lazy"
              />
              <div className="absolute bottom-4 right-4 z-10 px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs text-xs flex items-center gap-1.5 opacity-90 group-hover/img:opacity-100 transition-opacity pointer-events-none">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
                <span>Enlarge</span>
              </div>
            </div>
          )}

          {/* Multiple Media Slide Controls */}
          {media.length > 1 && (
            <>
              {/* Previous button with >= 44x44px touch hit area */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous media"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 min-w-[44px] min-h-[44px] rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95 motion-reduce:transform-none cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
                </svg>
              </button>

              {/* Next button with >= 44x44px touch hit area */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next media"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 min-w-[44px] min-h-[44px] rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95 motion-reduce:transform-none cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                </svg>
              </button>

              {/* Slide Counter Badge */}
              <div
                className="absolute top-3 left-3 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white tracking-wide border border-white/20 select-none shadow-xs"
                aria-live="polite"
              >
                <span>{currentIndex + 1} / {media.length}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Thumbnails Strip */}
      {media.length > 1 && (
        <div
          data-testid="adaptive-media-thumbnails"
          className="flex items-center gap-2.5 pt-1 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center"
        >
          {media.map((item, index) => {
            const isItemActive = currentIndex === index;
            const thumbUrl = getImageUrl(item.mediaUrl);
            const isItemVideo = item.mediaType === 'video';

            return (
              <button
                key={index}
                type="button"
                onClick={() => onActiveMediaChange?.(index)}
                aria-label={`Show media ${index + 1} of ${media.length}`}
                aria-current={isItemActive ? 'true' : undefined}
                className={`relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none ${
                  isItemActive
                    ? 'border-[#2F5233] shadow-xs scale-102 opacity-100'
                    : 'border-transparent opacity-70 hover:opacity-100 hover:border-[#DCE3D5]'
                }`}
              >
                {isItemVideo ? (
                  <>
                    <video src={thumbUrl} className="w-full h-full object-cover pointer-events-none" />
                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white fill-current ml-0.5" viewBox="0 0 24 24">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    </div>
                  </>
                ) : (
                  <img src={thumbUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
