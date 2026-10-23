import { vi } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import MyPosts from './MyPosts';
import PostStatusBadge, { resolvePostStatus, extractModerationReason, PostStatusNotice } from '../../components/posts/PostStatusBadge';
import { getMyPosts, deletePost, getCategories } from '../../services/postService';
import { getFollowStatus, getFollowers, getFollowing } from '../../services/userService';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../services/userService', () => ({
  getFollowStatus: vi.fn(),
  getFollowers: vi.fn(),
  getFollowing: vi.fn(),
}));

vi.mock('../../services/postService', () => ({
  getMyPosts: vi.fn(),
  deletePost: vi.fn(),
  getCategories: vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 7, username: 'testuser', displayName: 'Test User' },
  }),
}));

vi.mock('../../components/layout/HeaderMember', () => ({ default: () => <div data-testid="header-member" /> }));
vi.mock('../../components/layout/Footer', () => ({ default: () => <div data-testid="footer" /> }));
vi.mock('../../components/chat/AIChatbot', () => ({ default: () => null }));
vi.mock('./SavedPosts', () => ({ default: () => <div data-testid="saved-posts" /> }));

let container, root;

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);

  getCategories.mockResolvedValue([
    { id: 1, name: 'Main Dish' },
    { id: 2, name: 'Dessert' },
  ]);
  getFollowStatus.mockResolvedValue({ followersCount: 10, followingCount: 5 });
  getFollowers.mockResolvedValue({ totalCount: 10, items: [] });
  getFollowing.mockResolvedValue({ totalCount: 5, items: [] });
  mockNavigate.mockClear();
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.clearAllMocks();
});

