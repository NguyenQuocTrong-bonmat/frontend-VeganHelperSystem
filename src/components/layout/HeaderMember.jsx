import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/imageUtils';
import NotificationBell from '../notifications/NotificationBell';

export default function HeaderMember() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
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
        {/* Logo Vegan Helper */}
        <Link className="flex items-center gap-2.5 text-[#2F5233] hover:opacity-95 transition-opacity" to="/home">
          <img src="/logo.png" alt="Vegan Helper Logo" className="h-[46px] md:h-[54px] w-auto object-contain scale-[1.35] origin-left" />
        </Link>
      </div>

      {/* Navigation Menu 4 items */}
      <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center gap-8 h-full">
        <NavLink to="/home"  className={({ isActive }) => `relative flex items-center h-full text-[15px] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2F5233] after:origin-center after:transition-transform after:duration-300 ${isActive ? "font-semibold text-[#2F5233] after:scale-x-100" : "font-medium text-[#2B2A25] hover:text-[#2F5233] after:scale-x-0 hover:after:scale-x-100"}`}>
          Home
        </NavLink>
        <NavLink to="/weekly-menu"  className={({ isActive }) => `relative flex items-center h-full text-[15px] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2F5233] after:origin-center after:transition-transform after:duration-300 ${isActive ? "font-semibold text-[#2F5233] after:scale-x-100" : "font-medium text-[#2B2A25] hover:text-[#2F5233] after:scale-x-0 hover:after:scale-x-100"}`}>
          Weekly Menu
        </NavLink>
        <NavLink to="/vegan-stores"  className={({ isActive }) => `relative flex items-center h-full text-[15px] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2F5233] after:origin-center after:transition-transform after:duration-300 ${isActive ? "font-semibold text-[#2F5233] after:scale-x-100" : "font-medium text-[#2B2A25] hover:text-[#2F5233] after:scale-x-0 hover:after:scale-x-100"}`}>
          Find Vegan Stores
        </NavLink>
        <NavLink to="/my-posts"  className={({ isActive }) => `relative flex items-center h-full text-[15px] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2F5233] after:origin-center after:transition-transform after:duration-300 ${isActive ? "font-semibold text-[#2F5233] after:scale-x-100" : "font-medium text-[#2B2A25] hover:text-[#2F5233] after:scale-x-0 hover:after:scale-x-100"}`}>
          My Posts
        </NavLink>
      </nav>

      {/* User Actions */}
      <div className="flex items-center justify-end gap-6">
        <NotificationBell key={user?.id} userId={user?.id} />

        {/* Profile */}
        <div className="relative flex items-center" ref={profileRef}>
          <button 
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);

            }}
            className="w-9 h-9 rounded-full border border-[#DCE3D5] flex items-center justify-center text-[#6B6F63] hover:text-[#2F5233] hover:border-[#2F5233] bg-[#FDFBF6] hover:bg-[#F3F6EE] hover:shadow-sm hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233]"
          >
            {user?.avatarUrl ? (
              <img src={getImageUrl(user.avatarUrl)} alt={user.displayName} className="w-full h-full object-cover" />
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
              
              <Link className="flex items-center gap-3 px-4 h-11 text-sm text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors cursor-pointer" to="/security">
                <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"></path>
                </svg>
                <span className="font-medium">Security</span>
              </Link>
              
              {(user?.role === 'Admin' || user?.roleName === 'Admin') && (
                <Link className="flex items-center gap-3 px-4 h-11 text-sm text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors cursor-pointer" to="/admin">
                  <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"></path>
                  </svg>
                  <span className="font-medium">Admin Console</span>
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
