import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import useLandingMedia from './useLandingMedia';
import { easeEditorial, defaultViewport } from './motionVariants';

function InViewReveal({ as = 'div', delay = 0, depth = false, children, style, ...props }) {
  const target = useRef(null);
  const desktop = useLandingMedia('(min-width: 901px)');

  // Optional subtle scroll depth parallax for designated elements (depth=true) on desktop
  const { scrollYProgress } = useScroll({
    target,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [16, -16]);

  const Component = motion[as] || motion.div;

  const transition = {
    duration: 0.75,
    delay: Math.min(0.4, delay),
    ease: easeEditorial,
  };

  const initial = {
    opacity: 0,
    y: depth ? 32 : 22,
    scale: depth ? 0.98 : 1,
  };

  const whileInView = {
    opacity: 1,
    y: 0,
    scale: 1,
  };

  // Combine initial entrance with subtle depth parallax if applicable
  const combinedStyle = depth && desktop
    ? { ...style, y: parallaxY }
    : style;

  return (
    <Component
      {...props}
      ref={target}
      data-scroll-reveal
      initial={initial}
      whileInView={whileInView}
      viewport={defaultViewport}
      transition={transition}
      style={combinedStyle}
    >
      {children}
    </Component>
  );
}

export default function LandingReveal({ as = 'div', delay = 0, depth = false, children, ...props }) {
  const mediaReducedMotion = useLandingMedia('(prefers-reduced-motion: reduce)');
  const framerReducedMotion = useReducedMotion();
  const isReduced = mediaReducedMotion || Boolean(framerReducedMotion);
  const hasObserver = typeof window !== 'undefined' && typeof window.IntersectionObserver === 'function';

  if (isReduced || !hasObserver) {
    const Component = as;
    return <Component {...props}>{children}</Component>;
  }

  return (
    <InViewReveal as={as} delay={delay} depth={depth} {...props}>
      {children}
    </InViewReveal>
  );
}
