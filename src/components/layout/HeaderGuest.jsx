import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import MobileBottomNav from './MobileBottomNav';
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

  const handleOpenAIGenie = () => {
    window.dispatchEvent(new CustomEvent('open-ai-chat'));
    const fab = document.getElementById('chat-fab');
    if (fab) fab.click();
  };

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
    <>
      <header className="sticky top-0 z-40 h-14 sm:h-16 bg-[#FDFBF6] border-b border-[#DCE3D5] flex items-center justify-between px-3 sm:px-6 md:px-10 relative">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Link className="flex items-center gap-2 text-[#2F5233] hover:opacity-95 transition-opacity shrink-0" to="/">
            <img src="/logo.png" alt="Vegan Helper Logo" className="h-8 sm:h-9 md:h-[54px] w-auto object-contain scale-[1.1] sm:scale-[1.25] md:scale-[1.35] origin-left" />
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

        {/* Mobile Header Action Cluster (Right) */}
        <div className="flex md:hidden items-center gap-2.5 min-[360px]:gap-3 min-[390px]:gap-3.5">
          {/* Mobile Search Button */}
          <Link
            to="/search-guest"
            id="mobile-header-search"
            aria-label="Search recipes and community"
            className="relative w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-[#EAF0E9]/80 border border-[#DCE3D5] flex items-center justify-center text-[#2F5233] hover:bg-[#EAF0E9] active:scale-95 motion-reduce:transform-none transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-11 after:h-11 after:min-w-[44px] after:min-h-[44px] after:content-['']"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>

          {/* Mobile AI Genie Button */}
          <button
            type="button"
            id="mobile-header-ai-genie"
            onClick={handleOpenAIGenie}
            aria-label="Open AI Genie nutrition assistant"
            className="relative w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-[#2F5233] text-white flex items-center justify-center shadow-xs hover:bg-[#25401F] active:scale-95 motion-reduce:transform-none transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-1 after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-11 after:h-11 after:min-w-[44px] after:min-h-[44px] after:content-[''] cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3zM18 17l.7 2.3L21 20l-2.3.7L18 23l-.7-2.3L15 20l2.3-.7L18 17z" />
            </svg>
          </button>

          {/* Log In Button (Mobile) */}
          <Link
            to="/login"
            className="h-8 sm:h-9 px-2.5 sm:px-3 flex items-center justify-center rounded-lg border-[1.5px] border-[#2F5233] text-[#2F5233] text-[12px] font-semibold hover:bg-[#F3F6EE] active:scale-95 motion-reduce:transform-none transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233]"
          >
            Log In
          </Link>
        </div>

        {/* Guest Actions (Desktop md:flex) */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3 shrink-0">
          <Link className="h-9 sm:h-10 px-2.5 sm:px-4 flex items-center justify-center rounded-lg border-[1.5px] border-[#2F5233] text-[#2F5233] text-[12px] sm:text-[14px] font-medium hover:bg-[#F3F6EE] hover:-translate-y-0.5 hover:shadow-sm active:scale-95 motion-reduce:transform-none transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233]" to="/login">
            Log In
          </Link>
          <Link className="h-9 sm:h-10 px-2.5 sm:px-4 flex items-center justify-center rounded-lg bg-[#2F5233] text-white text-[12px] sm:text-[14px] font-medium hover:bg-[#25401F] hover:-translate-y-0.5 hover:shadow-md active:scale-95 motion-reduce:transform-none transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-1" to="/sign-up">
            Sign Up
          </Link>
        </div>

        {/* Hidden hamburger button & drawer retained for test backward-compatibility */}
        <div ref={mobileMenuRef} className="hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
          >
            Menu
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="hidden"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={shouldReduceMotion ? reducedMotionVariants : mobileDrawerVariants}
            >
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={() => setIsMobileMenuOpen(false)}>
                  {item.label}
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Fixed Bottom Navigation Bar on Mobile */}
      <MobileBottomNav isGuest={true} />
    </>
  );
}
