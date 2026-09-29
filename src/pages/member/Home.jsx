import { Link } from 'react-router-dom'

function Home() {
  return (
    <>
      {/* HEADER-GUEST (Chuẩn 64px, surface-paper, viền border-sage-mist, không bóng) */}
      <header className="sticky top-0 z-50 h-16 bg-[#FDFBF6] border-b border-[#DCE3D5] flex items-center justify-between px-6 md:px-10 relative">
        <div className="flex items-center gap-3">
          {/* Logo Botanical Hearth */}
          <Link className="flex items-center gap-2.5 text-[#2F5233] hover:opacity-95 transition-opacity" to="/home">
            <svg className="w-6 h-6 text-[#2F5233]" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
            </svg>
            <span className="font-fraunces text-2xl font-semibold tracking-tight text-[#2F5233]">
              Botanical Hearth
            </span>
          </Link>
        </div>
        {/* Navigation Menu 4 items */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center gap-8 h-full">
          <Link className="relative flex items-center h-full text-[15px] font-semibold text-[#2F5233] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2F5233]" to="/home">
            Home
          </Link>
          <Link className="flex items-center h-full text-[15px] font-medium text-[#2B2A25] hover:text-[#2F5233] transition-colors" to="/weekly-menu">
            Weekly Menu
          </Link>
          <Link className="flex items-center h-full text-[15px] font-medium text-[#2B2A25] hover:text-[#2F5233] transition-colors" to="/vegan-stores">
            Find Vegan Stores
          </Link>
          <Link className="flex items-center h-full text-[15px] font-medium text-[#2B2A25] hover:text-[#2F5233] transition-colors" to="/my-posts">
            My Posts
          </Link>
        </nav>
        {/* Guest / User Actions */}
        <div className="flex items-center justify-end gap-6">
          <div className="relative flex items-center" id="notification-dropdown-container">
            <button aria-expanded="false" aria-haspopup="true" className="relative w-9 h-9 rounded-full border border-[#DCE3D5] flex items-center justify-center text-[#6B6F63] hover:text-[#2F5233] hover:border-[#2F5233] bg-[#FDFBF6] hover:bg-[#F3F6EE] transition-colors cursor-pointer focus:outline-none" id="notification-menu-button" title="Notifications" type="button">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" viewBox="0 0 24 24">
                <path d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"></path>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2F5233] ring-2 ring-[#FDFBF6]"></span>
            </button>
            <div className="hidden absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl modal-shadow z-50 overflow-hidden" id="notification-dropdown" role="region">
              <div className="p-4 border-b border-[#DCE3D5] flex items-center justify-between bg-[#FDFBF6]">
                <div className="flex items-center gap-2">
                  <h3 className="font-fraunces text-base font-semibold text-[#2B2A25]">
                    Notifications
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#E9EFE6] text-[#2F5233]">
                    2 new
                  </span>
                </div>
                <button className="text-[12px] text-[#6B6F63] hover:text-[#2F5233] transition-colors cursor-pointer font-medium">
                  Mark all as read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-[#DCE3D5]">
                <div className="p-3.5 bg-[#F3F6EE] flex items-start gap-3 hover:bg-[#E9EFE6]/70 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center shrink-0 text-[#2F5233] font-semibold text-xs mt-0.5">
                    AN
                  </div>
                  <div className="flex-1 text-[13px] leading-snug">
                    <p className="text-[#2B2A25]">
                      <strong className="font-semibold">
                        Anna Nguyen
                      </strong>
                      liked your recipe
                      <span className="italic font-medium text-[#2F5233]">
                        Crispy Pan-Fried Lemongrass & Chili Tofu
                      </span>
                    </p>
                    <span className="text-[11px] text-[#6B6F63] mt-1 block">
                      15m ago
                    </span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#2F5233] shrink-0 mt-2"></span>
                </div>
                <div className="p-3.5 bg-[#F3F6EE] flex items-start gap-3 hover:bg-[#E9EFE6]/70 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center shrink-0 text-[#2F5233] font-semibold text-xs mt-0.5">
                    CD
                  </div>
                  <div className="flex-1 text-[13px] leading-snug">
                    <p className="text-[#2B2A25]">
                      <strong className="font-semibold">
                        Chef Duy
                      </strong>
                      commented:
                      <span className="text-[#6B6F63]">
                        "The claypot caramelization technique looks delicious!"
                      </span>
                    </p>
                    <span className="text-[11px] text-[#6B6F63] mt-1 block">
                      1h ago
                    </span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#2F5233] shrink-0 mt-2"></span>
                </div>
                <div className="p-3.5 bg-transparent flex items-start gap-3 hover:bg-[#F3F6EE] transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center shrink-0 text-[#6B6F63] font-semibold text-xs mt-0.5">
                    TL
                  </div>
                  <div className="flex-1 text-[13px] leading-snug">
                    <p className="text-[#6B6F63]">
                      <strong className="font-semibold text-[#2B2A25]">
                        Thao Linh
                      </strong>
                      shared a new weekly menu plan:
                      <span className="font-medium text-[#2B2A25]">
                        Cleanse & Light
                      </span>
                    </p>
                    <span className="text-[11px] text-[#6B6F63] mt-1 block">
                      Yesterday
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-[#FDFBF6] border-t border-[#DCE3D5] text-center">
                <a className="text-[13px] font-medium text-[#2F5233] hover:underline underline-offset-4 cursor-pointer block" href="#notifications">
                  View all notifications
                </a>
              </div>
            </div>
          </div>
          <div className="relative flex items-center" id="profile-dropdown-container">
            <button aria-expanded="false" aria-haspopup="true" className="w-9 h-9 rounded-full border border-[#DCE3D5] flex items-center justify-center text-[#6B6F63] hover:text-[#2F5233] hover:border-[#2F5233] bg-[#FDFBF6] hover:bg-[#F3F6EE] transition-colors cursor-pointer focus:outline-none" id="profile-menu-button" title="User Account" type="button">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
            <div className="hidden absolute right-0 top-full mt-2 w-56 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg modal-shadow py-1.5 z-50 transition-all" id="profile-dropdown" role="menu">
              <Link className="flex items-center gap-3 px-4 h-11 text-sm text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors cursor-pointer" to="/profile" role="menuitem">
                <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <span className="font-medium">
                  My Profile
                </span>
              </Link>
              <Link className="flex items-center gap-3 px-4 h-11 text-sm text-[#2B2A25] hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors cursor-pointer" to="/admin" role="menuitem">
                <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <span className="font-medium">
                  Admin Dashboard
                </span>
              </Link>
              <div className="my-1 border-t border-[#DCE3D5]"></div>
              <Link className="flex items-center gap-3 px-4 h-11 text-sm text-[#A63446] hover:bg-[#F3F6EE] transition-colors cursor-pointer" to="/" role="menuitem">
                <svg className="w-4 h-4 text-[#A63446]" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <span className="font-medium text-[#A63446]">
                  Log Out
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* MAIN CONTENT CONTAINER (max-w 1120px, gutter 24px per DESIGN.md section 4) */}
      <main className="flex-1 w-full max-w-[1120px] mx-auto px-6 py-8 md:py-10">
        {/* SEARCH BAR SECTION */}
        <section className="mb-6" id="search-section">
          <div className="flex items-center gap-3 w-full max-w-[900px] mx-auto mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-[#6B6F63]" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
                </svg>
              </div>
              <input className="w-full h-12 pl-12 pr-12 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[15px] text-[#2B2A25] placeholder-[#6B6F63] focus:border-[#2F5233] focus:outline-none transition-colors font-medium" id="search-input" placeholder="Search recipes, video guides, vegan ingredients..." type="text" value="" />
            </div>
            <button className="h-12 px-6 bg-[#2F5233] hover:bg-[#25401F] text-white rounded-lg font-semibold text-[15px] flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 shadow-sm" type="button">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
              </svg>
              <span className="">
                Search
              </span>
            </button>
          </div>
        </section>
        {/* CATEGORY BAR (Vertical 3px color bar + lowercase category name per DESIGN.md section 6) */}
        <section className="mb-10">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {/* Tab All (Active) */}
            <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#2F5233] rounded-lg text-[14px] font-medium text-[#2F5233] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
              <span className="w-[3px] h-4 bg-[#2F5233] rounded-full"></span>
              <span className="">
                all
              </span>
            </button>
            {/* Category: Main Dishes (Moss) */}
            <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#2F5233] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
              <span className="w-[3px] h-4 bg-[#2F5233] rounded-full"></span>
              <span className="">
                main dishes
              </span>
            </button>
            {/* Category: Soups (Turmeric) */}
            <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#D9A441] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
              <span className="w-[3px] h-4 bg-[#D9A441] rounded-full"></span>
              <span className="">
                soups
              </span>
            </button>
            {/* Category: Salads (Beetroot) */}
            <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#A63446] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
              <span className="w-[3px] h-4 bg-[#A63446] rounded-full"></span>
              <span className="">
                salads
              </span>
            </button>
            {/* Category: Braised Dishes (Stem Gray) */}
            <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#6B6F63] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
              <span className="w-[3px] h-4 bg-[#6B6F63] rounded-full"></span>
              <span className="">
                braised dishes
              </span>
            </button>
            {/* Category: Desserts (Turmeric) */}
            <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#D9A441] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
              <span className="w-[3px] h-4 bg-[#D9A441] rounded-full"></span>
              <span className="">
                desserts
              </span>
            </button>
            {/* Category: Cooking Videos (Beetroot) */}
            <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#A63446] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
              <span className="w-[3px] h-4 bg-[#A63446] rounded-full"></span>
              <span className="">
                cooking videos
              </span>
            </button>
          </div>
        </section>
        {/* SECTION: FEATURED POST (Card lớn với ảnh hero bo góc bất đối xứng top-left 32px per DESIGN.md section 5) */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-fraunces text-2xl font-medium text-[#2B2A25]">
              Featured Post
            </h2>
            <span className="text-[13px] font-medium text-[#6B6F63]">
              Weekly recommendation
            </span>
          </div>
          <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center cursor-pointer hover:border-[#2F5233] transition-colors group" to="/posts/1">
            {/* Featured Image with Asymmetric Radius */}
            <div className="relative overflow-hidden lg:col-span-6 w-full h-64 md:h-80 bg-[#E9EFE6] border border-[#DCE3D5] hero-radius flex flex-col items-center justify-center p-4 text-center transition-transform group-hover:scale-[1.01]">
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-white text-[12px] font-medium z-10 font-vietnam" style={{ background: 'rgba(43, 42, 37, 0.6)' }}>
                1/5
              </span>
              <img src="https://lh3.googleusercontent.com/aida/AEtjO1WB5ue4YCiF80yX2LzmxjB651NSmec6AmpbmpsEy1yW2-RMH9r6Fa4PggMuAx5Grp-uwgUJ6OPHepQksJuRi6w6mXPryD_ffHB6dt4S8aLkuIaMrpE2GkbpHQ579qI0feP47eU3GW1We4Znk4_VP1cUcagdQ2fOCkgqdbLJORKO5mrR3oCKdmvYTWCmapm2oMAjUBSCNUXJgEwMVMlvDpkLFAW9v4-XBXy5P9u6krFA6hwJi5RXRipZfjI" alt="Claypot Braised King Oyster Mushrooms with Green Peppercorn" className="w-full h-full object-cover" />
            </div>
            {/* Featured Content */}
            <div className="lg:col-span-6 flex flex-col justify-between h-full py-1 text-left">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-[3px] h-4 bg-[#2F5233] rounded-full"></span>
                  <span className="text-[13px] font-medium text-[#6B6F63]">
                    main dishes
                  </span>
                  <span className="text-xs text-[#6B6F63]">
                    •
                  </span>
                  <span className="text-[13px] text-[#6B6F63]">
                    25 minutes ago
                  </span>
                </div>
                <h3 className="font-fraunces text-2xl md:text-3xl font-semibold text-[#2B2A25] group-hover:text-[#2F5233] transition-colors mb-3 leading-snug">
                  Claypot Braised King Oyster Mushrooms with Green Peppercorn
                </h3>
                <p className="text-[15px] leading-relaxed text-[#6B6F63] mb-6">
                  Tender king oyster mushrooms gently simmered in an earthenware pot with fresh green peppercorns, aromatic soy reduction, and coconut water for authentic rustic sweetness.
                </p>
              </div>
              <div className="pt-4 border-t border-[#DCE3D5] flex items-center justify-between text-[13px] text-[#6B6F63]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                      <circle cx="12" cy="7" r="4"></circle>
                      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                    </svg>
                  </div>
                  <span className="font-medium text-[#2B2A25]">
                    Chef Duy
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="">
                    Views:
                    <strong className="font-semibold text-[#2B2A25]">
                      342
                    </strong>
                  </span>
                  <span className="flex items-center gap-1 text-[#A63446]">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>
                    <span className="text-[#6B6F63]">
                      Likes:
                    </span>
                    <strong className="font-semibold text-[#2B2A25]">
                      124
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
        {/* SECTION: NEWEST RECIPES & VIDEOS (Feed / List Item per DESIGN.md section 6) */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-fraunces text-2xl font-medium text-[#2B2A25]">
              Newest Recipes & Videos
            </h2>
            <div className="flex items-center gap-2 text-[13px] text-[#6B6F63]">
              <span className="text-[#2B2A25] font-semibold underline underline-offset-4">
                Newest
              </span>
              <span className="">
                •
              </span>
              <span className="hover:text-[#2F5233] cursor-pointer">
                Popular
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {/* Card 1: Main Dishes */}
            <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer group" to="/posts/1">
              <div className="relative overflow-hidden w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 flex flex-col items-center justify-center p-3 text-center transition-transform group-hover:scale-[1.01]">
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-white text-[12px] font-medium z-10 font-vietnam" style={{ background: 'rgba(43, 42, 37, 0.6)' }}>
                  1/4
                </span>
                <img src="https://lh3.googleusercontent.com/aida/AEtjO1WKQI6FUHWfVtKTrj04MIGfapn2kKdbvISdihxFG-f7w0ySFktcAXUJeEK-um1Yo5mY9fgSSIEGLX1EfoSMS9NIkBhDMHqAamg0DpCajzR5k5F-lDIuyHmiPeupCwIPvAmL3nRnyg7YAOw8PaR-BTt8oakaY6bVCq-jAnbta0HL0nOf1EWsSbtxT2P-QBKdbWNNFv0igMkQnaed7Oigqp4cdbCOPC1OhWSkt9tVerGToLBZxByrBuEVHKk" alt="Crispy Pan-Fried Lemongrass & Chili Tofu" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-[3px] h-3.5 bg-[#2F5233] rounded-full"></span>
                    <span className="text-[13px] font-medium text-[#6B6F63]">
                      main dishes
                    </span>
                    <span className="text-xs text-[#6B6F63]">
                      •
                    </span>
                    <span className="text-[13px] text-[#6B6F63]">
                      45 minutes ago
                    </span>
                  </div>
                  <h3 className="font-vietnam text-[18px] md:text-[20px] font-semibold text-[#2B2A25] mb-2 leading-snug group-hover:text-[#2F5233] transition-colors">
                    Crispy Pan-Fried Lemongrass & Chili Tofu
                  </h3>
                  <p className="text-[14px] md:text-[15px] leading-relaxed text-[#6B6F63] line-clamp-2 mb-3">
                    Golden tofu cubes pan-seared with minced lemongrass, spicy chili flakes, and toasted white sesame seeds for a heartwarming savory crunch.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#DCE3D5] flex items-center justify-between text-[13px] text-[#6B6F63]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-[#6B6F63]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <circle cx="12" cy="7" r="4"></circle>
                        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                      </svg>
                    </div>
                    <span className="font-medium text-[#2B2A25]">
                      Mai Linh
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="">
                      Views:
                      <strong className="font-semibold text-[#2B2A25]">
                        185
                      </strong>
                    </span>
                    <span className="flex items-center gap-1 text-[#A63446]">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                      </svg>
                      <span className="text-[#6B6F63]">
                        Likes:
                      </span>
                      <strong className="font-semibold text-[#2B2A25]">
                        124
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
            {/* Card 2: Cooking Videos */}
            <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer group" to="/posts/1">
              <div className="relative overflow-hidden w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 flex flex-col items-center justify-center p-3 text-center transition-transform group-hover:scale-[1.01]">
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-white text-[12px] font-medium z-10 font-vietnam" style={{ background: 'rgba(43, 42, 37, 0.6)' }}>
                  1/3
                </span>
                <img src="https://lh3.googleusercontent.com/aida/AEtjO1WqIsz4GnoHBjWcsOHd9DJdnW7nbpBXvwgi_0YK6Ef78LClR--vFqo_W8tAu2JeZZeyPI6aq-uiqy7jxrcLO3qQfwfCqsB-CGKzjynTFFBgRNMuukYROErofB871vLBJou-rW42Xc5ayw6MmEMD7ALmpkch0xUDvgZEiI2x5m051G2T8JH8n8Q95NIHptQurB2bReYOfWUYVNmeAxJU4mogmDoeiWEo6paW4NL9mKLLtZSuz-yjhGhssTI" alt="Sizzling Claypot Oyster Mushrooms with Thai Basil" className="w-full h-full object-cover rounded-lg" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-[#2F5233]/90 text-white flex items-center justify-center shadow-sm group-hover:bg-[#25401F] transition-colors">
                    <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-[#2B2A25] text-white text-[11px] font-medium z-10">
                  08:45
                </span>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-[3px] h-3.5 bg-[#A63446] rounded-full"></span>
                    <span className="text-[13px] font-medium text-[#6B6F63]">
                      cooking videos
                    </span>
                    <span className="text-xs text-[#6B6F63]">
                      •
                    </span>
                    <span className="text-[13px] text-[#6B6F63]">
                      2 hours ago
                    </span>
                  </div>
                  <h3 className="font-vietnam text-[18px] md:text-[20px] font-semibold text-[#2B2A25] mb-2 leading-snug group-hover:text-[#2F5233] transition-colors">
                    Video: Sizzling Claypot Oyster Mushrooms with Thai Basil
                  </h3>
                  <p className="text-[14px] md:text-[15px] leading-relaxed text-[#6B6F63] line-clamp-2 mb-3">
                    Step-by-step 8-minute technique to sear oyster mushrooms over high heat before glazing in rich sweet soy sauce and crushed chili.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#DCE3D5] flex items-center justify-between text-[13px] text-[#6B6F63]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-[#6B6F63]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <circle cx="12" cy="7" r="4"></circle>
                        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                      </svg>
                    </div>
                    <span className="font-medium text-[#2B2A25]">
                      Chef Duy
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="">
                      Views:
                      <strong className="font-semibold text-[#2B2A25]">
                        520
                      </strong>
                    </span>
                    <span className="flex items-center gap-1 text-[#A63446]">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                      </svg>
                      <span className="text-[#6B6F63]">
                        Likes:
                      </span>
                      <strong className="font-semibold text-[#2B2A25]">
                        124
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
            {/* Card 3: Soups */}
            <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer group" to="/posts/1">
              <div className="relative overflow-hidden w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 flex flex-col items-center justify-center p-3 text-center transition-transform group-hover:scale-[1.01]">
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-white text-[12px] font-medium z-10 font-vietnam" style={{ background: 'rgba(43, 42, 37, 0.6)' }}>
                  1/3
                </span>
                <img src="https://lh3.googleusercontent.com/aida/AEtjO1VcZsiyaVI88SiJ5oF01zka1aPwHscql5pOU0eV1GBLXbcJxrX4A3RTqNAXUIAu62_1EGvr-A2Spq0xAuF-aXpqwtuluK43WCwyFLqvJH8Nd1KmO8NM2W_TzYODDB779KmKfdPmtFsxWV__eOJzy6hRDbx-Zu9rRNITFgMiPxhVSTrqYZgHtzbtD3nnXZRynX2p_iPhFvzuCk8ZG7NTu9LmpJ-5wqV_0K07WcfdTtuOrs3H10U3ioP7FEQ" alt="Silken Tofu Soup with Shiitake & Sweet Carrots" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-[3px] h-3.5 bg-[#D9A441] rounded-full"></span>
                    <span className="text-[13px] font-medium text-[#6B6F63]">
                      soups
                    </span>
                    <span className="text-xs text-[#6B6F63]">
                      •
                    </span>
                    <span className="text-[13px] text-[#6B6F63]">
                      4 hours ago
                    </span>
                  </div>
                  <h3 className="font-vietnam text-[18px] md:text-[20px] font-semibold text-[#2B2A25] mb-2 leading-snug group-hover:text-[#2F5233] transition-colors">
                    Silken Tofu Soup with Shiitake & Sweet Carrots
                  </h3>
                  <p className="text-[14px] md:text-[15px] leading-relaxed text-[#6B6F63] line-clamp-2 mb-3">
                    Delicate and nourishing clear vegetable broth gently simmered with soft silken tofu, rehydrated dried shiitake caps, and tender spring onions.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#DCE3D5] flex items-center justify-between text-[13px] text-[#6B6F63]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-[#6B6F63]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <circle cx="12" cy="7" r="4"></circle>
                        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                      </svg>
                    </div>
                    <span className="font-medium text-[#2B2A25]">
                      Thao Nguyen
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="">
                      Views:
                      <strong className="font-semibold text-[#2B2A25]">
                        210
                      </strong>
                    </span>
                    <span className="flex items-center gap-1 text-[#A63446]">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                      </svg>
                      <span className="text-[#6B6F63]">
                        Likes:
                      </span>
                      <strong className="font-semibold text-[#2B2A25]">
                        124
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
            {/* Card 4: Salads */}
            <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer group" to="/posts/1">
              <div className="relative overflow-hidden w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 flex flex-col items-center justify-center p-3 text-center transition-transform group-hover:scale-[1.01]">
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-white text-[12px] font-medium z-10 font-vietnam" style={{ background: 'rgba(43, 42, 37, 0.6)' }}>
                  1/4
                </span>
                <img src="https://lh3.googleusercontent.com/aida/AEtjO1Vg-qfSmhz0wmNociW2JI-LpplsY_hhYhjzPDUa-ukgYaSY52N3BKo2MaYe5Q4eiXsvUtBgprUIS_qd_Yt6PkMxanDVcSqftvoaKxm4J_AiHULIy89qh0mQc2mlUDGKjn_sisydSWD7jl01hgjMPjGrgTvYMMvnj2wux5YOFLyp6evgziGIVIeqhjDrtJoFWj-Gedr4AegXZN2Tyfam2mz-soiq3U1Z3Ox0L1j0VJvoJetEEoiY5SqQQCI" alt="Zesty Purple Banana Blossom Salad" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-[3px] h-3.5 bg-[#A63446] rounded-full"></span>
                    <span className="text-[13px] font-medium text-[#6B6F63]">
                      salads
                    </span>
                    <span className="text-xs text-[#6B6F63]">
                      •
                    </span>
                    <span className="text-[13px] text-[#6B6F63]">
                      Yesterday
                    </span>
                  </div>
                  <h3 className="font-vietnam text-[18px] md:text-[20px] font-semibold text-[#2B2A25] mb-2 leading-snug group-hover:text-[#2F5233] transition-colors">
                    Zesty Purple Banana Blossom Salad
                  </h3>
                  <p className="text-[14px] md:text-[15px] leading-relaxed text-[#6B6F63] line-clamp-2 mb-3">
                    Crisp shredded banana flower threads tossed with fresh mint leaves, crushed roasted peanuts, and tangy calamansi lime dressing.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#DCE3D5] flex items-center justify-between text-[13px] text-[#6B6F63]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-[#6B6F63]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <circle cx="12" cy="7" r="4"></circle>
                        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                      </svg>
                    </div>
                    <span className="font-medium text-[#2B2A25]">
                      Lan Huong
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="">
                      Views:
                      <strong className="font-semibold text-[#2B2A25]">
                        295
                      </strong>
                    </span>
                    <span className="flex items-center gap-1 text-[#A63446]">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                      </svg>
                      <span className="text-[#6B6F63]">
                        Likes:
                      </span>
                      <strong className="font-semibold text-[#2B2A25]">
                        124
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="mt-8 flex justify-center">
            <button className="h-11 px-6 rounded-lg border-[1.5px] border-[#2F5233] bg-transparent text-[#2F5233] text-[14px] font-medium hover:bg-[#E9EFE6] transition-colors cursor-pointer">
              View More Recipes & Posts
            </button>
          </div>
        </section>
      </main>
      {/* CHATBOT FAB (Global, bottom right, primary-moss background, single shadow per DESIGN.md section 12) */}
      <aside className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* CHATBOT FAB (circular button w-14 h-14 bg #2F5233) */}
        <button className="w-14 h-14 rounded-full bg-[#2F5233] hover:bg-[#25401F] text-white flex items-center justify-center modal-shadow transition-transform hover:scale-105 cursor-pointer" id="chat-fab" title="Botanical Hearth AI Assistant">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 00-1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
          </svg>
        </button>
        {/* POPUP PANEL CHAT */}
        <div className="hidden fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-32px)] h-[520px] bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl modal-shadow z-50 flex flex-col overflow-hidden" id="chat-popup">
          {/* Header Popup */}
          <div className="h-16 px-4 bg-[#FDFBF6] border-b border-[#DCE3D5] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#F3F6EE] border border-[#DCE3D5] flex items-center justify-center text-[#2F5233]">
                <svg className="w-5 h-5 text-[#2F5233]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 00-1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-vietnam text-[15px] font-semibold text-[#2B2A25] leading-tight">
                  AI Nutrition Assistant
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#4C8C4A]"></span>
                  <span className="text-[11px] text-[#6B6F63]">
                    Online & Ready
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[#6B6F63]">
              <button className="w-8 h-8 rounded-lg hover:bg-[#E9EFE6] flex items-center justify-center text-[#2B2A25] transition-colors cursor-pointer" id="chat-minimize" title="Minimize">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                  <line x1="5" x2="19" y1="12" y2="12"></line>
                </svg>
              </button>
              <button className="w-8 h-8 rounded-lg hover:bg-[#E9EFE6] flex items-center justify-center text-[#2B2A25] transition-colors cursor-pointer" id="chat-close" title="Close">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                  <line x1="18" x2="6" y1="6" y2="18"></line>
                  <line x1="6" x2="18" y1="6" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-[13px] leading-relaxed bg-[#F3F6EE]/40">
            {/* AI Greeting */}
            <div className="flex gap-2.5 max-w-[88%]">
              <div className="w-7 h-7 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center text-[#2F5233] shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                </svg>
              </div>
              <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl rounded-tl-none p-3 text-[#2B2A25]">
                Hello! I am the Botanical Hearth AI Nutrition Assistant. I can help you discover wholesome plant-based recipes, calculate nutritional balance, or suggest meal ideas for today.
              </div>
            </div>
            {/* User Message */}
            <div className="flex justify-end">
              <div className="max-w-[85%] bg-[#2F5233] text-white rounded-xl rounded-tr-none p-3 text-[13px]">
                Could you recommend a light, high-protein plant-based lunch for today?
              </div>
            </div>
            {/* AI Response */}
            <div className="flex gap-2.5 max-w-[88%]">
              <div className="w-7 h-7 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center text-[#2F5233] shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                </svg>
              </div>
              <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl rounded-tl-none p-3 text-[#2B2A25]">
                For lunch today, consider trying:
                <strong>
                  Lotus Seed & Seaweed Soup
                </strong>
                paired with
                <strong>
                  Silken Tofu in Shiitake Mushroom Sauce
                </strong>
                . This combination offers complete plant protein, purifies the palate, and is very gentle on digestion!
              </div>
            </div>
          </div>
          {/* Suggested Quick Chips */}
          <div className="px-3.5 py-2 bg-[#FDFBF6] border-t border-[#DCE3D5] flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            <button className="px-2.5 py-1 rounded-full bg-[#F3F6EE] hover:bg-[#E9EFE6] border border-[#DCE3D5] text-[12px] text-[#2F5233] whitespace-nowrap transition-colors cursor-pointer">
              🌱 High Protein Dishes
            </button>
            <button className="px-2.5 py-1 rounded-full bg-[#F3F6EE] hover:bg-[#E9EFE6] border border-[#DCE3D5] text-[12px] text-[#2F5233] whitespace-nowrap transition-colors cursor-pointer">
              🥣 Weight Loss Menu
            </button>
            <button className="px-2.5 py-1 rounded-full bg-[#F3F6EE] hover:bg-[#E9EFE6] border border-[#DCE3D5] text-[12px] text-[#2F5233] whitespace-nowrap transition-colors cursor-pointer">
              🥦 Ingredient Swaps
            </button>
          </div>
          {/* Message Input Field */}
          <div className="p-3 bg-[#FDFBF6] border-t border-[#DCE3D5] shrink-0">
            <div className="flex items-center gap-2">
              <input className="flex-1 h-10 px-3.5 bg-[#F3F6EE] border border-[#DCE3D5] rounded-xl text-[13px] text-[#2B2A25] placeholder-[#6B6F63] focus:border-[#2F5233] focus:outline-none transition-colors" placeholder="Ask AI nutrition assistant..." type="text" />
              <button className="w-10 h-10 rounded-xl bg-[#2F5233] hover:bg-[#25401F] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer" title="Send message">
                <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>
      {/* FOOTER (surface-paper, top border border-sage-mist) */}
      <footer className="w-full border-t border-[#DCE3D5] bg-[#FDFBF6] py-6 mt-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-sm text-[#6B6F63] gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-semibold text-[#2F5233] text-base">
              Botanical Hearth
            </span>
            <span className="">
              •
            </span>
            <span className="">
              Plant-based culinary & family nutrition platform
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a className="hover:text-[#2F5233] transition-colors" href="#">
              About Us
            </a>
            <a className="hover:text-[#2F5233] transition-colors" href="#">
              Terms of Service
            </a>
            <a className="hover:text-[#2F5233] transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-[#2F5233] transition-colors" href="#">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
      {/* TODO: script goc da bi loai bo, can port lai logic bang useState/useEffect */}
      {/* TODO: script goc da bi loai bo, can port lai logic bang useState/useEffect */}
    </>
  );
}

export default Home;
