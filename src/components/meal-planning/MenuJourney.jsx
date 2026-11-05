import React, { useMemo } from 'react';
import { wholeNumber, number, utcToday } from './plannerFormat';
import { formatDate } from '../../utils/dateUtils';
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

export function estimateEnergy(profile, today) {
  const weight = Number(profile?.weightKg);
  const height = Number(profile?.heightCm);
  const factor = ACTIVITY_FACTORS[profile?.activityLevel];
  const sex = profile?.biologicalSex;
  const birth = profile?.birthDate;
  if (!birth || !['male', 'female'].includes(sex) || !factor || weight < 30 || weight > 200 || height < 100 || height > 250) return null;
  const [year, month, day] = birth.split('-').map(Number);
  const [thisYear, thisMonth, thisDay] = today.split('-').map(Number);
  if (![year, month, day, thisYear, thisMonth, thisDay].every(Number.isFinite)) return null;
  const age = thisYear - year - (thisMonth < month || (thisMonth === month && thisDay < day) ? 1 : 0);
  if (age < 20 || age > 120) return null;
  const resting = 10 * weight + 6.25 * height - 5 * age + (sex === 'male' ? 5 : -161);
  return { age, resting, factor, tdee: resting * factor, weight, height };
}

export function savedMealAverages(menu) {
  const days = (menu?.days || []).filter(day => Array.isArray(day.meals) && day.meals.length);
  if (!days.length) return null;
  const sums = Object.fromEntries(MEAL_TIMES.map(time => [time.key, 0]));
  for (const day of days) {
    for (const meal of day.meals) {
      if (Object.prototype.hasOwnProperty.call(sums, meal.mealTime)) {
        sums[meal.mealTime] += Number(meal.calories) || 0;
      }
    }
  }
  const averages = Object.fromEntries(MEAL_TIMES.map(time => [time.key, sums[time.key] / days.length]));
  const total = Object.values(averages).reduce((sum, value) => sum + value, 0);
  if (!total) return null;
  return Object.fromEntries(MEAL_TIMES.map(time => [time.key, {
    calories: averages[time.key],
    percent: (averages[time.key] / total) * 100,
  }]));
}

