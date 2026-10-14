import { vi } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes, Link } from 'react-router-dom';
import MyPosts from './MyPosts';
import Profile from './Profile';
import EditPost from './EditPost';
import PublicUserProfile from './PublicUserProfile';
import StoreDetail from './StoreDetail';
import { getPublicProfile } from '../../services/userService';
import shopService from '../../services/shopService';
import { authService } from '../../services/authService';
import PostDetailCore from '../../components/home/PostDetailCore';
import { getMyPosts, getPostDetail, getCategories } from '../../services/postService';
import { getComments } from '../../services/interactionService';

vi.mock('../../services/userService', () => ({ getPublicProfile: vi.fn() }));
vi.mock('../../services/shopService', () => ({ default: { getShopDetail: vi.fn() } }));
vi.mock('../../services/authService', () => ({ authService: { getProfile: vi.fn() } }));
vi.mock('@react-oauth/google', () => ({ GoogleLogin: () => null }));
vi.mock('../../components/layout/HeaderMember', () => ({ default: () => null }));
vi.mock('../../components/layout/Footer', () => ({ default: () => null }));
vi.mock('../../components/chat/AIChatbot', () => ({ default: () => null }));
vi.mock('./SavedPosts', () => ({ default: () => null }));
vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ user: { id: 7, username: 'owner', displayName: 'Owner' } }) }));
vi.mock('../../services/postService', () => ({ getMyPosts: vi.fn(), getPostDetail: vi.fn(), getCategories: vi.fn(), deletePost: vi.fn() }));
vi.mock('../../services/interactionService', () => ({ getComments: vi.fn(), toggleSave: vi.fn(), toggleLike: vi.fn(), createComment: vi.fn(), updateComment: vi.fn(), deleteComment: vi.fn(), reportComment: vi.fn() }));

let container, root;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
  getCategories.mockResolvedValue([]);
});
afterEach(async () => { await act(async () => root.unmount()); container.remove(); vi.clearAllMocks(); });

test('My Posts displays actual likes beside views', async () => {
  getMyPosts.mockResolvedValue({ items: [{ id: 11, title: 'Recipe', viewCount: 7, likeCount: 24 }] });
  await act(async () => root.render(<MemoryRouter><MyPosts /></MemoryRouter>));
  expect(container.querySelector('[aria-label="24 likes"]')).not.toBeNull();
  expect(container.querySelector('[aria-label="24 likes"]').textContent).toBe('24');
});

test('author badges follow post ownership for root comments and nested replies, not display name', async () => {
  getPostDetail.mockResolvedValue({ id: 11, authorId: 7, title: 'Recipe', postType: 'article', authorName: 'Owner', media: [] });
  getComments.mockResolvedValue([{ id: 1, userId: 7, authorName: 'Owner', content: 'Root', depth: 1, replies: [
    { id: 2, userId: 8, authorName: 'Owner', content: 'Different user', depth: 2, replies: [
      { id: 3, userId: '7', authorName: 'Owner', content: 'Author reply', depth: 3, replies: [] }
    ] }
  ] }]);
  await act(async () => root.render(<MemoryRouter initialEntries={['/posts/11']}><Routes><Route path="/posts/:id" element={<PostDetailCore />} /></Routes></MemoryRouter>));
  const badges = [...container.querySelectorAll('span')].filter(element => element.textContent === 'Author');
  expect(badges).toHaveLength(2);
});

test.each([
  ['2001-03-07', '07/03/2001'],
  ['2001-03-07T00:00:00+07:00', '07/03/2001'],
  [null, 'Not provided'],
])('Profile displays calendar birth date %s as %s', async (birthDate, displayed) => {
  authService.getProfile.mockResolvedValue({ displayName: 'Owner', username: 'owner', birthDate });
  await act(async () => root.render(<MemoryRouter><Profile /></MemoryRouter>));
  expect(container.textContent).toContain(displayed);
  if (birthDate) expect(container.textContent).not.toContain(birthDate.split('T')[0]);
});

const missing = () => Object.assign(new Error('Missing resource'), { status: 404, response: { status: 404 } });

