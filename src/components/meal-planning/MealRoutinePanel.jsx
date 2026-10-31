import React, { useEffect, useRef, useState } from 'react';
import { confirmMealRevision, getMealPlan, previewMealRevision, updateMealReminders } from '../../services/mealPlanService';
import { dateLabel, number } from './plannerFormat';
import PlannerIcon from './PlannerIcon';
import DateInput from '../common/DateInput';

export default function MealRoutinePanel({ plan, onPlanChanged, onEditProfile, profileRevision }) {
  const r=plan.routine;
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [message,setMessage]=useState('');
  const [proposal,setProposal]=useState(null);
  const [target,setTarget]=useState(r.targetWeightKg);
  const [deadline,setDeadline]=useState(r.targetDate);
  const [eligible,setEligible]=useState(false);
  const [reminders,setReminders]=useState(r.remindersEnabled);
  const [zone,setZone]=useState(r.timeZoneId);
  const [times,setTimes]=useState({breakfastTime:r.breakfastTime.slice(0,5),lunchTime:r.lunchTime.slice(0,5),dinnerTime:r.dinnerTime.slice(0,5)});
  const lock=useRef(false);
  const alive=useRef(true);
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
  useEffect(()=>{setProposal(null);},[profileRevision,r.version,target,deadline]);
  const active=r.state==='active' || r.state==='continued';
  const entries=r.entries || [];
  const logged=entries.filter(e=>e.status!=='unlogged');
  const followed=logged.filter(e=>e.status==='followed').length;
  async function run(operation) {
    if(lock.current) return;
    lock.current=true;setBusy(true);setError('');setMessage('');
    try {await operation();}
    catch(failure) {if(alive.current) setError(failure.message);}
    finally {lock.current=false;if(alive.current) setBusy(false);}
  }
  const revisionRequest={expectedVersion:r.version,profileFingerprint:'',eligibilityConfirmed:eligible,targetWeightKg:Number(target),targetDate:deadline};
  async function review(nextWeek) {
    const preview=await previewMealRevision(plan.id,{...revisionRequest,nextWeek});
    if(alive.current) setProposal({...preview,request:{...revisionRequest,nextWeek}});
  }
  async function confirm() {
    if(!proposal?.allowed || !eligible) return;
    const updated=await confirmMealRevision(plan.id,{...proposal.request,expectedVersion:proposal.version,profileFingerprint:proposal.profileFingerprint});
    if(alive.current){onPlanChanged(updated);setMessage('Your new plan version is saved. Previous days remain in your history.');}
  }
  async function saveReminders(event) {
    event.preventDefault();
    await run(async()=>{
      const routine=await updateMealReminders(plan.id,{enabled:reminders,timeZoneId:zone,expectedVersion:r.version,
        ...Object.fromEntries(Object.entries(times).map(([key,value])=>[key,`${value}:00`]))});
      if(alive.current){onPlanChanged({...plan,routine});setMessage('Reminder preferences saved. Browser push also needs notification permission.');}
    });
  }
  return <section className="wm-routine" aria-labelledby="routine-heading" aria-busy={busy}>
    <div className="wm-section-heading"><div><span className="wm-eyebrow">Your weight goal</span><h2 id="routine-heading">A little progress, every day.</h2></div><span className="wm-tag">{active?'Active plan':'Previous version'}</span></div>
    <dl className="wm-review-facts"><div><dt>Target weight</dt><dd>{number(r.targetWeightKg)} kg</dd></div><div><dt>Target date</dt><dd>{dateLabel(r.targetDate)}</dd></div><div><dt>Meals recorded</dt><dd>{logged.length} / {entries.length}</dd></div><div><dt>Followed among recorded</dt><dd>{logged.length?`${Math.round(followed/logged.length*100)}%`:'No records yet'}</dd></div></dl>
    <p className="wm-muted">Record meals directly on the calendar above. Unlogged meals stay unlogged. Three-day reviews use at least six recorded meals; they may recommend a health profile update.</p>
    {active && <div className="wm-upcoming-grid">
      <details className="wm-future-feature"><summary><span className="wm-mode-symbol"><PlannerIcon name="bell" /></span><span><strong>Meal reminders</strong><span>Times in your selected timezone</span></span><PlannerIcon name="plus" /></summary><form onSubmit={saveReminders}><fieldset disabled={busy} className="wm-fields"><legend className="sr-only">Meal reminder preferences</legend><label className="wm-check-label"><input type="checkbox" checked={reminders} onChange={event=>setReminders(event.target.checked)} />Enable meal reminders</label><label>Timezone<input className="wm-control" required value={zone} onChange={event=>setZone(event.target.value)} /></label><div className="wm-reminder-preview">{Object.entries(times).map(([key,value])=><label key={key}>{key.replace('Time','')}<input type="time" required value={value} onChange={event=>setTimes(current=>({...current,[key]:event.target.value}))} /></label>)}</div><button className="wm-button wm-button-primary" type="submit">Save reminders</button></fieldset></form></details>
      {r.state === 'active' ? <details className="wm-future-feature" open><summary><span className="wm-mode-symbol"><PlannerIcon name="target" /></span><span><strong>Review your next steps</strong><span>Fresh safety checks before any change</span></span><PlannerIcon name="plus" /></summary><div>
        <button type="button" className="wm-text-button" onClick={onEditProfile}>Update health profile first <PlannerIcon name="arrow" /></button>
        <p>Your current TDEE, remaining timeline and calorie deficit or surplus are checked again. Past days stay in your history.</p>
        <fieldset className="wm-fields" disabled={busy}><legend className="sr-only">Goal adjustment</legend><label>Target weight (kg)<input className="wm-control" type="number" min="30" max="200" step="0.1" value={target} onChange={event=>setTarget(event.target.value)} /></label><label>Target date<DateInput value={deadline} onChange={event=>setDeadline(event.target.value)} inputClassName="wm-control" /></label><label className="wm-check-label"><input type="checkbox" checked={eligible} onChange={event=>{setEligible(event.target.checked);setProposal(null);}} />I still meet the weight goal eligibility conditions: age 20–65, not pregnant or breastfeeding, and no clinician-managed nutrition.</label>
        <div className="wm-routine-actions"><button type="button" className="wm-button wm-button-secondary" onClick={()=>run(()=>review(false))}>Review adjustment</button><button type="button" className="wm-button wm-button-secondary" onClick={()=>run(()=>review(true))}>Plan next week</button></div></fieldset>
        {proposal && <div className={proposal.allowed?'wm-notice':'wm-alert'} role="status">{!proposal.allowed?<div><strong>This goal needs adjustment.</strong><ul>{proposal.reasons.map(reason=><li key={reason}>{reason}</li>)}</ul><p>Extend the timeline or adjust the target, then review again.</p></div>:<div><strong>{proposal.nextWeek?'Next week proposal':'Future days proposal'}</strong><dl className="wm-review-facts"><div><dt>Current daily target</dt><dd>{number(proposal.previousCalories)} kcal</dd></div><div><dt>New daily target</dt><dd>{number(proposal.targetCalories)} kcal</dd></div><div><dt>Recalculated TDEE</dt><dd>{number(proposal.tdee)} kcal</dd></div><div><dt>Daily adjustment</dt><dd>{number(proposal.dailyAdjustment)} kcal</dd></div></dl><p>Applies from {dateLabel(proposal.effectiveFrom)}. {proposal.significantChange?'The calorie target has changed by at least 100 kcal.':'There is no significant calorie change; you may keep your current plan.'}</p><button type="button" className="wm-button wm-button-primary" disabled={busy || !eligible} onClick={()=>run(confirm)}>Confirm new version</button></div>}</div>}
      </div></details> : <p className="wm-notice">Your next week is already planned. You can still record this week's meals and manage its reminders. Select the latest week from saved plans to review your goal.</p>}
    </div>}
    {error && <div className="wm-alert" role="alert">{error}<button type="button" className="wm-text-button" disabled={busy} onClick={()=>run(async()=>{const fresh=await getMealPlan(plan.id);if(alive.current) onPlanChanged(fresh);})}>Reload plan</button></div>}
    <p className={message?'wm-status':'sr-only'} role="status">{message}</p>
  </section>;
}
