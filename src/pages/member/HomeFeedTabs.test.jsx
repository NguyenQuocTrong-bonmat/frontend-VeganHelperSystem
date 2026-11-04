import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Home from './Home';
import * as postService from '../../services/postService';
import * as userService from '../../services/userService';
import * as authContext from '../../context/AuthContext';

vi.mock('../../services/postService');
vi.mock('../../services/userService');
vi.mock('../../context/AuthContext');

// Mock subcomponents that are not relevant to feed tabs to keep tests focused and fast
vi.mock('../../components/layout/HeaderMember', () => ({
  default: () => <header data-testid="header-member">Header</header>,
}));
vi.mock('../../components/layout/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}));
vi.mock('../../components/chat/AIChatbot', () => ({
  default: () => null,
}));
vi.mock('../../components/home/CreatePostModal', () => ({
  default: () => null,
}));
vi.mock('../../components/home/UserProfilePreview', () => ({
  default: () => null,
}));
vi.mock('../../components/home/HomeSocialNav', () => ({
  default: () => <nav data-testid="home-social-nav">Nav</nav>,
}));
vi.mock('../../components/home/HomeUtilityRail', () => ({
  default: () => <aside data-testid="home-utility-rail">Rail</aside>,
}));
vi.mock('../../components/home/CategoryFilterRow', () => ({
  default: () => <div data-testid="category-filter-row">Categories</div>,
}));

describe('Home Community Feed Tabs Lifecycle', () => {
  let container, root;

  const mockUser = {
    id: 42,
    username: 'testvegan',
    displayName: 'Test Vegan',
    avatarUrl: null,
  };

  const sampleTrendingPosts = [
    {
      id: 201,
      title: 'Trending Pho Bo Chay',
      content: 'Rich cinnamon-star anise broth.',
      createdAt: '2026-10-25T12:00:00Z',
      likeCount: 99,
      commentCount: 20,
    },
    {
      id: 202,
      title: 'Trending Bun Hue',
      content: 'Spicy lemongrass broth.',
      createdAt: '2026-10-24T10:00:00Z',
      likeCount: 88,
      commentCount: 15,
    },
  ];

  const sampleLatestPosts = [
    {
      id: 301,
      title: 'Newest Recipe Just In',
      content: 'Published 5 minutes ago.',
      createdAt: '2026-10-29T10:00:00Z',
      likeCount: 2,
      commentCount: 0,
    },
    {
      id: 302,
      title: 'Earlier Recipe',
      content: 'Published yesterday.',
      createdAt: '2026-10-28T10:00:00Z',
      likeCount: 5,
      commentCount: 1,
    },
  ];

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    vi.spyOn(authContext, 'useAuth').mockReturnValue({ user: mockUser });
    vi.spyOn(postService, 'getCategories').mockResolvedValue([]);
    vi.spyOn(postService, 'getPostsFeed').mockImplementation(async (params) => {
      if (params.sortBy === 'latest') {
        return { items: sampleLatestPosts, totalItems: sampleLatestPosts.length };
      }
      return { items: sampleTrendingPosts, totalItems: sampleTrendingPosts.length };
    });

    global.IntersectionObserver = class {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.restoreAllMocks();
    delete global.IntersectionObserver;
  });

  it('loads Trending feed by default on initial render', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
    });

    expect(postService.getPostsFeed).toHaveBeenCalledWith(
      expect.objectContaining({
        sortBy: 'trending',
        pageIndex: 1,
        pageSize: 6,
      })
    );

    const trendingTab = container.querySelector('#feed-tab-trending');
    expect(trendingTab?.getAttribute('aria-selected')).toBe('true');
    expect(container.textContent).toContain('Trending Pho Bo Chay');
  });

  it('switches to Latest feed and displays posts in chronological order', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
    });

    const latestTab = container.querySelector('#feed-tab-latest');
    await act(async () => {
      latestTab?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(postService.getPostsFeed).toHaveBeenCalledWith(
      expect.objectContaining({
        sortBy: 'latest',
        pageIndex: 1,
        pageSize: 6,
      })
    );

    expect(container.textContent).toContain('Newest Recipe Just In');
  });

  it('switches to Following feed and displays empty state when user follows nobody', async () => {
    vi.spyOn(userService, 'getFollowing').mockResolvedValue({
      items: [],
      totalItems: 0,
    });

    await act(async () => {
      root.render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
    });

    const followingTab = container.querySelector('#feed-tab-following');
    await act(async () => {
      followingTab?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(userService.getFollowing).toHaveBeenCalledWith(mockUser.id, 1, 50);
    expect(container.textContent).toContain('Your feed starts with the people you follow.');
  });

  it('switches to Following feed and loads posts from followed accounts in descending chronological order', async () => {
    const followedAccounts = [
      { id: 88, username: 'chefan', displayName: 'Chef An' },
      { id: 99, username: 'chefbich', displayName: 'Chef Bich' },
    ];

    vi.spyOn(userService, 'getFollowing').mockResolvedValue({
      items: followedAccounts,
      totalItems: 2,
    });

    vi.spyOn(userService, 'getPublicProfile').mockImplementation(async (userId) => {
      if (userId === 88) {
        return {
          id: 88,
          posts: [
            {
              id: 801,
              title: 'An Older Post by Chef An',
              createdAt: '2026-10-10T12:00:00Z',
              likeCount: 10,
              commentCount: 2,
            },
            {
              id: 802,
              title: 'A Newer Post by Chef An',
              createdAt: '2026-10-26T12:00:00Z',
              likeCount: 25,
              commentCount: 4,
            },
          ],
        };
      }
      if (userId === 99) {
        return {
          id: 99,
          posts: [
            {
              id: 901,
              title: 'Brand New Post by Chef Bich',
              createdAt: '2026-10-28T15:00:00Z',
              likeCount: 30,
              commentCount: 6,
            },
          ],
        };
      }
      return null;
    });

    await act(async () => {
      root.render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
    });

    const followingTab = container.querySelector('#feed-tab-following');
    await act(async () => {
      followingTab?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(userService.getFollowing).toHaveBeenCalledWith(mockUser.id, 1, 50);
    expect(userService.getPublicProfile).toHaveBeenCalledWith(88);
    expect(userService.getPublicProfile).toHaveBeenCalledWith(99);

    // The newest post across followed creators should be featured
    expect(container.textContent).toContain('Brand New Post by Chef Bich');
    expect(container.textContent).toContain('A Newer Post by Chef An');
  });

  it('prevents protected follow calls and opens auth dialog when unauthenticated guest clicks Following', async () => {
    vi.spyOn(authContext, 'useAuth').mockReturnValue({ user: null });
    const getFollowingSpy = vi.spyOn(userService, 'getFollowing');

    await act(async () => {
      root.render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
    });

    const followingTab = container.querySelector('#feed-tab-following');
    await act(async () => {
      followingTab?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    // Following endpoint should NOT have been called
    expect(getFollowingSpy).not.toHaveBeenCalled();

    // LandingAuthDialog should be displayed
    const authDialog = container.querySelector('.lp-auth-dialog');
    expect(authDialog).not.toBeNull();
  });
});
