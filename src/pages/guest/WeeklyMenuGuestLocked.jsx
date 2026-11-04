import { Link } from 'react-router-dom'
import HeaderGuest from '../../components/layout/HeaderGuest';
import AIChatbot from '../../components/chat/AIChatbot';

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
      <AIChatbot />
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
