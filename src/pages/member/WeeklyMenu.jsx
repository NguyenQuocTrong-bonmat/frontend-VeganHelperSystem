import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import AIChatbot from '../../components/chat/AIChatbot';
import HealthAndWellness from './HealthAndWellness';
import WeeklyMealPlanner from '../../components/meal-planning/WeeklyMealPlanner';
import PlannerIcon from '../../components/meal-planning/PlannerIcon';
import weeklyMenuImage from '../../assets/images/hero/hero-vietnamese-vegan-pho.webp';
import { getMealPlanAccess } from '../../services/mealPlanPaymentService';
import { formatDate } from '../../utils/dateUtils';

function WeeklyMenu() {
  const [activeTab, setActiveTab] = useState('weekly');
  const [mealPlanAccess, setMealPlanAccess] = useState(undefined);
  const [profileRevision, setProfileRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getMealPlanAccess(controller.signal)
      .then(accessData => {
        setMealPlanAccess(accessData);
      })
      .catch(() => {
        // Fallback so WeeklyMealPlanner is not blocked if access request fails
        setMealPlanAccess(null);
      });
    return () => controller.abort();
  }, []);

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
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:ring-offset-2 active:scale-[0.99] motion-reduce:transform-none"
            onKeyDown={event => { if (['ArrowLeft', 'ArrowRight', 'End'].includes(event.key)) { event.preventDefault(); setActiveTab('wellness'); document.getElementById('wellness-tab')?.focus(); } }}
            onClick={() => setActiveTab('weekly')}
          >
            <PlannerIcon name="calendar" />Weekly Menu
          </button>
          <button
            type="button"
            id="wellness-tab" role="tab" aria-selected={activeTab === 'wellness'} aria-controls="wellness-panel" tabIndex={activeTab === 'wellness' ? 0 : -1}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:ring-offset-2 active:scale-[0.99] motion-reduce:transform-none"
            onKeyDown={event => { if (['ArrowLeft', 'ArrowRight', 'Home'].includes(event.key)) { event.preventDefault(); setActiveTab('weekly'); document.getElementById('weekly-menu-tab')?.focus(); } }}
            onClick={() => setActiveTab('wellness')}
          >
            <PlannerIcon name="leaf" />Health & Wellness
          </button>
        </div>
      </div>

      <main id="weekly-menu-panel" role="tabpanel" aria-labelledby="weekly-menu-tab" hidden={activeTab !== 'weekly'} className="wm-page-main flex-grow">
        {/* PAYMENT / MEMBERSHIP CTA BANNER */}
        <div className="wm-upgrade-cta-banner" role="region" aria-label="Meal plan membership">
          <div className="wm-upgrade-cta-copy">
            <span className="wm-upgrade-cta-tag">
              <PlannerIcon name="leaf" />
              Meal Plan Access
            </span>
            <p className="wm-upgrade-cta-message">
              {mealPlanAccess?.status === 'active'
                ? `Your access is active${mealPlanAccess.expiresAt ? ` until ${formatDate(mealPlanAccess.expiresAt)}` : ''}. Need to extend?`
                : ['grace_period', 'expired'].includes(mealPlanAccess?.status)
                  ? 'Your package has expired. Finish your current week and renew to create the next one.'
                : mealPlanAccess?.canGenerate
                  ? `${mealPlanAccess.trialGenerationsRemaining ?? 3} free generation${mealPlanAccess.trialGenerationsRemaining === 1 ? '' : 's'} remaining.`
                  : 'Your free generations have been used. Upgrade to continue planning.'}
            </p>
          </div>
          <Link
            to="/meal-plans/payment"
            className="wm-upgrade-cta-action"
            aria-label="Upgrade meal plan access"
          >
            <span>Upgrade Access</span>
            <PlannerIcon name="arrow" />
          </Link>
        </div>

        <WeeklyMealPlanner onHealthProfileChanged={() => setProfileRevision(value => value + 1)} access={mealPlanAccess} onAccessChange={setMealPlanAccess} profileRevision={profileRevision} onEditProfile={() => { setActiveTab('wellness'); document.getElementById('wellness-tab')?.focus(); }} />
      </main>

      <div id="wellness-panel" role="tabpanel" aria-labelledby="wellness-tab" hidden={activeTab !== 'wellness'}>{activeTab === 'wellness' && <HealthAndWellness isComponent={true} onProfileUpdated={() => setProfileRevision(value => value + 1)} />}</div>

      <AIChatbot />
      <Footer />
    </div>
  );
}

export default WeeklyMenu;
