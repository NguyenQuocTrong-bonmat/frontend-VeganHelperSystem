import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { vi } from 'vitest';
import PostDetailRoute, { LegacyPostDetailRedirect } from './PostDetailRoute';
import { useAuth } from '../../context/AuthContext';

vi.mock('../../context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('../layout/HeaderMember', () => ({ default: () => <header>Member navigation</header> }));
vi.mock('../layout/HeaderGuest', () => ({ default: () => <header>Guest navigation</header> }));
vi.mock('../layout/Footer', () => ({ default: () => null }));
vi.mock('../chat/AIChatbot', () => ({ default: () => null }));
vi.mock('../home/PostDetailCore', () => ({ default: ({ isGuest, onAuthRequired }) => <article data-guest={String(isGuest)}><h1>Published post</h1><button onClick={onAuthRequired}>Request interaction</button></article> }));
let container, root;
function LocationProbe() {
  const location = useLocation();
  return <output data-testid="route">{JSON.stringify({pathname:location.pathname,search:location.search,hash:location.hash,from:location.state?.from?.pathname})}</output>;
}
const element = path => <MemoryRouter initialEntries={[path]} future={{v7_startTransition:true,v7_relativeSplatPath:true}}><LocationProbe /><Routes>
  <Route path="/posts/:id" element={<PostDetailRoute />} />
  <Route path="/posts/:id/guest" element={<LegacyPostDetailRedirect />} />
  <Route path="/login" element={<h1>Login page</h1>} />
</Routes></MemoryRouter>;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  useAuth.mockReturnValue({isAuthenticated:false,isLoading:false,restoreError:false});
  container=document.createElement('div');document.body.appendChild(container);root=createRoot(container);
});
afterEach(async()=>{await act(async()=>root.unmount());container.remove();vi.clearAllMocks();});
const render = async(path='/posts/244') => act(async()=>root.render(element(path)));

test('Guest opens the canonical post URL without redirecting to login',async()=>{
  await render();
  expect(container.querySelector('article').dataset.guest).toBe('true');
  expect(container.textContent).toContain('Guest navigation');
  expect(container.querySelector('[data-testid="route"]').textContent).toContain('/posts/244');
});
test.each(['Member','Admin'])('%s keeps member interactions on the same canonical URL',async role=>{
  useAuth.mockReturnValue({isAuthenticated:true,isLoading:false,user:{id:1,role}});
  await render();
  expect(container.querySelector('article').dataset.guest).toBe('false');
  expect(container.textContent).toContain('Member navigation');
});
test('old Guest links redirect while preserving query and comment anchor',async()=>{
  await render('/posts/244/guest?source=share#comments');
  expect(JSON.parse(container.querySelector('output').textContent)).toMatchObject({pathname:'/posts/244',search:'?source=share',hash:'#comments'});
  expect(container.querySelector('article').dataset.guest).toBe('true');
});
test.each([{isLoading:true,restoreError:false},{isLoading:false,restoreError:true}])('waits for a settled session: %j',async state=>{
  useAuth.mockReturnValue({isAuthenticated:false,...state});await render();
  expect(container.querySelector('article')).toBeNull();
  expect(container.textContent).toContain(state.isLoading?'Loading...':'Unable to reconnect');
});
test('Guest interaction opens sign-in dialog and remembers the post when going to Login',async()=>{
  await render();
  await act(async()=>container.querySelector('article button').click());
  expect(container.querySelector('[role="dialog"]')).not.toBeNull();
  const login=container.querySelector('[role="dialog"] a[href="/login"]');
  await act(async()=>login.click());
  expect(container.textContent).toContain('Login page');
  expect(JSON.parse(container.querySelector('output').textContent).from).toBe('/posts/244');
});
test('switches between Guest and member views when the auth session changes',async()=>{
  await render();expect(container.querySelector('article').dataset.guest).toBe('true');
  useAuth.mockReturnValue({isAuthenticated:true,isLoading:false,user:{id:7}});
  await render();expect(container.querySelector('article').dataset.guest).toBe('false');
});
