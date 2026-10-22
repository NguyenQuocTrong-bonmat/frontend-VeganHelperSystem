import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import useLandingMedia from './useLandingMedia';

function ScrollReveal({ as = 'div', delay = 0, depth = false, children, style, ...props }) {
  const target = useRef(null);
  const [focused, setFocused] = useState(false);
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] });
  // Leave a broad, fully visible reading window. Both edges reverse with native scrolling.
  const arrival = Math.min(0.24, 0.16 + delay * 0.2);
  const opacity = useTransform(scrollYProgress, [0, arrival, 0.88, 1], [0.4, 1, 1, 0.4]);
  const y = useTransform(scrollYProgress, [0, arrival, 0.88, 1], [depth ? 64 : 38, 0, 0, depth ? -48 : -28]);
  const scale = useTransform(scrollYProgress, [0, arrival, 0.88, 1], [depth ? 0.96 : 1, 1, 1, depth ? 0.98 : 1]);
  const Component = motion[as];
  return <Component {...props} ref={target} data-scroll-reveal
    style={{ ...style, opacity: focused ? 1 : opacity, y: focused ? 0 : y, scale: focused ? 1 : scale }}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
  >{children}</Component>;
}

export default function LandingReveal({ as = 'div', delay = 0, depth = false, children, ...props }) {
  const reducedMotion = useLandingMedia('(prefers-reduced-motion: reduce)');
  const motionSupported = useLandingMedia('(min-width: 1px)');
  if (reducedMotion || !motionSupported) {
    const Component = as;
    return <Component {...props}>{children}</Component>;
  }
  return <ScrollReveal as={as} delay={delay} depth={depth} {...props}>{children}</ScrollReveal>;
}
