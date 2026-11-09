import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import MealRoutinePanel from './MealRoutinePanel';
import axios from '../../lib/axios';

let root, host, oldAdapter, requests;
const plan = {
  id: 20,
  startDate: '2026-10-17',
  endDate: '2026-10-23',
  menu: {
    targetDailyCalories: 2000,
    days: [{ date: '2026-10-17', meals: [{ mealTime: 'breakfast', name: 'Tofu congee' }] }],
  },
  routine: {
    mode: 'weight_goal',
    state: 'active',
    version: 3,
    targetWeightKg: 60,
    targetDate: '2027-01-01',
    timeZoneId: 'UTC',
    breakfastTime: '07:30:00',
    lunchTime: '12:00:00',
    dinnerTime: '18:30:00',
    remindersEnabled: false,
    entries: [{ date: '2026-10-17', mealTime: 'breakfast', status: 'unlogged', dueAt: '2026-10-17T00:00:00Z' }],
  },
};

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
  oldAdapter = axios.defaults.adapter;
  requests = [];
  axios.defaults.adapter = async config => {
    requests.push(config);
    if (config.url.endsWith('revision-preview')) {
      return {
        config,
        status: 200,
        headers: {},
        data: {
          allowed: false,
          reasons: ['The remaining timeline needs an unsafe calorie deficit.'],
          version: 3,
          profileFingerprint: 'abc',
          targetCalories: 900,
          tdee: 2000,
          effectiveFrom: '2026-10-18',
        },
      };
    }
    return { config, status: 200, headers: {}, data: { ...plan.routine, version: 4 } };
  };
});

afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  axios.defaults.adapter = oldAdapter;
});

test('unsafe reassessment displays the server reason and cannot confirm a revision', async () => {
  await act(async () => root.render(<MealRoutinePanel plan={plan} onPlanChanged={() => {}} onEditProfile={() => {}} />));
  const button = [...host.querySelectorAll('button')].find(b => b.textContent.includes('Review adjustment'));
  await act(async () => button.click());
  expect(host.textContent).toContain('The remaining timeline needs an unsafe calorie deficit.');
  expect([...host.querySelectorAll('button')].some(b => b.textContent.includes('Confirm new version'))).toBe(false);
  expect(requests.filter(r => r.url.endsWith('/revisions'))).toHaveLength(0);
});

test('shows the calendar tracking summary without a duplicate tracking form', async () => {
  await act(async () => root.render(
    <MealRoutinePanel
      plan={{ ...plan, routine: { ...plan.routine, entries: plan.routine.entries.map(e => ({ ...e, status: 'followed' })) } }}
      onPlanChanged={() => {}}
      onEditProfile={() => {}}
    />
  ));
  expect(host.textContent).toContain('1 / 1');
  expect(host.textContent).toContain('100%');
  expect(host.textContent).toContain('Record meals directly on the calendar above.');
  expect(host.querySelector('#tracking-date, .wm-tracking-list')).toBeNull();
  expect(requests).toHaveLength(0);
});

test('counts elapsed unrecorded meals as not followed without NaN', async () => {
  await act(async () => root.render(<MealRoutinePanel plan={plan} onPlanChanged={() => {}} onEditProfile={() => {}} />));
  expect(host.textContent).toContain('0 / 1');
  expect(host.textContent).toContain('0%');
  expect(host.textContent).not.toContain('NaN');
  expect(host.textContent).toContain('1 unrecorded');
});

test('renders prominent metric cards for meals recorded, followed rate, target weight, and target date', async () => {
  await act(async () => root.render(<MealRoutinePanel plan={plan} onPlanChanged={() => {}} onEditProfile={() => {}} />));
  const cards = host.querySelectorAll('.wm-routine-metric-card');
  expect(cards).toHaveLength(4);
  expect(host.textContent).toContain('Meals Recorded');
  expect(host.textContent).toContain('Followed Rate');
  expect(host.textContent).toContain('Target Weight');
  expect(host.textContent).toContain('Target Date');
  expect(host.textContent).toContain('60 kg');
});

test('submits reminder preferences through updateMealReminders', async () => {
  let changedRoutine = null;
  await act(async () => root.render(
    <MealRoutinePanel plan={plan} onPlanChanged={p => { changedRoutine = p; }} onEditProfile={() => {}} />
  ));
  const checkbox = host.querySelector('input[type="checkbox"]');
  await act(async () => checkbox.click());
  const saveBtn = [...host.querySelectorAll('button')].find(b => b.textContent.includes('Save reminders'));
  await act(async () => saveBtn.click());
  const reminderReq = requests.find(r => r.url.endsWith('/reminders'));
  expect(reminderReq).toBeDefined();
  expect(reminderReq.method).toBe('put');
  expect(changedRoutine).not.toBeNull();
  expect(host.textContent).toContain('Reminder preferences saved.');
});

test('allowed reassessment displays proposal facts and confirms a new version', async () => {
  axios.defaults.adapter = async config => {
    requests.push(config);
    if (config.url.endsWith('revision-preview')) {
      return {
        config,
        status: 200,
        headers: {},
        data: {
          allowed: true,
          reasons: [],
          version: 3,
          profileFingerprint: 'abc',
          previousCalories: 2000,
          targetCalories: 1850,
          tdee: 2200,
          dailyAdjustment: -350,
          effectiveFrom: '2026-10-18',
          significantChange: true,
          nextWeek: false,
        },
      };
    }
    if (config.url.endsWith('/revisions')) {
      return { config, status: 200, headers: {}, data: { ...plan, routine: { ...plan.routine, version: 4 } } };
    }
    return { config, status: 200, headers: {}, data: {} };
  };

  let updatedPlan = null;
  await act(async () => root.render(
    <MealRoutinePanel plan={plan} onPlanChanged={p => { updatedPlan = p; }} onEditProfile={() => {}} />
  ));
  // check eligibility
  const eligibleCheckbox = [...host.querySelectorAll('input[type="checkbox"]')].find(cb =>
    cb.parentElement.textContent.includes('eligibility conditions')
  );
  await act(async () => eligibleCheckbox.click());

  const reviewBtn = [...host.querySelectorAll('button')].find(b => b.textContent.includes('Review adjustment'));
  await act(async () => reviewBtn.click());

  expect(host.textContent).toContain('1,850 kcal');
  expect(host.textContent).toContain('2,200 kcal');
  const confirmBtn = [...host.querySelectorAll('button')].find(b => b.textContent.includes('Confirm new version'));
  expect(confirmBtn).toBeDefined();
  expect(confirmBtn.disabled).toBe(false);

  await act(async () => confirmBtn.click());
  expect(requests.filter(r => r.url.endsWith('/revisions'))).toHaveLength(1);
  expect(updatedPlan).not.toBeNull();
  expect(host.textContent).toContain('Your new plan version is saved.');
});
