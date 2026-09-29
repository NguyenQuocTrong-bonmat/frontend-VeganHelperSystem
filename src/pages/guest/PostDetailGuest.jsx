import { Link } from 'react-router-dom'

function PostDetailGuest() {
  return (
    <>
      {/* TOP HEADER (Header-Guest: height 64px, surface-paper, 1px border-sage-mist) */}
      <header className="w-full sticky top-0 z-40 bg-[#FDFBF6] border-b border-[#DCE3D5] flex items-center justify-between px-6 lg:px-8 py-4 relative">
        {/* Logo Botanical Hearth */}
        <div className="flex items-center shrink-0">
          <Link className="flex items-center gap-2 group text-decoration-none" to="/">
            <svg className="w-6 h-6 text-primary-moss transition-transform group-hover:scale-105" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
              <path d="M2 21c0-3 1.85-5.36 5.08-6"></path>
            </svg>
            <span className="font-fraunces font-semibold text-2xl text-primary-moss tracking-tight">
              Botanical Hearth
            </span>
          </Link>
        </div>
        {/* Middle Nav: ONLY "Home" link active for Guest */}
        <nav className="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center justify-center gap-8 h-full font-sans text-[15px]">
          <Link className="relative h-full flex items-center text-text-charcoal font-semibold border-b-2 border-primary-moss transition-colors" to="/">
            <span className="">
              Home
            </span>
          </Link>
          <Link className="relative h-full flex items-center text-text-stem-gray font-medium hover:text-primary-moss transition-colors cursor-pointer" to="/weekly-menu/locked">
            <span className="">
              Weekly Menu
            </span>
          </Link>
          <Link className="relative h-full flex items-center text-text-stem-gray font-medium hover:text-primary-moss transition-colors cursor-pointer" to="/vegan-stores/locked">
            <span className="">
              Find Vegan Stores
            </span>
          </Link>
          <Link className="relative h-full flex items-center text-text-stem-gray font-medium hover:text-primary-moss transition-colors cursor-pointer" to="/my-posts/locked">
            <span className="">
              My Posts
            </span>
          </Link>
        </nav>
        {/* Guest Auth Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <Link className="px-4 py-2 text-sm font-medium text-primary-moss border-[1.5px] border-primary-moss hover:bg-bg-herb-white transition-colors rounded-lg" to="/login">
            Log In
          </Link>
          <Link className="px-4 py-2 text-sm font-medium text-white bg-primary-moss hover:bg-primary-moss-hover transition-colors rounded-lg shadow-sm" to="/sign-up">
            Sign Up
          </Link>
        </div>
      </header>
      {/* MAIN ARTICLE CONTAINER (max-w-[1120px], 12 cols, left-aligned) */}
      <main className="w-full max-w-[1120px] mx-auto px-6 py-8 md:py-12 flex-1">
        {/* Breadcrumb & Back action */}
        <div className="mb-6 flex items-center justify-between">
          <a className="inline-flex items-center gap-2 text-sm font-medium text-text-stem-gray hover:text-primary-moss transition-colors" href="#" title="Back to list">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
            <span className="">
              Back to list
            </span>
          </a>
          {/* Category Tag per DESIGN.md: vertical 3px color bar + lowercase label */}
          <div className="inline-flex items-center gap-2">
            <span className="w-[3px] h-4 bg-primary-moss rounded-full"></span>
            <span className="text-sm font-medium text-text-charcoal">
              Main Dishes
            </span>
          </div>
        </div>
        {/* Article Header Area */}
        <article className="space-y-6">
          {/* Title: Fraunces Display/H1 */}
          <h1 className="font-fraunces font-semibold text-3xl sm:text-4xl text-text-charcoal leading-tight tracking-tight">
            Claypot Braised King Oyster Mushrooms with Fresh Green Pepper
          </h1>
          {/* Meta Information Row: Author, Date, Views, Rating */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-border-sage-mist text-[13px] text-text-stem-gray">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-paper border border-border-sage-mist flex items-center justify-center text-text-stem-gray">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-text-charcoal">
                  Chef Duy
                </span>
                <span className="">
                  •
                </span>
                <span className="">
                  3 hours ago
                </span>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-text-stem-gray" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span className="">
                  Views:
                  <strong className="font-semibold text-text-charcoal">
                    284
                  </strong>
                </span>
              </div>
            </div>
          </div>
          {/* Hero Image & Integrated Media Gallery (Supporting photos and video) */}
          <div className="space-y-3">
            <div className="w-full bg-[#1e2d21] border border-border-sage-mist hero-radius h-72 sm:h-[420px] flex flex-col items-center justify-center text-white relative overflow-hidden group select-none">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVut92jYK_Q_EsK1v2nfyFEboWQOjGuXIHJZUgz_UqCBgpd29xjvX6R3RrV1he-fmbybPme2KACc5Uo5rn1aGykfINbsFiq4njonV2t-_TEA71jBEXVcNff7z3TPezgjUwl7OmBhvxB3ZN5xf6waeNMioISgdQ9SqfUdwlhPygFlkrdOltlTvcSytwa8yC1nSRDITTLlEw-KtZbJR0G6LKj7NX9Wwomyfd6XCKeOVApxdQZ0gVo65B" alt="Appetizing Vietnamese plant-based claypot braised king oyster mushrooms with fresh green peppercorns" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30 pointer-events-none"></div>
              <button aria-label="Play video" className="w-16 h-16 rounded-full bg-primary-moss hover:bg-primary-moss-hover text-white flex items-center justify-center shadow-card-modal transition-transform transform hover:scale-105 z-10" type="button">
                <svg className="w-7 h-7 fill-current translate-x-0.5" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
              <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-medium text-white flex items-center gap-1.5 border border-white/20">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <rect height="18" rx="2" ry="2" width="18" x="3" y="3"></rect>
                  <circle cx="9" cy="9" r="2"></circle>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg>
                <span className="">
                  1 / 4
                </span>
              </div>
              <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-medium text-white border border-white/20 flex items-center gap-1.5">
                <svg className="w-3 h-3 text-accent-turmeric" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon fill="white" points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
                <span className="">
                  12:34
                </span>
              </div>
              <button aria-label="Previous slide" className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-colors" type="button">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="m15 18-6-6 6-6"></path>
                </svg>
              </button>
              <button aria-label="Next slide" className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-colors" type="button">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10 bg-gradient-to-t from-black/80 to-transparent space-y-2">
                <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer">
                  <div className="h-full bg-primary-moss w-1/3 rounded-full relative">
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow"></span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-white/90 font-medium">
                  <span className="">
                    04:12 / 12:34
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded text-white">
                      HD 1080p
                    </span>
                    <span className="text-[11px] text-white/80">
                      Multimedia viewing mode
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-1 overflow-x-auto pb-1">
              <button className="relative shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 border-primary-moss bg-[#25401f] shadow-sm focus:outline-none" title="Media 1: Step-by-step video guide">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVut92jYK_Q_EsK1v2nfyFEboWQOjGuXIHJZUgz_UqCBgpd29xjvX6R3RrV1he-fmbybPme2KACc5Uo5rn1aGykfINbsFiq4njonV2t-_TEA71jBEXVcNff7z3TPezgjUwl7OmBhvxB3ZN5xf6waeNMioISgdQ9SqfUdwlhPygFlkrdOltlTvcSytwa8yC1nSRDITTLlEw-KtZbJR0G6LKj7NX9Wwomyfd6XCKeOVApxdQZ0gVo65B" alt="Media 1" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
                <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] px-1 rounded text-white leading-tight">
                  12:34
                </span>
                <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-primary-moss ring-1 ring-white"></span>
              </button>
              <button className="relative shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-border-sage-mist bg-[#E5EBE0] hover:border-primary-moss transition-colors focus:outline-none opacity-80 hover:opacity-100" title="Media 2: Finished braised mushroom dish">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT-KvT-D1TMUWu9DDm0e46qnf-2i9G84lzwDe3hVX34gW4xiLhkwq7dyQNr95cgiJW1mxaB6ehtiBpsCBtA52uPi51fgkitcMbZrBggtBivVpA8lWuy1OyRnf-UaYc38tbWDbJ_0nRz6aMmYjRmqo6cWZ6Bd5pweejuZCDwKmtY21QpXqKaebWfzBWbCQu22jVeDEvwhVZZNnOpuWtvYrNq_EeLCtaNKhgXuJUiPNz7zeWK-ZL_npb" alt="Media 2: Crispy golden pan-fried tofu" className="w-full h-full object-cover" />
              </button>
              <button className="relative shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-border-sage-mist bg-[#25401f]/70 hover:border-primary-moss transition-colors focus:outline-none opacity-80 hover:opacity-100" title="Media 3: Video clip seasoning plant broth">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAj0FAZtefayzQyl94VRQpVPFoKPOF5wfmUfHNISGWki6nSIxCuahPwMyyOcAX19O6jC4f2nY_ydIqDckfZsRSJEGCA4YfSe2WOO5BABgOHPiWtsW5Y0RTCWYdaCNo2sTilH-9xxzN09VtXXThvHT1FrzP6Qe7zbj_l4Asc3jNihjut--XAzcHBbJB-fVTxGJZTbaYJa9Z0fLDF86YfWcfBG3j_c7UhWWLIBwyIpCw9LlKipC1WZ3LU" alt="Media 3: Video clip seasoning plant broth" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <svg className="w-5 h-5 fill-current text-white/90" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
                <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] px-1 rounded text-white leading-tight">
                  03:45
                </span>
              </button>
              <button className="relative shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-border-sage-mist bg-[#E5EBE0] hover:border-primary-moss transition-colors focus:outline-none opacity-80 hover:opacity-100" title="Media 4: Plating and dining table setup">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfFEK1vchJfUzB7yOh7XztTcy0ko3zaqQppyHzm0D5GRz9mMMnvT0bAkwK8qZ8o05Gwbgc7f2mK2kbbT26Qb_iKTzyAOGjupgzTxee6kGxrkktgUzvWlvbaUCs6Uv4FVAmJlXv1fT4H4HyKZXW9p9EDswJe-eBp6E1MAfg0egBs_Hmqutgmyv_7whBF8m0tGEyvBXd-4ClrfLM2XgxhxYFASezINBWOLpPxxtLRWASxyDDtkjvZ5DF" alt="Media 4: Banana blossom salad" className="w-full h-full object-cover" />
              </button>
              <span className="text-xs text-text-stem-gray pl-1 hidden sm:inline">
                4 items (2 videos, 2 illustration photos)
              </span>
            </div>
          </div>
          {/* Article Content Body (max 72 chars line-length, left-aligned, Be Vietnam Pro) */}
          <div className="max-w-[760px] space-y-6 pt-4 text-text-charcoal leading-relaxed text-[17px]">
            <p className="font-medium text-lg text-text-charcoal/90 leading-relaxed border-l-2 border-primary-moss pl-4 italic">
              A comforting rustic dish from Vietnam's countryside kitchen. Crisp king oyster mushrooms gently caramelized in dark tamari soy sauce, crushed green peppercorns, and fresh young coconut water to achieve a deep savory gloss.
            </p>
            <p className="">
              Wholesome plant-based cooking techniques focus on preserving essential natural micronutrients, harmoniously marrying earth-grown root vegetables with fragrant freshly cracked pepper.
            </p>
            {/* Subheading H2 in Fraunces */}
            <h2 className="font-fraunces font-medium text-2xl text-text-charcoal pt-4">
              Ingredients Preparation
            </h2>
            <div className="bg-surface-paper border border-border-sage-mist rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="w-2 h-2 rounded-full bg-primary-moss"></span>
                <span className="">
                  Fresh king oyster mushrooms or shiitake sliced
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="w-2 h-2 rounded-full bg-primary-moss"></span>
                <span className="">
                  Silken tofu or gently pan-fried golden tofu
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="w-2 h-2 rounded-full bg-primary-moss"></span>
                <span className="">
                  Lotus root, carrots and fresh lotus seeds for sweet broth
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="w-2 h-2 rounded-full bg-primary-moss"></span>
                <span className="">
                  Naturally fermented soy sauce, raw cane sugar, cracked black pepper
                </span>
              </div>
            </div>
            <h2 className="font-fraunces font-medium text-2xl text-text-charcoal pt-4">
              Step-by-step Instructions
            </h2>
            <p className="">
              Follow these detailed cooking steps to craft a gentle, flavorful family meal. Start by prepping your whole vegetables, gently sautéing aromatic natural spices, and letting the broth simmer on low heat until rich, aromatic, and deeply nourishing.
            </p>
            {/* Video Chapters timeline box */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-fraunces font-medium text-xl text-text-charcoal flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-moss" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  <span className="">
                    Video Chapters
                  </span>
                </h3>
                <span className="text-xs text-text-stem-gray">
                  Click to jump to chapter
                </span>
              </div>
              <div className="bg-surface-paper border border-border-sage-mist rounded-xl divide-y divide-border-sage-mist overflow-hidden">
                <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-bg-herb-white transition-colors text-left group focus:outline-none" type="button">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-primary-moss text-white font-semibold text-xs">
                      00:00
                    </span>
                    <span className="text-sm font-medium text-text-charcoal group-hover:text-primary-moss transition-colors">
                      Prepare fresh ingredients & lotus seeds
                    </span>
                  </div>
                  <span className="text-xs text-text-stem-gray font-sans">
                    Part 1
                  </span>
                </button>
                <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-bg-herb-white transition-colors text-left group focus:outline-none" type="button">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-bg-herb-white border border-border-sage-mist text-text-charcoal font-semibold text-xs group-hover:border-primary-moss">
                      02:40
                    </span>
                    <span className="text-sm font-medium text-text-charcoal group-hover:text-primary-moss transition-colors">
                      Sauté shiitake mushrooms & golden tofu
                    </span>
                  </div>
                  <span className="text-xs text-text-stem-gray font-sans">
                    Part 2
                  </span>
                </button>
                <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-bg-herb-white transition-colors text-left group focus:outline-none" type="button">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-bg-herb-white border border-border-sage-mist text-text-charcoal font-semibold text-xs group-hover:border-primary-moss">
                      06:15
                    </span>
                    <span className="text-sm font-medium text-text-charcoal group-hover:text-primary-moss transition-colors">
                      Simmer sweet lotus root broth & season
                    </span>
                  </div>
                  <span className="text-xs text-text-stem-gray font-sans">
                    Part 3
                  </span>
                </button>
                <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-bg-herb-white transition-colors text-left group focus:outline-none" type="button">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-bg-herb-white border border-border-sage-mist text-text-charcoal font-semibold text-xs group-hover:border-primary-moss">
                      10:30
                    </span>
                    <span className="text-sm font-medium text-text-charcoal group-hover:text-primary-moss transition-colors">
                      Plating, temperature tips & serving
                    </span>
                  </div>
                  <span className="text-xs text-text-stem-gray font-sans">
                    Part 4
                  </span>
                </button>
              </div>
            </div>
          </div>
          {/* Action Interaction Bar: Like/Vote with accent-beetroot per specification */}
          <div className="py-6 my-8 border-y border-border-sage-mist flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Like / Heart Button (Guest outline state) */}
              <button id="like-btn" type="button" className="px-4 py-2 bg-surface-paper border border-border-sage-mist text-text-charcoal rounded-lg text-sm font-medium flex items-center gap-2 hover:text-[#2F5233] hover:border-primary-moss transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"></path>
                </svg>
                <span className="">
                  Like
                </span>
                <span className="text-xs text-text-stem-gray font-normal ml-0.5">
                  142
                </span>
              </button>
              {/* Save / Bookmark Button (Guest outline state) */}
              <button id="bookmark-btn" type="button" className="px-4 py-2 bg-surface-paper border border-border-sage-mist text-text-charcoal rounded-lg text-sm font-medium flex items-center gap-2 hover:text-[#2F5233] hover:border-primary-moss transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"></path>
                </svg>
                <span className="">
                  Save recipe
                </span>
              </button>
            </div>
            <div className="flex items-center gap-5 text-sm text-text-stem-gray">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-text-stem-gray" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span className="">
                  Views:
                  <strong className="font-semibold text-text-charcoal">
                    284
                  </strong>
                </span>
              </div>
            </div>
          </div>
          {/* Author Card Info */}
          <div className="bg-surface-paper border border-border-sage-mist rounded-xl p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E5EBE0] border border-border-sage-mist flex items-center justify-center text-text-stem-gray shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-text-charcoal">
                Author: Chef Duy
              </h3>
              <p className="text-sm text-text-stem-gray">
                Plant-based culinary instructor & cookbook author, sharing hearty traditional home recipes.
              </p>
            </div>
          </div>
          {/* COMMENTS SECTION */}
          <section className="pt-8 pb-12 space-y-8" id="binh-luan">
            <div className="flex items-center justify-between border-b border-border-sage-mist pb-4">
              <h2 className="font-fraunces font-medium text-2xl text-text-charcoal flex items-center gap-2">
                <span className="">
                  Comments
                </span>
                <span className="text-base font-sans font-normal text-text-stem-gray">
                  (3)
                </span>
              </h2>
              <span className="text-xs text-text-stem-gray">
                Community guidelines: Warm & respectful
              </span>
            </div>
            {/* Comment Input Box (Guest prompt state) */}
            <div className="bg-surface-paper border border-border-sage-mist rounded-xl p-6 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-bg-herb-white border border-border-sage-mist flex items-center justify-center text-text-stem-gray">
                <svg className="w-6 h-6 text-primary-moss" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-base text-text-charcoal">
                  Join the recipe discussion
                </h3>
                <p className="text-sm text-text-stem-gray max-w-md mx-auto">
                  Please
                  <strong className="text-primary-moss font-semibold">
                    Log In
                  </strong>
                  or
                  <strong className="text-primary-moss font-semibold">
                    Sign Up
                  </strong>
                  to share your feedback, culinary tips, and leave a comment.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Link className="px-6 py-2.5 bg-primary-moss hover:bg-primary-moss-hover text-white text-sm font-medium rounded-lg transition-colors shadow-sm" to="/login">
                  Log In
                </Link>
                <Link className="px-6 py-2.5 border border-primary-moss text-primary-moss hover:bg-bg-herb-white text-sm font-medium rounded-lg transition-colors" to="/sign-up">
                  Sign Up
                </Link>
              </div>
            </div>
            {/* Sample placeholder comment box */}
            <div className="space-y-4">
              <div className="bg-surface-paper border border-border-sage-mist rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-bg-herb-white border border-border-sage-mist flex items-center justify-center text-text-stem-gray">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-text-charcoal">
                      Mai Linh
                    </span>
                    <span className="text-xs text-text-stem-gray">
                      • 1 hour ago
                    </span>
                  </div>
                  <a className="text-xs text-text-stem-gray hover:text-primary-moss transition-colors flex items-center gap-1" href="#" title="Log in to reply to this comment">
                    <span className="">
                      Reply
                    </span>
                    <svg className="w-3 h-3 text-text-stem-gray" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                      <rect height="10" rx="2" width="14" x="5" y="11"></rect>
                      <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
                    </svg>
                  </a>
                </div>
                <p className="text-sm text-text-charcoal/90 pl-9">
                  I made this dish for my family yesterday evening! The aroma of the green pepper simmered in coconut water was incredible, and the mushrooms were succulent and crunchy. Thank you chef!
                </p>
              </div>
            </div>
          </section>
        </article>
      </main>
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
      {/* Chatbot Popup Panel AI (Mặc định thu nhỏ hiển thị nút FAB, bấm để mở widget 380x520) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Chatbot Popup Widget */}
        <div className="flex-col w-[380px] max-w-[calc(100vw-2rem)] h-[520px] bg-surface-paper border border-border-sage-mist rounded-2xl shadow-card-modal overflow-hidden text-text-charcoal transition-all hidden" id="ai-chat-widget">
          {/* Header Popup */}
          <div className="px-4 py-3 bg-surface-paper border-b border-border-sage-mist flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              {/* Icon Trợ lý AI */}
              <div className="w-8 h-8 rounded-full bg-bg-herb-white text-primary-moss border border-border-sage-mist flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-4 h-4 text-primary-moss" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-sans font-semibold text-[15px] text-text-charcoal flex items-center gap-1.5 leading-tight">
                  AI Nutrition Assistant
                </h3>
                {/* Online status */}
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-success-sprout inline-block animate-pulse"></span>
                  <span className="text-[11px] text-text-stem-gray leading-none">
                    Online & ready
                  </span>
                </div>
              </div>
            </div>
            {/* Minimize (-) and Close (x) buttons */}
            <div className="flex items-center gap-1 text-text-stem-gray">
              <button aria-label="Minimize" className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-bg-herb-white hover:text-text-charcoal transition-colors focus:outline-none" title="Minimize (—)">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M5 12h14"></path>
                </svg>
              </button>
              <button aria-label="Close" className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-bg-herb-white hover:text-text-charcoal transition-colors focus:outline-none" title="Close (×)">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          {/* Chat Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-bg-herb-white/50 text-[13px] leading-relaxed">
            {/* AI Welcome Message */}
            <div className="flex items-start gap-2.5 max-w-[90%]">
              <div className="w-7 h-7 rounded-full bg-bg-herb-white text-primary-moss border border-border-sage-mist flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <svg className="w-3.5 h-3.5 text-primary-moss" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </div>
              <div className="bg-surface-paper border border-border-sage-mist rounded-xl rounded-tl-sm p-3 shadow-sm space-y-1 text-text-charcoal">
                <p className="">
                  Hello! I am your
                  <strong className="font-medium text-primary-moss">
                    Botanical Hearth AI Nutrition Assistant
                  </strong>
                  . I can help you explore vegan recipes, balance plant nutrients, or plan today's menu.
                </p>
              </div>
            </div>
            {/* User Message */}
            <div className="flex items-start justify-end gap-2 max-w-[90%] ml-auto">
              <div className="bg-primary-moss text-white rounded-xl rounded-tr-sm p-3 shadow-sm text-right">
                <p className="text-white">
                  Could you suggest a high-protein, light and refreshing vegan lunch?
                </p>
              </div>
            </div>
            {/* AI Response Message */}
            <div className="flex items-start gap-2.5 max-w-[90%]">
              <div className="w-7 h-7 rounded-full bg-bg-herb-white text-primary-moss border border-border-sage-mist flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <svg className="w-3.5 h-3.5 text-primary-moss" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              </div>
              <div className="bg-surface-paper border border-border-sage-mist rounded-xl rounded-tl-sm p-3 shadow-sm space-y-1.5 text-text-charcoal">
                <p className="">
                  For lunch today, try
                  <strong className="text-primary-moss font-semibold">
                    Seaweed & Lotus Seed Soup
                  </strong>
                  paired with
                  <strong className="text-primary-moss font-semibold">
                    Braised Silken Tofu & Shiitake Mushrooms
                  </strong>
                  . This provides complete plant protein, aids digestion, and keeps you energized!
                </p>
              </div>
            </div>
            {/* Quick Suggestion Chips */}
            <div className="pt-1 space-y-1.5 pl-9">
              <p className="text-[11px] text-text-stem-gray font-medium">
                Quick suggestions:
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button className="px-2.5 py-1 bg-surface-paper hover:bg-bg-herb-white border border-border-sage-mist text-text-charcoal rounded-full text-xs transition-colors text-left shadow-xs">
                  🌱 High Protein Dishes
                </button>
                <button className="px-2.5 py-1 bg-surface-paper hover:bg-bg-herb-white border border-border-sage-mist text-text-charcoal rounded-full text-xs transition-colors text-left shadow-xs">
                  🥣 Weight Loss Menu
                </button>
                <button className="px-2.5 py-1 bg-surface-paper hover:bg-bg-herb-white border border-border-sage-mist text-text-charcoal rounded-full text-xs transition-colors text-left shadow-xs">
                  🥦 Ingredient Swaps
                </button>
              </div>
            </div>
          </div>
          {/* Bottom Popup: Input field & Send button */}
          <div className="p-3 bg-surface-paper border-t border-border-sage-mist shrink-0">
            <form className="flex items-center gap-2">
              <input className="flex-1 bg-bg-herb-white border border-border-sage-mist rounded-xl px-3.5 py-2 text-xs text-text-charcoal placeholder-text-stem-gray focus:outline-none focus:border-primary-moss transition-colors" placeholder="Ask AI nutrition assistant..." type="text" />
              <button aria-label="Send" className="w-8 h-8 rounded-full bg-primary-moss hover:bg-primary-moss-hover text-white flex items-center justify-center shrink-0 transition-colors shadow-sm focus:outline-none" title="Send question" type="button">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
                </svg>
              </button>
            </form>
          </div>
        </div>
        {/* Chatbot FAB Trigger Button */}
        <button aria-label="Botanical Hearth AI Assistant" className="relative group w-14 h-14 rounded-full bg-primary-moss hover:bg-primary-moss-hover text-white flex items-center justify-center shadow-card-modal transition-all transform hover:scale-105 focus:outline-none" id="fab-chatbot" title="Open Botanical Hearth AI Assistant" type="button">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
          </svg>
          <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-accent-turmeric rounded-full border-2 border-surface-paper" title="Guest Visitor"></span>
        </button>
      </div>
      <div id="login-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 hidden">
        <div className="absolute inset-0 bg-[#2b2a25] bg-opacity-40"></div>
        <div className="relative z-10 bg-[#FDFBF6] border border-border-sage-mist rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-card-modal space-y-5 text-center">
          <button type="button" className="absolute top-4 right-4 text-text-stem-gray hover:text-text-charcoal p-1 rounded-lg hover:bg-bg-herb-white transition-colors duration-200 focus:outline-none" aria-label="Close modal">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <div className="w-14 h-14 mx-auto rounded-full bg-bg-herb-white border border-border-sage-mist flex items-center justify-center text-primary-moss shadow-sm">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"></path>
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="font-fraunces font-semibold text-2xl text-text-charcoal">
              Join Botanical Hearth
            </h3>
            <p className="text-sm text-text-stem-gray leading-relaxed">
              Please log in or create an account to save recipes to your collection, favorite community posts, and join the conversation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/login" className="w-full sm:w-auto px-6 py-2.5 bg-primary-moss hover:bg-primary-moss-hover text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm text-center">
              Log In
            </Link>
            <Link to="/sign-up" className="w-full sm:w-auto px-6 py-2.5 border border-primary-moss text-primary-moss hover:bg-bg-herb-white text-sm font-medium rounded-lg transition-colors duration-200 text-center">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostDetailGuest;
