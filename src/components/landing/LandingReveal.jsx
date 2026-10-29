import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import useLandingMedia from './useLandingMedia';
import { easeEditorial, defaultViewport } from './motionVariants';

function InViewReveal({ as = 'div', delay = 0, depth = false, children, style, ...props }) {
  const target = useRef(null);
  const desktop = useLandingMedia('(min-width: 1024px)');

  // Optional subtle scroll depth for featured imagery on desktop without conflicting with entrance
  const { scrollYProgress } = useScroll({
    target,
    offset: ['start end', 'end start'],
  });

  const subtleParallaxY = useTransform(scrollYProgress, [0, 1], [8, -8]);

  const Component = motion[as] || motion.div;

  const transition = {
    duration: 0.55,
    delay: Math.min(0.25, delay),
    ease: easeEditorial,
  };

  const initial = {
    opacity: 0,
    y: 16,
  };

  const whileInView = {
    opacity: 1,
    y: 0,
  };

  return (
    <Component
      {...props}
      ref={target}
      data-scroll-reveal
      initial={initial}
      whileInView={whileInView}
      viewport={defaultViewport}
      transition={transition}
      style={style}
    >
      {depth && desktop ? (
        <motion.div style={{ y: subtleParallaxY }}>
          {children}
        </motion.div>
      ) : (
        children
      )}
    </Component>
  );
}

export default function LandingReveal({ as = 'div', delay = 0, depth = false, children, ...props }) {
  const mediaReducedMotion = useLandingMedia('(prefers-reduced-motion: reduce)');
  const framerReducedMotion = useReducedMotion();
  const isReduced = mediaReducedMotion || Boolean(framerReducedMotion);
  const hasObserver = typeof window !== 'undefined' && typeof window.IntersectionObserver === 'function';

  // Progressive enhancement: render content visible immediately if reduced motion is requested
  // or if IntersectionObserver is unavailable in the environment.
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
