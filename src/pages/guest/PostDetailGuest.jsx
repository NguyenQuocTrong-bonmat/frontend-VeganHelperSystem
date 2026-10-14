import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderGuest from '../../components/layout/HeaderGuest';
import Footer from '../../components/layout/Footer';
import PostDetailCore from '../../components/home/PostDetailCore';

function PostDetailGuest() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF6]">
      <HeaderGuest />
      <PostDetailCore isGuest={true} onAuthRequired={() => setShowLoginModal(true)} />
      <Footer />

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#2b2a25] bg-opacity-40" onClick={() => setShowLoginModal(false)}></div>
          <div className="relative z-10 bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-lg space-y-5 text-center">
            <button onClick={() => setShowLoginModal(false)} type="button" className="absolute top-4 right-4 text-[#6B6F63] hover:text-[#2B2A25] p-1 rounded-lg hover:bg-[#F3F6EE] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <div className="w-14 h-14 mx-auto rounded-full bg-[#F3F6EE] border border-[#DCE3D5] flex items-center justify-center text-[#2F5233]">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"></path>
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="font-fraunces font-semibold text-2xl text-[#2B2A25]">
                Join Vegan Helper
              </h3>
              <p className="text-sm text-[#6B6F63] leading-relaxed">
                Please log in or create an account to save recipes, like posts, and join the conversation.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link to="/login" className="w-full sm:w-auto px-6 py-2.5 bg-[#2F5233] hover:bg-[#25401F] text-white text-sm font-medium rounded-lg transition-colors text-center cursor-pointer">
                Log In
              </Link>
              <Link to="/sign-up" className="w-full sm:w-auto px-6 py-2.5 border border-[#2F5233] text-[#2F5233] hover:bg-[#F3F6EE] text-sm font-medium rounded-lg transition-colors text-center cursor-pointer">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostDetailGuest;
