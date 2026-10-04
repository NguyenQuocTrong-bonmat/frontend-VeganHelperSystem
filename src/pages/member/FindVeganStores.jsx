import { Link } from 'react-router-dom'
import HeaderMember from '../../components/layout/HeaderMember';

function FindVeganStores() {
  return (
    <>
      {/* ==================== HEADER (Header-LoggedIn) ==================== */}
      <HeaderMember />
      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-1 flex flex-col w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6 gap-6">
        {/* Section Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-text-charcoal font-medium">
              Find Vegan Stores
            </h1>
            <p className="text-[15px] text-text-stem-gray mt-1">
              Discover wholesome plant-based eateries, organic vegan markets, and cozy dining spots near your location
            </p>
          </div>
          {/* Quick Location / Filter Bar */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-stem-gray">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </span>
              <input className="w-full pl-9 pr-4 py-2 bg-surface-paper border border-border-sage-mist rounded-lg text-[14px] text-text-charcoal placeholder:text-text-stem-gray focus:outline-none focus:border-primary-moss transition" placeholder="Search by eatery name, address, cuisine..." type="text" />
            </div>
            <button className="h-10 px-3.5 bg-surface-paper border border-border-sage-mist rounded-lg flex items-center gap-1.5 text-text-charcoal text-[13px] hover:border-primary-moss hover:text-primary-moss transition shrink-0">
              <svg className="w-4 h-4 text-primary-moss" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span className="">
                Near me (5 km)
              </span>
            </button>
          </div>
        </div>
        {/* ==================== TOP HALF: MAP SECTION ==================== */}
        <div className="w-full relative h-[380px] md:h-[420px] rounded-xl border border-border-sage-mist overflow-hidden bg-[#E9EFE5]">
          {/* Styled Vector SVG Map Representation */}
          <svg className="w-full h-full object-cover select-none pointer-events-none" fill="none" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 420" xmlns="http://www.w3.org/2000/svg">
            {/* Background Map Land Texture */}
            <rect fill="#E6EDE0" height="420" width="1200"></rect>
            {/* Parks & Green Zones */}
            <path d="M 60,40 C 140,20 220,70 280,120 C 310,150 290,210 240,240 C 180,270 120,230 70,180 C 30,140 20,70 60,40 Z" fill="#D7E6CC" opacity="0.8"></path>
            <path d="M 850,50 C 940,30 1050,70 1100,140 C 1140,200 1110,260 1040,280 C 970,300 900,260 860,200 C 820,150 800,80 850,50 Z" fill="#D7E6CC" opacity="0.7"></path>
            <path d="M 450,260 C 520,230 620,270 660,330 C 690,380 660,420 590,420 C 510,420 460,370 430,320 C 410,280 420,270 450,260 Z" fill="#D7E6CC" opacity="0.75"></path>
            {/* River / Water feature */}
            <path d="M -20,280 C 180,250 320,310 440,300 C 580,290 700,210 820,180 C 960,150 1100,190 1220,170" fill="none" opacity="0.85" stroke="#CADDE3" strokeLinecap="round" strokeWidth="32"></path>
            <path d="M -20,280 C 180,250 320,310 440,300 C 580,290 700,210 820,180 C 960,150 1100,190 1220,170" fill="none" opacity="0.9" stroke="#BDD5DC" strokeLinecap="round" strokeWidth="20"></path>
            {/* Secondary Road Grid */}
            <path d="M 0,90 L 1200,90" opacity="0.9" stroke="#FAF8F2" strokeWidth="6"></path>
            <path d="M 0,160 L 1200,160" opacity="0.8" stroke="#FAF8F2" strokeWidth="5"></path>
            <path d="M 0,250 L 1200,250" opacity="0.8" stroke="#FAF8F2" strokeWidth="5"></path>
            <path d="M 0,350 L 1200,350" opacity="0.9" stroke="#FAF8F2" strokeWidth="6"></path>
            <path d="M 140,0 L 140,420" opacity="0.8" stroke="#FAF8F2" strokeWidth="5"></path>
            <path d="M 310,0 L 310,420" opacity="0.85" stroke="#FAF8F2" strokeWidth="6"></path>
            <path d="M 520,0 L 520,420" opacity="0.8" stroke="#FAF8F2" strokeWidth="5"></path>
            <path d="M 720,0 L 720,420" opacity="0.85" stroke="#FAF8F2" strokeWidth="6"></path>
            <path d="M 940,0 L 940,420" opacity="0.8" stroke="#FAF8F2" strokeWidth="5"></path>
            <path d="M 1080,0 L 1080,420" opacity="0.8" stroke="#FAF8F2" strokeWidth="5"></path>
            {/* Main Diagonal Avenues */}
            <path d="M -40,380 L 580,-20" stroke="#FFFFFF" strokeLinecap="square" strokeWidth="12"></path>
            <path d="M -40,380 L 580,-20" stroke="#F1EDE2" strokeLinecap="square" strokeWidth="8"></path>
            <path d="M 460,440 L 1020,-30" stroke="#FFFFFF" strokeLinecap="square" strokeWidth="14"></path>
            <path d="M 460,440 L 1020,-30" stroke="#F1EDE2" strokeLinecap="square" strokeWidth="9"></path>
            <path d="M 320,120 L 1180,380" stroke="#FFFFFF" strokeWidth="9"></path>
            <path d="M 320,120 L 1180,380" stroke="#F1EDE2" strokeWidth="6"></path>
            {/* Subtle Building Blocks Grid */}
            <rect fill="#DCE5D3" height="40" opacity="0.7" rx="3" width="120" x="165" y="105"></rect>
            <rect fill="#DCE5D3" height="60" opacity="0.7" rx="3" width="80" x="330" y="175"></rect>
            <rect fill="#DCE5D3" height="45" opacity="0.7" rx="3" width="90" x="540" y="105"></rect>
            <rect fill="#DCE5D3" height="65" opacity="0.7" rx="3" width="110" x="745" y="270"></rect>
            <rect fill="#DCE5D3" height="60" opacity="0.7" rx="3" width="100" x="960" y="175"></rect>
          </svg>
          {/* Current User Position Pulse Marker */}
          <div className="absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <span className="absolute w-8 h-8 rounded-full bg-primary-moss/20 animate-ping"></span>
            <span className="relative w-4 h-4 rounded-full bg-primary-moss border-2 border-white shadow-sm"></span>
          </div>
          {/* MAP MARKERS (Colored in primary-moss #2F5233) */}
          {/* Marker 1 (Active / Featured) */}
          <div className="absolute top-[32%] left-[26%] -translate-x-1/2 -translate-y-full group cursor-pointer z-10 transition-transform hover:scale-110">
            {/* Tooltip Label */}
            <div className="mb-1.5 px-2.5 py-1 bg-surface-paper border border-border-sage-mist rounded-md shadow-sm whitespace-nowrap flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-moss"></span>
              <span className="text-[12px] font-medium text-text-charcoal">
                An Lac Vegan Restaurant
              </span>
              <span className="text-[11px] text-accent-turmeric font-semibold">
                ★ 4.8
              </span>
            </div>
            {/* Pin Icon */}
            <div className="w-9 h-9 mx-auto rounded-full bg-primary-moss text-white flex items-center justify-center shadow-md relative">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                <circle cx="12" cy="10" fill="white" r="2.5"></circle>
              </svg>
            </div>
          </div>
          {/* Marker 2 */}
          <div className="absolute top-[28%] left-[58%] -translate-x-1/2 -translate-y-full group cursor-pointer z-10 transition-transform hover:scale-110">
            <div className="mb-1.5 px-2 py-0.5 bg-surface-paper border border-border-sage-mist rounded-md shadow-sm whitespace-nowrap text-[12px] font-medium text-text-charcoal hidden sm:block">
              Huong Sen Vegan Eatery · 1.2 km
            </div>
            <div className="w-8 h-8 mx-auto rounded-full bg-primary-moss text-white flex items-center justify-center shadow-md">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"></path>
              </svg>
            </div>
          </div>
          {/* Marker 3 */}
          <div className="absolute top-[64%] left-[34%] -translate-x-1/2 -translate-y-full group cursor-pointer z-10 transition-transform hover:scale-110">
            <div className="mb-1.5 px-2 py-0.5 bg-surface-paper border border-border-sage-mist rounded-md shadow-sm whitespace-nowrap text-[12px] font-medium text-text-charcoal hidden sm:block">
              Thien Tam Vegan Kitchen · 1.8 km
            </div>
            <div className="w-8 h-8 mx-auto rounded-full bg-primary-moss text-white flex items-center justify-center shadow-md">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"></path>
              </svg>
            </div>
          </div>
          {/* Marker 4 */}
          <div className="absolute top-[72%] left-[68%] -translate-x-1/2 -translate-y-full group cursor-pointer z-10 transition-transform hover:scale-110">
            <div className="w-8 h-8 mx-auto rounded-full bg-primary-moss text-white flex items-center justify-center shadow-md">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"></path>
              </svg>
            </div>
          </div>
          {/* Marker 5 */}
          <div className="absolute top-[40%] left-[82%] -translate-x-1/2 -translate-y-full group cursor-pointer z-10 transition-transform hover:scale-110">
            <div className="w-8 h-8 mx-auto rounded-full bg-primary-moss text-white flex items-center justify-center shadow-md">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"></path>
              </svg>
            </div>
          </div>
          {/* Map Floating UI Controls (Zoom & Recenter) */}
          <div className="absolute right-4 bottom-4 flex flex-col gap-1.5 z-20">
            <button className="w-9 h-9 rounded-lg bg-surface-paper border border-border-sage-mist text-text-charcoal flex items-center justify-center hover:bg-bg-herb-white transition shadow-sm font-medium" title="Zoom in">
              +
            </button>
            <button className="w-9 h-9 rounded-lg bg-surface-paper border border-border-sage-mist text-text-charcoal flex items-center justify-center hover:bg-bg-herb-white transition shadow-sm font-medium" title="Zoom out">
              −
            </button>
            <button className="w-9 h-9 rounded-lg bg-surface-paper border border-border-sage-mist text-primary-moss flex items-center justify-center hover:bg-bg-herb-white transition shadow-sm mt-1" title="Current location">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 2v3m0 14v3M2 12h3m14 0h3"></path>
              </svg>
            </button>
          </div>
          {/* Map Legend Badge */}
          <div className="absolute left-4 top-4 bg-surface-paper/95 backdrop-blur-sm border border-border-sage-mist px-3 py-1.5 rounded-lg flex items-center gap-2 text-[12px] text-text-stem-gray shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-moss"></span>
            <span className="text-text-charcoal font-medium">
              8 vegan spots
            </span>
            <span className="">
              around you
            </span>
          </div>
        </div>
        {/* ==================== BOTTOM HALF: STORE LIST ==================== */}
        <div className="w-full flex flex-col gap-4 mt-2">
          {/* List Header & Filter Chips */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border-sage-mist">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl text-text-charcoal font-medium">
                Nearest Vegan Eateries
              </h2>
              <span className="text-[12px] text-text-stem-gray bg-bg-herb-white border border-border-sage-mist px-2 py-0.5 rounded-full">
                8 results
              </span>
            </div>
            {/* Category Filter Tabs / Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 text-[13px]">
              <button className="px-3 py-1 rounded-full bg-primary-moss text-white font-medium whitespace-nowrap transition">
                All
              </button>
              <button className="px-3 py-1 rounded-full bg-surface-paper border border-border-sage-mist text-text-stem-gray hover:text-text-charcoal hover:border-primary-moss whitespace-nowrap transition">
                Rice Dishes & Eateries
              </button>
              <button className="px-3 py-1 rounded-full bg-surface-paper border border-border-sage-mist text-text-stem-gray hover:text-text-charcoal hover:border-primary-moss whitespace-nowrap transition">
                Hotpot & Buffet
              </button>
              <button className="px-3 py-1 rounded-full bg-surface-paper border border-border-sage-mist text-text-stem-gray hover:text-text-charcoal hover:border-primary-moss whitespace-nowrap transition">
                Organic Stores
              </button>
            </div>
          </div>
          {/* Store Cards Grid: Border 1px solid border-sage-mist, No Shadow (Per Section 5 & Prompt) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* STORE CARD 1 */}
            <div className="bg-surface-paper border border-border-sage-mist rounded-xl p-4 flex flex-col justify-between transition-colors hover:border-primary-moss group">
              <div>
                {/* Image Frame Placeholder (ratio 16:9, rounded 8px) */}
                <div className="w-full h-44 rounded-lg bg-bg-herb-white border border-border-sage-mist relative overflow-hidden mb-3">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcs2AEJH0LvNkJWWq16uXZCCpp4sfDkM_rVEguRoZALVD3nouenhrWpYnKrvs-44r_OQrRbLGeqFhLumjHX6qOo6mIU06U03BrBnH55mfgj56oDUkgOxWdcKfQaYkWMYguWMpDnqM-rGX6p980hpxlKhziE2fqBRmNXtADE9D5yW2Fr8VbnkkOCazmT60DSbS6NzKs2mdoqzSpJ8hqqrrwV3SafGmTA5eAjSIPP3t_wJgL05qFjrxt" alt="An Lac Vegan Restaurant Storefront" className="w-full h-full object-cover rounded-lg" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-surface-paper/95 border border-border-sage-mist text-[11px] font-medium text-success-sprout">
                    Open now
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-surface-paper/95 border border-border-sage-mist text-[11px] font-medium text-text-charcoal flex items-center gap-1">
                    <svg className="w-3 h-3 text-primary-moss" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    500 m
                  </span>
                </div>
                {/* Store Details */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-sans font-semibold text-[17px] text-text-charcoal group-hover:text-primary-moss transition line-clamp-1">
                    An Lac Vegan Restaurant
                  </h3>
                  {/* Rating using accent-turmeric (#D9A441) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <svg className="w-4 h-4 fill-accent-turmeric text-accent-turmeric" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span className="text-[14px] font-semibold text-accent-turmeric">
                      4.8
                    </span>
                    <span className="text-[12px] text-text-stem-gray">
                      (120)
                    </span>
                  </div>
                </div>
                {/* Category Tag with 3px vertical color bar (DESIGN.md section 6) */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-[12px] text-text-stem-gray">
                    <span className="w-[3px] h-3 bg-primary-moss rounded-full"></span>
                    <span className="">
                      Traditional vegan cuisine
                    </span>
                  </div>
                  <span className="text-text-stem-gray/40">
                    •
                  </span>
                  <span className="text-[12px] text-text-stem-gray">
                    $1.50 - $3.00
                  </span>
                </div>
                {/* Address Description */}
                <p className="text-[13px] text-text-stem-gray line-clamp-2 leading-relaxed mb-3">
                  124 Dinh Chieu St., Ward Vo Thi Sau, Dist. 3, HCMC
                </p>
              </div>
              {/* Bottom Action Buttons */}
              <div className="pt-3 border-t border-border-sage-mist/60 flex items-center justify-between gap-2">
                <span className="text-[12px] text-text-stem-gray">
                  Closes at 21:00
                </span>
                <div className="flex items-center gap-2">
                  <button className="px-2.5 py-1.5 border border-border-sage-mist hover:border-primary-moss rounded-lg text-[13px] text-text-charcoal hover:text-primary-moss transition flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                    </svg>
                    <span className="">
                      Get Directions
                    </span>
                  </button>
                  <button className="px-3 py-1.5 bg-primary-moss hover:bg-primary-moss-hover text-white rounded-lg text-[13px] font-medium transition">
                    Details
                  </button>
                </div>
              </div>
            </div>
            {/* STORE CARD 2 */}
            <div className="bg-surface-paper border border-border-sage-mist rounded-xl p-4 flex flex-col justify-between transition-colors hover:border-primary-moss group">
              <div>
                {/* Image Frame Placeholder */}
                <div className="w-full h-44 rounded-lg bg-bg-herb-white border border-border-sage-mist relative overflow-hidden mb-3">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuATnezMUvsUSY6KUWRQzb-G3mMMiOYca6YHK3YBPFSyk6NhZQdIpMv6TAuA6-M7tnPINDIytXvpSf11eFVGYl_74mok6u5E80tV_j3CQbZXzpM06Z8reNfeSKfh4R10hbG64dYS7CsjDAKLuExKmXwxLTa9_qz2Bxu7Llw_nr6lqTiak9SGKhFsiSXEE0FAze4Wq6j3lgNUtK3WdHkBFxp2X0P6NIlEMposLWQ6G5SGRRjbLnUDA3lI" alt="Huong Sen Vegan Eatery Interior" className="w-full h-full object-cover rounded-lg" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-surface-paper/95 border border-border-sage-mist text-[11px] font-medium text-success-sprout">
                    Open now
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-surface-paper/95 border border-border-sage-mist text-[11px] font-medium text-text-charcoal flex items-center gap-1">
                    <svg className="w-3 h-3 text-primary-moss" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    1.2 km
                  </span>
                </div>
                {/* Store Details */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-sans font-semibold text-[17px] text-text-charcoal group-hover:text-primary-moss transition line-clamp-1">
                    Huong Sen Vegan Eatery
                  </h3>
                  {/* Rating using accent-turmeric (#D9A441) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <svg className="w-4 h-4 fill-accent-turmeric text-accent-turmeric" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span className="text-[14px] font-semibold text-accent-turmeric">
                      4.7
                    </span>
                    <span className="text-[12px] text-text-stem-gray">
                      (96)
                    </span>
                  </div>
                </div>
                {/* Category Tag */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-[12px] text-text-stem-gray">
                    <span className="w-[3px] h-3 bg-accent-turmeric rounded-full"></span>
                    <span className="">
                      Hotpot & buffet
                    </span>
                  </div>
                  <span className="text-text-stem-gray/40">
                    •
                  </span>
                  <span className="text-[12px] text-text-stem-gray">
                    $4.00 - $8.00
                  </span>
                </div>
                <p className="text-[13px] text-text-stem-gray line-clamp-2 leading-relaxed mb-3">
                  45 Le Quy Don St., Ward Vo Thi Sau, Dist. 3, HCMC
                </p>
              </div>
              <div className="pt-3 border-t border-border-sage-mist/60 flex items-center justify-between gap-2">
                <span className="text-[12px] text-text-stem-gray">
                  Closes at 22:00
                </span>
                <div className="flex items-center gap-2">
                  <button className="px-2.5 py-1.5 border border-border-sage-mist hover:border-primary-moss rounded-lg text-[13px] text-text-charcoal hover:text-primary-moss transition flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                    </svg>
                    <span className="">
                      Get Directions
                    </span>
                  </button>
                  <button className="px-3 py-1.5 bg-primary-moss hover:bg-primary-moss-hover text-white rounded-lg text-[13px] font-medium transition">
                    Details
                  </button>
                </div>
              </div>
            </div>
            {/* STORE CARD 3 */}
            <div className="bg-surface-paper border border-border-sage-mist rounded-xl p-4 flex flex-col justify-between transition-colors hover:border-primary-moss group">
              <div>
                {/* Image Frame Placeholder */}
                <div className="w-full h-44 rounded-lg bg-bg-herb-white border border-border-sage-mist relative overflow-hidden mb-3">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqRuH3LUP-m1GPWZJJJH9QN-cnVCEXiEffafkW01-VPMZxmIlGYg01h3HPYsUIUHl_sNECRNK2pccSm34r0bxmkVPEOdA1Jgw6fOI4CR8XILqmOu-Xux-GYEsrfCQu8WMnpv8fYMRZ-S11Rpm_o7JOGT6nvSwQ_ZIB2vAbi7nIUOGqWcuUcps7HBT7M6g7RpzSyfPwlIirbk0RwgN7IIFnt_qZbNdKLd3Cf_ixRwlb-lQye_cpW1Fb" alt="Thien Tam Vegan Kitchen Dining Room" className="w-full h-full object-cover rounded-lg" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-surface-paper/95 border border-border-sage-mist text-[11px] font-medium text-success-sprout">
                    Open now
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-surface-paper/95 border border-border-sage-mist text-[11px] font-medium text-text-charcoal flex items-center gap-1">
                    <svg className="w-3 h-3 text-primary-moss" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    1.8 km
                  </span>
                </div>
                {/* Store Details */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-sans font-semibold text-[17px] text-text-charcoal group-hover:text-primary-moss transition line-clamp-1">
                    Thien Tam Vegan Kitchen
                  </h3>
                  {/* Rating using accent-turmeric (#D9A441) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <svg className="w-4 h-4 fill-accent-turmeric text-accent-turmeric" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span className="text-[14px] font-semibold text-accent-turmeric">
                      4.9
                    </span>
                    <span className="text-[12px] text-text-stem-gray">
                      (214)
                    </span>
                  </div>
                </div>
                {/* Category Tag */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-[12px] text-text-stem-gray">
                    <span className="w-[3px] h-3 bg-accent-beetroot rounded-full"></span>
                    <span className="">
                      Macrobiotic cuisine
                    </span>
                  </div>
                  <span className="text-text-stem-gray/40">
                    •
                  </span>
                  <span className="text-[12px] text-text-stem-gray">
                    $2.00 - $4.00
                  </span>
                </div>
                <p className="text-[13px] text-text-stem-gray line-clamp-2 leading-relaxed mb-3">
                  88 Nam Ky Khoi Nghia, Ben Nghe Ward, Dist. 1, HCMC
                </p>
              </div>
              <div className="pt-3 border-t border-border-sage-mist/60 flex items-center justify-between gap-2">
                <span className="text-[12px] text-text-stem-gray">
                  Closes at 21:30
                </span>
                <div className="flex items-center gap-2">
                  <button className="px-2.5 py-1.5 border border-border-sage-mist hover:border-primary-moss rounded-lg text-[13px] text-text-charcoal hover:text-primary-moss transition flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                    </svg>
                    <span className="">
                      Get Directions
                    </span>
                  </button>
                  <button className="px-3 py-1.5 bg-primary-moss hover:bg-primary-moss-hover text-white rounded-lg text-[13px] font-medium transition">
                    Details
                  </button>
                </div>
              </div>
            </div>
            {/* STORE CARD 4 */}
            <div className="bg-surface-paper border border-border-sage-mist rounded-xl p-4 flex flex-col justify-between transition-colors hover:border-primary-moss group">
              <div>
                {/* Image Frame Placeholder */}
                <div className="w-full h-44 rounded-lg bg-bg-herb-white border border-border-sage-mist relative overflow-hidden mb-3">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB03as6qklmYjUaUNWU0XRPLqJ3CczScbJx98gsdI3R5X4AFXJ4H8JldZyX7UwC4qGH32fxLfhRrNKnapyK33CvI2_3eVSHj7JswTQuFPHhD-csXqiJ5tjYTg1E27S8yjsxNdA79UScHil0kWhWFIvbdz4DKl0u7kUzRw9EnpC8hWof3AcjJ9MvwKeNwPXqdPNB1ZEHNOxHdfMtHr5AJgwWrI8dwYKZxoHpLemBoFwo7FBGqQyun722" alt="Organic Green Veggie Market Produce Display" className="w-full h-full object-cover rounded-lg" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-surface-paper/95 border border-border-sage-mist text-[11px] font-medium text-success-sprout">
                    Open now
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-surface-paper/95 border border-border-sage-mist text-[11px] font-medium text-text-charcoal flex items-center gap-1">
                    <svg className="w-3 h-3 text-primary-moss" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    2.4 km
                  </span>
                </div>
                {/* Store Details */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-sans font-semibold text-[17px] text-text-charcoal group-hover:text-primary-moss transition line-clamp-1">
                    Organic Green Veggie Market
                  </h3>
                  {/* Rating using accent-turmeric (#D9A441) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <svg className="w-4 h-4 fill-accent-turmeric text-accent-turmeric" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span className="text-[14px] font-semibold text-accent-turmeric">
                      4.6
                    </span>
                    <span className="text-[12px] text-text-stem-gray">
                      (52)
                    </span>
                  </div>
                </div>
                {/* Category Tag */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-[12px] text-text-stem-gray">
                    <span className="w-[3px] h-3 bg-primary-moss rounded-full"></span>
                    <span className="">
                      Organic fresh produce
                    </span>
                  </div>
                  <span className="text-text-stem-gray/40">
                    •
                  </span>
                  <span className="text-[12px] text-text-stem-gray">
                    Clean farming
                  </span>
                </div>
                <p className="text-[13px] text-text-stem-gray line-clamp-2 leading-relaxed mb-3">
                  16 Tran Cao Van, Da Kao Ward, Dist. 1, HCMC
                </p>
              </div>
              <div className="pt-3 border-t border-border-sage-mist/60 flex items-center justify-between gap-2">
                <span className="text-[12px] text-text-stem-gray">
                  Closes at 20:00
                </span>
                <div className="flex items-center gap-2">
                  <button className="px-2.5 py-1.5 border border-border-sage-mist hover:border-primary-moss rounded-lg text-[13px] text-text-charcoal hover:text-primary-moss transition flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                    </svg>
                    <span className="">
                      Get Directions
                    </span>
                  </button>
                  <button className="px-3 py-1.5 bg-primary-moss hover:bg-primary-moss-hover text-white rounded-lg text-[13px] font-medium transition">
                    Details
                  </button>
                </div>
              </div>
            </div>
            {/* STORE CARD 5 */}
            <div className="bg-surface-paper border border-border-sage-mist rounded-xl p-4 flex flex-col justify-between transition-colors hover:border-primary-moss group">
              <div>
                {/* Image Frame Placeholder */}
                <div className="w-full h-44 rounded-lg bg-bg-herb-white border border-border-sage-mist relative overflow-hidden mb-3">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbCQ3bomXfHk8C_7oVoaA9HmhJFWXocKbc9udvlW2dY5Fx8xbB4VZuskt2AyumZ47XrQ3-qOsfveh_aXtARVPpYYYp4-5J85L31TQkv1gbPEOUwdIOQsBOwdueLXQlPBehQWs88EqMItOAJBoQH3Vn0Xf5taINBVs19L7xIoqRBWblLdvBNfVR_CDX37s1CXt6X-oNlqYLXXHVCdoLTgeOts3usCWZ0zDkwd3bA8nhWOhdv9Y95oJY" alt="Moc Vegan Banh Mi Artisan Counter" className="w-full h-full object-cover rounded-lg" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-surface-paper/95 border border-border-sage-mist text-[11px] font-medium text-text-stem-gray">
                    Break time
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-surface-paper/95 border border-border-sage-mist text-[11px] font-medium text-text-charcoal flex items-center gap-1">
                    <svg className="w-3 h-3 text-primary-moss" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    3.1 km
                  </span>
                </div>
                {/* Store Details */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-sans font-semibold text-[17px] text-text-charcoal group-hover:text-primary-moss transition line-clamp-1">
                    Moc Vegan Banh Mi
                  </h3>
                  {/* Rating using accent-turmeric (#D9A441) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <svg className="w-4 h-4 fill-accent-turmeric text-accent-turmeric" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span className="text-[14px] font-semibold text-accent-turmeric">
                      4.7
                    </span>
                    <span className="text-[12px] text-text-stem-gray">
                      (88)
                    </span>
                  </div>
                </div>
                {/* Category Tag */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-[12px] text-text-stem-gray">
                    <span className="w-[3px] h-3 bg-text-stem-gray rounded-full"></span>
                    <span className="">
                      Quick bite & banh mi
                    </span>
                  </div>
                  <span className="text-text-stem-gray/40">
                    •
                  </span>
                  <span className="text-[12px] text-text-stem-gray">
                    $1.00 - $1.50
                  </span>
                </div>
                <p className="text-[13px] text-text-stem-gray line-clamp-2 leading-relaxed mb-3">
                  102 Hai Ba Trung, Tan Dinh Ward, Dist. 1, HCMC
                </p>
              </div>
              <div className="pt-3 border-t border-border-sage-mist/60 flex items-center justify-between gap-2">
                <span className="text-[12px] text-text-stem-gray">
                  Reopens at 16:00
                </span>
                <div className="flex items-center gap-2">
                  <button className="px-2.5 py-1.5 border border-border-sage-mist hover:border-primary-moss rounded-lg text-[13px] text-text-charcoal hover:text-primary-moss transition flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                    </svg>
                    <span className="">
                      Get Directions
                    </span>
                  </button>
                  <button className="px-3 py-1.5 bg-primary-moss hover:bg-primary-moss-hover text-white rounded-lg text-[13px] font-medium transition">
                    Details
                  </button>
                </div>
              </div>
            </div>
            {/* STORE CARD 6 */}
            <div className="bg-surface-paper border border-border-sage-mist rounded-xl p-4 flex flex-col justify-between transition-colors hover:border-primary-moss group">
              <div>
                {/* Image Frame Placeholder */}
                <div className="w-full h-44 rounded-lg bg-bg-herb-white border border-border-sage-mist relative overflow-hidden mb-3">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQPulmk4nAFr__B3wf4T_KXp216EKGpcM7Z3bQKxr0HWFMvCpYlDh7cXhx40JvhQ_yy1utvO_t4ceawGSnfi3Q6QpnQywRAvGwA36xKXgQI_V9SjChbhBngCSN9TkXk7of5kMilSLrOt8w0WakHbx9icTXWSKMuMfbTb6fBB3q7KK-27bTKGm3W453LnjGRYOBbCuzg6BpiakiWRYTUtGG1uY0RiCYnF6937Gbh-mmE6cKYss69Haz" alt="Mandala Plant-based Dining Table Atmosphere" className="w-full h-full object-cover rounded-lg" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-surface-paper/95 border border-border-sage-mist text-[11px] font-medium text-success-sprout">
                    Open now
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-surface-paper/95 border border-border-sage-mist text-[11px] font-medium text-text-charcoal flex items-center gap-1">
                    <svg className="w-3 h-3 text-primary-moss" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    3.8 km
                  </span>
                </div>
                {/* Store Details */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-sans font-semibold text-[17px] text-text-charcoal group-hover:text-primary-moss transition line-clamp-1">
                    Mandala Plant-based Dining
                  </h3>
                  {/* Rating using accent-turmeric (#D9A441) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <svg className="w-4 h-4 fill-accent-turmeric text-accent-turmeric" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span className="text-[14px] font-semibold text-accent-turmeric">
                      4.9
                    </span>
                    <span className="text-[12px] text-text-stem-gray">
                      (310)
                    </span>
                  </div>
                </div>
                {/* Category Tag */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-[12px] text-text-stem-gray">
                    <span className="w-[3px] h-3 bg-primary-moss rounded-full"></span>
                    <span className="">
                      Fine dining & hotpot
                    </span>
                  </div>
                  <span className="text-text-stem-gray/40">
                    •
                  </span>
                  <span className="text-[12px] text-text-stem-gray">
                    $5.00 - $12.00
                  </span>
                </div>
                <p className="text-[13px] text-text-stem-gray line-clamp-2 leading-relaxed mb-3">
                  110 Suong Nguyet Anh, Ben Thanh, Dist. 1, HCMC
                </p>
              </div>
              <div className="pt-3 border-t border-border-sage-mist/60 flex items-center justify-between gap-2">
                <span className="text-[12px] text-text-stem-gray">
                  Closes at 22:30
                </span>
                <div className="flex items-center gap-2">
                  <button className="px-2.5 py-1.5 border border-border-sage-mist hover:border-primary-moss rounded-lg text-[13px] text-text-charcoal hover:text-primary-moss transition flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                    </svg>
                    <span className="">
                      Get Directions
                    </span>
                  </button>
                  <button className="px-3 py-1.5 bg-primary-moss hover:bg-primary-moss-hover text-white rounded-lg text-[13px] font-medium transition">
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Pagination / Load More */}
          <div className="flex items-center justify-center pt-6 pb-4">
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-surface-paper border border-border-sage-mist rounded-lg text-[14px] text-text-stem-gray hover:text-text-charcoal transition disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="w-10 h-10 rounded-lg bg-primary-moss text-white text-[14px] font-medium flex items-center justify-center">
                1
              </button>
              <button className="w-10 h-10 rounded-lg bg-surface-paper border border-border-sage-mist text-text-charcoal text-[14px] font-medium flex items-center justify-center hover:border-primary-moss transition">
                2
              </button>
              <button className="px-4 py-2 bg-surface-paper border border-border-sage-mist rounded-lg text-[14px] text-text-charcoal hover:border-primary-moss transition">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
      {/* ==================== GLOBAL CHATBOT FAB (primary-moss) ==================== */}
      {/* ==================== AI ASSISTANT FAB & CHAT POPUP ==================== */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Chat Popup Panel (hidden by default) */}
        <div className="w-[380px] max-w-[calc(100vw-32px)] h-[520px] bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl shadow-[0_2px_12px_rgba(43,42,37,0.12)] flex flex-col overflow-hidden hidden mb-3" id="chat-popup">
          {/* Header */}
          <div className="px-4 py-3.5 bg-surface-paper border-b border-border-sage-mist flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#F3F6EE] flex items-center justify-center text-[#2F5233]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-sans font-semibold text-[15px] text-text-charcoal leading-snug">
                  AI Nutrition Assistant
                </h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#4C8C4A]"></span>
                  <span className="text-[11px] text-text-stem-gray">
                    Online & ready
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-text-stem-gray hover:text-text-charcoal hover:bg-bg-herb-white transition" id="chat-minimize" title="Minimize" type="button">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="5" x2="19" y1="12" y2="12"></line>
                </svg>
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-text-stem-gray hover:text-text-charcoal hover:bg-bg-herb-white transition" id="chat-close" title="Close" type="button">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" x2="6" y1="6" y2="18"></line>
                  <line x1="6" x2="18" y1="6" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 text-[13px] bg-[#FDFBF6]">
            {/* AI Message 1 */}
            <div className="flex items-start gap-2.5 max-w-[85%]">
              <div className="w-7 h-7 rounded-full bg-[#F3F6EE] flex items-center justify-center text-[#2F5233] shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"></path>
                </svg>
              </div>
              <div className="bg-bg-herb-white border border-border-sage-mist/80 p-3 rounded-2xl rounded-tl-sm text-text-charcoal leading-relaxed">
                Hello! I am your Vegan Helper Nutrition Assistant. How can I help you find vegan recipes, balance nutrition, or plan wholesome daily meals today?
              </div>
            </div>
            {/* User Message */}
            <div className="flex justify-end">
              <div className="bg-primary-moss text-white p-3 rounded-2xl rounded-tr-sm max-w-[82%] leading-relaxed shadow-sm">
                Could you recommend a high-protein, light vegan lunch option?
              </div>
            </div>
            {/* AI Message 2 */}
            <div className="flex items-start gap-2.5 max-w-[88%]">
              <div className="w-7 h-7 rounded-full bg-[#F3F6EE] flex items-center justify-center text-[#2F5233] shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"></path>
                </svg>
              </div>
              <div className="bg-bg-herb-white border border-border-sage-mist/80 p-3 rounded-2xl rounded-tl-sm text-text-charcoal leading-relaxed">
                For lunch today, you could try: Lotus Seed & Seaweed Soup paired with Silken Tofu in Shiitake Mushroom Sauce. This combination offers complete plant-based protein, cleanses the palate, and digests easily!
              </div>
            </div>
          </div>
          {/* Quick Suggestion Chips */}
          <div className="px-4 py-2 bg-surface-paper border-t border-border-sage-mist/60 flex items-center gap-2 overflow-x-auto no-scrollbar text-[12px]">
            <button className="px-2.5 py-1 rounded-full bg-bg-herb-white border border-border-sage-mist text-text-charcoal hover:border-primary-moss hover:text-primary-moss whitespace-nowrap transition" type="button">
              🌱 High Protein Dishes
            </button>
            <button className="px-2.5 py-1 rounded-full bg-bg-herb-white border border-border-sage-mist text-text-charcoal hover:border-primary-moss hover:text-primary-moss whitespace-nowrap transition" type="button">
              🥣 Weight Loss Menu
            </button>
            <button className="px-2.5 py-1 rounded-full bg-bg-herb-white border border-border-sage-mist text-text-charcoal hover:border-primary-moss hover:text-primary-moss whitespace-nowrap transition" type="button">
              🥦 Ingredient Swaps
            </button>
          </div>
          {/* Chat Input Area */}
          <div className="p-3 bg-surface-paper border-t border-border-sage-mist">
            <div className="flex items-center gap-2 bg-bg-herb-white border border-border-sage-mist rounded-xl px-3 py-1.5 focus-within:border-primary-moss transition">
              <input className="flex-1 bg-transparent text-[13px] text-text-charcoal placeholder:text-text-stem-gray focus:outline-none" placeholder="Ask AI nutrition assistant..." type="text" />
              <button className="w-8 h-8 rounded-full bg-primary-moss hover:bg-primary-moss-hover text-white flex items-center justify-center transition shrink-0" type="button">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="22" x2="11" y1="2" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* AI Sparkle FAB Button */}
        <button aria-label="Open AI Nutrition Assistant" className="w-14 h-14 rounded-full bg-primary-moss text-white flex items-center justify-center shadow-app-fab hover:bg-primary-moss-hover transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-moss focus:ring-offset-2" id="chat-fab" type="button">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
          </svg>
        </button>
      </div>
      {/* ==================== FOOTER ==================== */}
      <footer className="w-full border-t border-[#DCE3D5] bg-[#FDFBF6] py-6 mt-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-sm text-[#6B6F63] gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-semibold text-[#2F5233] text-base">
              Vegan Helper
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

export default FindVeganStores;
