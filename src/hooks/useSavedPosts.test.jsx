import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import useSavedPosts from './useSavedPosts';
import SaveButton from '../components/posts/SaveButton';
import { getSavedPosts, toggleSave } from '../services/interactionService';
jest.mock('../services/interactionService');
jest.mock('react-hot-toast', () => ({ success: jest.fn(), error: jest.fn() }));
let host, root;
function Harness({ enabled = true }) { const saved = useSavedPosts(enabled); return <SaveButton postId={71} saved={saved} />; }
beforeEach(() => { jest.resetAllMocks(); global.IS_REACT_ACT_ENVIRONMENT = true; host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host); });
afterEach(async () => { await act(async () => root.unmount()); host.remove(); });
async function render(enabled = true) { await act(async () => root.render(<Harness enabled={enabled} />)); }
async function click() { await act(async () => host.querySelector('button').click()); }
test('reload rehydrates saved IDs including subsequent pages', async () => {
 getSavedPosts.mockImplementation(({ pageIndex }) => Promise.resolve({ items: pageIndex === 1 ? [{ postId: 4 }] : [{ postId: 71 }], totalPages: 2 }));
 await render(); expect(host.textContent).toBe('Saved'); expect(getSavedPosts).toHaveBeenCalledWith({ pageIndex: 2, pageSize: 50 });
 await act(async () => root.unmount()); root = createRoot(host); await render(); expect(host.textContent).toBe('Saved');
});
test('unsave uses backend response and survives remount', async () => {
 getSavedPosts.mockResolvedValueOnce({ items: [{ postId: 71 }], totalPages: 1 }).mockResolvedValue({ items: [], totalPages: 0 });
 toggleSave.mockResolvedValue({ isSaved: false }); await render(); await click(); expect(host.textContent).toBe('Save recipe');
 await act(async () => root.unmount()); root = createRoot(host); await render(); expect(host.textContent).toBe('Save recipe');
});
test('load failure retries and does not send toggle while status unknown', async () => {
 getSavedPosts.mockRejectedValueOnce(new Error()).mockResolvedValue({ items: [{ postId: 71 }], totalPages: 1 });
 await render(); expect(host.textContent).toBe('Retry saved status'); await click(); expect(toggleSave).not.toHaveBeenCalled(); expect(host.textContent).toBe('Saved');
});
test('failed mutation preserves saved status', async () => {
 getSavedPosts.mockResolvedValue({ items: [{ postId: 71 }], totalPages: 1 }); toggleSave.mockRejectedValue(new Error()); await render(); await click(); expect(host.textContent).toBe('Saved');
});
test('guests do not request saved posts', async () => { await render(false); expect(getSavedPosts).not.toHaveBeenCalled(); });
