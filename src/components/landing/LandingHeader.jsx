import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LandingIcon from './LandingIcon';
import useLandingNavigation from './useLandingNavigation';
import useLandingMedia from './useLandingMedia';
import { easeEditorial } from './motionVariants';

const links = [
  ['Our Platform', '#platform'],
  ['Recipes', '#recipes'],
  ['Weekly Menu', '#weekly-menu-preview'],
  ['Vegan Stores', '#stores'],
  ['Community', '#community'],
];

const MotionLink = motion.create ? motion.create(Link) : motion(Link);

export default function LandingHeader() {
  const [open, setOpen] = useState(false);
  const { activeSection, scrollYProgress } = useLandingNavigation();
  const reducedMotion = useLandingMedia('(prefers-reduced-motion: reduce)');

  return (
    <header className="lp-header">
      <div className="lp-header-inner">
        <a
          href="#landing-main"
          className="lp-logo"
          aria-label="Vegan Helper home"
          aria-current={activeSection === 'landing-main' ? 'location' : undefined}
        >
          <img src="/logo.png" alt="Vegan Helper" />
        </a>

        <nav aria-label="Landing page navigation" className="lp-desktop-nav">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              aria-current={activeSection === href.slice(1) ? 'location' : undefined}
            >
              {label}
              {activeSection === href.slice(1) && (
                <motion.span
                  className="lp-nav-indicator"
                  layoutId="landing-active-section"
                  transition={{ duration: reducedMotion ? 0 : 0.28, ease: easeEditorial }}
                />
              )}
            </a>
          ))}
        </nav>

        <div className="lp-header-actions">
          <MotionLink
            className="lp-login-link"
            to="/login"
            whileHover={reducedMotion ? undefined : { y: -1 }}
            whileTap={reducedMotion ? undefined : { scale: 0.98 }}
          >
            Log in
          </MotionLink>
          <MotionLink
            className="lp-button lp-button-primary lp-signup"
            to="/sign-up"
            whileHover={reducedMotion ? undefined : { y: -1, scale: 1.02 }}
            whileTap={reducedMotion ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.16 }}
          >
            Sign up <LandingIcon name="arrow" width="16" height="16" />
          </MotionLink>
          <motion.button
            className="lp-icon-button lp-menu-toggle"
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="landing-mobile-nav"
            whileTap={reducedMotion ? undefined : { scale: 0.92 }}
            onClick={() => setOpen(value => !value)}
          >
            <LandingIcon name={open ? 'close' : 'menu'} />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="landing-mobile-nav"
            aria-label="Mobile landing page navigation"
            className="lp-mobile-nav"
            initial={reducedMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: easeEditorial }}
            onKeyDown={event => {
              if (event.key === 'Escape') {
                setOpen(false);
                document.querySelector('.lp-menu-toggle')?.focus();
              }
            }}
          >
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                aria-current={activeSection === href.slice(1) ? 'location' : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
                <LandingIcon name="arrow" width="16" height="16" />
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      <motion.div
        className="lp-reading-progress"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />
    </header>
  );
}
