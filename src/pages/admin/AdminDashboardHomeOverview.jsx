import { Link } from 'react-router-dom'

function AdminDashboardHomeOverview() {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div className="fixed inset-0 bg-black/40 z-40 lg:hidden hidden transition-opacity duration-300 backdrop-blur-sm" id="mobileBackdrop"></div>
      {/* Outer Dashboard Flex Frame (Non-overlapping layout) */}
      <div className="flex-1 flex h-screen w-screen overflow-hidden">
        {/* ========================================================================= */}
        {/* 1. LEFT SIDEBAR (NAVIGATION) - Fixed w-64 / 256px without clipping main */}
        {/* ========================================================================= */}
        <aside className="w-64 bg-surface-paper border-r border-border-sage-mist flex flex-col shrink-0 z-30 fixed lg:relative inset-y-0 left-0 transform -translate-x-full lg:translate-x-0 select-none shadow-none" id="sidebar">
          {/* Platform Branding & Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-border-sage-mist shrink-0">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-lg bg-primary-moss flex items-center justify-center text-white shrink-0 border border-border-sage-mist">
                {/* Organic Leaf / Sprout Icon */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                </svg>
              </div>
              <div className="logo-text leading-tight truncate">
                <h1 className="font-serif font-bold text-base text-primary-moss tracking-tight truncate">
                  Botanical Hearth
                </h1>
                <p className="text-[10.5px] font-semibold text-success-sprout tracking-wide">
                  Vegan admin core
                </p>
              </div>
            </div>
            {/* Desktop Collapse / Expand Toggle Button */}
            <button className="hidden lg:flex p-1.5 rounded-lg text-text-stem-gray hover:text-text-charcoal hover:bg-herb-white transition-colors border border-transparent hover:border-border-sage-mist" id="desktopSidebarCollapseBtn" title="Collapse Sidebar">
              <svg className="w-4 h-4 transition-transform duration-200" fill="none" id="collapseIcon" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M11 19l-7-7 7-7m8 14l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
              </svg>
            </button>
            {/* Mobile Close Button */}
            <button className="lg:hidden p-1.5 rounded-lg text-text-stem-gray hover:text-text-charcoal hover:bg-herb-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
              </svg>
            </button>
          </div>
          {/* Navigation Accordion Scroll Area */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
            {/* GROUP 1: OVERVIEW */}
            <div className="nav-group">
              <div className="group-header flex items-center justify-between px-2 mb-1.5 cursor-pointer text-text-stem-gray hover:text-text-charcoal">
                <span className="group-title font-serif text-xs font-bold tracking-wide text-text-stem-gray">
                  Overview
                </span>
                <svg className="nav-arrow w-3.5 h-3.5 transition-transform duration-200" fill="none" id="arrow-overview" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                </svg>
              </div>
              <div className="accordion-content expanded space-y-1" id="acc-overview">
                <Link className="nav-link flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium text-white bg-primary-moss hover:bg-primary-moss-hover transition-all group" to="/admin">
                  <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                  </svg>
                  <span className="nav-text truncate font-semibold">
                    Dashboard (Home)
                  </span>
                </Link>
              </div>
            </div>
            {/* GROUP 2: CORE SYSTEM */}
            <div className="nav-group">
              <div className="group-header flex items-center justify-between px-2 mb-1.5 cursor-pointer text-text-stem-gray hover:text-text-charcoal">
                <span className="group-title font-serif text-xs font-bold tracking-wide text-text-stem-gray">
                  Core system
                </span>
                <svg className="nav-arrow w-3.5 h-3.5 transition-transform duration-200" fill="none" id="arrow-core" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                </svg>
              </div>
              <div className="accordion-content expanded space-y-1" id="acc-core">
                <Link className="nav-link flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium text-text-charcoal hover:bg-herb-white hover:text-primary-moss transition-colors group" to="/admin/members">
                  <svg className="w-4 h-4 text-text-stem-gray group-hover:text-primary-moss shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                  </svg>
                  <span className="nav-text truncate">
                    Member Management
                  </span>
                </Link>
                <Link className="nav-link flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium text-text-charcoal hover:bg-herb-white hover:text-primary-moss transition-colors group" to="/admin/categories">
                  <svg className="w-4 h-4 text-text-stem-gray group-hover:text-primary-moss shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                  </svg>
                  <span className="nav-text truncate">
                    Category Management
                  </span>
                </Link>
              </div>
            </div>
            {/* GROUP 3: CONTENT MODERATION */}
            <div className="nav-group">
              <div className="group-header flex items-center justify-between px-2 mb-1.5 cursor-pointer text-text-stem-gray hover:text-text-charcoal">
                <span className="group-title font-serif text-xs font-bold tracking-wide text-text-stem-gray">
                  Content moderation
                </span>
                <svg className="nav-arrow w-3.5 h-3.5 transition-transform duration-200" fill="none" id="arrow-moderation" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                </svg>
              </div>
              <div className="accordion-content expanded space-y-1" id="acc-moderation">
                <Link className="nav-link flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-medium text-text-charcoal hover:bg-herb-white hover:text-primary-moss transition-colors group" to="/admin/content">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <svg className="w-4 h-4 shrink-0 text-text-stem-gray group-hover:text-primary-moss" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                    </svg>
                    <span className="nav-text truncate">
                      Manual Moderation
                    </span>
                  </div>
                  <span className="nav-badge text-[11px] font-semibold bg-moss-subtle text-primary-moss border border-border-sage-mist px-2 py-0.5 rounded-lg">
                    12
                  </span>
                </Link>
                <Link className="nav-link flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-medium text-text-charcoal hover:bg-herb-white hover:text-primary-moss transition-colors group" to="/admin/ai-moderation">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <svg className="w-4 h-4 text-text-stem-gray group-hover:text-primary-moss shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                    </svg>
                    <span className="nav-text truncate">
                      AI Flagged Queue
                    </span>
                  </div>
                  <span className="nav-badge text-[11px] font-semibold bg-[#ffdad6] text-[#ba1a1a] border border-border-sage-mist px-2 py-0.5 rounded-lg">
                    5
                  </span>
                </Link>
              </div>
            </div>
            {/* GROUP 4: AI OPERATIONS & MLOPS */}
            <div className="nav-group">
              <div className="group-header flex items-center justify-between px-2 mb-1.5 cursor-pointer text-text-stem-gray hover:text-text-charcoal">
                <span className="group-title font-serif text-xs font-bold tracking-wide text-text-stem-gray">
                  AI operations & MLOps
                </span>
                <svg className="nav-arrow w-3.5 h-3.5 transition-transform duration-200" fill="none" id="arrow-ai" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                </svg>
              </div>
              <div className="accordion-content expanded space-y-1" id="acc-ai">
                <Link className="nav-link flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium text-text-charcoal hover:bg-herb-white hover:text-primary-moss transition-colors group" to="/admin/ai-monitoring">
                  <svg className="w-4 h-4 text-text-stem-gray group-hover:text-primary-moss shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                  </svg>
                  <span className="nav-text truncate">
                    AI Model Monitoring
                  </span>
                </Link>
                <Link className="nav-link flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium text-text-charcoal hover:bg-herb-white hover:text-primary-moss transition-colors group" to="/admin/meal-planner-config">
                  <svg className="w-4 h-4 text-text-stem-gray group-hover:text-primary-moss shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                  </svg>
                  <span className="nav-text truncate">
                    Meal Planner Config
                  </span>
                </Link>
                <Link className="nav-link flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-medium text-text-charcoal hover:bg-herb-white hover:text-primary-moss transition-colors group" to="/admin/video-summarization">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <svg className="w-4 h-4 text-text-stem-gray group-hover:text-primary-moss shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                    </svg>
                    <span className="nav-text truncate">
                      Video Summarization Queue
                    </span>
                  </div>
                  <span className="nav-badge text-[11px] font-semibold bg-moss-subtle text-primary-moss border border-border-sage-mist px-2 py-0.5 rounded-lg">
                    24
                  </span>
                </Link>
              </div>
            </div>
          </div>
          {/* Sidebar Footer: System Status Pill */}
          <div className="p-3 border-t border-border-sage-mist shrink-0">
            <div className="bg-herb-white p-2.5 rounded-lg border border-border-sage-mist flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-sprout opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success-sprout"></span>
                </span>
                <span className="nav-text text-xs text-text-stem-gray font-medium truncate">
                  LLM & Vector API Online
                </span>
              </div>
              <span className="nav-badge text-[10px] text-primary-moss font-bold bg-moss-subtle border border-border-sage-mist px-1.5 py-0.5 rounded-lg">
                v2.4
              </span>
            </div>
          </div>
        </aside>
        {/* ========================================================================= */}
        {/* 2. MAIN CONTENT WRAPPER WITH STICKY HEADER */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-herb-white">
          {/* TOP STICKY HEADER (NAVBAR) - surface-paper, 1px solid border-sage-mist */}
          <header className="sticky top-0 z-20 bg-surface-paper border-b border-border-sage-mist h-16 flex items-center justify-between px-4 sm:px-6 shrink-0">
            {/* Left: Mobile Menu Toggle & Global Search Bar */}
            <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
              {/* Hamburger Button (Mobile) */}
              <button className="lg:hidden p-2 rounded-lg text-text-stem-gray hover:text-text-charcoal hover:bg-herb-white transition-colors border border-transparent hover:border-border-sage-mist" title="Open Navigation Menu">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                </svg>
              </button>
              {/* Global Search Input */}
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-stem-gray">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                  </svg>
                </div>
                <input className="w-full pl-10 pr-4 py-2 text-sm bg-herb-white border border-border-sage-mist rounded-lg focus:bg-surface-paper focus:border-primary-moss focus:ring-1 focus:ring-primary-moss outline-none transition-all placeholder-text-stem-gray text-text-charcoal" placeholder="Search members, recipes, categories, or AI logs... (Press '/' to focus)" type="text" />
                <div className="hidden sm:flex absolute inset-y-0 right-0 pr-2.5 items-center pointer-events-none">
                  <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-text-stem-gray bg-surface-paper border border-border-sage-mist rounded-lg">
                    /
                  </kbd>
                </div>
              </div>
            </div>
            {/* Right: Actions, Notifications & Admin Profile Dropdown */}
            <div className="flex items-center gap-2 sm:gap-3 ml-4">
              {/* Quick Shortcut to Public Platform */}
              <Link className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-moss bg-moss-subtle border border-border-sage-mist hover:bg-primary-moss hover:text-white rounded-lg transition-colors" to="/home" title="View Public Platform">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                </svg>
                <span>
                  Live Site
                </span>
              </Link>
              {/* Notification Bell with Indicator Badge */}
              <div className="relative">
                <button className="relative p-2 rounded-lg text-text-stem-gray hover:text-text-charcoal hover:bg-herb-white transition-colors border border-transparent hover:border-border-sage-mist" id="notificationBtn" title="Notifications">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                  </svg>
                  {/* Indicator Badge */}
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error-chili opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-error-chili border-2 border-surface-paper"></span>
                  </span>
                </button>
                {/* Notifications Dropdown Flyout */}
                <div className="hidden absolute right-0 mt-2 w-80 bg-surface-paper rounded-xl border border-border-sage-mist py-2 z-50 shadow-none" id="notificationMenu">
                  <div className="px-4 py-2 border-b border-border-sage-mist flex items-center justify-between">
                    <span className="text-xs font-bold font-serif text-text-charcoal">
                      Notifications
                    </span>
                    <span className="text-[10px] font-semibold text-primary-moss bg-moss-subtle border border-border-sage-mist px-2 py-0.5 rounded-lg">
                      3 unread
                    </span>
                  </div>
                  <div className="divide-y divide-border-sage-mist max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-herb-white cursor-pointer transition-colors">
                      <p className="text-xs font-semibold text-text-charcoal">
                        5 recipes queued for AI inspection
                      </p>
                      <p className="text-[11px] text-text-stem-gray mt-0.5">
                        Vegetable broth moderation rule triggered
                      </p>
                      <span className="text-[10px] text-text-stem-gray mt-1 block">
                        5 mins ago
                      </span>
                    </div>
                    <div className="px-4 py-3 hover:bg-herb-white cursor-pointer transition-colors">
                      <p className="text-xs font-semibold text-text-charcoal">
                        New chef member registered
                      </p>
                      <p className="text-[11px] text-text-stem-gray mt-0.5">
                        Chef Nguyen applied for verified creator
                      </p>
                      <span className="text-[10px] text-text-stem-gray mt-1 block">
                        35 mins ago
                      </span>
                    </div>
                  </div>
                  <div className="p-2 border-t border-border-sage-mist text-center">
                    <a className="text-xs text-primary-moss hover:underline font-medium" href="#all-notifications">
                      View all notifications
                    </a>
                  </div>
                </div>
              </div>
              {/* Vertical Divider */}
              <div className="h-6 w-px bg-border-sage-mist"></div>
              {/* Admin Profile Section with Dropdown */}
              <div className="relative">
                <button className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-herb-white transition-colors border border-transparent hover:border-border-sage-mist" id="profileBtn">
                  <div className="w-8 h-8 rounded-full bg-primary-moss text-white flex items-center justify-center font-bold text-xs border border-border-sage-mist">
                    AD
                  </div>
                  <div className="hidden sm:block text-left leading-tight">
                    <p className="text-xs font-semibold text-text-charcoal">
                      Administrator
                    </p>
                    <p className="text-[10px] text-text-stem-gray">
                      Super Admin
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-text-stem-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                  </svg>
                </button>
                {/* Admin Dropdown Menu */}
                <div className="hidden absolute right-0 mt-2 w-52 bg-surface-paper rounded-xl border border-border-sage-mist py-1.5 z-50 shadow-none" id="profileMenu">
                  <div className="px-4 py-2 border-b border-border-sage-mist sm:hidden">
                    <p className="text-xs font-semibold text-text-charcoal">
                      Administrator
                    </p>
                    <p className="text-[10px] text-text-stem-gray">
                      admin@bepchay.vn
                    </p>
                  </div>
                  <a className="flex items-center gap-2.5 px-4 py-2 text-xs text-text-charcoal hover:bg-herb-white hover:text-primary-moss transition-colors" href="#admin-settings">
                    <svg className="w-4 h-4 text-text-stem-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                    </svg>
                    <span>
                      Admin Profile
                    </span>
                  </a>
                  <a className="flex items-center gap-2.5 px-4 py-2 text-xs text-text-charcoal hover:bg-herb-white hover:text-primary-moss transition-colors" href="#security">
                    <svg className="w-4 h-4 text-text-stem-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                    </svg>
                    <span>
                      Security & Keys
                    </span>
                  </a>
                  <div className="h-px bg-border-sage-mist my-1"></div>
                  <Link className="flex items-center gap-2.5 px-4 py-2 text-xs text-error-chili hover:bg-[#ffdad6]/40 transition-colors" to="/">
                    <svg className="w-4 h-4 text-error-chili" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                    </svg>
                    <span>
                      Log Out
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </header>
          {/* ========================================================================= */}
          {/* 3. MAIN CONTENT AREA (Cleanly padded and aligned) */}
          {/* ========================================================================= */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto h-full flex flex-col pb-12">
              {/* 1. Breadcrumb and Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-text-stem-gray">
                  <span>
                    Admin Console
                  </span>
                  <span>
                    /
                  </span>
                  <span>
                    Overview
                  </span>
                  <span>
                    /
                  </span>
                  <span className="text-primary-moss font-semibold">
                    Dashboard (Home)
                  </span>
                </nav>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-stem-gray hidden sm:inline">
                    Current Environment:
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-moss-subtle text-primary-moss border border-border-sage-mist">
                    <span className="w-1.5 h-1.5 rounded-full bg-success-sprout"></span>
                    Production
                  </span>
                </div>
              </div>
              {/* Main Dashboard Sections with 32px to 48px vertical spacing */}
              <div className="space-y-8 pb-12">
                {/* Component 1: Welcome Hero Banner with Signature Asymmetric Corners */}
                <div className="bg-surface-paper border border-border-sage-mist rounded-tl-[32px] rounded-tr-lg rounded-b-lg p-6 sm:p-8 shadow-none flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-moss-subtle text-primary-moss border border-border-sage-mist text-xs font-medium mb-3">
                      <span className="w-2 h-2 rounded-full bg-success-sprout animate-ping"></span>
                      <span>
                        Today, Oct 24, 2024 · All 6 Microservices Operational
                      </span>
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl text-text-charcoal font-normal tracking-tight">
                      Welcome back, Administrator
                    </h2>
                    <p className="text-sm text-text-stem-gray mt-2 leading-relaxed">
                      Here is what happened across Botanical Hearth today. Community recipe engagement is up 18% and AI services are operating at 99.96% uptime.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <Link className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#FCE8E6] bg-[#FCE8E6]/20 hover:bg-[#FCE8E6] text-error-chili text-xs sm:text-sm font-medium transition-colors shadow-none cursor-pointer" to="/admin/ai-moderation">
                      <svg className="w-4 h-4 text-error-chili" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                      </svg>
                      <span>
                        Review Flagged Items (5)
                      </span>
                    </Link>
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-moss hover:bg-primary-moss-hover text-white text-xs sm:text-sm font-medium transition-colors shadow-none cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                      </svg>
                      <span>
                        Platform Settings
                      </span>
                    </button>
                  </div>
                </div>
                {/* Component 2: Quick Stats Grid (4 columns, gap-6, 1px border-sage-mist, shadow-none) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Stat Card 1: Total Members */}
                  <div className="bg-surface-paper rounded-xl border border-border-sage-mist p-5 flex flex-col justify-between shadow-none transition-colors hover:border-primary-moss/40">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold text-text-stem-gray uppercase tracking-wider">
                          Total Members
                        </p>
                        <h4 className="text-3xl font-bold text-text-charcoal mt-2 tracking-tight">
                          14,820
                        </h4>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-moss-subtle flex items-center justify-center text-primary-moss border border-border-sage-mist shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border-sage-mist flex items-center gap-1.5 text-xs font-medium text-success-sprout">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                      </svg>
                      <span>
                        +124 this week
                      </span>
                    </div>
                  </div>
                  {/* Stat Card 2: Published Content */}
                  <div className="bg-surface-paper rounded-xl border border-border-sage-mist p-5 flex flex-col justify-between shadow-none transition-colors hover:border-primary-moss/40">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold text-text-stem-gray uppercase tracking-wider">
                          Published Content
                        </p>
                        <h4 className="text-3xl font-bold text-text-charcoal mt-2 tracking-tight">
                          3,450
                        </h4>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-moss-subtle flex items-center justify-center text-primary-moss border border-border-sage-mist shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border-sage-mist text-xs text-text-stem-gray font-medium">
                      <span>
                        2,890 recipes · 560 videos
                      </span>
                    </div>
                  </div>
                  {/* Stat Card 3: Pending AI Reviews */}
                  <div className="bg-surface-paper rounded-xl border border-border-sage-mist p-5 flex flex-col justify-between shadow-none transition-colors hover:border-error-chili/40">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-text-stem-gray uppercase tracking-wider">
                            Pending AI Reviews
                          </p>
                        </div>
                        <h4 className="text-3xl font-bold text-[#A63446] mt-2 tracking-tight">
                          5
                        </h4>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[#FCE8E6] flex items-center justify-center text-[#A63446] border border-[#FCE8E6] shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border-sage-mist flex items-center justify-between text-xs">
                      <span className="text-error-chili font-medium">
                        3 spam · 2 medical claims
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#FCE8E6] text-error-chili">
                        Action required
                      </span>
                    </div>
                  </div>
                  {/* Stat Card 4: AI System Status */}
                  <div className="bg-surface-paper rounded-xl border border-border-sage-mist p-5 flex flex-col justify-between shadow-none transition-colors hover:border-primary-moss/40">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold text-text-stem-gray uppercase tracking-wider">
                          AI System Status
                        </p>
                        <h4 className="text-3xl font-bold text-success-sprout mt-2 tracking-tight">
                          99.96%
                        </h4>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[#EDF7EE] flex items-center justify-center text-success-sprout border border-border-sage-mist shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border-sage-mist flex items-center gap-1.5 text-xs text-text-stem-gray font-medium">
                      <span className="w-2 h-2 rounded-full bg-success-sprout shrink-0"></span>
                      <span>
                        Avg Latency: 42ms · Gemini 1.5 Pro
                      </span>
                    </div>
                  </div>
                </div>
                {/* Component 3: Bottom Section (2/3 left Activity Log, 1/3 right Action Center, gap-6) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Recent Activity & Platform Audit (2/3 width) */}
                  <div className="lg:col-span-2 bg-surface-paper rounded-xl border border-border-sage-mist p-6 shadow-none flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-4 border-b border-border-sage-mist">
                        <div>
                          <h3 className="font-serif text-xl text-text-charcoal font-bold tracking-tight">
                            Recent Activity & Platform Audit
                          </h3>
                          <p className="text-xs text-text-stem-gray mt-0.5">
                            Chronological event feed from AI agents, contributors, and moderators.
                          </p>
                        </div>
                        <a className="text-xs font-semibold text-primary-moss hover:underline inline-flex items-center gap-1" href="#audit-log">
                          <span>
                            View Full Audit Log
                          </span>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                          </svg>
                        </a>
                      </div>
                      {/* Activity List Items with 1px border-sage-mist dividers */}
                      <div className="divide-y divide-border-sage-mist">
                        {/* Item 1 */}
                        <div className="py-3.5 flex items-start gap-3.5 hover:bg-herb-white/50 px-2 rounded-lg transition-colors">
                          <div className="w-8 h-8 rounded-full bg-primary-moss text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            CD
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-text-charcoal leading-snug">
                              <strong className="font-semibold text-text-charcoal">
                                Chef Duy
                              </strong>
                              published a new video recipe
                              <span className="font-medium text-primary-moss">
                                'Claypot Lemongrass Braised Tofu'
                              </span>
                              <span className="text-xs text-text-stem-gray">
                                (Auto-summarized: 8 chapters)
                              </span>
                            </p>
                            <span className="text-[11px] text-text-stem-gray mt-1 block">
                              12m ago • Recipe Pipeline
                            </span>
                          </div>
                        </div>
                        {/* Item 2 */}
                        <div className="py-3.5 flex items-start gap-3.5 hover:bg-herb-white/50 px-2 rounded-lg transition-colors">
                          <div className="w-8 h-8 rounded-full bg-[#FCE8E6] text-error-chili flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-[#FCE8E6]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-text-charcoal leading-snug">
                              <strong className="font-semibold text-error-chili">
                                Moderation Bot
                              </strong>
                              auto-flagged comment by user
                              <span className="font-mono text-xs text-text-charcoal font-medium bg-herb-white px-1.5 py-0.5 rounded border border-border-sage-mist">
                                @crypto_yields_fast
                              </span>
                              for spam promotion
                            </p>
                            <span className="text-[11px] text-text-stem-gray mt-1 block">
                              24m ago • Community Guard
                            </span>
                          </div>
                        </div>
                        {/* Item 3 */}
                        <div className="py-3.5 flex items-start gap-3.5 hover:bg-herb-white/50 px-2 rounded-lg transition-colors">
                          <div className="w-8 h-8 rounded-full bg-[#A63446] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            LN
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-text-charcoal leading-snug">
                              <strong className="font-semibold text-text-charcoal">
                                Admin Linh Nguyen
                              </strong>
                              approved member role upgrade for
                              <span className="font-medium text-text-charcoal">
                                'Thu Ha'
                              </span>
                              to
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10.5px] font-semibold bg-moss-subtle text-primary-moss">
                                Verified Culinary Creator
                              </span>
                            </p>
                            <span className="text-[11px] text-text-stem-gray mt-1 block">
                              48m ago • Role Governance
                            </span>
                          </div>
                        </div>
                        {/* Item 4 */}
                        <div className="py-3.5 flex items-start gap-3.5 hover:bg-herb-white/50 px-2 rounded-lg transition-colors">
                          <div className="w-8 h-8 rounded-full bg-[#436746] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            SC
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-text-charcoal leading-snug">
                              <strong className="font-semibold text-text-charcoal">
                                System Cron
                              </strong>
                              triggered weekly menu macro rebalance batch
                              <span className="text-xs text-text-stem-gray">
                                (1,420 meal plans generated)
                              </span>
                            </p>
                            <span className="text-[11px] text-text-stem-gray mt-1 block">
                              1h ago • Nutrition Engine
                            </span>
                          </div>
                        </div>
                        {/* Item 5 */}
                        <div className="py-3.5 flex items-start gap-3.5 hover:bg-herb-white/50 px-2 rounded-lg transition-colors">
                          <div className="w-8 h-8 rounded-full bg-text-stem-gray text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            MT
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-text-charcoal leading-snug">
                              <strong className="font-semibold text-text-charcoal">
                                Member Mai Tran
                              </strong>
                              registered an account via Google OAuth
                            </p>
                            <span className="text-[11px] text-text-stem-gray mt-1 block">
                              2h ago • User Directory
                            </span>
                          </div>
                        </div>
                        {/* Item 6 */}
                        <div className="py-3.5 flex items-start gap-3.5 hover:bg-herb-white/50 px-2 rounded-lg transition-colors">
                          <div className="w-8 h-8 rounded-full bg-primary-moss text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            AD
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-text-charcoal leading-snug">
                              <strong className="font-semibold text-text-charcoal">
                                Admin Administrator
                              </strong>
                              updated AI Meal Planner token ceiling to
                              <span className="font-mono text-xs text-primary-moss font-semibold">
                                2,048 tokens
                              </span>
                            </p>
                            <span className="text-[11px] text-text-stem-gray mt-1 block">
                              3h ago • MLOps Config
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Right Column: Action Center & Operational Alerts (1/3 width) */}
                  <div className="bg-surface-paper rounded-xl border border-border-sage-mist p-6 shadow-none flex flex-col justify-between space-y-6">
                    <div>
                      <div className="flex items-center justify-between pb-4 border-b border-border-sage-mist">
                        <h3 className="font-serif text-xl text-text-charcoal font-bold tracking-tight">
                          Action Center
                        </h3>
                        <span className="text-[11px] font-semibold bg-[#FCE8E6] text-error-chili border border-border-sage-mist px-2 py-0.5 rounded-lg">
                          3 Need Attention
                        </span>
                      </div>
                      {/* Alert Items list with clear borders and callouts */}
                      <div className="space-y-3 mt-4">
                        {/* Alert Item 1 */}
                        <div className="p-3.5 rounded-lg border border-border-sage-mist bg-herb-white flex flex-col gap-1.5 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-text-charcoal flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-error-chili"></span>
                              3 Video Summaries Failed
                            </span>
                            <Link className="text-xs font-semibold text-primary-moss hover:underline" to="/admin/video-summarization">
                              Retry Jobs
                            </Link>
                          </div>
                          <p className="text-[11px] text-text-stem-gray leading-snug">
                            Audio transcript timeout in Whisper pipeline during speech extraction.
                          </p>
                        </div>
                        {/* Alert Item 2 */}
                        <div className="p-3.5 rounded-lg border border-[#FCE8E6] bg-[#FCE8E6]/20 flex flex-col gap-1.5 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#A63446] flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#A63446]"></span>
                              5 Flagged Posts in Queue
                            </span>
                            <Link className="text-xs font-semibold text-[#A63446] hover:underline" to="/admin/ai-moderation">
                              Review Queue
                            </Link>
                          </div>
                          <p className="text-[11px] text-text-stem-gray leading-snug">
                            Pending review from AI moderation filters for medical claims & solicitation.
                          </p>
                        </div>
                        {/* Alert Item 3 */}
                        <div className="p-3.5 rounded-lg border border-border-sage-mist bg-herb-white flex flex-col gap-1.5 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#B8791A] flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#B8791A]"></span>
                              Vector Store Memory Limit
                            </span>
                            <Link className="text-xs font-semibold text-primary-moss hover:underline" to="/admin/ai-monitoring">
                              Optimize Index
                            </Link>
                          </div>
                          <p className="text-[11px] text-text-stem-gray leading-snug">
                            Approaching 85% cache capacity threshold on ChromaDB instance.
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Quick System Shortcuts Box at bottom of Action Center */}
                    <div className="pt-4 border-t border-border-sage-mist">
                      <p className="text-[11px] font-semibold text-text-stem-gray uppercase tracking-wider mb-2.5">
                        Quick System Shortcuts
                      </p>
                      <div className="space-y-1.5">
                        <Link className="flex items-center justify-between px-3 py-2 rounded-lg border border-border-sage-mist text-xs font-medium text-text-charcoal hover:bg-herb-white hover:text-primary-moss transition-colors group" to="/admin/ai-monitoring">
                          <div className="flex items-center gap-2.5">
                            <svg className="w-4 h-4 text-text-stem-gray group-hover:text-primary-moss shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                            </svg>
                            <span>
                              AI Model Monitoring
                            </span>
                          </div>
                          <svg className="w-3.5 h-3.5 text-text-stem-gray group-hover:text-primary-moss" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                          </svg>
                        </Link>
                        <Link className="flex items-center justify-between px-3 py-2 rounded-lg border border-border-sage-mist text-xs font-medium text-text-charcoal hover:bg-herb-white hover:text-primary-moss transition-colors group" to="/admin/meal-planner-config">
                          <div className="flex items-center gap-2.5">
                            <svg className="w-4 h-4 text-text-stem-gray group-hover:text-primary-moss shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                            </svg>
                            <span>
                              Meal Planner Config
                            </span>
                          </div>
                          <svg className="w-3.5 h-3.5 text-text-stem-gray group-hover:text-primary-moss" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                          </svg>
                        </Link>
                        <Link className="flex items-center justify-between px-3 py-2 rounded-lg border border-border-sage-mist text-xs font-medium text-text-charcoal hover:bg-herb-white hover:text-primary-moss transition-colors group" to="/admin/video-summarization">
                          <div className="flex items-center gap-2.5">
                            <svg className="w-4 h-4 text-text-stem-gray group-hover:text-primary-moss shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                            </svg>
                            <span>
                              Video Summarization Queue
                            </span>
                          </div>
                          <svg className="w-3.5 h-3.5 text-text-stem-gray group-hover:text-primary-moss" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Page Footer */}
              <footer className="mt-6 text-center sm:text-left text-xs text-text-stem-gray flex flex-col sm:flex-row items-center justify-between gap-2">
                <span>
                  © 2025 Botanical Hearth • Vegan Cooking & Nutrition Platform
                </span>
                <div className="flex items-center gap-4">
                  <a className="hover:text-primary-moss transition-colors" href="#docs">
                    Admin Guidelines
                  </a>
                  <a className="hover:text-primary-moss transition-colors" href="#api">
                    MLOps Status
                  </a>
                  <a className="hover:text-primary-moss transition-colors" href="#support">
                    Tech Support
                  </a>
                </div>
              </footer>
            </div>
          </main>
        </div>
      </div>
      {/* Technical JavaScript: Sidebar, Accordions & Dropdown Controls */}
      {/* TODO: script goc da bi loai bo, can port lai logic bang useState/useEffect */}
    </>
  );
}

export default AdminDashboardHomeOverview;
