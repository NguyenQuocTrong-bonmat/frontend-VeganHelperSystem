import React, { useEffect, useMemo, useState } from 'react';
import { dietLabel, number, utcToday } from './plannerFormat';
import PlannerIcon from './PlannerIcon';

const ACTIVITY_FACTORS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const MEAL_TIMES = [
  { key: 'breakfast', label: 'Breakfast', tone: 'sun' },
  { key: 'lunch', label: 'Lunch', tone: 'leaf' },
  { key: 'dinner', label: 'Dinner', tone: 'moon' },
];

const SOURCES = [
  { label: 'Mifflin et al. · energy equation', url: 'https://pubmed.ncbi.nlm.nih.gov/2305711/' },
  { label: 'NIDDK · body weight planning', url: 'https://www.niddk.nih.gov/bwp' },
  { label: 'WHO · healthy diet and variety', url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet' },
];

function estimateEnergy(profile, today) {
  const weight = Number(profile?.weightKg);
  const height = Number(profile?.heightCm);
  const factor = ACTIVITY_FACTORS[profile?.activityLevel];
  const sex = profile?.biologicalSex;
  const birth = profile?.birthDate;
  if (!birth || !['male', 'female'].includes(sex) || !factor || weight < 30 || weight > 200 || height < 100 || height > 250) return null;
  const [year, month, day] = birth.split('-').map(Number);
  const [thisYear, thisMonth, thisDay] = today.split('-').map(Number);
  if (![year, month, day, thisYear, thisMonth, thisDay].every(Number.isFinite)) return null;
  const age = thisYear - year - (thisMonth < month || thisMonth === month && thisDay < day ? 1 : 0);
  if (age < 20 || age > 120) return null;
  const resting = 10 * weight + 6.25 * height - 5 * age + (sex === 'male' ? 5 : -161);
  return { age, resting, factor, tdee: resting * factor, weight, height };
}

function savedMealAverages(menu) {
  const days = (menu?.days || []).filter(day => Array.isArray(day.meals) && day.meals.length);
  if (!days.length) return null;
  const sums = Object.fromEntries(MEAL_TIMES.map(time => [time.key, 0]));
  for (const day of days) {
    for (const meal of day.meals) {
      if (Object.prototype.hasOwnProperty.call(sums, meal.mealTime)) sums[meal.mealTime] += Number(meal.calories) || 0;
    }
  }
  const averages = Object.fromEntries(MEAL_TIMES.map(time => [time.key, sums[time.key] / days.length]));
  const total = Object.values(averages).reduce((sum, value) => sum + value, 0);
  if (!total) return null;
  return Object.fromEntries(MEAL_TIMES.map(time => [time.key, {
    calories: averages[time.key], percent: averages[time.key] / total * 100,
  }]));
}

function stageStatus(index, stage, busy, saved) {
  if (saved) return 'From saved plan';
  if (busy && index === 3) return 'Selecting now';
  if (index < stage) return 'Ready';
  if (index === stage) return 'In view';
  return 'Coming up';
}

export default function MenuJourney({ profile, allergies = [], mode = 'maintenance', safety, split, step = 0, busy = false, menu, startDate, targetWeight, targetDate }) {
  const saved = Boolean(menu);
  const [activeStage, setActiveStage] = useState(saved ? 3 : 0);
  useEffect(() => {
    if (!saved) setActiveStage(busy ? 3 : step === 0 ? 0 : step === 1 ? 2 : 3);
  }, [busy, saved, step]);

  const effectiveProfile = menu?.energyProfile || profile;
  const energy = useMemo(() => estimateEnergy(effectiveProfile, menu?.energyProfile?.estimatedOn || utcToday()), [effectiveProfile, menu?.energyProfile?.estimatedOn]);
  const tdee = saved ? energy?.tdee : safety?.allowed ? Number(safety.tdee) : energy?.tdee;
  const dailyTarget = saved ? Number(menu.targetDailyCalories) : mode === 'weight_goal' ? safety?.allowed ? Number(safety.targetCalories) : null : energy?.tdee;
  const goalDays = targetDate && startDate ? Math.round((Date.parse(`${targetDate}T00:00:00Z`) - Date.parse(`${startDate}T00:00:00Z`)) / 86400000) : 0;
  const goalDelta = Number(targetWeight) - Number(profile?.weightKg);
  const provisionalAdjustment = mode === 'weight_goal' && !saved && goalDays > 0 && Number.isFinite(goalDelta) && Number(targetWeight) > 0 && Number(profile?.weightKg) > 0
    ? goalDelta * 7700 / goalDays : null;
  const selectedMeals = (menu?.days || []).flatMap(day => day.meals || []);
  const uniqueMealCount = new Set(selectedMeals.map(meal => meal.mealId)).size;
  const averageSplit = savedMealAverages(menu);
  const requestedSplit = split || { breakfast: 25, lunch: 30, dinner: 45 };
  const percentages = MEAL_TIMES.map(time => Number(requestedSplit[time.key]));
  const validSplit = percentages.every(value => Number.isInteger(value) && value >= 1 && value <= 98)
    && percentages.reduce((sum, value) => sum + value, 0) === 100;
  const portions = MEAL_TIMES.map(time => ({
    ...time,
    percent: saved ? averageSplit?.[time.key]?.percent : Number(requestedSplit[time.key]),
    calories: saved ? averageSplit?.[time.key]?.calories : validSplit && Number.isFinite(dailyTarget) ? dailyTarget * Number(requestedSplit[time.key]) / 100 : null,
  }));
  const diet = menu?.dietType || profile?.dietType;
  const allergyNames = saved ? menu.allergies || [] : allergies;
  const stage = saved ? 3 : busy ? 3 : step === 0 ? 0 : step === 1 ? 2 : 3;

  const stages = [
    { label: 'Read your profile', icon: 'leaf', value: effectiveProfile ? `${dietLabel(diet)} · ${allergyNames.length} allergies` : 'Waiting for profile' },
    { label: 'Estimate daily energy', icon: 'sun', value: Number.isFinite(dailyTarget) ? `${number(dailyTarget)} kcal / day` : energy ? `${number(energy.tdee)} kcal maintenance` : 'Profile needed' },
    { label: 'Share across meals', icon: 'bowl', value: saved ? 'Actual daily average' : validSplit ? `${percentages.join(' / ')}%` : 'Complete the 100% split' },
    { label: 'Choose 21 dishes', icon: 'calendar', value: saved ? `${uniqueMealCount} distinct dishes` : busy ? 'Matching and saving…' : mode === 'weight_goal' ? 'After your safety check' : 'After menu creation' },
  ];

  return <section className={`wm-journey ${saved ? 'is-saved' : ''}`} aria-label={saved ? 'How this menu was built' : 'Live menu planning preview'}>
    <div className="wm-journey-heading">
      <div><span className="wm-eyebrow">From your profile to your plate</span><h3>{saved ? 'See how this week came together' : 'Watch your plan take shape'}</h3></div>
      <span className="wm-journey-badge">{saved ? 'Saved result' : busy ? 'Creating menu' : 'Live preview'}</span>
    </div>
    <div className="wm-journey-stages" style={{ '--wm-journey-progress': `${Math.round(stage / 3 * 92)}%` }}>
      {stages.map((item, index) => <button type="button" key={item.label} className={`wm-journey-stage ${activeStage === index ? 'is-active' : ''} ${index < stage || saved ? 'is-complete' : ''} ${busy && index === 3 ? 'is-busy' : ''}`} aria-pressed={activeStage === index} onClick={() => setActiveStage(index)}>
        <span className="wm-journey-stage-top"><span className="wm-journey-number">0{index + 1}</span><PlannerIcon name={item.icon} /></span>
        <strong>{item.label}</strong><span className="wm-journey-stage-value">{item.value}</span><small>{stageStatus(index, stage, busy, saved)}</small>
      </button>)}
    </div>
    <div className="wm-journey-detail" key={activeStage}>
      {activeStage === 0 && <div className="wm-journey-detail-grid">
        <div><span className="wm-journey-detail-label">Your starting point</span><h4>Preferences set the boundaries.</h4><p>The menu uses your saved diet and declared allergies before considering any recipe. Change your health profile to update a future menu.</p></div>
        <div className="wm-journey-facts"><div><span>Diet</span><strong>{dietLabel(diet)}</strong></div><div><span>Allergens to avoid</span><strong>{allergyNames.length ? allergyNames.join(', ') : 'None declared'}</strong></div><div><span>Activity level</span><strong>{effectiveProfile?.activityLevel?.replaceAll('_', ' ') || 'Not set'}</strong></div></div>
      </div>}
      {activeStage === 1 && <div className="wm-journey-detail-grid">
        <div><span className="wm-journey-detail-label">Energy estimate</span><h4>{mode === 'weight_goal' || menu?.goal === 'weight_goal' ? 'Safety first, then a daily target.' : 'A daily maintenance estimate.'}</h4><p>Vegan Helper estimates resting energy with the Mifflin–St Jeor equation, then applies your saved activity level. The server recalculates this before saving a plan.</p></div>
        <div className="wm-journey-equation">
          <div><span>Resting energy</span><strong>{energy ? `${number(energy.resting)} kcal` : 'Profile needed'}</strong></div>
          <span aria-hidden="true">×</span><div><span>Activity factor</span><strong>{energy ? `${number(energy.factor)}×` : '—'}</strong></div>
          <span aria-hidden="true">=</span><div className="wm-journey-equation-total"><span>Estimated TDEE</span><strong>{Number.isFinite(tdee) ? `${number(tdee)} kcal` : '—'}</strong></div>
          {energy && <p>Resting estimate = 10 × {number(energy.weight)} kg + 6.25 × {number(energy.height)} cm − 5 × {energy.age} years {effectiveProfile.biologicalSex === 'male' ? '+ 5' : '− 161'} = {number(energy.resting)} kcal/day.</p>}
          {Number.isFinite(provisionalAdjustment) && <p>Goal adjustment preview: ({number(targetWeight)} − {number(profile.weightKg)}) kg × 7,700 ÷ {goalDays} days ≈ {number(Math.round(provisionalAdjustment))} kcal/day. This is a planning estimate; the server must approve the goal before generating meals.</p>}
          {(mode === 'weight_goal' || menu?.goal === 'weight_goal') && <p>{Number.isFinite(dailyTarget) ? `Safety-checked daily target: ${number(dailyTarget)} kcal${Number.isFinite(tdee) ? ` (${number(dailyTarget - tdee)} kcal from TDEE)` : ''}.` : 'Enter your goal and run the server safety check to reveal the daily target.'}</p>}
        </div>
      </div>}
      {activeStage === 2 && <div className="wm-journey-detail-grid">
        <div><span className="wm-journey-detail-label">Three meals, one daily target</span><h4>{saved ? 'What the saved dishes actually provide.' : 'Your requested meal split.'}</h4><p>{saved ? 'These are the average calories from the dishes selected across this seven-day menu.' : 'Change the percentages in the form and watch the calorie budget shift. These figures are a preview; the saved menu shows the server’s actual dishes and portions.'}</p></div>
        <div className="wm-journey-allocation">
          <div className="wm-journey-bar" role="img" aria-label={validSplit || saved ? portions.map(item => `${item.label} ${Number.isFinite(item.percent) ? Math.round(item.percent) : 0}%`).join(', ') : 'Enter a valid 100 percent meal split to see the allocation'}>{portions.map(item => <span key={item.key} className={`wm-journey-bar-${item.key}`} style={{ width: `${saved || validSplit ? Math.max(0, Number.isFinite(item.percent) ? item.percent : 0) : 0}%` }} />)}</div>
          <div className="wm-journey-meals">{portions.map(item => <div key={item.key}><span className={`wm-journey-meal-dot is-${item.key}`} /><span>{item.label}</span><strong>{Number.isFinite(item.calories) ? `${number(Math.round(item.calories))} kcal` : '—'}</strong><small>{Number.isFinite(item.percent) ? `${number(Math.round(item.percent * 10) / 10)}%` : '—'}</small></div>)}</div>
          {!saved && !validSplit && <p role="status">Enter whole percentages that add up to 100% to preview calories per meal.</p>}
          {!saved && mode === 'weight_goal' && !safety?.allowed && <p>The calorie amounts appear after your goal passes the server safety check.</p>}
        </div>
      </div>}
      {activeStage === 3 && <div className="wm-journey-detail-grid">
        <div><span className="wm-journey-detail-label">Recipe selection</span><h4>{saved ? `${selectedMeals.length} meals placed across ${menu.days?.length || 0} days.` : busy ? 'The server is matching your dishes.' : 'Twenty-one dishes, chosen for your week.'}</h4><p>The application checks diet, declared allergens, meal time and a practical portion range. It then favors different dishes and main ingredients across the week. WHO’s healthy-diet guidance supports variety; these matching rules are specific to Vegan Helper.</p></div>
        <div className="wm-journey-selection">
          {saved ? <><span className="wm-journey-selection-count">{uniqueMealCount}<small>different dishes</small></span><ol>{selectedMeals.slice(0, 3).map((meal, index) => <li key={`${meal.mealId}-${index}`}><span>0{index + 1}</span><strong>{meal.name}</strong><small>{number(meal.calories)} kcal</small></li>)}</ol><p>Open the calendar below to see every dish, ingredient and recipe.</p></> : <><div className={`wm-journey-selection-icon ${busy ? 'is-working' : ''}`}><PlannerIcon name="bowl" /></div><strong>{busy ? 'Checking the catalog and saving your plan…' : 'Ready when you create the menu'}</strong><p>{busy ? 'The server returns the completed selection when it is ready. This is an activity indicator, not a percentage of server progress.' : 'Dish names will appear here after the server returns your saved menu.'}</p></>}
        </div>
      </div>}
    </div>
    <div className="wm-journey-sources"><span>Read the evidence</span>{SOURCES.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<PlannerIcon name="arrow" /></a>)}</div>
  </section>;
}
