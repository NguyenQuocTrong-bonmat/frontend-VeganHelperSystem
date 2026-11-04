import React from 'react';
import { NavLink } from 'react-router-dom';

export default function MobileBottomNav({ isGuest = false }) {
  const navItems = isGuest
    ? [
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
          label: 'Stores',
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
      ]
    : [
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
          label: 'Stores',
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
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FDFBF6]/95 backdrop-blur-md border-t border-[#DCE3D5] shadow-[0_-2px_12px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="flex items-center justify-around w-full h-[58px] max-w-lg mx-auto px-1 sm:px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center flex-1 h-full min-w-[44px] min-h-[44px] py-1 px-1 rounded-xl transition-all duration-200 select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none ${
                isActive
                  ? 'text-[#2F5233]'
                  : 'text-[#6B6F63] hover:text-[#2F5233]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator Top Pill */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2.5px] bg-[#2F5233] rounded-b-full shadow-xs"
                  />
                )}

                {/* Icon Container with subtle active background */}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                    isActive ? 'bg-[#EAF0E9]/80 shadow-2xs' : 'group-hover:bg-[#F3F6EE]/60'
                  }`}
                >
                  {item.icon}
                </div>

                {/* Label */}
                <span
                  className={`text-[11px] font-dm-sans tracking-tight transition-colors duration-150 truncate max-w-full leading-none mt-0.5 ${
                    isActive ? 'font-bold text-[#2F5233]' : 'font-medium text-[#6B6F63]'
                  }`}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
