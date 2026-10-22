import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import LandingWeekRoute from './LandingWeekRoute';

let container, root;

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

describe('LandingWeekRoute', () => {
  it('renders all 7 days from MON to SUN along with the route line and leaf', async () => {
    await act(async () => {
      root.render(<LandingWeekRoute />);
    });

    const svg = container.querySelector('svg.lp-week-route');
    expect(svg).not.toBeNull();

    const dayTexts = [...container.querySelectorAll('text')].map(t => t.textContent);
    expect(dayTexts).toEqual(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']);

    // Check leaf indicator is rendered
    const leaf = container.querySelector('path[d="M-5 34c0-6 6-8 10-7 1 6-4 10-9 9m-2 3 8-9"]');
    expect(leaf).not.toBeNull();
  });

  it('renders complete state immediately when prefers-reduced-motion is active', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation(query => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })));

    await act(async () => {
      root.render(<LandingWeekRoute />);
    });

    // In complete state, green progress line reaches Sunday (x = 960)
    const greenLine = container.querySelector('path[stroke="#2f5233"][stroke-width="2.5"]');
    expect(greenLine).not.toBeNull();
    expect(greenLine.getAttribute('d')).toBe('M40 32H960');

    // Leaf is at Sunday (translate(960, 0))
    const leafGroup = container.querySelector('g[transform="translate(960, 0)"]');
    expect(leafGroup).not.toBeNull();

    // All 7 dots are lit with opacity 1
    const dayDots = container.querySelectorAll('.lp-day-stop circle');
    expect(dayDots).toHaveLength(7);
    dayDots.forEach(dot => {
      expect(dot.getAttribute('opacity')).toBe('1');
    });
  });

  it('resets to Monday when leaving viewport and animates when entering viewport', async () => {
    let observerCallback = null;
    class MockIntersectionObserver {
      constructor(callback) {
        observerCallback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    await act(async () => {
      root.render(<LandingWeekRoute />);
    });

    // Initially when not intersecting: progress is 0
    // Leaf is at Monday (translate(40, 0))
    const leafAtMonday = container.querySelector('g[transform="translate(40, 0)"]');
    expect(leafAtMonday).not.toBeNull();

    // Trigger intersection (element appears in viewport)
    await act(async () => {
      observerCallback([{ isIntersecting: true }]);
    });

    // Animate is triggered
    // Trigger out of view (user scrolls away)
    await act(async () => {
      observerCallback([{ isIntersecting: false }]);
    });

    // When scrolled away, leaf resets back to Monday
    const leafReset = container.querySelector('g[transform="translate(40, 0)"]');
    expect(leafReset).not.toBeNull();
  });

  it('progresses through days in stepped sequence with pauses', async () => {
    vi.useFakeTimers();
    let observerCallback = null;
    class MockIntersectionObserver {
      constructor(callback) {
        observerCallback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    await act(async () => {
      root.render(<LandingWeekRoute />);
    });

    // Enter viewport
    await act(async () => {
      observerCallback([{ isIntersecting: true }]);
    });

    // At t=0, starts at Monday (translate(40, 0))
    expect(container.querySelector('g[transform="translate(40, 0)"]')).not.toBeNull();

    // Advance past initial Monday pause (250ms) and step 1 transit (320ms)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(600);
    });

    // Leaf should have moved past Monday
    const leafAtMondayAfterTransit = container.querySelector('g[transform="translate(40, 0)"]');
    expect(leafAtMondayAfterTransit).toBeNull();

    vi.useRealTimers();
  });
});
