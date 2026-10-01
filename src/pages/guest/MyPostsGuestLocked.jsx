import { Link } from 'react-router-dom'
import HeaderGuest from '../../components/layout/HeaderGuest';

function MyPostsGuestLocked() {
  return (
    <>
      {/* BEGIN: MainHeader */}
      <HeaderGuest />
      {/* END: MainHeader */}
      {/* BEGIN: MainContent */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full" data-purpose="my-posts-management-screen">
        <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
          <div className="bg-surface-paper border border-border-sage-mist rounded-2xl p-10 max-w-lg w-full text-center mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#EAEFE5] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-text-stem-gray" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
            <h2 className="font-serif-title text-2xl font-semibold text-text-charcoal">
              Sign in to access My Posts
            </h2>
            <p className="text-sm text-text-stem-gray mt-2 mb-6 leading-relaxed">
              Log in to share plant-based culinary recipes, publish cooking videos, and manage your saved dishes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button className="w-full sm:w-auto bg-primary-moss hover:bg-primary-moss-hover text-surface-paper font-medium px-6 py-3 rounded-lg transition-colors shadow-sm" type="button">
                Log In
              </button>
              <button className="w-full sm:w-auto border border-primary-moss text-primary-moss hover:bg-herb-white font-medium px-6 py-3 rounded-lg transition-colors" type="button">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </main>
      {/* END: MainContent */}
      {/* BEGIN: FloatingActionButtons */}
      {/* Upload Recipe FAB */}
      {/* AI Nutrition Assistant Chatbot FAB */}
      <button aria-haspopup="dialog" aria-label="Open AI Nutrition Assistant" className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary-moss hover:bg-primary-moss-hover text-surface-paper flex items-center justify-center fab-shadow transition-transform hover:scale-105 active:scale-95 z-30 focus:outline-none focus:ring-4 focus:ring-primary-moss/30" id="chatBotFab" title="Open AI Nutrition Assistant" type="button">
        {/* AI Sparkle Icon */}
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
          <path d="M5 3v4"></path>
          <path d="M3 5h4"></path>
          <path d="M19 17v4"></path>
          <path d="M17 19h4"></path>
        </svg>
      </button>
      {/* END: FloatingActionButtons */}
      {/* BEGIN: NutritionAssistantPopupWidget */}
      <div aria-labelledby="chatWidgetTitle" className="hidden fixed bottom-24 right-6 w-[380px] h-[520px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)] bg-surface-paper border border-border-sage-mist rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right" id="aiChatWidget" role="dialog">
        {/* Header */}
        <div className="px-5 py-3.5 bg-herb-white border-b border-border-sage-mist flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-moss text-surface-paper flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-sm text-text-charcoal leading-none" id="chatWidgetTitle">
                AI Nutrition Assistant
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs text-text-stem-gray">
                  Online & ready
                </span>
              </div>
            </div>
          </div>
          <button aria-label="Close Assistant" className="text-text-stem-gray hover:text-text-charcoal p-1 rounded-lg hover:bg-border-sage-mist/40 transition-colors" id="closeChatBtn" type="button">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
        </div>
        {/* Message Area */}
        <div className="flex-grow p-4 overflow-y-auto space-y-3.5 custom-scrollbar text-xs sm:text-sm">
          {/* Assistant Bubble */}
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-primary-moss/10 text-primary-moss flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
              AI
            </div>
            <div className="bg-herb-white text-text-charcoal p-3 rounded-2xl rounded-tl-sm border border-border-sage-mist/70 leading-relaxed shadow-xs">
              Hello Chef! How can I assist with your recipes or nutrition calculations today?
            </div>
          </div>
          {/* Quick Chips */}
          <div className="pt-1 pb-1 flex flex-wrap gap-1.5">
            <button className="suggestion-chip text-xs bg-herb-white hover:bg-border-sage-mist/60 text-primary-moss font-medium px-2.5 py-1.5 rounded-full border border-border-sage-mist transition-colors">
              🌱 High Protein Dishes
            </button>
            <button className="suggestion-chip text-xs bg-herb-white hover:bg-border-sage-mist/60 text-primary-moss font-medium px-2.5 py-1.5 rounded-full border border-border-sage-mist transition-colors">
              🥣 Weight Loss Menu
            </button>
            <button className="suggestion-chip text-xs bg-herb-white hover:bg-border-sage-mist/60 text-primary-moss font-medium px-2.5 py-1.5 rounded-full border border-border-sage-mist transition-colors">
              🥦 Ingredient Swaps
            </button>
          </div>
          {/* User Bubble Sample */}
          <div className="flex items-start justify-end gap-2.5">
            <div className="bg-primary-moss text-surface-paper p-3 rounded-2xl rounded-tr-sm leading-relaxed shadow-xs max-w-[80%]">
              Can you suggest a nutrient-dense vegan substitute for oyster sauce in braises?
            </div>
          </div>
          {/* Assistant Response Sample */}
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-primary-moss/10 text-primary-moss flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
              AI
            </div>
            <div className="bg-herb-white text-text-charcoal p-3 rounded-2xl rounded-tl-sm border border-border-sage-mist/70 leading-relaxed shadow-xs">
              Shiitake mushroom concentrate combined with dark soy sauce and a pinch of coconut sugar creates an authentic savory umami glaze rich in zinc!
            </div>
          </div>
        </div>
        {/* Input Footer */}
        <div className="p-3 bg-surface-paper border-t border-border-sage-mist">
          <form className="relative flex items-center" id="chatForm">
            <input className="w-full pl-3.5 pr-10 py-2.5 bg-herb-white border border-border-sage-mist rounded-xl text-xs sm:text-sm text-text-charcoal placeholder-text-stem-gray/70 focus:outline-none focus:ring-2 focus:ring-primary-moss focus:border-primary-moss transition-all" placeholder="Ask AI nutrition assistant..." type="text" />
            <button className="absolute right-1.5 p-1.5 bg-primary-moss hover:bg-primary-moss-hover text-surface-paper rounded-lg transition-colors" title="Send query" type="submit">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="22" x2="11" y1="2" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
      {/* END: NutritionAssistantPopupWidget */}
      {/* BEGIN: MainFooter */}
      <footer className="mt-auto border-t border-border-sage-mist bg-surface-paper" data-purpose="application-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-text-stem-gray">
          {/* Left Trademark and Subtitle */}
          <div className="flex items-center gap-2 text-center md:text-left">
            <span className="font-bold text-text-charcoal">
              Botanical Hearth
            </span>
            <span>
              •
            </span>
            <span>
              Plant-based culinary & family nutrition platform
            </span>
          </div>
          {/* Right Policy Navigation */}
          <nav className="flex flex-wrap justify-center items-center gap-6">
            <a className="hover:text-primary-moss transition-colors" href="#">
              About Us
            </a>
            <a className="hover:text-primary-moss transition-colors" href="#">
              Terms of Service
            </a>
            <a className="hover:text-primary-moss transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-primary-moss transition-colors" href="#">
              Contact Support
            </a>
          </nav>
        </div>
      </footer>
      {/* END: MainFooter */}
      {/* Script for Dropdown & Chatbot Interactions */}
      {/* TODO: script goc da bi loai bo, can port lai logic bang useState/useEffect */}
    </>
  );
}

export default MyPostsGuestLocked;
