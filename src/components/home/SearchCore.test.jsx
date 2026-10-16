import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import SearchCore from './SearchCore';
import * as postService from '../../services/postService';
import * as userService from '../../services/userService';

vi.mock('../../services/postService', () => ({
  searchPosts: vi.fn(),
}));

vi.mock('../../services/userService', () => ({
  searchUsers: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('SearchCore - Facebook-style Search Experience', () => {
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
  });

  const mockPostData = {
    items: [
      {
        id: 1,
        title: 'Vietnamese Vegan Pho',
        postType: 'recipe',
        thumbnailUrl: '/media/pho.jpg',
        authorName: 'Chef Linh',
        avatarUrl: '/avatars/linh.jpg',
        viewCount: 120,
        createdAt: '2026-10-15T08:00:00Z',
      },
      {
        id: 2,
        title: 'Health Benefits of Tofu',
        postType: 'article',
        thumbnailUrl: null,
        authorName: 'Dr. Minh',
        avatarUrl: null,
        viewCount: 45,
        createdAt: '2026-10-14T08:00:00Z',
      },
    ],
    totalCount: 2,
    totalPages: 1,
    pageIndex: 1,
    pageSize: 10,
  };

  const mockUserData = {
    items: [
      {
        id: 10,
        username: 'tofu_lover',
        displayName: 'Tofu Lover',
        avatarUrl: '/avatars/tofu.jpg',
      },
      {
        id: 11,
        username: 'green_vietnam',
        displayName: 'Green Vietnam',
        avatarUrl: null,
      },
    ],
    totalCount: 2,
    totalPages: 1,
    pageIndex: 1,
    pageSize: 10,
  };

  it('renders initial empty search prompt when no query is present', async () => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/search']}>
          <SearchCore isGuest={false} />
        </MemoryRouter>
      );
    });

    expect(container.textContent).toContain('Search VeganHelper');
    expect(container.textContent).toContain('Search results');
    expect(container.querySelector('#search-input')).toBeTruthy();
  });

  it('renders All view with both People and Posts preview sections', async () => {
    postService.searchPosts.mockResolvedValueOnce(mockPostData);
    userService.searchUsers.mockResolvedValueOnce(mockUserData);

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/search?q=tofu&tab=all']}>
          <SearchCore isGuest={false} />
        </MemoryRouter>
      );
    });

    // Both sections rendered
    expect(container.textContent).toContain('People');
    expect(container.textContent).toContain('Posts');
    expect(container.textContent).toContain('Vietnamese Vegan Pho');
    expect(container.textContent).toContain('Tofu Lover');
    expect(container.textContent).toContain('View all people');
    expect(container.textContent).toContain('View all posts');
  });

  it('renders Posts tab displaying only post results and pagination', async () => {
    postService.searchPosts.mockResolvedValueOnce({
      ...mockPostData,
      totalCount: 15,
      totalPages: 2,
    });

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/search?q=tofu&tab=posts&page=1']}>
          <SearchCore isGuest={false} />
        </MemoryRouter>
      );
    });

    expect(container.textContent).toContain('Posts (15)');
    expect(container.textContent).not.toContain('Tofu Lover');
    expect(container.textContent).toContain('Vietnamese Vegan Pho');
    expect(container.textContent).toContain('Page 1 of 2');
    expect(container.textContent).toContain('Next');
  });

  it('renders People tab displaying only people results and profiles', async () => {
    userService.searchUsers.mockResolvedValueOnce(mockUserData);

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/search?q=tofu&tab=people']}>
          <SearchCore isGuest={false} />
        </MemoryRouter>
      );
    });

    expect(container.textContent).toContain('People (2)');
    expect(container.textContent).toContain('Tofu Lover');
    expect(container.textContent).toContain('@tofu_lover');
    expect(container.textContent).toContain('Green Vietnam');
    expect(container.textContent).not.toContain('Vietnamese Vegan Pho');
  });

  it('normalizes legacy tab=recipes to posts tab', async () => {
    postService.searchPosts.mockResolvedValueOnce(mockPostData);

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/search?q=tofu&tab=recipes']}>
          <SearchCore isGuest={false} />
        </MemoryRouter>
      );
    });

    expect(postService.searchPosts).toHaveBeenCalled();
    expect(container.textContent).toContain('Vietnamese Vegan Pho');
  });

  it('handles partial failure in All view honestly without fabricating aggregate counts', async () => {
    postService.searchPosts.mockRejectedValueOnce(new Error('Network error loading posts'));
    userService.searchUsers.mockResolvedValueOnce(mockUserData);

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/search?q=tofu&tab=all']}>
          <SearchCore isGuest={false} />
        </MemoryRouter>
      );
    });

    // People section succeeds
    expect(container.textContent).toContain('Tofu Lover');
    // Posts section shows independent failure notice with Retry
    expect(container.textContent).toContain('Network error loading posts');
    expect(container.textContent).toContain('Retry');
    // Does not show a combined false total
    expect(container.textContent).toContain('Showing people results (posts unavailable)');
  });

  it('renders friendly empty state when search returns zero results', async () => {
    postService.searchPosts.mockResolvedValueOnce({ items: [], totalCount: 0, totalPages: 0 });

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/search?q=nonexistent&tab=posts']}>
          <SearchCore isGuest={false} />
        </MemoryRouter>
      );
    });

    expect(container.textContent).toContain('No posts found');
    expect(container.textContent).toContain("We couldn't find any posts matching \"nonexistent\"");
  });

  it('protects against out-of-order race responses overwriting newer search results', async () => {
    let slowResolve;
    postService.searchPosts
      .mockImplementationOnce(() => new Promise((resolve) => { slowResolve = resolve; }))
      .mockResolvedValueOnce({
        items: [{ id: 99, title: 'Fresh Mushroom Soup', postType: 'recipe', authorName: 'Chef Minh', viewCount: 10 }],
        totalCount: 1,
        totalPages: 1,
      });

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/search?q=first&tab=posts']}>
          <SearchCore isGuest={false} />
        </MemoryRouter>
      );
    });

    // Submit second query via search input on the same mounted component
    const input = container.querySelector('#search-input');
    const form = container.querySelector('form');
    
    await act(async () => {
      // Simulate typing new query
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeInputValueSetter.call(input, 'second');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    // Late resolve of the first request
    await act(async () => {
      slowResolve({
        items: [{ id: 1, title: 'Old Stale Result', postType: 'recipe' }],
        totalCount: 1,
        totalPages: 1,
      });
    });

    // Stale result should NOT overwrite second result
    expect(container.textContent).toContain('Fresh Mushroom Soup');
    expect(container.textContent).not.toContain('Old Stale Result');
  });

  it('displays guest login notice when guest navigates to People tab', async () => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/search-guest?q=tofu&tab=people']}>
          <SearchCore isGuest={true} />
        </MemoryRouter>
      );
    });

    expect(container.textContent).toContain('Community search is for members');
    expect(container.textContent).toContain('Log In Now');
    expect(userService.searchUsers).not.toHaveBeenCalled();
  });

  it('clears query when clicking the clear search button', async () => {
    postService.searchPosts.mockResolvedValueOnce(mockPostData);

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/search?q=tofu&tab=posts']}>
          <SearchCore isGuest={false} />
        </MemoryRouter>
      );
    });

    expect(container.querySelector('#search-input').value).toBe('tofu');
    const clearBtn = container.querySelector('button[title="Clear search query"]');
    expect(clearBtn).toBeTruthy();

    await act(async () => {
      clearBtn.click();
    });

    expect(container.querySelector('#search-input').value).toBe('');
    expect(container.textContent).toContain('Search VeganHelper');
  });

  it('switches filter tab while preserving active search query', async () => {
    postService.searchPosts.mockResolvedValueOnce(mockPostData);
    userService.searchUsers.mockResolvedValueOnce(mockUserData);

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/search?q=tofu&tab=all']}>
          <SearchCore isGuest={false} />
        </MemoryRouter>
      );
    });

    // Find "People" tab in the filter sidebar
    const peopleTab = container.querySelector('#filter-tab-people');
    expect(peopleTab).toBeTruthy();

    await act(async () => {
      peopleTab.click();
    });

    expect(container.querySelector('#search-input').value).toBe('tofu');
    expect(userService.searchUsers).toHaveBeenCalledWith({
      keyword: 'tofu',
      pageIndex: 1,
      pageSize: 12,
    });
  });

  it('renders guest link on post card when isGuest is true', async () => {
    postService.searchPosts.mockResolvedValueOnce(mockPostData);

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/search-guest?q=tofu&tab=posts']}>
          <SearchCore isGuest={true} />
        </MemoryRouter>
      );
    });

    const titleLink = container.querySelector('#post-title-1 a');
    expect(titleLink).toBeTruthy();
    expect(titleLink.getAttribute('href')).toBe('/posts/1/guest');
    expect(titleLink.textContent).toContain('Vietnamese Vegan Pho');
  });

  it('renders member link on post card when isGuest is false', async () => {
    postService.searchPosts.mockResolvedValueOnce(mockPostData);

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/search?q=tofu&tab=posts']}>
          <SearchCore isGuest={false} />
        </MemoryRouter>
      );
    });

    const titleLink = container.querySelector('#post-title-1 a');
    expect(titleLink).toBeTruthy();
    expect(titleLink.getAttribute('href')).toBe('/posts/1');
    expect(titleLink.textContent).toContain('Vietnamese Vegan Pho');
  });

  it('provides a working Try Again button when posts search fails', async () => {
    postService.searchPosts
      .mockRejectedValueOnce(new Error('Connection timed out'))
      .mockResolvedValueOnce(mockPostData);

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/search?q=tofu&tab=posts']}>
          <SearchCore isGuest={false} />
        </MemoryRouter>
      );
    });

    expect(container.textContent).toContain('Unable to load posts');
    const retryBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent.trim() === 'Try Again'
    );
    expect(retryBtn).toBeTruthy();

    await act(async () => {
      retryBtn.click();
    });

    expect(postService.searchPosts).toHaveBeenCalledTimes(2);
    expect(container.textContent).toContain('Vietnamese Vegan Pho');
  });
});
