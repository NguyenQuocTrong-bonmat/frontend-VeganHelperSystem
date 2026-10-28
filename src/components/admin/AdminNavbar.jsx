// src/components/admin/AdminNavbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../notifications/NotificationBell';
import { getImageUrl } from '../../utils/imageUtils';
import { dropdownVariants, reducedMotionVariants } from '../ui/dropdownMotion';

/**
 * Component AdminNavbar (Thanh điều hướng cho quản trị viên):
 * - Đặt cố định ở cạnh đáy màn hình (fixed bottom-0).
 * - Tự động ẩn khi cuộn trang xuống và hiện lại khi cuộn lên hoặc ở gần đầu trang.
 * - Trên giao diện điện thoại (mobile): Bỏ nút Hamburger menu, giữ nguyên các icon điều hướng
 *   trực quan giống hệt với tablet và máy tính (Dashboard, Members, Categories, Moderation, Audit Logs).
 * - Khoảng cách giữa các icon trên mobile là 20px (gap-[20px]).
 * - Menu dropdown tài khoản mở ngược lên trên (bottom-full mb-2).
 */
export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const profileRef = useRef(null);

  // Hook theo dõi sự kiện cuộn trang (scroll):
  // - Cuộn xuống (diff > 0): ẩn thanh điều hướng xuống dưới đáy màn hình
  // - Cuộn lên (diff < 0) hoặc ở gần đầu trang (scrollY <= 20px): hiện lại thanh điều hướng
  // - Sử dụng requestAnimationFrame và ngưỡng di chuyển 8px để tối ưu hiệu năng
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

          // Bỏ qua chuyển động vi mô (< 8px)
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

  // Xử lý đóng dropdown khi click ra ngoài hoặc bấm Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isProfileOpen) {
        setIsProfileOpen(false);
        profileRef.current?.querySelector('button')?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isProfileOpen]);

  const handleLogout = async (e) => {
    if (e) e.preventDefault();
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Danh sách các mục điều hướng dành riêng cho Quản trị viên kèm icon chuẩn
  const navLinks = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
    },
    {
      name: 'Members',
      path: '/admin/members',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      name: 'Categories',
      path: '/admin/categories',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      ),
    },
    {
      name: 'Moderation',
      path: '/admin/content',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
    },
    {
      name: 'Audit Logs',
      path: '/admin/audit-logs',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const isLinkActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`fixed bottom-0 left-0 right-0 z-50 h-16 bg-[#FDFBF6]/95 backdrop-blur-md border-t border-[#DCE3D5] flex items-center justify-between px-2.5 sm:px-6 md:px-10 transition-transform duration-300 ease-in-out md:sticky md:top-0 md:bottom-auto md:border-t-0 md:border-b md:transition-none ${
      isVisible ? 'translate-y-0' : 'translate-y-full pointer-events-none md:translate-y-0 md:pointer-events-auto'
    }`}>
      {/* 1. Left: Logo & Nhãn Admin Suite thu gọn (chỉ hiển thị trên desktop/màn hình lớn) */}
      <div className="hidden md:flex items-center gap-2 shrink-0">
        <Link to="/admin" className="flex items-center gap-2 text-[#2F5233] hover:opacity-95 transition-opacity">
          <img
            src="/logo.png"
            alt="Vegan Helper Logo"
            className="h-[32px] sm:h-[42px] md:h-[48px] w-auto object-contain sm:scale-[1.25] origin-left"
          />
          <span className="hidden sm:inline-flex items-center text-[10px] font-bold text-[#2F5233] bg-[#EAF0E9] border border-[#DCE3D5] px-2 py-0.5 rounded-full uppercase tracking-wider">
            Admin
          </span>
        </Link>
      </div>

      {/* 2. Center Desktop: Primary Links with Animated Pill ("như cũ" trên màn hình lớn) */}
      <nav aria-label="Admin Navigation" className="hidden md:flex items-center gap-1.5 bg-[#F3F6EE] p-1.5 rounded-full border border-[#DCE3D5]">
        {navLinks.map((link) => {
          const active = isLinkActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              aria-label={link.name}
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

      {/* 2. Center Mobile: Primary Navigation with Icons on Bottom Bar (bỏ Hamburger menu, gap 12px mobile, 20px sm) */}
      <nav aria-label="Admin Navigation Mobile" className="pointer-events-none flex md:hidden absolute left-1/2 -translate-x-1/2 items-center justify-center gap-[12px] sm:gap-[20px] h-full">
        {navLinks.map((item) => {
          const active = isLinkActive(item.path);
          return (
            <div key={item.path} className="relative group flex items-center justify-center pointer-events-auto">
              <Link
                to={item.path}
                aria-label={item.name}
                className={`relative flex items-center justify-center w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-xl transition-all duration-200 active:scale-95 motion-reduce:transform-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] ${active
                    ? 'bg-[#2F5233] text-white shadow-xs'
                    : 'text-[#555A4E] hover:text-[#2F5233] hover:bg-[#EBF2E8]/80'
                  }`}
              >
                {item.icon}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* 3. Right: Chuông thông báo & Avatar Quản trị viên - luôn cố định ở bên phải */}
      <div className="relative z-20 flex items-center justify-end gap-1.5 sm:gap-3.5 md:gap-5 shrink-0 pointer-events-auto ml-auto">
        <NotificationBell key={user?.id} userId={user?.id} />

        {/* User Profile Avatar with dropdown (mở xuống dưới trên desktop, mở lên trên trên mobile) */}
        <div className="relative flex items-center" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-9 h-9 rounded-full border border-[#DCE3D5] flex items-center justify-center text-[#6B6F63] hover:text-[#2F5233] hover:border-[#2F5233] bg-[#FDFBF6] hover:bg-[#F3F6EE] hover:shadow-sm hover:-translate-y-0.5 active:scale-95 motion-reduce:transform-none transition-all cursor-pointer overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233]"
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
                className="absolute right-0 bottom-full mb-2 md:bottom-auto md:top-full md:mt-2 w-56 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg shadow-lg py-1.5 z-50 origin-bottom-right md:origin-top-right"
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
