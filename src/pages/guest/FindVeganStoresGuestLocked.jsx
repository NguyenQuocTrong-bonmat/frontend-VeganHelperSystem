import { Link } from 'react-router-dom'
import HeaderGuest from '../../components/layout/HeaderGuest';
import AIChatbot from '../../components/chat/AIChatbot';

function FindVeganStoresGuestLocked() {
  return (
    <>
      {/* ==================== HEADER (Header-LoggedIn) ==================== */}
      <HeaderGuest />
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
              <Link to="/login" className="px-6 py-3 bg-primary-moss hover:bg-primary-moss-hover text-white rounded-lg text-[14px] font-medium transition cursor-pointer shadow-sm text-center inline-block">
                Log In
              </Link>
              <Link to="/sign-up" className="px-6 py-3 border border-primary-moss text-primary-moss hover:bg-bg-herb-white rounded-lg text-[14px] font-medium transition cursor-pointer text-center inline-block">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </main>
      <AIChatbot />
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
    </>
  );
}

export default FindVeganStoresGuestLocked;
