import { Link } from 'react-router-dom'

function Login() {
  return (
    <>
      {/* Header đơn giản / liên kết quay lại */}
      <header className="w-full bg-surface-paper border-b border-border-sage-mist h-16 flex items-center px-6 md:px-12">
        <div className="max-w-[1120px] w-full mx-auto flex items-center justify-between">
          <Link className="flex items-center gap-2.5 text-primary-moss font-fraunces font-semibold text-2xl tracking-tight" to="/">
            <svg className="w-6 h-6 text-primary-moss" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
              <path d="M2 21c0-3 1.85-5.36 5.08-6"></path>
            </svg>
            <span>
              Botanical Hearth
            </span>
          </Link>
          <a className="text-sm font-medium text-text-stem-gray hover:text-primary-moss transition-colors" href="#">
            Back to home
          </a>
        </div>
      </header>
      {/* Vùng nội dung chính chứa Form Đăng nhập */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px] bg-surface-paper border border-border-sage-mist rounded-[16px] p-8 md:p-10">
          {/* Logo biểu tượng nhỏ & Tiêu đề */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-bg-herb-white border border-border-sage-mist text-primary-moss mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h1 className="font-fraunces text-3xl font-medium text-text-charcoal mb-2">
              Log In
            </h1>
            <p className="text-text-stem-gray text-sm">
              Welcome back to your cozy kitchen
            </p>
          </div>
          {/* Biểu mẫu Form */}
          <form className="space-y-5">
            {/* Ô nhập Email */}
            <div>
              <label className="block text-xs font-medium text-text-charcoal mb-1.5" htmlFor="email">
                Email address
              </label>
              <input className="w-full h-11 px-3.5 bg-surface-paper border border-border-sage-mist rounded-[8px] text-sm text-text-charcoal placeholder:text-text-stem-gray focus:outline-none focus:border-primary-moss transition-colors" id="email" name="email" placeholder="email@example.com" type="email" />
            </div>
            {/* Ô nhập Mật khẩu */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-text-charcoal" htmlFor="password">
                  Password
                </label>
                <a className="text-xs text-text-stem-gray hover:text-primary-moss transition-colors" href="#">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input className="w-full h-11 px-3.5 pr-10 bg-surface-paper border border-border-sage-mist rounded-[8px] text-sm text-text-charcoal placeholder:text-text-stem-gray focus:outline-none focus:border-primary-moss transition-colors" id="password" name="password" placeholder="Enter your password" type="password" />
                <button aria-label="Toggle password visibility" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-stem-gray hover:text-text-charcoal transition-colors" type="button">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>
            {/* Ghi nhớ đăng nhập */}
            <div className="flex items-center gap-2 pt-1">
              <input className="w-4 h-4 rounded border-border-sage-mist text-primary-moss focus:ring-0 cursor-pointer accent-[#2F5233]" id="remember" type="checkbox" />
              <label className="text-xs text-text-stem-gray select-none cursor-pointer" htmlFor="remember">
                Remember me on this device
              </label>
            </div>
            {/* Nút Đăng nhập */}
            <div className="pt-2">
              <button className="w-full h-11 min-h-[44px] bg-primary-moss hover:bg-primary-moss-hover text-white text-sm font-medium rounded-[8px] transition-colors flex items-center justify-center" type="submit">
                Log In
              </button>
            </div>
            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-sage-mist"></div>
              </div>
              <span className="relative bg-surface-paper px-3 text-xs text-text-stem-gray font-medium">
                Or
              </span>
            </div>
            <button className="w-full h-11 min-h-[44px] bg-surface-paper hover:bg-bg-herb-white border border-border-sage-mist text-text-charcoal text-[15px] font-medium rounded-[8px] transition-colors duration-150 flex items-center justify-center gap-3" type="button">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" fill="#4285F4"></path>
                <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z" fill="#34A853"></path>
                <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" fill="#FBBC05"></path>
                <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" fill="#EA4335"></path>
              </svg>
              <span>
                Sign in with Google
              </span>
            </button>
          </form>
          {/* Liên kết Đăng ký */}
          <div className="mt-8 pt-6 border-t border-border-sage-mist text-center">
            <p className="text-sm text-text-stem-gray">
              Don't have an account?
              <a className="font-medium text-primary-moss hover:underline transition-all ml-1" href="#">
                Sign up now
              </a>
            </p>
          </div>
        </div>
      </main>
      {/* Footer tinh gọn */}
      <footer className="w-full py-6 text-center text-xs text-text-stem-gray border-t border-border-sage-mist">
        <div className="max-w-[1120px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            © 2025 Botanical Hearth. Plant-based culinary & family nutrition platform.
          </span>
          <div className="flex items-center gap-4">
            <a className="hover:text-primary-moss transition-colors" href="#">
              Terms of Service
            </a>
            <a className="hover:text-primary-moss transition-colors" href="#">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Login;