describe('MY-POSTS-MODERATION-STATUS-01: Moderation Status System in My Posts', () => {
  // Requirement 1: Published post displays a green Published badge
  test('1. Published post displays a green Published badge without red border or hidden overlay', async () => {
    getMyPosts.mockResolvedValue({
      items: [
        {
          id: 101,
          title: 'Crispy Vegan Tofu Bowl',
          status: 'published',
          viewCount: 42,
          likeCount: 18,
          createdAt: '2026-10-20T10:00:00Z',
        },
      ],
      totalCount: 1,
    });

    await act(async () => {
      root.render(
        <MemoryRouter>
          <MyPosts />
        </MemoryRouter>
      );
    });

    const badge = container.querySelector('[data-testid="post-status-badge"]');
    expect(badge).not.toBeNull();
    expect(badge.textContent).toContain('Published');
    // Subtle green styling class
    expect(badge.className).toContain('text-[#2F5233]');

    const card = container.querySelector('[data-testid="post-card-101"]');
    expect(card).not.toBeNull();
    // Normal border, no red accent strip
    expect(card.querySelector('[data-testid="post-red-strip"]')).toBeNull();
    expect(card.className).not.toContain('border-red-400');
    expect(container.querySelector('[data-testid="post-status-notice"]')).toBeNull();
  });

  // Requirement 2: Flagged post displays a red Flagged/Under Review badge
  test('2. Flagged post displays a red Flagged/Under Review badge with red border and strip', async () => {
    getMyPosts.mockResolvedValue({
      items: [
        {
          id: 102,
          title: 'Questionable Herb Soup',
          status: 'pending_review',
          viewCount: 5,
          likeCount: 1,
          createdAt: '2026-10-21T12:00:00Z',
        },
      ],
      totalCount: 1,
    });

    await act(async () => {
      root.render(
        <MemoryRouter>
          <MyPosts />
        </MemoryRouter>
      );
    });

    const badge = container.querySelector('[data-testid="post-status-badge"]');
    expect(badge).not.toBeNull();
    expect(badge.textContent).toContain('Under Review');
    expect(badge.className).toContain('text-red-700');

    const card = container.querySelector('[data-testid="post-card-102"]');
    expect(card).not.toBeNull();
    expect(card.className).toContain('border-red-400');
    // Red status strip at top
    expect(card.querySelector('[data-testid="post-red-strip"]')).not.toBeNull();

    // Concise explanatory notice
    const notice = container.querySelector('[data-testid="post-status-notice"]');
    expect(notice).not.toBeNull();
    expect(notice.textContent).toContain('This post is under moderation review');
  });

  // Also verify raw 'flagged' status renders Flagged label
  test('2b. Post with raw status="flagged" renders red Flagged badge', async () => {
    getMyPosts.mockResolvedValue({
      items: [
        {
          id: 1022,
          title: 'Spicy Mushroom Stirfry',
          status: 'flagged',
          viewCount: 2,
          likeCount: 0,
        },
      ],
      totalCount: 1,
    });

    await act(async () => {
      root.render(
        <MemoryRouter>
          <MyPosts />
        </MemoryRouter>
      );
    });

    const badge = container.querySelector('[data-testid="post-status-badge"]');
    expect(badge.textContent).toContain('Flagged');
    expect(badge.className).toContain('text-red-700');
    expect(container.textContent).toContain('This post is under moderation review');
  });

  // Requirement 3: Hidden/removed post displays a red status treatment and accurate explanatory message
  test('3. Hidden/removed/rejected post displays red treatment and "not currently visible to the public"', async () => {
    getMyPosts.mockResolvedValue({
      items: [
        {
          id: 103,
          title: 'Hidden Dairy-Accidental Recipe',
          status: 'hidden',
          viewCount: 12,
          likeCount: 3,
        },
        {
          id: 104,
          title: 'Rejected Non-Vegan Dish',
          status: 'rejected',
          viewCount: 0,
          likeCount: 0,
        },
      ],
      totalCount: 2,
    });

    await act(async () => {
      root.render(
        <MemoryRouter>
          <MyPosts />
        </MemoryRouter>
      );
    });

    const cardHidden = container.querySelector('[data-testid="post-card-103"]');
    expect(cardHidden).not.toBeNull();
    expect(cardHidden.className).toContain('border-red-400');
    expect(cardHidden.querySelector('[data-testid="post-red-strip"]')).not.toBeNull();
    expect(cardHidden.textContent).toContain('Hidden');
    expect(cardHidden.textContent).toContain('This post is not currently visible to the public');

    const cardRejected = container.querySelector('[data-testid="post-card-104"]');
    expect(cardRejected).not.toBeNull();
    expect(cardRejected.className).toContain('border-red-400');
    expect(cardRejected.querySelector('[data-testid="post-red-strip"]')).not.toBeNull();
    expect(cardRejected.textContent).toContain('Rejected');
    expect(cardRejected.textContent).toContain('This post is not currently visible to the public');
  });

  // Requirement 4: Draft post is visually distinct without being mistaken for a moderation violation
  test('4. Draft post is visually distinct without being mistaken for a moderation violation', async () => {
    getMyPosts.mockResolvedValue({
      items: [
        {
          id: 105,
          title: 'Draft Lemongrass Noodles',
          status: 'draft',
          viewCount: 0,
          likeCount: 0,
        },
      ],
      totalCount: 1,
    });

    await act(async () => {
      root.render(
        <MemoryRouter>
          <MyPosts />
        </MemoryRouter>
      );
    });

    const badge = container.querySelector('[data-testid="post-status-badge"]');
    expect(badge).not.toBeNull();
    expect(badge.textContent).toContain('Draft');
    expect(badge.className).toContain('text-amber-800');

    const card = container.querySelector('[data-testid="post-card-105"]');
    // Draft must NOT have red border or red strip
    expect(card.className).not.toContain('border-red-400');
    expect(card.querySelector('[data-testid="post-red-strip"]')).toBeNull();
    // No moderation notice
    expect(container.querySelector('[data-testid="post-status-notice"]')).toBeNull();
  });

  // Requirement 5: An available moderation reason is rendered safely
  test('5. An available moderation reason is rendered safely', async () => {
    getMyPosts.mockResolvedValue({
      items: [
        {
          id: 106,
          title: 'Questionable Cheese Salad',
          status: 'rejected',
          moderationReason: 'Contains parmesan cheese which is not vegan-compliant.',
        },
      ],
      totalCount: 1,
    });

    await act(async () => {
      root.render(
        <MemoryRouter>
          <MyPosts />
        </MemoryRouter>
      );
    });

    const reasonEl = container.querySelector('[data-testid="moderation-reason"]');
    expect(reasonEl).not.toBeNull();
    expect(reasonEl.textContent).toContain('Reason:');
    expect(reasonEl.textContent).toContain('Contains parmesan cheese which is not vegan-compliant.');
  });

  // Requirement 5b: Correlates moderation reason from authorized notifications when available
  test('5b. Correlates reason from notifications prop for restricted posts', async () => {
    getMyPosts.mockResolvedValue({
      items: [
        {
          id: 107,
          title: 'Mushroom Risotto with Cream',
          status: 'pending_review',
        },
      ],
      totalCount: 1,
    });

    const mockNotifications = [
      {
        id: 991,
        type: 'post_review',
        title: 'Post temporarily hidden',
        message: 'Your post needs an Admin review. AI detected non-vegan ingredient keyword "dairy cream"',
        targetUrl: '/posts/edit/107',
      },
    ];

    await act(async () => {
      root.render(
        <MemoryRouter>
          <MyPosts notifications={mockNotifications} />
        </MemoryRouter>
      );
    });

    const reasonEl = container.querySelector('[data-testid="moderation-reason"]');
    expect(reasonEl).not.toBeNull();
    expect(reasonEl.textContent).toContain('AI detected non-vegan ingredient keyword "dairy cream"');
  });

  // Requirement 6: Missing reason does not produce fabricated explanatory content
  test('6. Missing reason does not produce fabricated explanatory content or empty reason container', async () => {
    getMyPosts.mockResolvedValue({
      items: [
        {
          id: 108,
          title: 'Held Stew without Reason',
          status: 'pending_review',
        },
      ],
      totalCount: 1,
    });

    await act(async () => {
      root.render(
        <MemoryRouter>
          <MyPosts />
        </MemoryRouter>
      );
    });

    // Notice banner exists with only the official standard message
    const notice = container.querySelector('[data-testid="post-status-notice"]');
    expect(notice).not.toBeNull();
    expect(notice.textContent).toContain('This post is under moderation review');

    // No reason container rendered
    const reasonEl = container.querySelector('[data-testid="moderation-reason"]');
    expect(reasonEl).toBeNull();
    expect(container.textContent).not.toContain('Reason:');
  });

  // Requirement 7: Status is updated after a successful refresh/refetch
  test('7. Status is updated after clicking Refresh button', async () => {
    getMyPosts.mockResolvedValueOnce({
      items: [
        {
          id: 109,
          title: 'Review in Progress',
          status: 'pending_review',
        },
      ],
      totalCount: 1,
    });

    await act(async () => {
      root.render(
        <MemoryRouter>
          <MyPosts />
        </MemoryRouter>
      );
    });

    expect(container.textContent).toContain('Under Review');
    expect(container.querySelector('[data-testid="post-red-strip"]')).not.toBeNull();

    // Admin approves the post: next fetch returns 'published'
    getMyPosts.mockResolvedValueOnce({
      items: [
        {
          id: 109,
          title: 'Review in Progress',
          status: 'published',
        },
      ],
      totalCount: 1,
    });

    const refreshBtn = container.querySelector('button[aria-label="Refresh posts"]');
    expect(refreshBtn).not.toBeNull();

    await act(async () => {
      refreshBtn.click();
    });

    // Now post is published, no red strip
    expect(container.textContent).toContain('Published');
    expect(container.querySelector('[data-testid="post-red-strip"]')).toBeNull();
  });

  // Requirement 8: Unknown or missing status does not default incorrectly to Published
  test('8. Unknown or missing status does not default incorrectly to Published', async () => {
    getMyPosts.mockResolvedValue({
      items: [
        {
          id: 110,
          title: 'Post with Missing Status',
          // status is undefined
        },
        {
          id: 111,
          title: 'Post with Unknown Custom Status',
          status: 'archived_pending_decision',
        },
      ],
      totalCount: 2,
    });

    await act(async () => {
      root.render(
        <MemoryRouter>
          <MyPosts />
        </MemoryRouter>
      );
    });

    const badges = container.querySelectorAll('[data-testid="post-status-badge"]');
    expect(badges).toHaveLength(2);

    // Neither badge should claim to be "Published"
    expect(badges[0].textContent).not.toContain('Published');
    expect(badges[0].textContent).toBe('Unknown');
    expect(badges[0].className).toContain('text-stone-700');

    expect(badges[1].textContent).not.toContain('Published');
    expect(badges[1].textContent).toBe('archived_pending_decision');
    expect(badges[1].className).toContain('text-stone-700');
  });

  // Requirement 9: Existing My Posts actions remain functional (view, edit, delete)
  test('9. Existing My Posts actions remain functional (view, edit, delete)', async () => {
    getMyPosts.mockResolvedValue({
      items: [
        {
          id: 112,
          title: 'Editable Vegan Cake',
          status: 'pending_review',
        },
      ],
      totalCount: 1,
    });
    deletePost.mockResolvedValue({ success: true });

    await act(async () => {
      root.render(
        <MemoryRouter>
          <MyPosts />
        </MemoryRouter>
      );
    });

    // Click title navigates to view post
    const titleEl = container.querySelector('h3');
    await act(async () => {
      titleEl.click();
    });
    expect(mockNavigate).toHaveBeenCalledWith('/posts/112');

    // Click edit button navigates to edit post
    const editBtn = container.querySelector('button[aria-label="Edit Editable Vegan Cake"]');
    expect(editBtn).not.toBeNull();
    await act(async () => {
      editBtn.click();
    });
    expect(mockNavigate).toHaveBeenCalledWith('/posts/edit/112');

    // Click delete button opens confirmation modal
    const deleteBtn = container.querySelector('button[aria-label="Delete Editable Vegan Cake"]');
    expect(deleteBtn).not.toBeNull();
    await act(async () => {
      deleteBtn.click();
    });
    expect(container.textContent).toContain('Delete Recipe?');
    expect(container.textContent).toContain('Are you sure you want to delete "Editable Vegan Cake"?');

    // Confirm deletion
    const confirmBtn = [...container.querySelectorAll('button')].find(b => b.textContent.trim() === 'Delete');
    await act(async () => {
      confirmBtn.click();
    });
    expect(deletePost).toHaveBeenCalledWith(112);
  });

  // Requirement 10: No status from another user is displayed on the current user's profile
  test('10. Scopes all posts and moderation reasons strictly to the logged-in user', async () => {
    getMyPosts.mockResolvedValue({
      items: [
        {
          id: 113,
          authorId: 7, // current user id
          title: 'My Own Post',
          status: 'published',
        },
      ],
      totalCount: 1,
    });

    // Notification intended for a different user's post id 999
    const otherUserNotifications = [
      {
        id: 88,
        type: 'post_review',
        title: 'Post rejected',
        message: 'Other user violation reason that must not appear here',
        targetUrl: '/posts/edit/999',
      },
    ];

    await act(async () => {
      root.render(
        <MemoryRouter>
          <MyPosts notifications={otherUserNotifications} />
        </MemoryRouter>
      );
    });

    expect(container.textContent).toContain('My Own Post');
    expect(container.textContent).not.toContain('Other user violation reason');
  });

  // Status Priority / Precedence test
  test('Status Priority: moderationHold=true overrides published status string', () => {
    const postWithHold = {
      id: 201,
      status: 'published',
      moderationHold: true,
    };
    const resolved = resolvePostStatus(postWithHold);
    expect(resolved.key).toBe('under_review');
    expect(resolved.label).toBe('Under Review');
    expect(resolved.isPublic).toBe(false);
    expect(resolved.isRed).toBe(true);
    expect(resolved.message).toBe('This post is under moderation review');
  });

  // Filter pills test
  test('Status filter pills filter displayed posts accurately', async () => {
    getMyPosts.mockResolvedValue({
      items: [
        { id: 301, title: 'Published 1', status: 'published' },
        { id: 302, title: 'Review 1', status: 'pending_review' },
        { id: 303, title: 'Hidden 1', status: 'hidden' },
      ],
      totalCount: 3,
    });

    await act(async () => {
      root.render(
        <MemoryRouter>
          <MyPosts />
        </MemoryRouter>
      );
    });

    // Initial: All 3 visible
    expect(container.querySelectorAll('article')).toHaveLength(3);

    // Click "Under Review (1)"
    const underReviewFilter = [...container.querySelectorAll('button')].find(b => b.textContent.includes('Under Review (1)'));
    expect(underReviewFilter).toBeDefined();

    await act(async () => {
      underReviewFilter.click();
    });

    expect(container.querySelectorAll('article')).toHaveLength(1);
    expect(container.textContent).toContain('Review 1');
    expect(container.textContent).not.toContain('Published 1');
  });

  // Error state test with retry
  test('API failure displays error message and allows retry', async () => {
    getMyPosts.mockRejectedValueOnce(new Error('Network failure'));

    await act(async () => {
      root.render(
        <MemoryRouter>
          <MyPosts />
        </MemoryRouter>
      );
    });

    expect(container.textContent).toContain('Failed to load your posts');
    const retryBtn = [...container.querySelectorAll('button')].find(b => b.textContent.trim() === 'Try again');
    expect(retryBtn).toBeDefined();

    getMyPosts.mockResolvedValueOnce({
      items: [{ id: 401, title: 'Recovered Post', status: 'published' }],
      totalCount: 1,
    });

    await act(async () => {
      retryBtn.click();
    });

    expect(container.textContent).toContain('Recovered Post');
  });
});
