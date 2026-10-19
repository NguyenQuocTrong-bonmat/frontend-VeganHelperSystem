import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function HomeSocialNav({ isGuest = false, onOpenComposer }) {
  const weeklyMenuRoute = isGuest ? '/weekly-menu/locked' : '/weekly-menu';
  const veganStoresRoute = isGuest ? '/vegan-stores/locked' : '/vegan-stores';
  const savedPostsRoute = isGuest ? '/login' : '/saved-posts';

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-2.5 lg:gap-3.5 px-2.5 lg:px-4 py-3 rounded-xl text-[14px] sm:text-[15px] font-dm-sans transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest ${
      isActive
        ? 'bg-vh-forest text-white font-medium shadow-sm'
        : 'text-vh-text-secondary hover:text-vh-forest hover:bg-vh-mint/30'
    }`;

  return (
    <aside
      aria-label="Social Navigation"
      className="w-[200px] lg:w-[220px] xl:w-[260px] 2xl:w-[280px] shrink-0 hidden min-[900px]:block select-none sticky top-20 max-h-[calc(100vh-5.5rem)] overflow-y-auto overscroll-contain pr-1 pb-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-vh-border/60 [&::-webkit-scrollbar-thumb]:rounded-full"
    >
      <div className="bg-vh-surface border border-vh-border/70 rounded-card p-4 shadow-sm space-y-1.5">
        <div className="px-3 py-2 mb-1">
          <p className="font-dm-serif text-base font-semibold text-vh-text-primary tracking-wide">
            Navigation
          </p>
        </div>

        <NavLink to={isGuest ? '/' : '/home'} end className={linkStyle}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Feed Home</span>
        </NavLink>

        <NavLink to="/search" className={linkStyle}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Explore Recipes</span>
        </NavLink>

        <NavLink to={weeklyMenuRoute} className={linkStyle}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Weekly Menu</span>
        </NavLink>

        <NavLink to={veganStoresRoute} className={linkStyle}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Vegan Stores</span>
        </NavLink>

        <NavLink to={savedPostsRoute} className={linkStyle}>
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span>Saved Posts</span>
        </NavLink>

        {!isGuest && (
          <NavLink to="/my-posts" className={linkStyle}>
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span>My Posts</span>
          </NavLink>
        )}

        {!isGuest && (
          <div className="pt-3 border-t border-vh-border/50">
            {onOpenComposer ? (
              <button
                type="button"
                onClick={() => onOpenComposer('post')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-vh-forest text-white rounded-full font-dm-sans text-xs font-semibold hover:bg-vh-sage hover:-translate-y-0.5 active:scale-95 transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Post</span>
              </button>
            ) : (
              <Link
                to="/posts/create"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-vh-forest text-white rounded-full font-dm-sans text-xs font-semibold hover:bg-vh-sage hover:-translate-y-0.5 active:scale-95 transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Post</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
