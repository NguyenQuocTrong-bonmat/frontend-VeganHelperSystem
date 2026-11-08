import React, { useEffect, useRef, useState } from 'react';
import { confirmMealRevision, getMealPlan, previewMealRevision, updateMealReminders } from '../../services/mealPlanService';
import { wholeNumber, dateLabel, number } from './plannerFormat';
import PlannerIcon from './PlannerIcon';
import DateInput from '../common/DateInput';
import TimeZoneSelect from './TimeZoneSelect';

export default function MealRoutinePanel({ plan, onPlanChanged, onEditProfile, profileRevision }) {
  const r = plan.routine;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [proposal, setProposal] = useState(null);
  const [target, setTarget] = useState(r.targetWeightKg);
  const [deadline, setDeadline] = useState(r.targetDate);
  const [eligible, setEligible] = useState(false);
  const [reminders, setReminders] = useState(r.remindersEnabled);
  const [zone, setZone] = useState(r.timeZoneId);
  const [times, setTimes] = useState({
    breakfastTime: r.breakfastTime.slice(0, 5),
    lunchTime: r.lunchTime.slice(0, 5),
    dinnerTime: r.dinnerTime.slice(0, 5),
  });

  const lock = useRef(false);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);

  useEffect(() => {
    setProposal(null);
  }, [profileRevision, r.version, target, deadline]);

  const active = r.state === 'active' || r.state === 'continued';
  const entries = r.entries || [];
  const logged = entries.filter(e => e.status !== 'unlogged');
  const followed = logged.filter(e => e.status === 'followed').length;
  const unloggedCount = entries.length - logged.length;

  async function run(operation) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await operation();
    } catch (failure) {
      if (alive.current) setError(failure.message);
    } finally {
      lock.current = false;
      if (alive.current) setBusy(false);
    }
  }

  const revisionRequest = {
    expectedVersion: r.version,
    profileFingerprint: '',
    eligibilityConfirmed: eligible,
    targetWeightKg: Number(target),
    targetDate: deadline,
  };

  async function review(nextWeek) {
    const preview = await previewMealRevision(plan.id, { ...revisionRequest, nextWeek });
    if (alive.current) setProposal({ ...preview, request: { ...revisionRequest, nextWeek } });
  }

  async function confirm() {
    if (!proposal?.allowed || !eligible) return;
    const updated = await confirmMealRevision(plan.id, {
      ...proposal.request,
      expectedVersion: proposal.version,
      profileFingerprint: proposal.profileFingerprint,
    });
    if (alive.current) {
      onPlanChanged(updated);
      setMessage('Your new plan version is saved. Previous days remain in your history.');
    }
  }

  async function saveReminders(event) {
    event.preventDefault();
    await run(async () => {
      const routine = await updateMealReminders(plan.id, {
        enabled: reminders,
        timeZoneId: zone,
        expectedVersion: r.version,
        ...Object.fromEntries(Object.entries(times).map(([key, value]) => [key, `${value}:00`])),
      });
      if (alive.current) {
        onPlanChanged({ ...plan, routine });
        setMessage('Reminder preferences saved. Browser push also needs notification permission.');
      }
    });
  }

  return (
    <section className="wm-routine" aria-labelledby="routine-heading" aria-busy={busy}>
      <div className="wm-section-heading">
        <div>
          <span className="wm-eyebrow">Your weight goal</span>
          <h2 id="routine-heading">Weekly Progress & Routine Management</h2>
        </div>
        <span className="wm-tag">{active ? 'Active plan' : 'Previous version'}</span>
      </div>

      {/* Prominent Metric KPI Cards */}
      <div className="wm-routine-metrics-grid">
        <div className="wm-routine-metric-card">
          <div className="wm-metric-icon"><PlannerIcon name="calendar" /></div>
          <div className="wm-metric-content">
            <span className="wm-metric-label">Meals Recorded</span>
            <strong className="wm-metric-value">{logged.length} / {entries.length}</strong>
            <span className="wm-metric-sub">{unloggedCount > 0 ? `${unloggedCount} unrecorded` : 'All meals recorded'}</span>
          </div>
        </div>

        <div className="wm-routine-metric-card">
          <div className="wm-metric-icon"><PlannerIcon name="target" /></div>
          <div className="wm-metric-content">
            <span className="wm-metric-label">Followed Rate</span>
            <strong className="wm-metric-value">{logged.length ? `${Math.round(followed / logged.length * 100)}%` : 'No records yet'}</strong>
            <span className="wm-metric-sub">{logged.length ? `${followed} of ${logged.length} followed` : 'Record meals to view'}</span>
          </div>
        </div>

        <div className="wm-routine-metric-card">
          <div className="wm-metric-icon"><PlannerIcon name="sun" /></div>
          <div className="wm-metric-content">
            <span className="wm-metric-label">Target Weight</span>
            <strong className="wm-metric-value">{number(r.targetWeightKg)} <small>kg</small></strong>
            <span className="wm-metric-sub">Weight goal target</span>
          </div>
        </div>

        <div className="wm-routine-metric-card">
          <div className="wm-metric-icon"><PlannerIcon name="leaf" /></div>
          <div className="wm-metric-content">
            <span className="wm-metric-label">Target Date</span>
            <strong className="wm-metric-value">{dateLabel(r.targetDate)}</strong>
            <span className="wm-metric-sub">Target completion</span>
          </div>
        </div>
      </div>

      <p className="wm-muted">Record meals directly on the calendar above. Unlogged meals stay unlogged. Three-day reviews use at least six recorded meals; they may recommend a health profile update.</p>

      {active && (
        <div className="wm-upcoming-grid wm-routine-panels-grid">
          {/* Accordion 1: Meal Reminders */}
          <details className="wm-future-feature wm-routine-accordion">
            <summary>
              <span className="wm-mode-symbol"><PlannerIcon name="bell" /></span>
              <span>
                <strong>Meal reminders</strong>
                <span>Times in your selected timezone</span>
              </span>
              <PlannerIcon name="plus" />
            </summary>
            <div>
              <form onSubmit={saveReminders}>
                <fieldset disabled={busy} className="wm-fields">
                  <legend className="sr-only">Meal reminder preferences</legend>
                  <label className="wm-check-label">
                    <input
                      type="checkbox"
                      checked={reminders}
                      onChange={event => setReminders(event.target.checked)}
                    />
                    Enable meal reminders
                  </label>
                  <label htmlFor={`routine-timezone-${plan.id}`}>
                    Timezone
                    <TimeZoneSelect
                      id={`routine-timezone-${plan.id}`}
                      required
                      value={zone}
                      onChange={event => setZone(event.target.value)}
                    />
                  </label>
                  <div className="wm-reminder-preview">
                    {Object.entries(times).map(([key, value]) => (
                      <label key={key}>
                        {key.replace('Time', '')}
                        <input
                          type="time"
                          required
                          value={value}
                          onChange={event => setTimes(current => ({ ...current, [key]: event.target.value }))}
                        />
                      </label>
                    ))}
                  </div>
                  <button className="wm-button wm-button-primary" type="submit" disabled={busy}>
                    {busy ? 'Saving…' : 'Save reminders'}
                  </button>
                </fieldset>
              </form>
            </div>
          </details>

          {/* Accordion 2: Review & Adjust Goal */}
          {r.state === 'active' ? (
            <details className="wm-future-feature wm-routine-accordion" open>
              <summary>
                <span className="wm-mode-symbol"><PlannerIcon name="target" /></span>
                <span>
                  <strong>Review your next steps</strong>
                  <span>Fresh safety checks before any change</span>
                </span>
                <PlannerIcon name="plus" />
              </summary>
              <div>
                <button type="button" className="wm-text-button" onClick={onEditProfile}>
                  Update health profile first <PlannerIcon name="arrow" />
                </button>
                <p>Your current TDEE, remaining timeline and calorie deficit or surplus are checked again. Past days stay in your history.</p>

                <fieldset className="wm-fields" disabled={busy}>
                  <legend className="sr-only">Goal adjustment</legend>
                  <label>
                    Target weight (kg)
                    <input
                      className="wm-control"
                      type="number"
                      min="30"
                      max="200"
                      step="0.1"
                      value={target}
                      onChange={event => setTarget(event.target.value)}
                    />
                  </label>
                  <label>
                    Target date
                    <DateInput
                      value={deadline}
                      onChange={event => setDeadline(event.target.value)}
                      inputClassName="wm-control"
                    />
                  </label>
                  <label className="wm-check-label">
                    <input
                      type="checkbox"
                      checked={eligible}
                      onChange={event => { setEligible(event.target.checked); setProposal(null); }}
                    />
                    I still meet the weight goal eligibility conditions: age 18–65, not pregnant or breastfeeding, and no clinician-managed nutrition.
                  </label>
                  <div className="wm-routine-actions">
                    <button type="button" className="wm-button wm-button-secondary" disabled={busy} onClick={() => run(() => review(false))}>
                      Review adjustment
                    </button>
                    <button type="button" className="wm-button wm-button-secondary" disabled={busy} onClick={() => run(() => review(true))}>
                      Plan next week
                    </button>
                  </div>
                </fieldset>

                {proposal && (
                  <div className={proposal.allowed ? 'wm-notice' : 'wm-alert wm-guidance'} role="status">
                    {!proposal.allowed ? (
                      <div>
                        <strong>Guidance for your next step</strong>
                        <ul>
                          {proposal.reasons.map(reason => <li key={reason}>{reason}</li>)}
                        </ul>
                      </div>
                    ) : (
                      <div>
                        <strong>{proposal.nextWeek ? 'Next week proposal' : 'Future days proposal'}</strong>
                        <dl className="wm-review-facts wm-proposal-facts">
                          <div><dt>Current daily target</dt><dd>{wholeNumber(proposal.previousCalories)} kcal</dd></div>
                          <div><dt>New daily target</dt><dd>{wholeNumber(proposal.targetCalories)} kcal</dd></div>
                          <div><dt>Recalculated TDEE</dt><dd>{wholeNumber(proposal.tdee)} kcal</dd></div>
                          <div><dt>Daily adjustment</dt><dd>{wholeNumber(proposal.dailyAdjustment)} kcal</dd></div>
                        </dl>
                        <p>
                          Applies from {dateLabel(proposal.effectiveFrom)}.{' '}
                          {proposal.significantChange
                            ? 'The calorie target has changed by at least 100 kcal.'
                            : 'There is no significant calorie change; you may keep your current plan.'}
                        </p>
                        <button
                          type="button"
                          className="wm-button wm-button-primary"
                          disabled={busy || !eligible}
                          onClick={() => run(confirm)}
                        >
                          Confirm new version
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </details>
          ) : (
            <p className="wm-notice">
              Your next week is already planned. You can still record this week's meals and manage its reminders. Select the latest week from saved plans to review your goal.
            </p>
          )}
        </div>
      )}

      {error && (
        <div className="wm-alert" role="alert">
          {error}
          <button
            type="button"
            className="wm-text-button"
            disabled={busy}
            onClick={() => run(async () => {
              const fresh = await getMealPlan(plan.id);
              if (alive.current) onPlanChanged(fresh);
            })}
          >
            Reload plan
          </button>
        </div>
      )}

      <p className={message ? 'wm-status' : 'sr-only'} role="status">{message}</p>
    </section>
  );
}
