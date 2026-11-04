import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import FindVeganStores from './FindVeganStores';
import fs from 'node:fs';
import path from 'node:path';

vi.mock('@goongmaps/goong-js', () => {
  class MockMap {
    addControl() {}
    on() {}
    remove() {}
    flyTo() {}
    setCenter() {}
    getCenter() {
      return { lat: 10.7769, lng: 106.7009 };
    }
  }

  class MockMarker {
    setLngLat() {
      return this;
    }
    addTo() {
      return this;
    }
    getElement() {
      const el = document.createElement('div');
      const visual = document.createElement('span');
      visual.setAttribute('data-store-marker-visual', 'true');
      el.appendChild(visual);
      return el;
    }
    remove() {}
  }

  class MockPopup {
    setLngLat() {
      return this;
    }
    setDOMContent() {
      return this;
    }
    addTo() {
      return this;
    }
    remove() {}
  }

  class MockNavigationControl {}

  return {
    default: {
      accessToken: '',
      Map: MockMap,
      NavigationControl: MockNavigationControl,
      Marker: MockMarker,
      Popup: MockPopup,
    },
  };
});

vi.mock('../../services/shopService', () => ({
  default: {
    getNearbyShops: vi.fn().mockResolvedValue({
      items: [
        {
          shopId: 1,
          name: 'Quán Chay An Lạc',
          address: '123 Nguyễn Thị Minh Khai, Q1',
          latitude: 10.7769,
          longitude: 106.7009,
          distanceKm: 1.2,
        },
      ],
    }),
    searchShops: vi.fn().mockResolvedValue({ items: [] }),
  },
}));

vi.mock('../../components/layout/HeaderMember', () => ({
  default: () => <header data-testid="header-member">Header</header>,
}));

vi.mock('../../components/chat/AIChatbot', () => ({
  default: () => <div data-testid="ai-chatbot">Chatbot</div>,
}));

