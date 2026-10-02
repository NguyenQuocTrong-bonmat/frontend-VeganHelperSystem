import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import HeaderAuth from '../../components/layout/HeaderAuth';

// 1. Define validation schema
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Setup react-hook-form
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await login(data);
      // Navigate to the previous page or /home
      const from = location.state?.from?.pathname || '/home';
      navigate(from, { replace: true });
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error('Vui lòng xác thực email trước khi đăng nhập.');
        navigate('/verify-otp', {
          state: {
            email: data.email,
            password: data.password
          }
        });
        return;
      }
      if (err.response?.status === 401) {
        setError('email', { type: 'manual', message: 'Incorrect email or password' });
        setError('password', { type: 'manual', message: 'Incorrect email or password' });
        return;
      }
      // Read the backend's error contract without losing the form state.
      const errorMsg = (err.response?.data?.message || err.response?.data?.error || '').toLowerCase();
      
      // Map backend errors to inline field errors as requested
      if (errorMsg.includes('not found') || errorMsg.includes('user')) {
        setError('email', { type: 'manual', message: 'Email address does not exist' });
      } else if (errorMsg.includes('password') || errorMsg.includes('invalid')) {
        setError('password', { type: 'manual', message: 'Incorrect password' });
      } else {
        // Fallback generic error
        setError('email', { type: 'manual', message: 'Incorrect email or password' });
        setError('password', { type: 'manual', message: 'Incorrect email or password' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <>
      <HeaderAuth />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[440px] bg-surface-paper border border-border-sage-mist rounded-[16px] p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-bg-herb-white border border-border-sage-mist text-primary-moss mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
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
          
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-xs font-medium text-text-charcoal mb-1.5" htmlFor="email">
                Email address
              </label>
              <input 
                {...register('email')}
                className={`w-full h-11 px-3.5 bg-surface-paper border ${errors.email ? 'border-[#A63446]' : 'border-border-sage-mist'} rounded-[8px] text-sm text-text-charcoal placeholder:text-text-stem-gray focus:outline-none focus:border-primary-moss transition-colors`}
                id="email" 
                placeholder="email@example.com" 
                type="text" // Use text so html validation doesn't override zod
              />
              {errors.email && (
                <p className="text-[#A63446] text-xs mt-1.5 font-medium">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-text-charcoal" htmlFor="password">
                  Password
                </label>
                <Link className="text-xs text-text-stem-gray hover:text-primary-moss transition-colors" to="/forgot-password">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input 
                  {...register('password')}
                  className={`w-full h-11 px-3.5 pr-10 bg-surface-paper border ${errors.password ? 'border-[#A63446]' : 'border-border-sage-mist'} rounded-[8px] text-sm text-text-charcoal placeholder:text-text-stem-gray focus:outline-none focus:border-primary-moss transition-colors`}
                  id="password" 
                  placeholder="Enter your password" 
                  type={showPassword ? "text" : "password"} 
                />
                <button 
                  aria-label="Toggle password visibility" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-stem-gray hover:text-text-charcoal transition-colors" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <line x1="2" y1="2" x2="22" y2="22"></line>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[#A63446] text-xs mt-1.5 font-medium">{errors.password.message}</p>
              )}
            </div>
            
            <div className="flex items-center gap-2 pt-1">
              <input {...register('rememberMe')} className="w-4 h-4 rounded border-border-sage-mist text-primary-moss focus:ring-0 cursor-pointer accent-[#2F5233]" id="remember" type="checkbox" />
              <label className="text-xs text-text-stem-gray select-none cursor-pointer" htmlFor="remember">
                Remember me on this device
              </label>
            </div>
            
            <div className="pt-2">
              <button 
                disabled={isSubmitting}
                className="w-full h-11 min-h-[44px] bg-primary-moss hover:bg-primary-moss-hover disabled:opacity-70 text-white text-sm font-medium rounded-[8px] transition-colors flex items-center justify-center gap-2" 
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
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
            
            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    setIsSubmitting(true);
                    await loginWithGoogle(credentialResponse.credential);
                    const from = location.state?.from?.pathname || '/home';
                    navigate(from, { replace: true });
                  } catch (err) {
                    if (err.response?.status === 409) {
                      toast.error('Email này đã được đăng ký. Hãy đăng nhập bằng email/password để liên kết Google.');
                    } else {
                      toast.error(err.response?.data?.error || 'Google login failed. Please try again.');
                    }
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                onError={() => {
                  toast.error('Google login was unsuccessful.');
                }}
                size="large"
                theme="outline"
                text="signin_with"
                shape="rectangular"
                width="360"
              />
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-border-sage-mist text-center">
            <p className="text-sm text-text-stem-gray">
              Don't have an account?
              <Link className="font-medium text-primary-moss hover:underline transition-all ml-1" to="/sign-up">
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <footer className="w-full py-6 text-center text-xs text-text-stem-gray border-t border-border-sage-mist">
        <div className="max-w-[1120px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2025 Botanical Hearth. Plant-based culinary & family nutrition platform.</span>
          <div className="flex items-center gap-4">
            <Link className="hover:text-primary-moss transition-colors" to="#">Terms of Service</Link>
            <Link className="hover:text-primary-moss transition-colors" to="#">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Login;
