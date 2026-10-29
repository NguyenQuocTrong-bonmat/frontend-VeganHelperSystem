import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { easeEditorial } from './motionVariants';

const chapters = [
  { id: 'landing-hero', number: '01', label: 'First Bite' },
  { id: 'platform', number: '02', label: 'Platform' },
  { id: 'recipes', number: '03', label: 'Recipes' },
  { id: 'weekly-menu-preview', number: '04', label: 'Weekly Menu' },
  { id: 'stores', number: '05', label: 'Vegan Stores' },
  { id: 'community', number: '06', label: 'Community' },
  { id: 'closing', number: '07', label: 'Closing' },
];

export default function LandingStoryNav() {
  const [activeId, setActiveId] = useState('landing-hero');
  const [expanded, setExpanded] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.IntersectionObserver !== 'function') {
      return undefined;
    }

    const visibleRatios = new Map();

    const observer = new window.IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          visibleRatios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let bestId = null;
        let maxRatio = 0;

        chapters.forEach(ch => {
          const ratio = visibleRatios.get(ch.id) || 0;
          if (ratio > maxRatio) {
            maxRatio = ratio;
            bestId = ch.id;
          }
        });

        if (bestId && maxRatio > 0.06) {
          setActiveId(bestId);
        }
      },
      {
        threshold: [0.08, 0.2, 0.4, 0.6],
        rootMargin: '-82px 0px -25% 0px',
      }
    );

    chapters.forEach(ch => {
      const el = document.getElementById(ch.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToChapter = (id, event) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const headerHeight = document.querySelector('.lp-header')?.offsetHeight || 82;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: reducedMotion ? 'instant' : 'smooth',
    });
    setExpanded(false);
  };

  const currentChapter = chapters.find(c => c.id === activeId) || chapters[0];

  return (
    <nav
      className={`lp-story-nav ${expanded ? 'is-expanded' : ''}`}
      aria-label="Chapter story navigation"
      role="navigation"
    >
      <div className="lp-story-nav-inner">
        {/* Mobile current chapter pill button */}
        <button
          type="button"
          className="lp-story-nav-current"
          aria-expanded={expanded}
          aria-label={`Current chapter: ${currentChapter.number} ${currentChapter.label}. Click to choose chapter.`}
          onClick={() => setExpanded(prev => !prev)}
        >
          <span className="lp-story-nav-dot" aria-hidden="true" />
          <span className="lp-story-nav-current-text">
            <strong>{currentChapter.number}</strong>
            <span>{currentChapter.label}</span>
          </span>
          <span className="lp-story-nav-chevron" aria-hidden="true">
            {expanded ? '✕' : '▾'}
          </span>
        </button>

        {/* Desktop pill chapters list */}
        <div className="lp-story-nav-list" role="list">
          {chapters.map(ch => {
            const isActive = activeId === ch.id;
            return (
              <a
                key={ch.id}
                href={`#${ch.id}`}
                role="listitem"
                className={`lp-story-nav-item ${isActive ? 'is-active' : ''}`}
                aria-current={isActive ? 'true' : undefined}
                onClick={e => scrollToChapter(ch.id, e)}
              >
                {isActive && (
                  <motion.span
                    className="lp-story-nav-active-pill"
                    layoutId={reducedMotion ? undefined : 'lp-active-pill'}
                    transition={{ duration: 0.35, ease: easeEditorial }}
                    aria-hidden="true"
                  />
                )}
                <span className="lp-story-nav-num">{ch.number}</span>
                <span className="lp-story-nav-label">{ch.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
