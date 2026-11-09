import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { vi } from 'vitest';
import CompletedWeekPanel from './CompletedWeekPanel';
import axios from '../../lib/axios';

const plan = { id: 20, startDate: '2026-11-02', endDate: '2026-11-08', routine: {
  mode: 'weight_goal', state: 'active', version: 3, timeZoneId: 'Asia/Ho_Chi_Minh', targetWeightKg: 58, targetDate: '2027-01-01' } };
let root, host, adapter, requests, onPlanChanged, onViewHistory, onOpenPlan;
const textButton = text => [...host.querySelectorAll('button')].find(b => b.textContent.includes(text));
const click = button => act(async () => button.click());
async function weight(value) {
  await act(async () => {
    const el = host.querySelector('input[type="number"]');
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
async function render(p = plan) { await act(async () => root.render(<CompletedWeekPanel plan={p} onPlanChanged={onPlanChanged} onViewHistory={onViewHistory} onOpenPlan={onOpenPlan} onCreateBalanced={() => {}} onEditProfile={() => {}} />)); }
async function submit() { await act(async () => host.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))); }
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(new Date('2026-11-09T00:00:00Z'));
  global.IS_REACT_ACT_ENVIRONMENT = true;
  host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host);
  adapter = axios.defaults.adapter; requests = []; onPlanChanged = vi.fn(); onViewHistory = vi.fn(); onOpenPlan = vi.fn();
  axios.defaults.adapter = async config => {
    requests.push(config);
    return { config, status: 200, headers: {}, data: config.url.endsWith('revision-preview')
      ? { allowed: true, version: 3, profileFingerprint: 'current-profile-and-weight', effectiveFrom: '2026-11-09', targetCalories: 1800, tdee: 2000, dailyAdjustment: -200 }
      : { ...plan, id: 21 } };
  };
});
afterEach(async () => { await act(async () => root.unmount()); host.remove(); axios.defaults.adapter = adapter; vi.useRealTimers(); });

test('offers continuation, history and deferral without automatically generating anything', async () => {
  await render(); expect(host.textContent).toContain('Your week is complete');
  await click(textButton('Not now')); expect(host.textContent).toContain('No new plan has been created');
  await click(textButton('View completed week')); expect(onViewHistory).toHaveBeenCalledOnce(); expect(requests).toHaveLength(0);
});
test('requires fresh current weight and preserves the original target by default', async () => {
  await render(); await click(textButton('Plan next week'));
  expect([...host.querySelectorAll('input[type="number"]')].map(e => e.value)).toEqual(['', '58']);
  await submit(); expect(requests).toHaveLength(0); expect(host.textContent).toContain('Enter your current weight');
  await weight('59.8'); await click(host.querySelector('input[type="checkbox"]')); await submit();
  expect(JSON.parse(requests[0].data)).toMatchObject({ nextWeek: true, currentWeightKg: 59.8, targetWeightKg: 58, targetDate: '2027-01-01', startDate: '2026-11-09' });
  expect(onPlanChanged).not.toHaveBeenCalled();
  expect(host.textContent).toContain('2,000 kcal');
  await click(textButton('Confirm next week'));
  expect(JSON.parse(requests[1].data)).toMatchObject({ currentWeightKg: 59.8, profileFingerprint: 'current-profile-and-weight', expectedVersion: 3 });
  expect(onPlanChanged).toHaveBeenCalledWith(expect.objectContaining({ id: 21 }));
});
test('unsafe guidance prevents confirmation and leaves the current plan untouched', async () => {
  axios.defaults.adapter = async config => { requests.push(config); return { config, status: 200, headers: {}, data: { allowed: false, reasons: ['Choose a later target date for a more gradual change.'] } }; };
  await render(); await click(textButton('Plan next week')); await weight('59.8'); await click(host.querySelector('input[type="checkbox"]')); await submit();
  expect(host.textContent).toContain('Choose a later target date'); expect(textButton('Confirm next week')).toBeUndefined(); expect(onPlanChanged).not.toHaveBeenCalled();
});
test('editing current weight invalidates the previous safety proposal', async () => {
  await render(); await click(textButton('Plan next week')); await weight('59.8'); await click(host.querySelector('input[type="checkbox"]')); await submit();
  expect(textButton('Confirm next week')).toBeDefined(); await weight('59.5'); expect(textButton('Confirm next week')).toBeUndefined();
});
test('an existing continuation opens the next week rather than creating another', async () => {
  await render({ ...plan, routine: { ...plan.routine, state: 'continued', nextPlanId: 21 } });
  expect(textButton('Plan next week')).toBeUndefined(); await click(textButton('Open next week')); expect(onOpenPlan).toHaveBeenCalledWith(21); expect(requests).toHaveLength(0);
});
test('a balanced plan has no weight form', async () => {
  await render({ ...plan, routine: { ...plan.routine, mode: 'maintenance' } });
  expect(textButton('Create a balanced week')).toBeDefined(); expect(host.querySelector('input[type="number"]')).toBeNull();
});
