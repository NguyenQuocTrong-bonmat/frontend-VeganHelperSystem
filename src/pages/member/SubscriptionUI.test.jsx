import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Profile from './Profile';
import MyPosts from './MyPosts';
import { authService } from '../../services/authService';
import { getMealPlanAccess } from '../../services/mealPlanPaymentService';
import { getMyPosts, getCategories } from '../../services/postService';
import { getFollowers, getFollowing } from '../../services/userService';

// Common Mocks
vi.mock('../../components/layout/HeaderMember', () => ({ default: () => <div data-testid="header-member" /> }));
vi.mock('../../components/layout/Footer', () => ({ default: () => <div data-testid="footer" /> }));
vi.mock('../../components/chat/AIChatbot', () => ({ default: () => null }));
vi.mock('@react-oauth/google', () => ({ GoogleLogin: () => null }));
vi.mock('./SavedPosts', () => ({ default: () => <div data-testid="saved-posts" /> }));
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 7, username: 'testuser', displayName: 'Test User', email: 'test@example.com', followersCount: 12, followingCount: 8 },
    logout: vi.fn(),
    restoreSession: vi.fn(),
  }),
}));

vi.mock('../../services/authService', () => ({
  authService: {
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
    linkGoogle: vi.fn(),
    setPassword: vi.fn(),
    requestUnlinkGoogle: vi.fn(),
    confirmUnlinkGoogle: vi.fn(),
  },
}));

vi.mock('../../services/mealPlanPaymentService', () => ({
  getMealPlanAccess: vi.fn(),
}));

vi.mock('../../services/postService', () => ({
  getMyPosts: vi.fn(),
  deletePost: vi.fn(),
  getCategories: vi.fn(),
}));

vi.mock('../../services/userService', () => ({
  getFollowers: vi.fn(),
  getFollowing: vi.fn(),
}));

