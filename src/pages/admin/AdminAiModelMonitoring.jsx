import { Link } from 'react-router-dom'

function AdminAiModelMonitoring() {
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                </svg>
              </div>
              <div className="logo-text leading-tight truncate">
                <h1 className="font-['Libre_Caslon_Text',serif] font-bold text-lg text-[#2F5233] tracking-tight truncate">
                  Botanical Hearth
                </h1>
                <p className="text-[11px] font-semibold text-[#4C8C4A] tracking-wider">
                  Vegan admin core
                </p>
              </div>
            </div>
            {/* Desktop Collapse / Expand Toggle Button */}
            <button className="hidden lg:flex p-1.5 rounded-lg text-[#6B6F63] hover:text-[#2B2A25] hover:bg-[#F3F6EE] transition-colors border border-transparent hover:border-[#DCE3D5]" id="desktopSidebarCollapseBtn" title="Collapse Sidebar">
              <svg className="w-5 h-5 transition-transform duration-200" fill="none" id="collapseIcon" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M11 19l-7-7 7-7m8 14l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
              </svg>
            </button>
            {/* Mobile Close Button */}
            <button className="lg:hidden p-1.5 rounded-lg text-[#6B6F63] hover:text-[#2B2A25] hover:bg-[#F3F6EE]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
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
                  <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                </svg>
              </div>
              <div className="accordion-content expanded space-y-1" id="acc-overview">
                <Link className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors group" to="/admin">
                  <svg className="w-5 h-5 text-[#6B6F63] group-hover:text-[#2F5233] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="group-header flex items-center justify-between px-3 mb-1.5 cursor-pointer text-[#6B6F63] hover:text-[#2B2A25]">
                <span className="group-title font-['Libre_Caslon_Text',serif] text-xs font-bold tracking-wide text-[#6B6F63]">
                  Core system
                </span>
                <svg className="nav-arrow w-3.5 h-3.5 transition-transform duration-200" fill="none" id="arrow-core" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                </svg>
              </div>
              <div className="accordion-content expanded space-y-1" id="acc-core">
                <Link className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors group" to="/admin/members">
                  <svg className="w-5 h-5 text-[#6B6F63] group-hover:text-[#2F5233] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                  </svg>
                  <span className="nav-text truncate">
                    Member Management
                  </span>
                </Link>
                <Link className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors group" to="/admin/categories">
                  <svg className="w-5 h-5 text-[#6B6F63] group-hover:text-[#2F5233] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="group-header flex items-center justify-between px-3 mb-1.5 cursor-pointer text-[#6B6F63] hover:text-[#2B2A25]">
                <span className="group-title font-['Libre_Caslon_Text',serif] text-xs font-bold tracking-wide text-[#6B6F63]">
                  Content moderation
                </span>
                <svg className="nav-arrow w-3.5 h-3.5 transition-transform duration-200" fill="none" id="arrow-moderation" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                </svg>
              </div>
              <div className="accordion-content expanded space-y-1" id="acc-moderation">
                <Link className="nav-link flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors group" to="/admin/content">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <svg className="w-5 h-5 shrink-0 text-[#6B6F63] group-hover:text-[#2F5233]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                    </svg>
                    <span className="nav-text truncate">
                      Manual Moderation
                    </span>
                  </div>
                  <span className="nav-badge text-[11px] font-semibold bg-[#EAF0E9] text-[#2F5233] border border-[#DCE3D5] px-2 py-0.5 rounded-lg">
                    12
                  </span>
                </Link>
                <Link className="nav-link flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors group" to="/admin/ai-moderation">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <svg className="w-5 h-5 text-[#6B6F63] group-hover:text-[#2F5233] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                    </svg>
                    <span className="nav-text truncate">
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
                  <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                </svg>
              </div>
              <div className="accordion-content expanded space-y-1" id="acc-ai">
                <Link className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white bg-[#2F5233] hover:bg-[#25401F] transition-all" to="/admin/ai-monitoring">
                  <svg className="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                  </svg>
                  <span className="nav-text truncate font-semibold">
                    AI Model Monitoring
                  </span>
                </Link>
                <Link className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors group" to="/admin/meal-planner-config">
                  <svg className="w-5 h-5 text-[#6B6F63] group-hover:text-[#2F5233] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                  </svg>
                  <span className="nav-text truncate">
                    Meal Planner Config
                  </span>
                </Link>
                <Link className="nav-link flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors group" to="/admin/video-summarization">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <svg className="w-5 h-5 text-[#6B6F63] group-hover:text-[#2F5233] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
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
                  <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                </svg>
              </button>
              {/* Global Search Input */}
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B6F63]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
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
                  <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                </svg>
                <span className="">
                  Live Site
                </span>
              </Link>
              {/* Notification Bell with Indicator Badge */}
              <div className="relative">
                <button className="relative p-2 rounded-lg text-[#6B6F63] hover:text-[#2B2A25] hover:bg-[#F3F6EE] transition-colors border border-transparent hover:border-[#DCE3D5]" id="notificationBtn" title="Notifications">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
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
                    <path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
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
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                    </svg>
                    <span className="">
                      Admin Profile
                    </span>
                  </a>
                  <a className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors" href="#security">
                    <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                    </svg>
                    <span className="">
                      Security & Keys
                    </span>
                  </a>
                  <div className="h-px bg-[#DCE3D5] my-1"></div>
                  <Link className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors" to="/">
                    <svg className="w-4 h-4 text-[#ba1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
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
                    AI operations & MLOps
                  </span>
                  <span>
                    /
                  </span>
                  <span className="text-[#2F5233] font-semibold">
                    AI Model Monitoring
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
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl sm:text-3xl font-bold font-['Libre_Caslon_Text',serif] text-[#2B2A25] tracking-tight">
                        AI Model Monitoring
                      </h2>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[#EAF0E9] text-[#2F5233] border border-[#DCE3D5]">
                        <span className="w-2 h-2 rounded-full bg-[#4C8C4A] animate-ping"></span>
                        Live Telemetry
                      </span>
                    </div>
                    <p className="text-sm text-[#6B6F63] font-['Be_Vietnam_Pro',sans-serif]">
                      Real-time telemetry, model latency, token consumption, and inference health across Botanical Hearth AI endpoints.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                    <div className="flex flex-col items-start sm:items-end">
                      <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C1432E] hover:bg-[#A63446] text-white text-xs sm:text-sm font-semibold transition-colors shadow-none cursor-pointer border border-[#C1432E]" title="Emergency override - halts all LLM and vector calls">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                        </svg>
                        <span>
                          Disable AI Features (Kill Switch)
                        </span>
                      </button>
                      <span className="text-[10px] text-[#6B6F63] mt-1 italic">
                        Immediate failover to deterministic heuristics
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-[#FDFBF6] rounded-xl border border-[#DCE3D5] p-5 shadow-none flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#6B6F63] uppercase tracking-wider">
                        Total Inferences (24h)
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-[#EAF0E9] text-[#2F5233] flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-2xl font-bold text-[#2B2A25]">
                        148,290
                      </div>
                      <p className="text-xs text-[#4C8C4A] font-medium mt-1 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M5 10l7-7m0 0l7 7m-7-7v18" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                        </svg>
                        +12.4% vs yesterday
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#FDFBF6] rounded-xl border border-[#DCE3D5] p-5 shadow-none flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#6B6F63] uppercase tracking-wider">
                        Average Latency
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-[#EAF0E9] text-[#2F5233] flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-2xl font-bold text-[#2B2A25]">
                        42ms
                      </div>
                      <p className="text-xs text-[#6B6F63] font-medium mt-1">
                        p95: 118ms · p99: 245ms
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#FDFBF6] rounded-xl border border-[#DCE3D5] p-5 shadow-none flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#6B6F63] uppercase tracking-wider">
                        Inference Error Rate
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-[#ffdad6]/60 text-[#ba1a1a] flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-2xl font-bold text-[#2B2A25]">
                        0.04%
                      </div>
                      <p className="text-xs text-[#B8791A] font-medium mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B8791A]"></span>
                        3 SLA anomalies logged
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#FDFBF6] rounded-xl border border-[#DCE3D5] p-5 shadow-none flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#6B6F63] uppercase tracking-wider">
                        Vector & Token Usage
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-[#EAF0E9] text-[#2F5233] flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-2xl font-bold text-[#2B2A25]">
                        1.82M Tokens
                      </div>
                      <p className="text-xs text-[#6B6F63] font-medium mt-1">
                        Quota limit: 5.0M / day
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-[#FDFBF6] rounded-xl border border-[#DCE3D5] p-6 shadow-none flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DCE3D5]">
                      <div>
                        <h3 className="text-base font-bold font-['Be_Vietnam_Pro',sans-serif] text-[#2B2A25]">
                          Model Latency & Throughput Trend
                        </h3>
                        <p className="text-xs text-[#6B6F63] mt-0.5">
                          Continuous 24-hour window aggregated in 15-minute buckets
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-[#F3F6EE] p-1 rounded-lg border border-[#DCE3D5]">
                        <button className="px-2.5 py-1 text-xs font-medium rounded text-[#6B6F63] hover:text-[#2B2A25]">
                          1 Hour
                        </button>
                        <button className="px-2.5 py-1 text-xs font-medium rounded text-[#6B6F63] hover:text-[#2B2A25]">
                          6 Hours
                        </button>
                        <button className="px-2.5 py-1 text-xs font-semibold rounded bg-[#2F5233] text-white">
                          24 Hours
                        </button>
                        <button className="px-2.5 py-1 text-xs font-medium rounded text-[#6B6F63] hover:text-[#2B2A25]">
                          7 Days
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 pt-3 text-xs text-[#6B6F63]">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#2F5233]"></span>
                        <span>
                          Median Latency (ms)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#B8791A]"></span>
                        <span>
                          Query Throughput (qps)
                        </span>
                      </div>
                      <div className="ml-auto hidden sm:flex items-center gap-1.5 text-[11px] text-[#6B6F63]">
                        <span className="w-2 h-0.5 bg-[#DCE3D5]"></span>
                        <span>
                          Baseline: 40ms SLA
                        </span>
                      </div>
                    </div>
                    <div className="relative w-full h-64 mt-4">
                      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 600 200">
                        <defs>
                          <lineargradient id="latencyGrad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stop-color="#2F5233" stop-opacity="0.2"></stop>
                            <stop offset="100%" stop-color="#2F5233" stop-opacity="0"></stop>
                          </lineargradient>
                        </defs>
                        <line stroke="#DCE3D5" stroke-dasharray="4 4" stroke-width="1" x1="0" x2="600" y1="40"></line>
                        <line stroke="#DCE3D5" stroke-dasharray="4 4" stroke-width="1" x1="0" x2="600" y1="90"></line>
                        <line stroke="#DCE3D5" stroke-dasharray="4 4" stroke-width="1" x1="0" x2="600" y1="140"></line>
                        <line stroke="#DCE3D5" stroke-width="1.5" x1="0" x2="600" y1="160"></line>
                        <path d="M0,150 C50,140 80,120 120,130 C160,140 200,85 240,105 C280,125 310,135 350,115 C390,95 420,145 460,125 C500,105 540,110 600,95 L600,180 L0,180 Z" fill="url(#latencyGrad)"></path>
                        <path d="M0,150 C50,140 80,120 120,130 C160,140 200,85 240,105 C280,125 310,135 350,115 C390,95 420,145 460,125 C500,105 540,110 600,95" fill="none" stroke="#2F5233" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path>
                        <path d="M0,165 C60,160 100,155 150,158 C200,162 250,135 300,145 C350,155 400,130 450,138 C500,145 550,135 600,142" fill="none" stroke="#B8791A" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                        <circle cx="240" cy="105" fill="#2F5233" r="3.5"></circle>
                        <circle cx="420" cy="145" fill="#2F5233" r="3.5"></circle>
                        <circle cx="600" cy="95" fill="#2F5233" r="3.5"></circle>
                      </svg>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-[#6B6F63] pt-2 border-t border-[#DCE3D5]">
                      <span>
                        00:00
                      </span>
                      <span>
                        04:00
                      </span>
                      <span>
                        08:00
                      </span>
                      <span>
                        12:00
                      </span>
                      <span>
                        16:00
                      </span>
                      <span>
                        20:00
                      </span>
                      <span className="font-semibold text-[#2F5233]">
                        Now (14:45)
                      </span>
                    </div>
                  </div>
                  <div className="bg-[#FDFBF6] rounded-xl border border-[#DCE3D5] p-6 shadow-none flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-3 border-b border-[#DCE3D5]">
                      <div>
                        <h3 className="text-base font-bold font-['Be_Vietnam_Pro',sans-serif] text-[#2B2A25]">
                          Incident Logs
                        </h3>
                        <p className="text-xs text-[#6B6F63]">
                          Recent telemetry & exception alerts
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold bg-[#EAF0E9] text-[#2F5233] px-2 py-0.5 rounded-lg border border-[#DCE3D5]">
                        4 Events
                      </span>
                    </div>
                    <div className="divide-y divide-[#DCE3D5] my-2 overflow-y-auto max-h-72">
                      <div className="py-3 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#2B2A25] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#B8791A]"></span>
                            Rate Limit Throttling
                          </span>
                          <span className="text-[10px] text-[#6B6F63]">
                            14:32:10
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6B6F63]">
                          Vector Store ·
                          <code className="text-[#2B2A25] bg-[#F3F6EE] px-1 rounded">
                            /v1/embeddings/nutrition
                          </code>
                        </p>
                        <span className="text-[10px] text-[#B8791A] font-medium">
                          HTTP 429 · recovered in 120ms
                        </span>
                      </div>
                      <div className="py-3 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#2B2A25] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#2F5233]"></span>
                            Safety Filter Triggered
                          </span>
                          <span className="text-[10px] text-[#6B6F63]">
                            13:45:02
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6B6F63]">
                          Classifier ·
                          <code className="text-[#2B2A25] bg-[#F3F6EE] px-1 rounded">
                            /v1/moderation/classify
                          </code>
                        </p>
                        <span className="text-[10px] text-[#2F5233] font-medium">
                          Unsolicited commercial link flagged
                        </span>
                      </div>
                      <div className="py-3 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#2B2A25] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#B8791A]"></span>
                            Downstream Timeout Fallback
                          </span>
                          <span className="text-[10px] text-[#6B6F63]">
                            11:20:18
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6B6F63]">
                          Meal Planner ·
                          <code className="text-[#2B2A25] bg-[#F3F6EE] px-1 rounded">
                            /v1/chat/meal-planner
                          </code>
                        </p>
                        <span className="text-[10px] text-[#B8791A] font-medium">
                          Cold start retry passed (890ms)
                        </span>
                      </div>
                      <div className="py-3 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#2B2A25] flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#6B6F63]"></span>
                            Context Truncation
                          </span>
                          <span className="text-[10px] text-[#6B6F63]">
                            09:15:44
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6B6F63]">
                          Recipe Summarizer · &gt; 4,096 tokens
                        </p>
                        <span className="text-[10px] text-[#6B6F63] font-medium">
                          Auto-summarized head context
                        </span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-[#DCE3D5] text-center">
                      <a className="text-xs text-[#2F5233] hover:underline font-semibold" href="#detailed-logs">
                        Download Raw Telemetry Logs (.jsonl)
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* Bottom Status Footer */}
              <footer className="mt-6 text-center sm:text-left text-xs text-[#6B6F63] flex flex-col sm:flex-row items-center justify-between gap-2">
                <span className="">
                  © 2025 Botanical Hearth • Vegan Cooking & Nutrition Platform
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

export default AdminAiModelMonitoring;
