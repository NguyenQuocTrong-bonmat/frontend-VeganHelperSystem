import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Login from './Login';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(),
    loginWithGoogle: vi.fn(),
  }),
}));

vi.mock('@react-oauth/google', () => ({
  GoogleLogin: () => <div data-testid="google-login">Google Login Button</div>,
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Login Page Viewport & Authentication Layout', () => {
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
  });

  const renderLogin = async () => {
    await act(async () => {
      root.render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );
    });
  };

  it('renders a shared viewport-height shell without arbitrary height clipping', async () => {
    await renderLogin();

    // 1. Root container enforces modern 100dvh budget with fallback
    const rootEl = container.firstElementChild;
    expect(rootEl.className).toContain('min-h-screen');
    expect(rootEl.className).toContain('min-h-[100dvh]');
    expect(rootEl.className).toContain('flex flex-col');

    // 2. HeaderAuth is at top with shrink-0 to prevent collapsing
    const header = container.querySelector('header');
    expect(header).not.toBeNull();
    expect(header.className).toContain('shrink-0');
    expect(container.querySelector('header a[href="/"]')).not.toBeNull();
    expect(container.textContent).toContain('Back to home');

    // 3. Main container centers the card in remaining viewport space
    const main = container.querySelector('main');
    expect(main).not.toBeNull();
    expect(main.className).toContain('flex-1');
    expect(main.className).toContain('flex flex-col justify-center items-center');
    expect(main.className).toContain('lg:items-end');

    // 4. Footer is present with shrink-0 and minimal vertical padding
    const footer = container.querySelector('footer');
    expect(footer).not.toBeNull();
    expect(footer.className).toContain('shrink-0');
  });

  it('renders the complete login form, branding, and all required authentication controls', async () => {
    await renderLogin();

    // Heading & branding
    const heading = container.querySelector('h1');
    expect(heading).not.toBeNull();
    expect(heading.textContent).toBe('Welcome back');

    // Form inputs and associated labels
    const usernameInput = container.querySelector('#username');
    const usernameLabel = container.querySelector('label[for="username"]');
    expect(usernameInput).not.toBeNull();
    expect(usernameLabel).not.toBeNull();
    expect(usernameInput.getAttribute('autocomplete')).toBe('username');

    const passwordInput = container.querySelector('#password');
    const passwordLabel = container.querySelector('label[for="password"]');
    expect(passwordInput).not.toBeNull();
    expect(passwordLabel).not.toBeNull();
    expect(passwordInput.getAttribute('autocomplete')).toBe('current-password');
    expect(passwordInput.type).toBe('password');

    // Password visibility toggle control
    const toggleButton = container.querySelector('button[aria-controls="password"]');
    expect(toggleButton).not.toBeNull();
    expect(toggleButton.getAttribute('aria-label')).toBe('Show password');
    expect(toggleButton.getAttribute('aria-pressed')).toBe('false');

    // Click toggle to reveal password
    await act(async () => {
      toggleButton.click();
    });
    expect(passwordInput.type).toBe('text');
    expect(toggleButton.getAttribute('aria-label')).toBe('Hide password');
    expect(toggleButton.getAttribute('aria-pressed')).toBe('true');

    // Remember Me checkbox
    const rememberCheckbox = container.querySelector('#remember');
    const rememberLabel = container.querySelector('label[for="remember"]');
    expect(rememberCheckbox).not.toBeNull();
    expect(rememberLabel).not.toBeNull();

    // Forgot password link
    const forgotLink = container.querySelector('a[href="/forgot-password"]');
    expect(forgotLink).not.toBeNull();
    expect(forgotLink.textContent).toBe('Forgot password?');

    // Primary Submit button
    const submitBtn = container.querySelector('button[type="submit"]');
    expect(submitBtn).not.toBeNull();
    expect(submitBtn.textContent).toContain('Log In');

    // Google Sign-In and Navigation to Sign Up
    expect(container.querySelector('[data-testid="google-login"]')).not.toBeNull();
    const signUpLink = container.querySelector('a[href="/sign-up"]');
    expect(signUpLink).not.toBeNull();
    expect(signUpLink.textContent).toBe('Sign up now');
  });

  it('displays accessible validation error messages when submitted empty', async () => {
    await renderLogin();

    const form = container.querySelector('form');
    await act(async () => {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });

    const errorAlerts = container.querySelectorAll('[role="alert"]');
    expect(errorAlerts.length).toBeGreaterThanOrEqual(2);
    expect(container.textContent).toContain('Username is required');
    expect(container.textContent).toContain('Password is required');
  });
});
