import { Link } from 'react-router-dom'

function AdminVideoSummarizationQueue() {
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
                <Link className="nav-link flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium text-text-charcoal hover:bg-herb-white hover:text-primary-moss transition-colors group" to="/admin">
                  <svg className="w-4 h-4 text-text-stem-gray group-hover:text-primary-moss shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                  </svg>
                  <span className="nav-text truncate">
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
                <Link className="nav-link flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-medium text-white bg-primary-moss hover:bg-primary-moss-hover transition-all" to="/admin/video-summarization">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                    </svg>
                    <span className="nav-text truncate font-semibold">
                      Video Summarize Jobs
                    </span>
                  </div>
                  <span className="nav-badge text-[11px] font-semibold bg-[#c4edc3] text-[#0f2a0b] border border-border-sage-mist px-2 py-0.5 rounded-lg">
                    Active
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
              {/* 1. Breadcrumb and Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-text-stem-gray">
                  <span>
                    Admin Console
                  </span>
                  <span>
                    /
                  </span>
                  <span>
                    AI operations & MLOps
                  </span>
                  <span>
                    /
                  </span>
                  <span className="text-primary-moss font-semibold">
                    Video Summarization Queue
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
              <div className="space-y-4 pb-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-3xl md:text-4xl text-text-charcoal font-normal tracking-tight">
                      Video Summarization Queue
                    </h2>
                    <p className="text-sm text-text-stem-gray mt-1.5">
                      Monitor, retry, and manage automated AI video transcription and chapter extraction jobs.
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border-sage-mist bg-surface-paper text-text-charcoal text-xs sm:text-sm font-medium hover:bg-herb-white transition-colors shadow-none cursor-pointer">
                      <svg className="w-4 h-4 text-text-stem-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                      </svg>
                      <span>
                        Refresh Queue
                      </span>
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-moss hover:bg-primary-moss-hover text-white text-xs sm:text-sm font-medium transition-colors shadow-none cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4v16m8-8H4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                      </svg>
                      <span>
                        Trigger Manual Batch
                      </span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                  <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-stem-gray">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                      </svg>
                    </div>
                    <input className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-surface-paper border border-border-sage-mist rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-moss focus:border-primary-moss placeholder-text-stem-gray text-text-charcoal" placeholder="Search by video title, ID, or submitter..." type="text" />
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-moss text-white transition-colors">
                      All (24)
                    </button>
                    <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-stem-gray hover:text-text-charcoal bg-surface-paper border border-border-sage-mist hover:bg-herb-white transition-colors">
                      Processing (2)
                    </button>
                    <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-stem-gray hover:text-text-charcoal bg-surface-paper border border-border-sage-mist hover:bg-herb-white transition-colors">
                      Completed (19)
                    </button>
                    <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-stem-gray hover:text-text-charcoal bg-surface-paper border border-border-sage-mist hover:bg-herb-white transition-colors">
                      Failed (3)
                    </button>
                  </div>
                </div>
              </div>
              {/* 2. Configuration Form Card */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-surface-paper rounded-xl border border-border-sage-mist p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-text-stem-gray font-medium">
                        Active Processing
                      </p>
                      <h4 className="text-2xl font-bold font-serif text-text-charcoal mt-1">
                        2
                        <span className="text-xs font-normal text-text-stem-gray font-sans">
                          jobs
                        </span>
                      </h4>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-[#FAF2DC] flex items-center justify-center text-[#B8791A]">
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="bg-surface-paper rounded-xl border border-border-sage-mist p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-text-stem-gray font-medium">
                        Completed Today
                      </p>
                      <h4 className="text-2xl font-bold font-serif text-text-charcoal mt-1">
                        48
                        <span className="text-xs font-normal text-text-stem-gray font-sans">
                          videos
                        </span>
                      </h4>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-[#EDF7EE] flex items-center justify-center text-success-sprout">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="bg-surface-paper rounded-xl border border-border-sage-mist p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-text-stem-gray font-medium">
                        Failed / Alerts
                      </p>
                      <h4 className="text-2xl font-bold font-serif text-error-chili mt-1">
                        3
                        <span className="text-xs font-normal text-text-stem-gray font-sans">
                          needs retry
                        </span>
                      </h4>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-[#FCE8E6] flex items-center justify-center text-error-chili">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="bg-surface-paper rounded-xl border border-border-sage-mist p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-text-stem-gray font-medium">
                        Avg. Transcribe Time
                      </p>
                      <h4 className="text-2xl font-bold font-serif text-text-charcoal mt-1">
                        1m 42s
                      </h4>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-moss-subtle flex items-center justify-center text-primary-moss">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-paper rounded-[12px] border border-border-sage-mist p-6 shadow-none flex flex-col">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-border-sage-mist text-[11px] font-semibold text-text-stem-gray uppercase tracking-wider">
                          <th className="pb-3 pl-2 pr-4">
                            Video ID & Title
                          </th>
                          <th className="pb-3 px-4">
                            Submitter
                          </th>
                          <th className="pb-3 px-4">
                            Duration & Chapters
                          </th>
                          <th className="pb-3 px-4">
                            Status
                          </th>
                          <th className="pb-3 pl-4 pr-2 text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-sage-mist">
                        <tr className="hover:bg-herb-white/50 transition-colors">
                          <td className="py-4 pl-2 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-20 h-12 bg-herb-white rounded-lg border border-border-sage-mist shrink-0 flex items-center justify-center overflow-hidden">
                                <svg className="w-5 h-5 text-text-stem-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                </svg>
                                <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/70 text-white text-[9px] rounded font-mono">
                                  12:34
                                </span>
                              </div>
                              <div className="space-y-0.5 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs text-primary-moss font-medium">
                                    VID-9821
                                  </span>
                                  <span className="text-[10px] text-text-stem-gray">
                                    • 1080p MP4
                                  </span>
                                </div>
                                <p className="text-sm font-semibold text-text-charcoal truncate max-w-xs">
                                  Charred Ginger Vegan Phở Broth
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-primary-moss text-white flex items-center justify-center text-[10px] font-bold">
                                CD
                              </div>
                              <div className="leading-tight">
                                <p className="text-xs font-semibold text-text-charcoal">
                                  Chef Duy
                                </p>
                                <p className="text-[11px] text-text-stem-gray">
                                  Head Culinary Lead • 8m ago
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-xs text-text-charcoal font-medium">
                              12:34
                            </div>
                            <div className="text-[11px] text-text-stem-gray">
                              8 chapters detected
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#EDF7EE] text-success-sprout">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                              </svg>
                              Completed
                            </span>
                          </td>
                          <td className="py-4 pl-4 pr-2 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border-sage-mist text-primary-moss hover:bg-herb-white text-xs font-medium transition-colors cursor-pointer">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                </svg>
                                Edit Summary
                              </button>
                              <button className="p-1.5 text-text-stem-gray hover:text-text-charcoal rounded-lg hover:bg-herb-white transition-colors" title="View JSON Payload">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-herb-white/50 transition-colors">
                          <td className="py-4 pl-2 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-20 h-12 bg-herb-white rounded-lg border border-border-sage-mist shrink-0 flex items-center justify-center overflow-hidden">
                                <svg className="w-5 h-5 text-text-stem-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                </svg>
                                <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/70 text-white text-[9px] rounded font-mono">
                                  08:45
                                </span>
                              </div>
                              <div className="space-y-0.5 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs text-primary-moss font-medium">
                                    VID-9822
                                  </span>
                                  <span className="text-[10px] text-text-stem-gray">
                                    • 4K ProRes
                                  </span>
                                </div>
                                <p className="text-sm font-semibold text-text-charcoal truncate max-w-xs">
                                  Claypot Braised King Oyster Mushrooms
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-[#A63446] text-white flex items-center justify-center text-[10px] font-bold">
                                LN
                              </div>
                              <div className="leading-tight">
                                <p className="text-xs font-semibold text-text-charcoal">
                                  Linh Nguyen
                                </p>
                                <p className="text-[11px] text-text-stem-gray">
                                  Recipe Contributor • 24m ago
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-xs text-text-charcoal font-medium">
                              08:45
                            </div>
                            <div className="text-[11px] text-text-stem-gray">
                              5 chapters detected
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#EDF7EE] text-success-sprout">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                              </svg>
                              Completed
                            </span>
                          </td>
                          <td className="py-4 pl-4 pr-2 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border-sage-mist text-primary-moss hover:bg-herb-white text-xs font-medium transition-colors cursor-pointer">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                </svg>
                                Edit Summary
                              </button>
                              <button className="p-1.5 text-text-stem-gray hover:text-text-charcoal rounded-lg hover:bg-herb-white transition-colors" title="View JSON Payload">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-herb-white/50 transition-colors bg-[#FAF2DC]/20">
                          <td className="py-4 pl-2 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-20 h-12 bg-herb-white rounded-lg border border-border-sage-mist shrink-0 flex items-center justify-center overflow-hidden">
                                <svg className="w-5 h-5 text-warning-turmeric-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                </svg>
                                <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/70 text-white text-[9px] rounded font-mono">
                                  18:10
                                </span>
                              </div>
                              <div className="space-y-0.5 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs text-primary-moss font-medium">
                                    VID-9823
                                  </span>
                                  <span className="text-[10px] text-text-stem-gray">
                                    • Audio track extraction
                                  </span>
                                </div>
                                <p className="text-sm font-semibold text-text-charcoal truncate max-w-xs">
                                  Crispy Golden Lemongrass Tofu
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-[#436746] text-white flex items-center justify-center text-[10px] font-bold">
                                SC
                              </div>
                              <div className="leading-tight">
                                <p className="text-xs font-semibold text-text-charcoal">
                                  System Cron
                                </p>
                                <p className="text-[11px] text-text-stem-gray">
                                  Automated Webhook • Just now
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-xs text-text-charcoal font-medium">
                              18:10
                            </div>
                            <div className="text-[11px] text-[#B8791A] font-medium">
                              Transcribing audio (64%)
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-1.5 w-40">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="inline-flex items-center gap-1 font-medium text-[#B8791A]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8791A] animate-ping"></span>
                                  Processing
                                </span>
                                <span className="text-text-stem-gray font-mono">
                                  64%
                                </span>
                              </div>
                              <div className="w-full bg-border-sage-mist rounded-full h-1.5 overflow-hidden">
                                <div className="bg-warning-turmeric-deep h-1.5 rounded-full transition-all duration-300" style={{ width: '64%' }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 pl-4 pr-2 text-right">
                            <button className="px-2.5 py-1 text-xs text-error-chili hover:bg-[#FCE8E6] rounded-lg border border-transparent hover:border-border-sage-mist transition-colors">
                              Cancel
                            </button>
                          </td>
                        </tr>
                        <tr className="hover:bg-herb-white/50 transition-colors bg-[#FCE8E6]/20">
                          <td className="py-4 pl-2 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-20 h-12 bg-herb-white rounded-lg border border-[#FCE8E6] shrink-0 flex items-center justify-center overflow-hidden">
                                <svg className="w-5 h-5 text-error-chili" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                </svg>
                                <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/70 text-white text-[9px] rounded font-mono">
                                  15:20
                                </span>
                              </div>
                              <div className="space-y-0.5 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs text-error-chili font-medium">
                                    VID-9824
                                  </span>
                                  <span className="text-[10px] text-error-chili font-medium">
                                    Failed step: Whisper-v3
                                  </span>
                                </div>
                                <p className="text-sm font-semibold text-text-charcoal truncate max-w-xs">
                                  Lotus Root & Goji Herbal Broth
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-text-stem-gray text-white flex items-center justify-center text-[10px] font-bold">
                                QA
                              </div>
                              <div className="leading-tight">
                                <p className="text-xs font-semibold text-text-charcoal">
                                  Quyen Anh
                                </p>
                                <p className="text-[11px] text-text-stem-gray">
                                  Staff Nutritionist • 1h ago
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-xs text-text-charcoal font-medium">
                              15:20
                            </div>
                            <div className="text-[11px] text-error-chili">
                              0 chapters generated
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#FCE8E6] text-error-chili">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                </svg>
                                Failed
                              </span>
                              <p className="text-[10.5px] text-text-stem-gray" title="Audio transcript timeout > 120s">
                                Audio transcript timeout &gt; 120s
                              </p>
                            </div>
                          </td>
                          <td className="py-4 pl-4 pr-2 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border-sage-mist text-text-charcoal hover:text-primary-moss hover:bg-herb-white text-xs font-medium transition-colors cursor-pointer" title="Retry Job">
                                <svg className="w-3.5 h-3.5 text-text-stem-gray hover:text-primary-moss" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                </svg>
                                Retry
                              </button>
                              <button className="p-1.5 text-text-stem-gray hover:text-error-chili rounded-lg hover:bg-herb-white transition-colors" title="Inspect Log Dump">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-herb-white/50 transition-colors">
                          <td className="py-4 pl-2 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-20 h-12 bg-herb-white rounded-lg border border-border-sage-mist shrink-0 flex items-center justify-center overflow-hidden">
                                <svg className="w-5 h-5 text-text-stem-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                </svg>
                                <span className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/70 text-white text-[9px] rounded font-mono">
                                  10:15
                                </span>
                              </div>
                              <div className="space-y-0.5 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs text-primary-moss font-medium">
                                    VID-9825
                                  </span>
                                  <span className="text-[10px] text-text-stem-gray">
                                    • 1080p MP4
                                  </span>
                                </div>
                                <p className="text-sm font-semibold text-text-charcoal truncate max-w-xs">
                                  Fermented Tempeh & Coconut Glaze
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-primary-moss text-white flex items-center justify-center text-[10px] font-bold">
                                CD
                              </div>
                              <div className="leading-tight">
                                <p className="text-xs font-semibold text-text-charcoal">
                                  Chef Duy
                                </p>
                                <p className="text-[11px] text-text-stem-gray">
                                  Head Culinary Lead • 2h ago
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-xs text-text-charcoal font-medium">
                              10:15
                            </div>
                            <div className="text-[11px] text-text-stem-gray">
                              7 chapters detected
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-[#EDF7EE] text-success-sprout">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                              </svg>
                              Completed
                            </span>
                          </td>
                          <td className="py-4 pl-4 pr-2 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border-sage-mist text-primary-moss hover:bg-herb-white text-xs font-medium transition-colors cursor-pointer">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                </svg>
                                Edit Summary
                              </button>
                              <button className="p-1.5 text-text-stem-gray hover:text-text-charcoal rounded-lg hover:bg-herb-white transition-colors" title="View JSON Payload">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="pt-4 mt-2 border-t border-border-sage-mist flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-text-stem-gray">
                      Showing
                      <strong className="text-text-charcoal font-semibold">
                        1 to 5
                      </strong>
                      of
                      <strong className="text-text-charcoal font-semibold">
                        24
                      </strong>
                      jobs
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button className="px-2.5 py-1 rounded-lg border border-border-sage-mist text-xs text-text-stem-gray hover:bg-herb-white disabled:opacity-50 transition-colors" disabled>
                        Previous
                      </button>
                      <button className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-moss text-white transition-colors">
                        1
                      </button>
                      <button className="px-2.5 py-1 rounded-lg border border-border-sage-mist text-xs text-text-charcoal hover:bg-herb-white transition-colors">
                        2
                      </button>
                      <button className="px-2.5 py-1 rounded-lg border border-border-sage-mist text-xs text-text-charcoal hover:bg-herb-white transition-colors">
                        3
                      </button>
                      <button className="px-2.5 py-1 rounded-lg border border-border-sage-mist text-xs text-text-charcoal hover:bg-herb-white transition-colors">
                        Next
                      </button>
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

export default AdminVideoSummarizationQueue;
