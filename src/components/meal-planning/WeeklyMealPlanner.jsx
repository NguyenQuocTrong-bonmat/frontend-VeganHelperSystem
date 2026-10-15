import React, { useEffect, useRef, useState } from 'react';
import { generateMealPlan, getMealPlan, listMealPlans } from '../../services/mealPlanService';

const number = value => Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 });
const dateLabel = value => value ? new Date(`${value}T00:00:00Z`).toLocaleDateString('en-GB', {
  day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC',
}) : 'Unknown date';
const rangeLabel = plan => `${dateLabel(plan.startDate)} – ${dateLabel(plan.endDate)} · #${plan.id}`;
const control = 'rounded-lg border border-[#DCE3D5] bg-white px-3 py-2.5 text-[#2B2A25] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5233] disabled:opacity-50';
const utcToday = () => new Date().toISOString().slice(0, 10);

export default function WeeklyMealPlanner({ onEditProfile }) {
  const [startDate, setStartDate] = useState(utcToday);
  const [pageIndex, setPageIndex] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [saved, setSaved] = useState({ items: [], totalPages: 0 });
  const [plan, setPlan] = useState(null);
  const [dayIndex, setDayIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [listError, setListError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const submitting = useRef(false);
  const detailRequest = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; detailRequest.current?.abort(); };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setListError('');
    listMealPlans(pageIndex, controller.signal).then(data => {
      if (controller.signal.aborted) return;
      setSaved(data);
      setPlan(current => current ?? data.items[0] ?? null);
    }).catch(failure => {
      if (!controller.signal.aborted) setListError(failure.message);
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [pageIndex, refresh]);

  async function openPlan(id) {
    detailRequest.current?.abort();
    const controller = new AbortController();
    detailRequest.current = controller;
    setOpening(true); setError(''); setSuccess('');
    try {
      const result = await getMealPlan(id, controller.signal);
      if (!controller.signal.aborted) { setPlan(result); setDayIndex(1); }
    } catch (failure) {
      if (!controller.signal.aborted) setError(failure.message);
    } finally {
      if (!controller.signal.aborted) setOpening(false);
    }
  }

  async function generate(event) {
    event.preventDefault();
    if (submitting.current || opening) return;
    submitting.current = true;
    setGenerating(true); setError(''); setSuccess('');
    try {
      const result = await generateMealPlan(startDate);
      if (!mounted.current) return;
      setPlan(result); setDayIndex(1);
      setSuccess('Your weekly menu has been created and saved.');
      setPageIndex(1); setRefresh(value => value + 1);
    } catch (failure) {
      if (mounted.current) setError(failure.message);
    } finally {
      submitting.current = false;
      if (mounted.current) setGenerating(false);
    }
  }

  const busy = generating || opening;
  const selectedDay = plan?.menu?.days?.find(day => day.dayIndex === dayIndex);
  const choices = plan && !saved.items.some(item => item.id === plan.id) ? [plan, ...saved.items] : saved.items;
  const today = utcToday();
  const nextYear = new Date(`${today}T00:00:00Z`);
  const month = nextYear.getUTCMonth();
  nextYear.setUTCFullYear(nextYear.getUTCFullYear() + 1);
  if (nextYear.getUTCMonth() !== month) nextYear.setUTCDate(0);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-[#DCE3D5] bg-white p-5 sm:p-7 space-y-5" aria-labelledby="create-menu-heading">
        <div>
          <h2 id="create-menu-heading" className="font-fraunces text-2xl font-semibold text-[#2B2A25]">Plan your week</h2>
          <p className="mt-2 text-sm text-[#6B6F63]">Seven days, three meals a day, one dish per meal. Uses your saved health profile, diet and allergies to estimate maintenance calories.</p>
          <button type="button" onClick={onEditProfile} className="mt-2 text-sm font-semibold text-[#2F5233] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2F5233]">Review health profile & allergies</button>
        </div>
        <form onSubmit={generate} className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="meal-plan-start" className="text-sm font-medium text-[#2B2A25]">Start date</label>
            <input id="meal-plan-start" type="date" value={startDate} onChange={event => setStartDate(event.target.value)} min={today} max={nextYear.toISOString().slice(0, 10)} required disabled={busy} className={control} aria-describedby="generation-help" />
          </div>
          <button type="submit" disabled={busy || loading} className="rounded-lg border border-[#2F5233] bg-[#2F5233] px-4 py-2.5 text-white font-semibold hover:bg-[#244229] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5233] disabled:opacity-50 disabled:cursor-wait">
            {generating ? 'Creating your menu…' : 'Create weekly menu'}
          </button>
        </form>
        <p id="generation-help" className="text-xs text-[#6B6F63]">Dates use UTC. Each creation saves a separate plan. Save profile and allergy changes before creating a new menu; existing plans keep their original information. Generation requires a complete profile for an adult aged 20–120 and a supported male/female energy calculation.</p>
        {error && <div role="alert" className="rounded-lg border border-[#A63446]/30 bg-[#FFF5F5] p-4 text-sm text-[#A63446]">{error}</div>}
        <p role="status" className="text-sm text-[#2F5233]">{generating ? 'Creating and saving your weekly menu. Please wait…' : opening ? 'Opening saved menu…' : success}</p>
      </section>

      <section aria-label="Saved meal plans" className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1 min-w-0 space-y-2">
            <label htmlFor="saved-meal-plan" className="block text-sm font-semibold text-[#2B2A25]">Saved plans</label>
            <select id="saved-meal-plan" value={plan?.id ?? ''} onChange={event => openPlan(event.target.value)} disabled={busy || loading || !choices.length} className={`${control} w-full`}>
              {!plan && <option value="">Choose a saved plan</option>}
              {choices.map(item => <option key={item.id} value={item.id}>{rangeLabel(item)}</option>)}
            </select>
          </div>
          <button type="button" disabled={busy || loading} onClick={() => setRefresh(value => value + 1)} className={control}>Reload saved plans</button>
        </div>
        {listError ? <div role="alert" className="text-sm text-[#A63446]">{listError} <button type="button" onClick={() => setRefresh(value => value + 1)} className="underline font-semibold">Retry</button></div>
          : loading ? <p role="status" className="text-sm text-[#6B6F63]">Loading saved plans…</p> : null}
        {saved.totalPages > 1 && <div className="flex flex-wrap items-center gap-3 text-sm text-[#6B6F63]">
          <button type="button" className={control} disabled={busy || loading || pageIndex <= 1} onClick={() => setPageIndex(value => value - 1)}>Previous</button>
          <span>Page {pageIndex} of {saved.totalPages}</span>
          <button type="button" className={control} disabled={busy || loading || pageIndex >= saved.totalPages} onClick={() => setPageIndex(value => value + 1)}>Next</button>
        </div>}
      </section>

      {!plan && !loading && !listError && <div className="rounded-2xl border border-[#DCE3D5] bg-white p-8 text-center">
        <h2 className="font-fraunces text-2xl text-[#2B2A25]">No weekly menu available.</h2>
        <p className="mt-2 text-[#6B6F63]">Review your health profile and allergies, then choose a start date to create your first menu.</p>
      </div>}
      {plan && !plan.menu && <p className="rounded-xl border border-[#DCE3D5] bg-white p-5 text-[#6B6F63]">This older plan has no saved menu snapshot. Create a new weekly menu to see its meals and ingredients.</p>}
      {plan?.menu && <section aria-label="Weekly menu details" className="space-y-6" aria-busy={opening}>
        <div className="space-y-2 text-sm text-[#6B6F63]">
          <h2 className="font-fraunces text-2xl text-[#2B2A25]">{rangeLabel(plan)}</h2>
          <p>{plan.menu.dietType === 'vegan' ? 'Vegan' : 'Lacto-ovo vegetarian'} · Target {number(plan.menu.targetDailyCalories)} kcal/day · BMI {number(plan.menu.bmi)}</p>
          <p>Allergies used: {plan.menu.allergies?.length ? plan.menu.allergies.join(', ') : 'None declared'}</p>
        </div>
        <nav aria-label="Meal plan days" className="flex overflow-x-auto border-b border-[#DCE3D5] gap-5">
          {plan.menu.days.map(day => <button type="button" key={day.dayIndex} aria-current={dayIndex === day.dayIndex ? 'date' : undefined} onClick={() => setDayIndex(day.dayIndex)} className={`shrink-0 border-b-2 pb-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2F5233] ${dayIndex === day.dayIndex ? 'font-semibold text-[#2F5233] border-[#2F5233]' : 'text-[#6B6F63] border-transparent'}`}>
            <span className="block">{new Date(`${day.date}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })}</span>
            <span className="block text-xs mt-1">{dateLabel(day.date)}</span>
          </button>)}
        </nav>
        {selectedDay && <div aria-live="polite" className="space-y-4">
          <p className="text-sm text-[#6B6F63]">{dateLabel(selectedDay.date)} · Total {number(selectedDay.totalCalories)} kcal</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {selectedDay.meals.map(meal => <article key={meal.mealTime} className="min-w-0 rounded-2xl border border-[#DCE3D5] bg-white p-5 break-words">
              <h3 className="text-sm font-semibold capitalize text-[#2F5233]">{meal.mealTime}</h3>
              <h4 className="font-fraunces text-xl text-[#2B2A25] mt-3">{meal.name}</h4>
              <p className="text-sm text-[#6B6F63] mt-2">{number(meal.calories)} kcal · {number(meal.portionMultiplier)}× standard serving</p>
              <p className="text-sm font-semibold text-[#2B2A25] mt-5 mb-2">Ingredients for this portion</p>
              <ul className="space-y-2 text-sm text-[#6B6F63]">
                {meal.ingredients.map(ingredient => <li key={ingredient.ingredientId}>{ingredient.name} — {Number(ingredient.quantity).toLocaleString('en-US', { maximumFractionDigits: 3 })} {ingredient.unit}</li>)}
              </ul>
            </article>)}
          </div>
        </div>}
        <div className="rounded-xl border border-[#DCE3D5] p-5 text-sm text-[#6B6F63] space-y-2">
          <p>Calories are estimates for weight maintenance. This menu is not a weight-loss treatment or a guarantee of nutritional adequacy. Check ingredients and product labels for allergens.</p>
          {plan.menu.notes?.map((note, index) => <p key={index}>{note}</p>)}
        </div>
      </section>}
    </div>
  );
}
