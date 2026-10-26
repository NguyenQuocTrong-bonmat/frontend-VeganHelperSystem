import React from 'react';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import RecipeMediaRenderer from './RecipeMediaRenderer';

let container = null;
let root = null;

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => {
    root?.unmount();
  });
  container?.remove();
  container = null;
  root = null;
  vi.clearAllMocks();
});

describe('RecipeMediaRenderer Component', () => {
  test('renders <img> for a valid image URL', async () => {
    const post = {
      id: 1,
      title: 'Crispy Tofu Salad',
      thumbnailUrl: 'https://cdn.example.org/tofu.jpg',
    };

    await act(async () => {
      root.render(<RecipeMediaRenderer post={post} alt={post.title} />);
    });

    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('https://cdn.example.org/tofu.jpg');
    expect(img.getAttribute('alt')).toBe('Crispy Tofu Salad');
    expect(container.querySelector('video')).toBeNull();
    expect(container.textContent).not.toContain('Botanical Kitchen');
  });

  test('falls back to Botanical Kitchen illustration when image fails (onError)', async () => {
    const post = {
      id: 2,
      title: 'Broken Image Dish',
      thumbnailUrl: 'https://cdn.example.org/missing.jpg',
    };

    await act(async () => {
      root.render(<RecipeMediaRenderer post={post} alt={post.title} />);
    });

    const img = container.querySelector('img');
    expect(img).not.toBeNull();

    // Trigger image error
    await act(async () => {
      img.dispatchEvent(new Event('error'));
    });

    // Should replace img with Botanical Kitchen placeholder
    expect(container.querySelector('img')).toBeNull();
    expect(container.textContent).toContain('Botanical Kitchen');
    expect(container.querySelector('[aria-label="Recipe illustration for Broken Image Dish"]')).not.toBeNull();
  });

  test('renders <video> with muted, playsInline and video badge for video media', async () => {
    const post = {
      id: 3,
      title: 'Spring Roll Rolling Guide',
      thumbnailUrl: 'https://cdn.example.org/spring_rolls.mp4',
    };

    await act(async () => {
      root.render(<RecipeMediaRenderer post={post} alt={post.title} />);
    });

    const video = container.querySelector('video');
    expect(video).not.toBeNull();
    expect(video.getAttribute('src')).toBe('https://cdn.example.org/spring_rolls.mp4');
    expect(video.muted).toBe(true);
    expect(video.getAttribute('playsinline')).not.toBeNull();
    expect(video.getAttribute('preload')).toBe('metadata');

    // Video indicator badge
    expect(container.textContent).toContain('Video');
  });

  test('detects video when mediaType is "video" even if URL lacks extension', async () => {
    const post = {
      id: 4,
      title: 'Steaming Dumplings',
      thumbnailUrl: 'https://pub-r2.dev/posts/stream_uuid_without_ext',
      mediaType: 'video',
    };

    await act(async () => {
      root.render(<RecipeMediaRenderer post={post} alt={post.title} />);
    });

    const video = container.querySelector('video');
    expect(video).not.toBeNull();
    expect(video.getAttribute('src')).toBe('https://pub-r2.dev/posts/stream_uuid_without_ext');
    expect(container.textContent).toContain('Video');
  });

  test('renders Botanical Kitchen fallback immediately when media is absent (null thumbnailUrl)', async () => {
    const post = {
      id: 5,
      title: 'Text-Only Grandma Recipe',
      thumbnailUrl: null,
    };

    await act(async () => {
      root.render(<RecipeMediaRenderer post={post} alt={post.title} />);
    });

    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('video')).toBeNull();
    expect(container.textContent).toContain('Botanical Kitchen');
  });

  test('falls back to Botanical Kitchen when video fails to load (onError)', async () => {
    const post = {
      id: 6,
      title: 'Corrupted Video Dish',
      thumbnailUrl: 'https://cdn.example.org/corrupted.mp4',
    };

    await act(async () => {
      root.render(<RecipeMediaRenderer post={post} alt={post.title} />);
    });

    const video = container.querySelector('video');
    expect(video).not.toBeNull();

    // Trigger video error
    await act(async () => {
      video.dispatchEvent(new Event('error'));
    });

    expect(container.querySelector('video')).toBeNull();
    expect(container.textContent).toContain('Botanical Kitchen');
  });

  test('displays thumbnail image with video badge when post has both video and poster thumbnail', async () => {
    const post = {
      id: 7,
      title: 'Tofu Banh Mi Video Guide',
      thumbnailUrl: 'https://cdn.example.org/banhmi.jpg',
      videoUrl: 'https://cdn.example.org/banhmi.mp4',
    };

    await act(async () => {
      root.render(<RecipeMediaRenderer post={post} alt={post.title} />);
    });

    // Should display poster image initially
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('https://cdn.example.org/banhmi.jpg');
    // But still indicate it is a video
    expect(container.textContent).toContain('Video');

    // On hover, switches to video preview
    const wrapper = container.firstChild;
    await act(async () => {
      wrapper.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    });

    const video = container.querySelector('video');
    expect(video).not.toBeNull();
    expect(video.getAttribute('src')).toBe('https://cdn.example.org/banhmi.mp4');
    expect(container.textContent).toContain('Playing');
  });
});

