import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const otpSchema = z.object({
  otp: z.string().min(6, 'OTP must be exactly 6 digits').max(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const [isResending, setIsResending] = useState(false);

  // Get state from navigation (from SignUp or elsewhere)
  const email = location.state?.email;
  const password = location.state?.password;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpSchema),
  });

  // Countdown timer logic
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Format countdown as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // 1. Verify the OTP
      await authService.verifyEmail({
        email,
        otp: data.otp
      });
      
      toast.success('Email verified successfully!');

      // 2. Auto-login if we have the password
      if (password) {
        try {
          await login({ email, password, rememberMe: true });
          toast.success('Logged in successfully!');
          navigate('/home', { replace: true });
        } catch (loginErr) {
          // If auto-login fails, redirect to login page
          navigate('/login');
        }
      } else {
        // No password provided (maybe navigated directly?), go to login
        navigate('/login');
      }

    } catch (err) {
      setError('otp', { 
        type: 'manual', 
        message: err.response?.data?.error || 'Invalid or expired OTP.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    
    setIsResending(true);
    try {
      await authService.resendVerification({ email });
      toast.success('A new verification code has been sent to your email.');
      setCountdown(120); // Reset timer
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to resend OTP. Try again later.');
    } finally {
      setIsResending(false);
    }
  };

  // If someone lands here without state, redirect to sign up
  if (!email) {
    return <Navigate to="/sign-up" replace />;
  }

  return (
    <>
      <header className="w-full bg-surface-paper border-b border-border-sage-mist h-16 flex items-center px-6 md:px-12">
        <div className="max-w-[1120px] w-full mx-auto flex items-center justify-between">
          <Link className="flex items-center gap-2.5 text-primary-moss font-fraunces font-semibold text-2xl tracking-tight" to="/">
            <svg className="w-6 h-6 text-primary-moss stroke-[1.5]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
        <div className="w-full max-w-[440px] bg-surface-paper border border-border-sage-mist rounded-[16px] p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-bg-herb-white border border-border-sage-mist text-primary-moss mb-4">
              <svg className="w-6 h-6 stroke-[1.5]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M21.5 12H16c-.7 2-3 3-4.5 1.5L10 12H2.5"></path>
                <path d="M21.5 2v20"></path>
                <path d="M2.5 2v20"></path>
              </svg>
            </div>
            <h1 className="font-fraunces text-3xl font-medium text-text-charcoal mb-2">
              Verify your email
            </h1>
            <p className="text-text-stem-gray text-sm px-4">
              We've sent a 6-digit code to <strong className="text-text-charcoal font-semibold">{email}</strong>. Please enter it below.
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-xs font-medium text-text-charcoal mb-2 text-center" htmlFor="otp">
                6-Digit Verification Code
              </label>
              <input 
                {...register('otp')}
                className={`w-full h-12 px-4 text-center tracking-[0.5em] text-lg bg-surface-paper border ${errors.otp ? 'border-red-500' : 'border-border-sage-mist'} rounded-[8px] text-text-charcoal placeholder:text-text-stem-gray placeholder:tracking-normal focus:outline-none focus:border-primary-moss transition-colors`} 
                id="otp" 
                placeholder="000000"
                maxLength={6}
                type="text" 
              />
              {errors.otp && (
                <p className="text-red-500 text-xs mt-2 font-medium text-center">{errors.otp.message}</p>
              )}
            </div>
            
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
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-border-sage-mist text-center">
            <p className="text-sm text-text-stem-gray mb-3">
              Didn't receive the code?
            </p>
            {countdown > 0 ? (
              <p className="text-sm font-medium text-text-charcoal">
                Resend available in <span className="text-primary-moss">{formatTime(countdown)}</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-sm font-medium text-primary-moss hover:underline hover:text-primary-moss-hover transition-all disabled:opacity-70"
              >
                {isResending ? 'Resending...' : 'Resend Code Now'}
              </button>
            )}
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

export default VerifyOTP;
