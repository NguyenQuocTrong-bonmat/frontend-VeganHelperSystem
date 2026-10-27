import React, { useLayoutEffect, useMemo, useState } from 'react';
import { dateLabel, number } from './plannerFormat';
import PlannerIcon from './PlannerIcon';

const FACTORS = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
const STEPS = [
  { key: 'tdee', title: 'Calculate daily energy', duration: '3 sec' },
  { key: 'split', title: 'Divide calories by meal', duration: '3 sec' },
  { key: 'waiting', title: 'Create your menu', duration: '5 sec' },
];

function useCountUp(value, duration, active, delay = 0) {
  const target = value == null ? Number.NaN : Number(value);
  const [display, setDisplay] = useState(Number.isFinite(target) ? target : null);

  useLayoutEffect(() => {
    if (!Number.isFinite(target)) { setDisplay(null); return undefined; }
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!active || reduceMotion) { setDisplay(target); return undefined; }

    const requestFrame = window.requestAnimationFrame?.bind(window)
      ?? (callback => window.setTimeout(() => callback(Date.now()), 16));
    const cancelFrame = window.cancelAnimationFrame?.bind(window) ?? window.clearTimeout.bind(window);
    let frame = 0;
    let timeout = 0;
    let startedAt = 0;
    let lastPaint = 0;
    setDisplay(0);
    const animate = timestamp => {
      if (!startedAt) startedAt = timestamp;
      if (timestamp - lastPaint >= 1000 / 30 || timestamp - startedAt >= duration) {
        lastPaint = timestamp;
        const progress = Math.min(1, (timestamp - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(target * eased);
        if (progress < 1) frame = requestFrame(animate);
      } else frame = requestFrame(animate);
    };

    timeout = window.setTimeout(() => { frame = requestFrame(animate); }, delay);
    return () => { window.clearTimeout(timeout); cancelFrame(frame); };
  }, [target, duration, active, delay]);

  return display;
}

function estimateTdee(profile) {
  const weight = Number(profile?.weightKg);
  const height = Number(profile?.heightCm);
  const factor = FACTORS[profile?.activityLevel];
  const sex = profile?.biologicalSex;
  const birthDate = profile?.birthDate;
  if (!birthDate || !factor || !['male', 'female'].includes(sex) || !Number.isFinite(weight) || !Number.isFinite(height)) return null;
  const [year, month, day] = birthDate.split('-').map(Number);
  const now = new Date();
  let age = now.getFullYear() - year;
  if (now.getMonth() + 1 < month || (now.getMonth() + 1 === month && now.getDate() < day)) age -= 1;
  const resting = 10 * weight + 6.25 * height - 5 * age + (sex === 'male' ? 5 : -161);
  return { resting: Math.round(resting), factor, tdee: Math.round(resting * factor) };
}

function ProgressSteps({ phase }) {
  const phaseIndex = STEPS.findIndex(step => step.key === phase);
  return <ol className="wm-generation-steps" aria-label="Menu creation steps">
    {STEPS.map((step, index) => {
      const complete = phase === 'revealing' || index < phaseIndex;
      const active = phase === step.key;
      return <li key={step.key} className={`${complete ? 'is-complete' : ''} ${active ? 'is-active' : ''}`}>
        <span className="wm-generation-step-number">{complete ? <PlannerIcon name="check" /> : `0${index + 1}`}</span>
        <span className="wm-generation-step-copy"><strong>{step.title}</strong><small>{complete ? 'Complete' : active ? 'In progress' : step.duration}</small></span>
      </li>;
    })}
  </ol>;
}

export default function CalendarCreationProgress({ phase, preview, pendingPlan, visibleMealCount = 0 }) {
  const energy = useMemo(() => estimateTdee(preview?.profile), [preview?.profile]);
  const menu = pendingPlan?.menu;
  const mealRows = (menu?.days || []).flatMap(day => (day.meals || []).map(meal => ({ ...meal, date: day.date, dayIndex: day.dayIndex })));
  const isRevealing = phase === 'revealing';
  const split = preview?.mealCalorieSplit || { breakfastPercent: 25, lunchPercent: 30, dinnerPercent: 45 };
  const dailyTarget = Number(preview?.safety?.targetCalories ?? preview?.safety?.tdee ?? energy?.tdee);
  const splitItems = [
    { key: 'breakfast', label: 'Breakfast', percent: Number(split.breakfastPercent), tone: 'breakfast' },
    { key: 'lunch', label: 'Lunch', percent: Number(split.lunchPercent), tone: 'lunch' },
    { key: 'dinner', label: 'Dinner', percent: Number(split.dinnerPercent), tone: 'dinner' },
  ];
  const calculating = phase === 'tdee';
  const allocating = phase === 'split';
  const animatedResting = useCountUp(energy?.resting, 2700, calculating);
  const animatedFactor = useCountUp(energy?.factor, 2700, calculating, 100);
  const animatedTdee = useCountUp(preview?.safety?.tdee ?? energy?.tdee, 2700, calculating, 200);
  const animatedBreakfastPercent = useCountUp(splitItems[0].percent, 2350, allocating);
  const animatedLunchPercent = useCountUp(splitItems[1].percent, 2350, allocating, 150);
  const animatedDinnerPercent = useCountUp(splitItems[2].percent, 2350, allocating, 300);
  const animatedBreakfastCalories = useCountUp(Number.isFinite(dailyTarget) ? Math.round(dailyTarget * splitItems[0].percent / 100) : null, 2350, allocating);
  const animatedLunchCalories = useCountUp(Number.isFinite(dailyTarget) ? Math.round(dailyTarget * splitItems[1].percent / 100) : null, 2350, allocating, 150);
  const animatedDinnerCalories = useCountUp(Number.isFinite(dailyTarget) ? Math.round(dailyTarget * splitItems[2].percent / 100) : null, 2350, allocating, 300);
  const animatedSplitItems = splitItems.map((item, index) => ({
    ...item,
    allocationIndex: index,
    displayPercent: [animatedBreakfastPercent, animatedLunchPercent, animatedDinnerPercent][index],
    displayCalories: [animatedBreakfastCalories, animatedLunchCalories, animatedDinnerCalories][index],
  }));
  const shownCount = Math.min(visibleMealCount, mealRows.length);
  const startDate = pendingPlan?.startDate || preview?.startDate;
  const endDate = pendingPlan?.endDate;

  return <section className={`wm-calendar wm-generation ${isRevealing ? 'is-revealing' : ''} ${calculating ? 'is-calculating' : ''} ${allocating ? 'is-allocating' : ''}`} aria-label="Your weekly calendar" aria-busy={!isRevealing}>
    <div className="wm-calendar-heading">
      <div><h2>Your weekly calendar</h2><p><PlannerIcon name="calendar" />{startDate ? `${dateLabel(startDate)}${endDate ? ` – ${dateLabel(endDate)}` : ''}` : 'Your new week is taking shape'}</p></div>
      <span className="wm-generation-badge">{isRevealing ? `${shownCount} of ${mealRows.length} meals` : 'Preparing your week'}</span>
    </div>

    {!isRevealing ? <>
      <ProgressSteps phase={phase} />
      <div className="wm-generation-stage">
        <p className="sr-only" role="status" aria-live="polite">{phase === 'tdee' ? 'Calculating your daily energy estimate.' : phase === 'split' ? 'Dividing your daily calories across meals.' : 'Waiting for your weekly menu to be created.'}</p>
        {phase === 'tdee' && <>
          <span className="wm-generation-kicker"><span className="wm-generation-pulse" />Step 1 · Daily energy</span>
          <h3>Calculating your TDEE</h3>
          <p>Your profile provides the starting point. We estimate resting energy, then adjust it using your activity level.</p>
          <div className="wm-generation-equation">
            <div className="wm-generation-equation-node is-resting"><small>Resting energy · Mifflin–St Jeor</small><strong>{energy ? `${number(animatedResting)} kcal` : 'Using saved profile'}</strong></div>
            <span aria-hidden="true">×</span>
            <div className="wm-generation-equation-node is-factor"><small>Activity factor</small><strong>{energy ? `${number(animatedFactor)}×` : 'Your activity level'}</strong></div>
            <span aria-hidden="true">=</span>
            <div className="is-total wm-generation-equation-node is-total-node"><small>Estimated TDEE</small><strong>{energy || Number.isFinite(dailyTarget) ? `${number(animatedTdee)} kcal / day` : 'Calculating…'}</strong></div>
          </div>
          <div className="wm-generation-timer" aria-hidden="true"><span className="is-three-seconds" /></div>
        </>}
        {phase === 'split' && <>
          <span className="wm-generation-kicker"><span className="wm-generation-pulse" />Step 2 · Calorie allocation</span>
          <h3>Sharing your daily calories across meals</h3>
          <p>Your percentages set a calorie target for each meal. The menu will match dishes and portions to these targets.</p>
          <div className="wm-generation-allocation">
            <div className="wm-generation-bar" role="img" aria-label={splitItems.map(item => `${item.label} ${item.percent}%`).join(', ')}>
              {splitItems.map((item, index) => <span key={item.key} className={`is-${item.tone}`} style={{ width: `${item.percent}%`, '--allocation-index': index }} />)}
            </div>
            <div className="wm-generation-split-list">{animatedSplitItems.map(item => <div key={item.key} style={{ '--allocation-index': item.allocationIndex }}>
              <span className={`wm-generation-dot is-${item.tone}`} />
              <span>{item.label}</span>
              <strong>{number(Math.round(item.displayPercent ?? 0))}%</strong>
              <small>{Number.isFinite(item.displayCalories) ? `${number(Math.round(item.displayCalories))} kcal` : '—'}</small>
            </div>)}</div>
          </div>
          <div className="wm-generation-timer" aria-hidden="true"><span className="is-three-seconds" /></div>
        </>}
        {phase === 'waiting' && <div className="wm-generation-waiting">
          <span className="wm-generation-wait-icon"><PlannerIcon name="bowl" /></span>
          <span className="wm-generation-kicker"><span className="wm-generation-pulse" />Step 3 · Menu selection</span>
          <h3>Waiting for your menu to be created</h3>
          <p>Matching recipes to your diet, allergies, meal times and calorie targets, then saving your week.</p>
          <div className="wm-generation-timer" aria-hidden="true"><span className="is-five-seconds" /></div>
        </div>}
      </div>
      <p className="wm-generation-footnote">Your calorie figures are estimates. The saved menu will show the meals and portions selected for your week.</p>
    </> : <>
      <div className="wm-generation-reveal-heading" aria-live="polite"><div><span className="wm-generation-kicker"><span className="wm-generation-pulse" />Menu created · revealing your dishes</span><h3>Your week, one meal at a time</h3></div><strong>{shownCount} <small>/ {mealRows.length}</small></strong></div>
      <div className="wm-generation-reveal-bar" role="progressbar" aria-label="Meals revealed" aria-valuemin="0" aria-valuemax={mealRows.length} aria-valuenow={shownCount}><span style={{ width: mealRows.length ? `${shownCount / mealRows.length * 100}%` : '0%' }} /></div>
      <div className="wm-generation-reveal-list">
        {mealRows.slice(0, shownCount).map((meal, index) => <article className="wm-generation-meal" key={`${meal.date}-${meal.mealTime}-${meal.mealId}`} style={{ '--meal-index': index }}>
          {meal.imageUrl ? <img src={meal.imageUrl} alt="" loading="lazy" /> : <span className={`wm-generation-meal-placeholder is-${meal.mealTime}`}><PlannerIcon name={meal.mealTime === 'breakfast' ? 'sun' : meal.mealTime === 'dinner' ? 'moon' : 'bowl'} /></span>}
          <span className="wm-generation-meal-date">Day {meal.dayIndex} · {meal.mealTime}</span>
          <strong>{meal.name}</strong>
          <small>{number(meal.calories)} kcal · {number(meal.portionMultiplier)}× serving</small>
        </article>)}
      </div>
    </>}
  </section>;
}
