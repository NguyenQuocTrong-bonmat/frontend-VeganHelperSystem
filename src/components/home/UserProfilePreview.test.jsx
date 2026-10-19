import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import UserProfilePreview from './UserProfilePreview';
import UserCard from './UserCard';
import InlinePostCard from './InlinePostCard';
import FollowListModal from './FollowListModal';
import MyPosts from '../../pages/member/MyPosts';
import PublicUserProfile from '../../pages/member/PublicUserProfile';
import PostDetailCore from './PostDetailCore';
import * as userService from '../../services/userService';
import * as interactionService from '../../services/interactionService';
import * as postDetailsCache from '../../services/postDetailsCache';
import * as postService from '../../services/postService';

vi.mock('../../services/userService', () => ({
  getPublicProfile: vi.fn(),
  getFollowStatus: vi.fn(),
  followUser: vi.fn(),
  unfollowUser: vi.fn(),
  searchUsers: vi.fn(),
  getFollowers: vi.fn(),
  getFollowing: vi.fn(),
}));

vi.mock('../../services/postService', () => ({
  getMyPosts: vi.fn(),
  getCategories: vi.fn(),
  deletePost: vi.fn(),
  getPostDetail: vi.fn(),
}));

vi.mock('../../services/interactionService', () => ({
  toggleLike: vi.fn(),
  toggleSave: vi.fn(),
  getComments: vi.fn(),
}));

vi.mock('../../services/postDetailsCache', () => ({
  fetchPostDetailsWithCache: vi.fn(),
  updatePostDetailsCache: vi.fn(),
}));

