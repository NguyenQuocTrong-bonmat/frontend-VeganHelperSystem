import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PublicUserProfile from './PublicUserProfile';
import * as userService from '../../services/userService';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, username: 'currentuser' },
    isAuthenticated: true,
  }),
}));

vi.mock('../../components/layout/HeaderMember', () => ({
  default: () => <div data-testid="header-member">Header</div>,
}));

vi.mock('../../components/layout/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock('../../components/chat/AIChatbot', () => ({
  default: () => null,
}));

vi.mock('../../components/home/FollowListModal', () => ({
  default: () => null,
}));

describe('PublicUserProfile - Image & Video Rendering', () => {
  let container = null;
  let root = null;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    if (root) {
      act(() => {
        root.unmount();
      });
    }
    if (container) {
      container.remove();
    }
    vi.restoreAllMocks();
  });

  it('renders avatar, image posts, and video posts correctly', async () => {
    vi.spyOn(userService, 'getPublicProfile').mockResolvedValue({
      id: 88,
      username: 'chef_anna',
      displayName: 'Chef Anna',
      avatarUrl: 'https://images.example.com/anna.jpg',
      dietType: 'vegan',
      joinedAt: '2025-01-01T00:00:00Z',
      publishedPostCount: 2,
      receivedLikeCount: 15,
      posts: [
        {
          id: 101,
          title: 'Creamy Vegan Pasta',
          thumbnailUrl: 'https://images.example.com/pasta.jpg',
          mediaUrl: 'https://images.example.com/pasta.jpg',
          mediaType: 'image',
          categoryName: 'Main Dish',
          dietType: 'vegan',
          viewCount: 120,
          likeCount: 10,
          createdAt: '2026-05-10T12:00:00Z',
        },
        {
          id: 102,
          title: 'Quick Tofu Stir Fry Video',
          thumbnailUrl: 'https://images.example.com/stirfry-poster.jpg',
          mediaUrl: 'https://videos.example.com/stirfry.mp4',
          mediaType: 'video',
          categoryName: 'Quick Meal',
          dietType: 'vegan',
          viewCount: 450,
          likeCount: 35,
          createdAt: '2026-05-11T14:00:00Z',
        },
      ],
    });

    vi.spyOn(userService, 'getFollowStatus').mockResolvedValue({
      userId: 88,
      isFollowing: false,
      followersCount: 25,
      followingCount: 10,
      notifyOnNewPost: false,
    });

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/users/88']}>
          <Routes>
            <Route path="/users/:id" element={<PublicUserProfile />} />
          </Routes>
        </MemoryRouter>
      );
    });

    // Verify creator display name
    expect(container.textContent).toContain('Chef Anna');

    // Verify avatar rendered
    const avatarImg = container.querySelector('img[alt="Chef Anna"]');
    expect(avatarImg).not.toBeNull();
    expect(avatarImg.getAttribute('src')).toBe('https://images.example.com/anna.jpg');

    // Verify post titles rendered
    expect(container.textContent).toContain('Creamy Vegan Pasta');
    expect(container.textContent).toContain('Quick Tofu Stir Fry Video');

    // Verify video element / video badge is rendered for post 102
    const videoElement = container.querySelector('video');
    const videoSvg = container.querySelector('svg path[d="M8 5v14l11-7z"]');
    // Either a video element or video badge must be present
    expect(videoElement || videoSvg).not.toBeNull();

    // Verify image element is rendered for the static image post
    const postImages = container.querySelectorAll('img');
    const foundPasta = Array.from(postImages).some(img => img.src.includes('pasta.jpg'));
    expect(foundPasta).toBe(true);
  });
});
