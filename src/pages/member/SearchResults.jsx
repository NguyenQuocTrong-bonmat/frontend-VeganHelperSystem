import { Link } from 'react-router-dom'
import HeaderMember from '../../components/layout/HeaderMember';

function SearchResults() {
  return (
    <>
      {/* HEADER-LOGGED-IN (64px, surface-paper, 1px solid border-sage-mist) */}
      <HeaderMember />
      {/* MAIN CONTENT CONTAINER (max-w 1120px) */}
      <main className="flex-1 w-full max-w-[1120px] mx-auto px-6 py-8 md:py-10">
        <section className="mb-8" id="search-section">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-[#6B6F63]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
                </svg>
              </div>
              <input className="w-full h-12 pl-12 pr-12 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[15px] text-[#2B2A25] placeholder-[#6B6F63] focus:border-[#2F5233] focus:outline-none transition-colors font-medium" id="search-input" placeholder="Search plant-based recipes, cooking videos, ingredients..." type="text" value="braised mushrooms" />
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
          <div className="inline-flex p-1 rounded-lg bg-[#F3F6EE] border border-[#DCE3D5] mb-6 gap-1 mt-6">
            <button className="px-4 py-2 text-sm font-medium rounded bg-[#FDFBF6] text-[#2F5233] border border-[#DCE3D5] shadow-sm cursor-pointer transition-colors" id="btn-toggle-content" type="button">
              Search Recipes & Stores
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded text-[#6B6F63] hover:text-[#2F5233] border border-transparent cursor-pointer transition-colors" id="btn-toggle-community" type="button">
              Search Community
            </button>
          </div>
        </section>
        <div id="content-search-view">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl text-[14px]" id="search-status-bar">
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
          </div>
          <section className="mb-12" id="suggested-shops-section">
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
            <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-none scroll-smooth" id="shop-carousel-container">
              <div className="min-w-[300px] sm:min-w-[320px] max-w-[340px] bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 flex flex-col justify-between transition-colors hover:border-[#2F5233] group shrink-0">
                <div>
                  <div className="w-full h-40 rounded-lg bg-[#F3F6EE] border border-[#DCE3D5] flex flex-col items-center justify-center text-[#6B6F63] relative overflow-hidden mb-3">
                    <img alt="An Lac Vegan Restaurant" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1UWq6QAO9LLqVUle6JQFAdIhw3VR1_4Ig2RPOrmHaL5EvET8yXvk8JRo3i2PC8gtSuI5b0-LWq760DXbNA8579WWIKI9blytcn_lNPImd4XXIY6e3zXgVvVU3UKssXs6FZYOptuJ3gDYyhufhfhGMUUALjzhsWKulGCqY5rmW3O4mlh_JIVac3D82BH7Pff7LDSMVmdBjSdEP1up3fcEsYFztKn9uZTKW7zE3ASol7C2GtOEcMx9BmnhIQ" />
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
              <div className="min-w-[300px] sm:min-w-[320px] max-w-[340px] bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 flex flex-col justify-between transition-colors hover:border-[#2F5233] group shrink-0">
                <div>
                  <div className="w-full h-40 rounded-lg bg-[#F3F6EE] border border-[#DCE3D5] flex flex-col items-center justify-center text-[#6B6F63] relative overflow-hidden mb-3">
                    <img alt="Huong Sen Vegan Eatery" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1UKxDr_fYW-lfmvKbsctSexb5ypgcm8acz975hZ_5IAvFtkPoMyxbhO1NQDP8qyj6f2pCieqYLod1yiNIzj0z9Ml40AoBqCq9cg11kzw3gdAwlNRt8hoLbWot_HjlWsW1o8IKl8uZORmS7Wgwe8lBYule_cQ3TyYWAe0X1S4UgT7Y1-aPp204HGNFZaL86ohTH8vPFM36XvVeMGDAAMwJxKKg-UugEWK1zUFXKYTQ371mQKEZRQwzCNquU" />
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
              <div className="min-w-[300px] sm:min-w-[320px] max-w-[340px] bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 flex flex-col justify-between transition-colors hover:border-[#2F5233] group shrink-0">
                <div>
                  <div className="w-full h-40 rounded-lg bg-[#F3F6EE] border border-[#DCE3D5] flex flex-col items-center justify-center text-[#6B6F63] relative overflow-hidden mb-3">
                    <img alt="Thien Tam Vegan Kitchen" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1Vdi2BNAEwGnBxOHL-U7ICKCWSmAKNe2KSa92ulGmqZLJqQ86HaJbPe2q9tE_ou8zWndq9E_c_oZjM77T_KrJu6S0qWfEL07LTOS2RdJYPrB-9gbnGJafTeCmyVsylfuEWnJhMy0DlK3bW0wDsEGQGFumds7-ZmRe3RJofihkpgSfyd1-5mGuADFK4ybTn903PefY08x03sq8skOI9qMcpRz7oklzkKseAsWNHcXwqtJ37NhwFv7gkuzZA" />
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
          <section id="recipes-results-section">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-fraunces text-2xl font-medium text-[#2B2A25]" id="results-title">
                Matching Articles & Videos (6 results)
              </h2>
              <div className="flex items-center gap-2 text-[13px] text-[#6B6F63]">
                <span className="text-[#2B2A25] font-semibold underline underline-offset-4">
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
            <div className="flex flex-col gap-4" id="feed-cards-container">
              <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer group" to="/posts/1">
                <div className="relative overflow-hidden w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 flex flex-col items-center justify-center p-3 text-center transition-transform group-hover:scale-[1.01]">
                  <img alt="Braised Straw Mushrooms" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1WB5ue4YCiF80yX2LzmxjB651NSmec6AmpbmpsEy1yW2-RMH9r6Fa4PggMuAx5Grp-uwgUJ6OPHepQksJuRi6w6mXPryD_ffHB6dt4S8aLkuIaMrpE2GkbpHQ579qI0feP47eU3GW1We4Znk4_VP1cUcagdQ2fOCkgqdbLJORKO5mrR3oCKdmvYTWCmapm2oMAjUBSCNUXJgEwMVMlvDpkLFAW9v4-XBXy5P9u6krFA6hwJi5RXRipZfjI" />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-white text-[12px] font-medium z-10 font-vietnam" style={{ background: 'rgba(43, 42, 37, 0.6)' }}>
                    1/4
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-[3px] h-3.5 bg-[#6B6F63] rounded-full"></span>
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
              <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer group" to="/posts/1">
                <div className="relative overflow-hidden w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 flex flex-col items-center justify-center p-3 text-center transition-transform group-hover:scale-[1.01]">
                  <img alt="Savory Glazed King Oyster Mushrooms" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1WKQI6FUHWfVtKTrj04MIGfapn2kKdbvISdihxFG-f7w0ySFktcAXUJeEK-um1Yo5mY9fgSSIEGLX1EfoSMS9NIkBhDMHqAamg0DpCajzR5k5F-lDIuyHmiPeupCwIPvAmL3nRnyg7YAOw8PaR-BTt8oakaY6bVCq-jAnbta0HL0nOf1EWsSbtxT2P-QBKdbWNNFv0igMkQnaed7Oigqp4cdbCOPC1OhWSkt9tVerGToLBZxByrBuEVHKk" />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-white text-[12px] font-medium z-10 font-vietnam" style={{ background: 'rgba(43, 42, 37, 0.6)' }}>
                    1/3
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#2F5233] text-white flex items-center justify-center group-hover:bg-[#25401F] transition-colors shadow-sm">
                      <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-[#2B2A25] text-white text-[11px] font-medium">
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
              <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer group" to="/posts/1">
                <div className="relative overflow-hidden w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 flex flex-col items-center justify-center p-3 text-center transition-transform group-hover:scale-[1.01]">
                  <img alt="Silken Tofu Braised with Dried Shiitake Mushrooms" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1VcZsiyaVI88SiJ5oF01zka1aPwHscql5pOU0eV1GBLXbcJxrX4A3RTqNAXUIAu62_1EGvr-A2Spq0xAuF-aXpqwtuluK43WCwyFLqvJH8Nd1KmO8NM2W_TzYODDB779KmKfdPmtFsxWV__eOJzy6hRDbx-Zu9rRNITFgMiPxhVSTrqYZgHtzbtD3nnXZRynX2p_iPhFvzuCk8ZG7NTu9LmpJ-5wqV_0K07WcfdTtuOrs3H10U3ioP7FEQ" />
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
              <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer group" to="/posts/1">
                <div className="relative overflow-hidden w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 flex flex-col items-center justify-center p-3 text-center transition-transform group-hover:scale-[1.01]">
                  <img alt="Claypot Braised Oyster Mushrooms" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1WqIsz4GnoHBjWcsOHd9DJdnW7nbpBXvwgi_0YK6Ef78LClR--vFqo_W8tAu2JeZZeyPI6aq-uiqy7jxrcLO3qQfwfCqsB-CGKzjynTFFBgRNMuukYROErofB871vLBJou-rW42Xc5ayw6MmEMD7ALmpkch0xUDvgZEiI2x5m051G2T8JH8n8Q95NIHptQurB2bReYOfWUYVNmeAxJU4mogmDoeiWEo6paW4NL9mKLLtZSuz-yjhGhssTI" />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-white text-[12px] font-medium z-10 font-vietnam" style={{ background: 'rgba(43, 42, 37, 0.6)' }}>
                    1/3
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#2F5233] text-white flex items-center justify-center group-hover:bg-[#25401F] transition-colors shadow-sm">
                      <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-[#2B2A25] text-white text-[11px] font-medium">
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
              <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer group" to="/posts/1">
                <div className="relative overflow-hidden w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 flex flex-col items-center justify-center p-3 text-center transition-transform group-hover:scale-[1.01]">
                  <img alt="Black Termite Mushrooms Braised" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1Ude7R11IRRpW2c9kLST45kXxemd6HOkh2-3ywiA-NEd9BFFlae2UOlQHWXuk8S78GKCMsukyOUOynA_N7Gc8U60OoApLxfzXOb9RBn6H42RsA04OziYAc7bo40OIuNe7Emdbspcw0hZJQRJbAPUgroKPHCVnlWmVNeqHAdF1WUaI2X1SuwQx4vr4ktGCK0_PO0JMuaPKkRxeDk4r9CkBCLZgNvgxaa5yWnXS9OHik61nlauWRd5Zn2Bhc" />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-white text-[12px] font-medium z-10 font-vietnam" style={{ background: 'rgba(43, 42, 37, 0.6)' }}>
                    1/4
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-[3px] h-3.5 bg-[#6B6F63] rounded-full"></span>
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
              <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer group" to="/posts/1">
                <div className="relative overflow-hidden w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 flex flex-col items-center justify-center p-3 text-center transition-transform group-hover:scale-[1.01]">
                  <img alt="Young Jackfruit Braised with Tender Straw Mushrooms" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1Vg-qfSmhz0wmNociW2JI-LpplsY_hhYhjzPDUa-ukgYaSY52N3BKo2MaYe5Q4eiXsvUtBgprUIS_qd_Yt6PkMxanDVcSqftvoaKxm4J_AiHULIy89qh0mQc2mlUDGKjn_sisydSWD7jl01hgjMPjGrgTvYMMvnj2wux5YOFLyp6evgziGIVIeqhjDrtJoFWj-Gedr4AegXZN2Tyfam2mz-soiq3U1Z3Ox0L1j0VJvoJetEEoiY5SqQQCI" />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-white text-[12px] font-medium z-10 font-vietnam" style={{ background: 'rgba(43, 42, 37, 0.6)' }}>
                    1/3
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-[3px] h-3.5 bg-[#6B6F63] rounded-full"></span>
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
                Unfortunately, Botanical Hearth could not find articles, videos, or stores matching
                <span className="font-semibold text-[#2B2A25]" id="empty-keyword"></span>
                . Try searching for a different keyword!
              </p>
              <div className="flex flex-col items-center gap-2.5">
                <span className="text-[12px] font-medium text-[#6B6F63]">
                  Popular suggestions:
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
        <div className="hidden" id="user-search-view">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center text-[#2F5233]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h2 className="font-fraunces text-2xl font-medium text-[#2B2A25]">
                Community Chefs & Members
              </h2>
              <span className="text-[12px] text-[#6B6F63] bg-[#FDFBF6] border border-[#DCE3D5] px-2 py-0.5 rounded-full inline-block">
                4 results
              </span>
            </div>
            <div className="text-[13px] text-[#6B6F63]">
              Connect with creators sharing plant-based recipes
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-5 shadow-none flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center text-[#2F5233] font-semibold text-base font-fraunces shrink-0">
                  CD
                </div>
                <div>
                  <h3 className="font-fraunces text-[16px] font-semibold text-[#2B2A25] leading-tight">
                    Chef Duy
                  </h3>
                  <p className="font-vietnam text-xs text-[#6B6F63] mt-0.5">
                    Holistic vegan culinarian • 42 recipes
                  </p>
                  <span className="text-[11px] text-[#2F5233] font-medium mt-1 inline-block">
                    0 followers
                  </span>
                </div>
              </div>
              <button className="bg-[#2F5233] hover:bg-[#25401F] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150 cursor-pointer shrink-0" type="button">
                Follow
              </button>
            </div>
            <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-5 shadow-none flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center text-[#2F5233] font-semibold text-base font-fraunces shrink-0">
                  ML
                </div>
                <div>
                  <h3 className="font-fraunces text-[16px] font-semibold text-[#2B2A25] leading-tight">
                    Mai Linh
                  </h3>
                  <p className="font-vietnam text-xs text-[#6B6F63] mt-0.5">
                    Mushroom & broth specialist • 28 recipes
                  </p>
                  <span className="text-[11px] text-[#2F5233] font-medium mt-1 inline-block">
                    0 followers
                  </span>
                </div>
              </div>
              <button className="bg-[#2F5233] hover:bg-[#25401F] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150 cursor-pointer shrink-0" type="button">
                Follow
              </button>
            </div>
            <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-5 shadow-none flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center text-[#2F5233] font-semibold text-base font-fraunces shrink-0">
                  TN
                </div>
                <div>
                  <h3 className="font-fraunces text-[16px] font-semibold text-[#2B2A25] leading-tight">
                    Thao Nguyen
                  </h3>
                  <p className="font-vietnam text-xs text-[#6B6F63] mt-0.5">
                    Family nutrition coach • 19 recipes
                  </p>
                  <span className="text-[11px] text-[#2F5233] font-medium mt-1 inline-block">
                    0 followers
                  </span>
                </div>
              </div>
              <button className="bg-[#2F5233] hover:bg-[#25401F] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150 cursor-pointer shrink-0" type="button">
                Follow
              </button>
            </div>
            <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-5 shadow-none flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center text-[#2F5233] font-semibold text-base font-fraunces shrink-0">
                  LH
                </div>
                <div>
                  <h3 className="font-fraunces text-[16px] font-semibold text-[#2B2A25] leading-tight">
                    Lan Huong
                  </h3>
                  <p className="font-vietnam text-xs text-[#6B6F63] mt-0.5">
                    Wild mushroom forager • 35 recipes
                  </p>
                  <span className="text-[11px] text-[#2F5233] font-medium mt-1 inline-block">
                    0 followers
                  </span>
                </div>
              </div>
              <button className="bg-[#2F5233] hover:bg-[#25401F] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150 cursor-pointer shrink-0" type="button">
                Follow
              </button>
            </div>
          </div>
        </div>
      </main>
      {/* CHATBOT FAB & POPUP (Fixed bottom-right) */}
      <aside className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* FAB BUTTON (w-14 h-14 / 56px, bg-[#2F5233], white 4-point AI sparkle star) */}
        <button className="w-14 h-14 rounded-full bg-[#2F5233] hover:bg-[#25401F] text-white flex items-center justify-center modal-shadow transition-transform hover:scale-105 cursor-pointer" id="chat-fab" title="Botanical Hearth AI Assistant">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 00-1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
          </svg>
        </button>
        {/* POPUP PANEL CHAT */}
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
              <button className="w-8 h-8 rounded-lg hover:bg-[#E9EFE6] flex items-center justify-center text-[#2B2A25] transition-colors cursor-pointer" id="chat-minimize" title="Minimize">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="5" x2="19" y1="12" y2="12"></line>
                </svg>
              </button>
              <button className="w-8 h-8 rounded-lg hover:bg-[#E9EFE6] flex items-center justify-center text-[#2B2A25] transition-colors cursor-pointer" id="chat-close" title="Close">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" x2="6" y1="6" y2="18"></line>
                  <line x1="6" x2="18" y1="6" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          {/* Conversation Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-[13px] leading-relaxed bg-[#F3F6EE]/40">
            {/* AI greeting */}
            <div className="flex gap-2.5 max-w-[88%]">
              <div className="w-7 h-7 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center text-[#2F5233] shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                </svg>
              </div>
              <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl rounded-tl-none p-3 text-[#2B2A25]">
                Hello! I'm your Botanical Hearth AI Assistant. I can help you discover wholesome plant-based recipes, balance macro-nutrients, or plan today's family menu.
              </div>
            </div>
            {/* User message */}
            <div className="flex justify-end">
              <div className="max-w-[85%] bg-[#2F5233] text-white rounded-xl rounded-tr-none p-3 text-[13px]">
                Could you suggest a high-protein, light vegan lunch for today?
              </div>
            </div>
            {/* AI response */}
            <div className="flex gap-2.5 max-w-[88%]">
              <div className="w-7 h-7 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center text-[#2F5233] shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                </svg>
              </div>
              <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl rounded-tl-none p-3 text-[#2B2A25]">
                For lunch today, consider pairing
                <strong>
                  Lotus Seed & Wakame Clear Broth
                </strong>
                with
                <strong>
                  Silken Tofu Braised with Shiitake Mushrooms
                </strong>
                . This combo provides complete plant protein, clean energy, and is very gentle on digestion!
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
          {/* Input Footer */}
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
      {/* FOOTER */}
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
      {/* Scripts for Dropdown and Carousel Interactivity */}
      {/* TODO: script goc da bi loai bo, can port lai logic bang useState/useEffect */}
      {/* TODO: script goc da bi loai bo, can port lai logic bang useState/useEffect */}
    </>
  );
}

export default SearchResults;
