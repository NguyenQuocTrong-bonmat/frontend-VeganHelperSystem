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
    <nav className="w-full h-[72px] px-6 sm:px-8 py-3.5 flex items-center justify-between border-b border-[#DCE3D5] bg-[#FDFBF6] sticky top-0 z-40">
      {/* 1. Left: Brand Logo & Title matching Home Header */}
      <Link to="/admin" className="flex items-center gap-3 group">
        <img
          src="/logo.png"
          alt="Vegan Helper Logo"
          className="h-10 md:h-11 w-auto object-contain transition-transform group-hover:scale-105"
        />
        <span className="hidden sm:inline-flex items-center text-[10px] font-bold text-[#2F5233] bg-[#EAF0E9] border border-[#DCE3D5] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          Admin Suite
        </span>
      </Link>

      {/* 2. Center: Floating Capsule Navigation Menu */}
      <div className="hidden md:flex items-center bg-[#EAF0E9] p-1.5 rounded-full border border-[#DCE3D5]">
        {navLinks.map((link) => {
          const active = isLinkActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`px-5 py-2 text-sm rounded-full transition-all duration-200 ${
                active
                  ? 'bg-[#2F5233] text-white shadow-xs font-semibold'
                  : 'text-[#555A4E] hover:text-[#2F5233] hover:bg-[#FDFBF6]/70 font-medium'
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
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#6B6F63] hover:text-[#2F5233] hover:bg-[#EAF0E9] transition-colors"
            title="Search"
            aria-label="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {isSearchOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in">
              <input
                type="text"
                autoFocus
                placeholder="Quick search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#DCE3D5] rounded-xl outline-none focus:border-[#2F5233] text-[#2B2A25]"
              />
            </div>
          )}
        </div>

        {/* Notifications Bell with Badge */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#6B6F63] hover:text-[#2F5233] hover:bg-[#EAF0E9] transition-colors relative"
            title="Notifications"
            aria-label="Notifications"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#A63446] ring-2 ring-white" />
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl shadow-xl py-3 z-50">
              <div className="px-4 pb-2 border-b border-[#DCE3D5] flex items-center justify-between">
                <span className="font-semibold text-sm text-[#2B2A25]">Notifications</span>
                <span className="text-[11px] font-bold text-[#A63446] bg-[#FBEAE7] px-2 py-0.5 rounded-full">
                  3 New
                </span>
              </div>
              <div className="divide-y divide-[#EAF0E9] max-h-64 overflow-y-auto">
                <div className="p-3 hover:bg-[#FAFBF9] transition-colors cursor-pointer">
                  <p className="text-xs font-semibold text-[#2B2A25]">5 Posts Flagged by AI</p>
                  <p className="text-[11px] text-[#6B6F63] mt-0.5">Spam & unverified claims detected.</p>
                </div>
                <div className="p-3 hover:bg-[#FAFBF9] transition-colors cursor-pointer">
                  <p className="text-xs font-semibold text-[#2B2A25]">New Chef Verification Request</p>
                  <p className="text-[11px] text-[#6B6F63] mt-0.5">Chef Duy applied for badge.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with dropdown arrow */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-[#EAF0E9] transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#2F5233] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-[#DCE3D5]">
              {userInitials}
            </div>
            <svg className="w-3.5 h-3.5 text-[#6B6F63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-[#DCE3D5]">
                <p className="text-sm font-bold text-[#2B2A25] truncate">
                  {user?.fullName || user?.username || 'Administrator'}
                </p>
                <p className="text-xs text-[#6B6F63] truncate">{user?.email || 'admin@veganhelper.vn'}</p>
                <span className="inline-block mt-1 text-[10px] font-bold text-[#2F5233] bg-[#EAF0E9] border border-[#DCE3D5] px-2 py-0.5 rounded-full">
                  SUPER ADMIN
                </span>
              </div>
              <div className="py-1">
                <Link
                  to="/home"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-[#2B2A25] hover:bg-[#EAF0E9]"
                >
                  <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>Go to Live Site</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-[#2B2A25] hover:bg-[#EAF0E9]"
                >
                  <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile Settings</span>
                </Link>
              </div>
              <div className="h-px bg-[#DCE3D5] my-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#A63446] hover:bg-[#FBEAE7] text-left"
              >
                <svg className="w-4 h-4 text-[#A63446]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
