import React, { useEffect, useRef, useState } from 'react';
import { getHealthProfile } from '../../services/healthProfileService';
import { wholeNumber, dateLabel, dietLabel, number, utcToday, zonedToday } from './plannerFormat';
import PlannerIcon from './PlannerIcon';
import TimeZoneSelect from './TimeZoneSelect';
import { previewGoal } from '../../services/mealPlanService';
import { formatDate } from '../../utils/dateUtils';
import DateInput from '../common/DateInput';

const formatDayFirstDate = formatDate;

function goalSafetyField(reason) {
  const message = reason.toLowerCase();
  if (/weekly menu cannot assess/.test(message)) return 'professionalAdvice';
  if (/target weight|requested target weight/.test(message)) return 'targetWeight';
  if (/target date|0\.5 kg per week|calorie deficit or surplus|daily intake falls below/.test(message)) return 'targetDate';
  if (/not pregnant|breastfeeding|clinician-managed/.test(message)) return 'eligibility';
  if (/health profile|current measurements|adults aged|date of birth|height|activity level|biological sex/.test(message)) return 'profile';
  return 'general';
}

function groupGoalSafetyErrors(reasons) {
  return reasons.reduce((errors, reason) => {
    const field = goalSafetyField(reason);
    errors[field] = [...(errors[field] || []), reason];
    return errors;
  }, {});
}

function suggestGoalDate(profile, startDate, targetWeightKg) {
  if (!profile || !startDate || !(targetWeightKg >= 30 && targetWeightKg <= 200)) return {};
  const height = Number(profile.heightCm);
  const weight = Number(profile.weightKg);
  const birthDate = profile.birthDate;
  const sex = profile.biologicalSex;
  const activity = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 }[profile.activityLevel];
  if (!(height >= 100 && height <= 250) || !(weight >= 30 && weight <= 200) || !birthDate || !activity || !['male', 'female'].includes(sex)) return {};
  const [year, month, day] = startDate.split('-').map(Number);
  const asOf = new Date(Date.UTC(year, month - 1, day));
  const [birthYear, birthMonth, birthDay] = birthDate.slice(0, 10).split('-').map(Number);
  let age = year - birthYear;
  if (month < birthMonth || (month === birthMonth && day < birthDay)) age--;
  if (!Number.isFinite(asOf.getTime()) || !(age >= 18 && age <= 65)) return {};
  const tdee = (10 * weight + 6.25 * height - 5 * age + (sex === 'male' ? 5 : -161)) * activity;
  const currentBmi = weight / (height / 100) ** 2;
  const targetBmi = targetWeightKg / (height / 100) ** 2;
  if (targetBmi < 18.5) {
    return { weightIssue: 'This target weight would put your estimated BMI below 18.5. Choose a higher target weight to avoid aiming for an underweight range.' };
  }
  if (targetBmi >= 25 && targetWeightKg >= weight) {
    return { weightIssue: 'At this estimated BMI, the planner supports gradual weight loss. Choose a target weight below your current weight, or use a balanced menu to maintain it.' };
  }
  if (currentBmi < 18.5 || currentBmi >= 40) {
    return { dateIssue: 'A doctor or registered dietitian can help you choose a goal that fits your health needs.' };
  }
  const delta = targetWeightKg - weight;
  const minimumCalories = sex === 'male' ? 1500 : 1200;
  for (let days = 7; days <= 730; days++) {
    const adjustment = delta * 7700 / days;
    const targetCalories = tdee + adjustment;
    const menuCalorieTolerance = targetCalories * 0.1;
    const maximumDailyAdjustment = Math.min(500, tdee * 0.2);
    if (Math.abs(delta) * 7 / days <= 0.5
      // Leave enough room for the generator's allowed +/-10% daily calorie variation.
      && Math.abs(adjustment) + menuCalorieTolerance <= maximumDailyAdjustment
      && targetCalories - menuCalorieTolerance >= minimumCalories) {
      asOf.setUTCDate(asOf.getUTCDate() + days);
      return { date: asOf.toISOString().slice(0, 10) };
    }
  }
  return { dateIssue: 'A smaller first milestone may give you a more manageable timeline. Try a target weight closer to your current weight.' };
}



