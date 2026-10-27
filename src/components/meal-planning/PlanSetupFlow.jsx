import React, { useEffect, useRef, useState } from 'react';
import { getHealthProfile } from '../../services/healthProfileService';
import { dateLabel, dietLabel, number, utcToday, zonedToday } from './plannerFormat';
import PlannerIcon from './PlannerIcon';
import { previewGoal } from '../../services/mealPlanService';

export default function PlanSetupFlow({ busy, onGenerate, onCancel, onEditProfile, error, profileRevision }) {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState('balanced');
  const [startDate, setStartDate] = useState(utcToday);
  const [targetWeight, setTargetWeight] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [eligibility, setEligibility] = useState(false);
  const [timeZoneId, setTimeZoneId] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  const [reminders, setReminders] = useState(false);
  const [times, setTimes] = useState({ breakfastTime: '07:30', lunchTime: '12:00', dinnerTime: '18:30' });
  const [mealSplit, setMealSplit] = useState({ breakfast: '25', lunch: '30', dinner: '45' });
  const [splitError, setSplitError] = useState('');
  const [safety, setSafety] = useState(null);
  const [checking, setChecking] = useState(false);
  const [safetyError, setSafetyError] = useState('');
  const active = useRef(true);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  useEffect(() => { setSafety(null); setSafetyError(''); }, [startDate, targetWeight, targetDate, eligibility, timeZoneId, profileRevision]);
  const heading = useRef(null);
  const weightGoal = mode === 'weight-goal';
  const splitValues = Object.values(mealSplit).map(Number);
  const splitTotal = splitValues.reduce((total, value) => total + (Number.isFinite(value) ? value : 0), 0);
  const splitIsValid = splitValues.every(value => Number.isInteger(value) && value >= 1 && value <= 98) && splitTotal === 100;
  const mealCalorieSplit = {
    breakfastPercent: Number(mealSplit.breakfast),
    lunchPercent: Number(mealSplit.lunch),
    dinnerPercent: Number(mealSplit.dinner),
  };
  const today = weightGoal ? zonedToday(timeZoneId) : utcToday();
  const nextYear = new Date(`${today}T00:00:00Z`);
  const month = nextYear.getUTCMonth();
  nextYear.setUTCFullYear(nextYear.getUTCFullYear() + 1);
  if (nextYear.getUTCMonth() !== month) nextYear.setUTCDate(0);
  const maxStartDate = nextYear.toISOString().slice(0, 10);

  useEffect(() => {
    let active = true;
    setLoading(true); setProfileError('');
    getHealthProfile().then(data => { if (active) setProfile(data); })
      .catch(failure => { if (active) { setProfile(null); setProfileError(failure.status === 404 ? 'Create your health profile before planning your week.' : failure.message); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [refresh, profileRevision]);

  useEffect(() => { heading.current?.focus(); }, [step]);

  async function submit(event) {
    event.preventDefault();
    if (busy || checking) return;
    if (!event.currentTarget.checkValidity()) { event.currentTarget.reportValidity(); return; }
    if (step === 1 && !splitIsValid) {
      setSplitError('The breakfast, lunch and dinner percentages must add up to 100%.');
      return;
    }
    if (step < 2) { setStep(value => value + 1); return; }
    if (loading || !profile || profileError) return;
    if (!weightGoal) {
      onGenerate({ startDate, mealCalorieSplit, clientPreview: { mode: 'maintenance', profile, mealCalorieSplit } });
      return;
    }
    if (!eligibility) return;
    const payload={startDate,mode:'weight_goal',targetWeightKg:Number(targetWeight),targetDate,eligibilityConfirmed:eligibility,timeZoneId,
      remindersEnabled:reminders,...Object.fromEntries(Object.entries(times).map(([key,value])=>[key,`${value}:00`]))};
    if (safety?.allowed) {
      onGenerate({ ...payload, mealCalorieSplit, clientPreview: { mode: 'weight_goal', profile, safety, mealCalorieSplit } });
      return;
    }
    setChecking(true); setSafetyError('');
    try { const result=await previewGoal(payload); if(active.current) setSafety(result); }
    catch(failure) { if(active.current) setSafetyError(failure.message); }
    finally { if(active.current) setChecking(false); }
  }

  const allergies = [...(profile?.allergies || []).map(item => item.name), ...(profile?.customAllergies || []).map(item => typeof item === 'string' ? item : item.name)].filter(Boolean);

  return <section className="wm-setup" aria-labelledby="setup-title">
    <div className="wm-section-heading">
      <div><h2 id="setup-title" tabIndex={-1} ref={heading}>Make room for a nourishing week.</h2></div>
      <button type="button" className="wm-icon-button" onClick={onCancel} disabled={busy} aria-label="Cancel setup"><PlannerIcon name="close" /></button>
    </div>
    <ol className="wm-steps" aria-label="Plan setup progress">
      {['Your approach', 'Your schedule', 'Review & create'].map((label, index) => <li key={label} aria-current={step === index ? 'step' : undefined} className={step >= index ? 'is-reached' : ''}><span>{step > index ? <PlannerIcon name="check" /> : `0${index + 1}`}</span><span>{label}</span></li>)}
    </ol>
    <form id="plan-setup-form" onSubmit={submit}>
      <fieldset disabled={busy || checking} className="wm-fields">
        <legend className="sr-only">{['Choose your plan type', 'Set your dates and goal', 'Review your plan'][step]}</legend>
        {step === 0 && <>
          <div className="wm-mode-options">
            <label className={`wm-mode-option ${!weightGoal ? 'is-selected' : ''}`}>
              <input type="radio" name="plan-mode" value="balanced" checked={!weightGoal} onChange={() => setMode('balanced')} />
              <span className="wm-mode-symbol"><PlannerIcon name="leaf" /></span>
              <span><strong>Balanced weekly menu</strong><span>Eat well, keep things varied. A week of meals based on your saved profile.</span><small>7 days · 3 meals per day</small></span>
            </label>
            <label className={`wm-mode-option ${weightGoal ? 'is-selected' : ''}`}>
              <input type="radio" name="plan-mode" value="weight-goal" checked={weightGoal} onChange={() => setMode('weight-goal')} />
              <span className="wm-mode-symbol"><PlannerIcon name="target" /></span>
              <span><strong>Weight goal plan</strong><span>Plan towards a target weight, with meal tracking and regular check-ins.</span><small>Personal goal · Calendar · Progress</small></span>
            </label>
          </div>
          {weightGoal && <p className="wm-notice"><PlannerIcon name="info" /><span>A server safety check reviews your goal, timeline and calorie adjustment before creation. Weight change is estimated and cannot be guaranteed.</span></p>}
        </>}
        {step === 1 && <div className="wm-schedule-fields">
          <div className="wm-input-group"><label htmlFor="meal-plan-start">When does your week begin?</label><input className="wm-control" id="meal-plan-start" type="date" value={startDate} min={today} max={maxStartDate} required onChange={event => setStartDate(event.target.value)} aria-describedby="start-date-help" /><p id="start-date-help">Seven consecutive days, starting on your chosen date. Plan dates follow {weightGoal ? timeZoneId : 'UTC'}.</p></div>
          <fieldset className="wm-calorie-split">
            <legend>Daily calorie split</legend>
            <p className="wm-calorie-split-help">Preview how you would like to share your daily calorie target across three meals. The saved menu shows the actual calories of its selected dishes.</p>
            <div className="wm-calorie-split-fields">
              {[
                ['breakfast', 'Breakfast'],
                ['lunch', 'Lunch'],
                ['dinner', 'Dinner'],
              ].map(([key, label]) => <label key={key} htmlFor={'meal-split-' + key}>{label} (%)
                <input id={'meal-split-' + key} className="wm-control" type="number" min="1" max="98" step="1" required value={mealSplit[key]} aria-describedby="meal-split-help meal-split-total" onChange={event => { setMealSplit(current => ({ ...current, [key]: event.target.value })); setSplitError(''); }} />
              </label>)}
            </div>
            <p id="meal-split-help" className="wm-calorie-split-help">Use whole numbers. Each meal must receive at least 1%, and the total must be 100%.</p>
            <p id="meal-split-total" className={'wm-calorie-split-total ' + (splitIsValid ? 'is-valid' : '')} role="status">Total: {splitTotal}% / 100%</p>
            {splitError && <p className="wm-inline-error" role="alert">{splitError}</p>}
            <p className="wm-calorie-split-help">The starting values are editable convenience values, not a medical recommendation.</p>
          </fieldset>
          {weightGoal && <>
            <div className="wm-input-group"><label htmlFor="goal-weight">Target weight <span>(kg)</span></label><input className="wm-control" id="goal-weight" type="number" min="30" max="200" step="0.1" required value={targetWeight} onChange={event => setTargetWeight(event.target.value)} placeholder="Enter your target weight" /><p>Current weight: {profile?.weightKg ? `${number(profile.weightKg)} kg` : 'Add it in Health & Wellness.'}</p></div>
            <div className="wm-input-group"><label htmlFor="goal-date">Target date</label><input className="wm-control" id="goal-date" type="date" min={startDate} required value={targetDate} onChange={event => setTargetDate(event.target.value)} /><p>Your timeline will need a safety review before a plan can be created.</p></div>
            <div className="wm-input-group"><label htmlFor="goal-timezone">Timezone</label><input id="goal-timezone" className="wm-control" required value={timeZoneId} onChange={event=>setTimeZoneId(event.target.value)} placeholder="Asia/Ho_Chi_Minh" /><p>Goal plan dates and reminder times use this timezone.</p></div>
            <label className="wm-check-label"><input id="goal-eligibility" type="checkbox" required checked={eligibility} onChange={event=>setEligibility(event.target.checked)} />I am aged 20–65, not pregnant or breastfeeding, and do not need clinician-managed nutrition.</label>
            <label className="wm-check-label"><input type="checkbox" checked={reminders} onChange={event=>setReminders(event.target.checked)} />Remind me at meal times</label>
            {reminders && <div className="wm-reminder-preview">{Object.entries(times).map(([key,value])=><label key={key}>{key.replace('Time','')}<input type="time" required value={value} onChange={event=>setTimes(current=>({...current,[key]:event.target.value}))} /></label>)}</div>}
          </>}
          <p className="wm-notice"><PlannerIcon name="calendar" /><span>{weightGoal ? 'A weight goal can span several weekly menus. Future adjustments will require your confirmation.' : 'One dish per meal. Your saved diet, allergies and estimated maintenance calories guide the menu.'}</span></p>
        </div>}
        {step === 2 && <div className="wm-review">
          <div className="wm-review-summary"><span className="wm-mode-symbol"><PlannerIcon name={weightGoal ? 'target' : 'leaf'} /></span><div><h3>{weightGoal ? 'Weight goal plan' : 'Balanced weekly menu'}</h3><p>Starts {dateLabel(startDate)} · 7 days · 21 meals</p></div></div>
          <dl className="wm-review-facts wm-meal-split-review"><div><dt>Breakfast</dt><dd>{mealSplit.breakfast}%</dd></div><div><dt>Lunch</dt><dd>{mealSplit.lunch}%</dd></div><div><dt>Dinner</dt><dd>{mealSplit.dinner}%</dd></div></dl>
          {weightGoal && <><dl className="wm-review-facts"><div><dt>Target weight</dt><dd>{number(targetWeight)} kg</dd></div><div><dt>Target date</dt><dd>{dateLabel(targetDate)}</dd></div><div><dt>Daily calorie target</dt><dd>{safety?.allowed ? `${number(safety.targetCalories)} kcal` : 'Safety review required'}</dd></div>{safety?.allowed && <><div><dt>Estimated TDEE</dt><dd>{number(safety.tdee)} kcal</dd></div><div><dt>Daily adjustment</dt><dd>{number(safety.dailyAdjustment)} kcal</dd></div></>}</dl>{safety && !safety.allowed && <div role="alert" className="wm-alert"><strong>This goal needs adjustment.</strong><ul>{safety.reasons?.map(reason=><li key={reason}>{reason}</li>)}</ul><p>Go back and change the goal or choose a longer timeline.</p></div>}</>}
          <div className="wm-profile-review">
            <div className="wm-section-heading"><h3>Your saved health profile</h3><button type="button" className="wm-text-button" onClick={onEditProfile}>Review health profile & allergies <PlannerIcon name="arrow" /></button></div>
            {loading ? <p role="status">Loading your health profile…</p> : profileError ? <div role="alert"><p>{profileError}</p><button type="button" className="wm-text-button" onClick={() => setRefresh(value => value + 1)}>Retry health profile</button></div> : profile ? <>
              <dl className="wm-review-facts"><div><dt>Current weight</dt><dd>{profile.weightKg ? `${number(profile.weightKg)} kg` : 'Not set'}</dd></div><div><dt>Height</dt><dd>{profile.heightCm ? `${number(profile.heightCm)} cm` : 'Not set'}</dd></div><div><dt>BMI</dt><dd>{number(profile.currentBmi)}</dd></div><div><dt>Diet</dt><dd>{dietLabel(profile.dietType)}</dd></div></dl>
              <p className="wm-allergy-line"><strong>Allergies:</strong> {allergies.length ? [...new Set(allergies)].join(', ') : 'None declared'}</p>
            </> : <p>Create your health profile to continue.</p>}
          </div>
          <p className="wm-notice"><PlannerIcon name="info" /><span>{weightGoal ? 'Your goal is checked again when you create the menu. A failed safety check never saves a plan. Future adjustments require the same checks and your confirmation.' : 'The server checks your profile and calculates maintenance calories when you create the plan. Each creation is saved separately; existing menus keep their original information.'}</span></p>
        </div>}
      </fieldset>
      {(error || safetyError) && <div role="alert" className="wm-alert">{error || safetyError}</div>}
      <div className="wm-setup-footer">
        <button type="button" className="wm-text-button" disabled={busy || checking} onClick={() => step ? setStep(value => value - 1) : onCancel()}>{step ? 'Back' : 'Cancel setup'}</button>
        <button type="submit" className="wm-button wm-button-primary" disabled={busy || checking || (step === 2 && (loading || !profile || Boolean(profileError) || (weightGoal && !eligibility)))}>{checking ? 'Checking goal safety…' : busy ? 'Creating your menu…' : step < 2 ? 'Continue' : weightGoal && !safety?.allowed ? 'Check goal safety' : 'Create weekly menu'}{!busy && !checking && <PlannerIcon name="arrow" />}</button>
      </div>
    </form>
  </section>;
}
