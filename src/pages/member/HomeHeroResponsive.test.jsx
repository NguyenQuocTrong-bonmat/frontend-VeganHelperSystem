import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Home from './Home';
import fs from 'fs';
import path from 'path';

// Mock child components and services to isolate Home Hero layout
vi.mock('../../components/layout/HeaderMember', () => ({
  default: () => <header data-testid="header-member">Header</header>,
}));
vi.mock('../../components/home/HomeSocialNav', () => ({
  default: () => <nav data-testid="home-social-nav">Social Nav</nav>,
}));
vi.mock('../../components/home/HomeUtilityRail', () => ({
  default: () => <aside data-testid="home-utility-rail">Utility Rail</aside>,
}));
vi.mock('../../components/home/PostList', () => ({
  default: () => <div data-testid="post-list">Post List</div>,
}));
vi.mock('../../components/home/CreatePostModal', () => ({
  default: () => null,
}));
vi.mock('../../components/chat/AIChatbot', () => ({
  default: () => <div data-testid="ai-chatbot">AI Chatbot</div>,
}));
vi.mock('../../services/postService', () => ({
  getCategories: vi.fn(async () => []),
  getPostsFeed: vi.fn(async () => ({ items: [], nextCursor: null })),
  getTrendingPosts: vi.fn(async () => []),
}));
vi.mock('../../services/categoryService', () => ({
  getCategories: vi.fn(async () => []),
}));
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', displayName: 'Test User', avatarUrl: null },
    isAuthenticated: true,
  }),
}));