export default function PlanSetupFlow({ busy, onGenerate, onCancel, onEditProfile, error, profileRevision }) {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState('balanced');
  const [startDate, setStartDate] = useState(utcToday);
  const [menuName, setMenuName] = useState(() => `Week of ${formatDayFirstDate(utcToday())}`);
  const [menuNameEdited, setMenuNameEdited] = useState(false);
  const menuNameField = useRef(null);
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
  const [goalErrors, setGoalErrors] = useState({});
  const targetDateManuallyEdited = useRef(false);
  const active = useRef(true);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  useEffect(() => { setSafety(null); }, [startDate, targetWeight, targetDate, eligibility, timeZoneId, profileRevision]);
  const heading = useRef(null);
  const weightGoal = mode === 'weight-goal';
  const goalSuggestion = React.useMemo(
    () => weightGoal ? suggestGoalDate(profile, startDate, Number(targetWeight)) : {},
    [weightGoal, profile, startDate, targetWeight],
  );
  const profileHeight = Number(profile?.heightCm);
  const needsProfessionalAdvice = weightGoal && profileHeight >= 100 && profileHeight <= 250
    && Number(profile?.weightKg) / (profileHeight / 100) ** 2 >= 40;
  const professionalAdvice = weightGoal && (goalErrors.professionalAdvice?.[0] || (needsProfessionalAdvice
    ? 'A doctor or registered dietitian can help you find an approach that supports your health and fits your needs. Weekly Menu cannot assess those needs closely enough to create a weight loss plan for you.'
    : ''));
  const weightErrors = professionalAdvice ? [] : (goalErrors.targetWeight ?? (goalSuggestion.weightIssue ? [goalSuggestion.weightIssue] : []));
  const dateErrors = professionalAdvice ? [] : (goalErrors.targetDate ?? (goalSuggestion.dateIssue ? [goalSuggestion.dateIssue] : []));
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
    menuNameField.current?.setCustomValidity(menuName.trim() ? '' : 'Enter a name for this weekly menu.');
  }, [menuName]);

  useEffect(() => {
    if (!weightGoal || targetDateManuallyEdited.current) return;
    setTargetDate(goalSuggestion.date || '');
  }, [weightGoal, goalSuggestion]);

  useEffect(() => {
    let active = true;
    setLoading(true); setProfileError(''); setGoalErrors({});
    getHealthProfile().then(data => { if (active) setProfile(data); })
      .catch(failure => { if (active) { setProfile(null); setProfileError(failure.status === 404 ? 'Create your health profile before planning your week.' : failure.message); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [refresh, profileRevision]);

  useEffect(() => { heading.current?.focus(); }, [step]);
  useEffect(() => {
    if (step !== 1) return;
    if (goalErrors.targetDate?.length) document.getElementById('goal-date')?.focus();
    else if (goalErrors.targetWeight?.length) document.getElementById('goal-weight')?.focus();
    else if (goalErrors.eligibility?.length) document.getElementById('goal-eligibility')?.focus();
  }, [step, goalErrors]);

  function clearGoalErrors(...fields) {
    setGoalErrors(current => {
      if (!fields.some(field => current[field])) return current;
      const next = { ...current };
      fields.forEach(field => delete next[field]);
      return next;
    });
  }

  async function submit(event) {
    event.preventDefault();
    if (busy || checking || (step >= 1 && professionalAdvice)) return;
    if (step >= 1 && !menuName.trim()) {
      menuNameField.current?.setCustomValidity('Enter a name for this weekly menu.');
      menuNameField.current?.reportValidity();
      return;
    }
    if (!event.currentTarget.checkValidity()) { event.currentTarget.reportValidity(); return; }
    if (step === 1 && !splitIsValid) {
      setSplitError('Adjust the shares for breakfast, lunch and dinner so each is between 1% and 98% and the total is 100%.');
      return;
    }
    if (step < 2) { setStep(value => value + 1); return; }
    if (loading || !profile || profileError) return;
    if (!weightGoal) {
      onGenerate({ name: menuName.trim(), startDate, mealCalorieSplit, clientPreview: { mode: 'maintenance', profile, mealCalorieSplit } });
      return;
    }
    if (!eligibility) return;
    const payload={name:menuName.trim(),startDate,mode:'weight_goal',targetWeightKg:Number(targetWeight),targetDate,eligibilityConfirmed:eligibility,timeZoneId,mealCalorieSplit,
      remindersEnabled:reminders,...Object.fromEntries(Object.entries(times).map(([key,value])=>[key,`${value}:00`]))};
    if (safety?.allowed) {
      onGenerate({ ...payload, mealCalorieSplit, clientPreview: { mode: 'weight_goal', profile, safety, mealCalorieSplit } });
      return;
    }
    setChecking(true);
    try {
      const result=await previewGoal(payload);
      if (!active.current) return;
      setSafety(result);
      if (result.allowed) setGoalErrors({});
      else {
        setGoalErrors(groupGoalSafetyErrors(result.reasons || ['This goal could not pass the safety check. Review your goal and timeline.']));
        setStep(1);
      }
    } catch(failure) {
      if (active.current) {
        setGoalErrors(groupGoalSafetyErrors([failure.message]));
        setStep(1);
      }
    }
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
    <div className="wm-steps-compact" aria-label={`Plan setup progress: Step ${step + 1} of 3, ${['Your approach', 'Your schedule', 'Review & create'][step]}`}>
      <div className="wm-steps-compact-header">
        <span className="wm-steps-compact-badge">Step {step + 1} of 3</span>
        <span className="wm-steps-compact-title">{['Your approach', 'Your schedule', 'Review & create'][step]}</span>
      </div>
      <div className="wm-steps-compact-track" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={3}>
        <div className="wm-steps-compact-fill" style={{ width: `${((step + 1) / 3) * 100}%` }} />
      </div>
    </div>
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
          {professionalAdvice && <div role="status" className="wm-notice wm-guidance">{professionalAdvice}</div>}
          {!professionalAdvice && (goalErrors.general?.length || goalErrors.profile?.length) > 0 && <div role="alert" className="wm-goal-field-error">
            {[...(goalErrors.general || []), ...(goalErrors.profile || [])].map(reason => <p key={reason}>{reason}</p>)}
            {goalErrors.profile?.length > 0 && <button type="button" className="wm-text-button" onClick={onEditProfile}>Review health profile <PlannerIcon name="arrow" /></button>}
          </div>}
          <div className="wm-input-group"><label htmlFor="meal-plan-name">Menu name</label><input ref={menuNameField} className="wm-control" id="meal-plan-name" name="name" type="text" maxLength={100} required value={menuName} onChange={event => { setMenuName(event.target.value); setMenuNameEdited(true); menuNameField.current?.setCustomValidity(''); }} aria-describedby="meal-plan-name-help" /><p id="meal-plan-name-help">Give this menu a name you can recognize later. You can rename it after saving.</p></div>
          <div className="wm-input-group"><label htmlFor="meal-plan-start">When does your week begin?</label><DateInput id="meal-plan-start" name="startDate" value={startDate} min={today} max={maxStartDate} required onChange={event => { const nextDate = event.target.value; targetDateManuallyEdited.current = false; setStartDate(nextDate); clearGoalErrors('targetDate'); if (!menuNameEdited) setMenuName(`Week of ${formatDayFirstDate(nextDate)}`); }} aria-describedby="start-date-help" inputClassName="wm-control" /><p id="start-date-help">Seven consecutive days, starting on your chosen date. Plan dates follow {weightGoal ? timeZoneId : 'UTC'}.</p></div>
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
            <div className="wm-input-group"><label htmlFor="goal-weight">Target weight <span>(kg)</span></label><input className="wm-control" id="goal-weight" type="number" min="30" max="200" step="0.1" required value={targetWeight} aria-invalid={Boolean(weightErrors?.length)} aria-describedby={weightErrors?.length ? 'goal-weight-error' : undefined} onChange={event => { targetDateManuallyEdited.current = false; setTargetWeight(event.target.value); clearGoalErrors('targetWeight', 'targetDate'); }} placeholder="Enter your target weight" /><p>Current weight: {profile?.weightKg ? `${number(profile.weightKg)} kg` : 'Add it in Health & Wellness.'}</p>{weightErrors?.length > 0 && <div id="goal-weight-error" role="alert" className="wm-goal-field-error wm-guidance">{weightErrors.map(reason => <p key={reason}>{reason}</p>)}</div>}</div>
            <div className="wm-input-group"><label htmlFor="goal-date">Target date</label><DateInput id="goal-date" name="targetDate" value={targetDate} min={startDate} required aria-invalid={Boolean(dateErrors?.length)} aria-describedby={dateErrors?.length ? 'goal-date-help goal-date-error' : 'goal-date-help'} inputClassName="wm-control" onChange={event => { targetDateManuallyEdited.current = true; setTargetDate(event.target.value); clearGoalErrors('targetDate'); }} /><p id="goal-date-help">The earliest date that meets the current safety limits is filled in automatically. You can enter a later date to make the change more gradual.</p>{dateErrors?.length > 0 && <div id="goal-date-error" role="alert" className="wm-goal-field-error wm-guidance">{dateErrors.map(reason => <p key={reason}>{reason}</p>)}</div>}</div>
            <div className="wm-input-group"><label htmlFor="goal-timezone">Timezone</label><TimeZoneSelect id="goal-timezone" required value={timeZoneId} onChange={event=>setTimeZoneId(event.target.value)} aria-describedby="goal-timezone-help" /><p id="goal-timezone-help">Defaults to your device timezone. Goal plan dates and reminder times use the selected timezone.</p></div>
            <label className="wm-check-label"><input id="goal-eligibility" type="checkbox" required checked={eligibility} aria-invalid={Boolean(goalErrors.eligibility?.length)} aria-describedby={goalErrors.eligibility?.length ? 'goal-eligibility-error' : undefined} onChange={event=>{ setEligibility(event.target.checked); clearGoalErrors('eligibility'); }} />I am aged 18–65, not pregnant or breastfeeding, and do not need clinician-managed nutrition.</label>
            {goalErrors.eligibility?.length > 0 && <div id="goal-eligibility-error" role="alert" className="wm-goal-field-error wm-guidance">{goalErrors.eligibility.map(reason => <p key={reason}>{reason}</p>)}</div>}
            <label className="wm-check-label"><input type="checkbox" checked={reminders} onChange={event=>setReminders(event.target.checked)} />Remind me at meal times</label>
            {reminders && <div className="wm-reminder-preview">{Object.entries(times).map(([key,value])=><label key={key}>{key.replace('Time','')}<input type="time" required value={value} onChange={event=>setTimes(current=>({...current,[key]:event.target.value}))} /></label>)}</div>}
          </>}
          <p className="wm-notice"><PlannerIcon name="calendar" /><span>{weightGoal ? 'A weight goal can span several weekly menus. Future adjustments will require your confirmation.' : 'One dish per meal. Your saved diet, allergies and estimated maintenance calories guide the menu.'} Only one active menu can cover any date. Delete or regenerate an overlapping menu before creating another.</span></p>
        </div>}
        {step === 2 && <div className="wm-review">
          <div className="wm-review-summary"><span className="wm-mode-symbol"><PlannerIcon name={weightGoal ? 'target' : 'leaf'} /></span><div><h3>{menuName.trim()}</h3><p>{weightGoal ? 'Weight goal plan' : 'Balanced weekly menu'} · Starts {dateLabel(startDate)} · 7 days · 21 meals</p></div></div>
          <dl className="wm-review-facts wm-meal-split-review"><div><dt>Breakfast</dt><dd>{mealSplit.breakfast}%</dd></div><div><dt>Lunch</dt><dd>{mealSplit.lunch}%</dd></div><div><dt>Dinner</dt><dd>{mealSplit.dinner}%</dd></div></dl>
          {weightGoal && <><dl className="wm-review-facts"><div><dt>Target weight</dt><dd>{number(targetWeight)} kg</dd></div><div><dt>Target date</dt><dd>{dateLabel(targetDate)}</dd></div><div><dt>Daily calorie target</dt><dd>{safety?.allowed ? `${wholeNumber(safety.targetCalories)} kcal` : 'Safety review required'}</dd></div>{safety?.allowed && <><div><dt>Estimated TDEE</dt><dd>{wholeNumber(safety.tdee)} kcal</dd></div><div><dt>Daily adjustment</dt><dd>{wholeNumber(safety.dailyAdjustment)} kcal</dd></div></>}</dl>{safety && !safety.allowed && <div role="alert" className="wm-alert wm-guidance"><strong>Guidance for your goal</strong><ul>{safety.reasons?.map(reason=><li key={reason}>{reason}</li>)}</ul></div>}</>}
          <div className="wm-profile-review">
            <div className="wm-section-heading"><h3>Your saved health profile</h3><button type="button" className="wm-text-button" onClick={onEditProfile}>Review health profile & allergies <PlannerIcon name="arrow" /></button></div>
            {loading ? <p role="status">Loading your health profile…</p> : profileError ? <div role="alert"><p>{profileError}</p><button type="button" className="wm-text-button" onClick={() => setRefresh(value => value + 1)}>Retry health profile</button></div> : profile ? <>
              <dl className="wm-review-facts"><div><dt>Current weight</dt><dd>{profile.weightKg ? `${number(profile.weightKg)} kg` : 'Not set'}</dd></div><div><dt>Height</dt><dd>{profile.heightCm ? `${number(profile.heightCm)} cm` : 'Not set'}</dd></div><div><dt>BMI</dt><dd>{number(profile.currentBmi)}</dd></div><div><dt>Diet</dt><dd>{dietLabel(profile.dietType)}</dd></div></dl>
              <p className="wm-allergy-line"><strong>Allergies:</strong> {allergies.length ? [...new Set(allergies)].join(', ') : 'None declared'}</p>
            </> : <p>Create your health profile to continue.</p>}
          </div>
          <p className="wm-notice"><PlannerIcon name="info" /><span>{weightGoal ? 'Your goal is checked again when you create the menu. A failed safety check never saves a plan. Future adjustments require the same checks and your confirmation.' : 'The server checks your profile and calculates maintenance calories when you create the plan.'} Only one active menu can cover the same dates.</span></p>
        </div>}
      </fieldset>
      {error && <div role="alert" className="wm-alert">{error}</div>}
      <div className="wm-setup-footer">
        <button type="button" className="wm-text-button" disabled={busy || checking} onClick={() => step ? setStep(value => value - 1) : onCancel()}>{step ? 'Back' : 'Cancel setup'}</button>
        <button type="submit" className="wm-button wm-button-primary" disabled={busy || checking || (step >= 1 && Boolean(professionalAdvice)) || (step === 2 && (loading || !profile || Boolean(profileError) || (weightGoal && !eligibility)))}>{checking ? 'Checking goal safety…' : busy ? 'Creating your menu…' : step < 2 ? 'Continue' : weightGoal && !safety?.allowed ? 'Check goal safety' : 'Create weekly menu'}{!busy && !checking && <PlannerIcon name="arrow" />}</button>
      </div>
    </form>
  </section>;
}
