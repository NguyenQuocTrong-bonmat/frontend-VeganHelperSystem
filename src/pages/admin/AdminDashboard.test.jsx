import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { vi, beforeEach, afterEach, test, expect } from 'vitest';
import AdminDashboard, { isCurrentPeriod, getUtcWeekMonday } from './AdminDashboard';
import * as service from '../../services/adminService';

vi.mock('../../components/admin/AdminLayout', () => ({ default: ({ children }) => <main>{children}</main> }));
vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ user: { username: 'Admin' } }) }));
vi.mock('../../services/adminService', () => ({
  getAdminDashboardOverview: vi.fn(), getAdminDashboardActivity: vi.fn(),
  getAdminDashboardCategories: vi.fn(), getAdminAuditLogs: vi.fn(),
}));
let container, root;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  vi.clearAllMocks();
  service.getAdminDashboardOverview.mockResolvedValue({
    members: { total: 1250, newInPeriod: 42, growthPercentage: 5 },
    posts: { totalPublished: 560, createdInPeriod: 38 },
    moderation: { totalPending: 9, aiFlaggedPosts: 4, reportedPosts: 3, reportedComments: 2 },
  });
  service.getAdminDashboardActivity.mockResolvedValue({ items: [{ period: '2026-01-01', postCount: 7 }] });
  service.getAdminDashboardCategories.mockResolvedValue({ items: [{ categoryId: 1, name: 'Vietnamese Food', postCount: 18, percentage: 60 }] });
  service.getAdminAuditLogs.mockResolvedValue({ items: [{ id: 1, adminId: 9, action: 'category.create', createdAt: '2026-01-01T10:00:00Z', targetType: 'category', targetId: '4' }] });
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(async () => { await act(async () => root.unmount()); container.remove(); });
const render = () => act(async () => root.render(<MemoryRouter><AdminDashboard /></MemoryRouter>));
const click = (text) => act(async () => [...container.querySelectorAll('button')].find(b => b.textContent === text).click());
const change = (label, value) => act(async () => {
  const input = container.querySelector(`[aria-label="${label}"]`);
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value);
  input.dispatchEvent(new Event('change', { bubbles: true }));
});
const submit = () => act(async () => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));

test('renders real metrics, chart values, category and audit data', async () => {
  await render();
  expect(container.textContent).toContain('1,250');
  expect(container.textContent).toContain('560');
  expect(container.textContent).toContain('9 Items');
  expect(container.textContent).toContain('Vietnamese Food');
  expect(container.textContent).toContain('category.create');
  expect(container.textContent).toContain('Admin #9');
  expect(container.querySelector('[aria-label="01 Jan: 7 posts"]')).not.toBeNull();
  expect(container.querySelector('a[href="/admin/content"]')).not.toBeNull();
  expect(container.textContent).not.toContain('Recipe Velocity');
});
test('applies the same UTC range to dashboard and audit and changes chart grouping', async () => {
  await render();
  await change('From (UTC)', '2026-01-01'); await change('To (UTC)', '2026-01-31'); await submit();
  expect(service.getAdminDashboardOverview).toHaveBeenLastCalledWith({ from: '2026-01-01', to: '2026-01-31' }, expect.any(AbortSignal));
  expect(service.getAdminAuditLogs).toHaveBeenLastCalledWith(expect.objectContaining({ from: '2026-01-01T00:00:00Z', to: '2026-01-31T23:59:59.999999Z' }), expect.any(AbortSignal));
  await click('Weekly');
  expect(service.getAdminDashboardActivity).toHaveBeenLastCalledWith(expect.objectContaining({ interval: 'week', from: '2026-01-01' }), expect.any(AbortSignal));
  await click('Monthly');
  expect(service.getAdminDashboardActivity).toHaveBeenLastCalledWith(expect.objectContaining({ interval: 'month' }), expect.any(AbortSignal));
  expect(service.getAdminDashboardOverview).toHaveBeenCalledTimes(2);
  expect(service.getAdminDashboardCategories).toHaveBeenCalledTimes(2);
  expect(service.getAdminAuditLogs).toHaveBeenCalledTimes(2);
  expect(service.getAdminDashboardActivity).toHaveBeenCalledTimes(4);
});
test('shows API failure with retry rather than invented data', async () => {
  service.getAdminDashboardOverview.mockRejectedValueOnce(new Error('Dashboard unavailable'));
  await render();
  expect(container.querySelector('[role="alert"]').textContent).toContain('Dashboard unavailable');
  expect(container.textContent).not.toContain('1,250');
  expect(container.textContent).toContain('Vietnamese Food');
  expect(container.textContent).toContain('category.create');
  await click('Retry');
  expect(container.querySelector('[role="alert"]')).toBeNull();
  expect(container.textContent).toContain('1,250');
});
test('empty results show meaningful empty states and zero metrics', async () => {
  service.getAdminDashboardOverview.mockResolvedValue({ members: { total: 0, newInPeriod: 0, growthPercentage: null }, posts: { totalPublished: 0 }, moderation: { totalPending: 0 } });
  service.getAdminDashboardActivity.mockResolvedValue({ items: [] });
  service.getAdminDashboardCategories.mockResolvedValue({ items: [] });
  service.getAdminAuditLogs.mockResolvedValue({ items: [] });
  await render();
  expect(container.textContent).toContain('0 Items');
  expect(container.textContent).toContain('No prior baseline');
  expect(container.textContent).toContain('No categorized published posts');
  expect(container.textContent).toContain('No management actions');
});
test('invalid date ranges do not send another request', async () => {
  await render();
  await change('From (UTC)', '2026-02-01'); await change('To (UTC)', '2026-01-01'); await submit();
  expect(container.querySelector('[role="alert"]').textContent).toContain('366 days');
  expect(service.getAdminDashboardOverview).toHaveBeenCalledTimes(1);
});

