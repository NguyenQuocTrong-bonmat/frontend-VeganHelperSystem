import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * AccountSuspended component
 *
 * Implements the Account Suspended UI display for users whose accounts have been banned/suspended.
 * - Handles Case A (when BE provides a reason) and Case C (when BE response has empty/missing reason).
 * - Can be rendered as a standalone page (/account-suspended) or inline inside Login.jsx.
 */
export default function AccountSuspended({
  reason: propReason = null,
  isInline = false,
  onBackToLogin = null,
}) {
  const location = useLocation();

  // Extract reason from prop or router location state
  const rawReason = propReason ?? location?.state?.reason ?? location?.state?.banReason ?? null;
  const reasonText = typeof rawReason === 'string' ? rawReason.trim() : '';
  const hasReason = Boolean(reasonText);

  const cardContent = (
    <main
      role="alert"
      aria-labelledby="account-suspended-heading"
      className={`w-full max-w-[440px] bg-surface-paper border border-border-sage-mist rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col items-center text-center relative z-10 text-text-charcoal ${
        isInline ? 'shadow-none border-0 p-0 sm:p-1 bg-transparent' : ''
      }`}
    >
      {/* Icon Container */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-error-chili-bg flex items-center justify-center mb-5 border border-error-chili/20 text-error-chili">
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
      </div>

      {/* Heading */}
      <h1
        id="account-suspended-heading"
        className="font-fraunces text-2xl sm:text-[26px] leading-tight font-medium text-text-charcoal mb-2"
      >
        Account Suspended
      </h1>

      {/* Primary Notice Message */}
      <p className="text-xs sm:text-sm text-text-stem-gray leading-relaxed mb-6 max-w-[340px]">
        Your account has been suspended.
      </p>

      {/* Reason for Suspension Section */}
      <div className="w-full mb-6 text-left">
        <label
          htmlFor="suspension-reason-box"
          className="block text-xs font-semibold text-text-charcoal mb-1.5 uppercase tracking-wider"
        >
          Reason for suspension
        </label>
        <div
          id="suspension-reason-box"
          data-testid="ban-reason-section"
          className="w-full bg-[#FAFBF9] border border-border-sage-mist rounded-xl p-3.5 text-xs sm:text-sm text-text-charcoal leading-relaxed whitespace-pre-wrap break-words min-h-[56px] flex items-center"
        >
          {hasReason ? (
            <span data-testid="ban-reason-text" className="font-normal text-text-charcoal">
              {reasonText}
            </span>
          ) : (
            <span data-testid="ban-reason-fallback" className="text-text-stem-gray italic">
              Your account has been suspended by an administrator. No specific reason was provided. If you believe this is an error, please contact support.
            </span>
          )}
        </div>
      </div>

      {/* Contact Support Information */}
      <p className="text-xs text-text-stem-gray mb-6 leading-relaxed">
        If you have questions about your suspension or would like to submit an appeal, please reach out to our team at{' '}
        <a
          href="mailto:support@botanicalhearth.com"
          className="font-semibold text-primary-moss hover:underline focus-ring-vh rounded"
        >
          support@botanicalhearth.com
        </a>.
      </p>

      {/* Action Buttons */}
      <div className="w-full flex flex-col gap-2.5">
        <a
          href="mailto:support@botanicalhearth.com?subject=Account%20Suspension%20Inquiry"
          className="w-full py-2.5 px-4 bg-primary-moss hover:bg-primary-moss-hover text-white text-xs sm:text-sm font-medium rounded-xl transition-colors duration-150 flex items-center justify-center gap-2 text-center shadow-xs focus-ring-vh cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Contact Support</span>
        </a>

        {onBackToLogin ? (
          <button
            type="button"
            onClick={onBackToLogin}
            data-testid="back-to-login-btn"
            className="w-full py-2.5 px-4 bg-white hover:bg-bg-herb-white border border-border-sage-mist text-text-charcoal text-xs sm:text-sm font-medium rounded-xl transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer focus-ring-vh"
          >
            Back to Log In
          </button>
        ) : (
          <Link
            to="/login"
            data-testid="back-to-login-btn"
            className="w-full py-2.5 px-4 bg-white hover:bg-bg-herb-white border border-border-sage-mist text-text-charcoal text-xs sm:text-sm font-medium rounded-xl transition-colors duration-150 flex items-center justify-center gap-2 text-center cursor-pointer focus-ring-vh"
          >
            Back to Log In
          </Link>
        )}
      </div>
    </main>
  );

  if (isInline) {
    return cardContent;
  }

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col justify-center items-center relative bg-[#F4F6F0] p-4 text-text-charcoal overflow-hidden selection:bg-primary-moss/20">
      {/* Background blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#EAEFE5] opacity-50 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#E5ECE0] opacity-40 blur-3xl pointer-events-none" aria-hidden="true" />

      {/* Brand Header */}
      <div className="mb-6 flex items-center gap-2.5 opacity-90 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2.5 focus-ring-vh rounded-lg p-1" aria-label="Vegan Helper home">
          <div className="w-8 h-8 rounded-full bg-primary-moss/10 flex items-center justify-center text-primary-moss border border-primary-moss/20">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12a10 10 0 0 1 10-10z" />
              <path d="M12 6c-2.5 3-4 6-4 8a4 4 0 0 0 8 0c0-2-1.5-5-4-8z" />
            </svg>
          </div>
          <span className="font-fraunces text-lg font-bold text-text-charcoal tracking-tight">
            Vegan Helper
          </span>
        </Link>
      </div>

      {cardContent}
    </div>
  );
}
