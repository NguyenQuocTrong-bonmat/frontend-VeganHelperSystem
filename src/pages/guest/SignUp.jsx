import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

// 1. Define validation schema
const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(100, 'Username is too long'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the Terms of Service',
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setup react-hook-form
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      terms: false
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Map to backend expected DTO
      const payload = {
        username: data.username,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword
      };
      
      await authService.register(payload);
      toast.success('Registration successful! Please verify your email.');
      navigate('/verify-otp', {
        state: {
          email: data.email,
          password: data.password // Pass password to auto-login later
        }
      });
    } catch (err) {
      const errorMsg = err.response?.data?.error?.toLowerCase() || '';
      
      if (errorMsg.includes('email') && errorMsg.includes('exist')) {
        setError('email', { type: 'manual', message: 'Email is already in use' });
      } else if (errorMsg.includes('username') && errorMsg.includes('exist')) {
        setError('username', { type: 'manual', message: 'Username is already taken' });
      } else {
        toast.error(err.response?.data?.error || 'Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="w-full h-16 bg-surface-paper border-b border-border-sage-mist px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <svg className="w-6 h-6 text-primary-moss stroke-[1.5]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
            </svg>
            <span className="font-fraunces text-2xl font-semibold text-primary-moss tracking-tight">
              Botanical Hearth
            </span>
          </Link>
        </div>
        <div>
          <Link className="text-sm font-medium text-text-stem-gray hover:text-primary-moss transition-colors duration-150" to="/">
            Back to home
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 my-4">
        <div className="w-full max-w-[480px] bg-surface-paper border border-border-sage-mist rounded-2xl p-6 sm:p-8">
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

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Field 1: Username */}
            <div>
              <label className="block text-[13px] font-medium text-text-charcoal mb-1.5" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <input 
                  {...register('username')}
                  className={`w-full h-11 px-3.5 rounded-lg border ${errors.username ? 'border-red-500' : 'border-border-sage-mist'} bg-surface-paper text-[15px] text-text-charcoal placeholder:text-text-stem-gray focus:outline-none focus:border-primary-moss transition-colors`} 
                  id="username" 
                  placeholder="johndoe" 
                  type="text" 
                />
                {errors.username && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.username.message}</p>}
              </div>
            </div>

            {/* Field 2: Email address */}
            <div>
              <label className="block text-[13px] font-medium text-text-charcoal mb-1.5" htmlFor="email">
                Email address
              </label>
              <div className="relative">
                <input 
                  {...register('email')}
                  className={`w-full h-11 px-3.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-border-sage-mist'} bg-surface-paper text-[15px] text-text-charcoal placeholder:text-text-stem-gray focus:outline-none focus:border-primary-moss transition-colors`} 
                  id="email" 
                  placeholder="email@example.com" 
                  type="text" 
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
              </div>
            </div>

            {/* Field 3: Password */}
            <div>
              <label className="block text-[13px] font-medium text-text-charcoal mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input 
                  {...register('password')}
                  className={`w-full h-11 px-3.5 pr-10 rounded-lg border ${errors.password ? 'border-red-500' : 'border-border-sage-mist'} bg-surface-paper text-[15px] text-text-charcoal placeholder:text-text-stem-gray focus:outline-none focus:border-primary-moss transition-colors`} 
                  id="password" 
                  placeholder="Enter your password (min 8 chars)" 
                  type={showPassword ? "text" : "password"} 
                />
                <button aria-label="Show password" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-stem-gray hover:text-text-charcoal p-1" type="button">
                  {showPassword ? (
                    <svg className="w-4 h-4 stroke-[1.5]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>
                  ) : (
                    <svg className="w-4 h-4 stroke-[1.5]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
            </div>

            {/* Field 4: Confirm Password */}
            <div>
              <label className="block text-[13px] font-medium text-text-charcoal mb-1.5" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <input 
                  {...register('confirmPassword')}
                  className={`w-full h-11 px-3.5 pr-10 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-border-sage-mist'} bg-surface-paper text-[15px] text-text-charcoal placeholder:text-text-stem-gray focus:outline-none focus:border-primary-moss transition-colors`} 
                  id="confirmPassword" 
                  placeholder="Re-enter your password" 
                  type={showConfirmPassword ? "text" : "password"} 
                />
                <button aria-label="Show password" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-stem-gray hover:text-text-charcoal p-1" type="button">
                  {showConfirmPassword ? (
                    <svg className="w-4 h-4 stroke-[1.5]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>
                  ) : (
                    <svg className="w-4 h-4 stroke-[1.5]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.confirmPassword.message}</p>}
            </div>

            {/* Terms Agreement Checkbox */}
            <div>
              <div className="flex items-start gap-2 pt-1">
                <input {...register('terms')} className="mt-1 w-4 h-4 rounded border-border-sage-mist text-primary-moss focus:ring-0 focus:ring-offset-0 accent-primary-moss cursor-pointer" id="terms" type="checkbox" />
                <label className="text-[13px] text-text-stem-gray leading-snug cursor-pointer select-none" htmlFor="terms">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>
              {errors.terms && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.terms.message}</p>}
            </div>

            {/* Primary Action Button: Sign Up */}
            <div className="pt-2">
              <button 
                disabled={isSubmitting}
                className="w-full h-11 bg-primary-moss hover:bg-primary-moss-hover disabled:opacity-70 text-white font-medium text-[15px] rounded-lg transition-colors duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-none" 
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>

            {/* Divider "Or" */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-border-sage-mist"></div>
              <span className="flex-shrink mx-3 text-xs text-text-stem-gray font-normal">Or</span>
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
              <span>Sign up with Google</span>
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

      <footer className="w-full py-4 text-center text-xs text-text-stem-gray">
        © 2025 Botanical Hearth. Plant-based culinary & family nutrition platform.
      </footer>
    </>
  );
}

export default SignUp;
