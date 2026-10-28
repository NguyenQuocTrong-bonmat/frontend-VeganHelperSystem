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
  // Trạng thái hiển thị của thanh điều hướng (ẩn khi cuộn xuống, hiện khi cuộn lên)
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const profileRef = useRef(null);

  // Hook theo dõi sự kiện cuộn trang (scroll):
  // - Cuộn xuống (diff > 0): ẩn thanh điều hướng xuống dưới cạnh đáy màn hình và đóng menu nếu đang mở
  // - Cuộn lên (diff < 0) hoặc ở gần đầu trang (scrollY <= 20px): hiện lại thanh điều hướng
  // - Áp dụng requestAnimationFrame và ngưỡng di chuyển 8px để tối ưu hiệu năng và tránh rung giật
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Luôn hiển thị thanh điều hướng khi ở gần đầu trang
          if (currentScrollY <= 20) {
            setIsVisible(true);
            lastScrollY.current = currentScrollY;
            ticking = false;
            return;
          }

          const diff = currentScrollY - lastScrollY.current;

          // Bỏ qua các chuyển động quá nhỏ (< 8px) trên trackpad
          if (Math.abs(diff) > 8) {
            if (diff > 0) {
              // Người dùng đang cuộn xuống -> ẩn thanh điều hướng
              setIsVisible(false);
              setIsProfileOpen(false);
            } else {
              // Người dùng đang cuộn lên -> hiển thị lại thanh điều hướng
              setIsVisible(true);
            }
            lastScrollY.current = currentScrollY;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside and Escape key to close profile dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape' && isProfileOpen) {
        setIsProfileOpen(false);
        profileRef.current?.querySelector('button')?.focus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileOpen]);

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
    <header className={`fixed bottom-0 left-0 right-0 z-50 h-16 bg-[#FDFBF6]/95 backdrop-blur-md border-t border-[#DCE3D5] flex items-center justify-between px-2.5 sm:px-6 md:px-10 transition-transform duration-300 ease-in-out md:sticky md:top-0 md:bottom-auto md:border-t-0 md:border-b md:transition-none ${
      isVisible ? 'translate-y-0' : 'translate-y-full pointer-events-none md:translate-y-0 md:pointer-events-auto'
    }`}>
      <div className="hidden md:flex items-center gap-2 shrink-0">
        {/* Logo Vegan Helper (chỉ hiển thị trên desktop/màn hình lớn) */}
        <Link className="flex items-center text-[#2F5233] hover:opacity-95 transition-opacity" to="/home">
          <img src="/logo.png" alt="Vegan Helper Logo" className="h-[32px] sm:h-[46px] md:h-[54px] w-auto object-contain sm:scale-[1.35] origin-left" />
        </Link>
      </div>

      {/* Primary Navigation with Icons - Khoảng cách giữa các icon ở mobile là 20px */}
      <nav aria-label="Primary Navigation" className="pointer-events-none flex absolute left-1/2 -translate-x-1/2 items-center justify-center gap-[20px] sm:gap-[22px] md:gap-[24px] h-full">
        {navItems.map((item) => (
          <div key={item.to} className="relative group flex items-center justify-center pointer-events-auto">
            <NavLink
              to={item.to}
              aria-label={item.label}
              className={({ isActive }) =>
                `relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl transition-all duration-200 active:scale-95 motion-reduce:transform-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] ${isActive
                  ? 'bg-[#2F5233] text-white shadow-xs'
                  : 'text-[#555A4E] hover:text-[#2F5233] hover:bg-[#EBF2E8]/80'
                }`
              }
            >
              {item.icon}
            </NavLink>
            {/* Tooltip khi di chuột hoặc focus trên desktop (ẩn trên mobile touch) */}
            <div
              role="tooltip"
              className="hidden md:block pointer-events-none absolute top-full mt-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#1F3323] text-white text-[12px] font-dm-sans rounded-md whitespace-nowrap shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50 select-none after:content-[''] after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-b-[#1F3323]"
            >
              {item.label}
            </div>
          </div>
        ))}
      </nav>

      {/* User Actions - luôn cố định ở bên phải navbar */}
      <div className="relative z-20 flex items-center justify-end gap-1.5 sm:gap-[15.4px] md:gap-[22px] shrink-0 pointer-events-auto ml-auto">
        <NotificationBell key={user?.id} userId={user?.id} />

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
                className="absolute right-0 bottom-full mb-2 md:bottom-auto md:top-full md:mt-2 w-56 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg shadow-lg py-1.5 z-50 origin-bottom-right md:origin-top-right"
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

