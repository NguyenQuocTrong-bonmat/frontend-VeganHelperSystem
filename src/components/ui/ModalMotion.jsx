import React, { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion, MotionGlobalConfig } from 'framer-motion';

// Skip animations instantly during test runs (jsdom) so tests asserting unmount don't hang
if (typeof process !== 'undefined' && (process.env?.NODE_ENV === 'test' || process.env?.VITEST)) {
  MotionGlobalConfig.skipAnimations = true;
}

/**
 * Botanical Motion Variants for Modal Dialogs & Toasts
 * Timed strictly between 150ms - 220ms for crisp, professional micro-interactions.
 */
export const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] },
  },
};

export const modalDialogVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] },
  },
};

export const modalBottomSheetVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.98,
    transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] },
  },
};

export const toastVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: 12,
    scale: 0.96,
    transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Reduced-Motion Variants (Accessibility Fallback)
 * Bypasses scale and translate transforms to prevent disorientation.
 */
const reducedBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.08 } },
  exit: { opacity: 0, transition: { duration: 0.08 } },
};

const reducedDialogVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.08 } },
  exit: { opacity: 0, transition: { duration: 0.08 } },
};

export const reducedToastVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.08 } },
  exit: { opacity: 0, transition: { duration: 0.08 } },
};

/**
 * ModalMotion
 * Reusable animated modal wrapper providing backdrop fade and dialog scale/bottom-sheet transitions.
 */
export default function ModalMotion({
  isOpen,
  onClose,
  children,
  backdropClassName = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs',
  dialogClassName = '',
  variant = 'center', // 'center' | 'bottom-sheet'
  closeOnBackdropClick = true,
  closeOnEscape = true,
  role = 'dialog',
  ariaModal = true,
  ariaLabelledBy,
  ariaLabel,
  dialogRef,
  onExitComplete,
  id,
}) {
  const shouldReduceMotion = useReducedMotion();

  // Escape key listener when enabled
  useEffect(() => {
    if (!isOpen || !closeOnEscape || !onClose) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdropClick && onClose) {
      onClose(e);
    }
  };

  const backdropVariants = shouldReduceMotion ? reducedBackdropVariants : modalBackdropVariants;

  const dialogVariants = shouldReduceMotion
    ? reducedDialogVariants
    : variant === 'bottom-sheet'
      ? modalBottomSheetVariants
      : modalDialogVariants;

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {isOpen && (
        <motion.div
          id={id}
          key="modal-backdrop"
          className={backdropClassName}
          onClick={handleBackdropClick}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            key="modal-dialog"
            ref={dialogRef}
            role={role}
            aria-modal={ariaModal ? 'true' : undefined}
            aria-labelledby={ariaLabelledBy}
            aria-label={ariaLabel}
            className={dialogClassName}
            onClick={(e) => e.stopPropagation()}
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
