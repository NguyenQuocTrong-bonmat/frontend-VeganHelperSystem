import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import HomeGuest from './HomeGuest';
import { getCategories, getPostsFeed, searchPosts } from '../../services/postService';

vi.mock('../../services/postService', () => ({ getCategories: vi.fn(), getPostsFeed: vi.fn(), searchPosts: vi.fn() }));

const posts = [{ id: 7, title: 'Lemongrass tofu', authorName: 'Alex Green' }, { id: 8, title: 'Mushroom pho', authorName: 'Jamie Le' }];
let container, root;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  vi.useFakeTimers(); vi.clearAllMocks();
  getCategories.mockResolvedValue([{ id: 4, name: 'Vietnamese' }]);
  getPostsFeed.mockResolvedValue({ items: posts, totalItems: 27 });
  searchPosts.mockResolvedValue({ items: [posts[0]], totalItems: 1 });
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount()); container.remove(); vi.useRealTimers();
});
const render = async () => {
  await act(async () => root.render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><HomeGuest /></MemoryRouter>));
  await act(async () => { await vi.advanceTimersByTimeAsync(0); });
};
const click = node => act(async () => node.click());
const changeSearch = value => act(async () => {
  const input = container.querySelector('#landing-recipe-search');
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
});

test('uses public post routes, actual community totals and the existing sign-up route', async () => {
  await render();
  expect(container.querySelectorAll('main > section')).toHaveLength(7);
  expect(container.querySelectorAll('h1')).toHaveLength(1);
  expect(container.querySelector('a[href="/posts/7/guest"]')).not.toBeNull();
  expect(container.querySelector('.lp-community-stats').textContent).toContain('27Public posts');
  expect(container.querySelector('a[href="/register"]')).toBeNull();
  expect(container.querySelectorAll('a[href="/sign-up"]').length).toBeGreaterThan(0);
  expect(container.textContent).not.toContain('Create Post');
  expect(container.textContent).not.toContain('12,000');
});

test('searches the server after debounce and category selection clears the keyword', async () => {
  await render();
  await changeSearch('tofu');
  await act(async () => { await vi.advanceTimersByTimeAsync(349); });
  expect(searchPosts).not.toHaveBeenCalled();
  await act(async () => { await vi.advanceTimersByTimeAsync(1); });
  expect(searchPosts).toHaveBeenCalledWith({ keyword: 'tofu', pageSize: 6 });
  expect(container.querySelectorAll('.lp-recipe-card')).toHaveLength(1);
  const category = [...container.querySelectorAll('.lp-category-filters button')].find(button => button.textContent === 'Vietnamese');
  await click(category);
  await act(async () => { await vi.advanceTimersByTimeAsync(0); });
  expect(getPostsFeed).toHaveBeenLastCalledWith({ pageSize: 6, categoryId: 4 });
  expect(container.querySelector('#landing-recipe-search').value).toBe('');
  expect(container.querySelector('.lp-community-stats').textContent).toContain('27Public posts');
});

test('ignores an older search response after a newer keyword was entered', async () => {
  await render();
  let resolveOlder;
  searchPosts.mockImplementationOnce(() => new Promise(resolve => { resolveOlder = resolve; }));
  await changeSearch('tofu');
  await act(async () => { await vi.advanceTimersByTimeAsync(350); });
  searchPosts.mockResolvedValueOnce({ items: [posts[1]] });
  await changeSearch('pho');
  await act(async () => { await vi.advanceTimersByTimeAsync(350); });
  await act(async () => resolveOlder({ items: [posts[0]] }));
  expect(container.querySelector('.lp-recipe-card h3').textContent).toBe('Mushroom pho');
});

test('retry recovers from an API failure without presenting fake posts or a fake total', async () => {
  getPostsFeed.mockRejectedValueOnce(new Error('Offline'));
  await render();
  expect(container.querySelector('[role="alert"]').textContent).toContain('could not load');
  expect(container.querySelector('.lp-community-stats').textContent).not.toContain('27');
  expect(container.querySelectorAll('.lp-recipe-card')).toHaveLength(0);
  await click([...container.querySelectorAll('button')].find(button => button.textContent === 'Try again'));
  await act(async () => { await vi.advanceTimersByTimeAsync(0); });
  expect(container.querySelectorAll('.lp-recipe-card')).toHaveLength(2);
});

test('restricted actions open a focus-trapped auth dialog and Escape restores focus', async () => {
  await render();
  const save = container.querySelector('[aria-label="Save Lemongrass tofu"]');
  save.focus(); await click(save);
  const dialog = container.querySelector('[role="dialog"]');
  const close = dialog.querySelector('button'); const login = dialog.querySelector('a[href="/login"]');
  expect(document.activeElement).toBe(close);
  expect(document.body.style.overflow).toBe('hidden');
  login.focus();
  await act(async () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })));
  expect(document.activeElement).toBe(close);
  await act(async () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true })));
  expect(document.activeElement).toBe(login);
  await act(async () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })));
  expect(container.querySelector('[role="dialog"]')).toBeNull();
  expect(document.activeElement).toBe(save);
  expect(document.body.style.overflow).not.toBe('hidden');
});

test('weekly menu and store actions describe the current sign-in boundary', async () => {
  await render();
  await click([...container.querySelectorAll('button')].find(button => button.textContent.includes('Create Your Weekly Menu')));
  expect(container.querySelector('[role="dialog"]').textContent).toContain('health profile, allergies');
  await click(container.querySelector('[aria-label="Close sign-in dialog"]'));
  await click([...container.querySelectorAll('button')].find(button => button.textContent.includes('Find Stores Near You')));
  expect(container.querySelector('[role="dialog"]').textContent).toContain('store directory currently requires a login');
});

test('calendar selection and store pins update their associated preview content', async () => {
  await render();
  await click(container.querySelectorAll('.lp-calendar-days button')[1]);
  expect(container.querySelector('.lp-calendar-mobile').textContent).toContain('Avocado toast');
  expect(container.querySelector('.lp-calendar-mobile').textContent).not.toContain('Overnight oats');
  await click(container.querySelector('[aria-label="Highlight Fresh produce"]'));
  expect(container.querySelector('.lp-map-location strong').textContent).toBe('Fresh produce');
});
