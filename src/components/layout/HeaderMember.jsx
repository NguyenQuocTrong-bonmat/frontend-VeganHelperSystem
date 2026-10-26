import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/imageUtils';
import NotificationBell from '../notifications/NotificationBell';
import { dropdownVariants, mobileDrawerVariants, reducedMotionVariants } from '../ui/dropdownMotion';

export default function HeaderMember() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Handle click outside and Escape key to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
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
          profileRef.current?.querySelector('button')?.focus();
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
    <header className="sticky top-0 z-50 h-16 bg-[#FDFBF6] border-b border-[#DCE3D5] flex items-center justify-between px-6 md:px-10 relative">
      <div className="flex items-center gap-3">
        {/* Logo Vegan Helper */}
        <Link className="flex items-center gap-2.5 text-[#2F5233] hover:opacity-95 transition-opacity" to="/home">
          <img src="/logo.png" alt="Vegan Helper Logo" className="h-[46px] md:h-[54px] w-auto object-contain scale-[1.35] origin-left" />
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

      {/* User Actions */}
      <div className="flex items-center justify-end gap-3 sm:gap-5" ref={mobileMenuRef}>
        <NotificationBell key={user?.id} userId={user?.id} />

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

        {/* Profile */}
        <div className="relative flex items-center" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
            }}
            aria-label="User Profile Menu"
            aria-expanded={isProfileOpen}
            aria-haspopup="true"
            className="w-9 h-9 rounded-full border border-[#DCE3D5] flex items-center justify-center text-[#6B6F63] hover:text-[#2F5233] hover:border-[#2F5233] bg-[#FDFBF6] hover:bg-[#F3F6EE] hover:shadow-sm hover:-translate-y-0.5 active:scale-95 motion-reduce:transform-none transition-all cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233]"
          >
            {user?.avatarUrl ? (
              <img src={getImageUrl(user.avatarUrl)} alt={user.displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="font-semibold text-xs text-[#2F5233]">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </span>
            )}
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                className="absolute right-0 top-full mt-2 w-56 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg shadow-lg py-1.5 z-50 origin-top-right"
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
        </div>
      </div>
    </header>
  );
}
