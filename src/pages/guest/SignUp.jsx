import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../services/authService';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import HeaderAuth from '../../components/layout/HeaderAuth';

// 1. Define validation schema
const registerSchema = z.object({
  fullName: z.string().min(3, 'Full Name must be at least 3 characters').max(100, 'Full Name is too long'),
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
  const { loginWithGoogle } = useAuth();
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
        fullName: data.fullName,
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
      
      if (errorMsg.includes('email') && (errorMsg.includes('exist') || errorMsg.includes('already') || errorMsg.includes('registered'))) {
        setError('email', { type: 'manual', message: 'Email is already in use' });
      } else if (errorMsg.includes('username') && (errorMsg.includes('exist') || errorMsg.includes('already') || errorMsg.includes('registered'))) {
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
      <HeaderAuth />

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
            {/* Field 0: Full Name */}
            <div>
              <label className="block text-[13px] font-medium text-text-charcoal mb-1.5" htmlFor="fullName">
                Full Name
              </label>
              <div className="relative">
                <input 
                  {...register('fullName')}
                  className={`w-full h-11 px-3.5 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-border-sage-mist'} bg-surface-paper text-[15px] text-text-charcoal placeholder:text-text-stem-gray focus:outline-none focus:border-primary-moss transition-colors`} 
                  id="fullName" 
                  placeholder="John Doe" 
                  type="text" 
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.fullName.message}</p>}
              </div>
            </div>

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
            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    setIsSubmitting(true);
                    await loginWithGoogle(credentialResponse.credential);
                    navigate('/home');
                  } catch (err) {
                    toast.error('Google login failed. Please try again.');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                onError={() => {
                  toast.error('Google login was unsuccessful.');
                }}
                size="large"
                theme="outline"
                text="signup_with"
                shape="rectangular"
                width="400"
              />
            </div>
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
