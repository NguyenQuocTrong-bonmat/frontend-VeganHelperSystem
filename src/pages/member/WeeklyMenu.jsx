import React, { useEffect, useState } from 'react';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import AIChatbot from '../../components/chat/AIChatbot';
import HealthAndWellness from './HealthAndWellness';
import WeeklyMealPlanner from '../../components/meal-planning/WeeklyMealPlanner';
import MealPlanBillingPanel from '../../components/meal-planning/MealPlanBillingPanel';
import { useLocation } from 'react-router-dom';

function WeeklyMenu() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('weekly');
  const [mealPlanAccess, setMealPlanAccess] = useState(undefined);

  useEffect(() => {
    if (location.hash !== '#meal-plan-packages') return undefined;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById('meal-plan-packages');
      if (!target) return;
      const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.hash]);
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF6]">
      <HeaderMember />
      
      {/* PAGE HEADER */}
      <div className="w-full bg-[#E9EFE6]/40 border-b border-[#DCE3D5]/50">
        <div className="max-w-6xl mx-auto px-6 py-10 text-center">
          <h1 className="text-3xl md:text-4xl font-fraunces font-semibold text-[#2B2A25] mb-2">
            Wellness Dashboard
          </h1>
          <p className="text-[#6B6F63] text-[15px]">
            Manage your meal plans, health profile, allergies, and BMI metrics
          </p>
        </div>
      </div>

      {/* TABS NAVIGATION — Unified 2-Tab Navigation */}
      <div className="w-full bg-white border-b border-[#DCE3D5] sticky top-16 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-8">
            <button
              type="button"
              aria-pressed={activeTab === 'weekly'}
              onClick={() => setActiveTab('weekly')}
              className={`h-14 px-2 font-medium text-[15px] border-b-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2F5233] cursor-pointer ${
                activeTab === 'weekly' 
                  ? 'border-[#2F5233] text-[#2F5233]' 
                  : 'border-transparent text-[#6B6F63] hover:text-[#2F5233]'
              }`}
            >
              Weekly Menu
            </button>
            <button
              type="button"
              aria-pressed={activeTab === 'wellness'}
              onClick={() => setActiveTab('wellness')}
              className={`h-14 px-2 font-medium text-[15px] border-b-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2F5233] cursor-pointer ${
                activeTab === 'wellness' 
                  ? 'border-[#2F5233] text-[#2F5233]' 
                  : 'border-transparent text-[#6B6F63] hover:text-[#2F5233]'
              }`}
            >
              Health & Wellness
            </button>
          </div>
        </div>
      </div>

      <main hidden={activeTab !== 'weekly'} className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <MealPlanBillingPanel access={mealPlanAccess} onAccessChange={setMealPlanAccess} />
        <WeeklyMealPlanner
          access={mealPlanAccess}
          onAccessChange={setMealPlanAccess}
          onEditProfile={() => setActiveTab('wellness')}
        />
      </main>

      {activeTab === 'wellness' && <HealthAndWellness isComponent={true} />}

      <AIChatbot />
      <Footer />
    </div>
  );
}

export default WeeklyMenu;