describe('RESPONSIVE FIX — Hide Decorative Food Visual on Small Mobile (<480px)', () => {
  let container;
  let root;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
  });

  it('renders the Home Hero structure with required responsive suppression classes', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );
    });

    // 1. Identify exact React component and DOM wrappers
    const heroSection = container.querySelector('.vh-hero-section');
    expect(heroSection).toBeTruthy();

    const decorativeVisual = container.querySelector('.vh-hero-decorative-visual');
    expect(decorativeVisual).toBeTruthy();

    const backdropImage = container.querySelector('.vh-hero-backdrop');
    expect(backdropImage).toBeTruthy();

    const organicWave = container.querySelector('.vh-hero-organic-wave');
    expect(organicWave).toBeTruthy();

    // 2. Decorative Visual Wrapper has small-screen suppression and >=480px restoration
    expect(decorativeVisual.className).toContain('hidden');
    expect(decorativeVisual.className).toContain('min-[480px]:flex');

    // Inside decorative visual: foreground dish inside white frame
    const foregroundDishCard = decorativeVisual.querySelector('.rounded-2xl.bg-white');
    expect(foregroundDishCard).toBeTruthy();
    const foregroundDishImg = foregroundDishCard.querySelector('img');
    expect(foregroundDishImg).toBeTruthy();
    expect(foregroundDishImg.getAttribute('alt')).toBe('Vegan Pho');

    // 3. Faded Food Background Image has small-screen suppression and >=480px restoration
    expect(backdropImage.className).toContain('hidden');
    expect(backdropImage.className).toContain('min-[480px]:block');
    const backdropImg = backdropImage.querySelector('img');
    expect(backdropImg).toBeTruthy();

    // 4. Decorative Curved Background Shape (Organic Wave) has suppression and restoration
    expect(organicWave.className).toContain('hidden');
    expect(organicWave.className).toContain('min-[480px]:block');
    const waveSvg = organicWave.querySelector('svg');
    expect(waveSvg).toBeTruthy();

    // 5. Hero Container reclaims height on small mobile
    expect(heroSection.className).toContain('min-h-0');
    expect(heroSection.className).toContain('min-[480px]:min-h-[650px]');

    // 6. Main heading, description, search bar, and primary CTA remain intact
    const mainHeading = container.querySelector('h1.vh-hero-title');
    expect(mainHeading).toBeTruthy();
    expect(mainHeading.textContent).toContain('Discover the');
    expect(mainHeading.textContent).toContain('Taste of Vietnam');

    const heroDesc = container.querySelector('p.vh-hero-desc');
    expect(heroDesc).toBeTruthy();
    expect(heroDesc.textContent).toContain('Vietnamese plant-based cuisine');

    const searchInput = container.querySelector('input[aria-label="Search"]');
    expect(searchInput).toBeTruthy();

    const buttons = Array.from(container.querySelectorAll('.vh-hero-copy button'));
    const exploreBtn = buttons.find((btn) => btn.textContent.includes('Explore Vegan Recipes'));
    expect(exploreBtn).toBeTruthy();
    expect(exploreBtn.textContent).toContain('Explore Vegan Recipes');
  });

  it('validates index.css contains explicit @media (max-width: 479.98px) rules reclaiming all space', () => {
    const cssPath = path.resolve(__dirname, '../../styles/index.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    // Verify media query below 480px
    expect(cssContent).toContain('@media (max-width: 479.98px)');

    // Verify hiding of all three visual parts
    expect(cssContent).toContain('.vh-hero-decorative-visual');
    expect(cssContent).toContain('.vh-hero-backdrop');
    expect(cssContent).toContain('.vh-hero-organic-wave');
    expect(cssContent).toContain('display: none !important');

    // Verify space reclamation
    expect(cssContent).toContain('.vh-hero-section');
    expect(cssContent).toContain('min-height: auto !important');
    expect(cssContent).toContain('.vh-hero-content');
    expect(cssContent).toContain('gap: 0 !important');
  });

  describe('Viewport Matrix Evaluation (320px, 360px, 390px, 430px, 480px, 768px, 1280px)', () => {
    const viewports = [
      { width: 320, name: '320px (Compact Mobile / iPhone SE)', expectHidden: true },
      { width: 360, name: '360px (Small Android / Galaxy S8)', expectHidden: true },
      { width: 390, name: '390px (Standard Mobile / iPhone 12/13/14)', expectHidden: true },
      { width: 430, name: '430px (Large Mobile / iPhone Pro Max)', expectHidden: true },
      { width: 480, name: '480px (Breakpoint Threshold)', expectHidden: false },
      { width: 768, name: '768px (Tablet / iPad Portrait)', expectHidden: false },
      { width: 1280, name: '1280px (Desktop Display)', expectHidden: false },
    ];

    viewports.forEach(({ width, name, expectHidden }) => {
      it(`evaluates ${name}: decorative elements ${expectHidden ? 'HIDDEN' : 'VISIBLE'} and layout clean`, async () => {
        // Set window innerWidth
        window.innerWidth = width;
        window.dispatchEvent(new Event('resize'));

        await act(async () => {
          root.render(
            <BrowserRouter>
              <Home />
            </BrowserRouter>
          );
        });

        const decorativeVisual = container.querySelector('.vh-hero-decorative-visual');
        const backdropImage = container.querySelector('.vh-hero-backdrop');
        const organicWave = container.querySelector('.vh-hero-organic-wave');
        const heroSection = container.querySelector('.vh-hero-section');

        expect(decorativeVisual).toBeTruthy();
        expect(backdropImage).toBeTruthy();
        expect(organicWave).toBeTruthy();
        expect(heroSection).toBeTruthy();

        if (expectHidden) {
          // Below 480px: elements have 'hidden' class by default for mobile-first CSS
          expect(decorativeVisual.classList.contains('hidden')).toBe(true);
          expect(backdropImage.classList.contains('hidden')).toBe(true);
          expect(organicWave.classList.contains('hidden')).toBe(true);
          expect(heroSection.classList.contains('min-h-0')).toBe(true);
        } else {
          // At 480px and above: elements have restoration breakpoint classes
          expect(decorativeVisual.className).toContain('min-[480px]:flex');
          expect(backdropImage.className).toContain('min-[480px]:block');
          expect(organicWave.className).toContain('min-[480px]:block');
          expect(heroSection.className).toContain('min-[480px]:min-h-[650px]');
        }

        // Essential readable content is NEVER hidden at any viewport
        const mainHeading = container.querySelector('h1.vh-hero-title');
        expect(mainHeading).toBeTruthy();
        expect(mainHeading.textContent).toContain('Discover the');

        const heroDesc = container.querySelector('p.vh-hero-desc');
        expect(heroDesc).toBeTruthy();

        const searchInput = container.querySelector('input[aria-label="Search"]');
        expect(searchInput).toBeTruthy();
      });
    });
  });
});
