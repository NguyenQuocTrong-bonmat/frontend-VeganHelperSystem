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
    <motion.div
      className="absolute inset-0 w-full h-full"
    >
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

      await authService.register(payload);

      setIsSuccess(true);
      await new Promise(resolve => setTimeout(resolve, duration.short * 1000));

      toast.success('Registration successful! Please verify your email.');
      navigate('/verify-otp', {
        state: {
          email: data.email
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

  const cardVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : distance.small },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration.medium,
        ease: easing.entrance,
        when: "beforeChildren",
        staggerChildren: prefersReducedMotion ? 0 : 0.05
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
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : -distance.micro },
    visible: { opacity: 1, y: 0, transition: { duration: duration.micro, ease: easing.standard } },
    exit: { opacity: 0, y: prefersReducedMotion ? 0 : -distance.micro, transition: { duration: duration.micro, ease: easing.standard } }
  };

  const getInputClasses = (hasError) =>
    `w-full h-12 px-4 bg-transparent border ${hasError
      ? 'border-red-500 hover:border-red-600 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
      : 'border-border-sage-mist/70 hover:border-primary-moss/60 focus:border-primary-moss focus:ring-4 focus:ring-primary-moss/10'
    } rounded-lg text-[15px] text-text-charcoal placeholder:text-text-stem-gray focus:outline-none transition-all duration-300`;

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-zinc-900">
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <CinematicBackground />
        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-black/50 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/10 via-transparent to-black/30"></div>
        <div className="absolute z-20 bottom-20 lg:bottom-24 left-6 md:left-12 lg:left-16 opacity-80">
          <p className="font-sans text-[11px] tracking-[0.4em] text-white/80 uppercase font-bold mb-2">
            Plant-Based Living
          </p>
          <div className="w-12 h-[1px] bg-white/40 mb-2"></div>
          <p className="font-fraunces text-2xl text-white/90 font-light tracking-wide italic">
            "Food as medicine, earth as kitchen."
          </p>
        </div>
      </div>

      <div className="w-full z-20 relative bg-surface-paper/90 backdrop-blur-md lg:bg-gradient-to-b lg:from-black/40 lg:to-transparent lg:backdrop-blur-none border-b border-border-sage-mist/20 lg:border-none">
        <HeaderAuth />
      </div>

      <main className="flex-1 flex w-full relative z-10 overflow-y-auto">
        <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-10 lg:items-end lg:pr-[8%] xl:pr-[12%]">
          <motion.div
            className="w-full max-w-[480px] lg:max-w-[520px] bg-surface-paper/95 backdrop-blur-xl rounded-[32px] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.3)] border border-white/20 p-8 md:p-10 my-4"
            initial="hidden"
            animate={isSuccess ? "exit" : "visible"}
            variants={cardVariants}
          >
            <div className="mb-8 mt-2">
              <motion.div variants={logoVariants} className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-moss/10 text-primary-moss mb-5">
                <svg className="w-6 h-6 stroke-[1.5]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <line x1="19" x2="19" y1="8" y2="14"></line>
                  <line x1="22" x2="16" y1="11" y2="11"></line>
                </svg>
              </motion.div>
              <motion.h1 variants={itemVariants} className="font-sans text-3xl lg:text-[34px] leading-tight font-bold text-text-charcoal mb-2 tracking-tight">
                Join Us
              </motion.h1>
              <motion.p variants={itemVariants} className="text-text-stem-gray text-[14px] tracking-wide">
                Create an account to join the Vegan Helper community
              </motion.p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div variants={itemVariants} className="relative pb-5">
                  <label className="block text-[12px] font-semibold text-text-charcoal mb-2 uppercase tracking-wider" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    {...register('fullName')}
                    className={getInputClasses(!!errors.fullName)}
                    id="fullName"
                    placeholder="John Doe"
                    type="text"
                    disabled={isSuccess || isSubmitting}
                  />
                  <AnimatePresence>
                    {errors.fullName && (
                      <motion.p
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute bottom-0 left-0 text-red-500 text-[11px] font-medium"
                      >
                        {errors.fullName.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants} className="relative pb-5">
                  <label className="block text-[12px] font-semibold text-text-charcoal mb-2 uppercase tracking-wider" htmlFor="username">
                    Username
                  </label>
                  <input
                    {...register('username')}
                    className={getInputClasses(!!errors.username)}
                    id="username"
                    placeholder="johndoe"
                    type="text"
                    disabled={isSuccess || isSubmitting}
                  />
                  <AnimatePresence>
                    {errors.username && (
                      <motion.p
                        variants={errorVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute bottom-0 left-0 text-red-500 text-[11px] font-medium"
                      >
                        {errors.username.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="relative pb-5">
                <label className="block text-[12px] font-semibold text-text-charcoal mb-2 uppercase tracking-wider" htmlFor="email">
                  Email address
                </label>
                <input
                  {...register('email')}
                  className={getInputClasses(!!errors.email)}
                  id="email"
                  placeholder="email@example.com"
                  type="text"
                  disabled={isSuccess || isSubmitting}
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute bottom-0 left-0 text-red-500 text-[11px] font-medium"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <div className="space-y-1">
                <motion.div variants={itemVariants} className="relative pb-5">
                  <label className="block text-[12px] font-semibold text-text-charcoal mb-2 uppercase tracking-wider" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      className={`${getInputClasses(!!errors.password)} auth-password-input pr-11`}
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
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-text-stem-gray hover:text-primary-moss transition-colors duration-200 p-1"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSuccess || isSubmitting}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {showPassword ? (
                          <motion.svg key="hide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><line x1="2" y1="2" x2="22" y2="22"></line></motion.svg>
                        ) : (
                          <motion.svg key="show" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></motion.svg>
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
                        className="absolute bottom-0 left-0 text-red-500 text-[11px] font-medium leading-tight"
                      >
                        {errors.password.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants} className="relative pb-5">
                  <label className="block text-[12px] font-semibold text-text-charcoal mb-2 uppercase tracking-wider" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      {...register('confirmPassword')}
                      className={`${getInputClasses(!!errors.confirmPassword)} auth-password-input pr-11`}
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
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-text-stem-gray hover:text-primary-moss transition-colors duration-200 p-1"
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isSuccess || isSubmitting}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {showConfirmPassword ? (
                          <motion.svg key="hide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><line x1="2" y1="2" x2="22" y2="22"></line></motion.svg>
                        ) : (
                          <motion.svg key="show" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></motion.svg>
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
                        className="absolute bottom-0 left-0 text-red-500 text-[11px] font-medium leading-tight"
                      >
                        {errors.confirmPassword.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="relative pb-2">
                <div className="flex items-center gap-2 pt-1">
                  <input
                    {...register('terms')}
                    className="w-4 h-4 rounded border-border-sage-mist hover:border-primary-moss/50 text-primary-moss focus:ring-2 focus:ring-primary-moss/20 transition-all duration-200 cursor-pointer accent-[#2F5233]"
                    id="terms"
                    type="checkbox"
                    disabled={isSuccess || isSubmitting}
                  />
                  <label className="text-[13.5px] text-text-stem-gray select-none cursor-pointer hover:text-text-charcoal transition-colors duration-200" htmlFor="terms">
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
                      className="absolute bottom-[-10px] left-0 text-red-500 text-[11px] font-medium"
                    >
                      {errors.terms.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div variants={buttonVariants} className="pt-2">
                <motion.button
                  whileTap={isSubmitting || isSuccess || prefersReducedMotion ? {} : { scale: scale.press }}
                  disabled={isSubmitting || isSuccess}
                  className="w-full h-12 bg-primary-moss hover:bg-primary-moss-hover hover:shadow-md disabled:opacity-70 disabled:hover:shadow-none text-white text-[14.5px] font-medium rounded-lg transition-all duration-300 flex items-center justify-center relative overflow-hidden"
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
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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

              <motion.div variants={itemVariants} className="relative flex items-center justify-center my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-sage-mist"></div>
                </div>
                <span className="relative bg-surface-paper px-4 text-[13px] text-text-stem-gray font-medium tracking-wide">
                  OR
                </span>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-center w-full">
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

            <motion.div variants={itemVariants} className="mt-5 lg:mt-6 pt-5 border-t border-border-sage-mist/50 text-center">
              <p className="text-[14.5px] text-text-stem-gray">
                Already have an account?
                <Link className="font-semibold text-text-charcoal hover:text-primary-moss transition-colors duration-200 ml-1.5" to="/login">
                  Log in now
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <footer className="w-full py-4 text-center text-xs text-text-stem-gray lg:text-white/60 bg-transparent relative z-10">
        <div className="w-full mx-auto px-6 md:px-12 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2025 Vegan Helper. Plant-based culinary & family nutrition platform.</span>
          <div className="flex items-center gap-4">
            <Link className="hover:text-primary-moss lg:hover:text-white transition-colors" to="#">Terms of Service</Link>
            <Link className="hover:text-primary-moss lg:hover:text-white transition-colors" to="#">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SignUp;