test.each([
  ['/posts/:id', <PostDetailCore />, '/posts/999'],
  ['/posts/edit/:id', <EditPost />, '/posts/edit/999'],
  ['/users/:id', <PublicUserProfile />, '/users/999'],
  ['/vegan-stores/:id', <StoreDetail />, '/vegan-stores/999'],
])('missing main resource on %s navigates to 404', async (route, element, path) => {
  getPostDetail.mockRejectedValue(missing()); getComments.mockResolvedValue([]);
  getPublicProfile.mockRejectedValue(missing()); shopService.getShopDetail.mockRejectedValue(missing());
  await act(async () => root.render(<MemoryRouter initialEntries={[path]}><Routes>
    <Route path={route} element={element} /><Route path="/404" element={<h1>Not found page</h1>} />
  </Routes></MemoryRouter>));
  expect(container.textContent).toContain('Not found page');
});

test('404 from comments alone does not replace an existing post page', async () => {
  getPostDetail.mockResolvedValue({ id: 11, authorId: 7, title: 'Existing recipe', postType: 'article', media: [] });
  getComments.mockRejectedValue(missing());
  await act(async () => root.render(<MemoryRouter initialEntries={['/posts/11']}><Routes>
    <Route path="/posts/:id" element={<PostDetailCore />} /><Route path="/404" element={<h1>Not found page</h1>} />
  </Routes></MemoryRouter>));
  expect(container.textContent).toContain('Existing recipe');
  expect(container.textContent).not.toContain('Not found page');
});

test.each([
  ['/posts/:id', <PostDetailCore />, '/posts/11'],
  ['/posts/edit/:id', <EditPost />, '/posts/edit/11'],
  ['/users/:id', <PublicUserProfile />, '/users/11'],
  ['/vegan-stores/:id', <StoreDetail />, '/vegan-stores/11'],
])('server errors on %s stay as load errors, not 404', async (route, element, path) => {
  const failure = Object.assign(new Error('Temporary server failure'), { status: 503, response: { status: 503 } });
  getPostDetail.mockRejectedValue(failure); getComments.mockResolvedValue([]);
  getPublicProfile.mockRejectedValue(failure); shopService.getShopDetail.mockRejectedValue(failure);
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    await act(async () => root.render(<MemoryRouter initialEntries={[path]}><Routes>
      <Route path={route} element={element} /><Route path="/404" element={<h1>Not found page</h1>} />
    </Routes></MemoryRouter>));
    expect(container.textContent).not.toContain('Not found page');
    expect(container.textContent).toMatch(/load|try again/i);
  } finally { log.mockRestore(); }
});

test('a valid shop uses the existing detail API and stays on its page', async () => {
  shopService.getShopDetail.mockResolvedValue({ id: 11, name: 'Vegan Garden', address: '123 Garden Street' });
  await act(async () => root.render(<MemoryRouter initialEntries={['/vegan-stores/11']}><Routes>
    <Route path="/vegan-stores/:id" element={<StoreDetail />} /><Route path="/404" element={<h1>Not found page</h1>} />
  </Routes></MemoryRouter>));
  expect(shopService.getShopDetail).toHaveBeenCalledWith('11');
  expect(container.textContent).toContain('Vegan Garden');
  expect(container.textContent).not.toContain('Not found page');
});

test('a delayed 404 from a page already left cannot redirect the current page', async () => {
  let rejectPost;
  getPostDetail.mockImplementation(() => new Promise((resolve, reject) => { rejectPost = reject; }));
  getComments.mockResolvedValue([]);
  await act(async () => root.render(<MemoryRouter initialEntries={['/posts/11']}>
    <Link to="/home">Leave page</Link><Routes>
      <Route path="/posts/:id" element={<PostDetailCore />} /><Route path="/home" element={<h1>Existing home</h1>} />
      <Route path="/404" element={<h1>Not found page</h1>} />
    </Routes>
  </MemoryRouter>));
  await act(async () => container.querySelector('a').click());
  await act(async () => rejectPost(missing()));
  expect(container.textContent).toContain('Existing home');
  expect(container.textContent).not.toContain('Not found page');
});
