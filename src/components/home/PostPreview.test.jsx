import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { it, expect, vi } from 'vitest';
import PostDetailCore from './PostDetailCore';
import { getPostDetail, getCategories } from '../../services/postService';
import { getComments } from '../../services/interactionService';

vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ user: { id: 99, role: 'admin' } }) }));
vi.mock('../../services/postService', () => ({ getPostDetail: vi.fn(), getCategories: vi.fn(), reportPost: vi.fn() }));
vi.mock('../../services/interactionService', () => ({
  getComments: vi.fn(), createComment: vi.fn(), updateComment: vi.fn(), deleteComment: vi.fn(),
  reportComment: vi.fn(), toggleLike: vi.fn(), toggleSave: vi.fn(), COMMENT_DELETE_REASON_MAX_LENGTH: 500,
}));

it('renders a held post as a read-only preview without requesting public comments', async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  getPostDetail.mockResolvedValue({ id: 162, title: 'Held post', status: 'pending_review', moderationHold: true, authorId: 10, media: [], ingredients: [], steps: [] });
  getCategories.mockResolvedValue([]);
  const container = document.createElement('div'); document.body.appendChild(container);
  const root = createRoot(container);
  try {
    await act(async () => {
      root.render(<MemoryRouter initialEntries={['/posts/162']}><Routes><Route path="/posts/:id" element={<PostDetailCore isGuest={false} />} /></Routes></MemoryRouter>);
    });
    expect(container.textContent).toContain('Held post');
    expect(container.textContent).toContain('Post preview');
    expect(container.textContent).toContain('Interactions are unavailable');
    expect(container.querySelector('#comments')).toBeNull();
    expect(getComments).not.toHaveBeenCalled();
    expect(container.querySelector('textarea')).toBeNull();
  } finally {
    await act(async () => root.unmount());
    container.remove();
  }
});
