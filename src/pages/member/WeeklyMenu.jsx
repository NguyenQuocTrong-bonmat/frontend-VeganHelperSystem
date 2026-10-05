import React, { useState } from 'react';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import AIChatbot from '../../components/chat/AIChatbot';

function WeeklyMenu() {
  const [selectedDay, setSelectedDay] = useState('Monday');
  
  const days = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF6]">
      <HeaderMember />
      
      {/* PAGE HEADER */}
      <div className="w-full bg-[#E9EFE6]/40 border-b border-[#DCE3D5]/50">
        <div className="max-w-6xl mx-auto px-6 py-10 text-center">
          <h1 className="text-3xl md:text-4xl font-fraunces font-semibold text-[#2B2A25] mb-2">
            Weekly Vegan Menu
          </h1>
          <p className="text-[#6B6F63] text-[15px]">
            Your 7-day personalized plant-based meal plan
          </p>
        </div>
      </div>

      <main className="flex-grow w-full max-w-6xl mx-auto px-6 py-10 space-y-8">
        
        {/* BLOCKED ALERT */}
        <div className="bg-[#FFF5F5] border border-[#FFE0E0] p-5 rounded-xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#A63446] font-semibold text-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            API Integration BLOCKED
          </div>
          <p className="text-[#A63446]/90 text-sm">
            The backend does not currently provide a MealPlanner or WeeklyMenu API. 
            No sample mock recipes have been generated to respect the data constraints.
          </p>
        </div>

        {/* WEEKLY NAVIGATION */}
        <div className="border-b border-[#DCE3D5] overflow-x-auto">
          <div className="flex items-center space-x-6 min-w-max pb-[-1px]">
            {days.map((day) => (
              <button 
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`pb-3 text-[15px] transition-colors focus:outline-none border-b-2 flex items-center gap-2
                  ${selectedDay === day 
                    ? 'font-semibold text-[#2F5233] border-[#2F5233]' 
                    : 'font-medium text-[#6B6F63] hover:text-[#2B2A25] border-transparent hover:border-[#DCE3D5]'
                  }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* DAILY MEALS GRID (EMPTY STATE) */}
        <div className="bg-white border border-[#DCE3D5] rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#F3F6EE] text-[#2F5233] rounded-full flex items-center justify-center text-2xl">
            🍽️
          </div>
          <h2 className="font-fraunces text-2xl font-semibold text-[#2B2A25] mb-2">
            No weekly menu available.
          </h2>
          <p className="text-[#6B6F63] max-w-md mx-auto">
            We couldn't load your meal plan for {selectedDay}. The API endpoints for generating the menu are not yet implemented.
          </p>
        </div>
        
      </main>

      <AIChatbot />
      <Footer />
    </div>
  );
}

export default WeeklyMenu;
