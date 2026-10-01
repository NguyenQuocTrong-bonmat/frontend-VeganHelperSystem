import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function HeaderMember() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 h-16 bg-[#FDFBF6] border-b border-[#DCE3D5] flex items-center justify-between px-6 md:px-10 relative">
      <div className="flex items-center gap-3">
        {/* Logo Botanical Hearth */}
        <Link className="flex items-center gap-2.5 text-[#2F5233] hover:opacity-95 transition-opacity" to="/home">
          <svg className="w-6 h-6 text-[#2F5233]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
          </svg>
          <span className="font-fraunces text-2xl font-semibold tracking-tight text-[#2F5233]">
            Botanical Hearth
          </span>
        </Link>
      </div>

      {/* Navigation Menu 4 items */}
      <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center gap-8 h-full">
        <NavLink to="/home"  className={({ isActive }) => `relative flex items-center h-full text-[15px] transition-colors ${isActive ? "font-semibold text-[#2F5233] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2F5233]" : "font-medium text-[#2B2A25] hover:text-[#2F5233]"}`}>
          Home
        </NavLink>
        <NavLink to="/weekly-menu"  className={({ isActive }) => `relative flex items-center h-full text-[15px] transition-colors ${isActive ? "font-semibold text-[#2F5233] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2F5233]" : "font-medium text-[#2B2A25] hover:text-[#2F5233]"}`}>
          Weekly Menu
        </NavLink>
        <NavLink to="/vegan-stores"  className={({ isActive }) => `relative flex items-center h-full text-[15px] transition-colors ${isActive ? "font-semibold text-[#2F5233] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2F5233]" : "font-medium text-[#2B2A25] hover:text-[#2F5233]"}`}>
          Find Vegan Stores
        </NavLink>
        <NavLink to="/my-posts"  className={({ isActive }) => `relative flex items-center h-full text-[15px] transition-colors ${isActive ? "font-semibold text-[#2F5233] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2F5233]" : "font-medium text-[#2B2A25] hover:text-[#2F5233]"}`}>
          My Posts
        </NavLink>
      </nav>

      {/* User Actions */}
      <div className="flex items-center justify-end gap-6">
        {/* Notifications */}
        <div className="relative flex items-center" ref={notifRef}>
          <button 
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setIsProfileOpen(false);
            }}
            className="relative w-9 h-9 rounded-full border border-[#DCE3D5] flex items-center justify-center text-[#6B6F63] hover:text-[#2F5233] hover:border-[#2F5233] bg-[#FDFBF6] hover:bg-[#F3F6EE] transition-colors cursor-pointer focus:outline-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"></path>
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2F5233] ring-2 ring-[#FDFBF6]"></span>
          </button>
          
          {isNotificationOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="p-4 border-b border-[#DCE3D5] flex items-center justify-between bg-[#FDFBF6]">
                <div className="flex items-center gap-2">
                  <h3 className="font-fraunces text-base font-semibold text-[#2B2A25]">Notifications</h3>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#E9EFE6] text-[#2F5233]">2 new</span>
                </div>
                <button className="text-[12px] text-[#6B6F63] hover:text-[#2F5233] transition-colors cursor-pointer font-medium">Mark all as read</button>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-[#DCE3D5]">
                {/* Dummy Notifications */}
                <div className="p-3.5 bg-[#F3F6EE] flex items-start gap-3 hover:bg-[#E9EFE6]/70 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center shrink-0 text-[#2F5233] font-semibold text-xs mt-0.5">AN</div>
                  <div className="flex-1 text-[13px] leading-snug">
                    <p className="text-[#2B2A25]"><strong className="font-semibold">Anna Nguyen</strong> liked your recipe <span className="italic font-medium text-[#2F5233]">Crispy Tofu</span></p>
                    <span className="text-[11px] text-[#6B6F63] mt-1 block">15m ago</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#2F5233] shrink-0 mt-2"></span>
                </div>
              </div>
              <div className="p-3 bg-[#FDFBF6] border-t border-[#DCE3D5] text-center">
                <a className="text-[13px] font-medium text-[#2F5233] hover:underline underline-offset-4 cursor-pointer block" href="#notifications">View all notifications</a>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative flex items-center" ref={profileRef}>
          <button 
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationOpen(false);
            }}
            className="w-9 h-9 rounded-full border border-[#DCE3D5] flex items-center justify-center text-[#6B6F63] hover:text-[#2F5233] hover:border-[#2F5233] bg-[#FDFBF6] hover:bg-[#F3F6EE] transition-colors cursor-pointer overflow-hidden focus:outline-none"
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="font-semibold text-xs text-[#2F5233]">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </span>
            )}
          </button>
          
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg shadow-lg py-1.5 z-50">
              <div className="px-4 py-2 border-b border-[#DCE3D5] mb-1">
                <p className="text-sm font-semibold text-[#2B2A25] truncate">{user?.displayName || 'User'}</p>
                <p className="text-xs text-[#6B6F63] truncate">@{user?.displayName?.toLowerCase().replace(/\s/g, '') || 'member'}</p>
              </div>
              
              <Link className="flex items-center gap-3 px-4 h-11 text-sm text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors cursor-pointer" to="/profile">
                <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path>
                </svg>
                <span className="font-medium">My Profile</span>
              </Link>
              
              {(user?.role === 'Admin' || user?.roleName === 'Admin') && (
                <Link className="flex items-center gap-3 px-4 h-11 text-sm text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors cursor-pointer" to="/admin">
                  <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"></path>
                  </svg>
                  <span className="font-medium">Admin Dashboard</span>
                </Link>
              )}
              
              <div className="my-1 border-t border-[#DCE3D5]"></div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 h-11 text-sm text-[#A63446] hover:bg-[#F3F6EE] transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 text-[#A63446]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"></path>
                </svg>
                <span className="font-medium text-[#A63446]">Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
