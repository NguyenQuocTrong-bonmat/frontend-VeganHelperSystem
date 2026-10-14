import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SavedPosts from './SavedPosts';
import PublicUserProfile from './PublicUserProfile';
import { getSavedPosts, toggleSave } from '../../services/interactionService';
import { getPublicProfile } from '../../services/userService';
jest.mock('../../services/interactionService');
jest.mock('../../services/userService');
jest.mock('../../components/layout/HeaderMember', () => () => null);
jest.mock('../../components/layout/Footer', () => () => null);
jest.mock('../../components/chat/AIChatbot', () => () => null);
jest.mock('react-hot-toast', () => ({ success: jest.fn(), error: jest.fn() }));
let host, root;
beforeEach(() => { jest.resetAllMocks(); global.IS_REACT_ACT_ENVIRONMENT = true; host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host); });
afterEach(async () => { await act(async () => root.unmount()); host.remove(); });
async function saved() { await act(async () => root.render(<MemoryRouter><SavedPosts isComponent /></MemoryRouter>)); }
async function profile() { await act(async () => root.render(<MemoryRouter initialEntries={['/users/42']}><Routes><Route path="/users/:id" element={<PublicUserProfile />} /></Routes></MemoryRouter>)); }
async function click(text) { const button = [...host.querySelectorAll('button')].find(b => b.textContent === text); await act(async () => button.click()); }
const post = { postId: 8, title: 'Saved blog', postType: 'Blog', authorName: 'Author', thumbnailUrl: null };
test('FN20 empty is distinct from server failure and retry works', async () => {
  getSavedPosts.mockRejectedValueOnce({ status: 500 }).mockResolvedValueOnce({ items: [], totalPages: 0 });
  await saved(); expect(host.textContent).toContain('Unable to load saved posts'); expect(host.textContent).not.toContain("haven't saved");
  await click('Try again'); expect(host.textContent).toContain("haven't saved any posts");
});
test('FN20 uses postId, loads the next page, and reloads after confirmed unsave', async () => {
  getSavedPosts.mockResolvedValue({ items: [post], totalPages: 2 }); toggleSave.mockResolvedValue({ isSaved: false });
  await saved(); expect(host.querySelector('article a').getAttribute('href')).toBe('/posts/8');
  await click('Next'); expect(getSavedPosts).toHaveBeenLastCalledWith({ pageIndex: 2, pageSize: 12 });
  await click('Unsave'); expect(toggleSave).toHaveBeenCalledWith(8); expect(getSavedPosts).toHaveBeenCalledTimes(3);
});
test('FN20 image failure displays fallback', async () => {
  getSavedPosts.mockResolvedValue({ items: [{ ...post, thumbnailUrl: '/missing.png' }], totalPages: 1 }); await saved();
  await act(async () => host.querySelector('article img').dispatchEvent(new Event('error'))); expect(host.textContent).toContain('No image');
});
test.each([401, 403, 404, 500])('FN21 handles HTTP %s separately', async status => {
  getPublicProfile.mockRejectedValue({ status }); await profile();
  const messages = {401: 'Please sign in', 403: 'do not have permission', 404: 'User not found', 500: 'Unable to load'};
  expect(host.textContent).toContain(messages[status]); expect(host.textContent).not.toContain("hasn't published");
});
test('FN21 empty posts, null avatar, invalid date and private fields', async () => {
  getPublicProfile.mockResolvedValue({ id: 42, displayName: 'A'.repeat(300), username: 'B'.repeat(300), joinedAt: 'invalid', avatarUrl: null, posts: [], email: 'PRIVATE_EMAIL', heightCm: 170 });
  await profile(); expect(host.textContent).toContain("hasn't published"); expect(host.textContent).not.toContain('Invalid Date'); expect(host.textContent).not.toContain('PRIVATE_EMAIL');
});
test('FN21 feed IDs and Blog/Video types follow the DTO', async () => {
  getPublicProfile.mockResolvedValue({ id: 42, username: 'author', posts: [{ id: 9, title: 'Video title', postType: 'Video', thumbnailUrl: null }] });
  await profile(); expect(host.querySelector('article a').getAttribute('href')).toBe('/posts/9'); expect(host.textContent).toContain('Video');
});
test('FN20 loading is visible while request is pending', async () => {
  let finish; getSavedPosts.mockReturnValue(new Promise(resolve => { finish = resolve; })); await saved();
  expect(host.querySelector('[role="status"]')).not.toBeNull();
  await act(async () => finish({ items: [], totalPages: 0 })); expect(host.querySelector('[role="status"]')).toBeNull();
});
test('FN20 handles many items and long unbroken titles', async () => {
  getSavedPosts.mockResolvedValue({ items: Array.from({ length: 12 }, (_, i) => ({ ...post, postId: i + 1, title: 'x'.repeat(500) })), totalPages: 50 });
  await saved(); expect(host.querySelectorAll('article')).toHaveLength(12); expect(host.textContent).toContain('Page 1 of 50');
});
test('FN20 returns to previous page when last item is removed', async () => {
  getSavedPosts.mockResolvedValueOnce({ items: [post], totalPages: 2 }).mockResolvedValueOnce({ items: [post], totalPages: 2 }).mockResolvedValueOnce({ items: [], totalPages: 1 }).mockResolvedValueOnce({ items: [post], totalPages: 1 });
  toggleSave.mockResolvedValue({ isSaved: false }); await saved(); await click('Next'); await click('Unsave');
  expect(getSavedPosts).toHaveBeenLastCalledWith({ pageIndex: 1, pageSize: 12 });
});
test.each([401, 403])('FN20 handles authorization %s without empty state', async status => {
  getSavedPosts.mockRejectedValue({ status }); await saved();
  expect(host.textContent).toContain(status === 401 ? 'Please sign in' : 'do not have permission'); expect(host.textContent).not.toContain("haven't saved");
});
test('FN20 does not remove item when toggle response is still saved', async () => {
  getSavedPosts.mockResolvedValue({ items: [post], totalPages: 1 }); toggleSave.mockResolvedValue({ isSaved: true }); await saved(); await click('Unsave');
  expect(host.querySelectorAll('article')).toHaveLength(1); expect(getSavedPosts).toHaveBeenCalledTimes(1);
});
