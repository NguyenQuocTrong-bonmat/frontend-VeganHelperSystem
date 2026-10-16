import React from 'react';
import { Link } from 'react-router-dom';

export default function HomeUtilityRail({ 
  isGuest = false,
  categories = [],
  selectedCategoryId = null,
  onSelectCategory
}) {
  const weeklyMenuRoute = isGuest ? '/weekly-menu/locked' : '/weekly-menu';

  const handleOpenAiChat = () => {
    // If AIChatbot has a floating action button or trigger in the DOM, activate it
    const fab = document.getElementById('chat-fab') || document.querySelector('[aria-label*="AI"]') || document.querySelector('button[title*="AI"]');
    if (fab) {
      fab.click();
    }
  };

  return (
    <aside
      aria-label="Community Utilities"
      className="w-[310px] xl:w-[330px] shrink-0 hidden xl:block space-y-5 select-none text-left sticky top-20 max-h-[calc(100vh-5.5rem)] overflow-y-auto overscroll-contain pl-1 pb-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-vh-border/60 [&::-webkit-scrollbar-thumb]:rounded-full"
    >
      {/* 1. Weekly Meal Planner Card */}
      <div className="bg-vh-surface border border-vh-border/70 rounded-card p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-vh-mint/60 text-vh-forest rounded-full text-xs font-semibold font-dm-sans">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Nutrition Tool</span>
          </span>
        </div>
        <div>
          <h3 className="font-dm-serif text-lg font-medium text-vh-text-primary">
            Weekly Meal Planner
          </h3>
          <p className="text-xs leading-relaxed font-dm-sans text-vh-text-secondary mt-1">
            Build 7 days of wholesome plant-based meals customized to your dietary profile and allergies.
          </p>
        </div>
        <Link
          to={weeklyMenuRoute}
          className="inline-flex items-center gap-2 text-xs font-semibold font-dm-sans text-vh-forest hover:text-vh-sage transition-colors focus:outline-none focus-visible:underline"
        >
          <span>{isGuest ? 'Explore Weekly Planner' : 'Open My Weekly Menu'}</span>
          <span>&rarr;</span>
        </Link>
      </div>

      {/* 2. AI Nutrition Assistant Card */}
      <div className="bg-gradient-to-br from-vh-surface to-vh-mint/25 border border-vh-border/70 rounded-card p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/80 text-vh-forest rounded-full text-xs font-semibold font-dm-sans shadow-2xs">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span>AI Genie</span>
          </span>
        </div>
        <div>
          <h3 className="font-dm-serif text-lg font-medium text-vh-text-primary">
            Plant-Based Assistant
          </h3>
          <p className="text-xs leading-relaxed font-dm-sans text-vh-text-secondary mt-1">
            Need ingredient substitutions for fish sauce or quick high-protein vegan ideas?
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAiChat}
          className="w-full py-2.5 px-3 bg-vh-forest text-white rounded-xl text-xs font-semibold font-dm-sans hover:bg-vh-sage transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest"
        >
          <span>Ask AI Assistant</span>
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>

      {/* 3. Popular Food Categories */}
      {categories && categories.length > 0 && (
        <div className="bg-vh-surface border border-vh-border/70 rounded-card p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-vh-forest shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <p className="font-dm-serif text-sm font-semibold text-vh-text-primary">
              Popular Categories
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.slice(0, 6).map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory?.(isSelected ? null : cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-dm-sans transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest ${
                    isSelected
                      ? 'bg-vh-forest text-white font-medium shadow-2xs'
                      : 'bg-vh-mint/40 text-vh-forest hover:bg-vh-mint hover:text-vh-forest'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Footer Note */}
      <div className="px-3 text-[11px] font-dm-sans text-vh-text-secondary/70 leading-normal">
        <p>VeganHelper &copy; 2026</p>
        <p className="mt-0.5">Empowering Vietnamese plant-based living with authentic recipes & community insights.</p>
      </div>
    </aside>
  );
}
