import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../notifications/NotificationBell';
import { getImageUrl } from '../../utils/imageUtils';
import { dropdownVariants, mobileDrawerVariants, reducedMotionVariants } from '../ui/dropdownMotion';

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isProfileOpen) {
          setIsProfileOpen(false);
          profileRef.current?.querySelector('button')?.focus();
        }
        if (isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
          mobileMenuRef.current?.querySelector('button')?.focus();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isProfileOpen, isMobileMenuOpen]);

  const handleLogout = async (e) => {
    if (e) e.preventDefault();
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Members', path: '/admin/members' },
    { name: 'Categories', path: '/admin/categories' },
    { name: 'Moderation', path: '/admin/content' },
    { name: 'Audit Logs', path: '/admin/audit-logs' },
  ];

  const isLinkActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="w-full h-16 sm:h-[72px] px-6 sm:px-8 py-3.5 flex items-center justify-between border-b border-[#DCE3D5] bg-[#FDFBF6] sticky top-0 z-50">
      {/* 1. Left: Brand Logo & Title matching Home Header */}
      <div className="flex items-center gap-3">
        <Link to="/admin" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Vegan Helper Logo"
            className="h-10 md:h-11 w-auto object-contain"
          />
          <span className="hidden sm:inline-flex items-center text-[10px] font-bold text-[#2F5233] bg-[#EAF0E9] border border-[#DCE3D5] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Admin Suite
          </span>
        </Link>
      </div>

      {/* 2. Center: Floating Capsule Navigation Menu (Desktop) */}
      <nav aria-label="Admin Navigation" className="hidden md:flex items-center bg-[#EAF0E9] p-1.5 rounded-full border border-[#DCE3D5]">
        {navLinks.map((link) => {
          const active = isLinkActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-5 py-2 text-sm rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] ${active
                  ? 'text-white font-semibold'
                  : 'text-[#555A4E] hover:text-[#2F5233] hover:bg-[#FDFBF6]/70 font-medium'
                }`}
            >
              {active && (
                <motion.span
                  layoutId="admin-nav-active-pill"
                  className="absolute inset-0 bg-[#2F5233] rounded-full shadow-xs"
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              <span className="relative z-10">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 3. Right: Notification Bell & User Avatar (matching Home page) */}
      <div className="flex items-center justify-end gap-3 sm:gap-5" ref={mobileMenuRef}>
        {/* Real Notification Bell matching Home page */}
        <NotificationBell key={user?.id} userId={user?.id} />

        {/* Mobile Menu Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          className="md:hidden w-9 h-9 rounded-lg border border-[#DCE3D5] flex items-center justify-center text-[#2F5233] hover:bg-[#F3F6EE] active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233]"
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
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-dm-sans transition-colors ${isLinkActive(item.path)
                      ? 'bg-[#2F5233] text-white font-medium shadow-xs'
                      : 'text-[#2B2A25] hover:text-[#2F5233] hover:bg-[#F3F6EE]'
                    }`}
                >
                  <span>{item.name}</span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Profile Avatar with dropdown matching Home page */}
        <div className="relative flex items-center" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-9 h-9 rounded-full border border-[#DCE3D5] flex items-center justify-center text-[#6B6F63] hover:text-[#2F5233] hover:border-[#2F5233] bg-[#FDFBF6] hover:bg-[#F3F6EE] hover:shadow-sm hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233]"
            title={user?.displayName || user?.fullName || 'User Profile'}
            aria-label="User Profile Menu"
            aria-expanded={isProfileOpen}
            aria-haspopup="true"
          >
            {user?.avatarUrl ? (
              <img
                src={getImageUrl(user.avatarUrl)}
                alt={user?.displayName || user?.fullName || 'User'}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-semibold text-xs text-[#2F5233]">
                {user?.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : (user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A')}
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
                  <p className="text-sm font-semibold text-[#2B2A25] truncate">
                    {user?.displayName || user?.fullName || 'Administrator'}
                  </p>
                  <p className="text-xs text-[#6B6F63] truncate">
                    @{user?.displayName?.toLowerCase().replace(/\s/g, '') || user?.username || 'admin'}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-[#2F5233] bg-[#EAF0E9] border border-[#DCE3D5] px-2 py-0.5 rounded-full">
                    ADMINISTRATOR
                  </span>
                </div>

                <Link
                  to="/home"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-4 h-11 text-sm text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="font-medium">Home Page</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-4 h-11 text-sm text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path>
                  </svg>
                  <span className="font-medium">My Profile</span>
                </Link>

                <Link
                  to="/security"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-4 h-11 text-sm text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"></path>
                  </svg>
                  <span className="font-medium">Security</span>
                </Link>

                <div className="my-1 border-t border-[#DCE3D5]"></div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 h-11 text-sm text-[#A63446] hover:bg-[#F3F6EE] transition-colors cursor-pointer"
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
