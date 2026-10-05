import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import AIChatbot from '../../components/chat/AIChatbot';

function StoreDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading before showing blocked/not found state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFBF6]">
        <HeaderMember />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#DCE3D5] border-t-[#2F5233] rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // Since API is blocked, we show the "API BLOCKED / Store not found" state.
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF6]">
      <HeaderMember />
      
      {/* PAGE HEADER & BLOCKED ALERT */}
      <div className="w-full bg-[#E9EFE6]/40 border-b border-[#DCE3D5]/50">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <button 
            onClick={() => navigate('/vegan-stores')}
            className="flex items-center gap-2 text-[#6B6F63] hover:text-[#2F5233] transition-colors mb-6 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Stores
          </button>
          
          <div className="bg-[#FFF5F5] border border-[#FFE0E0] p-5 rounded-xl flex flex-col gap-2 shadow-sm">
            <div className="flex items-center gap-2 text-[#A63446] font-semibold text-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              API Integration BLOCKED
            </div>
            <p className="text-[#A63446]/90 text-sm">
              The backend does not currently provide a Store Detail API endpoint. 
              Cannot fetch information for Store ID: <span className="font-mono bg-[#A63446]/10 px-1 rounded">{id}</span>.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-10 space-y-8">
        
        {/* EMPTY STATE / NOT FOUND */}
        <div className="bg-white border border-[#DCE3D5] rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#F3F6EE] text-[#2F5233] rounded-full flex items-center justify-center text-2xl">
            🏪
          </div>
          <h2 className="font-fraunces text-2xl font-semibold text-[#2B2A25] mb-2">
            Store not found.
          </h2>
          <p className="text-[#6B6F63] max-w-md mx-auto mb-6">
            The store details you are looking for cannot be loaded because the underlying data service is not yet available.
          </p>
          <button 
            onClick={() => navigate('/vegan-stores')}
            className="px-6 py-2.5 bg-[#2F5233] text-white rounded-lg font-medium hover:bg-[#25401F] transition-colors"
          >
            Explore Other Stores
          </button>
        </div>

        {/* STRUCTURAL LAYOUT (Visible but empty to prove layout exists) */}
        <div className="opacity-40 pointer-events-none filter grayscale">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1 h-5 bg-[#2F5233] rounded-full"></span>
            <h3 className="text-sm font-bold text-[#6B6F63] uppercase tracking-wider">Expected Layout Structure</h3>
          </div>
          
          <div className="bg-white border border-[#DCE3D5] rounded-2xl p-6 shadow-sm space-y-6">
            {/* Gallery Placeholder */}
            <div className="w-full h-64 bg-[#E9EFE6] rounded-xl flex items-center justify-center border border-[#DCE3D5]">
               <span className="text-[#6B6F63]">Store Image Gallery</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Info Column */}
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-[#E9EFE6] w-3/4 rounded-lg"></div>
                <div className="flex items-center gap-2">
                   <div className="h-5 bg-[#E9EFE6] w-1/4 rounded-md"></div>
                   <div className="h-5 bg-[#E9EFE6] w-1/5 rounded-md"></div>
                </div>
                <div className="space-y-2 pt-4">
                   <div className="h-4 bg-[#E9EFE6] w-full rounded-md"></div>
                   <div className="h-4 bg-[#E9EFE6] w-5/6 rounded-md"></div>
                   <div className="h-4 bg-[#E9EFE6] w-1/2 rounded-md"></div>
                </div>
                <div className="pt-4">
                  <div className="h-10 bg-[#2F5233]/20 w-40 rounded-lg"></div>
                </div>
              </div>
              
              {/* Map Column */}
              <div className="w-full md:w-1/3 h-48 bg-[#E9EFE6] border border-[#DCE3D5] rounded-xl flex items-center justify-center">
                 <span className="text-[#6B6F63] text-sm">Location Map</span>
              </div>
            </div>
          </div>
        </div>
        
      </main>

      <AIChatbot />
      <Footer />
    </div>
  );
}

export default StoreDetail;
