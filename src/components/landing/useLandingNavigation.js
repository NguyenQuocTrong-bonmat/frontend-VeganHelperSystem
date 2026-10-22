import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';

// Measure chapter positions when layout changes; scroll only compares cached numbers.
export default function useLandingNavigation() {
  const [activeSection, setActiveSection] = useState('landing-main');
  const current = useRef('landing-main');
  const chapters = useRef([]);
  const activationLine = useRef(0);
  const { scrollY, scrollYProgress } = useScroll();

  const update = useCallback(value => {
    const position = value + activationLine.current;
    let next = 'landing-main';
    for (const chapter of chapters.current) {
      if (chapter.top > position) break;
      next = chapter.id;
    }
    if (next !== current.current) {
      current.current = next;
      setActiveSection(next);
    }
  }, []);
  useMotionValueEvent(scrollY, 'change', update);

  useEffect(() => {
    const main = document.getElementById('landing-main');
    if (!main) return undefined;
    const measure = () => {
      const position = window.scrollY;
      activationLine.current = Math.max(110, window.innerHeight * 0.28);
      chapters.current = [...main.querySelectorAll('[data-landing-chapter]')]
        .map(node => ({ id: node.dataset.landingChapter, top: node.getBoundingClientRect().top + position }));
      update(position);
    };
    measure();
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
    observer?.observe(main);
    const header = document.querySelector('.lp-header');
    if (header) observer?.observe(header);
    main.querySelectorAll('[data-landing-chapter]').forEach(node => observer?.observe(node));
    window.addEventListener('resize', measure);
    return () => { observer?.disconnect(); window.removeEventListener('resize', measure); };
  }, [update]);

  return { activeSection, scrollYProgress };
}
