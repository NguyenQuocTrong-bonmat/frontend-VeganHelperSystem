import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, MotionGlobalConfig } from 'framer-motion';
import { AlertCircleIcon, CloseIcon, InfoIcon, SpinnerIcon } from './NotificationIcons';

export default function ConfirmDialog({
  isOpen = false,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'primary'
  isLoading = false,
  onConfirm,
  onCancel,
  usePortal = true,
}) {
  const dialogRef = useRef(null);
  const previouslyFocusedElement = useRef(null);
  const isDanger = variant === 'danger';

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus initial interactive element
    const timer = setTimeout(() => {
      if (!dialogRef.current?.contains(document.activeElement)) {
        const primaryAction = dialogRef.current?.querySelector('button[data-confirm-btn="true"]');
        const cancelButton = dialogRef.current?.querySelector('button[data-cancel-btn="true"]');
        (primaryAction || cancelButton)?.focus();
      }
    }, 0);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (!isLoading) {
          e.preventDefault();
          onCancel?.();
        }
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || !dialogRef.current.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement || !dialogRef.current.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (previouslyFocusedElement.current && typeof previouslyFocusedElement.current.focus === 'function') {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [isOpen, isLoading, onCancel]);

  const dialogContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
          data-testid="confirm-dialog-backdrop"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={() => {
              if (!isLoading) onCancel?.();
            }}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative w-full max-w-md bg-[#FDFBF6] border border-[#DCE5D9] rounded-2xl shadow-2xl p-6 sm:p-7 z-10 text-[#2B2A25] focus:outline-none"
          >
            {/* Header Icon & Title */}
            <div className="flex items-start gap-3.5 mb-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  isDanger ? 'bg-[#F9ECEE] text-[#A63446]' : 'bg-[#E9EFE6] text-[#2F5233]'
                }`}
              >
                {isDanger ? <AlertCircleIcon className="w-5 h-5 text-[#A63446]" /> : <InfoIcon className="w-5 h-5 text-[#2F5233]" />}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <h3
                  id="confirm-dialog-title"
                  className="font-fraunces text-lg sm:text-xl font-semibold text-[#2B2A25] leading-snug break-words"
                >
                  {title}
                </h3>
              </div>
              {!isLoading && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B6F63] hover:text-[#2B2A25] hover:bg-black/5 transition-colors -mr-2 -mt-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233]"
                  aria-label="Close dialog"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Description Body */}
            <p
              id="confirm-dialog-description"
              className="text-sm font-dm-sans text-[#6B6F63] leading-relaxed mb-6 pl-[54px]"
            >
              {description}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#DCE5D9]/60">
              <button
                type="button"
                data-cancel-btn="true"
                disabled={isLoading}
                onClick={onCancel}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#6B6F63] hover:text-[#2B2A25] hover:bg-[#E9EFE6]/50 border border-[#DCE5D9] transition-all disabled:opacity-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none"
              >
                {cancelText}
              </button>
              <button
                type="button"
                data-confirm-btn="true"
                disabled={isLoading}
                onClick={onConfirm}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-medium text-white transition-all shadow-xs flex items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95 motion-reduce:transform-none disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDanger
                    ? 'bg-[#A63446] hover:bg-[#8F2B3B] focus-visible:ring-[#A63446]'
                    : 'bg-[#2F5233] hover:bg-[#254026] focus-visible:ring-[#2F5233]'
                }`}
              >
                {isLoading && <SpinnerIcon className="w-3.5 h-3.5 text-white animate-spin" />}
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!usePortal) {
    return dialogContent;
  }

  return typeof document !== 'undefined' ? createPortal(dialogContent, document.body) : null;
}
