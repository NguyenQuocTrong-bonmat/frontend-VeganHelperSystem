import React, { useEffect, useRef, useCallback } from 'react';
import CreatePostForm from './CreatePostForm';

/**
 * Accessible Facebook-style Create Post Modal over the Home feed.
 *
 * Requirements:
 * - Does not alter browser route.
 * - Confirms before discarding unsaved changes.
 * - Traps keyboard focus, handles Escape, restores trigger focus.
 * - Locks background scroll.
 * - Responsive full-height mobile and centered desktop card.
 */
export default function CreatePostModal({
  isOpen,
  onClose,
  initialPostType = 'recipe',
  focusPhoto = false,
  onPostCreated,
  triggerRef,
}) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const isDirtyRef = useRef(false);

  const handleDirtyChange = useCallback((isDirty) => {
    isDirtyRef.current = isDirty;
  }, []);

  const handleSafeClose = useCallback(() => {
    if (isDirtyRef.current) {
      const confirmDiscard = window.confirm(
        'You have unsaved changes. Are you sure you want to discard this post?'
      );
      if (!confirmDiscard) return;
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    // Prevent background scrolling while open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Trap focus and handle Escape
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleSafeClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Initial focus on close button or first interactive element
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 60);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      // Restore focus to trigger element
      if (triggerRef?.current) {
        triggerRef.current.focus();
      }
    };
  }, [isOpen, handleSafeClose, triggerRef]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleSafeClose();
    }
  };

  const handleSuccess = (createdPost) => {
    isDirtyRef.current = false;
    onPostCreated?.(createdPost);
    onClose();
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 md:p-6 transition-opacity duration-200"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-post-modal-title"
        className="relative w-full h-full sm:h-auto sm:max-w-3xl md:max-w-4xl bg-vh-surface border-0 sm:border border-vh-border/80 rounded-none sm:rounded-2xl shadow-2xl flex flex-col max-h-[100dvh] sm:max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-vh-border/70 flex items-center justify-between shrink-0 bg-vh-surface z-10">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-vh-mint text-vh-forest flex items-center justify-center text-base">
              🌱
            </span>
            <div>
              <h2
                id="create-post-modal-title"
                className="font-dm-serif text-lg sm:text-xl font-medium text-vh-text-primary text-left"
              >
                Create Post
              </h2>
              <p className="text-xs font-dm-sans text-vh-text-secondary text-left">
                Share your plant-based journey, tips, or favorite dishes.
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleSafeClose}
            aria-label="Close create post modal"
            className="w-8 h-8 rounded-full bg-vh-cream hover:bg-vh-mint/50 border border-vh-border/60 text-vh-text-secondary hover:text-vh-forest flex items-center justify-center transition-colors focus-ring-vh cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Modal Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 overscroll-contain bg-gradient-to-b from-vh-surface to-vh-cream/15">
          <CreatePostForm
            initialPostType={initialPostType}
            focusPhoto={focusPhoto}
            isModal={true}
            onSuccess={handleSuccess}
            onCancel={handleSafeClose}
            onDirtyChange={handleDirtyChange}
          />
        </div>
      </div>
    </div>
  );
}
