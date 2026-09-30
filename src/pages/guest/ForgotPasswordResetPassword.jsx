import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

// Schemas
const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

function ForgotPasswordResetPassword() {
  const navigate = useNavigate();
  
  // States
  const [currentStep, setCurrentStep] = useState('forgot'); // 'forgot' or 'reset'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState(''); // Store email for the reset step

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
      setUserEmail(data.email);
      setCurrentStep('reset');
      toast.success('Reset token sent to your email.');
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
        email: userEmail,
        token: data.token,
        newPassword: data.newPassword
      });
      toast.success('Password reset successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      // The error could be due to an invalid token or something else
      resetForm.setError('token', { 
        type: 'manual', 
        message: err.response?.data?.error || 'Failed to reset password. The token might be invalid or expired.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          
          <div className="w-12 h-12 rounded-full bg-bg-herb-white border border-border-sage-mist flex items-center justify-center text-primary-moss mb-4">
            {currentStep === 'forgot' ? (
              <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                <circle cx="12" cy="16" r="1"></circle>
              </svg>
            ) : (
              <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            )}
          </div>
          
          <h1 className="font-serif text-[28px] leading-tight font-normal text-text-charcoal text-center mb-2">
            {currentStep === 'forgot' ? 'Reset Password' : 'Set New Password'}
          </h1>
          <p className="font-sans text-[14px] text-text-stem-gray text-center leading-relaxed max-w-[340px] mb-8">
            {currentStep === 'forgot' 
              ? "Enter your email and we'll send you a recovery token"
              : `Enter the token sent to ${userEmail} and your new password`}
          </p>

          {currentStep === 'forgot' && (
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
                  {isSubmitting ? 'Sending...' : 'Send Recovery Token'}
                </button>
              </div>
            </form>
          )}

          {currentStep === 'reset' && (
            <form className="w-full space-y-5" onSubmit={resetForm.handleSubmit(onResetSubmit)}>
              
              <div className="space-y-1.5">
                <label htmlFor="token" className="block text-[13px] font-medium text-text-charcoal">
                  Reset Token
                </label>
                <input 
                  {...resetForm.register('token')}
                  type="text" 
                  id="token" 
                  placeholder="Paste your reset token here" 
                  className={`w-full px-3.5 py-2.5 bg-white border ${resetForm.formState.errors.token ? 'border-red-500' : 'border-border-sage-mist'} rounded-[8px] text-[15px] text-text-charcoal placeholder:text-text-stem-gray/60 focus:outline-none focus:ring-2 focus:ring-primary-moss focus:border-transparent transition-colors font-mono text-sm`} 
                />
                {resetForm.formState.errors.token && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{resetForm.formState.errors.token.message}</p>
                )}
              </div>

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

              <div className="pt-1 flex flex-col gap-3">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] py-2.5 px-4 bg-primary-moss hover:bg-primary-moss-hover disabled:opacity-70 text-white font-medium text-[15px] rounded-[8px] transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setCurrentStep('forgot')}
                  className="text-xs text-text-stem-gray hover:text-primary-moss transition-colors"
                >
                  Did not receive the token? Try again
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
