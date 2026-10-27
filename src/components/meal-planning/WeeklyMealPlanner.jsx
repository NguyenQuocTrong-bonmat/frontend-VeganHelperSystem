import React, { useEffect, useRef, useState } from 'react';
import { generateMealPlan, getMealPlan, listMealPlans } from '../../services/mealPlanService';
import { getMealPlanAccess } from '../../services/mealPlanPaymentService';
import PlanSetupFlow from './PlanSetupFlow';
import MenuJourney from './MenuJourney';
import CalendarCreationProgress from './CalendarCreationProgress';
import WeeklyCalendar from './WeeklyCalendar';

import MealRoutinePanel from './MealRoutinePanel';
import PlannerIcon from './PlannerIcon';
import plannerInspiration from '../../assets/images/hero/hero-vietnamese-vegan-spring-rolls.webp';
import { dietLabel, number, rangeLabel } from './plannerFormat';
import './weekly-menu.css';

export default function WeeklyMealPlanner({ onEditProfile, profileRevision, access, onAccessChange }) {
  const [pageIndex, setPageIndex] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [saved, setSaved] = useState({ items: [], totalPages: 0 });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [creation, setCreation] = useState(null);
  const [listError, setListError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [setupOpen, setSetupOpen] = useState(false);
  const submitting = useRef(false);
  const detailRequest = useRef(null);
  const mounted = useRef(true);
  const createButton = useRef(null);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; detailRequest.current?.abort(); };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setListError('');

    if (access === undefined) return () => controller.abort();

    if (access && !access.canViewExistingPlans && !access.canViewTrialPlans) {
      setSaved({ items: [], totalPages: 0 });
      setPlan(null);
      setLoading(false);
      return () => controller.abort();
    }

    listMealPlans(pageIndex, controller.signal).then(data => {
      if (controller.signal.aborted) return;
      setSaved(data);
      setPlan(current => current ?? data.items[0] ?? null);
    }).catch(failure => {
      if (!controller.signal.aborted) setListError(failure.message);
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [access, pageIndex, refresh]);

  async function openPlan(id) {
    detailRequest.current?.abort();
    const controller = new AbortController();
    detailRequest.current = controller;
    setOpening(true); setError(''); setSuccess('');
    try {
      const result = await getMealPlan(id, controller.signal);
      if (!controller.signal.aborted) { setPlan(result); }
    } catch (failure) {
      if (!controller.signal.aborted) setError(failure.message);
    } finally {
      if (!controller.signal.aborted) setOpening(false);
    }
  }

  async function generate(selectedStartDate) {
    if (submitting.current || opening) return;
    if (access?.canGenerate === false) {
      setError('Your free meal-plan generations have been used. Choose a package above to create more plans.');
      return;
    }
    const { clientPreview, ...request } = typeof selectedStartDate === 'string'
      ? { startDate: selectedStartDate }
      : selectedStartDate;
    submitting.current = true;
    setGenerating(true); setError(''); setSuccess('');
    setSetupOpen(false);
    setCreation({ phase: 'tdee', preview: clientPreview });
    try {
      const apiResult = generateMealPlan(request).then(result => ({ result }), failure => ({ failure }));
      const surfaceApiFailure = () => apiResult.then(outcome => outcome.failure
        ? Promise.reject(outcome.failure)
        : new Promise(() => {}));
      const waitForPhase = async (phase, duration) => {
        if (mounted.current) setCreation({ phase, preview: clientPreview });
        await Promise.race([new Promise(resolve => setTimeout(resolve, duration)), surfaceApiFailure()]);
      };

      await waitForPhase('tdee', 3000);
      await waitForPhase('split', 3000);
      await waitForPhase('waiting', 5000);
      const outcome = await apiResult;
      if (outcome.failure) throw outcome.failure;
      const result = outcome.result;
      if (!mounted.current) return;

      const totalMeals = (result.menu?.days || []).reduce((total, day) => total + (day.meals?.length || 0), 0);
      if (totalMeals > 0) {
        setCreation({ phase: 'revealing', preview: clientPreview, pendingPlan: result, visibleMealCount: 1 });
        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        for (let visibleMealCount = 2; visibleMealCount <= totalMeals; visibleMealCount += 1) {
          if (!reduceMotion) await new Promise(resolve => setTimeout(resolve, 500));
          if (!mounted.current) return;
          setCreation({ phase: 'revealing', preview: clientPreview, pendingPlan: result, visibleMealCount });
        }
      }
      setPlan(result);
      setSuccess('Your weekly menu has been created and saved.');
      setCreation(null);
      setPageIndex(1); setRefresh(value => value + 1);
      getMealPlanAccess().then(nextAccess => {
        if (typeof nextAccess?.canGenerate === 'boolean') onAccessChange?.(nextAccess);
      }).catch(() => {});
    } catch (failure) {
      if (mounted.current) { setCreation(null); setSetupOpen(true); setError(failure.message); }
      if (failure.status === 402 || failure.code === 'MEAL_PLAN_TRIAL_LIMIT_REACHED') {
        getMealPlanAccess().then(nextAccess => {
          if (typeof nextAccess?.canGenerate === 'boolean') onAccessChange?.(nextAccess);
        }).catch(() => {});
      }
    } finally {
      submitting.current = false;
      if (mounted.current) setGenerating(false);
    }
  }

  const busy = generating || opening;
  const choices = plan && !saved.items.some(item => item.id === plan.id) ? [plan, ...saved.items] : saved.items;
  const menu = plan?.menu;
  function cancelSetup() { setSetupOpen(false); setError(''); createButton.current?.focus(); }

  return <div className="wm-workspace">
    <div className="wm-workspace-toolbar">
      <div><h2>A good week starts here.</h2></div>
      <button type="button" ref={createButton} className="wm-button wm-button-primary" disabled={busy || loading || access?.canGenerate === false} onClick={() => { setSetupOpen(true); setError(''); setSuccess(''); }}><PlannerIcon name="plus" />New weekly menu</button>
    </div>
    <p role="status" className={generating || opening || success ? 'wm-status' : 'sr-only'}>{generating ? 'Creating and saving your weekly menu. Please wait…' : opening ? 'Opening saved menu…' : success}</p>
    {access?.canGenerate === false && <p role="status" className="wm-notice">Your 3 free weekly-menu generations have been used. Choose a package above to create another meal plan.</p>}
    {access && !access.canViewExistingPlans && !access.canViewTrialPlans && <p className="wm-notice">No saved meal plans are available to view yet. Create a plan with your free trial or activate a package to unlock saved plans.</p>}
    <div className="wm-workspace-grid">
      <aside className="wm-sidebar" aria-label="Plan overview and saved menus">
        <section className="wm-plan-summary">
          <div className="wm-summary-image"><img src={plannerInspiration} alt="" /><span>Plant-based inspiration</span></div>
          <div className="wm-summary-copy"><h2>Your week,<br />thoughtfully planned.</h2><p>Plant-based meals, planned around you.</p></div>
          {menu ? <><div className="wm-summary-target"><span>Daily calorie target</span><strong>{number(menu.targetDailyCalories)}<small>kcal</small></strong><span>{menu.goal === 'weight_goal' ? 'Estimated weight goal calories' : 'Estimated maintenance calories'}</span></div><div className="wm-summary-diet"><PlannerIcon name="leaf" />{dietLabel(menu.dietType)}</div><dl className="wm-summary-facts"><div><dt>Duration</dt><dd>{menu.days?.length ?? '—'} days</dd></div><div><dt>Scheduled meals</dt><dd>{menu.days?.reduce((count, day) => count + (day.meals?.length || 0), 0) ?? '—'}</dd></div></dl></> : <p className="wm-summary-first">Your menu overview will appear here once you have a saved plan.</p>}
        </section>
        <section className="wm-saved-plans" aria-labelledby="saved-menu-heading">
          <div className="wm-section-heading"><h3 id="saved-menu-heading">Your saved plans</h3><button type="button" className="wm-icon-button" aria-label="Reload saved plans" disabled={busy || loading} onClick={() => setRefresh(value => value + 1)}><PlannerIcon name="refresh" /></button></div>
          <label className="wm-field-label" htmlFor="saved-meal-plan">Choose a week</label>
          <select id="saved-meal-plan" value={plan?.id ?? ''} onChange={event => openPlan(event.target.value)} disabled={busy || loading || !choices.length} className="wm-control">
            {!plan && <option value="">No saved menus yet</option>}{choices.map(item => <option key={item.id} value={item.id}>{rangeLabel(item)} · #{item.id}</option>)}
          </select>
          {listError ? <div role="alert" className="wm-inline-error"><p>{listError}</p><button type="button" className="wm-text-button" onClick={() => setRefresh(value => value + 1)}>Retry</button></div> : loading ? <p role="status" className="wm-muted">Loading saved plans…</p> : <p className="wm-saved-help">Every menu keeps the profile and allergies used when it was created.</p>}
          {saved.totalPages > 1 && <div className="wm-pagination"><button type="button" className="wm-icon-button" aria-label="Previous plans" disabled={busy || loading || pageIndex <= 1} onClick={() => setPageIndex(value => value - 1)}><PlannerIcon name="chevron" className="wm-reverse" /></button><span>{pageIndex} / {saved.totalPages}</span><button type="button" className="wm-icon-button" aria-label="Next plans" disabled={busy || loading || pageIndex >= saved.totalPages} onClick={() => setPageIndex(value => value + 1)}><PlannerIcon name="chevron" /></button></div>}
        </section>
        <section className="wm-profile-link"><PlannerIcon name="leaf" /><h3>Good plans start with you.</h3><p>Keep your health profile, diet and allergies up to date before creating a menu.</p><button type="button" className="wm-text-button" onClick={onEditProfile}>Review health profile <PlannerIcon name="arrow" /></button></section>
      </aside>
      <div className="wm-main-column">
        {setupOpen && <PlanSetupFlow profileRevision={profileRevision} busy={generating} error={error} onGenerate={generate} onCancel={cancelSetup} onEditProfile={onEditProfile} />}
        {!setupOpen && error && <div role="alert" className="wm-alert">{error}</div>}
        {creation && <CalendarCreationProgress phase={creation.phase} preview={creation.preview} pendingPlan={creation.pendingPlan} visibleMealCount={creation.visibleMealCount} />}
        {!creation && loading && !plan && !listError && <div role="status" className="wm-loading"><PlannerIcon name="calendar" /><p>Making room for your week…</p><div className="wm-skeleton-calendar" aria-hidden="true">{Array.from({ length: 7 }, (_, index) => <span key={index} />)}</div></div>}
        {!creation && !plan && !loading && !listError && !setupOpen && <section className="wm-empty"><span className="wm-empty-art"><PlannerIcon name="bowl" /><PlannerIcon name="leaf" /></span><span className="wm-eyebrow">A fresh start, every week</span><h2>Your next week starts here.</h2><p>Less time wondering what to eat.<br />More time enjoying what is on your plate.</p><button type="button" className="wm-button wm-button-primary" disabled={access?.canGenerate === false} onClick={() => setSetupOpen(true)}>Create your first menu <PlannerIcon name="arrow" /></button><span className="wm-empty-caption">7 days · 3 meals a day · Made for your preferences</span></section>}
        {!creation && plan && !menu && <div className="wm-notice"><PlannerIcon name="info" /><p>This older plan has no saved menu snapshot. Create a new weekly menu to see its meals and ingredients.</p></div>}
        {!creation && menu && <>
          <div className="wm-menu-context"><span><PlannerIcon name="leaf" />{dietLabel(menu.dietType)}</span><span className="wm-mobile-calorie">Daily target <strong>{number(menu.targetDailyCalories)} kcal</strong></span><span>BMI at creation <strong>{number(menu.bmi)}</strong></span><span>Allergies used <strong>{menu.allergies?.length ? menu.allergies.join(', ') : 'None declared'}</strong></span></div>
          <WeeklyCalendar key={`calendar-${plan.id}`} plan={plan} opening={opening} onRoutineChanged={routine=>setPlan(current=>current?.id === plan.id ? {...current,routine} : current)} />
          <MenuJourney menu={menu} />
          {plan.routine?.mode === 'weight_goal' && <MealRoutinePanel key={`routine-${plan.id}`} plan={plan} profileRevision={profileRevision} onPlanChanged={updated=>{setPlan(updated);setRefresh(value=>value+1);}} onEditProfile={onEditProfile} />}
          <details className="wm-menu-notes"><summary><PlannerIcon name="info" />About this menu and its estimates</summary><div><p>Calorie targets are estimates. This menu does not guarantee weight change or nutritional adequacy. Check ingredients and product labels for allergens.</p>{menu.mealCalorieSplit && <p>Daily calorie split: breakfast {menu.mealCalorieSplit.breakfastPercent}%, lunch {menu.mealCalorieSplit.lunchPercent}%, dinner {menu.mealCalorieSplit.dinnerPercent}%. These shares divide the daily target and do not change it.</p>}{menu.notes?.map((note, index) => <p key={index}>{note}</p>)}</div></details>
        </>}
        {plan?.routine?.mode === 'maintenance' && <p className="wm-notice">This balanced plan is for viewing your menu. Create a weight goal plan to use tracking and reminders.</p>}
      </div>
    </div>
  </div>;
}