// Mock AuthContext
const mockUseAuth = vi.fn();
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('FOLLOW-02 — UserProfilePreview & Follow UI', () => {
  let container, root;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vi.clearAllMocks();

    mockUseAuth.mockReturnValue({
      user: { id: 1, displayName: 'Current User', username: 'current_user' },
      isAuthenticated: true,
    });

    userService.getPublicProfile.mockResolvedValue({
      id: 5,
      username: 'cheflinh',
      displayName: 'Chef Linh',
      avatarUrl: '/images/linh.jpg',
      dietType: 'vegan',
      joinedAt: '2026-01-15T00:00:00Z',
      publishedPostCount: 14,
      receivedLikeCount: 88,
    });

    userService.getFollowStatus.mockResolvedValue({
      userId: 5,
      isFollowing: false,
      followersCount: 42,
      followingCount: 10,
    });

    postDetailsCache.fetchPostDetailsWithCache.mockResolvedValue({
      id: 101,
      title: 'Spring Rolls',
      content: 'Tofu and herbs',
      likeCount: 5,
      isLiked: false,
      isSaved: false,
    });
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  it('renders profile identity, diet badge, and real server stats for another user', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <UserProfilePreview
            isOpen={true}
            onClose={vi.fn()}
            userId={5}
            initialUser={{ id: 5, displayName: 'Chef Linh', username: 'cheflinh' }}
          />
        </BrowserRouter>
      );
    });

    expect(container.textContent).toContain('Chef Linh');
    expect(container.textContent).toContain('@cheflinh');
    expect(container.textContent).toContain('vegan');
    expect(container.textContent).toContain('14'); // published posts
    expect(container.textContent).toContain('42'); // followers count
    expect(container.textContent).toContain('10'); // following count
  });

  it('displays neutral placeholder "—" when optional stats are missing without fabricating zeros', async () => {
    userService.getPublicProfile.mockResolvedValueOnce({
      id: 9,
      username: 'mystery',
      displayName: 'Mystery Cook',
      avatarUrl: null,
      dietType: null,
      publishedPostCount: null,
    });

    userService.getFollowStatus.mockResolvedValueOnce({
      userId: 9,
      isFollowing: false,
      followersCount: null,
      followingCount: null,
    });

    await act(async () => {
      root.render(
        <BrowserRouter>
          <UserProfilePreview
            isOpen={true}
            onClose={vi.fn()}
            userId={9}
            initialUser={{ id: 9, displayName: 'Mystery Cook' }}
          />
        </BrowserRouter>
      );
    });

    expect(container.textContent).toContain('Mystery Cook');
    expect(container.textContent).toContain('—'); // Neutral placeholder
  });

  it('renders "Follow" button when not following, calls followUser, and increments count', async () => {
    userService.followUser.mockResolvedValueOnce({
      userId: 5,
      isFollowing: true,
      followersCount: 43,
      followingCount: 10,
    });

    await act(async () => {
      root.render(
        <BrowserRouter>
          <UserProfilePreview
            isOpen={true}
            onClose={vi.fn()}
            userId={5}
            initialUser={{ id: 5, displayName: 'Chef Linh' }}
          />
        </BrowserRouter>
      );
    });

    const followBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Follow')
    );
    expect(followBtn).toBeDefined();

    await act(async () => {
      followBtn.click();
    });

    expect(userService.followUser).toHaveBeenCalledWith(5);
    expect(container.textContent).toContain('Following');
    expect(container.textContent).toContain('43');
  });

  it('renders "Following" button when already following, calls unfollowUser, and decrements count', async () => {
    userService.getFollowStatus.mockResolvedValueOnce({
      userId: 5,
      isFollowing: true,
      followersCount: 50,
      followingCount: 10,
    });

    userService.unfollowUser.mockResolvedValueOnce({
      userId: 5,
      isFollowing: false,
      followersCount: 49,
      followingCount: 10,
    });

    await act(async () => {
      root.render(
        <BrowserRouter>
          <UserProfilePreview
            isOpen={true}
            onClose={vi.fn()}
            userId={5}
            initialUser={{ id: 5, displayName: 'Chef Linh' }}
          />
        </BrowserRouter>
      );
    });

    const followingBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Following')
    );
    expect(followingBtn).toBeDefined();

    await act(async () => {
      followingBtn.click();
    });

    expect(userService.unfollowUser).toHaveBeenCalledWith(5);
    expect(container.textContent).toContain('Follow');
    expect(container.textContent).toContain('49');
  });

  it('rolls back optimistic follow update when follow API request fails', async () => {
    userService.followUser.mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      root.render(
        <BrowserRouter>
          <UserProfilePreview
            isOpen={true}
            onClose={vi.fn()}
            userId={5}
            initialUser={{ id: 5, displayName: 'Chef Linh' }}
          />
        </BrowserRouter>
      );
    });

    const followBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Follow')
    );

    await act(async () => {
      followBtn.click();
    });

    expect(userService.followUser).toHaveBeenCalledWith(5);
    // Rolled back to Follow
    expect(container.textContent).toContain('Follow');
    expect(container.textContent).toContain('42');
  });

  it('prevents self-follow and displays "You" badge when viewing currently authenticated profile', async () => {
    // Current user id is 1
    await act(async () => {
      root.render(
        <BrowserRouter>
          <UserProfilePreview
            isOpen={true}
            onClose={vi.fn()}
            userId={1}
            initialUser={{ id: 1, displayName: 'Current User' }}
          />
        </BrowserRouter>
      );
    });

    expect(container.textContent).toContain('You');
    // Follow button must NOT be rendered
    const followButtons = Array.from(container.querySelectorAll('button')).filter(
      (b) => b.textContent.includes('Follow') || b.textContent.includes('Following')
    );
    expect(followButtons.length).toBe(0);
    expect(container.textContent).toContain('View Your Profile');
  });

  it('prompts guests to log in when clicking Follow on public profile preview', async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
    });

    const mockAuthRequired = vi.fn();

    await act(async () => {
      root.render(
        <BrowserRouter>
          <UserProfilePreview
            isOpen={true}
            onClose={vi.fn()}
            userId={5}
            isGuest={true}
            onAuthRequired={mockAuthRequired}
            initialUser={{ id: 5, displayName: 'Chef Linh' }}
          />
        </BrowserRouter>
      );
    });

    const followBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Follow')
    );
    expect(followBtn).toBeDefined();

    await act(async () => {
      followBtn.click();
    });

    expect(mockAuthRequired).toHaveBeenCalled();
    expect(userService.followUser).not.toHaveBeenCalled();
  });

  it('navigates to public profile /users/:id via explicit View Profile button', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <UserProfilePreview
            isOpen={true}
            onClose={vi.fn()}
            userId={5}
            initialUser={{ id: 5, displayName: 'Chef Linh' }}
          />
        </BrowserRouter>
      );
    });

    const viewProfileLink = Array.from(container.querySelectorAll('a')).find((a) =>
      a.textContent.includes('View Profile')
    );
    expect(viewProfileLink).toBeDefined();
    expect(viewProfileLink.getAttribute('href')).toBe('/users/5');
  });

  it('closes preview on close button click and Escape key', async () => {
    const mockClose = vi.fn();

    await act(async () => {
      root.render(
        <BrowserRouter>
          <UserProfilePreview
            isOpen={true}
            onClose={mockClose}
            userId={5}
            initialUser={{ id: 5, displayName: 'Chef Linh' }}
          />
        </BrowserRouter>
      );
    });

    const closeBtn = container.querySelector('button[aria-label="Close profile preview"]');
    expect(closeBtn).toBeDefined();

    await act(async () => {
      closeBtn.click();
    });
    expect(mockClose).toHaveBeenCalledTimes(1);

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(mockClose).toHaveBeenCalledTimes(2);
  });

  it('UserCard triggers onOpenProfilePreview instead of navigating away', async () => {
    const mockOpenPreview = vi.fn();
    const testUser = { id: 7, displayName: 'Eco Warrior', username: 'ecowarrior' };

    await act(async () => {
      root.render(
        <BrowserRouter>
          <UserCard user={testUser} onOpenProfilePreview={mockOpenPreview} />
        </BrowserRouter>
      );
    });

    const card = container.querySelector('[role="button"]');
    expect(card).toBeDefined();

    await act(async () => {
      card.click();
    });

    expect(mockOpenPreview).toHaveBeenCalledWith(testUser, expect.any(Object));
  });

  it('InlinePostCard clicking author avatar or name triggers onOpenProfilePreview', async () => {
    const mockOpenPreview = vi.fn();
    const mockPost = {
      id: 202,
      authorId: 5,
      authorName: 'Chef Linh',
      title: 'Tofu Curry',
      content: 'Rich turmeric curry with roasted chickpeas.',
      createdAt: '2026-10-15T12:00:00Z',
    };

    await act(async () => {
      root.render(
        <BrowserRouter>
          <InlinePostCard
            post={mockPost}
            onOpenProfilePreview={mockOpenPreview}
          />
        </BrowserRouter>
      );
    });

    // Author button in header
    const authorBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent.includes('Chef Linh')
    );
    expect(authorBtn).toBeDefined();

    await act(async () => {
      authorBtn.click();
    });

    expect(mockOpenPreview).toHaveBeenCalledWith(
      expect.objectContaining({ id: 5, displayName: 'Chef Linh' }),
      expect.any(Object)
    );
  });

  it('discards stale profile response when target userId rapidly changes', async () => {
    let resolveFirst;
    userService.getPublicProfile.mockImplementationOnce(
      () => new Promise((res) => { resolveFirst = res; })
    );

    userService.getPublicProfile.mockResolvedValueOnce({
      id: 8,
      displayName: 'User Eight',
      username: 'user8',
      publishedPostCount: 20,
    });

    await act(async () => {
      root.render(
        <BrowserRouter>
          <UserProfilePreview
            isOpen={true}
            onClose={vi.fn()}
            userId={7}
            initialUser={{ id: 7, displayName: 'User Seven' }}
          />
        </BrowserRouter>
      );
    });

    // Immediately switch to user 8
    await act(async () => {
      root.render(
        <BrowserRouter>
          <UserProfilePreview
            isOpen={true}
            onClose={vi.fn()}
            userId={8}
            initialUser={{ id: 8, displayName: 'User Eight' }}
          />
        </BrowserRouter>
      );
    });

    // Now resolve user 7 late
    if (resolveFirst) {
      await act(async () => {
        resolveFirst({
          id: 7,
          displayName: 'Stale User Seven',
          publishedPostCount: 999,
        });
      });
    }

    // Should display User Eight, NOT the stale user 7 data
    expect(container.textContent).toContain('User Eight');
    expect(container.textContent).not.toContain('Stale User Seven');
    expect(container.textContent).not.toContain('999');
  });

  it('MyPosts loads real followers and following counts and opens FollowListModal on click', async () => {
    postService.getMyPosts.mockResolvedValueOnce({
      items: [{ id: 101, title: 'My Vegan Pho', viewCount: 15, likeCount: 8, createdAt: '2026-10-15T00:00:00Z' }],
    });
    postService.getCategories.mockResolvedValueOnce([]);

    userService.getFollowStatus.mockResolvedValueOnce({
      userId: 1,
      isFollowing: false,
      followersCount: 128,
      followingCount: 45,
    });

    userService.getFollowers.mockResolvedValueOnce({
      items: [
        { id: 10, displayName: 'Follower One', username: 'follower1', followedAt: '2026-10-01T00:00:00Z' },
      ],
      totalCount: 1,
    });

    await act(async () => {
      root.render(
        <BrowserRouter>
          <MyPosts />
        </BrowserRouter>
      );
    });

    // Verify followers and following counts are updated with real numbers
    expect(container.textContent).toContain('128');
    expect(container.textContent).toContain('45');
    expect(container.textContent).toContain('Followers');
    expect(container.textContent).toContain('Following');

    // Click the Followers button to open modal
    const followersBtn = container.querySelector('button[title="View your followers"]');
    expect(followersBtn).toBeDefined();

    await act(async () => {
      followersBtn.click();
    });

    // FollowListModal should be rendered with Connections title
    expect(container.textContent).toContain('Connections');
    expect(container.textContent).toContain('Follower One');
    expect(container.textContent).toContain('@follower1');
  });

  it('navigates to /my-posts via "View Your Profile" for self and retrieves counts via pagination without getFollowStatus', async () => {
    userService.getPublicProfile.mockResolvedValueOnce({
      id: 1,
      displayName: 'Current User',
      username: 'current_user',
      publishedPostCount: 12,
    });
    userService.getFollowers.mockResolvedValueOnce({ totalCount: 99, items: [] });
    userService.getFollowing.mockResolvedValueOnce({ totalCount: 33, items: [] });

    await act(async () => {
      root.render(
        <BrowserRouter>
          <UserProfilePreview
            isOpen={true}
            onClose={vi.fn()}
            userId={1}
            initialUser={{ id: 1, displayName: 'Current User' }}
          />
        </BrowserRouter>
      );
    });

    // Should NOT call getFollowStatus for self (which would 400 on backend)
    expect(userService.getFollowStatus).not.toHaveBeenCalled();
    expect(userService.getFollowers).toHaveBeenCalledWith(1, 1, 1);
    expect(userService.getFollowing).toHaveBeenCalledWith(1, 1, 1);

    // Should display 'You' badge and 'View Your Profile' link pointing to /my-posts
    expect(container.textContent).toContain('You');
    const viewProfileLink = Array.from(container.querySelectorAll('a')).find((a) =>
      a.textContent.includes('View Your Profile')
    );
    expect(viewProfileLink).toBeDefined();
    expect(viewProfileLink.getAttribute('href')).toBe('/my-posts');

    // Should not render Follow button on self profile preview
    const followButtons = Array.from(container.querySelectorAll('button')).filter((b) =>
      b.textContent === 'Follow' || b.textContent === 'Following'
    );
    expect(followButtons).toHaveLength(0);

    // Counts should reflect the paginated response
    expect(container.textContent).toContain('99');
    expect(container.textContent).toContain('33');
  });

  it('PublicUserProfile displays follower counts, Follow button for another user, and opens FollowListModal', async () => {
    userService.getPublicProfile.mockResolvedValueOnce({
      id: 5,
      displayName: 'Chef Linh',
      username: 'cheflinh',
      dietType: 'vegan',
      joinedAt: '2026-01-15T00:00:00Z',
      publishedPostCount: 14,
      receivedLikeCount: 88,
      posts: [],
    });
    userService.getFollowStatus.mockResolvedValueOnce({
      userId: 5,
      isFollowing: false,
      followersCount: 42,
      followingCount: 10,
    });
    userService.followUser.mockResolvedValueOnce({
      userId: 5,
      isFollowing: true,
      followersCount: 43,
      followingCount: 10,
    });

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/users/5']}>
          <Routes>
            <Route path="/users/:id" element={<PublicUserProfile />} />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(container.textContent).toContain('Chef Linh');
    expect(container.textContent).toContain('42');
    expect(container.textContent).toContain('10');

    // Click Follow button
    const followBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Follow')
    );
    expect(followBtn).toBeDefined();

    await act(async () => {
      followBtn.click();
    });

    expect(userService.followUser).toHaveBeenCalledWith('5');
    expect(container.textContent).toContain('Following');
    expect(container.textContent).toContain('43');

    // Click Followers stat to open FollowListModal
    userService.getFollowers.mockResolvedValueOnce({
      items: [{ id: 9, displayName: 'Fan One', username: 'fan1' }],
      totalCount: 1,
    });

    const followersStatBtn = container.querySelector('button[title="View followers"]');
    expect(followersStatBtn).toBeDefined();

    await act(async () => {
      followersStatBtn.click();
    });

    expect(container.textContent).toContain('Connections');
  });

  it('PostDetailCore opens UserProfilePreview when clicking author avatar or name', async () => {
    postService.getPostDetail.mockResolvedValueOnce({
      id: 99,
      authorId: 5,
      authorName: 'Chef Linh',
      authorAvatarUrl: '/images/linh.jpg',
      title: 'Crispy Vegan Spring Rolls',
      createdAt: '2026-10-15T00:00:00Z',
      viewCount: 120,
      likeCount: 45,
      media: [],
    });
    interactionService.getComments.mockResolvedValueOnce([]);

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/posts/99']}>
          <Routes>
            <Route path="/posts/:id" element={<PostDetailCore />} />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(container.textContent).toContain('Crispy Vegan Spring Rolls');
    const authorBtn = container.querySelector('button[aria-label="View profile of Chef Linh"]');
    expect(authorBtn).toBeDefined();

    await act(async () => {
      authorBtn.click();
    });

    // UserProfilePreview should be open
    const previewDialog = container.querySelector('div[role="dialog"]');
    expect(previewDialog).toBeDefined();
    expect(previewDialog.getAttribute('aria-label')).toContain('Chef Linh');
  });
});
