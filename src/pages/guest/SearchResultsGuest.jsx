import { Link } from 'react-router-dom'
import HeaderGuest from '../../components/layout/HeaderGuest';

function SearchResultsGuest() {
  return (
    <>
      {/* HEADER-GUEST (Strict standard 64px, surface-paper, border-sage-mist) */}
      <HeaderGuest />
      {/* MAIN CONTENT CONTAINER (max-w 1120px, gutter 24px per botanical guidelines) */}
      <main className="flex-1 w-full max-w-[1120px] mx-auto px-6 py-8 md:py-10">
        {/* SEARCH BAR & SUMMARY SECTION */}
        <section className="mb-8" id="search-section">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-[#6B6F63]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
                </svg>
              </div>
              <input className="w-full h-12 pl-12 pr-12 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[15px] text-[#2B2A25] placeholder-[#6B6F63] focus:border-[#2F5233] focus:outline-none transition-colors font-medium" id="search-input" placeholder="Search plant-based recipes, videos, wholesome ingredients..." type="text" value="braised mushrooms" />
              <button className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#6B6F63] hover:text-[#2B2A25] cursor-pointer transition-colors" title="Clear keyword" type="button">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" x2="6" y1="6" y2="18"></line>
                  <line x1="6" x2="18" y1="6" y2="18"></line>
                </svg>
              </button>
            </div>
            <button className="h-12 px-6 bg-[#2F5233] hover:bg-[#25401F] text-white rounded-lg font-medium text-[15px] flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 shadow-sm" type="button">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
              </svg>
              <span className="">
                Search
              </span>
            </button>
          </div>
          {/* 1. Master Search Toggle (New Element) */}
          <div className="mt-4 flex items-center">
            <div className="inline-flex bg-[#F3F6EE] p-1 rounded-[8px] border border-[#DCE3D5]">
              <button className="bg-[#FDFBF6] border border-[#DCE3D5] text-[#2F5233] font-semibold rounded-[6px] px-4 py-2 text-sm shadow-none transition-colors cursor-pointer" id="toggle-content-btn" type="button">
                Search Recipes & Stores
              </button>
              <button className="bg-transparent text-[#6B6F63] font-medium hover:text-[#2F5233] border-transparent rounded-[6px] px-4 py-2 text-sm transition-colors cursor-pointer" id="toggle-user-btn" type="button">
                Search Community
              </button>
            </div>
          </div>
          {/* CONTENT SEARCH VIEW */}
          <div id="content-search-view">
            {/* Status Bar for Content */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl text-[14px]" id="search-status-bar">
              <div className="flex items-center gap-2 text-[#2B2A25] flex-wrap">
                <span className="text-[#6B6F63]">
                  Found
                </span>
                <span className="font-semibold text-[#2F5233]">
                  6 articles & videos
                </span>
                <span className="text-[#6B6F63]">
                  •
                </span>
                <span className="font-semibold text-[#2F5233]">
                  3 suggested stores
                </span>
                <span className="text-[#6B6F63]">
                  for keyword:
                </span>
                <span className="font-semibold text-[#2B2A25] px-2 py-0.5 bg-[#E9EFE6] rounded border border-[#DCE3D5]" id="search-keyword-display">
                  'braised mushrooms'
                </span>
                <span className="text-xs text-[#6B6F63]" id="search-count-display">
                  (9 matching results in total)
                </span>
              </div>
              <button className="text-[13px] text-[#A63446] hover:underline flex items-center gap-1 cursor-pointer shrink-0 self-start sm:self-auto" type="button">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                </svg>
                <span className="">
                  Reset filters
                </span>
              </button>
            </div>
            {/* Filter Pills (Cleaned up: Users pill removed) */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 mt-4 scrollbar-none text-[13px]">
              <button className="px-4 py-1.5 rounded-full bg-[#2F5233] text-white font-medium whitespace-nowrap transition-colors" type="button">
                All (9)
              </button>
              <button className="px-4 py-1.5 rounded-full bg-[#FDFBF6] border border-[#DCE3D5] text-[#2B2A25] hover:border-[#2F5233] hover:text-[#2F5233] whitespace-nowrap transition-colors" type="button">
                Articles & Videos (6)
              </button>
              <button className="px-4 py-1.5 rounded-full bg-[#FDFBF6] border border-[#DCE3D5] text-[#2B2A25] hover:border-[#2F5233] hover:text-[#2F5233] whitespace-nowrap transition-colors" type="button">
                Suggested Stores (3)
              </button>
            </div>
            {/* SECTION: SUGGESTED VEGAN STORES */}
            <section className="my-10" id="suggested-shops-section">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center text-[#2F5233]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <h2 className="font-fraunces text-2xl font-medium text-[#2B2A25]">
                    Suggested Vegan Stores for 'braised mushrooms'
                  </h2>
                  <span className="text-[12px] text-[#6B6F63] bg-[#FDFBF6] border border-[#DCE3D5] px-2 py-0.5 rounded-full hidden sm:inline-block">
                    3 locations
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-lg bg-[#FDFBF6] border border-[#DCE3D5] flex items-center justify-center text-[#2B2A25] hover:border-[#2F5233] hover:text-[#2F5233] transition-colors cursor-pointer" title="Previous" type="button">
                    ‹
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-[#FDFBF6] border border-[#DCE3D5] flex items-center justify-center text-[#2B2A25] hover:border-[#2F5233] hover:text-[#2F5233] transition-colors cursor-pointer" title="Next" type="button">
                    ›
                  </button>
                </div>
              </div>
              {/* Stores Cards Carousel / Row */}
              <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-none scroll-smooth" id="shop-carousel-container">
                {/* Store 1 */}
                <div className="min-w-[300px] sm:min-w-[320px] max-w-[340px] bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 flex flex-col justify-between transition-colors hover:border-[#2F5233] group shrink-0">
                  <div>
                    <div className="w-full h-40 rounded-lg bg-[#F3F6EE] border border-[#DCE3D5] relative overflow-hidden mb-3">
                      <img alt="An Lac Vegan Restaurant" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBb4N3eH-iUNIY7gbqJAd0WmtXHtqhov_EHxoeWtYf7XW-vkx2RixW69wFjGVCmv20bs5MsCfOhLInSTEvfIpKL62oZHXUtzfKGW0pOUX9wAHSEj7vni9cXXJXw7ZVRItkrzqurKRqm_EJtNnQe30kTncrCUbAPHt7irU850UwTp-BbgR6SiNTyay-kDL7JCwsfeGm2F8WVVR0CfiOUi2-xTL0C0cO-JdfD-HBoXtHVTbPOyXFe_xIx" />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#FDFBF6]/95 border border-[#DCE3D5] text-[11px] font-medium text-[#4C8C4A]">
                        Open now
                      </span>
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-[#FDFBF6]/95 border border-[#DCE3D5] text-[11px] font-medium text-[#2B2A25] flex items-center gap-1">
                        <svg className="w-3 h-3 text-[#2F5233]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        500 m
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-vietnam font-semibold text-[16px] text-[#2B2A25] group-hover:text-[#2F5233] transition-colors line-clamp-1">
                        An Lac Vegan Restaurant
                      </h3>
                      <div className="flex items-center gap-1 shrink-0">
                        <svg className="w-4 h-4 fill-[#D9A441] text-[#D9A441]" viewBox="0 0 24 24">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        <span className="text-[13px] font-semibold text-[#D9A441]">
                          4.8
                        </span>
                        <span className="text-[11px] text-[#6B6F63]">
                          (120)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1.5 text-[12px] text-[#6B6F63]">
                        <span className="w-[3px] h-3 bg-[#2F5233] rounded-full"></span>
                        <span className="">
                          Traditional vegan cuisine • Braised mushroom with green pepper
                        </span>
                      </div>
                    </div>
                    <p className="text-[12px] text-[#6B6F63] line-clamp-2 leading-relaxed mb-3">
                      124 Dinh Chieu St., Ward Vo Thi Sau, Dist. 3, HCMC
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#DCE3D5] flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[#6B6F63]">
                      Open until 21:00
                    </span>
                    <div className="flex items-center gap-2">
                      <Link className="px-2.5 py-1.5 border border-[#DCE3D5] hover:border-[#2F5233] rounded-lg text-[12px] text-[#2B2A25] hover:text-[#2F5233] transition-colors flex items-center gap-1 cursor-pointer" to="/vegan-stores">
                        <svg className="w-3.5 h-3.5 text-[#2F5233]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span className="">
                          View Map
                        </span>
                      </Link>
                      <Link className="px-3 py-1.5 bg-[#2F5233] hover:bg-[#25401F] text-white rounded-lg text-[12px] font-medium transition-colors cursor-pointer" to="/vegan-stores">
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
                {/* Store 2 */}
                <div className="min-w-[300px] sm:min-w-[320px] max-w-[340px] bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 flex flex-col justify-between transition-colors hover:border-[#2F5233] group shrink-0">
                  <div>
                    <div className="w-full h-40 rounded-lg bg-[#F3F6EE] border border-[#DCE3D5] relative overflow-hidden mb-3">
                      <img alt="Huong Sen Vegan Eatery" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtBb_7tssXHhmeaCfjEvPq6lABFW_b6FsDPyp0YxgkIG0RLO0UJxHRXeqT5TVsLlPNCBHbr0I9pfeunPOagMoIO-7Wc4ndEj1bz3Ulz1g2_kibeEsGaMhbHhmLC3Qtf9e7-fHzeKdqSUXyxFPxajm3r4Im7g2EVm72WgUbXlL2Y8fVkDuTgjusMqBqQ8QKaj4nOSYedJbDFu71YU59D01hv28ZqZTCcHq3GnYulTrcp0rWA03bL3Lm" />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#FDFBF6]/95 border border-[#DCE3D5] text-[11px] font-medium text-[#4C8C4A]">
                        Open now
                      </span>
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-[#FDFBF6]/95 border border-[#DCE3D5] text-[11px] font-medium text-[#2B2A25] flex items-center gap-1">
                        <svg className="w-3 h-3 text-[#2F5233]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        1.2 km
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-vietnam font-semibold text-[16px] text-[#2B2A25] group-hover:text-[#2F5233] transition-colors line-clamp-1">
                        Huong Sen Vegan Eatery
                      </h3>
                      <div className="flex items-center gap-1 shrink-0">
                        <svg className="w-4 h-4 fill-[#D9A441] text-[#D9A441]" viewBox="0 0 24 24">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        <span className="text-[13px] font-semibold text-[#D9A441]">
                          4.7
                        </span>
                        <span className="text-[11px] text-[#6B6F63]">
                          (96)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1.5 text-[12px] text-[#6B6F63]">
                        <span className="w-[3px] h-3 bg-[#D9A441] rounded-full"></span>
                        <span className="">
                          Hotpot & buffet • Braised king oyster mushrooms
                        </span>
                      </div>
                    </div>
                    <p className="text-[12px] text-[#6B6F63] line-clamp-2 leading-relaxed mb-3">
                      45 Le Quy Don St., Ward Vo Thi Sau, Dist. 3, HCMC
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#DCE3D5] flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[#6B6F63]">
                      Open until 22:00
                    </span>
                    <div className="flex items-center gap-2">
                      <Link className="px-2.5 py-1.5 border border-[#DCE3D5] hover:border-[#2F5233] rounded-lg text-[12px] text-[#2B2A25] hover:text-[#2F5233] transition-colors flex items-center gap-1 cursor-pointer" to="/vegan-stores">
                        <svg className="w-3.5 h-3.5 text-[#2F5233]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span className="">
                          View Map
                        </span>
                      </Link>
                      <Link className="px-3 py-1.5 bg-[#2F5233] hover:bg-[#25401F] text-white rounded-lg text-[12px] font-medium transition-colors cursor-pointer" to="/vegan-stores">
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
                {/* Store 3 */}
                <div className="min-w-[300px] sm:min-w-[320px] max-w-[340px] bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 flex flex-col justify-between transition-colors hover:border-[#2F5233] group shrink-0">
                  <div>
                    <div className="w-full h-40 rounded-lg bg-[#F3F6EE] border border-[#DCE3D5] relative overflow-hidden mb-3">
                      <img alt="Thien Tam Vegan Kitchen" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi5LEhzqT9c2VAESffItTMLFbSvk-ihoXnHLlEaYw-h6EjvbII_epfihs-Xx1ck85DRslj9vaNEQED6VPONVCpKfQuSfHF3IkZ9jCYuKnaNQZfNOk0k_PgNmq0SaRfGf0E1jViy0i8dL_15V7uYVn3a154ZEje-5cpV0HR1AB3m_RjkZ5XZ48tC9q5DOxlpTIRazbnBCHSHCp93SJ92GpmCbZSIJWJQrqINQnz_ktgMJLXbS9MhLda" />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#FDFBF6]/95 border border-[#DCE3D5] text-[11px] font-medium text-[#4C8C4A]">
                        Open now
                      </span>
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-[#FDFBF6]/95 border border-[#DCE3D5] text-[11px] font-medium text-[#2B2A25] flex items-center gap-1">
                        <svg className="w-3 h-3 text-[#2F5233]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        1.8 km
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-vietnam font-semibold text-[16px] text-[#2B2A25] group-hover:text-[#2F5233] transition-colors line-clamp-1">
                        Thien Tam Vegan Kitchen
                      </h3>
                      <div className="flex items-center gap-1 shrink-0">
                        <svg className="w-4 h-4 fill-[#D9A441] text-[#D9A441]" viewBox="0 0 24 24">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        <span className="text-[13px] font-semibold text-[#D9A441]">
                          4.9
                        </span>
                        <span className="text-[11px] text-[#6B6F63]">
                          (214)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1.5 text-[12px] text-[#6B6F63]">
                        <span className="w-[3px] h-3 bg-[#A63446] rounded-full"></span>
                        <span className="">
                          Macrobiotic cuisine • Claypot mushrooms
                        </span>
                      </div>
                    </div>
                    <p className="text-[12px] text-[#6B6F63] line-clamp-2 leading-relaxed mb-3">
                      88 Nam Ky Khoi Nghia St., Dist. 1, HCMC
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#DCE3D5] flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[#6B6F63]">
                      Open until 21:30
                    </span>
                    <div className="flex items-center gap-2">
                      <Link className="px-2.5 py-1.5 border border-[#DCE3D5] hover:border-[#2F5233] rounded-lg text-[12px] text-[#2B2A25] hover:text-[#2F5233] transition-colors flex items-center gap-1 cursor-pointer" to="/vegan-stores">
                        <svg className="w-3.5 h-3.5 text-[#2F5233]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span className="">
                          View Map
                        </span>
                      </Link>
                      <Link className="px-3 py-1.5 bg-[#2F5233] hover:bg-[#25401F] text-white rounded-lg text-[12px] font-medium transition-colors cursor-pointer" to="/vegan-stores">
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* SECTION: MATCHING ARTICLES & VIDEOS */}
            <section id="recipes-results-section">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-fraunces text-2xl font-medium text-[#2B2A25]" id="results-title">
                  Matching Articles & Videos (6 results)
                </h2>
                <div className="flex items-center gap-2 text-[13px] text-[#6B6F63]">
                  <span className="text-[#2B2A25] font-semibold underline underline-offset-4 cursor-pointer">
                    Relevance
                  </span>
                  <span className="">
                    •
                  </span>
                  <span className="hover:text-[#2F5233] cursor-pointer">
                    Newest
                  </span>
                  <span className="">
                    •
                  </span>
                  <span className="hover:text-[#2F5233] cursor-pointer">
                    Most Popular
                  </span>
                </div>
              </div>
              {/* Feed Container */}
              <div className="flex flex-col gap-4" id="feed-cards-container">
                {/* Article 1 */}
                <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer group" to="/posts/1">
                  <div className="relative overflow-hidden w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 transition-transform group-hover:scale-[1.01]">
                    <img alt="Braised Straw Mushrooms with Green Pepper" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1WB5ue4YCiF80yX2LzmxjB651NSmec6AmpbmpsEy1yW2-RMH9r6Fa4PggMuAx5Grp-uwgUJ6OPHepQksJuRi6w6mXPryD_ffHB6dt4S8aLkuIaMrpE2GkbpHQ579qI0feP47eU3GW1We4Znk4_VP1cUcagdQ2fOCkgqdbLJORKO5mrR3oCKdmvYTWCmapm2oMAjUBSCNUXJgEwMVMlvDpkLFAW9v4-XBXy5P9u6krFA6hwJi5RXRipZfjI" />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-white text-[12px] font-medium z-10 font-vietnam" style={{ background: 'rgba(43, 42, 37, 0.6)' }}>
                      1/4
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-[3px] h-3.5 bg-[#2F5233] rounded-full"></span>
                        <span className="text-[13px] font-medium text-[#6B6F63]">
                          Braised Dishes
                        </span>
                        <span className="text-xs text-[#6B6F63]">
                          •
                        </span>
                        <span className="text-[13px] text-[#6B6F63]">
                          25 minutes ago
                        </span>
                      </div>
                      <h3 className="font-vietnam text-[18px] md:text-[20px] font-semibold text-[#2B2A25] mb-2 leading-snug group-hover:text-[#2F5233] transition-colors">
                        Braised Straw Mushrooms with Green Pepper - Rustic Country Flavor
                      </h3>
                      <p className="text-[14px] md:text-[15px] leading-relaxed text-[#6B6F63] line-clamp-2 mb-3">
                        Secrets to choosing tender fresh straw mushrooms and simmering on low heat with tamari soy sauce, cracked pepper, and rich coconut oil for a glistening brown coating.
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#DCE3D5] flex items-center justify-between text-[13px] text-[#6B6F63]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
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
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-[#D9A441]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          Rating:
                          <strong className="font-semibold text-[#2B2A25]">
                            4.8
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                {/* Video 2 */}
                <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer group" to="/posts/1">
                  <div className="relative overflow-hidden w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 flex flex-col items-center justify-center transition-transform group-hover:scale-[1.01]">
                    <img alt="Savory Glazed King Oyster Mushrooms" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1WKQI6FUHWfVtKTrj04MIGfapn2kKdbvISdihxFG-f7w0ySFktcAXUJeEK-um1Yo5mY9fgSSIEGLX1EfoSMS9NIkBhDMHqAamg0DpCajzR5k5F-lDIuyHmiPeupCwIPvAmL3nRnyg7YAOw8PaR-BTt8oakaY6bVCq-jAnbta0HL0nOf1EWsSbtxT2P-QBKdbWNNFv0igMkQnaed7Oigqp4cdbCOPC1OhWSkt9tVerGToLBZxByrBuEVHKk" />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-white text-[12px] font-medium z-10 font-vietnam" style={{ background: 'rgba(43, 42, 37, 0.6)' }}>
                      1/3
                    </span>
                    <div className="relative z-10 w-10 h-10 rounded-full bg-[#2F5233] text-white flex items-center justify-center mb-1 group-hover:bg-[#25401F] transition-colors shadow-sm">
                      <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-[#2B2A25] text-white text-[11px] font-medium z-10">
                      12:34
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-[3px] h-3.5 bg-[#A63446] rounded-full"></span>
                        <span className="text-[13px] font-medium text-[#6B6F63]">
                          Cooking Videos
                        </span>
                        <span className="text-xs text-[#6B6F63]">
                          •
                        </span>
                        <span className="text-[13px] text-[#6B6F63]">
                          1 hour ago
                        </span>
                      </div>
                      <h3 className="font-vietnam text-[18px] md:text-[20px] font-semibold text-[#2B2A25] mb-2 leading-snug group-hover:text-[#2F5233] transition-colors">
                        Video: How to Make Savory Glazed King Oyster Mushrooms with Ginger & Lemongrass
                      </h3>
                      <p className="text-[14px] md:text-[15px] leading-relaxed text-[#6B6F63] line-clamp-2 mb-3">
                        Detailed 12-minute guide on scoring mushroom caps for deep sauce absorption, creating a delicate crispy aroma with soothing lemongrass warmth.
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#DCE3D5] flex items-center justify-between text-[13px] text-[#6B6F63]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
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
                            518
                          </strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-[#D9A441]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          Rating:
                          <strong className="font-semibold text-[#2B2A25]">
                            4.9
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                {/* Article 3 */}
                <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer group" to="/posts/1">
                  <div className="relative overflow-hidden w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 transition-transform group-hover:scale-[1.01]">
                    <img alt="Silken Tofu Braised with Dried Shiitake Mushrooms" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVfcNfv6SrzfXEkf-nGsqblNfbR0V4_qCXwSQevW31k-dn398IA_LiBqydkLyKo9m1LVL1pXFO-qWueef3ydxucZUiBUb4hchzBhpB4EMU2FDNQGShL_rfZgWk2YcDNiWuEq9bXvNYM9aqD6YH4AYIN74YmbyzLy3dg2mKRkSjcueZcvKqSdVdteueZrrgl5AvDKQ3DoR_dhq0sloJVhOXpeFKB0lRwgzxmQmHdfewKidmdNnVo7XG" />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-white text-[12px] font-medium z-10 font-vietnam" style={{ background: 'rgba(43, 42, 37, 0.6)' }}>
                      1/5
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-[3px] h-3.5 bg-[#2F5233] rounded-full"></span>
                        <span className="text-[13px] font-medium text-[#6B6F63]">
                          Main Dishes
                        </span>
                        <span className="text-xs text-[#6B6F63]">
                          •
                        </span>
                        <span className="text-[13px] text-[#6B6F63]">
                          2 hours ago
                        </span>
                      </div>
                      <h3 className="font-vietnam text-[18px] md:text-[20px] font-semibold text-[#2B2A25] mb-2 leading-snug group-hover:text-[#2F5233] transition-colors">
                        Silken Tofu Braised with Dried Shiitake Mushrooms in Fermented Bean Sauce
                      </h3>
                      <p className="text-[14px] md:text-[15px] leading-relaxed text-[#6B6F63] line-clamp-2 mb-3">
                        A soothing combination of tender silken tofu and soft braised shiitake simmered in fresh coconut water, pairing wonderfully with warm family rice.
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#DCE3D5] flex items-center justify-between text-[13px] text-[#6B6F63]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
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
                            215
                          </strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-[#D9A441]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          Rating:
                          <strong className="font-semibold text-[#2B2A25]">
                            4.7
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                {/* Video 4 */}
                <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer group" to="/posts/1">
                  <div className="relative overflow-hidden w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 flex flex-col items-center justify-center transition-transform group-hover:scale-[1.01]">
                    <img alt="Claypot Braised Oyster Mushrooms" className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnWkq_bURaXfMU7sIX1B3Y3UbeSoz77jrkof_pTNKjP9qEtR06yg33SX-D_zzaZlYY3GKirWeHyz1_ZDZ5S-QU1D2CyO2E9Hg-jUYyNlHl-m9_EHYT01McgTLVn03mJJKeil3H5FO896tgaXqhMo1_rg5LyHPnmMeoqRq6FYxKEqwmZG3AmkS0qxu5NUC7MenovrbkRLdjBrWK4c10kSrRyvOqbhYVR5fz5fZ9Cdcc57po77p4a2Wo" />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-white text-[12px] font-medium z-10 font-vietnam" style={{ background: 'rgba(43, 42, 37, 0.6)' }}>
                      1/3
                    </span>
                    <div className="relative z-10 w-10 h-10 rounded-full bg-[#2F5233] text-white flex items-center justify-center mb-1 group-hover:bg-[#25401F] transition-colors shadow-sm">
                      <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
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
                          Cooking Videos
                        </span>
                        <span className="text-xs text-[#6B6F63]">
                          •
                        </span>
                        <span className="text-[13px] text-[#6B6F63]">
                          Yesterday
                        </span>
                      </div>
                      <h3 className="font-vietnam text-[18px] md:text-[20px] font-semibold text-[#2B2A25] mb-2 leading-snug group-hover:text-[#2F5233] transition-colors">
                        Video: Claypot Braised Oyster Mushrooms with Aromatic Thai Basil
                      </h3>
                      <p className="text-[14px] md:text-[15px] leading-relaxed text-[#6B6F63] line-clamp-2 mb-3">
                        Quick tips to sear mushrooms over high flame before braising in earthen claypot to keep maximum juiciness and natural fragrance.
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#DCE3D5] flex items-center justify-between text-[13px] text-[#6B6F63]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
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
                            620
                          </strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-[#D9A441]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          Rating:
                          <strong className="font-semibold text-[#2B2A25]">
                            4.9
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                {/* Article 5 */}
                <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer group" to="/posts/1">
                  <div className="relative overflow-hidden w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 transition-transform group-hover:scale-[1.01]">
                    <img alt="Black Termite Mushrooms Braised with Rich Coconut Cream" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpTJLVsudmW1KVZ6rK-vUrv1YIwZ5qyideft5iClOlkXD_l85R2nquvQ3PAJLrgvBte4Ua5Atc9wP2ZFCpT4j0Kk1UhG38J9jhc4aBvnsNZkGeodxMHc-IsStihemzlo1f_PxoMSPXqlgo6KYPUfeBEyTni0YiJ9ey6tTZC2wgIC1hKvBV3qxjxfnwq9boa36cboALPBBc3KeESKbnRP39N8iheoP0YNLTx73HHli4O8WpRqdvLzRD" />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-white text-[12px] font-medium z-10 font-vietnam" style={{ background: 'rgba(43, 42, 37, 0.6)' }}>
                      1/4
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-[3px] h-3.5 bg-[#2F5233] rounded-full"></span>
                        <span className="text-[13px] font-medium text-[#6B6F63]">
                          Braised Dishes
                        </span>
                        <span className="text-xs text-[#6B6F63]">
                          •
                        </span>
                        <span className="text-[13px] text-[#6B6F63]">
                          3 days ago
                        </span>
                      </div>
                      <h3 className="font-vietnam text-[18px] md:text-[20px] font-semibold text-[#2B2A25] mb-2 leading-snug group-hover:text-[#2F5233] transition-colors">
                        Black Termite Mushrooms Braised with Rich Coconut Cream
                      </h3>
                      <p className="text-[14px] md:text-[15px] leading-relaxed text-[#6B6F63] line-clamp-2 mb-3">
                        Delicate and crispy wild mushrooms enveloped in velvety simmered coconut reduction and coarse cracked pepper.
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#DCE3D5] flex items-center justify-between text-[13px] text-[#6B6F63]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
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
                            189
                          </strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-[#D9A441]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          Rating:
                          <strong className="font-semibold text-[#2B2A25]">
                            4.6
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                {/* Article 6 */}
                <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer group" to="/posts/1">
                  <div className="relative overflow-hidden w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 transition-transform group-hover:scale-[1.01]">
                    <img alt="Young Jackfruit Braised with Tender Straw Mushrooms" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1Vg-qfSmhz0wmNociW2JI-LpplsY_hhYhjzPDUa-ukgYaSY52N3BKo2MaYe5Q4eiXsvUtBgprUIS_qd_Yt6PkMxanDVcSqftvoaKxm4J_AiHULIy89qh0mQc2mlUDGKjn_sisydSWD7jl01hgjMPjGrgTvYMMvnj2wux5YOFLyp6evgziGIVIeqhjDrtJoFWj-Gedr4AegXZN2Tyfam2mz-soiq3U1Z3Ox0L1j0VJvoJetEEoiY5SqQQCI" />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-white text-[12px] font-medium z-10 font-vietnam" style={{ background: 'rgba(43, 42, 37, 0.6)' }}>
                      1/3
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-[3px] h-3.5 bg-[#2F5233] rounded-full"></span>
                        <span className="text-[13px] font-medium text-[#6B6F63]">
                          Braised Dishes
                        </span>
                        <span className="text-xs text-[#6B6F63]">
                          •
                        </span>
                        <span className="text-[13px] text-[#6B6F63]">
                          5 days ago
                        </span>
                      </div>
                      <h3 className="font-vietnam text-[18px] md:text-[20px] font-semibold text-[#2B2A25] mb-2 leading-snug group-hover:text-[#2F5233] transition-colors">
                        Young Jackfruit Braised with Tender Straw Mushrooms
                      </h3>
                      <p className="text-[14px] md:text-[15px] leading-relaxed text-[#6B6F63] line-clamp-2 mb-3">
                        Hearty Southern countryside dish combining braised young jackfruit with sweet straw mushrooms and fresh coriander garnish.
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#DCE3D5] flex items-center justify-between text-[13px] text-[#6B6F63]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <circle cx="12" cy="7" r="4"></circle>
                            <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                          </svg>
                        </div>
                        <span className="font-medium text-[#2B2A25]">
                          Minh Tri
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="">
                          Views:
                          <strong className="font-semibold text-[#2B2A25]">
                            275
                          </strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-[#D9A441]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                          Rating:
                          <strong className="font-semibold text-[#2B2A25]">
                            4.8
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              {/* Pagination */}
              <div className="mt-8 flex justify-center" id="feed-pagination">
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] text-[#6B6F63] transition-colors opacity-50 cursor-not-allowed" disabled>
                    Previous
                  </button>
                  <button className="w-10 h-10 rounded-lg bg-[#2F5233] text-white text-[14px] font-medium flex items-center justify-center">
                    1
                  </button>
                  <button className="w-10 h-10 rounded-lg bg-[#FDFBF6] border border-[#DCE3D5] text-[#2B2A25] text-[14px] font-medium flex items-center justify-center hover:border-[#2F5233] transition-colors cursor-pointer">
                    2
                  </button>
                  <button className="px-4 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] text-[#2B2A25] hover:border-[#2F5233] transition-colors cursor-pointer">
                    Next
                  </button>
                </div>
              </div>
            </section>
          </div>
          {/* 3. USER SEARCH VIEW (Separated tab view, initially hidden) */}
          <div className="hidden" id="user-search-view">
            {/* Summary Bar for Users */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl text-[14px]" id="user-search-status-bar">
              <div className="flex items-center gap-2 text-[#2B2A25] flex-wrap">
                <span className="text-[#6B6F63]">
                  Found
                </span>
                <span className="font-semibold text-[#2F5233]">
                  4 community members & chefs
                </span>
                <span className="text-[#6B6F63]">
                  matching:
                </span>
                <span className="font-semibold text-[#2B2A25] px-2 py-0.5 bg-[#E9EFE6] rounded border border-[#DCE3D5]">
                  'braised mushrooms'
                </span>
              </div>
              <button className="text-[13px] text-[#A63446] hover:underline flex items-center gap-1 cursor-pointer shrink-0 self-start sm:self-auto" type="button">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                </svg>
                <span>
                  Reset filters
                </span>
              </button>
            </div>
            <section className="my-8" id="community-users-section">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center text-[#2F5233]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h2 className="font-fraunces text-2xl font-medium text-[#2B2A25]">
                    Community Chefs & Home Cooks (4 results)
                  </h2>
                  <span className="text-[12px] text-[#6B6F63] bg-[#FDFBF6] border border-[#DCE3D5] px-2 py-0.5 rounded-full hidden sm:inline-block">
                    4 members
                  </span>
                </div>
                <a className="text-[13px] text-[#2F5233] hover:underline font-medium hidden sm:inline-flex items-center gap-1" href="#community-creators">
                  View all members
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </a>
              </div>
              {/* Responsive Grid for User Cards (2-3 columns on desktop) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {/* User Card 1 */}
                <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-5 flex items-center justify-between gap-4 hover:border-[#2F5233] transition-colors group shadow-none">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img alt="Chef Duy Nguyen" className="w-12 h-12 rounded-full object-cover border border-[#DCE3D5] shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBklss9rXIRhhwvMMfGCwu8N3WE2RDz6wM6VzawptxE5Fy3ZS-s7kMYh0agZHILJA78Fbe4_Bek35LS8KrPCr0a-zaDkK8paxGPuTd9QWNLc-5ZF-3lBqzbsOWCywR38dJR_T6PJcSIsGqa8526CU_LEaxFRLC9xRgoCeLvENTS_tBw84FyTpVHvzwdPrDdSqlAlvH5_4P-J5d7SajaThiTi5MYLawXLCYkd67czAsiyesxUgoNF5ly" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-fraunces text-[#2B2A25] font-medium text-[16px] group-hover:text-[#2F5233] transition-colors truncate">
                          Chef Duy Nguyen
                        </h3>
                        <span className="w-2 h-2 rounded-full bg-[#4C8C4A] shrink-0" title="Verified Culinary Specialist"></span>
                      </div>
                      <p className="font-vietnam text-[#6B6F63] text-xs sm:text-[13px] mt-0.5 truncate">
                        Plant-Based Culinary Instructor
                      </p>
                      <span className="text-[11px] text-[#2F5233] font-medium">
                        18 Braised Mushroom Recipes
                      </span>
                    </div>
                  </div>
                  <Link className="px-3.5 py-2 border border-[#DCE3D5] hover:border-[#2F5233] hover:bg-[#F3F6EE] text-[#2B2A25] hover:text-[#2F5233] text-xs sm:text-[13px] rounded-lg font-medium transition-colors whitespace-nowrap shrink-0" to="/users/1">
                    View Profile
                  </Link>
                </div>
                {/* User Card 2 */}
                <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-5 flex items-center justify-between gap-4 hover:border-[#2F5233] transition-colors group shadow-none">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img alt="Mai Linh Tran" className="w-12 h-12 rounded-full object-cover border border-[#DCE3D5] shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOz6jeyVNwjhCxqNfvL2IXiG5oYIwbY9aXmNOQo2Xt4y8oJLd3mlNmMwyF_13KeKbvwaaPesvGRgTrprllyDYjSxe3SoGTINkfgKUakP7bWw262gUyE5n8pYmgSQcJRdtn70FegkYYFFi5fNAITCzBmPUQzhfWSGkdz_7-iJJu8ES11jKerKfR25GIMv8btcWup3NI9YOa9dN8UqWuXmCV9vbCuUGufYKhsOlmsx6wl2rhlp6BygMU" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-fraunces text-[#2B2A25] font-medium text-[16px] group-hover:text-[#2F5233] transition-colors truncate">
                          Mai Linh Tran
                        </h3>
                      </div>
                      <p className="font-vietnam text-[#6B6F63] text-xs sm:text-[13px] mt-0.5 truncate">
                        Macrobiotic Home Cook & Stylist
                      </p>
                      <span className="text-[11px] text-[#2F5233] font-medium">
                        12 Video Guides Shared
                      </span>
                    </div>
                  </div>
                  <Link className="px-3.5 py-2 border border-[#DCE3D5] hover:border-[#2F5233] hover:bg-[#F3F6EE] text-[#2B2A25] hover:text-[#2F5233] text-xs sm:text-[13px] rounded-lg font-medium transition-colors whitespace-nowrap shrink-0" to="/users/1">
                    View Profile
                  </Link>
                </div>
                {/* User Card 3 */}
                <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-5 flex items-center justify-between gap-4 hover:border-[#2F5233] transition-colors group shadow-none">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img alt="Thao Nguyen" className="w-12 h-12 rounded-full object-cover border border-[#DCE3D5] shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdod5TOhLaKgpEpFX33-AtFQmtN_z6PcpAL0rAczj2OeRPdzFjzlNoQ5fUe0L-m0dJq1olT6t8bRgbnbQrfMl0B0mjPwBvuPN-StN-44tfwJViYgts_uegFttRJmF4KzDp_90dIU-4RnocO86b-Jg2Irlp9UfBou00Le-Af3yHFvtNE7EhLv19DtdQ9xFUAkoUyY7k7U5Sm4fbq9IiP44uGv4mEa6IPFF_IeONKhLxH_WBQjyE9Jt2" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-fraunces text-[#2B2A25] font-medium text-[16px] group-hover:text-[#2F5233] transition-colors truncate">
                          Thao Nguyen
                        </h3>
                      </div>
                      <p className="font-vietnam text-[#6B6F63] text-xs sm:text-[13px] mt-0.5 truncate">
                        Fermentation & Tofu Enthusiast
                      </p>
                      <span className="text-[11px] text-[#2F5233] font-medium">
                        24 Wholesome Posts
                      </span>
                    </div>
                  </div>
                  <Link className="px-3.5 py-2 border border-[#DCE3D5] hover:border-[#2F5233] hover:bg-[#F3F6EE] text-[#2B2A25] hover:text-[#2F5233] text-xs sm:text-[13px] rounded-lg font-medium transition-colors whitespace-nowrap shrink-0" to="/users/1">
                    View Profile
                  </Link>
                </div>
                {/* User Card 4 */}
                <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-5 flex items-center justify-between gap-4 hover:border-[#2F5233] transition-colors group shadow-none">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img alt="Minh Tri Le" className="w-12 h-12 rounded-full object-cover border border-[#DCE3D5] shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfhzbgYpqBuCC3J9jRKL7Jevg3MtNS75U7TrL1G-nh3JjDTMRltASzIX_CJgdHazei6u6r3waPeH9Mlkr5yuDp35vxxB7SYL9t1gVCr_4xtYCrRwLCNqRABZcRbFRWI-3naa1DqWpe2T8OdLoHZR-IOWRvnOePYOFJyhTSERafksAQWbHlntefqWsEYY4Oho3sbXur8IMujvQEoiMx5w7A3GEzPZw8d_lBswwMFLufsG4-sO0hwgfl" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-fraunces text-[#2B2A25] font-medium text-[16px] group-hover:text-[#2F5233] transition-colors truncate">
                          Minh Tri Le
                        </h3>
                      </div>
                      <p className="font-vietnam text-[#6B6F63] text-xs sm:text-[13px] mt-0.5 truncate">
                        Community Recipe Creator
                      </p>
                      <span className="text-[11px] text-[#2F5233] font-medium">
                        9 Traditional Braises
                      </span>
                    </div>
                  </div>
                  <Link className="px-3.5 py-2 border border-[#DCE3D5] hover:border-[#2F5233] hover:bg-[#F3F6EE] text-[#2B2A25] hover:text-[#2F5233] text-xs sm:text-[13px] rounded-lg font-medium transition-colors whitespace-nowrap shrink-0" to="/users/1">
                    View Profile
                  </Link>
                </div>
              </div>
            </section>
          </div>
          {/* Empty State (Fallback for un-matched searches) */}
          <div className="hidden flex-col items-center justify-center text-center p-12 bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl my-6" id="empty-search-state">
            <div className="w-16 h-16 rounded-full bg-[#F3F6EE] border border-[#DCE3D5] flex items-center justify-center text-[#6B6F63] mb-4">
              <svg className="w-8 h-8 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
                <line x1="8" x2="14" y1="11" y2="11"></line>
              </svg>
            </div>
            <h3 className="font-fraunces text-2xl font-medium text-[#2B2A25] mb-2">
              No matching results found
            </h3>
            <p className="text-[14px] text-[#6B6F63] max-w-md mb-6 leading-relaxed">
              Unfortunately, Botanical Hearth could not find any recipes, videos, or vegan shops matching
              <span className="font-semibold text-[#2B2A25]" id="empty-keyword"></span>
              . Please try another search term!
            </p>
            <div className="flex flex-col items-center gap-2.5">
              <span className="text-[12px] font-medium text-[#6B6F63]">
                Popular suggested searches:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2 text-[13px]">
                <button className="px-3 py-1 bg-[#F3F6EE] border border-[#DCE3D5] rounded-full text-[#2F5233] hover:border-[#2F5233] transition-colors cursor-pointer" type="button">
                  braised mushrooms
                </button>
                <button className="px-3 py-1 bg-[#F3F6EE] border border-[#DCE3D5] rounded-full text-[#2F5233] hover:border-[#2F5233] transition-colors cursor-pointer" type="button">
                  lotus seed soup
                </button>
                <button className="px-3 py-1 bg-[#F3F6EE] border border-[#DCE3D5] rounded-full text-[#2F5233] hover:border-[#2F5233] transition-colors cursor-pointer" type="button">
                  silken tofu
                </button>
                <button className="px-3 py-1 bg-[#F3F6EE] border border-[#DCE3D5] rounded-full text-[#2F5233] hover:border-[#2F5233] transition-colors cursor-pointer" type="button">
                  lotus stem salad
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* CHATBOT FAB & POPUP (Fixed bottom-6 right-6, primary-moss #2F5233) */}
      <aside className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* FAB Button */}
        <button className="w-14 h-14 rounded-full bg-[#2F5233] hover:bg-[#25401F] text-white flex items-center justify-center modal-shadow transition-transform hover:scale-105 cursor-pointer" id="chat-fab" title="Botanical Hearth AI Assistant">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 00-1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
          </svg>
        </button>
        {/* Popup Panel */}
        <div className="hidden fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-32px)] h-[520px] bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl modal-shadow z-50 flex flex-col overflow-hidden" id="chat-popup">
          {/* Header Popup */}
          <div className="h-16 px-4 bg-[#FDFBF6] border-b border-[#DCE3D5] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#F3F6EE] border border-[#DCE3D5] flex items-center justify-center text-[#2F5233]">
                <svg className="w-5 h-5 text-[#2F5233]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 00-1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-vietnam text-[15px] font-semibold text-[#2B2A25] leading-tight">
                  AI Nutrition Assistant
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#4C8C4A]"></span>
                  <span className="text-[11px] text-[#6B6F63]">
                    Online & ready
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[#6B6F63]">
              <button className="w-8 h-8 rounded-lg hover:bg-[#E9EFE6] flex items-center justify-center text-[#2B2A25] transition-colors cursor-pointer" title="Minimize">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="5" x2="19" y1="12" y2="12"></line>
                </svg>
              </button>
              <button className="w-8 h-8 rounded-lg hover:bg-[#E9EFE6] flex items-center justify-center text-[#2B2A25] transition-colors cursor-pointer" title="Close">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" x2="6" y1="6" y2="18"></line>
                  <line x1="6" x2="18" y1="6" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          {/* Chat Messages Content */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-[13px] leading-relaxed bg-[#F3F6EE]/40">
            {/* AI Greeting */}
            <div className="flex gap-2.5 max-w-[88%]">
              <div className="w-7 h-7 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center text-[#2F5233] shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                </svg>
              </div>
              <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl rounded-tl-none p-3 text-[#2B2A25]">
                Hello! I am the Botanical Hearth AI Nutrition Assistant. I can help you search wholesome plant-based recipes, balance macro nutrients, or suggest your meal plan today.
              </div>
            </div>
            {/* User Query */}
            <div className="flex justify-end">
              <div className="max-w-[85%] bg-[#2F5233] text-white rounded-xl rounded-tr-none p-3 text-[13px]">
                Could you suggest a balanced high-protein and light plant-based lunch for today?
              </div>
            </div>
            {/* AI Response */}
            <div className="flex gap-2.5 max-w-[88%]">
              <div className="w-7 h-7 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center text-[#2F5233] shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                </svg>
              </div>
              <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl rounded-tl-none p-3 text-[#2B2A25]">
                For lunch today, consider pairing
                <strong>
                  Lotus Seed & Seaweed Clear Soup
                </strong>
                with
                <strong>
                  Silken Tofu Braised with Shiitake Mushrooms
                </strong>
                . This duo offers complete plant protein, clean energy, and aids digestion effortlessly!
              </div>
            </div>
          </div>
          {/* Suggestion Chips */}
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
          {/* Input Bar */}
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
      {/* FOOTER (surface-paper, border-t border-sage-mist) */}
      <footer className="w-full border-t border-[#DCE3D5] bg-[#FDFBF6] py-6 mt-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-sm text-[#6B6F63] gap-4">
          <div className="flex items-center gap-2">
            <span className="font-fraunces font-semibold text-[#2F5233] text-base">
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
    </>
  );
}

export default SearchResultsGuest;
