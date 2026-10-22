import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import WeeklyMenu from './WeeklyMenu';
import PlanSetupFlow from '../../components/meal-planning/PlanSetupFlow';
import axios from '../../lib/axios';
import { clearAuthTokens, storeAuthTokens } from '../../utils/authStorage';

vi.mock('../../components/layout/HeaderMember', () => ({ default: () => null }));
vi.mock('../../components/layout/Footer', () => ({ default: () => null }));
vi.mock('../../components/chat/AIChatbot', () => ({ default: () => null }));

const plan = (id = 8) => ({
  id, startDate: '2026-10-21', endDate: '2026-10-27', status: 'completed', dietType: 'vegan',
  menu: { bmi: 22.5, targetDailyCalories: 2100, dietType: 'vegan', allergies: ['Peanut'], notes: ['Sample menu, not medical advice.'],
    days: Array.from({ length: 7 }, (_, index) => ({
      dayIndex: index + 1, dayOfWeek: (index + 2) % 7 + 1,
      date: `2026-10-${21 + index}`, totalCalories: 2095,
      meals: ['breakfast', 'lunch', 'dinner'].map((mealTime, slot) => ({
        mealId: id * 100 + index * 3 + slot, name: `${mealTime} dish ${id}-${index + 1}`,
        mealTime, portionMultiplier: 1.25, calories: slot ? 735 : 625,
        ingredients: [{ ingredientId: 1, name: 'Tofu', quantity: 125, unit: 'g' }],
      })),
    })),
  },
});
const page = (items = [], pageIndex = 1, totalPages = 1) => ({ items, pageIndex, totalPages, totalItems: items.length });
const failure = (status, data) => Object.assign(new Error('Request failed'), { response: { status, data } });
let container, root, adapter, route, profileRoute, originalAdapter, paymentAccess;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2026-10-20T12:00:00Z'));
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
  originalAdapter = axios.defaults.adapter;
  route = async () => page();
  profileRoute = async () => ({ heightCm: 170, weightKg: 65, dietType: 'vegan', allergies: [{ name: 'Peanut' }] });
  paymentAccess = { status: 'active', canGenerate: true, canViewExistingPlans: true, canViewTrialPlans: true, expiresAt: '2027-01-01T00:00:00Z', trialGenerationsRemaining: 3 };
  adapter = vi.fn(async config => {
    let data;
    if (config.url === '/HealthProfile') {
      data = await profileRoute(config);
    } else if (config.url === '/meal-plan-payments/access') {
      data = paymentAccess;
    } else if (config.url === '/meal-plan-payments/packages') {
      data = [{ code: 'one-month', name: 'One month', durationMonths: 1, amountVnd: 100000 }];
    } else {
      data = await route(config);
    }
    return { data, status: 200, statusText: 'OK', headers: {}, config };
  });
  axios.defaults.adapter = adapter;
  storeAuthTokens({ accessToken: 'session-member' }, false);
});
afterEach(async () => {
  await act(async () => root.unmount()); container.remove(); axios.defaults.adapter = originalAdapter; clearAuthTokens();
  vi.useRealTimers();
});
const render = () => act(async () => root.render(<MemoryRouter><WeeklyMenu /></MemoryRouter>));
const button = text => [...container.querySelectorAll('button')].find(node => node.textContent.includes(text) || node.getAttribute('aria-label')?.includes(text));
const click = node => act(async () => node.click());
const change = (node, value) => act(async () => {
  Object.getOwnPropertyDescriptor(node instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype, 'value').set.call(node, value);
  node.dispatchEvent(new Event('change', { bubbles: true }));
});
const submit = () => act(async () => container.querySelector('#plan-setup-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
const openReview = async () => {
  await click(button('New weekly menu'));
  await submit();
  await change(container.querySelector('#meal-plan-start'), '2026-10-21');
  await submit();
};

test('opens goal setup without submitting before explicit eligibility and safety review', async () => {
  await render();
  await click(button('New weekly menu'));
  await click(container.querySelector('input[value="weight-goal"]'));
  expect(container.textContent).toContain('Weight goal plan');
  expect(container.textContent).toContain('safety check');
  expect(adapter.mock.calls.every(([config]) => config.method === 'get')).toBe(true);
});

test('weight goal requires a server safety preview before generating with goal fields', async () => {
  route=async config=>config.url.endsWith('/goal-preview') ? {allowed:true,tdee:2200,targetCalories:2000,dailyAdjustment:-200,reasons:[]} : config.method==='post'?plan(9):page();
  await render(); await click(button('New weekly menu'));
  await click(container.querySelector('input[value="weight-goal"]'));
  await submit();
  await change(container.querySelector('#goal-weight'), '60');
  await change(container.querySelector('#goal-date'), '2026-12-21');
  await click(container.querySelector('#goal-eligibility'));
  await submit();
  expect(container.textContent).toContain('60 kg');
  expect(container.textContent).toContain('Safety review required');
  expect(container.querySelector('button[type="submit"]').textContent).toContain('Check goal safety');
  await submit();
  expect(container.textContent).toContain('2,000');
  expect(adapter.mock.calls.filter(([config]) => config.url==='/MealPlans/generate')).toHaveLength(0);
  await submit();
  const request=adapter.mock.calls.find(([config])=>config.url==='/MealPlans/generate')[0];
  expect(JSON.parse(request.data)).toMatchObject({mode:'weight_goal',targetWeightKg:60,targetDate:'2026-12-21',eligibilityConfirmed:true});
});

test('profile failure blocks creation until a successful retry, without invented measurements', async () => {
  profileRoute = async () => { throw failure(503, { message: 'Profile unavailable' }); };
  await render(); await openReview();
  expect(container.textContent).toContain('Profile unavailable');
  expect(container.textContent).not.toContain('65 kg');
  expect(container.querySelector('button[type="submit"]').disabled).toBe(true);
  profileRoute = async () => ({ weightKg: 65, heightCm: 170, dietType: 'vegan' });
  await click(button('Retry health profile'));
  expect(container.textContent).toContain('65 kg');
  expect(container.querySelector('button[type="submit"]').disabled).toBe(false);
});

test('back preserves schedule values and cancelling setup preserves the saved menu and restores focus', async () => {
  route = async () => page([plan()]);
  await render(); await openReview();
  await click(button('Back'));
  expect(container.querySelector('#meal-plan-start').value).toBe('2026-10-21');
  await click(button('Cancel setup'));
  expect(container.querySelector('#plan-setup-form')).toBeNull();
  expect(container.textContent).toContain('breakfast dish 8-1');
  expect(document.activeElement).toBe(button('New weekly menu'));
});

test('setup retains missing fields and never advances with an invalid date', async () => {
  await render(); await click(button('New weekly menu')); await submit();
  await change(container.querySelector('#meal-plan-start'), ''); await submit();
  expect(container.querySelector('#meal-plan-start')).not.toBeNull();
  expect(adapter.mock.calls.filter(([config]) => config.method === 'post')).toHaveLength(0);
});

test('refreshes the review after a health profile update while preserving the selected date', async () => {
  const props = { busy: false, onGenerate: vi.fn(), onCancel: vi.fn(), onEditProfile: vi.fn() };
  await act(async () => root.render(<PlanSetupFlow {...props} profileRevision={0} />));
  await submit(); await change(container.querySelector('#meal-plan-start'), '2026-10-21'); await submit();
  expect(container.textContent).toContain('65 kg');
  profileRoute = async () => ({ weightKg: 67, heightCm: 170, dietType: 'vegan', allergies: [{ name: 'Soy' }] });
  await act(async () => root.render(<PlanSetupFlow {...props} profileRevision={1} />));
  expect(container.textContent).toContain('67 kg');
  expect(container.textContent).toContain('Soy');
  expect(container.textContent).toContain('21/10/2026');
  expect(props.onGenerate).not.toHaveBeenCalled();
});

test('offers week and day views and opens real ingredients without inventing cooking steps', async () => {
  route = async () => page([plan()]);
  await render();
  expect(container.querySelector('[aria-label="Weekly meal calendar"]')).not.toBeNull();
  expect(container.querySelector('[data-view="day"]')).not.toBeNull();
  expect(container.querySelector('.wm-meal-ingredient-preview').textContent).toContain('Tofu');
  await click(button('Week view'));
  expect(container.querySelector('[data-view="week"]')).not.toBeNull();
  expect(container.querySelector('[data-view="day"]')).toBeNull();
  await click(button('Day view'));
  await click(button('Thursday'));
  await click(button('breakfast dish 8-2'));
  expect(container.querySelector('[aria-label="Meal details"]').textContent).toContain('125 g');
  expect(container.textContent).toContain('Cooking steps are not available');
  await click(button('Close meal details'));
  expect(container.querySelector('[aria-label="Meal details"]')).toBeNull();
});

test.each([false, true])('loads saved plans with rememberMe=%s and displays real calendar days, calories and portions', async rememberMe => {
  storeAuthTokens({ accessToken: 'session-member' }, rememberMe);
  route = async () => page([plan()]);
  await render();
  const listRequest = adapter.mock.calls.map(([config]) => config).find(config => config.url === '/MealPlans');
  expect(listRequest).toMatchObject({ url: '/MealPlans', params: { pageIndex: 1, pageSize: 10 } });
  expect(listRequest.headers.Authorization).toBe('Bearer session-member');
  expect(container.textContent).not.toContain('API Integration BLOCKED');
  expect(container.textContent).toContain('breakfast dish 8-1');
  expect(container.textContent).toContain('2,100');
  expect(container.textContent).toContain('Peanut');
  await click(button('Day view'));
  await click(button('breakfast dish 8-1'));
  expect(container.textContent).toContain('1.25');
  expect(container.textContent).toContain('125 g');
  await click(button('Close meal details'));
  expect(button('Wednesday')).toBeDefined();
  await click(button('Thursday'));
  expect(container.textContent).toContain('breakfast dish 8-2');
  expect(container.querySelector('[data-view="day"]').textContent).not.toContain('breakfast dish 8-1');
});

test('uses backend access to block another generation after the three free trials are used', async () => {
  paymentAccess = { status: 'none', canGenerate: false, canViewExistingPlans: true, canViewTrialPlans: true, trialGenerationsRemaining: 0 };
  route = async () => page([plan()]);
  await render();

  expect(button('New weekly menu').disabled).toBe(true);
  expect(container.textContent).toContain('Your 3 free weekly-menu generations have been used');
  expect(container.textContent).toContain('One month');
  expect(container.textContent).toMatch(/100[.,]000/);
  expect(adapter.mock.calls.some(([config]) => config.url === '/MealPlans/generate')).toBe(false);
});

test('generates and displays the persisted response, posting only the selected start date', async () => {
  route = async config => config.method === 'post' ? plan(9) : page();
  await render();
  await openReview();
  await act(async () => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  const request = adapter.mock.calls.map(([config]) => config).find(config => config.method === 'post');
  expect(request.url).toBe('/MealPlans/generate');
  expect(JSON.parse(request.data)).toEqual({ startDate: '2026-10-21' });
  expect(request.headers.Authorization).toBe('Bearer session-member');
  expect(container.textContent).toContain('breakfast dish 9-1');
  expect(container.textContent).toContain('saved');
});

test('opens another persisted plan through the detail endpoint and paginates saved plans', async () => {
  route = async config => config.url === '/MealPlans/7' ? plan(7)
    : config.params.pageIndex === 2 ? page([plan(7)], 2, 2) : page([plan(8)], 1, 2);
  await render();
  await click(button('Next'));
  expect(adapter.mock.calls.at(-1)[0].params.pageIndex).toBe(2);
  await change(container.querySelector('#saved-meal-plan'), '7');
  expect(adapter.mock.calls.at(-1)[0].url).toBe('/MealPlans/7');
  expect(container.textContent).toContain('breakfast dish 7-1');
});

test.each([
  [400, { message: 'Update your health profile before generating a plan.' }, 'Update your health profile'],
  [409, { message: 'Allergy could not be resolved: mystery food.' }, 'Allergy could not be resolved'],
  [400, { title: 'Validation failed', errors: { StartDate: ['Choose a valid start date.'] } }, 'Choose a valid start date'],
  [400, { message: 'Validation failed', errors: [{ Field: 'StartDate', Error: 'Date is outside the allowed range.' }] }, 'Date is outside the allowed range'],
])('generation error %s shows a useful reason and keeps the existing plan', async (status, data, reason) => {
  route = async config => { if (config.method === 'post') throw failure(status, data); return page([plan()]); };
  await render();
  await openReview();
  await act(async () => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  expect(container.querySelector('[role="alert"]').textContent).toContain(reason);
  expect(container.textContent).toContain('breakfast dish 8-1');
  expect(button('Health & Wellness')).toBeDefined();
});

test('prevents duplicate POSTs while generation is in flight', async () => {
  let finish;
  route = config => config.method === 'post' ? new Promise(resolve => { finish = resolve; }) : Promise.resolve(page());
  await render();
  await openReview();
  const form = container.querySelector('form');
  await act(async () => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
  expect(adapter.mock.calls.filter(([config]) => config.method === 'post')).toHaveLength(1);
  expect(container.querySelector('button[type="submit"]').disabled).toBe(true);
  await act(async () => finish(plan()));
  expect(container.textContent).toContain('breakfast dish 8-1');
});

test('distinguishes load failure from empty state and retries without generating a plan', async () => {
  route = async () => { throw failure(503, { message: 'Temporary server failure' }); };
  await render();
  expect(container.querySelector('[role="alert"]').textContent).toContain('Temporary server failure');
  route = async () => page();
  await click(button('Retry'));
  expect(container.textContent).toContain('Your next week starts here');
  expect(adapter.mock.calls.every(([config]) => config.method === 'get')).toBe(true);
});

test('legacy plans without a snapshot are explained without inventing meals', async () => {
  route = async () => page([{ ...plan(), menu: null }]);
  await render();
  expect(container.textContent).toMatch(/older plan|saved menu snapshot/i);
  expect(container.querySelector('article')).toBeNull();
});

test('a missing saved plan stays on this screen and preserves the previously loaded menu', async () => {
  route = async config => { if (config.url === '/MealPlans/7') throw failure(404, { message: 'Meal plan not found.' }); return page([plan(), plan(7)]); };
  await render();
  await change(container.querySelector('#saved-meal-plan'), '7');
  expect(container.querySelector('[role="alert"]').textContent).toContain('Meal plan not found');
  expect(container.textContent).toContain('breakfast dish 8-1');
});

test('switching to health settings during creation keeps the pending request and saved result', async () => {
  let finish;
  route = config => {
    if (config.method === 'post') return new Promise(resolve => { finish = resolve; });
    if (config.url === '/MealPlans') return Promise.resolve(page());
    return Promise.resolve(null);
  };
  await render();
  await openReview();
  await act(async () => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  await click(button('Review health profile'));
  expect(container.querySelector('main').hidden).toBe(true);
  await act(async () => finish(plan()));
  await click(button('Weekly Menu'));
  expect(container.querySelector('main').hidden).toBe(false);
  expect(container.textContent).toContain('breakfast dish 8-1');
  expect(adapter.mock.calls.filter(([config]) => config.method === 'post')).toHaveLength(1);
});

test('uncertain network failure advises reloading saved plans and does not retry the POST', async () => {
  route = async config => { if (config.method === 'post') throw new Error('Network Error'); return page([plan()]); };
  await render();
  await openReview();
  await act(async () => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  expect(container.querySelector('[role="alert"]').textContent).toContain('may already have been saved');
  expect(adapter.mock.calls.filter(([config]) => config.method === 'post')).toHaveLength(1);
  expect(container.textContent).toContain('breakfast dish 8-1');
});
