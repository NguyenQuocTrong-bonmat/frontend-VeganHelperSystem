import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import FeaturedPost from './FeaturedPost';

describe('FeaturedPost', () => {
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
      observe(el) {
        this.callback([{ isIntersecting: true, target: el }]);
      }
      unobserve() {}
      disconnect() {}
    };
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    delete global.IntersectionObserver;
  });

  const basePost = {
    id: 99,
    title: 'Vietnamese Vegan Pho',
    content: 'A fragrant herbal broth simmered with star anise, cinnamon, and charred ginger.',
    createdAt: '2026-10-15T10:00:00Z',
    authorName: 'Chef Linh',
    category: { name: 'Soups' },
    viewCount: 42,
    likeCount: 15,
  };

  it('renders image when valid image URL is provided', async () => {
    const postWithImage = {
      ...basePost,
      thumbnailUrl: 'https://images.unsplash.com/photo-pho.jpg',
    };

    await act(async () => {
      root.render(
        <BrowserRouter>
          <FeaturedPost post={postWithImage} isGuest={false} />
        </BrowserRouter>
      );
    });

    const img = container.querySelector('img[alt="Vietnamese Vegan Pho"]');
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('https://images.unsplash.com/photo-pho.jpg');
    expect(container.textContent).toContain('Vietnamese Vegan Pho');
    expect(container.textContent).toContain('Soups');
  });

  it('renders video element when video URL (.mp4) is provided', async () => {
    const postWithVideo = {
      ...basePost,
      thumbnailUrl: 'https://pub.dev/posts/screen_recording.mp4',
    };

    await act(async () => {
      root.render(
        <BrowserRouter>
          <FeaturedPost post={postWithVideo} isGuest={false} />
        </BrowserRouter>
      );
    });

    const video = container.querySelector('video');
    expect(video).not.toBeNull();
    expect(video.getAttribute('src')).toBe('https://pub.dev/posts/screen_recording.mp4');
    expect(container.textContent).toContain('Video');
  });

  it('renders botanical fallback card when thumbnailUrl is missing', async () => {
    const postWithoutImage = {
      ...basePost,
      thumbnailUrl: null,
    };

    await act(async () => {
      root.render(
        <BrowserRouter>
          <FeaturedPost post={postWithoutImage} isGuest={false} />
        </BrowserRouter>
      );
    });

    expect(container.querySelector('img[alt="Vietnamese Vegan Pho"]')).toBeNull();
    expect(container.textContent).toContain('Vietnamese Botanical Cuisine');
    expect(container.textContent).toContain('Vietnamese Vegan Pho');
  });

  it('renders botanical fallback card when image encounters an error', async () => {
    const postWithBrokenImage = {
      ...basePost,
      thumbnailUrl: 'https://broken-url.com/image-404.jpg',
    };

    await act(async () => {
      root.render(
        <BrowserRouter>
          <FeaturedPost post={postWithBrokenImage} isGuest={false} />
        </BrowserRouter>
      );
    });

    const img = container.querySelector('img[alt="Vietnamese Vegan Pho"]');
    expect(img).not.toBeNull();

    // Trigger onError
    await act(async () => {
      img.dispatchEvent(new Event('error'));
    });

    // Fallback botanical card is now displayed
    expect(container.querySelector('img[alt="Vietnamese Vegan Pho"]')).toBeNull();
    expect(container.textContent).toContain('Vietnamese Botanical Cuisine');
  });
});
