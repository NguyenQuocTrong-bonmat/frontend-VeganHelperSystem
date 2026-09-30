import { Link } from 'react-router-dom'

function SignUp() {
  return (
    <>
      {/* Top Simple Navigation Bar */}
      <header className="w-full h-16 bg-surface-paper border-b border-border-sage-mist px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Leaf Icon line-art */}
          <svg className="w-6 h-6 text-primary-moss stroke-[1.5]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
          </svg>
          <span className="font-fraunces text-2xl font-semibold text-primary-moss tracking-tight">
            Botanical Hearth
          </span>
        </div>
        <div>
          <a className="text-sm font-medium text-text-stem-gray hover:text-primary-moss transition-colors duration-150" href="#">
            Back to home
          </a>
        </div>
      </header>
      {/* Main Content Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 my-4">
        <div className="w-full max-w-[480px] bg-surface-paper border border-border-sage-mist rounded-2xl p-6 sm:p-8">
          {/* Top Icon & Heading */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-bg-herb-white border border-border-sage-mist mx-auto flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-text-stem-gray stroke-[1.5]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <line x1="19" x2="19" y1="8" y2="14"></line>
                <line x1="22" x2="16" y1="11" y2="11"></line>
              </svg>
            </div>
            <h1 className="font-fraunces text-3xl font-medium text-text-charcoal mb-1 tracking-tight">
              Sign Up
            </h1>
            <p className="text-sm text-text-stem-gray">
              Create an account to join the Botanical Hearth community
            </p>
          </div>
          {/* Registration Form */}
          <form className="space-y-4">
            {/* Field 1: Full Name */}
            <div>
              <label className="block text-[13px] font-medium text-text-charcoal mb-1.5" htmlFor="fullname">
                Full Name
              </label>
              <div className="relative">
                <input className="w-full h-11 px-3.5 rounded-lg border border-border-sage-mist bg-surface-paper text-[15px] text-text-charcoal placeholder:text-text-stem-gray transition-colors duration-150" id="fullname" placeholder="User Name" type="text" />
              </div>
            </div>
            {/* Field 2: Email address */}
            <div>
              <label className="block text-[13px] font-medium text-text-charcoal mb-1.5" htmlFor="email">
                Email address
              </label>
              <div className="relative">
                <input className="w-full h-11 px-3.5 rounded-lg border border-border-sage-mist bg-surface-paper text-[15px] text-text-charcoal placeholder:text-text-stem-gray transition-colors duration-150" id="email" placeholder="email@example.com" type="email" />
              </div>
            </div>
            {/* Field 3: Password */}
            <div>
              <label className="block text-[13px] font-medium text-text-charcoal mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input className="w-full h-11 px-3.5 pr-10 rounded-lg border border-border-sage-mist bg-surface-paper text-[15px] text-text-charcoal placeholder:text-text-stem-gray transition-colors duration-150" id="password" placeholder="Enter your password" type="password" />
                <button aria-label="Show password" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-stem-gray hover:text-text-charcoal p-1" type="button">
                  <svg className="w-4 h-4 stroke-[1.5]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>
            {/* Field 4: Confirm Password */}
            <div>
              <label className="block text-[13px] font-medium text-text-charcoal mb-1.5" htmlFor="confirm-password">
                Confirm Password
              </label>
              <div className="relative">
                <input className="w-full h-11 px-3.5 pr-10 rounded-lg border border-border-sage-mist bg-surface-paper text-[15px] text-text-charcoal placeholder:text-text-stem-gray transition-colors duration-150" id="confirm-password" placeholder="Re-enter your password" type="password" />
                <button aria-label="Show password" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-stem-gray hover:text-text-charcoal p-1" type="button">
                  <svg className="w-4 h-4 stroke-[1.5]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>
            {/* Terms Agreement Checkbox */}
            <div className="flex items-start gap-2 pt-1 pb-1">
              <input className="mt-1 w-4 h-4 rounded border-border-sage-mist text-primary-moss focus:ring-0 focus:ring-offset-0 accent-primary-moss cursor-pointer" id="terms" type="checkbox" />
              <label className="text-[13px] text-text-stem-gray leading-snug cursor-pointer select-none" htmlFor="terms">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>
            {/* Primary Action Button: Sign Up */}
            <div className="pt-1">
              <button className="w-full h-11 bg-primary-moss hover:bg-primary-moss-hover text-white font-medium text-[15px] rounded-lg transition-colors duration-150 flex items-center justify-center cursor-pointer shadow-none" type="submit">
                Sign Up
              </button>
            </div>
            {/* Divider "Or" */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-border-sage-mist"></div>
              <span className="flex-shrink mx-3 text-xs text-text-stem-gray font-normal">
                Or
              </span>
              <div className="flex-grow border-t border-border-sage-mist"></div>
            </div>
            {/* Google Register Button */}
            <button className="w-full h-11 bg-surface-paper hover:bg-bg-herb-white text-text-charcoal border border-border-sage-mist font-medium text-[15px] rounded-lg transition-colors duration-150 flex items-center justify-center gap-2.5 cursor-pointer shadow-none" type="button">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
              </svg>
              <span>
                Sign up with Google
              </span>
            </button>
          </form>
          {/* Bottom Navigation Link */}
          <div className="mt-6 pt-5 border-t border-border-sage-mist/60 text-center text-sm text-text-stem-gray">
            Already have an account?
            <Link className="text-primary-moss font-medium hover:underline hover:text-primary-moss-hover ml-1 transition-colors duration-150" to="/login">
              Log In
            </Link>
          </div>
        </div>
      </main>
      {/* Simple Footer */}
      <footer className="w-full py-4 text-center text-xs text-text-stem-gray">
        © 2025 Botanical Hearth. Plant-based culinary & family nutrition platform.
      </footer>
    </>
  );
}

export default SignUp;
