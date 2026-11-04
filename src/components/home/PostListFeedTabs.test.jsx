import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import PostList from './PostList';

describe('PostList Community Feed Tabs', () => {
  let container, root;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

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
    delete global.IntersectionObserver;
  });

  const mockPosts = [
    {
      id: 101,
      title: 'Crispy Vegan Tofu Rolls',
      content: 'Fresh spring rolls with tofu and peanut sauce.',
      createdAt: '2026-10-20T10:00:00Z',
      authorName: 'Chef Minh',
      authorAvatarUrl: null,
      likeCount: 20,
      commentCount: 5,
    },
    {
      id: 102,
      title: 'Spicy Hue Noodle Soup',
      content: 'Traditional spicy vegan noodle soup.',
      createdAt: '2026-10-18T14:30:00Z',
      authorName: 'Chef Linh',
      authorAvatarUrl: null,
      likeCount: 45,
      commentCount: 12,
    },
  ];

  it('renders tabs in the exact order: Trending | Latest | Following', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <PostList posts={mockPosts} sortBy="trending" isAuthenticated={true} />
        </BrowserRouter>
      );
    });

    const tabs = Array.from(container.querySelectorAll('[role="tab"]'));
    expect(tabs.map((t) => t.textContent.trim())).toEqual(['Trending', 'Latest', 'Following']);
    expect(tabs.find((t) => t.textContent.includes('Lasted'))).toBeUndefined();
  });

  it('selects Trending tab by default', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <PostList posts={mockPosts} isAuthenticated={true} />
        </BrowserRouter>
      );
    });

    const trendingTab = container.querySelector('#feed-tab-trending');
    const latestTab = container.querySelector('#feed-tab-latest');
    const followingTab = container.querySelector('#feed-tab-following');

    expect(trendingTab?.getAttribute('aria-selected')).toBe('true');
    expect(latestTab?.getAttribute('aria-selected')).toBe('false');
    expect(followingTab?.getAttribute('aria-selected')).toBe('false');
  });

  it('calls onSortChange when clicking Latest tab', async () => {
    const onSortChange = vi.fn();

    await act(async () => {
      root.render(
        <BrowserRouter>
          <PostList posts={mockPosts} sortBy="trending" onSortChange={onSortChange} isAuthenticated={true} />
        </BrowserRouter>
      );
    });

    const latestTab = container.querySelector('#feed-tab-latest');
    await act(async () => {
      latestTab?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onSortChange).toHaveBeenCalledWith('latest');
  });

  it('calls onSortChange when clicking Following tab as authenticated user', async () => {
    const onSortChange = vi.fn();

    await act(async () => {
      root.render(
        <BrowserRouter>
          <PostList posts={mockPosts} sortBy="trending" onSortChange={onSortChange} isAuthenticated={true} />
        </BrowserRouter>
      );
    });

    const followingTab = container.querySelector('#feed-tab-following');
    await act(async () => {
      followingTab?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onSortChange).toHaveBeenCalledWith('following');
  });

  it('triggers onAuthRequired and does NOT change tab when guest clicks Following', async () => {
    const onSortChange = vi.fn();
    const onAuthRequired = vi.fn();

    await act(async () => {
      root.render(
        <BrowserRouter>
          <PostList
            posts={mockPosts}
            sortBy="trending"
            isGuest={true}
            isAuthenticated={false}
            onSortChange={onSortChange}
            onAuthRequired={onAuthRequired}
          />
        </BrowserRouter>
      );
    });

    const followingTab = container.querySelector('#feed-tab-following');
    await act(async () => {
      followingTab?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onAuthRequired).toHaveBeenCalledWith('Log in to follow creators and see their latest posts.');
    expect(onSortChange).not.toHaveBeenCalled();
  });

  it('renders designed Following empty state when user follows nobody', async () => {
    const onSortChange = vi.fn();

    await act(async () => {
      root.render(
        <BrowserRouter>
          <PostList
            posts={[]}
            sortBy="following"
            isFollowingEmpty={true}
            isAuthenticated={true}
            onSortChange={onSortChange}
          />
        </BrowserRouter>
      );
    });

    expect(container.textContent).toContain('Your feed starts with the people you follow.');
    expect(container.textContent).toContain('Follow other cooks and creators in the community');

    const exploreBtn = container.querySelector('button[type="button"]');
    const trendingBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Explore Trending Recipes')
    );
    expect(trendingBtn).not.toBeNull();

    await act(async () => {
      trendingBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(onSortChange).toHaveBeenCalledWith('trending');
  });

  it('renders empty state when followed users have not posted yet', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <PostList
            posts={[]}
            sortBy="following"
            isFollowingEmpty={false}
            isAuthenticated={true}
          />
        </BrowserRouter>
      );
    });

    expect(container.textContent).toContain('No posts from followed creators yet');
  });

  it('renders posts from followed accounts when available', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <PostList
            posts={mockPosts}
            sortBy="following"
            isFollowingEmpty={false}
            isAuthenticated={true}
          />
        </BrowserRouter>
      );
    });

    expect(container.textContent).toContain('Crispy Vegan Tofu Rolls');
    expect(container.textContent).toContain('Spicy Hue Noodle Soup');
  });

  it('renders loading state inside feed panel while keeping tablist visible', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <PostList posts={[]} loading={true} sortBy="trending" isAuthenticated={true} />
        </BrowserRouter>
      );
    });

    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBe(3);
    expect(container.textContent).toContain('Loading posts...');
  });

  it('renders error state with retry button when feed fails to load', async () => {
    const onRetryFeed = vi.fn();

    await act(async () => {
      root.render(
        <BrowserRouter>
          <PostList
            posts={[]}
            feedError="Failed to load posts. Please try again."
            onRetryFeed={onRetryFeed}
            sortBy="trending"
            isAuthenticated={true}
          />
        </BrowserRouter>
      );
    });

    expect(container.textContent).toContain('Failed to load posts. Please try again.');
    const retryBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Try again')
    );
    expect(retryBtn).not.toBeNull();

    await act(async () => {
      retryBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(onRetryFeed).toHaveBeenCalledTimes(1);
  });

  it('supports keyboard navigation across tabs using arrow keys', async () => {
    const onSortChange = vi.fn();

    await act(async () => {
      root.render(
        <BrowserRouter>
          <PostList
            posts={mockPosts}
            sortBy="trending"
            isAuthenticated={true}
            onSortChange={onSortChange}
          />
        </BrowserRouter>
      );
    });

    const trendingTab = container.querySelector('#feed-tab-trending');
    await act(async () => {
      trendingTab?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    });

    expect(onSortChange).toHaveBeenCalledWith('latest');
  });
});
