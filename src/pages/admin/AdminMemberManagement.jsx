import { Link } from 'react-router-dom'

function AdminMemberManagement() {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div id="mobileBackdrop" className="fixed inset-0 bg-black/40 z-40 lg:hidden hidden transition-opacity duration-300 backdrop-blur-sm"></div>
      {/* Outer Dashboard Flex Frame */}
      <div className="flex-1 flex h-screen w-screen overflow-hidden">
        {/* ========================================================================= */}
        {/* 1. LEFT SIDEBAR (NAVIGATION) */}
        {/* ========================================================================= */}
        <aside id="sidebar" className="w-72 bg-[#FDFBF6] border-r border-[#DCE3D5] flex flex-col z-50 fixed lg:static inset-y-0 left-0 transform -translate-x-full lg:translate-x-0 select-none">
          {/* Platform Branding & Logo */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-[#DCE3D5] shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-[#2F5233] flex items-center justify-center text-white shrink-0 border border-[#DCE3D5]">
                {/* Organic Leaf / Sprout Icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <button id="desktopSidebarCollapseBtn" title="Collapse Sidebar" className="hidden lg:flex p-1.5 rounded-lg text-[#6B6F63] hover:text-[#2B2A25] hover:bg-[#F3F6EE] transition-colors border border-transparent hover:border-[#DCE3D5]">
              <svg id="collapseIcon" className="w-5 h-5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
              </svg>
            </button>
            {/* Mobile Close Button */}
            <button className="lg:hidden p-1.5 rounded-lg text-[#6B6F63] hover:text-[#2B2A25] hover:bg-[#F3F6EE]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
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
                <svg id="arrow-overview" className="nav-arrow w-3.5 h-3.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              <div id="acc-overview" className="accordion-content expanded space-y-1">
                <Link to="/admin" className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors group">
                  <svg className="w-5 h-5 text-[#6B6F63] group-hover:text-[#2F5233] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
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
                <svg id="arrow-core" className="nav-arrow w-3.5 h-3.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              <div id="acc-core" className="accordion-content expanded space-y-1">
                <Link to="/admin/members" className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white bg-[#2F5233] hover:bg-[#25401F] transition-all">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  <span className="nav-text truncate font-semibold">
                    Member Management
                  </span>
                </Link>
                <Link to="/admin/categories" className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors group">
                  <svg className="w-5 h-5 text-[#6B6F63] group-hover:text-[#2F5233] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
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
                <svg id="arrow-moderation" className="nav-arrow w-3.5 h-3.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              <div id="acc-moderation" className="accordion-content expanded space-y-1">
                <Link to="/admin/content" className="nav-link flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <svg className="w-5 h-5 text-[#6B6F63] group-hover:text-[#2F5233] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span className="nav-text truncate">
                      Manual Moderation
                    </span>
                  </div>
                  <span className="nav-badge text-[11px] font-semibold bg-[#F3F6EE] text-[#6B6F63] border border-[#DCE3D5] px-2 py-0.5 rounded-lg">
                    12
                  </span>
                </Link>
                <Link to="/admin/ai-moderation" className="nav-link flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <svg className="w-5 h-5 text-[#B8791A] group-hover:text-[#2F5233] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
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
                <svg id="arrow-ai" className="nav-arrow w-3.5 h-3.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              <div id="acc-ai" className="accordion-content expanded space-y-1">
                <Link to="/admin/ai-monitoring" className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors group">
                  <svg className="w-5 h-5 text-[#4C8C4A] group-hover:text-[#2F5233] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <span className="nav-text truncate">
                    AI Model Monitoring
                  </span>
                </Link>
                <Link to="/admin/meal-planner-config" className="nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors group">
                  <svg className="w-5 h-5 text-[#6B6F63] group-hover:text-[#2F5233] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                  </svg>
                  <span className="nav-text truncate">
                    Meal Planner Config
                  </span>
                </Link>
                <Link to="/admin/video-summarization" className="nav-link flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <svg className="w-5 h-5 text-[#6B6F63] group-hover:text-[#2F5233] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              {/* Global Search Input */}
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B6F63]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input type="text" placeholder="Search members, recipes, categories, or AI logs... (Press '/' to focus)" className="w-full pl-10 pr-4 py-2 text-sm bg-[#F3F6EE] border border-[#DCE3D5] rounded-lg focus:bg-[#FDFBF6] focus:border-[#2F5233] focus:ring-1 focus:ring-[#2F5233] outline-none transition-all placeholder-[#6B6F63] text-[#2B2A25]" />
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
              <Link to="/home" title="View Public Platform" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2F5233] bg-[#EAF0E9] border border-[#DCE3D5] hover:bg-[#2F5233] hover:text-white rounded-lg transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                <span className="">
                  Live Site
                </span>
              </Link>
              {/* Notification Bell with Indicator Badge */}
              <div className="relative">
                <button id="notificationBtn" className="relative p-2 rounded-lg text-[#6B6F63] hover:text-[#2B2A25] hover:bg-[#F3F6EE] transition-colors border border-transparent hover:border-[#DCE3D5]" title="Notifications">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                  {/* Indicator Badge */}
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C1432E] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C1432E] border-2 border-[#FDFBF6]"></span>
                  </span>
                </button>
                {/* Notifications Dropdown Flyout with allowable subtle shadow */}
                <div id="notificationMenu" className="hidden absolute right-0 mt-2 w-80 bg-[#FDFBF6] rounded-xl shadow-[0_2px_12px_rgba(43,42,37,0.12)] border border-[#DCE3D5] py-2 z-50">
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
                    <a href="#all-notifications" className="text-xs text-[#2F5233] hover:underline font-medium">
                      View all notifications
                    </a>
                  </div>
                </div>
              </div>
              {/* Vertical Divider */}
              <div className="h-6 w-px bg-[#DCE3D5]"></div>
              {/* Admin Profile Section with Dropdown */}
              <div className="relative">
                <button id="profileBtn" className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-[#F3F6EE] transition-colors border border-transparent hover:border-[#DCE3D5]">
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
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                {/* Admin Dropdown Menu with allowable subtle shadow */}
                <div id="profileMenu" className="hidden absolute right-0 mt-2 w-52 bg-[#FDFBF6] rounded-xl shadow-[0_2px_12px_rgba(43,42,37,0.12)] border border-[#DCE3D5] py-1.5 z-50">
                  <div className="px-4 py-2 border-b border-[#DCE3D5] sm:hidden">
                    <p className="text-xs font-semibold text-[#2B2A25]">
                      Administrator
                    </p>
                    <p className="text-[10px] text-[#6B6F63]">
                      admin@bepchay.vn
                    </p>
                  </div>
                  <a href="#admin-settings" className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors">
                    <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span className="">
                      Admin Profile
                    </span>
                  </a>
                  <a href="#security" className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors">
                    <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    <span className="">
                      Security & Keys
                    </span>
                  </a>
                  <div className="h-px bg-[#DCE3D5] my-1"></div>
                  <Link to="/" className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors">
                    <svg className="w-4 h-4 text-[#ba1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
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
                  <span className="">
                    Admin Console
                  </span>
                  <span className="">
                    /
                  </span>
                  <span className="font-medium text-[#2B2A25]">
                    Core system
                  </span>
                  <span className="">
                    /
                  </span>
                  <span className="text-[#2F5233] font-semibold">
                    Member Management
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
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold font-['Libre_Caslon_Text',serif] text-[#2B2A25] tracking-tight">
                      Member Management
                    </h2>
                    <p className="text-sm text-[#6B6F63] mt-1 font-['Be_Vietnam_Pro',sans-serif]">
                      Monitor user accounts, role permissions, and active statuses across the platform.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#EAF0E9] text-[#2F5233] border border-[#DCE3D5]">
                      Total:
                      <strong className="font-bold text-[#0f2a0b]">
                        1,420
                      </strong>
                      members
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B6F63]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                    <input type="text" placeholder="Find users by name or email..." className="w-full pl-10 pr-4 py-2 text-sm bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg focus:border-[#2F5233] outline-none transition-colors placeholder-[#6B6F63] text-[#2B2A25]" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#FDFBF6] border border-[#DCE3D5] p-1 rounded-lg self-start sm:self-auto">
                    <button className="px-3 py-1 text-xs font-semibold rounded-lg bg-[#2F5233] text-white transition-colors">
                      All (1,420)
                    </button>
                    <button className="px-3 py-1 text-xs font-medium rounded-lg text-[#6B6F63] hover:text-[#2B2A25] hover:bg-[#F3F6EE] transition-colors">
                      Active (1,388)
                    </button>
                    <button className="px-3 py-1 text-xs font-medium rounded-lg text-[#6B6F63] hover:text-[#2B2A25] hover:bg-[#F3F6EE] transition-colors">
                      Suspended (32)
                    </button>
                  </div>
                </div>
                <div className="bg-[#FDFBF6] rounded-xl border border-[#DCE3D5] p-6 flex flex-col flex-1">
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead className="border-b border-[#DCE3D5] text-[11px] font-semibold text-[#6B6F63] tracking-wide">
                        <tr>
                          <th className="pb-3 px-3 font-semibold">
                            User
                          </th>
                          <th className="pb-3 px-3 font-semibold">
                            Email
                          </th>
                          <th className="pb-3 px-3 font-semibold">
                            Joined Date
                          </th>
                          <th className="pb-3 px-3 font-semibold">
                            Status
                          </th>
                          <th className="pb-3 px-3 font-semibold text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DCE3D5] text-[#2B2A25]">
                        <tr className="hover:bg-[#F3F6EE]/60 transition-colors">
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#c4edc3] text-[#0f2a0b] font-bold text-xs flex items-center justify-center border border-[#DCE3D5] shrink-0">
                                ML
                              </div>
                              <div>
                                <p className="font-medium text-[#2B2A25] text-sm leading-tight">
                                  Mai Linh
                                </p>
                                <p className="text-xs text-[#6B6F63]">
                                  @mailinh_chef • Verified Cook
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-xs text-[#6B6F63]">
                            mailinh.vegan@example.com
                          </td>
                          <td className="py-3.5 px-3 text-xs text-[#6B6F63]">
                            15/05/2024
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#EAF0E9] text-[#436746] border border-[#DCE3D5]">
                              Active
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="inline-flex items-center gap-3 text-xs font-medium">
                              <Link to="/my-posts" className="text-[#6B6F63] hover:text-[#2F5233] transition-colors">
                                View Posts
                              </Link>
                              <span className="text-[#DCE3D5]">
                                |
                              </span>
                              <button className="text-[#C1432E] hover:underline transition-colors">
                                Ban
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-[#F3F6EE]/60 transition-colors">
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#EAF0E9] text-[#2F5233] font-bold text-xs flex items-center justify-center border border-[#DCE3D5] shrink-0">
                                HT
                              </div>
                              <div>
                                <p className="font-medium text-[#2B2A25] text-sm leading-tight">
                                  Hoàng Thu Thảo
                                </p>
                                <p className="text-xs text-[#6B6F63]">
                                  @thuthaoveg • Community Member
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-xs text-[#6B6F63]">
                            thuthao.h@example.com
                          </td>
                          <td className="py-3.5 px-3 text-xs text-[#6B6F63]">
                            02/06/2024
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#EAF0E9] text-[#436746] border border-[#DCE3D5]">
                              Active
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="inline-flex items-center gap-3 text-xs font-medium">
                              <Link to="/my-posts" className="text-[#6B6F63] hover:text-[#2F5233] transition-colors">
                                View Posts
                              </Link>
                              <span className="text-[#DCE3D5]">
                                |
                              </span>
                              <button className="text-[#C1432E] hover:underline transition-colors">
                                Ban
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-[#F3F6EE]/60 transition-colors">
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#2F5233] text-white font-bold text-xs flex items-center justify-center border border-[#DCE3D5] shrink-0">
                                CD
                              </div>
                              <div>
                                <p className="font-medium text-[#2B2A25] text-sm leading-tight">
                                  Chef Duy
                                </p>
                                <p className="text-xs text-[#6B6F63]">
                                  @chefduy_culinary • Certified Chef
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-xs text-[#6B6F63]">
                            duy.culinary@botanical.vn
                          </td>
                          <td className="py-3.5 px-3 text-xs text-[#6B6F63]">
                            20/04/2024
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#EAF0E9] text-[#436746] border border-[#DCE3D5]">
                              Active
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="inline-flex items-center gap-3 text-xs font-medium">
                              <Link to="/my-posts" className="text-[#6B6F63] hover:text-[#2F5233] transition-colors">
                                View Posts
                              </Link>
                              <span className="text-[#DCE3D5]">
                                |
                              </span>
                              <button className="text-[#C1432E] hover:underline transition-colors">
                                Ban
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-[#F3F6EE]/60 transition-colors">
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#ffdad6] text-[#ba1a1a] font-bold text-xs flex items-center justify-center border border-[#DCE3D5] shrink-0">
                                PM
                              </div>
                              <div>
                                <p className="font-medium text-[#2B2A25] text-sm leading-tight">
                                  Phạm Văn Minh
                                </p>
                                <p className="text-xs text-[#6B6F63]">
                                  @minh_pv • Violations reported
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-xs text-[#6B6F63]">
                            minh.pv91@example.com
                          </td>
                          <td className="py-3.5 px-3 text-xs text-[#6B6F63]">
                            11/01/2024
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#ffdad6] text-[#ba1a1a] border border-[#DCE3D5]">
                              Banned
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="inline-flex items-center gap-3 text-xs font-medium">
                              <Link to="/my-posts" className="text-[#6B6F63] hover:text-[#2F5233] transition-colors">
                                View Posts
                              </Link>
                              <span className="text-[#DCE3D5]">
                                |
                              </span>
                              <button className="text-[#4C8C4A] hover:underline transition-colors">
                                Unban
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-[#F3F6EE]/60 transition-colors">
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#EAF0E9] text-[#2F5233] font-bold text-xs flex items-center justify-center border border-[#DCE3D5] shrink-0">
                                LM
                              </div>
                              <div>
                                <p className="font-medium text-[#2B2A25] text-sm leading-tight">
                                  Lê Ngọc Mai
                                </p>
                                <p className="text-xs text-[#6B6F63]">
                                  @ngocmai_green • Nutritionist
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-xs text-[#6B6F63]">
                            ngocmai.nutrition@example.com
                          </td>
                          <td className="py-3.5 px-3 text-xs text-[#6B6F63]">
                            18/07/2024
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#EAF0E9] text-[#436746] border border-[#DCE3D5]">
                              Active
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="inline-flex items-center gap-3 text-xs font-medium">
                              <Link to="/my-posts" className="text-[#6B6F63] hover:text-[#2F5233] transition-colors">
                                View Posts
                              </Link>
                              <span className="text-[#DCE3D5]">
                                |
                              </span>
                              <button className="text-[#C1432E] hover:underline transition-colors">
                                Ban
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr className="hover:bg-[#F3F6EE]/60 transition-colors">
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#c4edc3] text-[#0f2a0b] font-bold text-xs flex items-center justify-center border border-[#DCE3D5] shrink-0">
                                TH
                              </div>
                              <div>
                                <p className="font-medium text-[#2B2A25] text-sm leading-tight">
                                  Tran Ha
                                </p>
                                <p className="text-xs text-[#6B6F63]">
                                  @tran_ha_plant • Community Member
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-xs text-[#6B6F63]">
                            tran.ha@example.org
                          </td>
                          <td className="py-3.5 px-3 text-xs text-[#6B6F63]">
                            29/08/2024
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#EAF0E9] text-[#436746] border border-[#DCE3D5]">
                              Active
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="inline-flex items-center gap-3 text-xs font-medium">
                              <Link to="/my-posts" className="text-[#6B6F63] hover:text-[#2F5233] transition-colors">
                                View Posts
                              </Link>
                              <span className="text-[#DCE3D5]">
                                |
                              </span>
                              <button className="text-[#C1432E] hover:underline transition-colors">
                                Ban
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="pt-4 mt-4 border-t border-[#DCE3D5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B6F63]">
                    <div className="">
                      Showing
                      <span className="font-semibold text-[#2B2A25]">
                        1 - 6
                      </span>
                      of
                      <span className="font-semibold text-[#2B2A25]">
                        1,420
                      </span>
                      members
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button className="px-3 py-1.5 rounded-lg border border-[#DCE3D5] bg-[#FDFBF6] text-[#6B6F63] hover:bg-[#F3F6EE] hover:text-[#2B2A25] transition-colors">
                        Previous
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-[#2F5233] text-white font-semibold transition-colors">
                        1
                      </button>
                      <button className="px-3 py-1.5 rounded-lg border border-[#DCE3D5] bg-[#FDFBF6] text-[#6B6F63] hover:bg-[#F3F6EE] hover:text-[#2B2A25] transition-colors">
                        2
                      </button>
                      <button className="px-3 py-1.5 rounded-lg border border-[#DCE3D5] bg-[#FDFBF6] text-[#6B6F63] hover:bg-[#F3F6EE] hover:text-[#2B2A25] transition-colors">
                        3
                      </button>
                      <span className="px-1 text-[#6B6F63]">
                        ...
                      </span>
                      <button className="px-3 py-1.5 rounded-lg border border-[#DCE3D5] bg-[#FDFBF6] text-[#6B6F63] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors">
                        237
                      </button>
                      <button className="px-3 py-1.5 rounded-lg border border-[#DCE3D5] bg-[#FDFBF6] text-[#6B6F63] hover:bg-[#F3F6EE] hover:text-[#2B2A25] transition-colors">
                        Next
                      </button>
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
                  <a href="#docs" className="hover:text-[#2F5233] transition-colors">
                    Admin Guidelines
                  </a>
                  <a href="#api" className="hover:text-[#2F5233] transition-colors">
                    MLOps Status
                  </a>
                  <a href="#support" className="hover:text-[#2F5233] transition-colors">
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

export default AdminMemberManagement;
