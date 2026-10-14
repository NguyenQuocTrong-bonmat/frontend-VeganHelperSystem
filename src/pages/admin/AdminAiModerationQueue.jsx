import { Link } from 'react-router-dom'

function AdminAiModerationQueue() {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div className="fixed inset-0 bg-black/40 z-40 lg:hidden hidden transition-opacity duration-300 backdrop-blur-sm" id="mobileBackdrop"></div>
      {/* Outer Dashboard Flex Frame */}
      <div className="flex-1 flex h-screen w-screen overflow-hidden">
        {/* ========================================================================= */}
        {/* 1. LEFT SIDEBAR (NAVIGATION) */}
        {/* ========================================================================= */}
        <aside className="w-72 bg-[#FDFBF6] border-r border-[#DCE3D5] flex flex-col z-50 fixed lg:static inset-y-0 left-0 transform -translate-x-full lg:translate-x-0 select-none" id="sidebar">
          {/* Platform Branding & Logo */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-[#DCE3D5] shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-[#2F5233] flex items-center justify-center text-white shrink-0 border border-[#DCE3D5]">
                {/* Organic Leaf / Sprout Icon */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                </svg>
              </div>
              <div className="logo-text leading-tight truncate">
                <h1 className="font-['Libre_Caslon_Text',serif] font-bold text-lg text-[#2F5233] tracking-tight truncate">
                  Vegan Helper
                </h1>
                <p className="text-[11px] font-semibold text-[#4C8C4A] tracking-wider">
                  Vegan admin core
                </p>
              </div>
            </div>
            {/* Desktop Collapse / Expand Toggle Button */}
            <button className="hidden lg:flex p-1.5 rounded-lg text-[#6B6F63] hover:text-[#2B2A25] hover:bg-[#F3F6EE] transition-colors border border-transparent hover:border-[#DCE3D5]" id="desktopSidebarCollapseBtn" title="Collapse Sidebar">
              <svg className="w-5 h-5 transition-transform duration-200" fill="none" id="collapseIcon" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M11 19l-7-7 7-7m8 14l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </button>
            {/* Mobile Close Button */}
            <button className="lg:hidden p-1.5 rounded-lg text-[#6B6F63] hover:text-[#2B2A25] hover:bg-[#F3F6EE]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </button>
          </div>
          {/* Navigation Accordion Scroll Area */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
            {/* GROUP 1: OVERVIEW */}
            <div className="nav-group">
              <div className="group-header flex items-center justify-between px-3 mb-1.5 cursor-pointer text-[#6B6F63] hover:text-[#2B2A25]">
                <span className="group-title font-['Libre_Caslon_Text',serif] text-xs font-bold tracking-wide text-[#6B6F63]">
                  Overview
                </span>
                <svg className="nav-arrow w-3.5 h-3.5 transition-transform duration-200" fill="none" id="arrow-overview" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <div className="accordion-content expanded space-y-1" id="acc-overview">
                <Link className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors group" to="/admin">
                  <svg className="w-5 h-5 text-[#6B6F63] group-hover:text-[#2F5233] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  <span className="nav-text truncate">
                    Dashboard (Home)
                  </span>
                </Link>
              </div>
            </div>
            {/* GROUP 2: CORE SYSTEM */}
            <div className="nav-group">
              <div className="group-header flex items-center justify-between px-3 mb-1.5 cursor-pointer text-[#6B6F63] hover:text-[#2B2A25]">
                <span className="group-title font-['Libre_Caslon_Text',serif] text-xs font-bold tracking-wide text-[#6B6F63]">
                  Core system
                </span>
                <svg className="nav-arrow w-3.5 h-3.5 transition-transform duration-200" fill="none" id="arrow-core" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <div className="accordion-content expanded space-y-1" id="acc-core">
                <Link className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors group" to="/admin/members">
                  <svg className="w-5 h-5 text-[#6B6F63] group-hover:text-[#2F5233] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  <span className="nav-text truncate">
                    Member Management
                  </span>
                </Link>
                <Link className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors group" to="/admin/categories">
                  <svg className="w-5 h-5 text-[#6B6F63] group-hover:text-[#2F5233] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  <span className="nav-text truncate">
                    Category Management
                  </span>
                </Link>
              </div>
            </div>
            {/* GROUP 3: CONTENT MODERATION */}
            <div className="nav-group">
              <div className="group-header flex items-center justify-between px-3 mb-1.5 cursor-pointer text-[#6B6F63] hover:text-[#2B2A25]">
                <span className="group-title font-['Libre_Caslon_Text',serif] text-xs font-bold tracking-wide text-[#6B6F63]">
                  Content moderation
                </span>
                <svg className="nav-arrow w-3.5 h-3.5 transition-transform duration-200" fill="none" id="arrow-moderation" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <div className="accordion-content expanded space-y-1" id="acc-moderation">
                <Link className="nav-link flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors group" to="/admin/content">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <svg className="w-5 h-5 shrink-0 text-[#6B6F63] group-hover:text-[#2F5233]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                    <span className="nav-text truncate">
                      Manual Moderation
                    </span>
                  </div>
                  <span className="nav-badge text-[11px] font-semibold bg-[#EAF0E9] text-[#2F5233] border border-[#DCE3D5] px-2 py-0.5 rounded-lg">
                    12
                  </span>
                </Link>
                <Link className="nav-link flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-white bg-[#2F5233] hover:bg-[#25401F] transition-all" to="/admin/ai-moderation">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <svg className="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                    <span className="nav-text truncate font-semibold">
                      AI Flagged Queue
                    </span>
                  </div>
                  <span className="nav-badge text-[11px] font-semibold bg-[#ffdad6] text-[#ba1a1a] border border-[#DCE3D5] px-2 py-0.5 rounded-lg">
                    5
                  </span>
                </Link>
              </div>
            </div>
            {/* GROUP 4: AI OPERATIONS & MLOPS */}
            <div className="nav-group">
              <div className="group-header flex items-center justify-between px-3 mb-1.5 cursor-pointer text-[#6B6F63] hover:text-[#2B2A25]">
                <span className="group-title font-['Libre_Caslon_Text',serif] text-xs font-bold tracking-wide text-[#6B6F63]">
                  AI operations & MLOps
                </span>
                <svg className="nav-arrow w-3.5 h-3.5 transition-transform duration-200" fill="none" id="arrow-ai" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <div className="accordion-content expanded space-y-1" id="acc-ai">
                <Link className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors group" to="/admin/ai-monitoring">
                  <svg className="w-5 h-5 text-[#4C8C4A] group-hover:text-[#2F5233] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  <span className="nav-text truncate">
                    AI Model Monitoring
                  </span>
                </Link>
                <Link className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors group" to="/admin/meal-planner-config">
                  <svg className="w-5 h-5 text-[#6B6F63] group-hover:text-[#2F5233] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  <span className="nav-text truncate">
                    Meal Planner Config
                  </span>
                </Link>
                <Link className="nav-link flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors group" to="/admin/video-summarization">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <svg className="w-5 h-5 text-[#6B6F63] group-hover:text-[#2F5233] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                    <span className="nav-text truncate">
                      Video Summarize Jobs
                    </span>
                  </div>
                  <span className="nav-badge text-[11px] font-semibold bg-[#c4edc3] text-[#0f2a0b] border border-[#DCE3D5] px-2 py-0.5 rounded-lg">
                    Active
                  </span>
                </Link>
              </div>
            </div>
          </div>
          {/* Sidebar Footer: System Status Pill */}
          <div className="p-3 border-t border-[#DCE3D5] shrink-0">
            <div className="bg-[#F3F6EE] p-2.5 rounded-lg border border-[#DCE3D5] flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4C8C4A] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4C8C4A]"></span>
                </span>
                <span className="nav-text text-xs text-[#6B6F63] font-medium truncate">
                  LLM & Vector API Online
                </span>
              </div>
              <span className="nav-badge text-[10px] text-[#2F5233] font-bold bg-[#EAF0E9] border border-[#DCE3D5] px-1.5 py-0.5 rounded-lg">
                v2.4
              </span>
            </div>
          </div>
        </aside>
        {/* ========================================================================= */}
        {/* 2. MAIN CONTENT WRAPPER WITH STICKY HEADER */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F3F6EE]">
          {/* TOP STICKY HEADER (NAVBAR) */}
          <header className="sticky top-0 z-30 bg-[#FDFBF6] border-b border-[#DCE3D5] h-16 flex items-center justify-between px-4 sm:px-6 shrink-0">
            {/* Left: Mobile Menu Toggle & Global Search Bar */}
            <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
              {/* Hamburger Button (Mobile) */}
              <button className="lg:hidden p-2 rounded-lg text-[#6B6F63] hover:text-[#2B2A25] hover:bg-[#F3F6EE] transition-colors border border-transparent hover:border-[#DCE3D5]" title="Open Navigation Menu">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </button>
              {/* Global Search Input */}
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B6F63]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <input className="w-full pl-10 pr-4 py-2 text-sm bg-[#F3F6EE] border border-[#DCE3D5] rounded-lg focus:bg-[#FDFBF6] focus:border-[#2F5233] focus:ring-1 focus:ring-[#2F5233] outline-none transition-all placeholder-[#6B6F63] text-[#2B2A25]" placeholder="Search members, recipes, categories, or AI logs... (Press '/' to focus)" type="text" />
                <div className="hidden sm:flex absolute inset-y-0 right-0 pr-2.5 items-center pointer-events-none">
                  <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-[#6B6F63] bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg">
                    /
                  </kbd>
                </div>
              </div>
            </div>
            {/* Right: Actions, Notifications & Admin Profile Dropdown */}
            <div className="flex items-center gap-2 sm:gap-4 ml-4">
              {/* Quick Shortcut to Public Platform */}
              <Link className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2F5233] bg-[#EAF0E9] border border-[#DCE3D5] hover:bg-[#2F5233] hover:text-white rounded-lg transition-colors" to="/home" title="View Public Platform">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <span className="">
                  Live Site
                </span>
              </Link>
              {/* Notification Bell with Indicator Badge */}
              <div className="relative">
                <button className="relative p-2 rounded-lg text-[#6B6F63] hover:text-[#2B2A25] hover:bg-[#F3F6EE] transition-colors border border-transparent hover:border-[#DCE3D5]" id="notificationBtn" title="Notifications">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  {/* Indicator Badge */}
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C1432E] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C1432E] border-2 border-[#FDFBF6]"></span>
                  </span>
                </button>
                {/* Notifications Dropdown Flyout with allowable subtle shadow */}
                <div className="hidden absolute right-0 mt-2 w-80 bg-[#FDFBF6] rounded-xl shadow-[0_2px_12px_rgba(43,42,37,0.12)] border border-[#DCE3D5] py-2 z-50" id="notificationMenu">
                  <div className="px-4 py-2 border-b border-[#DCE3D5] flex items-center justify-between">
                    <span className="text-xs font-bold font-['Libre_Caslon_Text',serif] text-[#2B2A25]">
                      Notifications
                    </span>
                    <span className="text-[10px] font-semibold text-[#2F5233] bg-[#EAF0E9] border border-[#DCE3D5] px-2 py-0.5 rounded-lg">
                      3 unread
                    </span>
                  </div>
                  <div className="divide-y divide-[#DCE3D5] max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-[#F3F6EE] cursor-pointer transition-colors">
                      <p className="text-xs font-semibold text-[#2B2A25]">
                        5 recipes queued for AI inspection
                      </p>
                      <p className="text-[11px] text-[#6B6F63] mt-0.5">
                        Vegetable broth moderation rule triggered
                      </p>
                      <span className="text-[10px] text-[#6B6F63] mt-1 block">
                        5 mins ago
                      </span>
                    </div>
                    <div className="px-4 py-3 hover:bg-[#F3F6EE] cursor-pointer transition-colors">
                      <p className="text-xs font-semibold text-[#2B2A25]">
                        New chef member registered
                      </p>
                      <p className="text-[11px] text-[#6B6F63] mt-0.5">
                        Chef Nguyen applied for verified creator
                      </p>
                      <span className="text-[10px] text-[#6B6F63] mt-1 block">
                        35 mins ago
                      </span>
                    </div>
                  </div>
                  <div className="p-2 border-t border-[#DCE3D5] text-center">
                    <a className="text-xs text-[#2F5233] hover:underline font-medium" href="#all-notifications">
                      View all notifications
                    </a>
                  </div>
                </div>
              </div>
              {/* Vertical Divider */}
              <div className="h-6 w-px bg-[#DCE3D5]"></div>
              {/* Admin Profile Section with Dropdown */}
              <div className="relative">
                <button className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-[#F3F6EE] transition-colors border border-transparent hover:border-[#DCE3D5]" id="profileBtn">
                  <div className="w-8 h-8 rounded-full bg-[#2F5233] text-white flex items-center justify-center font-bold text-xs border border-[#DCE3D5]">
                    AD
                  </div>
                  <div className="hidden sm:block text-left leading-tight">
                    <p className="text-xs font-semibold text-[#2B2A25]">
                      Administrator
                    </p>
                    <p className="text-[10px] text-[#6B6F63]">
                      Super Admin
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </button>
                {/* Admin Dropdown Menu with allowable subtle shadow */}
                <div className="hidden absolute right-0 mt-2 w-52 bg-[#FDFBF6] rounded-xl shadow-[0_2px_12px_rgba(43,42,37,0.12)] border border-[#DCE3D5] py-1.5 z-50" id="profileMenu">
                  <div className="px-4 py-2 border-b border-[#DCE3D5] sm:hidden">
                    <p className="text-xs font-semibold text-[#2B2A25]">
                      Administrator
                    </p>
                    <p className="text-[10px] text-[#6B6F63]">
                      admin@bepchay.vn
                    </p>
                  </div>
                  <a className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors" href="#admin-settings">
                    <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                    <span className="">
                      Admin Profile
                    </span>
                  </a>
                  <a className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors" href="#security">
                    <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                    <span className="">
                      Security & Keys
                    </span>
                  </a>
                  <div className="h-px bg-[#DCE3D5] my-1"></div>
                  <Link className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors" to="/">
                    <svg className="w-4 h-4 text-[#ba1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                    <span className="">
                      Log Out
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </header>
          {/* ========================================================================= */}
          {/* 3. MAIN CONTENT AREA (RESPONSIVE CONTAINER) */}
          {/* ========================================================================= */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {/* Outer Responsive Container */}
            <div className="max-w-7xl mx-auto h-full flex flex-col">
              {/* Breadcrumbs Bar Placeholder */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-xs text-[#6B6F63]">
                  <span>
                    Admin Console
                  </span>
                  <span>
                    /
                  </span>
                  <span className="font-medium text-[#2B2A25]">
                    Content moderation
                  </span>
                  <span>
                    /
                  </span>
                  <span className="text-[#2F5233] font-semibold">
                    AI Flagged Queue
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#6B6F63] hidden sm:inline">
                    Current Environment:
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#EAF0E9] text-[#2F5233] border border-[#DCE3D5]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4C8C4A]"></span>
                    Production
                  </span>
                </div>
              </div>
              {/* Central Canvas Container with Skeleton Placeholder (rounded-xl, border-[#DCE3D5], zero shadow, surface-paper) */}
              <div className="space-y-6 flex-1 flex flex-col">
                {/* Header Section with Title, Subtitle, Status, & Quick Stats */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold font-['Libre_Caslon_Text',serif] text-[#2B2A25] tracking-tight">
                      AI Moderation Queue
                    </h2>
                    <p className="text-sm text-[#6B6F63] mt-1 font-['Be_Vietnam_Pro',sans-serif]">
                      Review content flagged by the AI model
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#ffdad6]/60 border border-[#ba1a1a]/30 text-xs font-semibold text-[#ba1a1a]">
                      <svg className="w-4 h-4 text-[#ba1a1a] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                      <span>
                        5 Pending Reviews
                      </span>
                    </div>
                  </div>
                </div>
                {/* Filter Tabs and Search Bar */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <button className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#2F5233] text-white transition-colors">
                      All Flagged (5)
                    </button>
                    <button className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#FDFBF6] text-[#6B6F63] hover:text-[#2B2A25] border border-[#DCE3D5] transition-colors">
                      High Confidence (3)
                    </button>
                    <button className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#FDFBF6] text-[#6B6F63] hover:text-[#2B2A25] border border-[#DCE3D5] transition-colors">
                      Promotional / Spam (2)
                    </button>
                    <button className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#FDFBF6] text-[#6B6F63] hover:text-[#2B2A25] border border-[#DCE3D5] transition-colors">
                      Medical Claims (1)
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative min-w-0 w-full sm:w-72">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B6F63]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                      </div>
                      <input className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg focus:border-[#2F5233] outline-none transition-colors placeholder-[#6B6F63] text-[#2B2A25]" placeholder="Search flagged items, authors..." type="text" />
                    </div>
                    <div className="relative shrink-0">
                      <select className="w-full sm:w-auto text-xs sm:text-sm bg-[#FDFBF6] text-[#2B2A25] border border-[#DCE3D5] rounded-lg px-3 py-1.5 outline-none cursor-pointer pr-8 font-medium">
                        <option value="all">
                          Severity: All
                        </option>
                        <option value="high">
                          Confidence &gt; 90%
                        </option>
                        <option value="medium">
                          Confidence 70-90%
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* Flagged Items Feed: Vertical List of Warning Cards (gap-6 / 24px) */}
                <div className="flex flex-col gap-6">
                  {/* CARD 1: Automated Commercial Bot / Spam Link */}
                  <div className="bg-[#FDFBF6] rounded-xl border border-[#DCE3D5] p-6 shadow-none flex flex-col gap-4">
                    {/* Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DCE3D5]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#EAF0E9] border border-[#DCE3D5] text-[#2F5233] font-bold text-xs flex items-center justify-center shrink-0">
                          U9
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#2B2A25]">
                              user_99218
                            </span>
                            <span className="text-xs text-[#6B6F63]">
                              @crypto_culinary
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-medium bg-[#EAF0E9] text-[#2F5233] border border-[#DCE3D5]">
                              Comment
                            </span>
                          </div>
                          <p className="text-xs text-[#6B6F63] mt-0.5">
                            Flagged 14 mins ago · Oct 24, 2024, 14:15
                          </p>
                        </div>
                      </div>
                      {/* AI Confidence Pill */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#ffdad6]/70 text-[#C1432E] border border-[#C1432E]/30 shrink-0 self-start sm:self-center">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                        <span>
                          Automated Commercial Bot · 96%
                        </span>
                      </div>
                    </div>
                    {/* Card Body / Flagged Content Excerpt */}
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-[#6B6F63] tracking-wide">
                        TARGET: Recipe Discussion on “Fermented Organic Tempeh in Claypot”
                      </p>
                      <div className="p-3.5 rounded-lg bg-[#F3F6EE] border border-[#DCE3D5] text-sm text-[#2B2A25] font-['Be_Vietnam_Pro',sans-serif] leading-relaxed">
                        <span className="text-[#6B6F63] italic">
                          “
                        </span>
                        Great tempeh ferment! But why pay store prices when you can buy wholesale yeast starter and earn crypto dividends?
                        <mark className="bg-[#ffdad6] text-[#C1432E] px-1 py-0.5 rounded font-medium">
                          Check my telegram link for crypto gains and culinary supplies t.me/botanical_yields_fast
                        </mark>
                        DM now for 20% cashback!
                        <span className="text-[#6B6F63] italic">
                          ”
                        </span>
                      </div>
                      {/* AI Model Note Box */}
                      <div className="p-3 rounded-lg bg-[#EAF0E9]/60 border border-[#DCE3D5] flex items-start gap-2.5 text-xs text-[#2F5233]">
                        <svg className="w-4 h-4 text-[#2F5233] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                        <div>
                          <strong className="font-semibold">
                            AI Diagnosis:
                          </strong>
                          Detected third-party Telegram promotional URL and cryptocurrency keywords in non-commercial cooking thread. Violates Community Rule #4 (No unsolicited promotional links or bots).
                        </div>
                      </div>
                    </div>
                    {/* Card Actions */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#DCE3D5]">
                      <div className="flex items-center gap-2 text-xs text-[#6B6F63]">
                        <span>
                          Model:
                          <strong className="font-medium text-[#2B2A25]">
                            SpamClassifier-v3.1
                          </strong>
                        </span>
                        <span>
                          •
                        </span>
                        <span>
                          Inference latency: 42ms
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                        <button className="px-4 py-2 rounded-lg text-xs font-medium text-[#2F5233] border-2 border-[#2F5233] hover:bg-[#EAF0E9] transition-colors min-h-[40px] flex items-center justify-center">
                          Keep Post
                        </button>
                        <button className="px-4 py-2 rounded-lg text-xs font-medium text-[#C1432E] border-2 border-[#C1432E] hover:bg-[#ffdad6]/40 transition-colors min-h-[40px] flex items-center justify-center">
                          Reject & Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* CARD 2: Video Post with Embedded Commercial Links */}
                  <div className="bg-[#FDFBF6] rounded-xl border border-[#DCE3D5] p-6 shadow-none flex flex-col gap-4">
                    {/* Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DCE3D5]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#EAF0E9] border border-[#DCE3D5] text-[#2F5233] font-bold text-xs flex items-center justify-center shrink-0">
                          CD
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#2B2A25]">
                              Chef Duy
                            </span>
                            <span className="text-xs text-[#6B6F63]">
                              @chef_duy_vegan
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-medium bg-[#EAF0E9] text-[#2F5233] border border-[#DCE3D5]">
                              Video Post
                            </span>
                          </div>
                          <p className="text-xs text-[#6B6F63] mt-0.5">
                            Flagged 28 mins ago · Oct 23, 2024, 09:15
                          </p>
                        </div>
                      </div>
                      {/* AI Confidence Pill */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#ffdad6]/70 text-[#C1432E] border border-[#C1432E]/30 shrink-0 self-start sm:self-center">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                        <span>
                          Promotional Links / Spam · 89%
                        </span>
                      </div>
                    </div>
                    {/* Card Body / Flagged Content with Thumbnail */}
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-[#6B6F63] tracking-wide">
                        TITLE: Mastering Vegan Phở Broth: Charred Ginger and Botanical Spices
                      </p>
                      <div className="flex flex-col md:flex-row items-start gap-4 p-3.5 rounded-lg bg-[#F3F6EE] border border-[#DCE3D5]">
                        <div className="relative w-28 h-20 rounded-lg overflow-hidden shrink-0 border border-[#DCE3D5] bg-[#EAF0E9]">
                          <img alt="Pho Broth Video Thumbnail" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1WKcDwGR2GO1h8uT61hNF-s_62zOYXjY8wzlx8-YVN9qcyiWrINEaKUq1DV-gcQ-G7syVZEwHgyWph99ZzTpvTqJOjzjemUgHoHjo3bb00YP4VDdU3xDibxsswo6LbTzG4g7QCyuSTjBB8Y_0mQ57bOen8CA2NXIAsnJwC0eevQaGHA0yF_XXpq9R37yeuGktzM_K2CU24bUaiE8ADGempXrmLk1iKtN9tkU23B4jXFT560t4_50GAzSLI" />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"></path>
                            </svg>
                          </div>
                          <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-semibold px-1 rounded">
                            12:34
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 text-sm text-[#2B2A25] font-['Be_Vietnam_Pro',sans-serif] leading-relaxed">
                          <p className="text-xs text-[#6B6F63] mb-1">
                            Timestamp flagged:
                            <strong className="text-[#2B2A25]">
                              07:42 - 08:30
                            </strong>
                          </p>
                          <p>
                            “Slow char ginger and spices for rich botanical aroma...
                            <mark className="bg-[#ffdad6] text-[#C1432E] px-1 py-0.5 rounded font-medium">
                              Use my sponsor code PHOKIT50 at buybestknives.online/promo to receive 50% discount and free shipping
                            </mark>
                            on imported ceramic santoku knives!”
                          </p>
                        </div>
                      </div>
                      {/* AI Model Note Box */}
                      <div className="p-3 rounded-lg bg-[#EAF0E9]/60 border border-[#DCE3D5] flex items-start gap-2.5 text-xs text-[#2F5233]">
                        <svg className="w-4 h-4 text-[#2F5233] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                        <div>
                          <strong className="font-semibold">
                            AI Diagnosis:
                          </strong>
                          Unregistered affiliate coupon link detected in audio transcript without verified creator sponsorship disclosure tag.
                        </div>
                      </div>
                    </div>
                    {/* Card Actions */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#DCE3D5]">
                      <div className="flex items-center gap-2 text-xs text-[#6B6F63]">
                        <span>
                          Model:
                          <strong className="font-medium text-[#2B2A25]">
                            AudioTranscriptReview-v1.4
                          </strong>
                        </span>
                        <span>
                          •
                        </span>
                        <span>
                          Confidence threshold: 85%
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                        <button className="px-4 py-2 rounded-lg text-xs font-medium text-[#2F5233] border-2 border-[#2F5233] hover:bg-[#EAF0E9] transition-colors min-h-[40px] flex items-center justify-center">
                          Approve Content
                        </button>
                        <button className="px-4 py-2 rounded-lg text-xs font-medium text-[#C1432E] border-2 border-[#C1432E] hover:bg-[#ffdad6]/40 transition-colors min-h-[40px] flex items-center justify-center">
                          Reject & Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* CARD 3: Recipe Post with Potential Medical Claims */}
                  <div className="bg-[#FDFBF6] rounded-xl border border-[#DCE3D5] p-6 shadow-none flex flex-col gap-4">
                    {/* Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DCE3D5]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#EAF0E9] border border-[#DCE3D5] text-[#2F5233] font-bold text-xs flex items-center justify-center shrink-0">
                          HT
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#2B2A25]">
                              Huong Tra
                            </span>
                            <span className="text-xs text-[#6B6F63]">
                              @huongtra_herbal
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-medium bg-[#EAF0E9] text-[#2F5233] border border-[#DCE3D5]">
                              Recipe Post
                            </span>
                          </div>
                          <p className="text-xs text-[#6B6F63] mt-0.5">
                            Flagged 1 hr ago · Oct 21, 2024, 11:05
                          </p>
                        </div>
                      </div>
                      {/* AI Confidence Pill */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#ffdad6]/70 text-[#C1432E] border border-[#C1432E]/30 shrink-0 self-start sm:self-center">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                        <span>
                          Potential Misinformation (Medical Claims) · 91%
                        </span>
                      </div>
                    </div>
                    {/* Card Body / Flagged Content with Thumbnail */}
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-[#6B6F63] tracking-wide">
                        RECIPE: Healing Lotus Seed & Longan Sweet Soup (Chè Hạt Sen)
                      </p>
                      <div className="flex flex-col md:flex-row items-start gap-4 p-3.5 rounded-lg bg-[#F3F6EE] border border-[#DCE3D5]">
                        <div className="relative w-28 h-20 rounded-lg overflow-hidden shrink-0 border border-[#DCE3D5] bg-[#EAF0E9]">
                          <img alt="Lotus Seed Sweet Soup" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1Ude7R11IRRpW2c9kLST45kXxemd6HOkh2-3ywiA-NEd9BFFlae2UOlQHWXuk8S78GKCMsukyOUOynA_N7Gc8U60OoApLxfzXOb9RBn6H42RsA04OziYAc7bo40OIuNe7Emdbspcw0hZJQRJbAPUgroKPHCVnlWmVNeqHAdF1WUaI2X1SuwQx4vr4ktGCK0_PO0JMuaPKkRxeDk4r9CkBCLZgNvgxaa5yWnXS9OHik61nlauWRd5Zn2Bhc" />
                        </div>
                        <div className="min-w-0 flex-1 text-sm text-[#2B2A25] font-['Be_Vietnam_Pro',sans-serif] leading-relaxed">
                          <p>
                            “A soothing dessert soup celebrated for calming the nervous system.
                            <mark className="bg-[#ffdad6] text-[#C1432E] px-1 py-0.5 rounded font-medium">
                              Drinking 3 bowls daily is guaranteed to permanently cure chronic insomnia and reverse stage-2 hypertension without medication.
                            </mark>
                            Replace all pharmaceutical pills with this tonic!”
                          </p>
                        </div>
                      </div>
                      {/* AI Model Note Box */}
                      <div className="p-3 rounded-lg bg-[#EAF0E9]/60 border border-[#DCE3D5] flex items-start gap-2.5 text-xs text-[#2F5233]">
                        <svg className="w-4 h-4 text-[#2F5233] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                        <div>
                          <strong className="font-semibold">
                            AI Diagnosis:
                          </strong>
                          Unsubstantiated clinical treatment claim violates platform Nutritional Health Standard §2.4 (No definitive medical cure assertions).
                        </div>
                      </div>
                    </div>
                    {/* Card Actions */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#DCE3D5]">
                      <div className="flex items-center gap-2 text-xs text-[#6B6F63]">
                        <span>
                          Model:
                          <strong className="font-medium text-[#2B2A25]">
                            HealthClaimGuard-v2
                          </strong>
                        </span>
                        <span>
                          •
                        </span>
                        <span>
                          Severity: Critical
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                        <button className="px-4 py-2 rounded-lg text-xs font-medium text-[#2F5233] border-2 border-[#2F5233] hover:bg-[#EAF0E9] transition-colors min-h-[40px] flex items-center justify-center">
                          Keep Post
                        </button>
                        <button className="px-4 py-2 rounded-lg text-xs font-medium text-[#C1432E] border-2 border-[#C1432E] hover:bg-[#ffdad6]/40 transition-colors min-h-[40px] flex items-center justify-center">
                          Reject & Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* CARD 4: Inappropriate Language / Harassment in Comments */}
                  <div className="bg-[#FDFBF6] rounded-xl border border-[#DCE3D5] p-6 shadow-none flex flex-col gap-4">
                    {/* Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DCE3D5]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#EAF0E9] border border-[#DCE3D5] text-[#2F5233] font-bold text-xs flex items-center justify-center shrink-0">
                          TB
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#2B2A25]">
                              Tran Bao
                            </span>
                            <span className="text-xs text-[#6B6F63]">
                              @tranbao_91
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-medium bg-[#EAF0E9] text-[#2F5233] border border-[#DCE3D5]">
                              Comment
                            </span>
                          </div>
                          <p className="text-xs text-[#6B6F63] mt-0.5">
                            Flagged 2 hrs ago · Oct 21, 2024, 08:30
                          </p>
                        </div>
                      </div>
                      {/* AI Confidence Pill */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#ffdad6]/70 text-[#C1432E] border border-[#C1432E]/30 shrink-0 self-start sm:self-center">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                        <span>
                          Inappropriate Language · 94%
                        </span>
                      </div>
                    </div>
                    {/* Card Body / Flagged Content Excerpt */}
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-[#6B6F63] tracking-wide">
                        TARGET: Member Recipe Submission “Crisp Banana Blossom Salad”
                      </p>
                      <div className="p-3.5 rounded-lg bg-[#F3F6EE] border border-[#DCE3D5] text-sm text-[#2B2A25] font-['Be_Vietnam_Pro',sans-serif] leading-relaxed">
                        <span className="text-[#6B6F63] italic">
                          “
                        </span>
                        This recipe is complete garbage, whoever made this doesn’t know how to cook even boiled water.
                        <mark className="bg-[#ffdad6] text-[#C1432E] px-1 py-0.5 rounded font-medium">
                          You are an incompetent fraud, stop embarrassing yourself and delete your account immediately idiot.
                        </mark>
                        <span className="text-[#6B6F63] italic">
                          ”
                        </span>
                      </div>
                      {/* AI Model Note Box */}
                      <div className="p-3 rounded-lg bg-[#EAF0E9]/60 border border-[#DCE3D5] flex items-start gap-2.5 text-xs text-[#2F5233]">
                        <svg className="w-4 h-4 text-[#2F5233] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                        <div>
                          <strong className="font-semibold">
                            AI Diagnosis:
                          </strong>
                          High toxicity rating detected (0.94). Target insult, harassment, and demeanment directed at member creator.
                        </div>
                      </div>
                    </div>
                    {/* Card Actions */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#DCE3D5]">
                      <div className="flex items-center gap-2 text-xs text-[#6B6F63]">
                        <span>
                          Model:
                          <strong className="font-medium text-[#2B2A25]">
                            ToxicityBERT-VN
                          </strong>
                        </span>
                        <span>
                          •
                        </span>
                        <span>
                          Score: 0.94 / 1.0
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                        <button className="px-4 py-2 rounded-lg text-xs font-medium text-[#2F5233] border-2 border-[#2F5233] hover:bg-[#EAF0E9] transition-colors min-h-[40px] flex items-center justify-center">
                          Keep Post
                        </button>
                        <button className="px-4 py-2 rounded-lg text-xs font-medium text-[#C1432E] border-2 border-[#C1432E] hover:bg-[#ffdad6]/40 transition-colors min-h-[40px] flex items-center justify-center">
                          Remove Content
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* CARD 5: Recipe Post with Flagged External Redirect */}
                  <div className="bg-[#FDFBF6] rounded-xl border border-[#DCE3D5] p-6 shadow-none flex flex-col gap-4">
                    {/* Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DCE3D5]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#EAF0E9] border border-[#DCE3D5] text-[#2F5233] font-bold text-xs flex items-center justify-center shrink-0">
                          VK
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#2B2A25]">
                              Vegan Kitchenette
                            </span>
                            <span className="text-xs text-[#6B6F63]">
                              @vegankitchen_viet
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-medium bg-[#EAF0E9] text-[#2F5233] border border-[#DCE3D5]">
                              Recipe Post
                            </span>
                          </div>
                          <p className="text-xs text-[#6B6F63] mt-0.5">
                            Flagged 3 hrs ago · Oct 20, 2024, 18:22
                          </p>
                        </div>
                      </div>
                      {/* AI Confidence Pill */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#ffdad6]/70 text-[#C1432E] border border-[#C1432E]/30 shrink-0 self-start sm:self-center">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                        <span>
                          Promotional Links / Spam · 87%
                        </span>
                      </div>
                    </div>
                    {/* Card Body / Flagged Content with Thumbnail */}
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-[#6B6F63] tracking-wide">
                        RECIPE: Traditional Claypot Braised Tofu with Lemongrass & Chili
                      </p>
                      <div className="flex flex-col md:flex-row items-start gap-4 p-3.5 rounded-lg bg-[#F3F6EE] border border-[#DCE3D5]">
                        <div className="relative w-28 h-20 rounded-lg overflow-hidden shrink-0 border border-[#DCE3D5] bg-[#EAF0E9]">
                          <img alt="Claypot Braised Tofu" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1WpWnTW3IliMcPvAEqMET47e7nvomtpGiUFVxPFVJsewU31dL3vBDsUadPlj_M0vakri4y7awqWj7lKfo6DLFvgJSCpKr6YnjqB-w54xzY0eYy8Rxh9rwXXcnmsgf_jhIiWDsgvjzXwWTarZKBVZMmNx0iuQV7m9h7GxfNlKQJvZ3j_KBs5orPc0tFCUFcPaGrYnIiJmxd1DI-up6x0OUILcVG3xoY9BjUSALB9AmH54gtmWNcKA9CjlUA" />
                        </div>
                        <div className="min-w-0 flex-1 text-sm text-[#2B2A25] font-['Be_Vietnam_Pro',sans-serif] leading-relaxed">
                          <p>
                            “Authentic Claypot braised organic tofu with fresh aromatic herbs...
                            <mark className="bg-[#ffdad6] text-[#C1432E] px-1 py-0.5 rounded font-medium">
                              To view full ingredient weights and instructions you must create an account at external site: bit.ly/free-vegan-claypot-gift
                            </mark>
                            where free gifts are offered!”
                          </p>
                        </div>
                      </div>
                      {/* AI Model Note Box */}
                      <div className="p-3 rounded-lg bg-[#EAF0E9]/60 border border-[#DCE3D5] flex items-start gap-2.5 text-xs text-[#2F5233]">
                        <svg className="w-4 h-4 text-[#2F5233] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                        <div>
                          <strong className="font-semibold">
                            AI Diagnosis:
                          </strong>
                          Recipe gatekeeping with masked URL shortener redirecting to an unauthorized lead-capture funnel.
                        </div>
                      </div>
                    </div>
                    {/* Card Actions */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#DCE3D5]">
                      <div className="flex items-center gap-2 text-xs text-[#6B6F63]">
                        <span>
                          Model:
                          <strong className="font-medium text-[#2B2A25]">
                            LinkSafetyGuard-v2
                          </strong>
                        </span>
                        <span>
                          •
                        </span>
                        <span>
                          Threat: Phishing / Funnel Redirect
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                        <button className="px-4 py-2 rounded-lg text-xs font-medium text-[#2F5233] border-2 border-[#2F5233] hover:bg-[#EAF0E9] transition-colors min-h-[40px] flex items-center justify-center">
                          Approve Content
                        </button>
                        <button className="px-4 py-2 rounded-lg text-xs font-medium text-[#C1432E] border-2 border-[#C1432E] hover:bg-[#ffdad6]/40 transition-colors min-h-[40px] flex items-center justify-center">
                          Reject & Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Pagination Footer for Queue */}
                <div className="pt-4 border-t border-[#DCE3D5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B6F63]">
                  <div>
                    Showing
                    <span className="font-semibold text-[#2B2A25]">
                      1 - 5
                    </span>
                    of
                    <span className="font-semibold text-[#2B2A25]">
                      5
                    </span>
                    flagged items in queue
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button className="px-3 py-1.5 rounded-lg border border-[#DCE3D5] bg-[#FDFBF6] text-[#6B6F63] opacity-75 cursor-default transition-colors" disabled>
                      Previous
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-[#2F5233] text-white font-semibold transition-colors">
                      1
                    </button>
                    <button className="px-3 py-1.5 rounded-lg border border-[#DCE3D5] bg-[#FDFBF6] text-[#6B6F63] opacity-75 cursor-default transition-colors" disabled>
                      Next
                    </button>
                  </div>
                </div>
              </div>
              {/* Bottom Status Footer */}
              <footer className="mt-6 text-center sm:text-left text-xs text-[#6B6F63] flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="">
                  © 2025 Vegan Helper • Vegan Cooking & Nutrition Platform
                </span>
                <div className="flex items-center gap-4">
                  <a className="hover:text-[#2F5233] transition-colors" href="#docs">
                    Admin Guidelines
                  </a>
                  <a className="hover:text-[#2F5233] transition-colors" href="#api">
                    MLOps Status
                  </a>
                  <a className="hover:text-[#2F5233] transition-colors" href="#support">
                    Tech Support
                  </a>
                </div>
              </footer>
            </div>
          </main>
        </div>
      </div>
      {/* ========================================================================= */}
      {/* TECHNICAL JAVASCRIPT: ACCORDION, COLLAPSE & MOBILE CONTROLS */}
      {/* ========================================================================= */}
      {/* TODO: script goc da bi loai bo, can port lai logic bang useState/useEffect */}
    </>
  );
}

export default AdminAiModerationQueue;
