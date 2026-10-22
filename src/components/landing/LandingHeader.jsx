import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LandingIcon from './LandingIcon';
import useLandingNavigation from './useLandingNavigation';
import useLandingMedia from './useLandingMedia';

const links = [['Recipes', '#recipes'], ['Our Platform', '#platform'], ['Weekly Menu', '#weekly-menu-preview'], ['Vegan Stores', '#stores'], ['Community', '#community']];

export default function LandingHeader() {
  const [open, setOpen] = useState(false);
  const { activeSection, scrollYProgress } = useLandingNavigation();
  const reducedMotion = useLandingMedia('(prefers-reduced-motion: reduce)');
  return <header className="lp-header">
    <div className="lp-header-inner">
      <a href="#landing-main" className="lp-logo" aria-label="Vegan Helper home" aria-current={activeSection === 'landing-main' ? 'location' : undefined}><img src="/logo.png" alt="Vegan Helper" /></a>
      <nav aria-label="Landing page navigation" className="lp-desktop-nav">{links.map(([label, href]) => <a key={href} href={href} aria-current={activeSection === href.slice(1) ? 'location' : undefined}>{label}{activeSection === href.slice(1) && <motion.span className="lp-nav-indicator" layoutId="landing-active-section" transition={{ duration: reducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }} />}</a>)}</nav>
      <div className="lp-header-actions">
        <Link className="lp-login-link" to="/login">Log in</Link>
        <Link className="lp-button lp-button-primary lp-signup" to="/sign-up">Sign up <LandingIcon name="arrow" width="16" height="16" /></Link>
        <button className="lp-icon-button lp-menu-toggle" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="landing-mobile-nav" onClick={() => setOpen(value => !value)}><LandingIcon name={open ? 'close' : 'menu'} /></button>
      </div>
    </div>
    {open && <nav id="landing-mobile-nav" aria-label="Mobile landing page navigation" className="lp-mobile-nav" onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); document.querySelector('.lp-menu-toggle')?.focus(); } }}>{links.map(([label, href]) => <a key={href} href={href} aria-current={activeSection === href.slice(1) ? 'location' : undefined} onClick={() => setOpen(false)}>{label}<LandingIcon name="arrow" width="16" height="16" /></a>)}</nav>}
    <motion.div className="lp-reading-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
  </header>;
}
