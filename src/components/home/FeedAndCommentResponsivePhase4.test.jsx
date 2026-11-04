import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import CommentModal from './CommentModal';
import InlinePostCard from './InlinePostCard';
import HomeSocialNav from './HomeSocialNav';
import HomeUtilityRail from './HomeUtilityRail';
import * as interactionService from '../../services/interactionService';
import * as postDetailsCache from '../../services/postDetailsCache';

vi.mock('../../services/interactionService', () => ({
  getComments: vi.fn(),
  createComment: vi.fn(),
  updateComment: vi.fn(),
  deleteComment: vi.fn(),
  reportComment: vi.fn(),
  toggleLike: vi.fn(),
  toggleSave: vi.fn(),
}));

vi.mock('../../services/postDetailsCache', () => ({
  fetchPostDetailsWithCache: vi.fn(),
  updatePostDetailsCache: vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'user-101', role: 'Member', displayName: 'Member User' },
    isAuthenticated: true,
  })),
}));

describe('Phase 4 Responsive Verification — Community Feed & Nested Comments', () => {
  let container, root;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    document.body.style.overflow = '';
  });

  const mockPost = {
    id: 'post-100',
    title: 'Vietnamese Mushroom Pho',
    authorName: 'Chef Linh',
    authorId: 'user-10',
    createdAt: '2026-10-15T10:00:00Z',
    likeCount: 5,
    viewCount: 42,
  };

  it('renders root comment (depth 1) with ml-0 and standard avatar w-8 h-8', async () => {
    interactionService.getComments.mockResolvedValueOnce([
      {
        id: 'c-root',
        postId: 'post-100',
        userId: 'user-20',
        authorName: 'An Nguyen',
        content: 'Looks very fragrant!',
        createdAt: '2026-10-15T11:00:00Z',
        depth: 1,
        replies: [],
      },
    ]);

    await act(async () => {
      root.render(<CommentModal isOpen={true} onClose={() => { }} post={mockPost} />);
    });

    const commentBoxes = container.querySelectorAll('.rounded-xl.shadow-2xs');
    expect(commentBoxes.length).toBe(1);
    expect(commentBoxes[0].className).toContain('ml-0');
    // Root avatar should not have w-7 h-7
    expect(commentBoxes[0].querySelector('.w-8.h-8')).not.toBeNull();
    expect(commentBoxes[0].querySelector('.w-7.h-7')).toBeNull();
  });

  it('renders nested replies (depth 2, 3, 4) with responsive ml classes and compact mobile avatar w-7 h-7', async () => {
    interactionService.getComments.mockResolvedValueOnce([
      {
        id: 'c-root',
        postId: 'post-100',
        userId: 'user-20',
        authorName: 'An Nguyen',
        content: 'Root comment',
        depth: 1,
        replies: [
          {
            id: 'c-reply-1',
            postId: 'post-100',
            userId: 'user-30',
            authorName: 'Bao Tran',
            content: 'Level 2 reply',
            depth: 2,
            replies: [
              {
                id: 'c-reply-2',
                postId: 'post-100',
                userId: 'user-40',
                authorName: 'Chi Mai',
                content: 'Level 3 reply',
                depth: 3,
                replies: [
                  {
                    id: 'c-reply-3',
                    postId: 'post-100',
                    userId: 'user-50',
                    authorName: 'Dung Le',
                    content: 'Level 4 reply',
                    depth: 4,
                    replies: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);

    await act(async () => {
      root.render(<CommentModal isOpen={true} onClose={() => { }} post={mockPost} />);
    });

    const commentBoxes = container.querySelectorAll('.rounded-xl.shadow-2xs');
    expect(commentBoxes.length).toBe(4);

    // Depth 1: ml-0
    expect(commentBoxes[0].className).toContain('ml-0');

    // Depth 2: ml-3 sm:ml-4 (12px mobile, 16px desktop)
    expect(commentBoxes[1].className).toContain('ml-3');
    expect(commentBoxes[1].className).toContain('sm:ml-4');
    expect(commentBoxes[1].querySelector('.w-7.h-7')).not.toBeNull();

    // Depth 3: ml-6 sm:ml-8 (24px mobile, 32px desktop)
    expect(commentBoxes[2].className).toContain('ml-6');
    expect(commentBoxes[2].className).toContain('sm:ml-8');
    expect(commentBoxes[2].querySelector('.w-7.h-7')).not.toBeNull();

    // Depth 4: ml-9 sm:ml-12 (capped at 36px on mobile)
    expect(commentBoxes[3].className).toContain('ml-9');
    expect(commentBoxes[3].className).toContain('sm:ml-12');
    expect(commentBoxes[3].querySelector('.w-7.h-7')).not.toBeNull();
  });

  it('renders InlinePostCard social action buttons with whitespace-nowrap and mobile safety padding', async () => {
    postDetailsCache.fetchPostDetailsWithCache.mockResolvedValueOnce({
      id: 101,
      title: 'Vietnamese Mushroom Pho',
      likeCount: 5,
      isLiked: false,
      isSaved: false,
    });

    await act(async () => {
      root.render(
        <BrowserRouter>
          <InlinePostCard post={mockPost} isGuest={false} />
        </BrowserRouter>
      );
    });

    // Check action bar container has px-1.5 sm:px-4
    const actionBar = container.querySelector('.px-1\\.5.sm\\:px-4');
    expect(actionBar).not.toBeNull();

    // Check all action buttons have whitespace-nowrap and px-1 sm:px-2
    const actionButtons = actionBar.querySelectorAll('button');
    expect(actionButtons.length).toBe(4);
    actionButtons.forEach((btn) => {
      expect(btn.className).toContain('whitespace-nowrap');
      expect(btn.className).toContain('px-1');
      expect(btn.className).toContain('sm:px-2');
    });
  });

  it('verifies HomeSocialNav activates at lg (1024px) with ladder lg:220px xl:240px 2xl:260px', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <HomeSocialNav isGuest={false} onOpenComposer={() => { }} />
        </BrowserRouter>
      );
    });

    const aside = container.querySelector('aside[aria-label="Social Navigation"]');
    expect(aside).not.toBeNull();
    expect(aside.className).toContain('hidden lg:block');
    expect(aside.className).toContain('lg:w-[220px]');
    expect(aside.className).toContain('xl:w-[240px]');
    expect(aside.className).toContain('2xl:w-[260px]');
  });

  it('verifies HomeUtilityRail activates at xl and 1440px to display weekly menu and categories without truncation', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <HomeUtilityRail isGuest={false} categories={[]} selectedCategoryId={null} onSelectCategory={() => { }} />
        </BrowserRouter>
      );
    });

    const aside = container.querySelector('aside[aria-label="Community Utilities"]');
    expect(aside).not.toBeNull();
    expect(aside.className).toContain('hidden xl:block');
    expect(aside.className).toContain('xl:w-[280px]');
    expect(aside.className).toContain('min-[1400px]:w-[300px]');
  });
});

