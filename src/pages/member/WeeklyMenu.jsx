import React, { useState } from 'react';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import AIChatbot from '../../components/chat/AIChatbot';
import HealthAndWellness from './HealthAndWellness';
import WeeklyMealPlanner from '../../components/meal-planning/WeeklyMealPlanner';
import PlannerIcon from '../../components/meal-planning/PlannerIcon';
import weeklyMenuImage from '../../assets/images/hero/hero-vietnamese-vegan-pho.webp';

function WeeklyMenu() {
  const [activeTab, setActiveTab] = useState('weekly');
  const [profileRevision, setProfileRevision] = useState(0);
  return (
    <div className="wm-page min-h-screen flex flex-col">
      <HeaderMember />
      
      {/* PAGE HEADER */}
      <div className="wm-page-header">
        <img className="wm-header-backdrop" src={weeklyMenuImage} alt="" aria-hidden="true" />
        <div className="wm-header-copy">
          <span className="wm-page-badge"><PlannerIcon name="bowl" />A little variety on your plate</span>
          <h1>Weekly Menu</h1>
          <p>A week of plant-based meals, with a little more intention and a little less effort.</p>
          <span className="wm-header-signature"><PlannerIcon name="leaf" />Made for your everyday</span>
        </div>
      </div>

      {/* TABS NAVIGATION — Unified 2-Tab Navigation */}
      <div className="wm-page-tabs">
        <div role="tablist" aria-label="Meal planning and health">
            <button
              type="button"
              id="weekly-menu-tab" role="tab" aria-selected={activeTab === 'weekly'} aria-controls="weekly-menu-panel" tabIndex={activeTab === 'weekly' ? 0 : -1}
              onKeyDown={event => { if (['ArrowLeft', 'ArrowRight', 'End'].includes(event.key)) { event.preventDefault(); setActiveTab('wellness'); document.getElementById('wellness-tab')?.focus(); } }}
              onClick={() => setActiveTab('weekly')}
            >
              <PlannerIcon name="calendar" />Weekly Menu
            </button>
            <button
              type="button"
              id="wellness-tab" role="tab" aria-selected={activeTab === 'wellness'} aria-controls="wellness-panel" tabIndex={activeTab === 'wellness' ? 0 : -1}
              onKeyDown={event => { if (['ArrowLeft', 'ArrowRight', 'Home'].includes(event.key)) { event.preventDefault(); setActiveTab('weekly'); document.getElementById('weekly-menu-tab')?.focus(); } }}
              onClick={() => setActiveTab('wellness')}
            >
              <PlannerIcon name="leaf" />Health & Wellness
            </button>
        </div>
      </div>

      <main id="weekly-menu-panel" role="tabpanel" aria-labelledby="weekly-menu-tab" hidden={activeTab !== 'weekly'} className="wm-page-main flex-grow">
        
        <WeeklyMealPlanner profileRevision={profileRevision} onEditProfile={() => { setActiveTab('wellness'); document.getElementById('wellness-tab')?.focus(); }} />
      </main>

      <div id="wellness-panel" role="tabpanel" aria-labelledby="wellness-tab" hidden={activeTab !== 'wellness'}>{activeTab === 'wellness' && <HealthAndWellness isComponent={true} onProfileUpdated={() => setProfileRevision(value => value + 1)} />}</div>

      <AIChatbot />
      <Footer />
    </div>
  );
}

export default WeeklyMenu;
