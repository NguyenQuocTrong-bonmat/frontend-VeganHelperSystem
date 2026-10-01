import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import HeaderAuth from '../../components/layout/HeaderAuth';

// Schemas
const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

function ForgotPasswordResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token');
  const emailQuery = searchParams.get('email');
  
  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Determine Mode: "forgot" or "reset"
  const mode = token && emailQuery ? 'reset' : 'forgot';

  const forgotForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const resetForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onForgotSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await authService.forgotPassword({ email: data.email });
      setIsSuccess(true);
    } catch (err) {
      forgotForm.setError('email', { 
        type: 'manual', 
        message: err.response?.data?.error || 'Failed to send reset link.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onResetSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await authService.resetPassword({
        email: emailQuery,
        token: token,
        newPassword: data.newPassword
      });
      toast.success('Password reset successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      resetForm.setError('newPassword', { 
        type: 'manual', 
        message: err.response?.data?.error || 'Failed to reset password. The link might be expired.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-herb-white">
      <HeaderAuth />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px] bg-surface-paper border border-border-sage-mist rounded-[12px] p-8 sm:p-10 flex flex-col items-center shadow-sm">
          
          <div className="w-12 h-12 rounded-full bg-bg-herb-white border border-border-sage-mist flex items-center justify-center text-primary-moss mb-4">
            <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              <circle cx="12" cy="16" r="1"></circle>
            </svg>
          </div>
          
          <h1 className="font-serif text-[28px] leading-tight font-normal text-text-charcoal text-center mb-2">
            {mode === 'forgot' ? 'Reset Password' : 'Set New Password'}
          </h1>
          <p className="font-sans text-[14px] text-text-stem-gray text-center leading-relaxed max-w-[340px] mb-8">
            {mode === 'forgot' 
              ? "Enter your email and we'll send you a recovery link"
              : "Please enter your new password below"}
          </p>

          {mode === 'forgot' && !isSuccess && (
            <form className="w-full space-y-5" onSubmit={forgotForm.handleSubmit(onForgotSubmit)}>
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-[13px] font-medium text-text-charcoal">
                  Email Address
                </label>
                <input 
                  {...forgotForm.register('email')}
                  type="email" 
                  id="email" 
                  placeholder="name@example.com" 
                  className={`w-full px-3.5 py-2.5 bg-white border ${forgotForm.formState.errors.email ? 'border-red-500' : 'border-border-sage-mist'} rounded-[8px] text-[15px] text-text-charcoal placeholder:text-text-stem-gray/60 focus:outline-none focus:ring-2 focus:ring-primary-moss focus:border-transparent transition-colors duration-200`} 
                />
                {forgotForm.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{forgotForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="pt-1">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] py-2.5 px-4 bg-primary-moss hover:bg-primary-moss-hover disabled:opacity-70 text-white font-medium text-[15px] rounded-[8px] transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Sending...' : 'Send Recovery Link'}
                </button>
              </div>
            </form>
          )}

          {mode === 'forgot' && isSuccess && (
            <div className="w-full p-4 bg-[#E8F0E4] border border-[#C5D8BF] rounded-[8px] text-[14px] text-primary-moss flex items-start gap-3 transition-all">
              <svg className="w-5 h-5 mt-0.5 shrink-0 text-success-sprout stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>
                A password reset link has been dispatched to your email inbox. Please check your spam folder if you don't see it.
              </span>
            </div>
          )}

          {mode === 'reset' && (
            <form className="w-full space-y-5" onSubmit={resetForm.handleSubmit(onResetSubmit)}>
              <div className="space-y-1.5">
                <label htmlFor="newPassword" className="block text-[13px] font-medium text-text-charcoal">
                  New Password
                </label>
                <input 
                  {...resetForm.register('newPassword')}
                  type="password" 
                  id="newPassword" 
                  placeholder="••••••••" 
                  className={`w-full px-3.5 py-2.5 bg-white border ${resetForm.formState.errors.newPassword ? 'border-red-500' : 'border-border-sage-mist'} rounded-[8px] text-[15px] text-text-charcoal placeholder:text-text-stem-gray/60 focus:outline-none focus:ring-2 focus:ring-primary-moss focus:border-transparent transition-colors`} 
                />
                {resetForm.formState.errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{resetForm.formState.errors.newPassword.message}</p>
                )}
              </div>
              
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-[13px] font-medium text-text-charcoal">
                  Confirm New Password
                </label>
                <input 
                  {...resetForm.register('confirmPassword')}
                  type="password" 
                  id="confirmPassword" 
                  placeholder="••••••••" 
                  className={`w-full px-3.5 py-2.5 bg-white border ${resetForm.formState.errors.confirmPassword ? 'border-red-500' : 'border-border-sage-mist'} rounded-[8px] text-[15px] text-text-charcoal placeholder:text-text-stem-gray/60 focus:outline-none focus:ring-2 focus:ring-primary-moss focus:border-transparent transition-colors`} 
                />
                {resetForm.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{resetForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="pt-1">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] py-2.5 px-4 bg-primary-moss hover:bg-primary-moss-hover disabled:opacity-70 text-white font-medium text-[15px] rounded-[8px] transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}

          <div className="pt-6 w-full text-center">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-[14px] text-text-stem-gray hover:text-primary-moss transition-colors duration-200 group">
              <svg className="w-4 h-4 stroke-current transition-transform duration-200 group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"></path>
              </svg>
              <span>
                Back to Log In
              </span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ForgotPasswordResetPassword;
