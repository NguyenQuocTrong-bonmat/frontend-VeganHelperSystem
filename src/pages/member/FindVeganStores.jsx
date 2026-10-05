import React, { useState, useEffect } from 'react';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import AIChatbot from '../../components/chat/AIChatbot';

function FindVeganStores() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationStatus, setLocationStatus] = useState('prompt'); // prompt, granted, denied, error
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    // Request location once on load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationStatus('granted');
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setLocationStatus('denied');
        }
      );
    } else {
      setLocationStatus('error');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF6]">
      <HeaderMember />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        <h1 className="font-fraunces text-3xl md:text-4xl font-semibold text-[#2B2A25] mb-2">
          Find Vegan Stores
        </h1>
        <p className="text-[#6B6F63] text-[15px] mb-8">
          Discover wholesome plant-based eateries and organic vegan markets.
        </p>

        {/* Desktop Layout: 2 columns. Mobile Layout: 1 column stack */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT PANEL: Search, Filters, List */}
          <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col gap-6">
            
            {/* Search Bar */}
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#6B6F63]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by store name, address..." 
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-[#DCE3D5] rounded-xl text-[15px] text-[#2B2A25] placeholder:text-[#6B6F63] focus:outline-none focus:ring-2 focus:ring-[#2F5233] focus:border-transparent transition shadow-sm"
              />
            </div>

            {/* Location Status Message */}
            {locationStatus === 'denied' && (
              <div className="bg-[#FDFBF6] border border-[#DCE3D5] px-4 py-3 rounded-lg text-sm text-[#6B6F63] flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                Location access is unavailable. Search for a vegan store instead.
              </div>
            )}

            {/* API Blocked Alert */}
            <div className="bg-[#FFF5F5] border border-[#FFE0E0] p-4 rounded-xl flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0 text-[#A63446] mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              <div>
                <h3 className="text-[#A63446] font-semibold text-sm">Store API BLOCKED</h3>
                <p className="text-[#A63446]/90 text-sm mt-1">
                  The backend Store endpoints are not yet implemented. Cannot fetch nearby or search store results. Mock data is intentionally omitted.
                </p>
              </div>
            </div>

            {/* Empty List State */}
            <div className="flex-1 min-h-[300px] bg-white border border-[#DCE3D5] rounded-xl flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-[#F3F6EE] rounded-full flex items-center justify-center mb-4 text-[#2F5233]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"></path></svg>
              </div>
              <h3 className="font-fraunces text-xl font-semibold text-[#2B2A25] mb-2">No Stores Found</h3>
              <p className="text-[#6B6F63] text-sm">Waiting for backend integration to display actual stores in your area.</p>
            </div>
            
          </div>

          {/* RIGHT PANEL: Map */}
          <div className="w-full lg:w-[55%] xl:w-[60%] lg:h-auto min-h-[400px] bg-[#E9EFE6] border border-[#DCE3D5] rounded-2xl overflow-hidden relative flex items-center justify-center">
            {/* Simple Map Placeholder */}
            <div className="absolute inset-0 opacity-40">
               <svg className="w-full h-full object-cover" fill="none" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 0,150 Q 200,50 400,200 T 800,100" stroke="#CADDE3" strokeWidth="20" fill="none"></path>
                  <path d="M 100,0 L 100,600 M 300,0 L 300,600 M 500,0 L 500,600 M 700,0 L 700,600" stroke="#FAF8F2" strokeWidth="4"></path>
                  <path d="M 0,200 L 800,200 M 0,400 L 800,400" stroke="#FAF8F2" strokeWidth="4"></path>
               </svg>
            </div>
            
            <div className="relative z-10 bg-white/90 backdrop-blur-sm border border-[#DCE3D5] px-6 py-4 rounded-xl text-center max-w-[80%] shadow-sm">
              <svg className="w-8 h-8 text-[#2F5233] mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"></path></svg>
              <h3 className="font-semibold text-[#2B2A25] mb-1">Map Unavailable</h3>
              <p className="text-sm text-[#6B6F63]">Integration with a live map provider is paused until API store coordinates are available.</p>
            </div>
          </div>
          
        </div>
      </main>

      <AIChatbot />
      <Footer />
    </div>
  );
}

export default FindVeganStores;
