import React, { useEffect, useId, useRef, useState } from 'react';
import { confirmMealRevision, previewMealRevision } from '../../services/mealPlanService';
import DateInput from '../common/DateInput';
import PlannerIcon from './PlannerIcon';
import { dateLabel, wholeNumber, zonedToday } from './plannerFormat';

export default function CompletedWeekPanel({ plan, canGenerate = true, onViewHistory, onOpenPlan, onCreateBalanced, onPlanChanged, onEditProfile, profileRevision }) {
  const r = plan.routine;
  const id = useId();
  const [formOpen, setFormOpen] = useState(false);
  const [deferred, setDeferred] = useState(false);
  const [weight, setWeight] = useState('');
  const [target, setTarget] = useState(r?.targetWeightKg ?? '');
  const [deadline, setDeadline] = useState(r?.targetDate ?? '');
  const [start, setStart] = useState(() => zonedToday(r?.timeZoneId));
  const [eligible, setEligible] = useState(false);
  const [proposal, setProposal] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const lock = useRef(false);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useEffect(() => { setProposal(null); setError(''); }, [weight, target, deadline, start, eligible, profileRevision]);
  const goal = r?.mode === 'weight_goal';
  const nextId = r?.nextPlanId;
  const canContinue = canGenerate && goal && r?.state === 'active' && !nextId;

  async function perform(action) {
    if (lock.current) return;
    lock.current = true; setBusy(true); setError('');
    try { await action(); }
    catch (failure) { if (alive.current) setError(failure.message); }
    finally { lock.current = false; if (alive.current) setBusy(false); }
  }
  async function review(event) {
    event.preventDefault();
    setProposal(null);
    if (!weight || Number(weight) < 30 || Number(weight) > 200) { setError('Enter your current weight between 30 and 200 kg.'); return; }
    if (!eligible) { setError('Please confirm that the weight goal eligibility conditions still apply to you.'); return; }
    await perform(async () => {
      const request = { nextWeek: true, currentWeightKg: Number(weight), startDate: start,
        targetWeightKg: Number(target), targetDate: deadline, eligibilityConfirmed: eligible,
        expectedVersion: r.version, profileFingerprint: '' };
      const preview = await previewMealRevision(plan.id, request);
      if (alive.current) setProposal({ ...preview, request });
    });
  }
  async function confirm() {
    if (!canGenerate || !proposal?.allowed || !eligible) return;
    await perform(async () => {
      const updated = await confirmMealRevision(plan.id, { ...proposal.request,
        expectedVersion: proposal.version, profileFingerprint: proposal.profileFingerprint });
      if (alive.current) onPlanChanged(updated);
    });
  }

  return <div className="wm-completed-week" aria-busy={busy}>
    <div className="wm-completed-symbol" aria-hidden="true"><PlannerIcon name="calendar" /></div>
    <span className="wm-eyebrow">A moment to check in</span>
    <h3>Your week is complete</h3>
    <p>{nextId ? 'Your next week is already planned. Open it to continue, or revisit your completed meals.'
      : !canGenerate ? 'Please renew your package before creating another week. Your completed menu remains available in Plan history.'
      : goal ? 'Would you like to continue planning toward your weight goal? Check in with your current weight before we prepare another week.'
      : 'Your completed menu is saved in Plan history. Would you like to plan another balanced week?'}</p>
    {deferred && <p role="status" className="wm-muted">No new plan has been created. You can return whenever you are ready.</p>}
    {!formOpen && <div className="wm-completed-actions">
      {nextId ? <button type="button" className="wm-button wm-button-primary" onClick={() => onOpenPlan(nextId)}>Open next week <PlannerIcon name="arrow" /></button>
        : canContinue ? <button type="button" className="wm-button wm-button-primary" onClick={() => { setFormOpen(true); setDeferred(false); }}>Plan next week <PlannerIcon name="arrow" /></button>
          : !canGenerate ? null : !goal ? <button type="button" className="wm-button wm-button-primary" onClick={onCreateBalanced}>Create a balanced week <PlannerIcon name="arrow" /></button>
            : <p className="wm-muted">Select the latest plan from Plan history to continue your goal.</p>}
      <button type="button" className="wm-button wm-button-secondary" onClick={onViewHistory}>View completed week</button>
      {!deferred && <button type="button" className="wm-text-button" onClick={() => setDeferred(true)}>Not now</button>}
    </div>}
    {formOpen && canContinue && <form onSubmit={review} className="wm-continuation-form">
      <p>Your original target is kept below. If it no longer suits your circumstances, you may revise it before the safety check.</p>
      <fieldset disabled={busy} className="wm-fields">
        <legend className="sr-only">Next week check-in</legend>
        <label htmlFor={`${id}-weight`}>Current weight (kg)
          <input id={`${id}-weight`} className="wm-control" type="number" min="30" max="200" step="0.1" required autoFocus value={weight} onChange={e => setWeight(e.target.value)} aria-describedby={`${id}-weight-help`} />
          <span id={`${id}-weight-help`} className="wm-muted">Saved to your health profile only when your new plan is successfully created.</span>
        </label>
        <label htmlFor={`${id}-start`}>When does your next week begin?
          <DateInput id={`${id}-start`} required value={start} min={zonedToday(r.timeZoneId)} inputClassName="wm-control" onChange={e => setStart(e.target.value)} />
        </label>
        <label htmlFor={`${id}-target`}>Target weight (kg)
          <input id={`${id}-target`} className="wm-control" type="number" min="30" max="200" step="0.1" required value={target} onChange={e => setTarget(e.target.value)} />
        </label>
        <label htmlFor={`${id}-deadline`}>Target date
          <DateInput id={`${id}-deadline`} required value={deadline} inputClassName="wm-control" onChange={e => setDeadline(e.target.value)} />
        </label>
        <label className="wm-check-label"><input type="checkbox" required checked={eligible} onChange={e => setEligible(e.target.checked)} />
          I still meet the weight goal eligibility conditions: age 18–65, not pregnant or breastfeeding, and no clinician-managed nutrition.
        </label>
        <div className="wm-completed-actions">
          <button type="submit" className="wm-button wm-button-primary">{busy ? 'Checking…' : 'Check and continue'}</button>
          <button type="button" className="wm-text-button" onClick={() => { setFormOpen(false); setProposal(null); setError(''); }}>Cancel</button>
          <button type="button" className="wm-text-button" onClick={onEditProfile}>Review health profile</button>
        </div>
      </fieldset>
      {error && <div role="alert" className="wm-alert wm-guidance">{error}</div>}
      {proposal && <div role="status" className={proposal.allowed ? 'wm-notice' : 'wm-alert wm-guidance'}>
        {!proposal.allowed ? <><strong>Guidance for your next step</strong><ul>{proposal.reasons.map(reason => <li key={reason}>{reason}</li>)}</ul><p>You can extend your target date, review your goal, or choose a balanced menu.</p><button type="button" className="wm-text-button" disabled={busy} onClick={onCreateBalanced}>Choose a balanced menu</button></>
          : <><strong>Your next week proposal</strong><p>Starts {dateLabel(proposal.effectiveFrom)} · Current weight {weight} kg</p>
            <dl className="wm-review-facts wm-proposal-facts"><div><dt>Recalculated TDEE</dt><dd>{wholeNumber(proposal.tdee)} kcal</dd></div><div><dt>New daily target</dt><dd>{wholeNumber(proposal.targetCalories)} kcal</dd></div><div><dt>Daily adjustment</dt><dd>{wholeNumber(proposal.dailyAdjustment)} kcal</dd></div></dl>
            <p>Your completed week stays unchanged. Creating this week uses one generation under your current access.</p>
            <button type="button" className="wm-button wm-button-primary" disabled={busy || !eligible} onClick={confirm}>{busy ? 'Creating…' : 'Confirm next week'}</button></>}
      </div>}
    </form>}
  </div>;
}
