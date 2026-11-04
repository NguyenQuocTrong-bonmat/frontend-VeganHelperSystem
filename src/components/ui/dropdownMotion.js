import { MotionGlobalConfig } from 'framer-motion';

// Skip animations instantly in test environments (Vitest/jsdom)
if (typeof process !== 'undefined' && (process.env?.NODE_ENV === 'test' || process.env?.VITEST)) {
  MotionGlobalConfig.skipAnimations = true;
}

/**
 * Shared motion curves and variants for Dropdowns & Popovers
 * Timed strictly between 140ms - 200ms for crisp, responsive micro-interactions.
 */
export const dropdownEasing = [0.16, 1, 0.3, 1];

export const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -6,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.16,
      ease: dropdownEasing,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.98,
    transition: {
      duration: 0.14,
      ease: dropdownEasing,
    },
  },
};

export const mobileDrawerVariants = {
  hidden: {
    opacity: 0,
    y: -8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.18,
      ease: dropdownEasing,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.14,
      ease: dropdownEasing,
    },
  },
};

export const popoverBackdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.16, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.14, ease: 'easeIn' },
  },
};

export const popoverCardVariants = {
  hidden: (isMobile = false) => ({
    opacity: 0,
    scale: 0.96,
    y: isMobile ? 8 : -4,
  }),
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.18,
      ease: dropdownEasing,
    },
  },
  exit: (isMobile = false) => ({
    opacity: 0,
    scale: 0.96,
    y: isMobile ? 8 : -4,
    transition: {
      duration: 0.14,
      ease: dropdownEasing,
    },
  }),
};

export const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.08 },
  },
};
