import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import HeaderAuth from '../../components/layout/HeaderAuth';

const otpSchema = z.object({
  otp: z.string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = location.state?.email || '';
  const requiresEmail = Boolean(location.state?.requiresEmail) || !initialEmail;

  const [email, setEmail] = useState(initialEmail);
  const [codeSent, setCodeSent] = useState(Boolean(initialEmail) && !location.state?.requiresEmail);
  const [countdown, setCountdown] = useState(initialEmail && !location.state?.requiresEmail ? 120 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(otpSchema) });

  useEffect(() => {
    if (countdown <= 0) return undefined;
    const timer = setInterval(() => setCountdown((value) => value - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const errorMessage = (error, fallback) =>
    error.response?.data?.message ||
    error.response?.data?.error ||
    fallback;

  const sendCode = async (event) => {
    event?.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      toast.error('Enter a valid email address.');
      return;
    }

    setIsSending(true);
    try {
      await authService.resendVerification({ email: normalizedEmail });
      setEmail(normalizedEmail);
      setCodeSent(true);
      setCountdown(120);
      toast.success('A verification code has been sent to your email.');
    } catch (error) {
      toast.error(errorMessage(error, 'Failed to send verification code. Try again later.'));
    } finally {
      setIsSending(false);
    }
  };

  const onSubmit = async (data) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !codeSent) {
      toast.error('Request a verification code first.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.verifyEmail({ email: normalizedEmail, otp: data.otp });
      toast.success('Email verified successfully. Please log in.');
      navigate('/login', {
        replace: true,
        state: { email: normalizedEmail, message: 'Email verified. Log in to continue.' },
      });
    } catch (error) {
      setError('otp', {
        type: 'manual',
        message: errorMessage(error, 'Invalid or expired OTP.'),
      });
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
              {codeSent
                ? <>Enter the 6-digit code sent to <strong className="text-text-charcoal font-semibold">{email}</strong>.</>
                : 'Enter your registered email to receive a verification code.'}
            </p>
          </div>

          {(!codeSent || requiresEmail) && (
            <form className="space-y-4 mb-6" onSubmit={sendCode}>
              <div>
                <label className="block text-xs font-medium text-text-charcoal mb-2" htmlFor="verification-email">
                  Registered email
                </label>
                <input
                  id="verification-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="email@example.com"
                  className="w-full h-11 px-3.5 bg-surface-paper border border-border-sage-mist rounded-[8px] text-sm text-text-charcoal placeholder:text-text-stem-gray focus:outline-none focus:border-primary-moss transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSending || countdown > 0}
                className="w-full h-11 bg-primary-moss hover:bg-primary-moss-hover disabled:opacity-70 text-white text-sm font-medium rounded-[8px] transition-colors"
              >
                {isSending ? 'Sending...' : countdown > 0 ? `Code sent (${formatTime(countdown)})` : 'Send verification code'}
              </button>
            </form>
          )}

          {codeSent && (
            <>
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
                    inputMode="numeric"
                    autoComplete="one-time-code"
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
                  {isSubmitting ? 'Verifying...' : 'Verify Code'}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-border-sage-mist text-center">
                <p className="text-sm text-text-stem-gray mb-3">Didn't receive the code?</p>
                {countdown > 0 ? (
                  <p className="text-sm font-medium text-text-charcoal">
                    Resend available in <span className="text-primary-moss">{formatTime(countdown)}</span>
                  </p>
                ) : (
                  <button
                    onClick={sendCode}
                    disabled={isSending}
                    className="text-sm font-medium text-primary-moss hover:underline hover:text-primary-moss-hover transition-all disabled:opacity-70"
                  >
                    {isSending ? 'Resending...' : 'Resend Code Now'}
                  </button>
                )}
              </div>
            </>
          )}

          <p className="text-center mt-8 text-sm text-text-stem-gray">
            Already verified? <Link className="text-primary-moss hover:underline" to="/login">Log in</Link>
          </p>
        </div>
      </main>
      <footer className="w-full py-6 text-center text-xs text-text-stem-gray border-t border-border-sage-mist">
        <div className="max-w-[1120px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2025 Vegan Helper. Plant-based culinary & family nutrition platform.</span>
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