export default function MenuJourney({ plan, menu: menuProp }) {
  const menu = menuProp || plan?.menu;
  const savedProfile = menu?.energyProfile;
  const hasSavedProfile = Boolean(
    savedProfile?.birthDate && Number(savedProfile.weightKg) > 0 && Number(savedProfile.heightCm) > 0
  );

  const effectiveMode = plan?.routine?.mode || menu?.goal || 'maintenance';
  const effectiveStartDate = plan?.startDate;
  const effectiveTargetWeight = plan?.routine?.targetWeightKg;
  const effectiveTargetDate = plan?.routine?.targetDate;

  const energy = useMemo(() => {
    if (!hasSavedProfile || !menu?.energyProfile?.estimatedOn) return null;
    return estimateEnergy(savedProfile, menu.energyProfile.estimatedOn || utcToday());
  }, [hasSavedProfile, menu?.energyProfile?.estimatedOn, savedProfile]);

  const tdee = energy?.tdee;
  const dailyTarget = menu?.targetDailyCalories == null ? null : Number(menu.targetDailyCalories);

  const goalDays = effectiveTargetDate && effectiveStartDate
    ? Math.round((Date.parse(`${effectiveTargetDate}T00:00:00Z`) - Date.parse(`${effectiveStartDate}T00:00:00Z`)) / 86400000)
    : 0;

  const averageSplit = useMemo(() => savedMealAverages(menu), [menu]);

  const portions = MEAL_TIMES.map(time => ({
    ...time,
    percent: averageSplit?.[time.key]?.percent,
    calories: averageSplit?.[time.key]?.calories,
  }));

  return (
    <section className="wm-journey wm-nutrition-insights is-saved" aria-label="Nutrition & Calculation Insights">
      <div className="wm-journey-heading">
        <div>
          <span className="wm-eyebrow">Nutrition & Calculation Insights</span>
          <h3>How your weekly nutrition was calculated</h3>
        </div>
        <span className="wm-journey-badge">Saved result</span>
      </div>

      <div className="wm-insights-grid">
        {/* Panel 1: Energy & TDEE Calculation */}
        <div className="wm-insight-panel wm-insight-energy">
          <div className="wm-insight-panel-header">
            <span className="wm-insight-icon"><PlannerIcon name="sun" /></span>
            <div>
              <span className="wm-journey-detail-label">Energy Calculation</span>
              <h4>{effectiveMode === 'weight_goal' ? 'Safety-checked daily energy' : 'Daily maintenance energy'}</h4>
            </div>
          </div>

          {hasSavedProfile && energy ? (
            <div className="wm-journey-equation">
              <div className="wm-equation-term">
                <span>Resting energy</span>
                <strong>{wholeNumber(energy.resting)} kcal</strong>
              </div>
              <span className="wm-equation-operator" aria-hidden="true">×</span>
              <div className="wm-equation-term">
                <span>Activity factor</span>
                <strong>{number(energy.factor)}×</strong>
              </div>
              <span className="wm-equation-operator" aria-hidden="true">=</span>
              <div className="wm-journey-equation-total">
                <span>Estimated TDEE</span>
                <strong>{Number.isFinite(tdee) ? `${wholeNumber(tdee)} kcal` : '—'}</strong>
              </div>

              <p className="wm-equation-formula">
                Resting estimate = 10 × {number(energy.weight)} kg + 6.25 × {number(energy.height)} cm − 5 × {energy.age} years {savedProfile.biologicalSex === 'male' ? '+ 5' : '− 161'} = {wholeNumber(energy.resting)} kcal/day.
              </p>

              {effectiveMode === 'weight_goal' && (
                <p className="wm-equation-goal">
                  {Number.isFinite(dailyTarget)
                    ? `Safety-checked daily target: ${wholeNumber(dailyTarget)} kcal${Number.isFinite(tdee) ? ` (${wholeNumber(dailyTarget - tdee)} kcal from TDEE)` : ''}.`
                    : 'Daily calorie target not recorded in this menu.'}
                </p>
              )}

              {effectiveMode === 'weight_goal' && Number(effectiveTargetWeight) > 0 && (
                <p className="wm-equation-timeline">
                  Saved goal: {number(savedProfile.weightKg)} kg at creation → {number(effectiveTargetWeight)} kg {effectiveTargetDate ? `by ${formatDate(effectiveTargetDate)}` : ''} {goalDays > 0 ? `(${goalDays} days)` : ''}.
                </p>
              )}
            </div>
          ) : (
            <div className="wm-insight-fallback">
              <div className="wm-fallback-callout">
                <p>
                  This historical menu was saved without an energy profile snapshot. Daily calorie target: <strong>{Number.isFinite(dailyTarget) ? `${wholeNumber(dailyTarget)} kcal` : 'Not recorded'}</strong>.
                </p>
                <small>Future menus record complete Mifflin–St Jeor TDEE estimates from your profile.</small>
              </div>
            </div>
          )}
        </div>

        {/* Panel 2: Calorie Distribution across Meals */}
        <div className="wm-insight-panel wm-insight-split">
          <div className="wm-insight-panel-header">
            <span className="wm-insight-icon"><PlannerIcon name="bowl" /></span>
            <div>
              <span className="wm-journey-detail-label">Meal Distribution</span>
              <h4>Actual dish calories across 3 meals</h4>
            </div>
          </div>

          <div className="wm-journey-allocation">
            <p className="wm-allocation-desc">
              Average calories and actual share provided by the dishes selected across this 7-day menu:
            </p>

            <div
              className="wm-journey-bar"
              role="img"
              aria-label={portions.map(item => `${item.label} ${Number.isFinite(item.percent) ? `${Math.round(item.percent)}%` : 'not recorded'}`).join(', ')}
            >
              {portions.map(item => (
                <span
                  key={item.key}
                  className={`wm-journey-bar-${item.key}`}
                  style={{ width: `${Math.max(0, Number.isFinite(item.percent) ? item.percent : 0)}%` }}
                />
              ))}
            </div>

            <div className="wm-journey-meals">
              {portions.map(item => (
                <div key={item.key} className="wm-meal-split-item">
                  <span className={`wm-journey-meal-dot is-${item.key}`} />
                  <span className="wm-meal-split-label">{item.label}</span>
                  <strong className="wm-meal-split-cal">
                    {Number.isFinite(item.calories) ? `${number(Math.round(item.calories))} kcal` : '—'}
                  </strong>
                  <small className="wm-meal-split-pct">
                    {Number.isFinite(item.percent) ? `${number(Math.round(item.percent * 10) / 10)}%` : '—'}
                  </small>
                </div>
              ))}
            </div>

            {menu?.mealCalorieSplit && (
              <p className="wm-split-target-note">
                Configured target split: Breakfast {menu.mealCalorieSplit.breakfastPercent}%, Lunch {menu.mealCalorieSplit.lunchPercent}%, Dinner {menu.mealCalorieSplit.dinnerPercent}%.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="wm-journey-sources">
        <span>Read the evidence</span>
        {SOURCES.map(source => (
          <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
            {source.label}<PlannerIcon name="arrow" />
          </a>
        ))}
      </div>
    </section>
  );
}
