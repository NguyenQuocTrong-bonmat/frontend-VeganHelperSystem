import { Link } from 'react-router-dom'
import HeaderGuest from '../../components/layout/HeaderGuest';

function WeeklyMenuGuestLocked() {
  return (
    <>
      {/* 1. Header-LoggedIn (Fixed 64px, 'Weekly Menu' active) */}
      <HeaderGuest />
      {/* Main Content Container */}
      <main className="flex-1 max-w-[1120px] w-full mx-auto px-6 py-10 space-y-12">
        <div className="min-h-[70vh] flex items-center justify-center py-12">
          <div className="w-full max-w-lg bg-surface-paper border border-border-sage-mist rounded-2xl p-10 text-center mx-auto shadow-subtle">
            <div className="w-16 h-16 rounded-full bg-[#EAEFE5] flex items-center justify-center mx-auto mb-4 text-text-stem-gray">
              <svg className="w-8 h-8 text-text-stem-gray" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" viewBox="0 0 24 24">
                <rect height="11" rx="2" ry="2" width="18" x="3" y="11"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h2 className="font-fraunces text-2xl md:text-3xl font-semibold text-text-charcoal">
              Sign in to access Weekly Menu
            </h2>
            <p className="text-text-stem-gray mt-2 mb-6 text-base leading-relaxed">
              Log in to create personalized meal plans and track your BMI.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/login" className="flex-1 sm:flex-initial bg-primary-moss hover:bg-primary-moss-hover text-white px-6 py-3 rounded-lg font-medium transition-colors text-center inline-block">
                Log In
              </Link>
              <Link to="/sign-up" className="flex-1 sm:flex-initial border border-primary-moss hover:bg-herb-white text-primary-moss px-6 py-3 rounded-lg font-medium transition-colors text-center inline-block">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </main>
      {/* Global Chatbot FAB & Interactive Popup Widget */}
      <aside className="fixed bottom-6 right-6 z-50">
        {/* Chat FAB Button (56px circle, primary-moss, white AI sparkle) */}
        <button className="w-14 h-14 rounded-full bg-primary-moss hover:bg-primary-moss-hover text-white flex items-center justify-center shadow-subtle transition-all focus:outline-none focus:ring-2 focus:ring-primary-moss/40 cursor-pointer" id="chat-fab" title="AI Nutrition Assistant">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
          </svg>
        </button>
        {/* Chat Popup Panel */}
        <div className="w-[380px] max-w-[calc(100vw-32px)] h-[520px] bg-surface-paper border border-border-sage-mist rounded-2xl shadow-subtle flex flex-col overflow-hidden hidden" id="chat-popup">
          {/* Header */}
          <div className="p-3.5 bg-surface-paper border-b border-border-sage-mist flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-herb-white border border-border-sage-mist flex items-center justify-center text-primary-moss flex-shrink-0">
                <svg className="w-5 h-5 text-primary-moss" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-text-charcoal leading-tight">
                  AI Nutrition Assistant
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-success-sprout inline-block"></span>
                  <span className="text-[11px] text-text-stem-gray">
                    Online & ready
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-text-stem-gray">
              <button className="w-7 h-7 rounded-lg hover:bg-herb-white flex items-center justify-center transition-colors" id="chat-minimize" title="Minimize">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="5" x2="19" y1="12" y2="12"></line>
                </svg>
              </button>
              <button className="w-7 h-7 rounded-lg hover:bg-herb-white flex items-center justify-center transition-colors" id="chat-close" title="Close">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" x2="6" y1="6" y2="18"></line>
                  <line x1="6" x2="18" y1="6" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          {/* Chat History / Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-[13px] bg-herb-white/50">
            {/* AI Greeting */}
            <div className="flex items-start gap-2 max-w-[88%]">
              <div className="w-7 h-7 rounded-full bg-primary-moss/10 flex items-center justify-center text-primary-moss flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                </svg>
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-surface-paper border border-border-sage-mist text-text-charcoal shadow-sm leading-relaxed">
                Hello! I am the Vegan Helper AI Nutrition Assistant. I can assist you with wholesome plant-based recipes, balanced nutrition insights, or personalized menu suggestions for today.
              </div>
            </div>
            {/* User message */}
            <div className="flex justify-end">
              <div className="max-w-[85%] p-3 rounded-2xl rounded-tr-sm bg-primary-moss text-white leading-relaxed">
                Could you recommend a light, high-protein plant-based lunch for today?
              </div>
            </div>
            {/* AI Reply */}
            <div className="flex items-start gap-2 max-w-[90%]">
              <div className="w-7 h-7 rounded-full bg-primary-moss/10 flex items-center justify-center text-primary-moss flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                </svg>
              </div>
              <div className="p-3 rounded-2xl rounded-tl-sm bg-surface-paper border border-border-sage-mist text-text-charcoal shadow-sm leading-relaxed">
                For lunch today, consider pairing
                <strong>
                  Lotus Seed & Seaweed Soup
                </strong>
                with
                <strong>
                  Silken Tofu in Shiitake Sauce
                </strong>
                . This combination delivers clean plant protein, promotes gentle digestion, and replenishes energy!
              </div>
            </div>
          </div>
          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-surface-paper border-t border-border-sage-mist overflow-x-auto flex-shrink-0 flex items-center gap-1.5 min-w-max">
            <button className="text-[11px] px-2.5 py-1 rounded-full bg-herb-white hover:bg-border-sage-mist/50 border border-border-sage-mist text-text-charcoal transition-colors whitespace-nowrap focus:outline-none">
              🌱 High Protein Dishes
            </button>
            <button className="text-[11px] px-2.5 py-1 rounded-full bg-herb-white hover:bg-border-sage-mist/50 border border-border-sage-mist text-text-charcoal transition-colors whitespace-nowrap focus:outline-none">
              🥣 Weight Loss Menu
            </button>
            <button className="text-[11px] px-2.5 py-1 rounded-full bg-herb-white hover:bg-border-sage-mist/50 border border-border-sage-mist text-text-charcoal transition-colors whitespace-nowrap focus:outline-none">
              🥦 Ingredient Swaps
            </button>
          </div>
          {/* Message Input */}
          <div className="p-3 bg-surface-paper border-t border-border-sage-mist flex-shrink-0">
            <form className="flex items-center gap-2">
              <input className="flex-1 h-10 px-3.5 rounded-lg bg-herb-white border border-border-sage-mist text-[13px] text-text-charcoal focus:outline-none focus:border-primary-moss" placeholder="Ask AI nutrition assistant..." type="text" />
              <button className="w-10 h-10 rounded-lg bg-primary-moss hover:bg-primary-moss-hover text-white flex items-center justify-center flex-shrink-0 transition-colors focus:outline-none" title="Send message" type="submit">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="22" x2="11" y1="2" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </aside>
      {/* Footer */}
      <footer className="w-full border-t border-[#DCE3D5] bg-[#FDFBF6] py-6 mt-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-sm text-[#6B6F63] gap-4">
          <div className="flex items-center gap-2">
            <span className="font-fraunces font-semibold text-[#2F5233] text-base">
              Vegan Helper
            </span>
            <span>
              •
            </span>
            <span>
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

export default WeeklyMenuGuestLocked;
