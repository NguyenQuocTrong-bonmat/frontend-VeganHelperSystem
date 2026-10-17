import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
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

  const userInitials = (user?.fullName || user?.username || 'AD')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <nav className="h-18 px-6 sm:px-8 py-3 flex items-center justify-between border-b border-[#F0F2F0] bg-white rounded-t-[32px]">
      {/* 1. Left: Brand Logo & Title */}
      <Link to="/admin" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-full bg-[#0F6B42] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
          {/* Organic Leaf / Sprout Logo */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg text-[#0F6B42] tracking-tight leading-tight">
            VeganHelper
          </span>
          <span className="text-[10px] font-semibold text-[#6B7280] tracking-wider uppercase">
            Admin Suite
          </span>
        </div>
      </Link>

      {/* 2. Center: Floating Capsule Navigation Menu */}
      <div className="hidden md:flex items-center bg-[#F3F5F4] p-1.5 rounded-full border border-[#E7EBE7]">
        {navLinks.map((link) => {
          const active = isLinkActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                active
                  ? 'bg-white text-[#111827] shadow-sm font-semibold'
                  : 'text-[#6B7280] hover:text-[#111827] hover:bg-white/50'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* 3. Right: Search, Notification Bell, User Avatar */}
      <div className="flex items-center gap-3">
        {/* Search Button */}
        <div className="relative">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F5F4] transition-colors"
            title="Search"
            aria-label="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {isSearchOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in">
              <input
                type="text"
                autoFocus
                placeholder="Quick search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl outline-none focus:border-[#0F6B42] text-[#111827]"
              />
            </div>
          )}
        </div>

        {/* Notifications Bell with Badge */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F5F4] transition-colors relative"
            title="Notifications"
            aria-label="Notifications"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E11D48] ring-2 ring-white" />
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl py-3 z-50">
              <div className="px-4 pb-2 border-b border-[#F3F4F6] flex items-center justify-between">
                <span className="font-semibold text-sm text-[#111827]">Notifications</span>
                <span className="text-[11px] font-bold text-[#E11D48] bg-[#FFE4E6] px-2 py-0.5 rounded-full">
                  3 New
                </span>
              </div>
              <div className="divide-y divide-[#F3F4F6] max-h-64 overflow-y-auto">
                <div className="p-3 hover:bg-[#F9FAFB] transition-colors cursor-pointer">
                  <p className="text-xs font-semibold text-[#111827]">5 Posts Flagged by AI</p>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">Spam & unverified claims detected.</p>
                </div>
                <div className="p-3 hover:bg-[#F9FAFB] transition-colors cursor-pointer">
                  <p className="text-xs font-semibold text-[#111827]">New Chef Verification Request</p>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">Chef Duy applied for badge.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with dropdown arrow */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-[#F3F5F4] transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#0F6B42] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-[#E7EBE7]">
              {userInitials}
            </div>
            <svg className="w-3.5 h-3.5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-[#F3F4F6]">
                <p className="text-sm font-bold text-[#111827] truncate">
                  {user?.fullName || user?.username || 'Administrator'}
                </p>
                <p className="text-xs text-[#6B7280] truncate">{user?.email || 'admin@veganhelper.vn'}</p>
                <span className="inline-block mt-1 text-[10px] font-bold text-[#0F6B42] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                  SUPER ADMIN
                </span>
              </div>
              <div className="py-1">
                <Link
                  to="/home"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-[#374151] hover:bg-[#F3F5F4]"
                >
                  <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>Go to Live Site</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-[#374151] hover:bg-[#F3F5F4]"
                >
                  <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile Settings</span>
                </Link>
              </div>
              <div className="h-px bg-[#F3F4F6] my-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#E11D48] hover:bg-[#FFF1F2] text-left"
              >
                <svg className="w-4 h-4 text-[#E11D48]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
