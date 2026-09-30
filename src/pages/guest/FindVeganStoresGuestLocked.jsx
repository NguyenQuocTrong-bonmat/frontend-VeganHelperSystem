import { Link } from 'react-router-dom'

function FindVeganStoresGuestLocked() {
  return (
    <>
      {/* ==================== HEADER (Header-LoggedIn) ==================== */}
      <header className="sticky top-0 z-40 h-16 bg-surface-paper border-b border-border-sage-mist w-full px-6 lg:px-12 flex items-center justify-between transition-colors">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between relative">
          {/* Left: Logo */}
          <Link className="flex items-center gap-2.5 text-decoration-none group" to="/">
            <div className="w-8 h-8 rounded-full bg-primary-moss/10 text-primary-moss flex items-center justify-center transition group-hover:bg-primary-moss/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
              </svg>
            </div>
            <span className="font-display font-semibold text-2xl tracking-tight text-primary-moss">
              Botanical Hearth
            </span>
          </Link>
          {/* Center: 4 Horizontal Navigation Items */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center gap-8 h-full text-[15px]">
            <Link className="text-text-charcoal hover:text-primary-moss transition h-full flex items-center font-normal" to="/">
              Home
            </Link>
            <Link className="text-text-charcoal hover:text-primary-moss transition h-full flex items-center font-normal" to="/weekly-menu/locked">
              Weekly Menu
            </Link>
            <Link className="text-primary-moss font-semibold border-b-2 border-primary-moss h-full flex items-center" to="/vegan-stores/locked">
              <span className="">
                Find Vegan Stores
              </span>
            </Link>
            <Link className="text-text-charcoal hover:text-primary-moss transition h-full flex items-center font-normal" to="/my-posts/locked">
              My Posts
            </Link>
          </nav>
          {/* Right: User Avatar Area */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-[14px] font-medium text-primary-moss border border-primary-moss rounded-lg hover:bg-bg-herb-white transition cursor-pointer" type="button">
              Log In
            </button>
            <button className="px-4 py-2 text-[14px] font-medium text-white bg-primary-moss hover:bg-primary-moss-hover rounded-lg transition cursor-pointer shadow-sm" type="button">
              Sign Up
            </button>
          </div>
        </div>
      </header>
      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-1 flex flex-col w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6 gap-6">
        <div className="min-h-[70vh] flex items-center justify-center w-full my-auto py-12">
          <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl p-10 max-w-lg w-full text-center mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#E9EFE5] text-text-stem-gray">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect height="11" rx="2" ry="2" width="18" x="3" y="11"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h2 className="font-display text-2xl font-semibold text-text-charcoal">
              Sign in to access Find Vegan Stores
            </h2>
            <p className="font-sans text-[15px] text-text-stem-gray mt-2 mb-6 leading-relaxed">
              Log in to explore nearby wholesome plant-based eateries, organic markets, and get directions.
            </p>
            <div className="flex items-center justify-center gap-3.5">
              <button className="px-6 py-3 bg-primary-moss hover:bg-primary-moss-hover text-white rounded-lg text-[14px] font-medium transition cursor-pointer shadow-sm" type="button">
                Log In
              </button>
              <button className="px-6 py-3 border border-primary-moss text-primary-moss hover:bg-bg-herb-white rounded-lg text-[14px] font-medium transition cursor-pointer" type="button">
                Sign Up
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
                Hello! I am your Botanical Hearth Nutrition Assistant. How can I help you find vegan recipes, balance nutrition, or plan wholesome daily meals today?
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

export default FindVeganStoresGuestLocked;
