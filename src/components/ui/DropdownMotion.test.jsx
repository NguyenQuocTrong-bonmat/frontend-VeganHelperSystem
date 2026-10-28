import React, { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { motion, AnimatePresence } from 'framer-motion';
import {
  dropdownVariants,
  mobileDrawerVariants,
  popoverBackdropVariants,
  popoverCardVariants,
  reducedMotionVariants,
} from './dropdownMotion';
import HeaderMember from '../layout/HeaderMember';
import HeaderGuest from '../layout/HeaderGuest';
import AdminNavbar from '../admin/AdminNavbar';
import { MemoryRouter } from 'react-router-dom';

// Mock AuthContext for HeaderMember
const mockUser = { id: 1, displayName: 'Test User', role: 'Member', avatarUrl: null };
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
  default: () => <div data-testid="mock-notification-bell">NotificationBell</div>,
}));

describe('GLOBAL-MOTION-IMPLEMENT-03: Dropdown & Popover Motion', () => {
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

  describe('Motion Variants Contract', () => {
    it('defines subtle, responsive dropdown timing (140ms - 180ms) without bounce', () => {
      expect(dropdownVariants.hidden.opacity).toBe(0);
      expect(dropdownVariants.hidden.y).toBe(-6);
      expect(dropdownVariants.visible.opacity).toBe(1);
      expect(dropdownVariants.visible.y).toBe(0);
      expect(dropdownVariants.visible.transition.duration).toBeLessThanOrEqual(0.2);
      expect(dropdownVariants.exit.opacity).toBe(0);
      expect(dropdownVariants.exit.y).toBe(-6);
      expect(dropdownVariants.exit.transition.duration).toBeLessThanOrEqual(0.16);
    });

    it('defines drawer and popover variants with reduced motion fallbacks', () => {
      expect(mobileDrawerVariants.hidden.opacity).toBe(0);
      expect(mobileDrawerVariants.visible.opacity).toBe(1);
      expect(popoverBackdropVariants.hidden.opacity).toBe(0);
      expect(popoverBackdropVariants.visible.opacity).toBe(1);

      // Reduced motion bypasses translate/scale transforms
      expect(reducedMotionVariants.hidden.y).toBeUndefined();
      expect(reducedMotionVariants.hidden.scale).toBeUndefined();
      expect(reducedMotionVariants.visible.opacity).toBe(1);
    });
  });

  describe('Lifecycle & Unmount Isolation', () => {
    function TestDropdownHarness({ initialOpen = false }) {
      const [isOpen, setIsOpen] = useState(initialOpen);

      return (
        <div>
          <button
            type="button"
            id="toggle-btn"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
          >
            Toggle Menu
          </button>
          <button type="button" id="sibling-btn" onClick={() => {}}>
            Sibling Target
          </button>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                id="test-dropdown-menu"
                data-testid="test-dropdown-menu"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={dropdownVariants}
              >
                <a href="#item1">Profile Link</a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    it('renders dropdown when open, and completely unmounts when closed so it cannot intercept clicks', async () => {
      await act(async () => {
        root.render(<TestDropdownHarness initialOpen={false} />);
      });

      expect(container.querySelector('#test-dropdown-menu')).toBeNull();

      // Open dropdown
      const toggleBtn = container.querySelector('#toggle-btn');
      await act(async () => {
        toggleBtn.click();
      });

      expect(container.querySelector('#test-dropdown-menu')).not.toBeNull();
      expect(toggleBtn.getAttribute('aria-expanded')).toBe('true');

      // Close dropdown
      await act(async () => {
        toggleBtn.click();
      });

      // Crucial: Must be fully unmounted from DOM, leaving no inert invisible overlay
      expect(container.querySelector('#test-dropdown-menu')).toBeNull();
      expect(toggleBtn.getAttribute('aria-expanded')).toBe('false');

      // Sibling is fully clickable
      const sibling = container.querySelector('#sibling-btn');
      expect(sibling).not.toBeNull();
    });
  });

  describe('HeaderMember Profile Dropdown & Mobile Menu', () => {
    it('opens profile dropdown, closes on outside click, and restores focus on Escape', async () => {
      await act(async () => {
        root.render(
          <MemoryRouter>
            <HeaderMember />
          </MemoryRouter>
        );
      });

      const profileBtn = container.querySelector('button[aria-label="User Profile Menu"]');
      expect(profileBtn).not.toBeNull();
      expect(profileBtn.getAttribute('aria-expanded')).toBe('false');
      expect(container.textContent).not.toContain('My Profile');

      // Open profile dropdown
      await act(async () => {
        profileBtn.click();
      });

      expect(profileBtn.getAttribute('aria-expanded')).toBe('true');
      expect(container.textContent).toContain('My Profile');
      expect(container.textContent).toContain('Security');

      // Press Escape key
      await act(async () => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      });

      // Dropdown should be unmounted and focus restored
      expect(container.textContent).not.toContain('My Profile');
      expect(document.activeElement).toBe(profileBtn);

      // Open again and test outside click
      await act(async () => {
        profileBtn.click();
      });
      expect(container.textContent).toContain('My Profile');

      await act(async () => {
        document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      });

      expect(container.textContent).not.toContain('My Profile');
    });

    it('renders primary navigation icons directly across all screen sizes without hamburger menu', async () => {
      await act(async () => {
        root.render(
          <MemoryRouter>
            <HeaderMember />
          </MemoryRouter>
        );
      });

      // No hamburger menu button on mobile
      const hamburgerBtn = container.querySelector('button[aria-label="Open navigation menu"]');
      expect(hamburgerBtn).toBeNull();

      // Navigation bar is always visible with all primary items
      const nav = container.querySelector('nav[aria-label="Primary Navigation"]');
      expect(nav).not.toBeNull();
      expect(container.querySelector('a[aria-label="Home"]')).not.toBeNull();
      expect(container.querySelector('a[aria-label="Weekly Menu"]')).not.toBeNull();
      expect(container.querySelector('a[aria-label="Find Vegan Stores"]')).not.toBeNull();
      expect(container.querySelector('a[aria-label="My Posts"]')).not.toBeNull();
    });
  });

  describe('HeaderGuest Navigation', () => {
    it('renders primary navigation icons directly across all screen sizes without hamburger menu', async () => {
      await act(async () => {
        root.render(
          <MemoryRouter>
            <HeaderGuest />
          </MemoryRouter>
        );
      });

      // No hamburger menu button on mobile
      const hamburgerBtn = container.querySelector('button[aria-label="Open navigation menu"]');
      expect(hamburgerBtn).toBeNull();

      // Navigation bar is always visible with all primary items
      const nav = container.querySelector('nav[aria-label="Primary Navigation"]');
      expect(nav).not.toBeNull();
      expect(container.querySelector('a[aria-label="Home"]')).not.toBeNull();
      expect(container.querySelector('a[aria-label="Weekly Menu"]')).not.toBeNull();
      expect(container.querySelector('a[aria-label="Find Vegan Stores"]')).not.toBeNull();
      expect(container.querySelector('a[aria-label="My Posts"]')).not.toBeNull();
    });
  });

  describe('AdminNavbar Dropdown & Mobile Menu', () => {
    it('toggles admin profile dropdown, closes on Escape, and returns focus', async () => {
      await act(async () => {
        root.render(
          <MemoryRouter>
            <AdminNavbar />
          </MemoryRouter>
        );
      });

      const profileBtn = container.querySelector('button[aria-label="User Profile Menu"]');
      expect(profileBtn).not.toBeNull();
      expect(profileBtn.getAttribute('aria-expanded')).toBe('false');
      expect(container.textContent).not.toContain('ADMINISTRATOR');

      await act(async () => {
        profileBtn.click();
      });

      expect(profileBtn.getAttribute('aria-expanded')).toBe('true');
      expect(container.textContent).toContain('ADMINISTRATOR');
      expect(container.textContent).toContain('Home Page');

      await act(async () => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      });

      expect(profileBtn.getAttribute('aria-expanded')).toBe('false');
      expect(container.textContent).not.toContain('ADMINISTRATOR');
      expect(document.activeElement).toBe(profileBtn);
    });

    it('renders primary navigation icons directly across all screen sizes without hamburger menu', async () => {
      await act(async () => {
        root.render(
          <MemoryRouter>
            <AdminNavbar />
          </MemoryRouter>
        );
      });

      // No hamburger menu button on mobile
      const hamburgerBtn = container.querySelector('button[aria-label="Open navigation menu"]');
      expect(hamburgerBtn).toBeNull();

      // Navigation bar is always visible with all primary items
      const nav = container.querySelector('nav[aria-label="Admin Navigation"]');
      expect(nav).not.toBeNull();
      expect(container.querySelector('a[aria-label="Dashboard"]')).not.toBeNull();
      expect(container.querySelector('a[aria-label="Members"]')).not.toBeNull();
      expect(container.querySelector('a[aria-label="Categories"]')).not.toBeNull();
      expect(container.querySelector('a[aria-label="Moderation"]')).not.toBeNull();
      expect(container.querySelector('a[aria-label="Audit Logs"]')).not.toBeNull();
    });
  });
});
