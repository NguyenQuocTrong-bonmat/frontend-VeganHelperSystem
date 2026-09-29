import { Link } from 'react-router-dom'

function HomeGuest() {
  return (
    <>
      {/* HEADER-GUEST (Chuẩn 64px, surface-paper, viền border-sage-mist, không bóng) */}
      <header className="sticky top-0 z-40 h-16 bg-[#FDFBF6] border-b border-[#DCE3D5] flex items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-2.5">
          <Link className="flex items-center gap-2.5 text-[#2F5233] hover:opacity-95 transition-opacity shrink-0" to="/">
            <svg className="w-6 h-6 text-[#2F5233]" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
            </svg>
            <span className="font-fraunces text-2xl font-semibold tracking-tight text-[#2F5233]">
              Botanical Hearth
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8 h-16">
          <Link className="relative flex items-center h-full text-[15px] font-semibold text-[#2F5233] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2F5233]" to="/">
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
        <div className="flex items-center gap-3 shrink-0">
          <Link className="h-10 px-4 flex items-center justify-center rounded-lg border-[1.5px] border-[#2F5233] text-[#2F5233] text-[14px] font-medium hover:bg-[#F3F6EE] transition-colors" to="/login">
            Log In
          </Link>
          <Link className="h-10 px-4 flex items-center justify-center rounded-lg bg-[#2F5233] text-white text-[14px] font-medium hover:bg-[#25401F] transition-colors" to="/sign-up">
            Sign Up
          </Link>
        </div>
      </header>
      {/* MAIN CONTENT CONTAINER (max-w 1120px, gutter 24px per DESIGN.md section 4) */}
      <main className="flex-1 w-full max-w-[1120px] mx-auto px-6 py-8 md:py-10">
        {/* SEARCH BAR SECTION */}
        <section className="mb-8">
          <div className="flex items-center gap-3 w-full">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-[#6B6F63]" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
                </svg>
              </div>
              <input className="w-full h-12 pl-12 pr-4 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[15px] text-[#2B2A25] placeholder-[#6B6F63] focus:border-[#2F5233] focus:outline-none transition-colors" placeholder="Search recipes, video guides, vegan ingredients..." type="text" />
            </div>
            <button type="submit" className="h-12 px-6 bg-[#2F5233] hover:bg-[#25401F] text-white text-[15px] font-medium rounded-lg flex items-center gap-2 transition-colors shrink-0">
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
        {/* CATEGORY BAR (Thanh màu dọc 3px + tên category viết thường theo mục 6 DESIGN.md) */}
        <section className="mb-10">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {/* Tab All (Active) */}
            <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#2F5233] rounded-lg text-[14px] font-medium text-[#2F5233] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
              <span className="w-[3px] h-4 bg-[#2F5233] rounded-full"></span>
              <span className="">
                All
              </span>
            </button>
            {/* Category: Main Dishes */}
            <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#2F5233] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
              <span className="w-[3px] h-4 bg-[#2F5233] rounded-full"></span>
              <span className="">
                Main Dishes
              </span>
            </button>
            {/* Category: Soups */}
            <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#D9A441] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
              <span className="w-[3px] h-4 bg-[#D9A441] rounded-full"></span>
              <span className="">
                Soups
              </span>
            </button>
            {/* Category: Salads */}
            <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#A63446] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
              <span className="w-[3px] h-4 bg-[#A63446] rounded-full"></span>
              <span className="">
                Salads
              </span>
            </button>
            {/* Category: Braised Dishes */}
            <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#6B6F63] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
              <span className="w-[3px] h-4 bg-[#6B6F63] rounded-full"></span>
              <span className="">
                Braised Dishes
              </span>
            </button>
            {/* Category: Desserts */}
            <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#D9A441] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
              <span className="w-[3px] h-4 bg-[#D9A441] rounded-full"></span>
              <span className="">
                Desserts
              </span>
            </button>
            {/* Category: Cooking Videos */}
            <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#A63446] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
              <span className="w-[3px] h-4 bg-[#A63446] rounded-full"></span>
              <span className="">
                Cooking Videos
              </span>
            </button>
          </div>
        </section>
        {/* SECTION: BÀI VIẾT NỔI BẬT (Card lớn với ảnh hero bo góc bất đối xứng top-left 32px per DESIGN.md section 5) */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-fraunces text-2xl font-medium text-[#2B2A25]">
              Featured Post
            </h2>
            <span className="text-[13px] font-medium text-[#6B6F63]">
              Weekly recommendation
            </span>
          </div>
          <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center hover:border-[#2F5233] transition-colors cursor-pointer" to="/posts/1/guest">
            <div className="relative lg:col-span-6 w-full h-64 md:h-80 bg-[#E9EFE6] border border-[#DCE3D5] hero-radius overflow-hidden">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVut92jYK_Q_EsK1v2nfyFEboWQOjGuXIHJZUgz_UqCBgpd29xjvX6R3RrV1he-fmbybPme2KACc5Uo5rn1aGykfINbsFiq4njonV2t-_TEA71jBEXVcNff7z3TPezgjUwl7OmBhvxB3ZN5xf6waeNMioISgdQ9SqfUdwlhPygFlkrdOltlTvcSytwa8yC1nSRDITTLlEw-KtZbJR0G6LKj7NX9Wwomyfd6XCKeOVApxdQZ0gVo65B" alt="Golden Turmeric Braised Tofu & Mushrooms" className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-[#2B2A25]/60 text-white text-[12px] font-medium">
                1/4
              </div>
            </div>
            <div className="lg:col-span-6 flex flex-col justify-between h-full py-1 text-left">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-[3px] h-4 bg-[#2F5233] rounded-full"></span>
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
                <h3 className="font-fraunces text-2xl md:text-3xl font-semibold text-[#2B2A25] mb-3 leading-snug hover:text-[#2F5233] transition-colors">
                  Golden Turmeric Braised Tofu & Wild Forest Mushrooms
                </h3>
                <p className="text-[15px] leading-relaxed text-[#6B6F63] mb-6">
                  Pan-seared firm tofu gently simmered in fresh young coconut water, cracked black pepper, fresh turmeric root, and fragrant wood ear mushrooms.
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
        {/* SECTION: DANH SÁCH BÀI VIẾT / VIDEO DẠNG HÀNG NGANG (Feed / List Item per DESIGN.md section 6) */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-fraunces text-2xl font-medium text-[#2B2A25]">
              Newest Recipes & Videos
            </h2>
            <div className="flex items-center gap-2 text-[13px] text-[#6B6F63]">
              <span className="text-[#2F5233] font-semibold underline underline-offset-4">
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
          {/* Danh sách thẻ hàng ngang: ảnh thumbnail bên trái (bo góc 8px) + nội dung bên phải, viền border-sage-mist, không shadow */}
          <div className="flex flex-col gap-4">
            <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer" to="/posts/1/guest">
              <div className="relative w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT-KvT-D1TMUWu9DDm0e46qnf-2i9G84lzwDe3hVX34gW4xiLhkwq7dyQNr95cgiJW1mxaB6ehtiBpsCBtA52uPi51fgkitcMbZrBggtBivVpA8lWuy1OyRnf-UaYc38tbWDbJ_0nRz6aMmYjRmqo6cWZ6Bd5pweejuZCDwKmtY21QpXqKaebWfzBWbCQu22jVeDEvwhVZZNnOpuWtvYrNq_EeLCtaNKhgXuJUiPNz7zeWK-ZL_npb" alt="Crispy Lemongrass Tofu" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-[#2B2A25]/60 text-white text-[12px] font-medium">
                  1/5
                </div>
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
                      45 minutes ago
                    </span>
                  </div>
                  <h3 className="font-vietnam text-[18px] md:text-[20px] font-semibold text-[#2B2A25] mb-2 leading-snug group-hover:text-[#2F5233]">
                    Crispy Pan-Fried Lemongrass & Chili Tofu
                  </h3>
                  <p className="text-[14px] md:text-[15px] leading-relaxed text-[#6B6F63] line-clamp-2 mb-3">
                    Crisp golden tofu cubes tossed with fragrant finely minced lemongrass, crushed bird's eye chili, and warm toasted sesame.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#DCE3D5] flex flex-wrap items-center justify-between text-[13px] text-[#6B6F63] gap-2">
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
            <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer" to="/posts/1/guest">
              <div className="relative w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 overflow-hidden flex items-center justify-center">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAj0FAZtefayzQyl94VRQpVPFoKPOF5wfmUfHNISGWki6nSIxCuahPwMyyOcAX19O6jC4f2nY_ydIqDckfZsRSJEGCA4YfSe2WOO5BABgOHPiWtsW5Y0RTCWYdaCNo2sTilH-9xxzN09VtXXThvHT1FrzP6Qe7zbj_l4Asc3jNihjut--XAzcHBbJB-fVTxGJZTbaYJa9Z0fLDF86YfWcfBG3j_c7UhWWLIBwyIpCw9LlKipC1WZ3LU" alt="Clear Lotus Root Broth" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-[#2B2A25]/60 text-white text-[12px] font-medium z-10">
                  1/3
                </div>
                <div className="relative z-10 w-10 h-10 rounded-full bg-[#2F5233]/90 hover:bg-[#25401F] text-white flex items-center justify-center shadow-sm transition-transform hover:scale-105">
                  <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-[#2B2A25]/80 text-white text-[11px] font-medium z-10">
                  00:00
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
                      3 hours ago
                    </span>
                  </div>
                  <h3 className="font-vietnam text-[18px] md:text-[20px] font-semibold text-[#2B2A25] mb-2 leading-snug group-hover:text-[#2F5233]">
                    Video: Clear Lotus Root & Sweet Corn Herbal Broth
                  </h3>
                  <p className="text-[14px] md:text-[15px] leading-relaxed text-[#6B6F63] line-clamp-2 mb-3">
                    Step-by-step video guide to simmering seasonal lotus root, crunchy water chestnuts, and sweet field corn for a soul-cleansing wholesome soup.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#DCE3D5] flex flex-wrap items-center justify-between text-[13px] text-[#6B6F63] gap-2">
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
                        512
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
            <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer" to="/posts/1/guest">
              <div className="w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAj0FAZtefayzQyl94VRQpVPFoKPOF5wfmUfHNISGWki6nSIxCuahPwMyyOcAX19O6jC4f2nY_ydIqDckfZsRSJEGCA4YfSe2WOO5BABgOHPiWtsW5Y0RTCWYdaCNo2sTilH-9xxzN09VtXXThvHT1FrzP6Qe7zbj_l4Asc3jNihjut--XAzcHBbJB-fVTxGJZTbaYJa9Z0fLDF86YfWcfBG3j_c7UhWWLIBwyIpCw9LlKipC1WZ3LU" alt="Nourishing Soup" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-[3px] h-3.5 bg-[#D9A441] rounded-full"></span>
                    <span className="text-[13px] font-medium text-[#6B6F63]">
                      Soups
                    </span>
                    <span className="text-xs text-[#6B6F63]">
                      •
                    </span>
                    <span className="text-[13px] text-[#6B6F63]">
                      5 hours ago
                    </span>
                  </div>
                  <h3 className="font-vietnam text-[18px] md:text-[20px] font-semibold text-[#2B2A25] mb-2 leading-snug group-hover:text-[#2F5233]">
                    Silken Snow Mushroom & Red Date Nourishing Soup
                  </h3>
                  <p className="text-[14px] md:text-[15px] leading-relaxed text-[#6B6F63] line-clamp-2 mb-3">
                    Velvety broth stewed with delicate white snow fungus, organic lotus seeds, and dried jujubes for evening wellness.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#DCE3D5] flex flex-wrap items-center justify-between text-[13px] text-[#6B6F63] gap-2">
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
                        240
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
            <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer" to="/posts/1/guest">
              <div className="relative w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfFEK1vchJfUzB7yOh7XztTcy0ko3zaqQppyHzm0D5GRz9mMMnvT0bAkwK8qZ8o05Gwbgc7f2mK2kbbT26Qb_iKTzyAOGjupgzTxee6kGxrkktgUzvWlvbaUCs6Uv4FVAmJlXv1fT4H4HyKZXW9p9EDswJe-eBp6E1MAfg0egBs_Hmqutgmyv_7whBF8m0tGEyvBXd-4ClrfLM2XgxhxYFASezINBWOLpPxxtLRWASxyDDtkjvZ5DF" alt="Banana Blossom Salad" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-[#2B2A25]/60 text-white text-[12px] font-medium">
                  1/4
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-[3px] h-3.5 bg-[#A63446] rounded-full"></span>
                    <span className="text-[13px] font-medium text-[#6B6F63]">
                      Salads
                    </span>
                    <span className="text-xs text-[#6B6F63]">
                      •
                    </span>
                    <span className="text-[13px] text-[#6B6F63]">
                      Yesterday
                    </span>
                  </div>
                  <h3 className="font-vietnam text-[18px] md:text-[20px] font-semibold text-[#2B2A25] mb-2 leading-snug group-hover:text-[#2F5233]">
                    Zesty Banana Blossom Salad with Calamansi Dressing
                  </h3>
                  <p className="text-[14px] md:text-[15px] leading-relaxed text-[#6B6F63] line-clamp-2 mb-3">
                    Crisp shredded banana blossoms tossed with fragrant Vietnamese mint, toasted peanuts, and a bright sweet-sour calamansi dressing.
                  </p>
                </div>
                <div className="pt-3 border-t border-[#DCE3D5] flex flex-wrap items-center justify-between text-[13px] text-[#6B6F63] gap-2">
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
                        198
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
          {/* Phân trang / Nút xem thêm mộc mạc */}
          <div className="mt-8 flex justify-center">
            <button className="h-11 px-6 rounded-lg border-[1.5px] border-[#2F5233] bg-transparent text-[#2F5233] text-[14px] font-medium hover:bg-[#E9EFE6] transition-colors">
              View More Recipes & Posts
            </button>
          </div>
        </section>
      </main>
      {/* CHATBOT FAB & POPUP PANEL (Fixed bottom-6 right-6, tích hợp nổi trực tiếp) */}
      <aside className="fixed bottom-6 right-6 z-50">
        {/* POPUP PANEL CHAT AI (Mặc định hiển thị, w: 380px, h: 520px, bo góc 16px, background surface-paper #FDFBF6, viền border-sage-mist) */}
        <div className="flex-col w-[calc(100vw-3rem)] sm:w-[380px] h-[520px] max-h-[85vh] bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl modal-shadow overflow-hidden transition-all hidden" id="ai-chat-widget">
          {/* Header: Icon AI + Tiêu đề + Nút thu nhỏ (-) và đóng (x) */}
          <div className="px-4 py-3 bg-[#FDFBF6] border-b border-[#DCE3D5] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F3F6EE] border border-[#DCE3D5] text-[#2F5233] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-[#2F5233]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-vietnam text-[15px] font-semibold text-[#2B2A25] leading-snug">
                  AI Nutrition Assistant
                </h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#4C8C4A]"></span>
                  <span className="text-[11px] text-[#6B6F63]">
                    Ready to assist
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-lg text-[#6B6F63] hover:text-[#2B2A25] hover:bg-[#F3F6EE] flex items-center justify-center transition-colors text-base leading-none font-medium" title="Thu nhỏ">
                —
              </button>
              <button className="w-7 h-7 rounded-lg text-[#6B6F63] hover:text-[#2B2A25] hover:bg-[#F3F6EE] flex items-center justify-center transition-colors text-lg leading-none font-normal" title="Đóng">
                ×
              </button>
            </div>
          </div>
          {/* Thân chat: Tin nhắn chào từ AI, tin nhắn mẫu người dùng căn phải, chip gợi ý câu hỏi nhanh */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#F3F6EE]/40 flex flex-col gap-3.5 text-[13px]">
            <div className="flex items-start gap-2.5 max-w-[88%]">
              <div className="w-7 h-7 rounded-full bg-[#F3F6EE] border border-[#DCE3D5] text-[#2F5233] flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-[#2F5233]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
              </div>
              <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-3 text-[#2B2A25] leading-relaxed">
                <p className="text-[#2B2A25]">
                  Hello! I am the Botanical Hearth AI Nutrition Assistant. I can help you discover wholesome plant-based recipes, balance macro nutrients, or curate today's menu.
                </p>
                <span className="block mt-1 text-[11px] text-[#6B6F63]">
                  10:30 • AI Assistant
                </span>
              </div>
            </div>
            <div className="flex items-start justify-end gap-2 max-w-[85%] self-end">
              <div className="bg-[#2F5233] text-white rounded-xl p-3 leading-relaxed shadow-sm">
                <p className="">
                  Can you suggest a light, protein-rich plant-based lunch?
                </p>
                <span className="block mt-1 text-[10px] text-white/70 text-right">
                  10:31 • Read
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2.5 max-w-[88%]">
              <div className="w-7 h-7 rounded-full bg-[#F3F6EE] border border-[#DCE3D5] text-[#2F5233] flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-[#2F5233]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
              </div>
              <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-3 text-[#2B2A25] leading-relaxed">
                <p className="">
                  For lunch today, try:
                  <strong className="text-[#2F5233]">
                    Seaweed Lotus Seed Soup
                  </strong>
                  paired with
                  <strong className="text-[#2F5233]">
                    Silken Tofu in Shiitake Mushroom Glaze
                  </strong>
                  . This combination offers high plant protein, cleansing minerals, and is gentle on digestion!
                </p>
              </div>
            </div>
            <div className="pt-1">
              <span className="block text-[11px] text-[#6B6F63] mb-1.5 font-medium">
                Quick suggestions:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button className="px-2.5 py-1 bg-[#FDFBF6] border border-[#DCE3D5] hover:border-[#2F5233] hover:text-[#2F5233] text-[#2B2A25] rounded-full text-[11px] font-medium transition-colors">
                  🌱 High protein dishes
                </button>
                <button className="px-2.5 py-1 bg-[#FDFBF6] border border-[#DCE3D5] hover:border-[#2F5233] hover:text-[#2F5233] text-[#2B2A25] rounded-full text-[11px] font-medium transition-colors">
                  🥣 Weight management
                </button>
                <button className="px-2.5 py-1 bg-[#FDFBF6] border border-[#DCE3D5] hover:border-[#2F5233] hover:text-[#2F5233] text-[#2B2A25] rounded-full text-[11px] font-medium transition-colors">
                  🥦 Ingredient substitutions
                </button>
              </div>
            </div>
          </div>
          {/* Đáy panel: Ô nhập tin nhắn và nút gửi tròn */}
          <div className="p-3 bg-[#FDFBF6] border-t border-[#DCE3D5] shrink-0">
            <div className="flex items-center gap-2 bg-[#F3F6EE] border border-[#DCE3D5] rounded-xl px-3 py-1.5 focus-within:border-[#2F5233] transition-colors">
              <input className="flex-1 bg-transparent text-[13px] text-[#2B2A25] placeholder-[#6B6F63] focus:outline-none" id="chat-input-text" placeholder="Ask the AI assistant about vegan nutrition..." type="text" />
              <button className="w-8 h-8 rounded-full bg-[#2F5233] hover:bg-[#25401F] text-white flex items-center justify-center shrink-0 transition-colors shadow-sm" title="Gửi tin nhắn">
                <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                  <line x1="22" x2="11" y1="2" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
            <div className="mt-1.5 text-center">
              <span className="text-[10px] text-[#6B6F63]">
                AI Assistant provides educational plant-based nutrition recommendations
              </span>
            </div>
          </div>
        </div>
        {/* NÚT TRÒN FAB AI CHATBOT (fixed bottom-6 right-6, màu primary-moss #2F5233, icon trợ lý AI) */}
        <button className="w-14 h-14 rounded-full bg-[#2F5233] hover:bg-[#25401F] text-white flex items-center justify-center modal-shadow transition-transform hover:scale-105" id="fab-chatbot" title="Botanical Hearth AI Assistant">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"></path>
          </svg>
        </button>
      </aside>
      {/* Script xử lý bật/tắt Popup Chat và gợi ý câu hỏi */}
      {/* TODO: script goc da bi loai bo, can port lai logic bang useState/useEffect */}
      {/* FOOTER TINH GỌN (surface-paper, viền trên border-sage-mist) */}
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
            <a href="#" className="hover:text-[#2F5233] transition-colors">
              About Us
            </a>
            <a href="#" className="hover:text-[#2F5233] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-[#2F5233] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#2F5233] transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default HomeGuest;
