import React, { useEffect, useRef, useState } from 'react';
import PlannerIcon from './PlannerIcon';
import { dateLabel, number, zonedToday, weekday } from './plannerFormat';
import { getMealPlan, logMeal } from '../../services/mealPlanService';
import MealTrackingControl from './MealTrackingControl';

const mealIcons = { breakfast: 'sun', lunch: 'bowl', dinner: 'moon' };

function MealVisual({ meal, compact = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [meal.imageUrl]);
  const imageUrl = typeof meal.imageUrl === 'string' && /^(https?:\/\/|\/(?!\/))/.test(meal.imageUrl) ? meal.imageUrl : null;
  return <div className={`wm-meal-visual wm-meal-visual-${meal.mealTime} ${compact ? 'is-compact' : ''}`}>
    {imageUrl && !failed ? <img src={imageUrl} alt={meal.name} loading="lazy" onError={() => setFailed(true)} /> : <><span className="wm-plate"><PlannerIcon name={mealIcons[meal.mealTime] || 'bowl'} /></span><span className="wm-photo-label">Photo not available</span></>}
  </div>;
}

function MealCard({ meal, compact, onOpen, tracking }) {
  const ingredients = meal.ingredients || [];
  return <article className={`wm-calendar-meal ${tracking ? 'has-tracking' : ''}`}><button type="button" className={`wm-meal-card wm-meal-card-${meal.mealTime} ${compact ? 'is-compact' : ''}`} onClick={event => onOpen(meal, event.currentTarget)}>
    {!compact && <MealVisual meal={meal} />}
    <span className="wm-meal-card-body">
      <span className="wm-meal-overline"><span className="wm-meal-label"><PlannerIcon name={mealIcons[meal.mealTime] || 'bowl'} />{meal.mealTime}</span><span className="wm-meal-arrow"><PlannerIcon name="arrow" /></span></span>
      <strong>{meal.name}</strong>
      {!compact && ingredients.length > 0 && <span className="wm-meal-ingredient-preview">{ingredients.slice(0, 3).map((ingredient, index) => <span key={ingredient.ingredientId ?? index}>{ingredient.name}</span>)}{ingredients.length > 3 && <span>+{ingredients.length - 3} more</span>}</span>}
      <span className="wm-meal-meta"><span className="wm-calorie-value">{number(meal.calories)} <small>kcal</small></span>{!compact && <span>{number(meal.portionMultiplier)}× serving</span>}</span>
      <span className="wm-meal-open">View recipe <PlannerIcon name="arrow" /></span>
    </span>
  </button>{tracking}</article>;
}

function MealDetailPanel({ meal, onClose }) {
  const heading = useRef(null);
  useEffect(() => { heading.current?.focus(); }, []);
  const steps = Array.isArray(meal.cookingSteps) ? meal.cookingSteps.filter(step => typeof step === 'string')
    : typeof meal.cookingSteps === 'string' ? [meal.cookingSteps] : [];
  return <section className="wm-meal-detail" aria-label="Meal details" onKeyDown={event => { if (event.key === 'Escape') onClose(); }}>
    <div className="wm-section-heading"><span className="wm-eyebrow">On your menu · {meal.mealTime}</span><button type="button" className="wm-icon-button" onClick={onClose} aria-label="Close meal details"><PlannerIcon name="close" /></button></div>
    <div className="wm-detail-grid">
      <MealVisual meal={meal} />
      <div><h3 ref={heading} tabIndex={-1}>{meal.name}</h3><p className="wm-muted">{number(meal.calories)} kcal · {number(meal.portionMultiplier)}× standard serving</p><h4>Ingredients for this portion</h4><ul className="wm-ingredients">{(meal.ingredients || []).map((item, index) => <li key={item.ingredientId ?? index}><span>{item.name}</span><span>{number(item.quantity)} {item.unit}</span></li>)}</ul>{!meal.ingredients?.length && <p className="wm-muted">Ingredients are not available for this saved meal.</p>}</div>
    </div>
    <div className="wm-cooking-steps">
      <div className="wm-cooking-heading"><div><span className="wm-eyebrow">Recipe</span><h4>Cooking instructions</h4></div>{steps.length > 0 && <span className="wm-cooking-count">{steps.length} steps</span>}</div>
      {steps.length ? <ol>{steps.map((step, index) => <li key={index}>{step}</li>)}</ol> : <p className="wm-muted">Cooking steps are not available for this meal yet. Your ingredients and portion are shown above.</p>}
    </div>
  </section>;
}

