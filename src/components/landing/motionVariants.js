/**
 * VeganHelper Landing Motion Design System
 * Aesthetic: Cinematic Botanical × Premium Food Editorial × Smooth Scroll Storytelling
 */

export const easeEditorial = [0.22, 1, 0.36, 1];
export const easeOutExpo = [0.16, 1, 0.3, 1];

export const springGentle = {
  type: 'spring',
  stiffness: 320,
  damping: 28,
};

export const springBrisk = {
  type: 'spring',
  stiffness: 420,
  damping: 32,
};

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: easeEditorial,
    },
  },
};

export const lineRevealVariants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: {
      duration: 0.85,
      ease: easeEditorial,
    },
  },
};

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easeEditorial,
    },
  },
};

export const scaleUpVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easeEditorial,
    },
  },
};

export const createStaggerContainer = (staggerChildren = 0.09, delayChildren = 0.05) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const buttonHoverTap = {
  whileHover: { y: -2, transition: { duration: 0.18, ease: easeEditorial } },
  whileTap: { scale: 0.97, transition: { duration: 0.1 } },
};

export const cardHoverTap = {
  whileHover: { y: -4, transition: { duration: 0.24, ease: easeEditorial } },
};

export const defaultViewport = {
  once: true,
  amount: 0.15,
  margin: '0px 0px -40px 0px',
};
