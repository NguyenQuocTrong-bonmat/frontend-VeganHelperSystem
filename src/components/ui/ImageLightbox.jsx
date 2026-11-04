import React, { useEffect, useRef } from 'react';

/**
 * Accessible Image Lightbox Modal
 * - Close button with aria-label
 * - Escape key to close
 * - Click backdrop outside image to close
 * - Traps/restores body scroll (overflow: hidden on body)
 * - Object-contain, max-w-[92vw] max-h-[90vh] to preserve proportions without stretching
 * - Accessible alt text & title
 */
export default function ImageLightbox({ src, alt = 'Enlarged image', isOpen, onClose }) {
  const overlayRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Prevent background scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !src) return null;

  const handleBackdropClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-6 transition-opacity"
    >
      {/* Visible Accessible Close Button */}
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Close enlarged image view"
        className="absolute top-4 right-4 z-[110] p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white transition-all active:scale-95 motion-reduce:transform-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Enlarged Image Container */}
      <div className="relative max-w-[92vw] max-h-[90vh] flex flex-col items-center justify-center">
        <img
          src={src}
          alt={alt || 'Enlarged image'}
          className="max-w-[92vw] max-h-[86vh] w-auto h-auto object-contain rounded-lg shadow-2xl select-none"
          onClick={(e) => e.stopPropagation()}
        />
        {alt && alt !== 'Media' && alt !== 'Enlarged image' && (
          <p className="mt-2.5 text-center text-xs sm:text-sm text-white/85 max-w-xl truncate px-2 font-medium">
            {alt}
          </p>
        )}
      </div>
    </div>
  );
}
