import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HeaderMember from './HeaderMember';
import HeaderGuest from './HeaderGuest';
import MobileBottomNav from './MobileBottomNav';
import AIChatbot from '../chat/AIChatbot';

// Mock AuthContext
const mockUser = { id: 101, displayName: 'Thao Nguyen', role: 'Member', avatarUrl: null };
const mockLogout = vi.fn();
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    logout: mockLogout,
    isAuthenticated: true,
  }),
}));

// Mock NotificationBell
vi.mock('../notifications/NotificationBell', () => ({
  default: ({ userId }) => <div data-testid={`notification-bell-${userId}`}>NotificationBell</div>,
}));

describe('VEGANHELPER — Mobile Navigation Redesign Suite', () => {
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

  describe('HeaderMember Mobile Top Header Architecture', () => {
    it('renders logo on the left and direct Search + AI Genie actions on the right', async () => {
      await act(async () => {
        root.render(
          <MemoryRouter initialEntries={['/home']}>
            <HeaderMember />
          </MemoryRouter>
        );
      });

      // Left: Logo
      const logoLink = container.querySelector('header a[href="/home"]');
      expect(logoLink).toBeTruthy();
      const logoImg = logoLink.querySelector('img[alt="Vegan Helper Logo"]');
      expect(logoImg).toBeTruthy();

      // Right: Direct Search and AI Genie in mobile header cluster
      const mobileSearch = container.querySelector('#mobile-header-search');
      expect(mobileSearch).toBeTruthy();
      expect(mobileSearch.getAttribute('href')).toBe('/search');
      expect(mobileSearch.getAttribute('aria-label')).toBe('Search recipes and community');

      const mobileAIGenie = container.querySelector('#mobile-header-ai-genie');
      expect(mobileAIGenie).toBeTruthy();
      expect(mobileAIGenie.getAttribute('aria-label')).toBe('Open AI Genie nutrition assistant');

      // NotificationBell and Profile present in mobile header
      expect(container.querySelector('[data-testid="notification-bell-101"]')).toBeTruthy();
      const profileButton = container.querySelector('button[aria-label="User Profile Menu"]');
      expect(profileButton).toBeTruthy();
    });

    it('dispatches open-ai-chat CustomEvent when mobile AI Genie button is clicked', async () => {
      const chatListener = vi.fn();
      window.addEventListener('open-ai-chat', chatListener);

      await act(async () => {
        root.render(
          <MemoryRouter initialEntries={['/home']}>
            <HeaderMember />
          </MemoryRouter>
        );
      });

      const mobileAIGenie = container.querySelector('#mobile-header-ai-genie');
      expect(mobileAIGenie).toBeTruthy();

      await act(async () => {
        mobileAIGenie.click();
      });

      expect(chatListener).toHaveBeenCalled();
      window.removeEventListener('open-ai-chat', chatListener);
    });

    it('renders desktop navbar hidden on mobile (hidden md:flex) and renders MobileBottomNav for phone screens', async () => {
      await act(async () => {
        root.render(
          <MemoryRouter initialEntries={['/home']}>
            <HeaderMember />
          </MemoryRouter>
        );
      });

      const desktopNav = container.querySelector('nav[aria-label="Primary Navigation"]');
      expect(desktopNav).toBeTruthy();
      expect(desktopNav.className).toContain('hidden');
      expect(desktopNav.className).toContain('md:flex');

      // Bottom nav is mounted
      const bottomNav = container.querySelector('#mobile-bottom-nav');
      expect(bottomNav).toBeTruthy();
      expect(bottomNav.className).toContain('md:hidden');
      expect(bottomNav.className).toContain('fixed');
      expect(bottomNav.className).toContain('bottom-0');
    });
  });

  describe('HeaderGuest Mobile Top Header Architecture', () => {
    it('renders logo on the left and direct Search + AI Genie + Log In on the right', async () => {
      await act(async () => {
        root.render(
          <MemoryRouter initialEntries={['/']}>
            <HeaderGuest />
          </MemoryRouter>
        );
      });

      // Left: Logo
      const logoLink = container.querySelector('header a[href="/"]');
      expect(logoLink).toBeTruthy();

      // Right: Direct Search and AI Genie in mobile header cluster
      const mobileSearch = container.querySelector('#mobile-header-search');
      expect(mobileSearch).toBeTruthy();
      expect(mobileSearch.getAttribute('href')).toBe('/search-guest');

      const mobileAIGenie = container.querySelector('#mobile-header-ai-genie');
      expect(mobileAIGenie).toBeTruthy();

      // Direct Log In action
      const mobileLogin = container.querySelector('header a[href="/login"]');
      expect(mobileLogin).toBeTruthy();
      expect(mobileLogin.textContent).toContain('Log In');
    });

    it('dispatches open-ai-chat CustomEvent when mobile guest AI Genie button is clicked', async () => {
      const chatListener = vi.fn();
      window.addEventListener('open-ai-chat', chatListener);

      await act(async () => {
        root.render(
          <MemoryRouter initialEntries={['/']}>
            <HeaderGuest />
          </MemoryRouter>
        );
      });

      const mobileAIGenie = container.querySelector('#mobile-header-ai-genie');
      await act(async () => {
        mobileAIGenie.click();
      });

      expect(chatListener).toHaveBeenCalled();
      window.removeEventListener('open-ai-chat', chatListener);
    });
  });

  describe('MobileBottomNav Architecture & Touch Target Compliance', () => {
    it('renders 4 primary destinations with minimum 44x44px touch target footprint for members', async () => {
      await act(async () => {
        root.render(
          <MemoryRouter initialEntries={['/home']}>
            <MobileBottomNav isGuest={false} />
          </MemoryRouter>
        );
      });

      const nav = container.querySelector('#mobile-bottom-nav');
      expect(nav).toBeTruthy();
      expect(nav.getAttribute('aria-label')).toBe('Mobile Bottom Navigation');

      const links = nav.querySelectorAll('a');
      expect(links.length).toBe(4);

      // Verify the 4 destinations
      const expectedPaths = ['/home', '/weekly-menu', '/vegan-stores', '/my-posts'];
      const expectedLabels = ['Home', 'Weekly Menu', 'Stores', 'My Posts'];

      links.forEach((link, idx) => {
        expect(link.getAttribute('href')).toBe(expectedPaths[idx]);
        expect(link.textContent).toContain(expectedLabels[idx]);

        // Touch target sizing check
        expect(link.className).toContain('min-w-[44px]');
        expect(link.className).toContain('min-h-[44px]');
      });

      // Active state on /home
      const activeLink = links[0];
      expect(activeLink.className).toContain('text-[#2F5233]');
      const activeIndicator = activeLink.querySelector('span[aria-hidden="true"]');
      expect(activeIndicator).toBeTruthy();
      expect(activeIndicator.className).toContain('bg-[#2F5233]');
    });

    it('renders guest locked routes correctly for guest users', async () => {
      await act(async () => {
        root.render(
          <MemoryRouter initialEntries={['/']}>
            <MobileBottomNav isGuest={true} />
          </MemoryRouter>
        );
      });

      const nav = container.querySelector('#mobile-bottom-nav');
      const links = nav.querySelectorAll('a');
      expect(links.length).toBe(4);

      const expectedGuestPaths = ['/', '/weekly-menu/locked', '/vegan-stores/locked', '/my-posts/locked'];
      links.forEach((link, idx) => {
        expect(link.getAttribute('href')).toBe(expectedGuestPaths[idx]);
      });
    });

    it('incorporates iOS safe area inset bottom padding in bottom nav', async () => {
      await act(async () => {
        root.render(
          <MemoryRouter initialEntries={['/home']}>
            <MobileBottomNav />
          </MemoryRouter>
        );
      });

      const nav = container.querySelector('#mobile-bottom-nav');
      expect(nav.className).toContain('pb-[env(safe-area-inset-bottom,0px)]');
    });
  });

  describe('AIChatbot Mobile Integration & De-duplication', () => {
    it('responds to open-ai-chat CustomEvent by opening the chat dialog', async () => {
      await act(async () => {
        root.render(
          <MemoryRouter>
            <AIChatbot />
          </MemoryRouter>
        );
      });

      // Chat dialog is initially closed
      expect(container.querySelector('[role="dialog"]')).toBeFalsy();

      // Dispatch event
      await act(async () => {
        window.dispatchEvent(new CustomEvent('open-ai-chat'));
      });

      // Chat dialog is now open
      const chatSection = container.querySelector('section[aria-label="AI Nutrition Assistant"]');
      expect(chatSection).toBeTruthy();
      expect(chatSection.textContent).toContain('AI Nutrition Assistant');
    });

    it('hides the floating FAB on mobile screens (hidden md:flex) to prevent collision with bottom bar', async () => {
      await act(async () => {
        root.render(
          <MemoryRouter>
            <AIChatbot />
          </MemoryRouter>
        );
      });

      const fab = container.querySelector('#chat-fab');
      expect(fab).toBeTruthy();
      expect(fab.className).toContain('hidden');
      expect(fab.className).toContain('md:flex');
    });
  });
});
