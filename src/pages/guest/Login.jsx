import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import HeaderAuth from '../../components/layout/HeaderAuth';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { motionTokens } from '../../lib/motion';
import loginMorningLight from '../../assets/login-morning-light.jpg';
import loginSceneVeg from '../../assets/login-scene-veg.jpg';
import loginSceneSoup from '../../assets/login-scene-soup.jpg';
import AccountSuspended from '../member/AccountSuspended';

// 1. Define validation schema
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

const backgroundScenes = [
  loginMorningLight,
  loginSceneVeg,
  loginSceneSoup
];

function CinematicBackground() {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgroundScenes.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="absolute inset-0 w-full h-full">
        <img
          src={backgroundScenes[0]}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
        />
      </div>
    );
  }

  return (
    <motion.div className="absolute inset-0 w-full h-full">
      {backgroundScenes.map((scene, i) => (
        <motion.img
          key={scene}
          src={scene}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
          initial={{ opacity: 0 }}
          animate={{
            opacity: i === index ? 0.9 : 0
          }}
          transition={{
            opacity: { duration: 1.5, ease: "easeInOut" }
          }}
          style={{ zIndex: i === index ? 1 : 0 }}
        />
      ))}
    </motion.div>
  );
}

function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [banInfo, setBanInfo] = useState(null);

  // Setup react-hook-form
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Motion setup
  const prefersReducedMotion = useReducedMotion();
  const { duration, distance, scale, easing } = motionTokens;

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await login({ identifier: data.username, password: data.password, rememberMe: data.rememberMe });

      // Trigger success animation
      setIsSuccess(true);
      await new Promise(resolve => setTimeout(resolve, duration.short * 1000));

      // Navigate to the previous page or /home
      const from = location.state?.from?.pathname || '/home';
      navigate(from, { replace: true });
    } catch (err) {
      const status = err.response?.status;
      const errorData = err.response?.data || {};
      const errorText = typeof errorData === 'string'
        ? errorData
        : errorData.error || errorData.message || '';
      const lowerError = errorText.toLowerCase();
      const banReason = errorData.banReason || errorData.reason || null;

      if (status === 403) {
        const isBanned = lowerError.includes('banned') || lowerError.includes('suspended') || Boolean(banReason);
        const isUnverified = (lowerError.includes('verify') || lowerError.includes('verification')) && !isBanned;

        if (isUnverified) {
          toast.error('Please verify your email before logging in.');
          navigate('/verify-otp', {
            state: { requiresEmail: true, email: data.username }
          });
          return;
        }

        // Account is banned or inactive
        setBanInfo({
          isBanned: true,
          reason: banReason,
          rawError: errorText,
        });
        return;
      }

      if (status === 401) {
        setError('username', { type: 'manual', message: 'Incorrect username or password' });
        setError('password', { type: 'manual', message: 'Incorrect username or password' });
        return;
      }

      if (lowerError.includes('not found') || lowerError.includes('user')) {
        setError('username', { type: 'manual', message: 'Username does not exist' });
      } else if (lowerError.includes('password') || lowerError.includes('invalid')) {
        setError('password', { type: 'manual', message: 'Incorrect password' });
      } else {
        // Fallback generic error
        setError('username', { type: 'manual', message: 'Incorrect username or password' });
        setError('password', { type: 'manual', message: 'Incorrect username or password' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : distance.small },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration.medium,
        ease: easing.entrance,
        when: "beforeChildren",
        staggerChildren: prefersReducedMotion ? 0 : 0.04
      }
    },
    exit: {
      opacity: 0,
      scale: prefersReducedMotion ? 1 : scale.press,
      transition: { duration: duration.short, ease: easing.exit }
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: prefersReducedMotion ? 1 : scale.entrance },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: duration.short, ease: easing.entrance }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : distance.micro },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: duration.short, ease: easing.standard }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: duration.short, ease: easing.standard }
    }
  };

  // Error message variants
  const errorVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: { opacity: 1, height: 'auto', marginTop: 4, transition: { duration: duration.micro, ease: easing.standard } },
    exit: { opacity: 0, height: 0, marginTop: 0, transition: { duration: duration.micro, ease: easing.standard } }
  };

  // Common input classes with soft hover and focus rings
  const getInputClasses = (hasError) =>
    `w-full h-10 sm:h-10.5 px-3.5 bg-surface-paper/60 border ${hasError
      ? 'border-red-500 hover:border-red-600 focus:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20'
      : 'border-border-sage-mist/80 hover:border-primary-moss/60 focus:border-primary-moss focus-visible:ring-2 focus-visible:ring-primary-moss/20'
    } rounded-lg text-xs sm:text-[13.5px] text-text-charcoal placeholder:text-text-stem-gray/80 focus:outline-none transition-all duration-200`;

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col relative bg-zinc-900 text-text-charcoal selection:bg-primary-moss/20">
      {/* Cinematic Background Canvas Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <CinematicBackground />

        {/* Cinematic Gradient Overlay for Depth and Contrast */}
        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-black/60 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>

        {/* Editorial Typographic Detail anchored to background */}
        <div className="absolute z-20 bottom-8 lg:bottom-12 left-6 md:left-12 lg:left-16 opacity-80 hidden lg:block pointer-events-none select-none">
          <p className="font-sans text-[11px] tracking-[0.4em] text-white/80 uppercase font-bold mb-2">
            Plant-Based Living
          </p>
          <div className="w-12 h-[1px] bg-white/40 mb-2"></div>
          <p className="font-fraunces text-xl lg:text-2xl text-white/90 font-light tracking-wide italic">
            "Food as medicine, earth as kitchen."
          </p>
        </div>
      </div>

      {/* HeaderAuth */}
      <HeaderAuth />

      {/* Floating Panel Layer */}
      <main className="flex-1 flex flex-col justify-center items-center w-full relative z-10 px-3.5 sm:px-6 lg:items-end lg:pr-[7%] xl:pr-[10%] 2xl:pr-[12%] py-2 sm:py-3">
        {/* Floating Editorial Login Panel */}
        <motion.div
          className="w-full max-w-[390px] sm:max-w-[410px] lg:max-w-[420px] bg-surface-paper/95 backdrop-blur-xl rounded-[24px] sm:rounded-[28px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] border border-white/40 p-5 sm:p-6 lg:p-6.5 text-text-charcoal my-auto"
          initial="hidden"
          animate={isSuccess ? "exit" : "visible"}
          variants={cardVariants}
        >
          {banInfo ? (
            <AccountSuspended
              reason={banInfo.reason}
              isInline={true}
              onBackToLogin={() => setBanInfo(null)}
            />
          ) : (
            <>
              <div className="mb-3.5 sm:mb-4">
                <motion.div variants={logoVariants} className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-moss/10 text-primary-moss mb-2 sm:mb-2.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </motion.div>
                <motion.h1 variants={itemVariants} className="font-fraunces text-2xl sm:text-3xl leading-tight font-medium text-text-charcoal mb-1 tracking-tight">
                  Welcome back
                </motion.h1>
                <motion.p variants={itemVariants} className="text-text-stem-gray text-xs sm:text-[13px] tracking-wide">
                  Please enter your details to access your kitchen
                </motion.p>
              </div>

              <form className="space-y-2.5 sm:space-y-3" onSubmit={handleSubmit(onSubmit)}>
                <motion.div variants={itemVariants}>
                  <label className="block text-[11px] sm:text-[11.5px] font-semibold text-text-charcoal mb-1 uppercase tracking-wider" htmlFor="username">
                    Username or email
                  </label>
                  <input
                    {...register('username')}
                    className={getInputClasses(!!errors.username)}
                    id="username"
                    placeholder="Enter your username or email"
                    type="text"
                    autoComplete="username"
                    disabled={isSuccess || isSubmitting}
                  />
                  <AnimatePresence>
                    {errors.username && (
                      <motion.p
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        role="alert"
                        className="text-red-500 text-[11px] font-medium leading-tight overflow-hidden"
                      >
                        {errors.username.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] sm:text-[11.5px] font-semibold text-text-charcoal uppercase tracking-wider" htmlFor="password">
                      Password
                    </label>
                    <Link className="text-[11.5px] text-text-stem-gray hover:text-primary-moss transition-colors font-medium focus-ring-vh rounded active:opacity-80" to="/forgot-password">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      {...register('password')}
                      className={`${getInputClasses(!!errors.password)} auth-password-input pr-10`}
                      id="password"
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      disabled={isSuccess || isSubmitting}
                    />
                    <button
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      aria-controls="password"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-stem-gray hover:text-primary-moss transition-colors duration-200 p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-moss focus-visible:rounded active:scale-95 motion-reduce:transform-none"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSuccess || isSubmitting}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {showPassword ? (
                          <motion.svg
                            key="hide"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24"
                          >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                            <line x1="2" y1="2" x2="22" y2="22"></line>
                          </motion.svg>
                        ) : (
                          <motion.svg
                            key="show"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24"
                          >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </motion.svg>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        role="alert"
                        className="text-red-500 text-[11px] font-medium leading-tight overflow-hidden"
                      >
                        {errors.password.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center gap-2 pt-0.5 pb-0.5">
                  <input
                    {...register('rememberMe')}
                    className="w-4 h-4 rounded border-border-sage-mist hover:border-primary-moss/50 text-primary-moss focus:ring-2 focus:ring-primary-moss/20 transition-all duration-200 cursor-pointer accent-[#2F5233]"
                    id="remember"
                    type="checkbox"
                    disabled={isSuccess || isSubmitting}
                  />
                  <label className="text-xs sm:text-[13px] text-text-stem-gray select-none cursor-pointer hover:text-text-charcoal transition-colors duration-200" htmlFor="remember">
                    Remember me on this device
                  </label>
                </motion.div>

                <motion.div variants={buttonVariants} className="pt-1">
                  <motion.button
                    whileTap={isSubmitting || isSuccess || prefersReducedMotion ? {} : { scale: scale.press }}
                    disabled={isSubmitting || isSuccess}
                    className="w-full h-11 min-h-[44px] bg-primary-moss hover:bg-primary-moss-hover hover:shadow-sm disabled:opacity-70 disabled:hover:shadow-none text-white text-[14px] font-medium rounded-lg transition-all duration-200 flex items-center justify-center relative overflow-hidden focus-ring-vh active:scale-[0.98] motion-reduce:transform-none cursor-pointer"
                    type="submit"
                  >
                    <AnimatePresence mode="wait">
                      {isSuccess ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -5 }}
                          transition={{ duration: duration.micro }}
                          className="flex items-center gap-2"
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Success
                        </motion.div>
                      ) : isSubmitting ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -5 }}
                          transition={{ duration: duration.micro }}
                          className="flex items-center gap-2"
                        >
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Logging in...
                        </motion.div>
                      ) : (
                        <motion.span
                          key="text"
                          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -5 }}
                          transition={{ duration: duration.micro }}
                        >
                          Log In
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>

                <motion.div variants={itemVariants} className="relative flex items-center justify-center my-2.5 sm:my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-sage-mist"></div>
                  </div>
                  <span className="relative bg-surface-paper px-3 text-[11.5px] sm:text-xs text-text-stem-gray font-medium tracking-wide">
                    OR
                  </span>
                </motion.div>

                <motion.div variants={itemVariants} className="flex justify-center w-full min-h-[40px]">
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      try {
                        setIsSubmitting(true);
                        await loginWithGoogle(credentialResponse.credential);

                        // Trigger success animation for Google Login too
                        setIsSuccess(true);
                        await new Promise(resolve => setTimeout(resolve, duration.short * 1000));

                        const from = location.state?.from?.pathname || '/home';
                        navigate(from, { replace: true });
                      } catch (err) {
                        const status = err.response?.status;
                        const errorData = err.response?.data || {};
                        const errorText = typeof errorData === 'string' ? errorData : errorData.error || errorData.message || '';
                        const lowerError = errorText.toLowerCase();
                        const banReason = errorData.banReason || errorData.reason || null;

                        if (status === 403 && (lowerError.includes('banned') || lowerError.includes('suspended') || Boolean(banReason) || lowerError.includes('inactive'))) {
                          setBanInfo({
                            isBanned: true,
                            reason: banReason,
                            rawError: errorText,
                          });
                        } else if (status === 409) {
                          toast.error('This email is already registered. Please log in with email/password to link Google.');
                        } else {
                          toast.error(errorText || 'Google login failed. Please try again.');
                        }
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
                    width="100%"
                  />
                </motion.div>
              </form>

              <motion.div variants={itemVariants} className="mt-3.5 sm:mt-4 pt-2.5 sm:pt-3 border-t border-border-sage-mist/50 text-center">
                <p className="text-xs sm:text-[13px] text-text-stem-gray">
                  Don't have an account?
                  <Link className="font-semibold text-text-charcoal hover:text-primary-moss transition-colors duration-200 ml-1.5 focus-ring-vh rounded active:opacity-80" to="/sign-up">
                    Sign up now
                  </Link>
                </p>
              </motion.div>
            </>
          )}
        </motion.div>
      </main>

      {/* Footer - Visible on all screens */}
      <footer className="w-full py-2 sm:py-2.5 text-center text-[11px] sm:text-xs text-text-stem-gray lg:text-white/70 bg-black/20 lg:bg-transparent backdrop-blur-xs lg:backdrop-blur-none shrink-0 relative z-10">
        <div className="w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-3">
          <span>© 2025 Vegan Helper. Plant-based culinary & family nutrition platform.</span>
          <div className="flex items-center gap-4">
            <Link className="hover:text-primary-moss lg:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-moss lg:focus-visible:ring-white rounded px-1 active:opacity-80" to="#">Terms of Service</Link>
            <Link className="hover:text-primary-moss lg:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-moss lg:focus-visible:ring-white rounded px-1 active:opacity-80" to="#">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Login;
