import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { mobileDrawerVariants, reducedMotionVariants } from '../ui/dropdownMotion';

export default function HeaderGuest() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        mobileMenuRef.current?.querySelector('button')?.focus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    {
      to: '/',
      end: true,
      label: 'Home',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      to: '/weekly-menu/locked',
      label: 'Weekly Menu',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      to: '/vegan-stores/locked',
      label: 'Find Vegan Stores',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      to: '/my-posts/locked',
      label: 'My Posts',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
    },
  ];

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#FDFBF6] border-b border-[#DCE3D5] flex items-center justify-between px-6 md:px-10 relative">
      <div className="flex items-center gap-2.5">
        <Link className="flex items-center gap-2.5 text-[#2F5233] hover:opacity-95 transition-opacity shrink-0" to="/">
          <img src="/logo.png" alt="Vegan Helper Logo" className="h-[46px] md:h-[54px] w-auto object-contain scale-[1.35] origin-left" />
        </Link>
      </div>

      {/* Primary Navigation with Icons & Tooltips (Desktop) */}
      <nav aria-label="Primary Navigation" className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center gap-3 h-full">
        {navItems.map((item) => (
          <div key={item.to} className="relative group flex items-center justify-center">
            <NavLink
              to={item.to}
              end={item.end}
              aria-label={item.label}
              className={({ isActive }) =>
                `relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 active:scale-95 motion-reduce:transform-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] ${isActive
                  ? 'bg-[#2F5233] text-white shadow-xs'
                  : 'text-[#555A4E] hover:text-[#2F5233] hover:bg-[#EBF2E8]/80'
                }`
              }
            >
              {item.icon}
            </NavLink>
            {/* Accessible tooltip on mouse hover and keyboard focus */}
            <div
              role="tooltip"
              className="pointer-events-none absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#1F3323] text-white text-[12px] font-dm-sans rounded-md whitespace-nowrap shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50 select-none after:content-[''] after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-b-[#1F3323]"
            >
              {item.label}
            </div>
          </div>
        ))}
      </nav>

      {/* Guest Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0" ref={mobileMenuRef}>
        {/* Mobile Menu Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          className="md:hidden w-9 h-9 rounded-lg border border-[#DCE3D5] flex items-center justify-center text-[#2F5233] hover:bg-[#F3F6EE] active:scale-95 motion-reduce:transform-none transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden absolute top-full left-0 right-0 bg-[#FDFBF6] border-b border-[#DCE3D5] shadow-lg p-3 space-y-1.5 z-40 text-left origin-top"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={shouldReduceMotion ? reducedMotionVariants : mobileDrawerVariants}
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-dm-sans transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-[0.98] motion-reduce:transform-none ${isActive
                      ? 'bg-[#2F5233] text-white font-medium shadow-xs'
                      : 'text-[#2B2A25] hover:text-[#2F5233] hover:bg-[#F3F6EE]'
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <Link className="h-9 sm:h-10 px-3 sm:px-4 flex items-center justify-center rounded-lg border-[1.5px] border-[#2F5233] text-[#2F5233] text-[13px] sm:text-[14px] font-medium hover:bg-[#F3F6EE] hover:-translate-y-0.5 hover:shadow-sm active:scale-95 motion-reduce:transform-none transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233]" to="/login">
          Log In
        </Link>
        <Link className="h-9 sm:h-10 px-3 sm:px-4 flex items-center justify-center rounded-lg bg-[#2F5233] text-white text-[13px] sm:text-[14px] font-medium hover:bg-[#25401F] hover:-translate-y-0.5 hover:shadow-md active:scale-95 motion-reduce:transform-none transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-1" to="/register">
          Sign Up
        </Link>
      </div>
    </header>
  );
}
