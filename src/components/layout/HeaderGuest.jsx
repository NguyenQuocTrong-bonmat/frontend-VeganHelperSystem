// src/components/layout/HeaderGuest.jsx
import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

/**
 * Component HeaderGuest (Thanh điều hướng cho khách chưa đăng nhập):
 * - Đặt cố định ở cạnh đáy màn hình (fixed bottom-0).
 * - Tự động ẩn khi cuộn xuống và hiện lại khi cuộn lên hoặc ở gần đầu trang.
 * - Trên giao diện điện thoại (mobile): Bỏ nút Hamburger menu, giữ nguyên các icon điều hướng
 *   trực quan giống hệt với giao diện tablet và máy tính (Home, Weekly Menu, Vegan Stores, My Posts).
 * - Các nút điều hướng (Log In, Sign Up) được tinh chỉnh gọn gàng, vừa vặn trên màn hình nhỏ.
 */
export default function HeaderGuest() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Hook theo dõi sự kiện cuộn trang (scroll):
  // - Cuộn xuống (diff > 0): ẩn thanh điều hướng xuống dưới cạnh đáy màn hình
  // - Cuộn lên (diff < 0) hoặc ở gần đầu trang (scrollY <= 20px): hiện lại thanh điều hướng
  // - Áp dụng requestAnimationFrame và ngưỡng di chuyển 8px để tối ưu hiệu năng
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

          // Bỏ qua các chuyển động quá nhỏ (< 8px)
          if (Math.abs(diff) > 8) {
            if (diff > 0) {
              // Người dùng đang cuộn xuống -> ẩn thanh điều hướng
              setIsVisible(false);
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

  // Danh sách các mục điều hướng chính với icon chuẩn
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
    <header className={`fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#FDFBF6]/95 backdrop-blur-md border-t border-[#DCE3D5] flex items-center justify-between px-2.5 sm:px-6 md:px-10 transition-transform duration-300 ease-in-out md:sticky md:top-0 md:bottom-auto md:border-t-0 md:border-b md:transition-none ${
      isVisible ? 'translate-y-0' : 'translate-y-full pointer-events-none md:translate-y-0 md:pointer-events-auto'
    }`}>
      {/* Khối Logo thương hiệu (chỉ hiển thị trên desktop/màn hình lớn) */}
      <div className="hidden md:flex items-center gap-2 shrink-0">
        <Link className="flex items-center text-[#2F5233] hover:opacity-95 transition-opacity" to="/">
          <img src="/logo.png" alt="Vegan Helper Logo" className="h-[32px] sm:h-[46px] md:h-[54px] w-auto object-contain sm:scale-[1.35] origin-left" />
        </Link>
      </div>

      {/* Primary Navigation with Icons - Khoảng cách giữa các icon ở mobile là 20px */}
      <nav aria-label="Primary Navigation" className="pointer-events-none flex absolute left-1/2 -translate-x-1/2 items-center justify-center gap-[20px] sm:gap-[22px] md:gap-[24px] h-full">
        {navItems.map((item) => (
          <div key={item.to} className="relative group flex items-center justify-center pointer-events-auto">
            <NavLink
              to={item.to}
              end={item.end}
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

      {/* Khối nút Thao tác Đăng nhập / Đăng ký cho khách - luôn cố định ở bên phải */}
      <div className="relative z-20 flex items-center gap-1.5 sm:gap-[8.8px] md:gap-[13.2px] shrink-0 pointer-events-auto ml-auto">
        <Link
          className="h-7 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4 flex items-center justify-center rounded-lg border-[1.5px] border-[#2F5233] text-[#2F5233] text-[11px] sm:text-[13px] md:text-[14px] font-medium hover:bg-[#F3F6EE] hover:-translate-y-0.5 hover:shadow-sm active:scale-95 motion-reduce:transform-none transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233]"
          to="/login"
        >
          Log In
        </Link>
        <Link
          className="h-7 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4 flex items-center justify-center rounded-lg bg-[#2F5233] text-white text-[11px] sm:text-[13px] md:text-[14px] font-medium hover:bg-[#25401F] hover:-translate-y-0.5 hover:shadow-md active:scale-95 motion-reduce:transform-none transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-1"
          to="/register"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
}
