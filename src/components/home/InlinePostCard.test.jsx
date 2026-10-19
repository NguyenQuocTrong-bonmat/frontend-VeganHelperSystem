import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import InlinePostCard from './InlinePostCard';
import * as interactionService from '../../services/interactionService';
import * as postDetailsCache from '../../services/postDetailsCache';

vi.mock('../../services/interactionService', () => ({
  toggleLike: vi.fn(),
  toggleSave: vi.fn(),
}));

vi.mock('../../services/postDetailsCache', () => ({
  fetchPostDetailsWithCache: vi.fn(),
  updatePostDetailsCache: vi.fn(),
}));

describe('InlinePostCard', () => {
  let container, root;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vi.clearAllMocks();

    postDetailsCache.fetchPostDetailsWithCache.mockResolvedValue({
      id: 101,
      title: 'Crispy Vegan Spring Rolls',
      content: 'Crispy spring rolls filled with wood-ear mushrooms, carrots, and tofu.',
      cookingTimeMins: 25,
      difficultyLevel: 'Easy',
      dietType: 'Vegan',
      likeCount: 12,
      isLiked: false,
      isSaved: false,
    });
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  const mockPost = {
    id: 101,
    title: 'Crispy Vegan Spring Rolls',
    content: 'Crispy spring rolls filled with wood-ear mushrooms, carrots, and tofu.',
    postType: 'recipe',
    thumbnailUrl: '/images/spring-rolls.jpg',
    authorName: 'Chef Linh',
    authorId: 5,
    avatarUrl: '/images/linh-avatar.jpg',
    viewCount: 150,
    likeCount: 12,
    isLiked: false,
    isSaved: false,
    createdAt: '2026-10-15T10:00:00Z',
  };

  it('renders author header, formatted date dd/MM/yyyy, and post title inline', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <InlinePostCard post={mockPost} isGuest={false} />
        </BrowserRouter>
      );
    });

    expect(container.textContent).toContain('Chef Linh');
    expect(container.textContent).toContain('15/10/2026');
    expect(container.textContent).toContain('Crispy Vegan Spring Rolls');
    expect(container.textContent).toContain('Crispy spring rolls filled with');
  });

  it('supports "See more" and "See less" for long body text', async () => {
    const longContent = 'Fresh vegetables and tofu tossed in ginger sesame glaze. '.repeat(10);
    const postWithLongContent = { ...mockPost, content: longContent };

    await act(async () => {
      root.render(
        <BrowserRouter>
          <InlinePostCard post={postWithLongContent} isGuest={false} />
        </BrowserRouter>
      );
    });

    const seeMoreBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === 'See more'
    );
    expect(seeMoreBtn).toBeDefined();

    await act(async () => {
      seeMoreBtn.click();
    });

    const seeLessBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === 'See less'
    );
    expect(seeLessBtn).toBeDefined();
  });

  it('clicking image triggers onOpenLightbox without route navigation', async () => {
    const handleOpenLightbox = vi.fn();

    await act(async () => {
      root.render(
        <BrowserRouter>
          <InlinePostCard post={mockPost} isGuest={false} onOpenLightbox={handleOpenLightbox} />
        </BrowserRouter>
      );
    });

    const img = container.querySelector('img[alt="Crispy Vegan Spring Rolls"]');
    expect(img).not.toBeNull();

    await act(async () => {
      img.click();
    });

    expect(handleOpenLightbox).toHaveBeenCalledWith(
      expect.stringContaining('/images/spring-rolls.jpg'),
      'Crispy Vegan Spring Rolls'
    );
  });

  it('toggles Like with real API call and updates state', async () => {
    interactionService.toggleLike.mockResolvedValueOnce({
      postId: 101,
      isLiked: true,
      likeCount: 13,
    });

    await act(async () => {
      root.render(
        <BrowserRouter>
          <InlinePostCard post={mockPost} isGuest={false} />
        </BrowserRouter>
      );
    });

    const likeBtn = container.querySelector('button[aria-label="Like post"]');
    expect(likeBtn).not.toBeNull();

    await act(async () => {
      likeBtn.click();
    });

    expect(interactionService.toggleLike).toHaveBeenCalledWith(101);
  });

  it('toggles Save with real API call and updates state', async () => {
    interactionService.toggleSave.mockResolvedValueOnce({
      postId: 101,
      isSaved: true,
    });

    await act(async () => {
      root.render(
        <BrowserRouter>
          <InlinePostCard post={mockPost} isGuest={false} />
        </BrowserRouter>
      );
    });

    const saveBtn = container.querySelector('button[aria-label="Save recipe"]');
    expect(saveBtn).not.toBeNull();

    await act(async () => {
      saveBtn.click();
    });

    expect(interactionService.toggleSave).toHaveBeenCalledWith(101);
  });

  it('clicking Comment calls onOpenComments without route navigation', async () => {
    const handleOpenComments = vi.fn();

    await act(async () => {
      root.render(
        <BrowserRouter>
          <InlinePostCard post={mockPost} isGuest={false} onOpenComments={handleOpenComments} />
        </BrowserRouter>
      );
    });

    const commentBtn = container.querySelector('button[aria-label="Open comments dialog"]');
    expect(commentBtn).not.toBeNull();

    await act(async () => {
      commentBtn.click();
    });

    expect(handleOpenComments).toHaveBeenCalledTimes(1);
  });

  it('guest interactions trigger onAuthRequired', async () => {
    const handleAuthRequired = vi.fn();

    await act(async () => {
      root.render(
        <BrowserRouter>
          <InlinePostCard post={mockPost} isGuest={true} onAuthRequired={handleAuthRequired} />
        </BrowserRouter>
      );
    });

    const likeBtn = container.querySelector('button[aria-label="Like post"]');
    await act(async () => {
      likeBtn.click();
    });
    expect(handleAuthRequired).toHaveBeenCalledTimes(1);

    const saveBtn = container.querySelector('button[aria-label="Save recipe"]');
    await act(async () => {
      saveBtn.click();
    });
    expect(handleAuthRequired).toHaveBeenCalledTimes(2);
  });
});
