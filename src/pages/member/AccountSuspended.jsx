function AccountSuspended() {
  return (
    <>
      {/* Subtle organic background watermark elements consistent with Botanical Hearth */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#EAEFE5] opacity-50 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#E5ECE0] opacity-40 blur-3xl pointer-events-none"></div>
      {/* Minimal Brand Header Indicator for Context (No Navbar) */}
      <div className="mb-8 flex items-center gap-2.5 opacity-90">
        <div className="w-8 h-8 rounded-full bg-primary-moss/10 flex items-center justify-center text-primary-moss border border-primary-moss/20">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12a10 10 0 0 1 10-10z"></path>
            <path d="M12 6c-2.5 3-4 6-4 8a4 4 0 0 0 8 0c0-2-1.5-5-4-8z"></path>
          </svg>
        </div>
        <span className="font-caslon text-lg font-bold text-text-charcoal tracking-tight">
          Botanical Hearth
        </span>
      </div>
      {/* Warning Card */}
      <main className="w-full max-w-[460px] bg-surface-paper border border-border-sage-mist rounded-xl shadow-none p-8 sm:p-10 flex flex-col items-center text-center relative z-10">
        {/* Icon Container */}
        <div className="w-16 h-16 rounded-full bg-error-chili-bg flex items-center justify-center mb-6 border border-error-chili/20">
          <svg className="w-8 h-8 text-error-chili" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            <circle cx="12" cy="16" r="1.25" fill="currentColor"></circle>
          </svg>
        </div>
        {/* Heading */}
        <h1 className="font-caslon text-2xl sm:text-[28px] leading-tight font-normal text-text-charcoal mb-3">
          Account Suspended
        </h1>
        {/* Primary Notice Message */}
        <p className="text-sm sm:text-[15px] leading-relaxed text-text-charcoal max-w-[340px] mb-4">
          Your account has been restricted due to a violation of our community standards.
        </p>
        {/* Reference Details / Timestamp Box */}
        <div className="w-full bg-bg-herb-white/80 border border-border-sage-mist/80 rounded-lg py-2.5 px-4 mb-8 text-left">
          <div className="flex items-center justify-between text-xs text-text-stem-gray">
            <span>
              Restriction ID:
            </span>
            <span className="font-mono text-text-charcoal font-medium">
              #SUSP-84920
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-text-stem-gray mt-1">
            <span>
              Effective Date:
            </span>
            <span className="text-text-charcoal">
              March 29, 2025
            </span>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          {/* Primary: Contact Support */}
          <a href="mailto:support@botanicalhearth.com" className="w-full py-3 px-4 bg-primary-moss hover:bg-primary-moss-hover text-white text-sm font-medium rounded-lg transition-colors duration-150 flex items-center justify-center gap-2 text-center">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>
              Contact Support
            </span>
          </a>
          {/* Secondary: Log Out */}
          <button type="button" className="w-full py-2.5 px-4 bg-transparent hover:bg-bg-herb-white border-[1.5px] border-border-sage-mist text-text-stem-gray hover:text-text-charcoal text-sm font-medium rounded-lg transition-colors duration-150 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>
              Log Out
            </span>
          </button>
        </div>
        {/* Additional Help Text */}
        <p className="mt-6 text-xs text-text-stem-gray leading-normal">
          If you believe this suspension was made in error, please submit an appeal via support.
        </p>
      </main>
    </>
  );
}

export default AccountSuspended;