export default function WeeklyCalendar({ plan, opening, onRoutineChanged }) {
  const today = zonedToday(plan.routine?.timeZoneId);
  const [view, setView] = useState('day');
  const [wideScreen, setWideScreen] = useState(() => window.matchMedia?.('(min-width: 1101px)').matches ?? true);
  useEffect(() => {
    const media = window.matchMedia?.('(min-width: 1101px)');
    if (!media) return;
    const update = () => setWideScreen(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const calendarView = wideScreen ? view : 'day';
  const days = plan.menu.days || [];
  const [dayIndex, setDayIndex] = useState(() => days.find(day => day.date === today)?.dayIndex ?? days[0]?.dayIndex);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const trigger = useRef(null);
  const [saving, setSaving] = useState(null);
  const [trackingError, setTrackingError] = useState('');
  const [trackingMessage, setTrackingMessage] = useState('');
  const [now, setNow] = useState(Date.now);
  const requestLock = useRef(false);
  const alive = useRef(true);
  const routine = plan.routine;
  const trackable = routine?.mode === 'weight_goal';
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useEffect(() => {
    if (!trackable) return;
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, [trackable]);
  const day = days.find(item => item.dayIndex === dayIndex) || days[0];
  function openMeal(meal, button) { trigger.current = button; setSelectedMeal(meal); }
  function closeMeal() { setSelectedMeal(null); trigger.current?.focus(); }
  async function record(entry, status) {
    if (requestLock.current || opening || !onRoutineChanged) return;
    requestLock.current = true; setSaving(`${entry.date}-${entry.mealTime}`); setTrackingError(''); setTrackingMessage('');
    try {
      const updated = await logMeal(plan.id, { date: entry.date, mealTime: entry.mealTime, status, expectedVersion: routine.version });
      if (alive.current) { onRoutineChanged(updated); setTrackingMessage(`Meal tracking saved for ${entry.mealTime} on ${dateLabel(entry.date)}.`); }
    } catch (failure) { if (alive.current) setTrackingError(failure.message); }
    finally { requestLock.current = false; if (alive.current) setSaving(null); }
  }
  async function reloadRoutine() {
    if (requestLock.current) return;
    requestLock.current = true; setSaving('reload');
    try { const updated = await getMealPlan(plan.id); if (alive.current) { onRoutineChanged?.(updated.routine); setTrackingError(''); } }
    catch (failure) { if (alive.current) setTrackingError(failure.message); }
    finally { requestLock.current = false; if (alive.current) setSaving(null); }
  }
  function trackingFor(date, meal, compact = false) {
    if (!trackable) return null;
    const entry = routine.entries?.find(item => item.date === date && item.mealTime === meal.mealTime);
    if (!entry) return null;
    const due = new Date(entry.dueAt).getTime();
    const future = !Number.isFinite(due) || due > now;
    return <MealTrackingControl entry={entry} compact={compact} future={future} pending={saving === `${date}-${meal.mealTime}`}
      disabled={Boolean(saving) || opening || future || !onRoutineChanged || !['active', 'continued'].includes(routine.state)} onChange={status => record(entry, status)} />;
  }

  if (!days.length) return <div className="wm-empty"><h2>No scheduled meals in this menu</h2><p>Create another weekly menu to see its saved meals.</p></div>;

  return <section className="wm-calendar" aria-label="Weekly meal calendar" aria-busy={opening || Boolean(saving)}>
    <div className="wm-calendar-heading"><div><h2>Your weekly calendar</h2><p><PlannerIcon name="calendar" />{dateLabel(plan.startDate)} – {dateLabel(plan.endDate)}</p></div><div className="wm-view-switch" role="group" aria-label="Calendar view"><button type="button" className="wm-week-toggle" aria-pressed={calendarView === 'week'} onClick={() => setView('week')}><PlannerIcon name="calendar" />Week view</button><button type="button" aria-pressed={calendarView === 'day'} onClick={() => setView('day')}><PlannerIcon name="sun" />Day view</button></div></div>
    <div className="wm-calendar-note"><PlannerIcon name="calendar" /><span>{trackable ? 'Weight goal · Record meals on your calendar' : 'Balanced menu · View only'}</span><span className="wm-calendar-note-end">One dish per meal</span></div>
    {trackingError && <div role="alert" className="wm-alert wm-calendar-feedback">{trackingError}<button type="button" className="wm-text-button" disabled={Boolean(saving)} onClick={reloadRoutine}>Reload calendar</button></div>}
    <p role="status" className={trackingMessage ? 'wm-status wm-calendar-feedback' : 'sr-only'}>{trackingMessage}</p>
    {selectedMeal && <MealDetailPanel meal={selectedMeal} onClose={closeMeal} />}
    {calendarView === 'week' && <div className="wm-week-grid" data-view="week">
      {days.map(item => <div key={item.dayIndex} className={`wm-day-column ${item.date === today ? 'is-today' : ''}`}>
        <div className="wm-day-heading"><span>{weekday(item.date, true)}</span><strong>{new Date(`${item.date}T00:00:00Z`).getUTCDate()}</strong>{item.date === today && <small>Today</small>}</div>
        <div className="wm-column-meals">{(item.meals || []).map(meal => <MealCard key={`${meal.mealTime}-${meal.mealId}`} meal={meal} compact onOpen={openMeal} tracking={trackingFor(item.date, meal, true)} />)}</div>
        <p className="wm-day-total"><strong>{number(item.totalCalories)}</strong> kcal</p>
      </div>)}
    </div>}
    {calendarView === 'day' && <div className="wm-day-view" data-view="day">
      <nav className="wm-day-nav" aria-label="Meal plan days">{days.map(item => <button type="button" key={item.dayIndex} aria-current={dayIndex === item.dayIndex ? 'date' : undefined} onClick={() => setDayIndex(item.dayIndex)} aria-label={`${weekday(item.date)} ${dateLabel(item.date)}`}><span>{weekday(item.date, true)}</span><strong>{new Date(`${item.date}T00:00:00Z`).getUTCDate()}</strong></button>)}</nav>
      {day && <><div className="wm-day-title"><div><span className="wm-day-position">Day {days.indexOf(day) + 1} of {days.length}</span><h3>{weekday(day.date)}<span>{dateLabel(day.date)}</span></h3></div><div className="wm-day-energy"><span>On your plate</span><strong>{number(day.totalCalories)} <small>kcal</small></strong><span>Planned for this day</span></div></div><div className="wm-day-meals">{(day.meals || []).map(meal => <MealCard key={`${meal.mealTime}-${meal.mealId}`} meal={meal} onOpen={openMeal} tracking={trackingFor(day.date, meal)} />)}</div></>}
    </div>}
    <p className="wm-calendar-footer"><PlannerIcon name="leaf" />A little variety on your plate, every day. Select any meal to see its portion, ingredients, and cooking instructions.</p>
  </section>;
}
