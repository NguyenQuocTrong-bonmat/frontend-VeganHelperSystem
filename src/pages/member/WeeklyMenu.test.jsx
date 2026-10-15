import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import WeeklyMenu from './WeeklyMenu';
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
let container, root, adapter, route, originalAdapter;

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
  originalAdapter = axios.defaults.adapter;
  route = async () => page();
  adapter = vi.fn(async config => ({ data: await route(config), status: 200, statusText: 'OK', headers: {}, config }));
  axios.defaults.adapter = adapter;
  storeAuthTokens({ accessToken: 'session-member' }, false);
});
afterEach(async () => {
  await act(async () => root.unmount()); container.remove(); axios.defaults.adapter = originalAdapter; clearAuthTokens();
});
const render = () => act(async () => root.render(<MemoryRouter><WeeklyMenu /></MemoryRouter>));
const button = text => [...container.querySelectorAll('button')].find(node => node.textContent.includes(text));
const click = node => act(async () => node.click());
const change = (node, value) => act(async () => {
  Object.getOwnPropertyDescriptor(node instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype, 'value').set.call(node, value);
  node.dispatchEvent(new Event('change', { bubbles: true }));
});

test.each([false, true])('loads saved plans with rememberMe=%s and displays real calendar days, calories and portions', async rememberMe => {
  storeAuthTokens({ accessToken: 'session-member' }, rememberMe);
  route = async () => page([plan()]);
  await render();
  expect(adapter.mock.calls[0][0]).toMatchObject({ url: '/MealPlans', params: { pageIndex: 1, pageSize: 10 } });
  expect(adapter.mock.calls[0][0].headers.Authorization).toBe('Bearer session-member');
  expect(container.textContent).not.toContain('API Integration BLOCKED');
  expect(container.textContent).toContain('breakfast dish 8-1');
  expect(container.textContent).toContain('2,100');
  expect(container.textContent).toContain('1.25');
  expect(container.textContent).toContain('125 g');
  expect(container.textContent).toContain('Peanut');
  expect(button('Wednesday')).toBeDefined();
  await click(button('Thursday'));
  expect(container.textContent).toContain('breakfast dish 8-2');
  expect(container.textContent).not.toContain('breakfast dish 8-1');
});

test('generates and displays the persisted response, posting only the selected start date', async () => {
  route = async config => config.method === 'post' ? plan(9) : page();
  await render();
  await change(container.querySelector('#meal-plan-start'), '2026-10-21');
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
  await act(async () => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  expect(container.querySelector('[role="alert"]').textContent).toContain(reason);
  expect(container.textContent).toContain('breakfast dish 8-1');
  expect(button('Health & Wellness')).toBeDefined();
});

test('prevents duplicate POSTs while generation is in flight', async () => {
  let finish;
  route = config => config.method === 'post' ? new Promise(resolve => { finish = resolve; }) : Promise.resolve(page());
  await render();
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
  expect(container.textContent).toContain('No weekly menu');
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
  await act(async () => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  expect(container.querySelector('[role="alert"]').textContent).toContain('may already have been saved');
  expect(adapter.mock.calls.filter(([config]) => config.method === 'post')).toHaveLength(1);
  expect(container.textContent).toContain('breakfast dish 8-1');
});
