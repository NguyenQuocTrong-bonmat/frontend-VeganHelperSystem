import { Link } from 'react-router-dom';

function ForgotPasswordResetPassword() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-herb-white">
      <header className="w-full bg-surface-paper border-b border-border-sage-mist h-16 flex items-center px-6 md:px-12 shrink-0">
        <div className="max-w-[1120px] w-full mx-auto flex items-center justify-between">
          <Link className="flex items-center gap-2.5 text-primary-moss font-fraunces font-semibold text-2xl tracking-tight" to="/">
            <svg className="w-6 h-6 text-primary-moss" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
              <path d="M2 21c0-3 1.85-5.36 5.08-6"></path>
            </svg>
            <span>Botanical Hearth</span>
          </Link>
          <Link className="text-sm font-medium text-text-stem-gray hover:text-primary-moss transition-colors" to="/login">
            Back to login
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px] bg-surface-paper border border-border-sage-mist rounded-[12px] p-8 sm:p-10 flex flex-col items-center shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <svg className="w-6 h-6 text-primary-moss stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
          </svg>
          <span className="font-serif text-[22px] font-normal tracking-tight text-primary-moss">
            Botanical Hearth
          </span>
        </div>
        {/* Header Icon */}
        <div className="w-12 h-12 rounded-full bg-bg-herb-white border border-border-sage-mist flex items-center justify-center text-primary-moss mb-4">
          <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            <circle cx="12" cy="16" r="1"></circle>
          </svg>
        </div>
        {/* Title & Subtitle */}
        <h1 className="font-serif text-[28px] leading-tight font-normal text-text-charcoal text-center mb-2">
          Reset Password
        </h1>
        <p className="font-sans text-[14px] text-text-stem-gray text-center leading-relaxed max-w-[340px] mb-8">
          Enter your email and we'll send you a recovery link
        </p>
        {/* Reset Password Form */}
        <form id="reset-form" className="w-full space-y-5">
          {/* Email Address Input */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-[13px] font-medium text-text-charcoal">
              Email Address
            </label>
            <div className="relative">
              <input type="email" id="email" name="email" required placeholder="name@example.com" className="w-full px-3.5 py-2.5 bg-white border border-border-sage-mist rounded-[8px] text-[15px] text-text-charcoal placeholder:text-text-stem-gray/60 focus:outline-none focus:ring-2 focus:ring-primary-moss focus:border-transparent transition-colors duration-200" />
            </div>
          </div>
          {/* Submit Button */}
          <div className="pt-1">
            <button type="submit" id="submit-btn" className="w-full min-h-[44px] py-2.5 px-4 bg-primary-moss hover:bg-primary-moss-hover text-white font-medium text-[15px] rounded-[8px] transition-colors duration-200 ease-in-out flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-moss focus:ring-offset-2 focus:ring-offset-surface-paper">
              <span>
                Send Recovery Link
              </span>
            </button>
          </div>
          {/* Success Notification Box (Initially Hidden) */}
          <div id="success-alert" className="hidden p-3.5 bg-[#E8F0E4] border border-[#C5D8BF] rounded-[8px] text-[13px] text-primary-moss flex items-start gap-2.5 transition-all">
            <svg className="w-4 h-4 mt-0.5 shrink-0 text-success-sprout stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>
              A password reset link has been dispatched to your email inbox. Please check within 5 minutes.
            </span>
          </div>
          {/* Back to Log In Link */}
          <div className="pt-2 text-center">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-[14px] text-text-stem-gray hover:text-primary-moss transition-colors duration-200 group">
              <svg className="w-4 h-4 stroke-current transition-transform duration-200 group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"></path>
              </svg>
              <span>
                Back to Log In
              </span>
            </Link>
          </div>
        </form>
        </div>
      </main>
    </div>
  );
}

export default ForgotPasswordResetPassword;
