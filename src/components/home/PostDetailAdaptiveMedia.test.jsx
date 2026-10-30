import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import PostDetailAdaptiveMedia from './PostDetailAdaptiveMedia';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('PostDetailAdaptiveMedia — Adaptive Image & Video Rendering', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  const renderComponent = (props = {}) => {
    return act(async () => {
      root.render(<PostDetailAdaptiveMedia {...props} />);
    });
  };

  it('1. Landscape image (16:9) detects intrinsic dimensions and preserves aspect ratio without cropping', async () => {
    const media = [{ mediaUrl: 'https://example.com/landscape.jpg', mediaType: 'image' }];
    await renderComponent({ media, postTitle: 'Delicious Vegan Pho' });

    const img = container.querySelector('img[data-testid="adaptive-image-element"]');
    expect(img).not.toBeNull();
    expect(img.className).toContain('object-contain');
    expect(img.className).not.toContain('object-cover');

    // Simulate image load with 1920x1080 intrinsic dimensions
    Object.defineProperty(img, 'naturalWidth', { value: 1920, configurable: true });
    Object.defineProperty(img, 'naturalHeight', { value: 1080, configurable: true });

    await act(async () => {
      img.dispatchEvent(new Event('load'));
    });

    const stage = container.querySelector('[data-testid="adaptive-media-stage"]');
    const ratio = Number(stage.getAttribute('data-media-ratio'));
    expect(ratio).toBeCloseTo(16 / 9, 3);
    expect(parseFloat(stage.style.aspectRatio)).toBeCloseTo(16 / 9, 3);
    expect(stage.style.maxHeight).toBe('min(640px, 75vh)');
  });

  it('2. Portrait image (9:16) calculates intrinsic ratio and bounds width to prevent excessive height', async () => {
    const media = [{ mediaUrl: 'https://example.com/portrait.jpg', mediaType: 'image' }];
    await renderComponent({ media, postTitle: 'Vertical Summer Rolls' });

    const img = container.querySelector('img[data-testid="adaptive-image-element"]');
    expect(img).not.toBeNull();

    // Simulate portrait image load (1080x1920)
    Object.defineProperty(img, 'naturalWidth', { value: 1080, configurable: true });
    Object.defineProperty(img, 'naturalHeight', { value: 1920, configurable: true });

    await act(async () => {
      img.dispatchEvent(new Event('load'));
    });

    const stage = container.querySelector('[data-testid="adaptive-media-stage"]');
    const ratio = Number(stage.getAttribute('data-media-ratio'));
    expect(ratio).toBeCloseTo(9 / 16, 3);
    expect(parseFloat(stage.style.aspectRatio)).toBeCloseTo(9 / 16, 3);
    expect(stage.style.width).toContain('0.5625');
    expect(img.className).toContain('object-contain');
  });

  it('3. Square image (1:1) renders a 1:1 container with object-contain', async () => {
    const media = [{ mediaUrl: 'https://example.com/square.jpg', mediaType: 'image' }];
    await renderComponent({ media, postTitle: 'Matcha Bowl' });

    const img = container.querySelector('img[data-testid="adaptive-image-element"]');
    Object.defineProperty(img, 'naturalWidth', { value: 1000, configurable: true });
    Object.defineProperty(img, 'naturalHeight', { value: 1000, configurable: true });

    await act(async () => {
      img.dispatchEvent(new Event('load'));
    });

    const stage = container.querySelector('[data-testid="adaptive-media-stage"]');
    const ratio = Number(stage.getAttribute('data-media-ratio'));
    expect(ratio).toBeCloseTo(1.0, 3);
    expect(parseFloat(stage.style.aspectRatio)).toBe(1);
    expect(img.className).toContain('object-contain');
  });

  it('4. Landscape video (16:9) detects videoWidth/videoHeight from loadedmetadata', async () => {
    const media = [{ mediaUrl: 'https://example.com/recipe.mp4', mediaType: 'video' }];
    await renderComponent({ media, postTitle: 'Cooking Tutorial' });

    const video = container.querySelector('video[data-testid="adaptive-video-element"]');
    expect(video).not.toBeNull();
    expect(video.controls).toBe(true);
    expect(video.className).toContain('object-contain');
    expect(video.className).not.toContain('object-cover');

    // Simulate loadedmetadata with 1920x1080
    Object.defineProperty(video, 'videoWidth', { value: 1920, configurable: true });
    Object.defineProperty(video, 'videoHeight', { value: 1080, configurable: true });

    await act(async () => {
      video.dispatchEvent(new Event('loadedmetadata'));
    });

    const stage = container.querySelector('[data-testid="adaptive-media-stage"]');
    const ratio = Number(stage.getAttribute('data-media-ratio'));
    expect(ratio).toBeCloseTo(16 / 9, 3);
    expect(parseFloat(stage.style.aspectRatio)).toBeCloseTo(16 / 9, 3);
  });

  it('5. Portrait video (9:16) remains vertical with accessible native controls and no cropping', async () => {
    const media = [{ mediaUrl: 'https://example.com/reel.mp4', mediaType: 'video' }];
    await renderComponent({ media, postTitle: 'Quick Reel' });

    const video = container.querySelector('video[data-testid="adaptive-video-element"]');
    Object.defineProperty(video, 'videoWidth', { value: 1080, configurable: true });
    Object.defineProperty(video, 'videoHeight', { value: 1920, configurable: true });

    await act(async () => {
      video.dispatchEvent(new Event('loadedmetadata'));
    });

    const stage = container.querySelector('[data-testid="adaptive-media-stage"]');
    const ratio = Number(stage.getAttribute('data-media-ratio'));
    expect(ratio).toBeCloseTo(9 / 16, 3);
    expect(parseFloat(stage.style.aspectRatio)).toBeCloseTo(9 / 16, 3);
    expect(stage.style.width).toContain('0.5625');
    expect(video.className).toContain('object-contain');
    expect(video.controls).toBe(true);
  });

  it('6. Multiple videos with different aspect ratios in one post adapt independently', async () => {
    const media = [
      { mediaUrl: 'https://example.com/video-landscape.mp4', mediaType: 'video' },
      { mediaUrl: 'https://example.com/video-portrait.mp4', mediaType: 'video' },
      { mediaUrl: 'https://example.com/video-square.mp4', mediaType: 'video' },
    ];
    let activeIndex = 0;
    const setActiveMediaIndex = (idx) => {
      activeIndex = idx;
    };

    await renderComponent({
      media,
      activeMediaIndex: activeIndex,
      onActiveMediaChange: setActiveMediaIndex,
    });

    // Item 0: Landscape (16:9)
    let video = container.querySelector('video[data-testid="adaptive-video-element"]');
    Object.defineProperty(video, 'videoWidth', { value: 1920, configurable: true });
    Object.defineProperty(video, 'videoHeight', { value: 1080, configurable: true });
    await act(async () => {
      video.dispatchEvent(new Event('loadedmetadata'));
    });

    let stage = container.querySelector('[data-testid="adaptive-media-stage"]');
    expect(Number(stage.getAttribute('data-media-ratio'))).toBeCloseTo(16 / 9, 3);

    // Switch to Item 1: Portrait (9:16)
    await renderComponent({
      media,
      activeMediaIndex: 1,
      onActiveMediaChange: setActiveMediaIndex,
    });

    video = container.querySelector('video[data-testid="adaptive-video-element"]');
    Object.defineProperty(video, 'videoWidth', { value: 1080, configurable: true });
    Object.defineProperty(video, 'videoHeight', { value: 1920, configurable: true });
    await act(async () => {
      video.dispatchEvent(new Event('loadedmetadata'));
    });

    stage = container.querySelector('[data-testid="adaptive-media-stage"]');
    expect(Number(stage.getAttribute('data-media-ratio'))).toBeCloseTo(9 / 16, 3);

    // Switch back to Item 0: Ensure Item 0 retained its 16:9 ratio and was not contaminated
    await renderComponent({
      media,
      activeMediaIndex: 0,
      onActiveMediaChange: setActiveMediaIndex,
    });

    stage = container.querySelector('[data-testid="adaptive-media-stage"]');
    expect(Number(stage.getAttribute('data-media-ratio'))).toBeCloseTo(16 / 9, 3);
  });

  it('7. Missing or unavailable metadata falls back safely to 16:9 without cropping', async () => {
    const media = [{ mediaUrl: 'https://example.com/unknown.mp4', mediaType: 'video' }];
    await renderComponent({ media });

    const stage = container.querySelector('[data-testid="adaptive-media-stage"]');
    // In fallback mode before metadata resolves
    const ratio = Number(stage.getAttribute('data-media-ratio'));
    expect(ratio).toBeCloseTo(16 / 9, 3);

    const video = container.querySelector('video');
    expect(video.className).toContain('object-contain');
  });

  it('8. Media error state displays accessible error message without crashing', async () => {
    const media = [{ mediaUrl: 'https://example.com/broken.jpg', mediaType: 'image' }];
    await renderComponent({ media });

    const img = container.querySelector('img[data-testid="adaptive-image-element"]');
    await act(async () => {
      img.dispatchEvent(new Event('error'));
    });

    expect(container.textContent).toContain('Unable to load photo');
  });

  it('9. Responsive width constraints ensure no horizontal overflow', async () => {
    const media = [{ mediaUrl: 'https://example.com/panorama.jpg', mediaType: 'image' }];
    await renderComponent({ media });

    const img = container.querySelector('img[data-testid="adaptive-image-element"]');
    // Panorama: 3000x1000 (ratio 3:1)
    Object.defineProperty(img, 'naturalWidth', { value: 3000, configurable: true });
    Object.defineProperty(img, 'naturalHeight', { value: 1000, configurable: true });

    await act(async () => {
      img.dispatchEvent(new Event('load'));
    });

    const stage = container.querySelector('[data-testid="adaptive-media-stage"]');
    expect(stage.style.maxWidth).toBe('100%');
    expect(stage.style.margin).toBe('0px auto');
    expect(Number(stage.getAttribute('data-media-ratio'))).toBe(3);
  });

  it('10. Clicking image triggers onEnlargeImage callback', async () => {
    const onEnlargeImage = vi.fn();
    const media = [{ mediaUrl: 'https://example.com/photo.jpg', mediaType: 'image' }];
    await renderComponent({ media, onEnlargeImage });

    const clickableDiv = container.querySelector('[role="button"][aria-label="Enlarge image"]');
    expect(clickableDiv).not.toBeNull();

    await act(async () => {
      clickableDiv.click();
    });

    expect(onEnlargeImage).toHaveBeenCalledTimes(1);
  });
});