describe('Phase 5 Responsive Verification — Vegan Stores & Map', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    if (root) {
      await act(async () => {
        root.unmount();
      });
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it('renders desktop floating panel activating strictly at lg: (1024px) without md: threshold', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <FindVeganStores />
        </BrowserRouter>
      );
    });

    const panel = container.querySelector('div[class*="transition-all"][class*="rounded-t-3xl"]');
    expect(panel).not.toBeNull();

    const panelClass = panel.className;

    // Desktop floating panel threshold must be lg (1024px)
    expect(panelClass).toContain('lg:top-6');
    expect(panelClass).toContain('lg:left-6');
    expect(panelClass).toContain('lg:bottom-6');
    expect(panelClass).toContain('lg:w-[400px]');
    expect(panelClass).toContain('lg:rounded-2xl');
    expect(panelClass).toContain('lg:shadow-xl');
    expect(panelClass).toContain('lg:border');

    // DEF-07 resolution: Must NOT contain md: floating panel overrides
    expect(panelClass).not.toContain('md:top-6');
    expect(panelClass).not.toContain('md:w-[400px]');
    expect(panelClass).not.toContain('md:left-6');

    // Mobile / tablet bottom drawer base presentation (< 1024px)
    expect(panelClass).toContain('bottom-0');
    expect(panelClass).toContain('left-0');
    expect(panelClass).toContain('right-0');
    expect(panelClass).toContain('w-full');
    expect(panelClass).toContain('rounded-t-3xl');
    expect(panelClass).toContain('h-[140px]');
    expect(panelClass).toContain('lg:h-auto');
  });

  it('preserves tap-to-toggle mechanism on mobile header and updates aria-expanded', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <FindVeganStores />
        </BrowserRouter>
      );
    });

    const header = container.querySelector('div[role="region"][aria-label="Vegan Stores Panel Header"]');
    expect(header).not.toBeNull();

    const toggleButton = header.querySelector('button[aria-label="Expand store list"]');
    expect(toggleButton).not.toBeNull();
    expect(toggleButton.getAttribute('aria-expanded')).toBe('false');

    // Tap header to expand
    await act(async () => {
      header.click();
    });

    expect(toggleButton.getAttribute('aria-expanded')).toBe('true');
    expect(toggleButton.getAttribute('aria-label')).toBe('Collapse store list');

    const panel = container.querySelector('div[class*="transition-all"][class*="rounded-t-3xl"]');
    expect(panel.className).toContain('h-[85vh]');

    // Tap header again to collapse
    await act(async () => {
      header.click();
    });

    expect(toggleButton.getAttribute('aria-expanded')).toBe('false');
    expect(panel.className).toContain('h-[140px]');
  });

  it('positions My Location button safely above collapsed drawer, hides on mobile when expanded, and sits below zoom controls on desktop', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <FindVeganStores />
        </BrowserRouter>
      );
    });

    const myLocationButton = container.querySelector('button[title="My Location"]');
    expect(myLocationButton).not.toBeNull();
    expect(myLocationButton.className).toContain('w-11');
    expect(myLocationButton.className).toContain('h-11');
    expect(myLocationButton.className).toContain('min-w-[44px]');
    expect(myLocationButton.className).toContain('min-h-[44px]');
    expect(myLocationButton.className).toContain('touch-target');

    const wrapper = myLocationButton.parentElement;
    expect(wrapper).not.toBeNull();

    // Mobile/tablet bottom clearance above 140px drawer when collapsed
    expect(wrapper.className).toContain('bottom-[160px]');
    expect(wrapper.className).toContain('right-4');

    // Desktop positioning below Goong NavigationControl (16px + 90px + 16px = 122px)
    expect(wrapper.className).toContain('lg:top-[122px]');
    expect(wrapper.className).toContain('lg:bottom-auto');
    expect(wrapper.className).toContain('lg:right-4');

    // When collapsed on mobile, wrapper is visible (flex)
    expect(wrapper.className).toContain('flex');

    // When drawer is expanded on mobile, wrapper is hidden (hidden lg:flex)
    const header = container.querySelector('div[role="region"][aria-label="Vegan Stores Panel Header"]');
    await act(async () => {
      header.click();
    });

    expect(wrapper.className).toContain('hidden');
    expect(wrapper.className).toContain('lg:flex');
  });

  it('guarantees drawer toggle chevron has minimum 44x44px touch target area', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <FindVeganStores />
        </BrowserRouter>
      );
    });

    const header = container.querySelector('div[role="region"][aria-label="Vegan Stores Panel Header"]');
    const toggleButton = header.querySelector('button[aria-label="Expand store list"]');
    expect(toggleButton).not.toBeNull();
    expect(toggleButton.className).toContain('w-11');
    expect(toggleButton.className).toContain('h-11');
    expect(toggleButton.className).toContain('min-w-[44px]');
    expect(toggleButton.className).toContain('min-h-[44px]');
    expect(toggleButton.className).toContain('touch-target');
  });

  it('applies Goong zoom controls CSS overrides in index.css with 16px offsets and z-index: 10', () => {
    const cssPath = path.resolve(__dirname, '../../styles/index.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    expect(cssContent).toContain('.goongjs-ctrl-top-right');
    expect(cssContent).toContain('top: 16px !important;');
    expect(cssContent).toContain('right: 16px !important;');
    expect(cssContent).toContain('z-index: 10 !important;');
  });

  it('prevents store card action buttons from horizontal overflow and enforces 44x44px touch targets', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <FindVeganStores />
        </BrowserRouter>
      );
    });

    // Expand panel to render list
    const header = container.querySelector('div[role="region"][aria-label="Vegan Stores Panel Header"]');
    await act(async () => {
      header.click();
    });

    // Wait for store item to appear
    const storeCard = container.querySelector('div[role="button"][tabindex="0"]');
    expect(storeCard).not.toBeNull();

    // Select store to display action links
    await act(async () => {
      storeCard.click();
    });

    const directionsLink = container.querySelector('a[href*="google.com/maps/dir"]');
    expect(directionsLink).not.toBeNull();
    expect(directionsLink.className).toContain('min-h-[44px]');
    expect(directionsLink.className).toContain('min-w-[44px]');
    expect(directionsLink.className).toContain('touch-target');

    const googleMapsLink = container.querySelector('a[href*="google.com/maps/search"]');
    expect(googleMapsLink).not.toBeNull();
    expect(googleMapsLink.className).toContain('min-h-[44px]');
    expect(googleMapsLink.className).toContain('min-w-[44px]');
    expect(googleMapsLink.className).toContain('touch-target');

    const actionContainer = directionsLink.parentElement;
    expect(actionContainer.className).toContain('flex-wrap');
    expect(actionContainer.className).toContain('gap-2');
  });
});
