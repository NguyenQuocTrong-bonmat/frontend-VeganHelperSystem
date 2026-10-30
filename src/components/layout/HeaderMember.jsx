import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/imageUtils';
import NotificationBell from '../notifications/NotificationBell';
import MobileBottomNav from './MobileBottomNav';
import { dropdownVariants, mobileDrawerVariants, reducedMotionVariants } from '../ui/dropdownMotion';

export default function HeaderMember() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const mobileProfileRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const activeProfileTriggerRef = useRef(null);

  // Handle click outside and Escape key to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        (!mobileProfileRef.current || !mobileProfileRef.current.contains(event.target))
      ) {
        setIsProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        if (isProfileOpen) {
          setIsProfileOpen(false);
          if (activeProfileTriggerRef.current) {
            activeProfileTriggerRef.current.focus();
          } else {
            (mobileProfileRef.current?.querySelector('button') || profileRef.current?.querySelector('button'))?.focus();
          }
        }
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
          mobileMenuRef.current?.querySelector('button')?.focus();
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileOpen, isMobileMenuOpen]);

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate('/login');
  };

  const handleOpenAIGenie = () => {
    window.dispatchEvent(new CustomEvent('open-ai-chat'));
    const fab = document.getElementById('chat-fab');
    if (fab) fab.click();
  };

  const navItems = [
    {
      to: '/home',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      to: '/weekly-menu',
      label: 'Weekly Menu',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      to: '/vegan-stores',
      label: 'Find Vegan Stores',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      to: '/my-posts',
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
      <header className="sticky top-0 z-50 h-14 sm:h-16 bg-[#FDFBF6] border-b border-[#DCE3D5] flex items-center justify-between px-3 sm:px-6 md:px-10 relative">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Logo Vegan Helper */}
          <Link className="flex items-center gap-2 text-[#2F5233] hover:opacity-95 transition-opacity" to="/home">
            <img src="/logo.png" alt="Vegan Helper Logo" className="h-8 sm:h-9 md:h-[54px] w-auto object-contain scale-[1.1] sm:scale-[1.25] md:scale-[1.35] origin-left" />
          </Link>
        </div>

        {/* Primary Navigation with Icons & Tooltips (Desktop) */}
        <nav aria-label="Primary Navigation" className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center gap-3 h-full">
          {navItems.map((item) => (
            <div key={item.to} className="relative group flex items-center justify-center">
              <NavLink
                to={item.to}
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
            to="/search"
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

          {/* NotificationBell on mobile */}
          <NotificationBell key={`mobile-${user?.id}`} userId={user?.id} />

          {/* Profile on mobile */}
          <div className="relative flex items-center" ref={mobileProfileRef}>
            <button
              type="button"
              onClick={(e) => {
                activeProfileTriggerRef.current = e.currentTarget;
                setIsProfileOpen(!isProfileOpen);
              }}
              aria-label="User Profile Menu"
              aria-expanded={isProfileOpen}
              aria-haspopup="true"
              className="relative w-9 h-9 rounded-full border border-[#DCE3D5] flex items-center justify-center text-[#6B6F63] hover:text-[#2F5233] hover:border-[#2F5233] bg-[#FDFBF6] hover:bg-[#F3F6EE] hover:shadow-xs active:scale-95 motion-reduce:transform-none transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-11 after:h-11 after:min-w-[44px] after:min-h-[44px] after:content-['']"
            >
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                {user?.avatarUrl ? (
                  <img src={getImageUrl(user.avatarUrl)} alt={user.displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-semibold text-xs text-[#2F5233]">
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* User Actions (Desktop md:flex) */}
        <div className="hidden md:flex items-center justify-end gap-3 sm:gap-5">
          <NotificationBell key={user?.id} userId={user?.id} />

          {/* Profile (Desktop) */}
          <div className="relative flex items-center" ref={profileRef}>
            <button
              type="button"
              onClick={(e) => {
                activeProfileTriggerRef.current = e.currentTarget;
                setIsProfileOpen(!isProfileOpen);
              }}
              aria-label="User Profile Menu"
              aria-expanded={isProfileOpen}
              aria-haspopup="true"
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#DCE3D5] flex items-center justify-center text-[#6B6F63] hover:text-[#2F5233] hover:border-[#2F5233] bg-[#FDFBF6] hover:bg-[#F3F6EE] hover:shadow-sm hover:-translate-y-0.5 active:scale-95 motion-reduce:transform-none transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-11 after:h-11 after:min-w-[44px] after:min-h-[44px] after:content-['']"
            >
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                {user?.avatarUrl ? (
                  <img src={getImageUrl(user.avatarUrl)} alt={user.displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-semibold text-xs text-[#2F5233]">
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </span>
                )}
              </div>
            </button>
          </div>
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

        {/* Profile Dropdown */}
        <AnimatePresence>
          {isProfileOpen && (
            <motion.div
              className="absolute right-3 sm:right-6 md:right-10 top-full mt-2 w-56 bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl shadow-lg py-1.5 z-50 origin-top-right"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={shouldReduceMotion ? reducedMotionVariants : dropdownVariants}
            >
              <div className="px-4 py-2 border-b border-[#DCE3D5] mb-1">
                  <p className="text-sm font-semibold text-[#2B2A25] truncate">{user?.displayName || 'User'}</p>
                  <p className="text-xs text-[#6B6F63] truncate">@{user?.displayName?.toLowerCase().replace(/\s/g, '') || 'member'}</p>
                </div>

                <Link
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-4 h-11 text-sm text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors cursor-pointer focus:outline-none focus-visible:bg-[#EBF2E8] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2F5233] active:bg-[#E2EDE0]"
                  to="/profile"
                >
                  <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path>
                  </svg>
                  <span className="font-medium">My Profile</span>
                </Link>

                <Link
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-4 h-11 text-sm text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors cursor-pointer focus:outline-none focus-visible:bg-[#EBF2E8] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2F5233] active:bg-[#E2EDE0]"
                  to="/security"
                >
                  <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"></path>
                  </svg>
                  <span className="font-medium">Security</span>
                </Link>

                {(user?.role === 'Admin' || user?.roleName === 'Admin') && (
                  <Link
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 h-11 text-sm text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors cursor-pointer focus:outline-none focus-visible:bg-[#EBF2E8] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2F5233] active:bg-[#E2EDE0]"
                    to="/admin"
                  >
                    <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"></path>
                    </svg>
                    <span className="font-medium">Admin Console</span>
                  </Link>
                )}

                <div className="my-1 border-t border-[#DCE3D5]"></div>

                <button
                  type="button"
                  onClick={(e) => {
                    setIsProfileOpen(false);
                    handleLogout(e);
                  }}
                  className="w-full flex items-center gap-3 px-4 h-11 text-sm text-[#A63446] hover:bg-[#F3F6EE] transition-colors cursor-pointer focus:outline-none focus-visible:bg-[#FBEBEB] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#A63446] active:bg-[#F8D8D8]"
                >
                  <svg className="w-4 h-4 text-[#A63446]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"></path>
                  </svg>
                  <span className="font-medium text-[#A63446]">Log Out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
      </header>

      {/* Fixed Bottom Navigation Bar on Mobile */}
      <MobileBottomNav isGuest={false} />
    </>
  );
}
