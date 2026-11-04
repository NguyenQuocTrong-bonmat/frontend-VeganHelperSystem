import { Link } from 'react-router-dom'
import HeaderGuest from '../../components/layout/HeaderGuest';
import AIChatbot from '../../components/chat/AIChatbot';

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
              <Link to="/login" className="w-full sm:w-auto bg-primary-moss hover:bg-primary-moss-hover text-surface-paper font-medium px-6 py-3 rounded-lg transition-colors shadow-sm text-center inline-block">
                Log In
              </Link>
              <Link to="/sign-up" className="w-full sm:w-auto border border-primary-moss text-primary-moss hover:bg-herb-white font-medium px-6 py-3 rounded-lg transition-colors text-center inline-block">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </main>
      {/* END: MainContent */}
      <AIChatbot />
      {/* BEGIN: MainFooter */}
      <footer className="mt-auto border-t border-border-sage-mist bg-surface-paper" data-purpose="application-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-text-stem-gray">
          {/* Left Trademark and Subtitle */}
          <div className="flex items-center gap-2 text-center md:text-left">
            <span className="font-bold text-text-charcoal">
              Vegan Helper
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
