import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import LandingIcon from './LandingIcon';

export default function LandingAuthDialog({ reason, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!reason) return undefined;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const handleKey = event => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key !== 'Tab') return;
      const items = dialogRef.current?.querySelectorAll('a[href], button:not([disabled])');
      if (!items?.length) return;
      const first = items[0]; const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
      if (trigger?.isConnected) trigger.focus();
    };
  }, [reason, onClose]);

  if (!reason) return null;
  return (
    <motion.div
      className="lp-dialog-backdrop"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.18 }}
      onClick={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.section
        ref={dialogRef}
        className="lp-auth-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="landing-auth-title"
        aria-describedby="landing-auth-description"
        initial={reducedMotion ? false : { opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="lp-dialog-close"
          aria-label="Close sign-in dialog"
        >
          <LandingIcon name="close" width="18" height="18" />
        </button>

        <div className="lp-dialog-symbol" aria-hidden="true">
          <LandingIcon name="leaf" width="28" height="28" />
        </div>

        <p className="lp-eyebrow">There is a place for you here</p>

        <h2 id="landing-auth-title">
          A little greener,<br />together.
        </h2>

        <p id="landing-auth-description" className="lp-dialog-desc">
          {reason}
        </p>

        <div className="lp-dialog-actions">
          <Link
            to="/sign-up"
            className="lp-button lp-button-primary lp-dialog-btn"
            onClick={onClose}
          >
            Create an Account <LandingIcon name="arrow" width="16" height="16" />
          </Link>

          <Link
            to="/login"
            className="lp-dialog-login"
            onClick={onClose}
          >
            Already part of the community? <strong>Log in</strong>
          </Link>
        </div>

        <p className="lp-dialog-note">
          You can keep exploring public posts without an account.
        </p>
      </motion.section>
    </motion.div>
  );
}

