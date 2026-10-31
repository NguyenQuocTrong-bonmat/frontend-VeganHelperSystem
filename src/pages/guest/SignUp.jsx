import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../../services/authService';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import HeaderAuth from '../../components/layout/HeaderAuth';
import UnverifiedEmailModal from '../../components/auth/UnverifiedEmailModal';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { motionTokens } from '../../lib/motion';
import loginMorningLight from '../../assets/login-morning-light.jpg';
import loginSceneVeg from '../../assets/login-scene-veg.jpg';
import loginSceneSoup from '../../assets/login-scene-soup.jpg';

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

function SignUp() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [unverifiedModal, setUnverifiedModal] = useState({
    isOpen: false,
    email: '',
    isExisting: false,
  });

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

  // Motion setup
  const prefersReducedMotion = useReducedMotion();
  const { duration, distance, scale, easing } = motionTokens;

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

      const response = await authService.register(payload);

      const isExistingUnverified = Boolean(response?.isExistingUnverified) ||
        (typeof response?.message === 'string' && (
          response.message.toLowerCase().includes('already been registered') ||
          response.message.toLowerCase().includes('already registered') ||
          response.message.toLowerCase().includes('not yet verified') ||
          response.message.toLowerCase().includes('not verified')
        ));

      setUnverifiedModal({
        isOpen: true,
        email: data.email,
        isExisting: isExistingUnverified,
      });
    } catch (err) {
      const errorData = err.response?.data || {};
      const errorMsg = (typeof errorData === 'string' ? errorData : errorData.error || errorData.message || '').toLowerCase();

      // If backend explicitly rejected due to unverified existing account
      if (errorMsg.includes('not verified') || errorMsg.includes('not yet verified') || errorData.isExistingUnverified) {
        setUnverifiedModal({
          isOpen: true,
          email: data.email,
          isExisting: true,
        });
        return;
      }

      if (errorMsg.includes('email') && (errorMsg.includes('exist') || errorMsg.includes('already') || errorMsg.includes('registered'))) {
        setError('email', { type: 'manual', message: 'Email is already in use' });
      } else if (errorMsg.includes('username') && (errorMsg.includes('exist') || errorMsg.includes('already') || errorMsg.includes('registered'))) {
        setError('username', { type: 'manual', message: 'Username is already taken' });
      } else {
        toast.error(err.response?.data?.error || err.response?.data?.message || 'Registration failed. Please try again.');
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
        staggerChildren: prefersReducedMotion ? 0 : 0.03
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

  const errorVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: { opacity: 1, height: 'auto', marginTop: 3, transition: { duration: duration.micro, ease: easing.standard } },
    exit: { opacity: 0, height: 0, marginTop: 0, transition: { duration: duration.micro, ease: easing.standard } }
  };

  const getInputClasses = (hasError) =>
    `w-full h-9.5 sm:h-10 px-3 bg-surface-paper/60 border ${hasError
      ? 'border-red-500 hover:border-red-600 focus:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20'
      : 'border-border-sage-mist/80 hover:border-primary-moss/60 focus:border-primary-moss focus-visible:ring-2 focus-visible:ring-primary-moss/20'
    } rounded-lg text-xs sm:text-[13px] text-text-charcoal placeholder:text-text-stem-gray/80 focus:outline-none transition-all duration-200`;

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col relative bg-zinc-900 text-text-charcoal selection:bg-primary-moss/20">
      {/* Background layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <CinematicBackground />
        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-black/60 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
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

      {/* Main floating container */}
      <main className="flex-1 flex flex-col justify-center items-center w-full relative z-10 px-3.5 sm:px-6 lg:items-end lg:pr-[7%] xl:pr-[10%] 2xl:pr-[12%] py-2 sm:py-3">
        <motion.div
          className="w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[500px] bg-surface-paper/95 backdrop-blur-xl rounded-[24px] sm:rounded-[28px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] border border-white/40 p-4.5 sm:p-5.5 lg:p-6 text-text-charcoal my-auto"
          initial="hidden"
          animate={isSuccess ? "exit" : "visible"}
          variants={cardVariants}
        >
          {/* Card Header */}
          <div className="mb-2.5 sm:mb-3">
            <motion.div variants={logoVariants} className="inline-flex items-center justify-center w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-full bg-primary-moss/10 text-primary-moss mb-1.5 sm:mb-2">
              <svg className="w-4.5 h-4.5 stroke-[1.5]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <line x1="19" x2="19" y1="8" y2="14"></line>
                <line x1="22" x2="16" y1="11" y2="11"></line>
              </svg>
            </motion.div>
            <motion.h1 variants={itemVariants} className="font-fraunces text-2xl sm:text-[28px] leading-tight font-medium text-text-charcoal mb-0.5 sm:mb-1 tracking-tight">
              Join Us
            </motion.h1>
            <motion.p variants={itemVariants} className="text-text-stem-gray text-xs sm:text-[13px] tracking-wide">
              Create an account to join the Vegan Helper community
            </motion.p>
          </div>

          {/* Form */}
          <form className="space-y-2 sm:space-y-2.5" onSubmit={handleSubmit(onSubmit)}>
            {/* 2-Column Row: Full Name & Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <motion.div variants={itemVariants}>
                <label className="block text-[10.5px] sm:text-[11px] font-semibold text-text-charcoal mb-0.5 uppercase tracking-wider" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  {...register('fullName')}
                  className={getInputClasses(!!errors.fullName)}
                  id="fullName"
                  placeholder="John Doe"
                  type="text"
                  autoComplete="name"
                  disabled={isSuccess || isSubmitting}
                />
                <AnimatePresence>
                  {errors.fullName && (
                    <motion.p
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      role="alert"
                      className="text-red-500 text-[10.5px] font-medium leading-tight overflow-hidden"
                    >
                      {errors.fullName.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-[10.5px] sm:text-[11px] font-semibold text-text-charcoal mb-0.5 uppercase tracking-wider" htmlFor="username">
                  Username
                </label>
                <input
                  {...register('username')}
                  className={getInputClasses(!!errors.username)}
                  id="username"
                  placeholder="johndoe"
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
                      className="text-red-500 text-[10.5px] font-medium leading-tight overflow-hidden"
                    >
                      {errors.username.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Email Address */}
            <motion.div variants={itemVariants}>
              <label className="block text-[10.5px] sm:text-[11px] font-semibold text-text-charcoal mb-0.5 uppercase tracking-wider" htmlFor="email">
                Email address
              </label>
              <input
                {...register('email')}
                className={getInputClasses(!!errors.email)}
                id="email"
                placeholder="email@example.com"
                type="email"
                autoComplete="email"
                disabled={isSuccess || isSubmitting}
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    role="alert"
                    className="text-red-500 text-[10.5px] font-medium leading-tight overflow-hidden"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* 2-Column Row: Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <motion.div variants={itemVariants}>
                <label className="block text-[10.5px] sm:text-[11px] font-semibold text-text-charcoal mb-0.5 uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password')}
                    className={`${getInputClasses(!!errors.password)} auth-password-input pr-9`}
                    id="password"
                    placeholder="min 8 chars"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    disabled={isSuccess || isSubmitting}
                  />
                  <button
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    aria-controls="password"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-text-stem-gray hover:text-primary-moss transition-colors duration-200 p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-moss focus-visible:rounded active:scale-95 motion-reduce:transform-none"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSuccess || isSubmitting}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {showPassword ? (
                        <motion.svg key="hide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><line x1="2" y1="2" x2="22" y2="22"></line></motion.svg>
                      ) : (
                        <motion.svg key="show" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></motion.svg>
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
                      className="text-red-500 text-[10.5px] font-medium leading-tight overflow-hidden"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-[10.5px] sm:text-[11px] font-semibold text-text-charcoal mb-0.5 uppercase tracking-wider" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    {...register('confirmPassword')}
                    className={`${getInputClasses(!!errors.confirmPassword)} auth-password-input pr-9`}
                    id="confirmPassword"
                    placeholder="Re-enter password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    disabled={isSuccess || isSubmitting}
                  />
                  <button
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    aria-pressed={showConfirmPassword}
                    aria-controls="confirmPassword"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-text-stem-gray hover:text-primary-moss transition-colors duration-200 p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-moss focus-visible:rounded active:scale-95 motion-reduce:transform-none"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSuccess || isSubmitting}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {showConfirmPassword ? (
                        <motion.svg key="hide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><line x1="2" y1="2" x2="22" y2="22"></line></motion.svg>
                      ) : (
                        <motion.svg key="show" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></motion.svg>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
                <AnimatePresence>
                  {errors.confirmPassword && (
                    <motion.p
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      role="alert"
                      className="text-red-500 text-[10.5px] font-medium leading-tight overflow-hidden"
                    >
                      {errors.confirmPassword.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Terms and conditions checkbox */}
            <motion.div variants={itemVariants} className="pt-0.5">
              <div className="flex items-center gap-2">
                <input
                  {...register('terms')}
                  className="w-3.5 h-3.5 rounded border-border-sage-mist hover:border-primary-moss/50 text-primary-moss focus:ring-2 focus:ring-primary-moss/20 transition-all duration-200 cursor-pointer accent-[#2F5233]"
                  id="terms"
                  type="checkbox"
                  disabled={isSuccess || isSubmitting}
                />
                <label className="text-[11.5px] sm:text-xs text-text-stem-gray select-none cursor-pointer hover:text-text-charcoal transition-colors duration-200" htmlFor="terms">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>
              <AnimatePresence>
                {errors.terms && (
                  <motion.p
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    role="alert"
                    className="text-red-500 text-[10.5px] font-medium leading-tight pl-5.5 overflow-hidden"
                  >
                    {errors.terms.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit button */}
            <motion.div variants={buttonVariants} className="pt-1">
              <motion.button
                whileTap={isSubmitting || isSuccess || prefersReducedMotion ? {} : { scale: scale.press }}
                disabled={isSubmitting || isSuccess}
                className="w-full h-11 min-h-[44px] bg-primary-moss hover:bg-primary-moss-hover hover:shadow-sm disabled:opacity-70 disabled:hover:shadow-none text-white text-[13.5px] sm:text-[14px] font-medium rounded-lg transition-all duration-200 flex items-center justify-center relative overflow-hidden focus-ring-vh active:scale-[0.98] motion-reduce:transform-none cursor-pointer"
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
                      <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing up...
                    </motion.div>
                  ) : (
                    <motion.span
                      key="text"
                      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -5 }}
                      transition={{ duration: duration.micro }}
                    >
                      Sign Up
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>

            {/* OR divider */}
            <motion.div variants={itemVariants} className="relative flex items-center justify-center my-1.5 sm:my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-sage-mist"></div>
              </div>
              <span className="relative bg-surface-paper px-3 text-[11px] sm:text-[11.5px] text-text-stem-gray font-medium tracking-wide">
                OR
              </span>
            </motion.div>

            {/* GoogleLogin */}
            <motion.div variants={itemVariants} className="flex justify-center w-full min-h-[38px]">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    setIsSubmitting(true);
                    await loginWithGoogle(credentialResponse.credential);
                    setIsSuccess(true);
                    await new Promise(resolve => setTimeout(resolve, duration.short * 1000));
                    navigate('/home');
                  } catch (err) {
                    toast.error('Google login failed. Please try again.');
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
                width="100%"
              />
            </motion.div>
          </form>

          {/* Footer link inside card */}
          <motion.div variants={itemVariants} className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-border-sage-mist/50 text-center">
            <p className="text-xs sm:text-[13px] text-text-stem-gray">
              Already have an account?
              <Link className="font-semibold text-text-charcoal hover:text-primary-moss transition-colors duration-200 ml-1.5 focus-ring-vh rounded active:opacity-80" to="/login">
                Log in now
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-2 sm:py-2.5 text-center text-[11px] sm:text-xs text-text-stem-gray lg:text-white/70 bg-black/20 lg:bg-transparent backdrop-blur-xs lg:backdrop-blur-none shrink-0 relative z-10">
        <div className="w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-3">
          <span>© 2025 Vegan Helper. Plant-based culinary & family nutrition platform.</span>
          <div className="flex items-center gap-4">
            <Link className="hover:text-primary-moss lg:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-moss lg:focus-visible:ring-white rounded px-1 active:opacity-80" to="#">Terms of Service</Link>
            <Link className="hover:text-primary-moss lg:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-moss lg:focus-visible:ring-white rounded px-1 active:opacity-80" to="#">Privacy Policy</Link>
          </div>
        </div>
      </footer>

      {/* Unverified Email Popup */}
      <UnverifiedEmailModal
        isOpen={unverifiedModal.isOpen}
        onClose={() => setUnverifiedModal((prev) => ({ ...prev, isOpen: false }))}
        email={unverifiedModal.email}
        isExisting={unverifiedModal.isExisting}
      />
    </div>
  );
}

export default SignUp;
