import { useEffect } from 'react';
import { animate } from 'framer-motion';
import useLandingMedia from './useLandingMedia';

// Native reading scroll inside a chapter; a separate gesture at its edge changes chapters.
export default function useLandingSectionScroll() {
  const desktop = useLandingMedia('(min-width: 901px)');
  const reducedMotion = useLandingMedia('(prefers-reduced-motion: reduce)');
  useEffect(() => {
    if (!desktop) return undefined;
    const main = document.getElementById('landing-main');
    if (!main) return undefined;
    let chapters = [];
    let lastWheel = -Infinity;
    let consumed = false;
    let animation;
    let transitioning = false;
    const measure = () => {
      const headerHeight = document.querySelector('.lp-header')?.offsetHeight || 82;
      const available = Math.max(200, window.innerHeight - headerHeight);
      const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const sections = [...main.children].filter(node => node.tagName === 'SECTION');
      const footer = document.querySelector('.lp-footer');
      chapters = [...sections, ...(footer ? [footer] : [])].map(section => {
        const top = section.getBoundingClientRect().top + window.scrollY - headerHeight;
        return {
          start: Math.max(0, Math.min(maximum, top)),
          end: Math.max(0, Math.min(maximum, top + Math.max(0, section.offsetHeight - available))),
        };
      });
    };
    measure();
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
    observer?.observe(main);
    for (const node of main.children) observer?.observe(node);
    window.addEventListener('resize', measure);

    const cancelTransition = () => {
      animation?.stop();
      animation = undefined;
      transitioning = false;
      consumed = false;
    };
    const goTo = destination => {
      consumed = true;
      if (reducedMotion) {
        window.scrollTo({ top: destination, behavior: 'instant' });
        return;
      }
      transitioning = true;
      main.setAttribute('data-section-transition', 'true');
      // One bounded acceleration/deceleration, using the existing motion runtime.
      animation = animate(window.scrollY, destination, {
        duration: 0.48,
        ease: [0.65, 0, 0.2, 1],
        onUpdate: top => window.scrollTo({ top, behavior: 'instant' }),
        onComplete: () => {
          transitioning = false;
          animation = undefined;
          main.removeAttribute('data-section-transition');
        },
      });
    };
    const onWheel = event => {
      if (event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return;
      if (!(event.target instanceof Element) || !event.target.closest('.lp-page')) return;
      if (document.querySelector('[role="dialog"]') || event.target.closest('input, textarea, select, [contenteditable="true"], .lp-mobile-nav')) return;
      // Preserve independent scrolling controls and scrollable panels.
      for (let node = event.target; node && node !== main && !node.classList.contains('lp-page'); node = node.parentElement) {
        if (node.scrollHeight > node.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(node).overflowY)) return;
      }
      const now = performance.now();
      if (now - lastWheel > 180 && !transitioning) consumed = false;
      lastWheel = now;
      if (transitioning || consumed) { event.preventDefault(); return; }
      const y = window.scrollY;
      let index = 0;
      chapters.forEach((chapter, i) => { if (chapter.start <= y + 2) index = i; });
      const chapter = chapters[index];
      if (!chapter) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      const down = delta > 0;
      const edge = down ? chapter.end : chapter.start;
      const inside = down ? y < edge - 2 : y > edge + 2;
      if (inside) {
        // Finish reading this chapter before accepting a new gesture to leave it.
        if (down ? y + delta >= edge : y + delta <= edge) {
          event.preventDefault();
          consumed = true;
          window.scrollTo({ top: edge, behavior: 'instant' });
        }
        return;
      }
      const next = chapters[index + (down ? 1 : -1)];
      if (!next) return;
      event.preventDefault();
      goTo(down ? next.start : next.end);
    };
    const interrupt = () => {
      cancelTransition();
      main.removeAttribute('data-section-transition');
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('pointerdown', interrupt);
    window.addEventListener('keydown', interrupt);
    return () => {
      interrupt();
      observer?.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('pointerdown', interrupt);
      window.removeEventListener('keydown', interrupt);
    };
  }, [desktop, reducedMotion]);
}
