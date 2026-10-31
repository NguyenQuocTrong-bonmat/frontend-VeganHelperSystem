import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

/**
 * UnverifiedEmailModal:
 * Notifies the user when an email is unverified (both for existing-unverified accounts
 * and freshly registered accounts awaiting verification).
 *
 * Provides instant actions:
 * 1. Navigate to OTP verification (/verify-otp)
 * 2. Resend verification code with cooldown timer
 * 3. Dismiss modal
 */
export default function UnverifiedEmailModal({
  isOpen,
  onClose,
  email,
  isExisting = false,
  onVerify,
}) {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return undefined;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(0);
      setIsResending(false);
      return undefined;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  const handleVerify = () => {
    if (onVerify) {
      onVerify();
    } else {
      onClose?.();
      navigate('/verify-otp', {
        state: {
          email: email || '',
          requiresEmail: false,
        },
      });
    }
  };

  const handleResend = async () => {
    if (!email || isResending || countdown > 0) return;
    setIsResending(true);
    try {
      await authService.resendVerification({ email: email.trim().toLowerCase() });
      toast.success('A new verification code has been sent to your email.');
      setCountdown(60);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to resend verification code. Please try again later.';
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        role="presentation"
      >
        {/* Backdrop Overlay */}
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Dialog Card */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="unverified-modal-title"
          aria-describedby="unverified-modal-desc"
          className="relative w-full max-w-[440px] bg-[#FDFBF6] border border-[#DCE5D9] rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] text-center my-auto z-10"
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95, y: prefersReducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95, y: prefersReducedMotion ? 0 : 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button top right */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#667568] hover:text-[#26342B] hover:bg-[#DDF2E1]/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#244C38]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Icon Badge */}
          <div
            className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xs border ${
              isExisting
                ? 'bg-amber-50 border-amber-200/80 text-amber-600'
                : 'bg-[#DDF2E1] border-[#A8BDA2]/60 text-[#244C38]'
            }`}
          >
            {isExisting ? (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            )}
          </div>

          {/* Heading */}
          <h2
            id="unverified-modal-title"
            className="font-dm-serif text-2xl text-[#26342B] font-semibold mb-2"
          >
            {isExisting ? 'Email Already Registered' : 'Account Verification Required'}
          </h2>

          {/* Description */}
          <div id="unverified-modal-desc" className="text-xs sm:text-[13.5px] font-dm-sans text-[#667568] leading-relaxed mb-6 space-y-2.5">
            <p>
              {isExisting ? (
                <>
                  This email has already been registered on <strong>VeganHelper</strong>, but the account has <span className="text-amber-700 font-medium">not been verified yet</span>.
                </>
              ) : (
                <>
                  Your account has been created, but your email has <span className="text-amber-700 font-medium">not been verified yet</span>.
                </>
              )}
            </p>

            {email && (
              <div className="py-1 px-3 bg-[#DDF2E1]/50 border border-[#DCE5D9] rounded-lg text-xs font-mono font-medium text-[#244C38] break-all inline-block max-w-full">
                {email}
              </div>
            )}

            <p>
              Please enter the 6-digit verification code sent to your inbox to activate your account and begin your journey.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2.5">
            {/* Primary Action: Go to OTP verification */}
            <button
              type="button"
              id="unverified-modal-verify-btn"
              onClick={handleVerify}
              className="w-full py-3 px-4 bg-[#244C38] hover:bg-[#1D3D2D] active:scale-[0.99] text-white font-dm-sans text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#244C38] focus-visible:ring-offset-2"
            >
              <span>Verify Email Now</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            {/* Secondary Action: Resend Code */}
            <button
              type="button"
              id="unverified-modal-resend-btn"
              onClick={handleResend}
              disabled={isResending || countdown > 0}
              className="w-full py-2.5 px-4 bg-transparent hover:bg-[#DDF2E1]/40 border border-[#DCE5D9] text-[#244C38] font-dm-sans text-xs sm:text-sm font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#244C38]"
            >
              {isResending ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-[#244C38]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Sending code…</span>
                </>
              ) : countdown > 0 ? (
                <span>Resend code in {countdown}s</span>
              ) : (
                <span>Resend verification code</span>
              )}
            </button>

            {/* Dismiss action */}
            <button
              type="button"
              id="unverified-modal-close-btn"
              onClick={onClose}
              className="w-full py-2 text-xs font-dm-sans text-[#667568] hover:text-[#26342B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#244C38] rounded-lg"
            >
              Back to form
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
