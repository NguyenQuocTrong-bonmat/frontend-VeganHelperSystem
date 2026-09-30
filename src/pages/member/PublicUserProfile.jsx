import { Link } from 'react-router-dom'

function PublicUserProfile() {
  return (
    <>
      {/* Global Logged-in Top Navbar */}
      <header className="sticky top-0 z-40 bg-surface-paper border-b border-border-sage-mist h-16 w-full flex items-center px-4 sm:px-8">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-primary-moss/10 border border-primary-moss/20 flex items-center justify-center text-primary-moss group-hover:bg-primary-moss group-hover:text-white transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12a10 10 0 0 1 10-10Z"></path>
                <path d="M8.5 12c1 3.5 4.5 4.5 7 4.5"></path>
                <path d="M12 8.5c2 2 3.5 4 3.5 8"></path>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-caslon text-xl tracking-tight font-bold text-primary-moss leading-none">
                Botanical Hearth
              </span>
              <span className="text-[10px] uppercase tracking-widest text-text-stem-gray font-medium">
                Plant-Based Community
              </span>
            </div>
          </a>
          {/* Navigation Links (Logged-in User A viewing app) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/home" className="text-sm font-medium text-text-stem-gray hover:text-primary-moss transition-colors py-1">
              Home
            </Link>
            <Link to="/weekly-menu" className="text-sm font-medium text-text-stem-gray hover:text-primary-moss transition-colors py-1">
              Weekly Menu
            </Link>
            <Link to="/vegan-stores" className="text-sm font-medium text-text-stem-gray hover:text-primary-moss transition-colors py-1">
              Find Vegan Stores
            </Link>
            <Link to="/my-posts" className="text-sm font-medium text-text-stem-gray hover:text-primary-moss transition-colors py-1">
              My Posts
            </Link>
          </nav>
          {/* Right Action & Profile Avatar of User A */}
          <div className="flex items-center justify-end gap-6">
            {/* Search icon quick trigger */}
            {/* Notification Bell Container */}
            <div className="relative">
              <button id="notification-bell-btn" aria-label="Notifications" className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-border-sage-mist text-text-stem-gray hover:text-primary-moss hover:bg-bg-herb-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-moss">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                </svg>
                {/* Unread dot badge set to primary-moss */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-moss ring-2 ring-surface-paper"></span>
              </button>
              {/* Notification Dropdown Menu */}
              <div id="notification-dropdown" className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-surface-paper border border-border-sage-mist rounded-xl shadow-[0_2px_12px_rgba(43,42,37,0.12)] z-50 overflow-hidden text-left">
                {/* Header */}
                <div className="p-4 border-b border-border-sage-mist flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-caslon text-base font-bold text-text-charcoal">
                      Notifications
                    </h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary-moss/10 text-primary-moss">
                      2 new
                    </span>
                  </div>
                  <button className="text-xs text-text-stem-gray hover:text-primary-moss font-medium transition-colors">
                    Mark all as read
                  </button>
                </div>
                {/* Notification Items List */}
                <div className="divide-y divide-border-sage-mist max-h-80 overflow-y-auto">
                  {/* Item 1 (Unread) */}
                  <a href="#" className="flex items-start gap-3 p-3.5 bg-bg-herb-white hover:bg-bg-herb-white/80 transition-colors relative group">
                    <div className="w-8 h-8 rounded-full bg-[#E5ECE0] border border-border-sage-mist flex-shrink-0 flex items-center justify-center text-primary-moss font-semibold text-xs overflow-hidden">
                      AL
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-xs text-text-charcoal leading-snug">
                        <strong className="font-semibold text-text-charcoal">
                          Anna Le
                        </strong>
                        liked your recipe
                        <span className="text-primary-moss font-medium">
                          ‘Caramelized Claypot Oyster Mushrooms’
                        </span>
                      </p>
                      <span className="text-[11px] text-text-stem-gray mt-1 block">
                        5m ago
                      </span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-primary-moss flex-shrink-0 mt-1.5" title="Unread"></span>
                  </a>
                  {/* Item 2 (Unread) */}
                  <a href="#" className="flex items-start gap-3 p-3.5 bg-bg-herb-white hover:bg-bg-herb-white/80 transition-colors relative group">
                    <div className="w-8 h-8 rounded-full bg-accent-turmeric/10 border border-border-sage-mist flex-shrink-0 flex items-center justify-center text-accent-turmeric font-semibold text-xs overflow-hidden">
                      CD
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-xs text-text-charcoal leading-snug">
                        <strong className="font-semibold text-text-charcoal">
                          Chef Duy
                        </strong>
                        commented:
                        <span className="italic text-text-stem-gray">
                          “The cross-hatch knife technique gives stunning texture!”
                        </span>
                      </p>
                      <span className="text-[11px] text-text-stem-gray mt-1 block">
                        2h ago
                      </span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-primary-moss flex-shrink-0 mt-1.5" title="Unread"></span>
                  </a>
                  {/* Item 3 (Read) */}
                  <a href="#" className="flex items-start gap-3 p-3.5 hover:bg-bg-herb-white/50 transition-colors relative group">
                    <div className="w-8 h-8 rounded-full bg-primary-moss/10 border border-border-sage-mist flex-shrink-0 flex items-center justify-center text-primary-moss">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12a10 10 0 0 1 10-10Z"></path>
                        <path d="M12 8.5c2 2 3.5 4 3.5 8"></path>
                      </svg>
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-xs text-text-stem-gray leading-snug">
                        Your
                        <strong className="font-semibold text-text-charcoal">
                          Weekly Seasonal Menu
                        </strong>
                        recommendations are ready to explore.
                      </p>
                      <span className="text-[11px] text-text-stem-gray mt-1 block">
                        Yesterday
                      </span>
                    </div>
                  </a>
                </div>
                {/* Footer Link */}
                <div className="p-3 border-t border-border-sage-mist bg-surface-paper text-center">
                  <a href="#" className="text-xs font-semibold text-primary-moss hover:text-primary-moss-hover transition-colors inline-block">
                    View all notifications
                  </a>
                </div>
              </div>
            </div>
            {/* User Avatar Container */}
            <div className="relative group">
              <button id="avatar-btn" className="flex items-center gap-2.5 p-1 rounded-full border border-border-sage-mist hover:border-primary-moss transition-colors bg-surface-paper focus:outline-none focus:ring-2 focus:ring-primary-moss">
                <div className="w-8 h-8 rounded-full bg-[#E5ECE0] border border-border-sage-mist flex items-center justify-center text-primary-moss font-semibold text-xs overflow-hidden">
                  <span className="font-medium">
                    UA
                  </span>
                </div>
                <svg className="w-3.5 h-3.5 text-text-stem-gray mr-1 hidden sm:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Sub-header Breadcrumb Context */}
      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        {/* 1. Profile Header Card (User B's Public Profile) */}
        <section className="bg-surface-paper border border-border-sage-mist rounded-xl p-6 sm:p-8 md:p-10 shadow-none text-center relative overflow-hidden mb-10">
          {/* Subtle organic botanical backdrop decorative line */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary-moss/5 pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-accent-turmeric/5 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
            {/* Large Avatar (rounded-full) with Verification Badge */}
            <div className="relative mb-4">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-surface-paper border-2 border-primary-moss/30 shadow-none flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#E6ECE1] border border-border-sage-mist flex items-center justify-center overflow-hidden">
                  {/* Illustrated botanical chef portrait representation */}
                  <svg className="w-16 h-16 text-primary-moss/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
              {/* Verified Sprout Badge */}
              <div className="absolute bottom-1 right-1 bg-primary-moss text-white w-7 h-7 rounded-full flex items-center justify-center border-2 border-surface-paper shadow-none" title="Verified Creator">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
            {/* User's Display Name (Libre Caslon Text) */}
            <h1 className="font-caslon text-2xl sm:text-3xl md:text-4xl text-text-charcoal font-bold tracking-tight mb-1.5">
              Linh Nguyen
            </h1>
            <p className="text-xs sm:text-sm font-medium text-text-stem-gray tracking-wide mb-3.5">
              @linh_cooks_vegan · Joined March 2023
            </p>
            {/* Short Bio and Specialties removed per user request */}
            {/* Clean Row Stats: Followers & Total Posts in text-charcoal */}
            <div className="w-full max-w-md grid grid-cols-2 divide-x divide-border-sage-mist py-3.5 px-4 mb-7 bg-bg-herb-white/80 border border-border-sage-mist rounded-lg">
              <div className="flex flex-col items-center">
                <span className="text-xl sm:text-2xl font-bold font-caslon text-text-charcoal leading-tight">
                  2,480
                </span>
                <span className="text-xs font-medium text-text-stem-gray mt-0.5">
                  Followers
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl sm:text-2xl font-bold font-caslon text-text-charcoal leading-tight">
                  18
                </span>
                <span className="text-xs font-medium text-text-stem-gray mt-0.5">
                  Total Posts
                </span>
              </div>
            </div>
            {/* Action: Primary "Follow" button (bg: primary-moss #2F5233, text: white, rounded 8px) */}
            <div className="flex items-center gap-3">
              <button id="follow-btn" className="inline-flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg bg-primary-moss hover:bg-primary-moss-hover active:scale-[0.98] text-white font-medium text-sm transition-all duration-150 min-h-[44px]">
                <svg id="follow-icon" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <line x1="19" y1="8" x2="19" y2="14"></line>
                  <line x1="22" y1="11" x2="16" y2="11"></line>
                </svg>
                <span id="follow-text" className="">
                  Follow
                </span>
              </button>
              {/* Share profile secondary button */}
              <button className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-border-sage-mist bg-surface-paper text-text-stem-gray hover:text-primary-moss hover:border-primary-moss transition-colors" title="Share profile">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </button>
            </div>
          </div>
        </section>
        {/* 2. Content Grid Section (User B's Recipes & Blogs) */}
        <section>
          {/* Section Filter / Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-border-sage-mist">
            <div className="flex items-center gap-3">
              <h2 className="font-caslon text-2xl text-text-charcoal font-semibold">
                Published Recipes & Articles
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-border-sage-mist/60 text-text-charcoal">
                18
              </span>
            </div>
            {/* Filter Tabs for Visitor */}
            <div className="flex items-center gap-1 bg-surface-paper p-1 rounded-lg border border-border-sage-mist text-xs">
              <button className="bg-primary-moss text-bg-herb-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                All Posts
              </button>
              <button className="bg-transparent text-text-stem-gray hover:text-primary-moss px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                Articles & Recipes
              </button>
              <button className="bg-transparent text-text-stem-gray hover:text-primary-moss px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                Video Guides
              </button>
            </div>
          </div>
          {/* Responsive Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
          {/* Post Card styling: surface-paper, 1px solid border-sage-mist, rounded 12px. NO SHADOW. NO Edit/Delete buttons. */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Claypot Oyster Mushrooms */}
            <article className="bg-surface-paper border border-border-sage-mist rounded-xl overflow-hidden shadow-none flex flex-col group hover:border-primary-moss/60 transition-colors">
              <div className="relative aspect-[16/10] bg-[#EAEFE5] overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida/AEtjO1WKcDwGR2GO1h8uT61hNF-s_62zOYXjY8wzlx8-YVN9qcyiWrINEaKUq1DV-gcQ-G7syVZEwHgyWph99ZzTpvTqJOjzjemUgHoHjo3bb00YP4VDdU3xDibxsswo6LbTzG4g7QCyuSTjBB8Y_0mQ57bOen8CA2NXIAsnJwC0eevQaGHA0yF_XXpq9R37yeuGktzM_K2CU24bUaiE8ADGempXrmLk1iKtN9tkU23B4jXFT560t4_50GAzSLI" alt="Claypot oyster mushrooms" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                <div className="absolute top-3 left-3 bg-surface-paper/90 backdrop-blur-sm border border-border-sage-mist px-2.5 py-1 rounded-md text-[11px] font-medium text-primary-moss flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-moss"></span>
                  Main Dish
                </div>
                <div className="absolute top-3 right-3 bg-text-charcoal/70 text-white text-[10px] font-medium px-2 py-0.5 rounded">
                  1/4
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-text-stem-gray mb-2">
                  <svg className="w-3.5 h-3.5 text-text-stem-gray" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span className="">
                    Published Oct 14, 2024
                  </span>
                  <span className="">
                    ·
                  </span>
                  <span className="">
                    25 min prep
                  </span>
                </div>
                <h3 className="font-caslon text-lg font-bold text-text-charcoal group-hover:text-primary-moss transition-colors leading-snug mb-2">
                  Caramelized Claypot Oyster Mushrooms with Sweet Soy & Thai Basil
                </h3>
                <p className="text-xs text-text-stem-gray leading-relaxed line-clamp-2 mb-4 flex-grow">
                  Authentic Vietnamese kho chay technique utilizing fresh king oyster mushrooms simmered in sweet soy glaze and fragrant cracked black pepper.
                </p>
                <div className="pt-3 border-t border-border-sage-mist flex items-center justify-between text-xs text-text-stem-gray">
                  <span className="inline-flex items-center gap-1 text-accent-beetroot font-semibold">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>
                    124
                  </span>
                  <span className="text-primary-moss font-medium group-hover:underline">
                    Read Recipe
                  </span>
                </div>
              </div>
            </article>
            {/* Card 2: Silken Tofu & Shiitake Broth */}
            <article className="bg-surface-paper border border-border-sage-mist rounded-xl overflow-hidden shadow-none flex flex-col group hover:border-primary-moss/60 transition-colors">
              <div className="relative aspect-[16/10] bg-[#EAEFE5] overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida/AEtjO1XzWa2CLI5VpF6lv2Se2NFKuKMJhpurIjsEnRdbq0Qq8yLg5eWbrGzs7a2Q7P-7F4b-DlE0CCNDOepbIKgjqFO3IgTO8q0pIDTmZInCz933PUbUywI62QpWlglFnYOJmyoDZW46J0CStifGdW4gHWI__lBUngz1XVw2eGFdoDb9lzox8d2q2wUq2mtH1O8YUHuLzyQt7Yx3BeprIhMpIhkhq2_xsTujcZDzuSu9NUUzAvBD8XUBnPE4rEM" alt="Silken tofu soup" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                <div className="absolute top-3 left-3 bg-surface-paper/90 backdrop-blur-sm border border-border-sage-mist px-2.5 py-1 rounded-md text-[11px] font-medium text-accent-turmeric flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-turmeric"></span>
                  Soups & Broths
                </div>
                <div className="absolute top-3 right-3 bg-text-charcoal/70 text-white text-[10px] font-medium px-2 py-0.5 rounded">
                  1/3
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-text-stem-gray mb-2">
                  <svg className="w-3.5 h-3.5 text-text-stem-gray" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span className="">
                    Published Oct 02, 2024
                  </span>
                  <span className="">
                    ·
                  </span>
                  <span className="">
                    30 min prep
                  </span>
                </div>
                <h3 className="font-caslon text-lg font-bold text-text-charcoal group-hover:text-primary-moss transition-colors leading-snug mb-2">
                  Steaming Silken Tofu & Forest Shiitake Nourishing Herbal Broth
                </h3>
                <p className="text-xs text-text-stem-gray leading-relaxed line-clamp-2 mb-4 flex-grow">
                  Gentle morning comfort soup brewed with dried forest shiitake, sweet corn cobs, and handcrafted soft silken tofu cubes.
                </p>
                <div className="pt-3 border-t border-border-sage-mist flex items-center justify-between text-xs text-text-stem-gray">
                  <span className="inline-flex items-center gap-1 text-accent-beetroot font-semibold">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>
                    124
                  </span>
                  <span className="text-primary-moss font-medium group-hover:underline">
                    Read Recipe
                  </span>
                </div>
              </div>
            </article>
            {/* Card 3: Video Guide Braised King Oyster (Video Variant) */}
            <article className="bg-surface-paper border border-border-sage-mist rounded-xl overflow-hidden shadow-none flex flex-col group hover:border-primary-moss/60 transition-colors">
              <div className="relative aspect-[16/10] bg-[#EAEFE5] overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida/AEtjO1WpWnTW3IliMcPvAEqMET47e7nvomtpGiUFVxPFVJsewU31dL3vBDsUadPlj_M0vakri4y7awqWj7lKfo6DLFvgJSCpKr6YnjqB-w54xzY0eYy8Rxh9rwXXcnmsgf_jhIiWDsgvjzXwWTarZKBVZMmNx0iuQV7m9h7GxfNlKQJvZ3j_KBs5orPc0tFCUFcPaGrYnIiJmxd1DI-up6x0OUILcVG3xoY9BjUSALB9AmH54gtmWNcKA9CjlUA" alt="Braised king oyster video" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                {/* Video indicator overlay */}
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-primary-moss/90 text-white flex items-center justify-center shadow-none group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"></path>
                    </svg>
                  </div>
                </div>
                <div className="absolute top-3 left-3 bg-surface-paper/90 backdrop-blur-sm border border-border-sage-mist px-2.5 py-1 rounded-md text-[11px] font-medium text-accent-beetroot flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-beetroot"></span>
                  Video Guide
                </div>
                <div className="absolute bottom-3 right-3 bg-text-charcoal/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  12:34
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-text-stem-gray mb-2">
                  <svg className="w-3.5 h-3.5 text-text-stem-gray" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span className="">
                    Published Sep 28, 2024
                  </span>
                  <span className="">
                    ·
                  </span>
                  <span className="">
                    Video Masterclass
                  </span>
                </div>
                <h3 className="font-caslon text-lg font-bold text-text-charcoal group-hover:text-primary-moss transition-colors leading-snug mb-2">
                  Step-by-Step: Braised King Oyster Mushrooms with Fresh Green Peppercorns
                </h3>
                <p className="text-xs text-text-stem-gray leading-relaxed line-clamp-2 mb-4 flex-grow">
                  Master the exact knife cross-hatch scoring technique that allows king oyster stems to absorb intense aromatic marinades like steak.
                </p>
                <div className="pt-3 border-t border-border-sage-mist flex items-center justify-between text-xs text-text-stem-gray">
                  <span className="inline-flex items-center gap-1 text-accent-beetroot font-semibold">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>
                    124
                  </span>
                  <span className="text-primary-moss font-medium group-hover:underline">
                    Watch Video
                  </span>
                </div>
              </div>
            </article>
            {/* Card 4: Crispy Lemongrass Tofu */}
            <article className="bg-surface-paper border border-border-sage-mist rounded-xl overflow-hidden shadow-none flex flex-col group hover:border-primary-moss/60 transition-colors">
              <div className="relative aspect-[16/10] bg-[#EAEFE5] overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida/AEtjO1XbE3-4cIUZ4bq37r8Yx9BLHgsWYqvqiyQT-TqWhCUxjo-bcZRwr0zSF3r-gN0_NK6joaWF4bvRYxlQ-klHsfG3Ayua7f3ekfJVhE7xqLlPz1TCSQ_4XWTe1QrulAgbQzX6RWL1n3mBK7ThUqkbDKFUPTAv8j0LcI4r22g6F67B4lu2RGolXakke-OFWH4ADv8BXlynseWChvvzwUaa3www7sbvZh-rd6LCnxhTWrF0NB21-YdAJtr3UAs" alt="Lemongrass chili tofu" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                <div className="absolute top-3 left-3 bg-surface-paper/90 backdrop-blur-sm border border-border-sage-mist px-2.5 py-1 rounded-md text-[11px] font-medium text-primary-moss flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-moss"></span>
                  Quick Dinners
                </div>
                <div className="absolute top-3 right-3 bg-text-charcoal/70 text-white text-[10px] font-medium px-2 py-0.5 rounded">
                  1/2
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-text-stem-gray mb-2">
                  <svg className="w-3.5 h-3.5 text-text-stem-gray" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span className="">
                    Published Sep 15, 2024
                  </span>
                  <span className="">
                    ·
                  </span>
                  <span className="">
                    18 min prep
                  </span>
                </div>
                <h3 className="font-caslon text-lg font-bold text-text-charcoal group-hover:text-primary-moss transition-colors leading-snug mb-2">
                  Golden Pan-Fried Tofu with Minced Lemongrass, Chili & Roasted Sesame
                </h3>
                <p className="text-xs text-text-stem-gray leading-relaxed line-clamp-2 mb-4 flex-grow">
                  Crisp exterior with pillow-soft interior, coated in fragrant wok-tossed lemongrass shards, bird's eye chili, and nutty sesame seeds.
                </p>
                <div className="pt-3 border-t border-border-sage-mist flex items-center justify-between text-xs text-text-stem-gray">
                  <span className="inline-flex items-center gap-1 text-accent-beetroot font-semibold">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>
                    124
                  </span>
                  <span className="text-primary-moss font-medium group-hover:underline">
                    Read Recipe
                  </span>
                </div>
              </div>
            </article>
            {/* Card 5: Banana Blossom Salad */}
            <article className="bg-surface-paper border border-border-sage-mist rounded-xl overflow-hidden shadow-none flex flex-col group hover:border-primary-moss/60 transition-colors">
              <div className="relative aspect-[16/10] bg-[#EAEFE5] overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida/AEtjO1Vg-qfSmhz0wmNociW2JI-LpplsY_hhYhjzPDUa-ukgYaSY52N3BKo2MaYe5Q4eiXsvUtBgprUIS_qd_Yt6PkMxanDVcSqftvoaKxm4J_AiHULIy89qh0mQc2mlUDGKjn_sisydSWD7jl01hgjMPjGrgTvYMMvnj2wux5YOFLyp6evgziGIVIeqhjDrtJoFWj-Gedr4AegXZN2Tyfam2mz-soiq3U1Z3Ox0L1j0VJvoJetEEoiY5SqQQCI" alt="Banana blossom salad" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                <div className="absolute top-3 left-3 bg-surface-paper/90 backdrop-blur-sm border border-border-sage-mist px-2.5 py-1 rounded-md text-[11px] font-medium text-primary-moss flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-moss"></span>
                  Fresh Salads
                </div>
                <div className="absolute top-3 right-3 bg-text-charcoal/70 text-white text-[10px] font-medium px-2 py-0.5 rounded">
                  1/4
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-text-stem-gray mb-2">
                  <svg className="w-3.5 h-3.5 text-text-stem-gray" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span className="">
                    Published Sep 01, 2024
                  </span>
                  <span className="">
                    ·
                  </span>
                  <span className="">
                    20 min prep
                  </span>
                </div>
                <h3 className="font-caslon text-lg font-bold text-text-charcoal group-hover:text-primary-moss transition-colors leading-snug mb-2">
                  Shredded Purple Banana Blossom Salad with Calamansi & Roasted Peanuts
                </h3>
                <p className="text-xs text-text-stem-gray leading-relaxed line-clamp-2 mb-4 flex-grow">
                  Crisp raw banana inflorescence soaked in lemon water, tossed with fresh laksa mint, crushed roasted peanuts, and tart calamansi dressing.
                </p>
                <div className="pt-3 border-t border-border-sage-mist flex items-center justify-between text-xs text-text-stem-gray">
                  <span className="inline-flex items-center gap-1 text-accent-beetroot font-semibold">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>
                    124
                  </span>
                  <span className="text-primary-moss font-medium group-hover:underline">
                    Read Recipe
                  </span>
                </div>
              </div>
            </article>
            {/* Card 6: Young Jackfruit Braised */}
            <article className="bg-surface-paper border border-border-sage-mist rounded-xl overflow-hidden shadow-none flex flex-col group hover:border-primary-moss/60 transition-colors">
              <div className="relative aspect-[16/10] bg-[#EAEFE5] overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida/AEtjO1Ude7R11IRRpW2c9kLST45kXxemd6HOkh2-3ywiA-NEd9BFFlae2UOlQHWXuk8S78GKCMsukyOUOynA_N7Gc8U60OoApLxfzXOb9RBn6H42RsA04OziYAc7bo40OIuNe7Emdbspcw0hZJQRJbAPUgroKPHCVnlWmVNeqHAdF1WUaI2X1SuwQx4vr4ktGCK0_PO0JMuaPKkRxeDk4r9CkBCLZgNvgxaa5yWnXS9OHik61nlauWRd5Zn2Bhc" alt="Young jackfruit braised" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                <div className="absolute top-3 left-3 bg-surface-paper/90 backdrop-blur-sm border border-border-sage-mist px-2.5 py-1 rounded-md text-[11px] font-medium text-primary-moss flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-moss"></span>
                  Traditional Comfort
                </div>
                <div className="absolute top-3 right-3 bg-text-charcoal/70 text-white text-[10px] font-medium px-2 py-0.5 rounded">
                  1/3
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-text-stem-gray mb-2">
                  <svg className="w-3.5 h-3.5 text-text-stem-gray" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span className="">
                    Published Aug 20, 2024
                  </span>
                  <span className="">
                    ·
                  </span>
                  <span className="">
                    45 min prep
                  </span>
                </div>
                <h3 className="font-caslon text-lg font-bold text-text-charcoal group-hover:text-primary-moss transition-colors leading-snug mb-2">
                  Rustic Young Green Jackfruit Braised with Termite Mushrooms & Coconut Jus
                </h3>
                <p className="text-xs text-text-stem-gray leading-relaxed line-clamp-2 mb-4 flex-grow">
                  Tender young jackfruit wedges simmered slowly in sweet coconut water until meat-like in texture, paired with rare forest termite mushrooms.
                </p>
                <div className="pt-3 border-t border-border-sage-mist flex items-center justify-between text-xs text-text-stem-gray">
                  <span className="inline-flex items-center gap-1 text-accent-beetroot font-semibold">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>
                    124
                  </span>
                  <span className="text-primary-moss font-medium group-hover:underline">
                    Read Recipe
                  </span>
                </div>
              </div>
            </article>
          </div>
          {/* Pagination / Load More */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-border-sage-mist text-xs text-text-stem-gray">
            <span className="">
              Showing 6 of 18 recipes by Linh Nguyen
            </span>
            <div className="flex items-center gap-1.5">
              <button className="px-3 py-1.5 rounded-lg border border-border-sage-mist bg-surface-paper text-text-stem-gray disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1.5 rounded-lg border border-primary-moss bg-primary-moss text-white font-medium">
                1
              </button>
              <button className="px-3 py-1.5 rounded-lg border border-border-sage-mist bg-surface-paper text-text-charcoal hover:bg-bg-herb-white">
                2
              </button>
              <button className="px-3 py-1.5 rounded-lg border border-border-sage-mist bg-surface-paper text-text-charcoal hover:bg-bg-herb-white">
                3
              </button>
              <button className="px-3 py-1.5 rounded-lg border border-border-sage-mist bg-surface-paper text-text-charcoal hover:bg-bg-herb-white">
                Next
              </button>
            </div>
          </div>
        </section>
      </main>
      {/* Global AI Nutrition Chatbot Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button id="chatbot-fab" className="w-14 h-14 rounded-full bg-primary-moss hover:bg-primary-moss-hover text-white flex items-center justify-center shadow-[0_2px_12px_rgba(43,42,37,0.12)] transition-all duration-150 focus:outline-none" title="AI Nutrition Assistant">
          {/* AI Sparkle 4-point star icon */}
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
          </svg>
        </button>
      </div>
      {/* Standardized Botanical Hearth Footer */}
      <footer className="bg-surface-paper border-t border-border-sage-mist py-8 px-4 sm:px-8 mt-16 text-xs text-text-stem-gray">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-caslon font-bold text-primary-moss text-base">
              Botanical Hearth
            </span>
            <span className="">
              ·
            </span>
            <span className="">
              Pure Plant-Based Culinary & Nutrition Platform
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary-moss transition-colors">
              About Us
            </a>
            <a href="#" className="hover:text-primary-moss transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary-moss transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary-moss transition-colors">
              Contact Support
            </a>
          </div>
          <div>
            <span className="">
              © 2025 Botanical Hearth. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
      {/* Script for Interactive Follow State */}
      {/* TODO: script goc da bi loai bo, can port lai logic bang useState/useEffect */}
    </>
  );
}

export default PublicUserProfile;
