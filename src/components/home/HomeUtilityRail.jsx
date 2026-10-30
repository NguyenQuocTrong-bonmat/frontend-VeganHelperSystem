import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listMealPlans } from '../../services/mealPlanService';
import { dietLabel, number, rangeLabel } from '../meal-planning/plannerFormat';

export default function HomeUtilityRail({ 
  isGuest = false,
  categories = [],
  selectedCategoryId = null,
  onSelectCategory
}) {
  const weeklyMenuRoute = isGuest ? '/weekly-menu/locked' : '/weekly-menu';
  const [latestPlan, setLatestPlan] = useState(undefined);

  useEffect(() => {
    if (isGuest) {
      setLatestPlan(null);
      return undefined;
    }

    const controller = new AbortController();
    listMealPlans(1, controller.signal)
      .then((data) => setLatestPlan(data?.items?.[0] ?? null))
      .catch((error) => {
        if (error?.code !== 'ERR_CANCELED') setLatestPlan(null);
      });
    return () => controller.abort();
  }, [isGuest]);

  const tracking = useMemo(() => {
    const entries = latestPlan?.routine?.entries ?? [];
    return {
      followed: entries.filter((entry) => entry.status === 'followed').length,
      total: entries.length,
    };
  }, [latestPlan]);

  return (
    <aside
      aria-label="Community Utilities"
      className="hidden 2xl:block 2xl:w-[300px] shrink-0 space-y-5 select-none text-left sticky top-20 max-h-[calc(100vh-5.5rem)] overflow-y-auto overscroll-contain pl-1 pb-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-vh-border/60 [&::-webkit-scrollbar-thumb]:rounded-full"
    >
      {/* 1. Contextual weekly meal-plan summary */}
      <section className="overflow-hidden rounded-card border border-vh-border/70 bg-vh-surface shadow-sm" aria-labelledby="weekly-plan-summary-heading">
        <div className="relative bg-vh-forest px-5 py-5 text-white">
          <div aria-hidden="true" className="absolute -right-8 -top-10 h-28 w-28 rounded-full border-[18px] border-white/10" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 font-dm-sans text-[11px] font-semibold text-white/90">
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7H5v12a2 2 0 002 2z" />
              </svg>
              Nutrition Tool
            </span>
            <h2 id="weekly-plan-summary-heading" className="mt-4 font-dm-serif text-2xl leading-tight">
              {latestPlan ? 'Your week is ready.' : 'Make the week feel easier.'}
            </h2>
            <p className="mt-2 font-dm-sans text-xs leading-5 text-white/75">
              {latestPlan ? rangeLabel(latestPlan) : 'Build seven days of plant-based meals around your health profile.'}
            </p>
          </div>
        </div>

        <div className="space-y-4 p-5">
          {latestPlan === undefined ? (
            <div className="space-y-2" aria-label="Loading weekly menu summary" aria-busy="true">
              <span className="block h-4 w-3/4 animate-pulse rounded bg-vh-mint" />
              <span className="block h-4 w-1/2 animate-pulse rounded bg-vh-mint" />
            </div>
          ) : latestPlan ? (
            <>
              <dl className="grid grid-cols-2 gap-3 font-dm-sans">
                <div>
                  <dt className="text-[10px] uppercase tracking-wide text-vh-text-secondary">Diet</dt>
                  <dd className="mt-1 text-xs font-semibold text-vh-text-primary">{dietLabel(latestPlan.menu?.dietType ?? latestPlan.dietType)}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-wide text-vh-text-secondary">Daily target</dt>
                  <dd className="mt-1 text-xs font-semibold text-vh-text-primary">{latestPlan.menu?.targetDailyCalories ? `${number(latestPlan.menu.targetDailyCalories)} kcal` : 'Balanced'}</dd>
                </div>
              </dl>
              {tracking.total > 0 && (
                <div>
                  <div className="mb-2 flex items-center justify-between font-dm-sans text-xs">
                    <span className="text-vh-text-secondary">Meals followed</span>
                    <strong className="text-vh-text-primary">{tracking.followed}/{tracking.total}</strong>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-vh-mint" aria-label={`${tracking.followed} of ${tracking.total} meals followed`} role="img">
                    <span className="block h-full rounded-full bg-vh-success" style={{ width: `${Math.round((tracking.followed / tracking.total) * 100)}%` }} />
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="font-dm-sans text-xs leading-5 text-vh-text-secondary">
              {isGuest ? 'Sign in to create a menu shaped around your dietary preferences.' : 'Create your first menu with 21 meals, allergies and a daily calorie target.'}
            </p>
          )}

          <Link
            to={weeklyMenuRoute}
            className="inline-flex w-full items-center justify-between rounded-xl border border-vh-forest px-4 py-3 font-dm-sans text-xs font-semibold text-vh-forest transition-colors hover:bg-vh-mint/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest"
          >
            <span>{latestPlan ? 'View this week' : isGuest ? 'Explore Weekly Planner' : 'Create a weekly menu'}</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* 2. Popular Food Categories */}
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

      {/* 3. Footer Note */}
      <div className="px-3 text-[11px] font-dm-sans text-vh-text-secondary/70 leading-normal">
        <p>VeganHelper &copy; 2026</p>
        <p className="mt-0.5">Empowering Vietnamese plant-based living with authentic recipes & community insights.</p>
      </div>
    </aside>
  );
}