test('renders statistics and chart before a slow audit request completes', async () => {
  let completeAudit;
  service.getAdminAuditLogs.mockReturnValueOnce(new Promise((resolve) => { completeAudit = resolve; }));
  await render();
  expect(container.textContent).toContain('1,250');
  expect(container.textContent).toContain('Vietnamese Food');
  expect(container.querySelector('[aria-label="01 Jan: 7 posts"]')).not.toBeNull();
  expect(container.textContent).toContain('Loading audit events');
  await act(async () => completeAudit({ items: [] }));
  expect(container.textContent).toContain('No management actions');
});

test('keeps loaded statistics visible while only the chart grouping is loading', async () => {
  await render();
  let completeActivity;
  service.getAdminDashboardActivity.mockReturnValueOnce(new Promise((resolve) => { completeActivity = resolve; }));
  await click('Weekly');
  expect(container.textContent).toContain('1,250');
  expect(container.textContent).toContain('category.create');
  expect(container.textContent).toContain('Vietnamese Food');
  expect(service.getAdminDashboardOverview).toHaveBeenCalledTimes(1);
  expect(service.getAdminAuditLogs).toHaveBeenCalledTimes(1);
  await act(async () => completeActivity({ items: [] }));
});

test('discards an older date-range response that arrives after a newer response', async () => {
  let completeOld;
  service.getAdminDashboardOverview.mockReturnValueOnce(new Promise((resolve) => { completeOld = resolve; }));
  await render();
  await change('From (UTC)', '2026-01-01'); await change('To (UTC)', '2026-01-31'); await submit();
  expect(container.textContent).toContain('1,250');
  await act(async () => completeOld({ members: { total: 9999 }, posts: {}, moderation: {} }));
  expect(container.textContent).not.toContain('9,999');
  expect(container.textContent).toContain('1,250');
});

test('isCurrentPeriod accurately identifies current day, week, and month', () => {
  const fixedNow = new Date('2026-10-19T10:00:00Z'); // Monday
  // Day
  expect(isCurrentPeriod('2026-10-19', 'day', fixedNow)).toBe(true);
  expect(isCurrentPeriod('2026-10-18', 'day', fixedNow)).toBe(false);

  // Week
  expect(isCurrentPeriod('2026-10-19', 'week', fixedNow)).toBe(true);
  expect(isCurrentPeriod('2026-10-12', 'week', fixedNow)).toBe(false);

  // Week tested from mid-week (Wednesday 21 Oct)
  const midWeek = new Date('2026-10-21T10:00:00Z');
  expect(isCurrentPeriod('2026-10-19', 'week', midWeek)).toBe(true);
  expect(isCurrentPeriod('2026-10-12', 'week', midWeek)).toBe(false);

  // Month
  expect(isCurrentPeriod('2026-10-01', 'month', fixedNow)).toBe(true);
  expect(isCurrentPeriod('2026-09-01', 'month', fixedNow)).toBe(false);
});

test('distinguishes current day, week, and month with darker bar color and legend in post activity chart', async () => {
  const todayUtc = new Date().toISOString().slice(0, 10);
  service.getAdminDashboardActivity.mockResolvedValue({
    items: [
      { period: '2026-01-01', postCount: 4 },
      { period: todayUtc, postCount: 9 },
    ],
  });
  await render();

  const pastBar = container.querySelector('[aria-label="01 Jan: 4 posts"]');
  const currentBar = container.querySelector(`[aria-label*="9 posts"]`);
  expect(pastBar).not.toBeNull();
  expect(currentBar).not.toBeNull();
  expect(pastBar.className).toContain('bg-[#C6D9C8]');
  expect(currentBar.className).toContain('bg-[#2F5233]');
  expect(container.textContent).toContain('Past');
  expect(container.textContent).toContain('Today');

  // Switch to Weekly
  await click('Weekly');
  expect(container.textContent).toContain('This Week');

  // Switch to Monthly
  await click('Monthly');
  expect(container.textContent).toContain('This Month');
});