describe('Phase 5: Subscription UI in Profile & My Posts', () => {
  let container, root;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vi.resetAllMocks();

    authService.getProfile.mockResolvedValue({
      id: 7,
      username: 'testuser',
      displayName: 'Test User',
      email: 'test@example.com',
      phoneNumber: '0912345678',
      biologicalSex: 'female',
      birthDate: '1995-05-15',
      provider: 'local',
      isGoogleLinked: false,
      createdAt: '2025-01-01T00:00:00Z',
    });

    getMyPosts.mockResolvedValue({
      items: [
        { id: 101, title: 'Vegan Pho', status: 'published', createdAt: '2026-10-01T00:00:00Z', author: { id: 7, displayName: 'Test User' } },
      ],
      totalCount: 1,
    });

    getCategories.mockResolvedValue([{ id: 1, name: 'Soups' }]);
    getFollowers.mockResolvedValue({ totalCount: 12, items: [] });
    getFollowing.mockResolvedValue({ totalCount: 8, items: [] });
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  it('1. Profile displays active subscription status, expiration date, and Extend CTA', async () => {
    getMealPlanAccess.mockResolvedValue({
      status: 'active',
      canGenerate: true,
      canViewExistingPlans: true,
      expiresAt: '2027-06-15T00:00:00Z',
      graceEndsAt: '2027-06-22T00:00:00Z',
      trialGenerationsRemaining: 3,
      canViewTrialPlans: true,
    });

    await act(async () => {
      root.render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      );
    });

    expect(container.textContent).toContain('Meal Plan Membership');
    expect(container.textContent).toContain('Active');
    expect(container.textContent).toContain('Active subscription for weekly menus');
    expect(container.textContent).not.toContain('Unlimited access');
    expect(container.textContent).toContain('15/06/2027');

    const cta = container.querySelector('a[href="/meal-plans/payment"]');
    expect(cta).not.toBeNull();
    expect(cta.textContent).toContain('Extend Subscription');
  });

  it('1b. Profile active subscription with canGenerate = false displays Quota Exhausted and no unlimited message', async () => {
    getMealPlanAccess.mockResolvedValue({
      status: 'active',
      canGenerate: false,
      canViewExistingPlans: true,
      expiresAt: '2027-06-15T00:00:00Z',
      trialGenerationsRemaining: 0,
      canViewTrialPlans: true,
    });

    await act(async () => {
      root.render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      );
    });

    expect(container.textContent).toContain('Active');
    expect(container.textContent).not.toContain('Unlimited access');
    expect(container.textContent).toContain('Quota Exhausted');
    expect(container.textContent).toContain('Active subscription for weekly menus');
  });

  it('2. Profile displays free trial (unsubscribed) status correctly', async () => {
    getMealPlanAccess.mockResolvedValue({
      status: 'none',
      canGenerate: true,
      canViewExistingPlans: false,
      expiresAt: null,
      graceEndsAt: null,
      trialGenerationsRemaining: 2,
      canViewTrialPlans: true,
    });

    await act(async () => {
      root.render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      );
    });

    expect(container.textContent).toContain('Meal Plan Membership');
    expect(container.textContent).toContain('Free Trial');
    expect(container.textContent).toContain('2 / 3');

    const cta = container.querySelector('a[href="/meal-plans/payment"]');
    expect(cta).not.toBeNull();
    expect(cta.textContent).toContain('Upgrade Access');
  });

  it('3. Profile displays grace period status correctly', async () => {
    getMealPlanAccess.mockResolvedValue({
      status: 'grace_period',
      canGenerate: false,
      canViewExistingPlans: true,
      expiresAt: '2026-10-10T00:00:00Z',
      graceEndsAt: '2026-10-17T00:00:00Z',
      trialGenerationsRemaining: 0,
      canViewTrialPlans: true,
    });

    await act(async () => {
      root.render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      );
    });

    expect(container.textContent).toContain('Grace Period');
    expect(container.textContent).toContain('17/10/2026');
    expect(container.querySelector('a[href="/meal-plans/payment"]').textContent).toContain('Renew Subscription');
  });

  it('4. Profile displays expired status correctly', async () => {
    getMealPlanAccess.mockResolvedValue({
      status: 'expired',
      canGenerate: false,
      canViewExistingPlans: false,
      expiresAt: '2026-09-01T00:00:00Z',
      graceEndsAt: '2026-09-08T00:00:00Z',
      trialGenerationsRemaining: 0,
      canViewTrialPlans: true,
    });

    await act(async () => {
      root.render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      );
    });

    expect(container.textContent).toContain('Expired');
    expect(container.textContent).toContain('Your subscription has ended');
    expect(container.querySelector('a[href="/meal-plans/payment"]').textContent).toContain('Renew Subscription');
  });

  it('4b. Profile displays scheduled status distinctly from Free Trial', async () => {
    getMealPlanAccess.mockResolvedValue({
      status: 'scheduled',
      canGenerate: false,
      canViewExistingPlans: false,
      trialGenerationsRemaining: 0,
      canViewTrialPlans: false,
    });

    await act(async () => {
      root.render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      );
    });

    expect(container.textContent).toContain('Scheduled');
    expect(container.textContent).not.toContain('Free Trial');
    expect(container.textContent).not.toContain('Free Menus Remaining');
    expect(container.textContent).toContain('Activation:');
    expect(container.textContent).toContain('Pending');
    expect(container.textContent).toContain('Your subscription is scheduled.');
    expect(container.querySelector('a[href="/meal-plans/payment"]').textContent).toContain('Manage Subscription');
  });

  it('5. Profile handles access loading state and error state with retry without breaking profile', async () => {
    getMealPlanAccess.mockRejectedValue(new Error('Connection failure'));

    await act(async () => {
      root.render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      );
    });

    // User profile is still rendered
    expect(container.textContent).toContain('Test User');
    expect(container.textContent).toContain('test@example.com');
    expect(container.textContent).toContain('Connection failure');

    const retryBtn = [...container.querySelectorAll('button')].find(b => b.textContent.includes('Try Again'));
    expect(retryBtn).not.toBeNull();

    // Now mock success on retry
    getMealPlanAccess.mockResolvedValueOnce({
      status: 'active',
      canGenerate: true,
      canViewExistingPlans: true,
      expiresAt: '2027-01-01T00:00:00Z',
      trialGenerationsRemaining: 3,
    });

    await act(async () => {
      retryBtn.click();
    });

    expect(container.textContent).toContain('Active');
  });

  it('6. My Posts displays active Meal Plan Access badge and CTA', async () => {
    getMealPlanAccess.mockResolvedValue({
      status: 'active',
      canGenerate: true,
      canViewExistingPlans: true,
      expiresAt: '2027-01-01T00:00:00Z',
    });

    await act(async () => {
      root.render(
        <MemoryRouter>
          <MyPosts />
        </MemoryRouter>
      );
    });

    const badge = container.querySelector('[data-testid="meal-plan-access-badge"]');
    expect(badge).not.toBeNull();
    expect(badge.textContent).toContain('Meal Plan:');
    expect(badge.textContent).toContain('Active');

    const cta = badge.querySelector('a[href="/meal-plans/payment"]');
    expect(cta).not.toBeNull();
    expect(cta.textContent).toContain('Manage →');
  });

  it('7. My Posts displays trial Meal Plan Access badge and Upgrade CTA', async () => {
    getMealPlanAccess.mockResolvedValue({
      status: 'none',
      canGenerate: true,
      trialGenerationsRemaining: 2,
    });

    await act(async () => {
      root.render(
        <MemoryRouter>
          <MyPosts />
        </MemoryRouter>
      );
    });

    const badge = container.querySelector('[data-testid="meal-plan-access-badge"]');
    expect(badge).not.toBeNull();
    expect(badge.textContent).toContain('2 Free Left');

    const cta = badge.querySelector('a[href="/meal-plans/payment"]');
    expect(cta).not.toBeNull();
    expect(cta.textContent).toContain('Upgrade →');
  });

  it('7b. My Posts displays scheduled status distinctly without falling to Free Trial', async () => {
    getMealPlanAccess.mockResolvedValue({
      status: 'scheduled',
      canGenerate: false,
      trialGenerationsRemaining: 0,
    });

    await act(async () => {
      root.render(
        <MemoryRouter>
          <MyPosts />
        </MemoryRouter>
      );
    });

    const badge = container.querySelector('[data-testid="meal-plan-access-badge"]');
    expect(badge).not.toBeNull();
    expect(badge.textContent).toContain('Scheduled');
    expect(badge.textContent).not.toContain('Free Left');
    expect(badge.textContent).not.toContain('Free Trial');

    const cta = badge.querySelector('a[href="/meal-plans/payment"]');
    expect(cta).not.toBeNull();
    expect(cta.textContent).toContain('Manage →');
  });

  it('8. My Posts handles access API error gracefully without crashing posts or creator actions and displays Status Unavailable', async () => {
    getMealPlanAccess.mockRejectedValue(new Error('Network offline'));

    await act(async () => {
      root.render(
        <MemoryRouter>
          <MyPosts />
        </MemoryRouter>
      );
    });

    // Posts and creator actions still render properly
    expect(container.textContent).toContain('Test User');
    expect(container.textContent).toContain('Vegan Pho');
    expect(container.textContent).toContain('Write Recipe');
    expect(container.textContent).toContain('Edit Profile');

    // Error fallback does NOT show default quota '3 Free Left'
    const badge = container.querySelector('[data-testid="meal-plan-access-badge"]');
    expect(badge).not.toBeNull();
    expect(badge.textContent).toContain('Status Unavailable');
    expect(badge.textContent).not.toContain('3 Free Left');
    expect(badge.textContent).not.toContain('Free Left');

    // CTA is still accessible
    const cta = badge.querySelector('a[href="/meal-plans/payment"]');
    expect(cta).not.toBeNull();
    expect(cta.getAttribute('href')).toBe('/meal-plans/payment');
  });

  it('9. Profile core personal information and editing remain functional', async () => {
    getMealPlanAccess.mockResolvedValue({ status: 'active', canGenerate: true });

    await act(async () => {
      root.render(
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      );
    });

    expect(container.textContent).toContain('0912345678');
    const openBtn = container.querySelector('#openEditProfileBtn');
    expect(openBtn).not.toBeNull();

    await act(async () => {
      openBtn.click();
    });

    expect(container.querySelector('#edit-profile-modal-overlay').classList.contains('hidden')).toBe(false);
  });
});
