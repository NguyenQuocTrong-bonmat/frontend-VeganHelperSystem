import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import SignUp from './SignUp';
import { authService } from '../../services/authService';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    loginWithGoogle: vi.fn(),
  }),
}));

vi.mock('../../services/authService', () => ({
  authService: {
    register: vi.fn(),
  },
}));

vi.mock('@react-oauth/google', () => ({
  GoogleLogin: () => <div data-testid="google-signup">Google SignUp Button</div>,
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('SignUp Page Viewport & Authentication Layout', () => {
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

  const renderSignUp = async () => {
    await act(async () => {
      root.render(
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      );
    });
  };

  it('renders a shared viewport-height shell with responsive 2-column input pairing', async () => {
    await renderSignUp();

    // 1. Root container enforces 100dvh viewport budget
    const rootEl = container.firstElementChild;
    expect(rootEl.className).toContain('min-h-screen');
    expect(rootEl.className).toContain('min-h-[100dvh]');
    expect(rootEl.className).toContain('flex flex-col');

    // 2. HeaderAuth has shrink-0 and Back to home link
    const header = container.querySelector('header');
    expect(header).not.toBeNull();
    expect(header.className).toContain('shrink-0');
    expect(container.querySelector('header a[href="/"]')).not.toBeNull();

    // 3. Main container centers the card in remaining viewport space
    const main = container.querySelector('main');
    expect(main).not.toBeNull();
    expect(main.className).toContain('flex-1');
    expect(main.className).toContain('flex flex-col justify-center items-center');

    // 4. Paired inputs in 2-column grid layout for desktop/tablet
    const grids = container.querySelectorAll('form .grid');
    expect(grids.length).toBeGreaterThanOrEqual(2);
    expect(grids[0].className).toContain('sm:grid-cols-2');
    expect(grids[1].className).toContain('sm:grid-cols-2');

    // First grid contains Full Name and Username
    expect(grids[0].querySelector('#fullName')).not.toBeNull();
    expect(grids[0].querySelector('#username')).not.toBeNull();

    // Second grid contains Password and Confirm Password
    expect(grids[1].querySelector('#password')).not.toBeNull();
    expect(grids[1].querySelector('#confirmPassword')).not.toBeNull();

    // 5. Footer is present with shrink-0
    const footer = container.querySelector('footer');
    expect(footer).not.toBeNull();
    expect(footer.className).toContain('shrink-0');
  });

  it('renders all required registration fields, labels, autocomplete, and password toggles', async () => {
    await renderSignUp();

    // Heading
    const heading = container.querySelector('h1');
    expect(heading).not.toBeNull();
    expect(heading.textContent).toBe('Join Us');

    // Full Name
    const fullNameInput = container.querySelector('#fullName');
    expect(fullNameInput).not.toBeNull();
    expect(container.querySelector('label[for="fullName"]')).not.toBeNull();
    expect(fullNameInput.getAttribute('autocomplete')).toBe('name');

    // Username
    const usernameInput = container.querySelector('#username');
    expect(usernameInput).not.toBeNull();
    expect(container.querySelector('label[for="username"]')).not.toBeNull();
    expect(usernameInput.getAttribute('autocomplete')).toBe('username');

    // Email
    const emailInput = container.querySelector('#email');
    expect(emailInput).not.toBeNull();
    expect(container.querySelector('label[for="email"]')).not.toBeNull();
    expect(emailInput.getAttribute('autocomplete')).toBe('email');

    // Password & Confirm Password
    const passwordInput = container.querySelector('#password');
    const confirmPasswordInput = container.querySelector('#confirmPassword');
    expect(passwordInput).not.toBeNull();
    expect(confirmPasswordInput).not.toBeNull();
    expect(passwordInput.type).toBe('password');
    expect(confirmPasswordInput.type).toBe('password');

    // Password visibility toggle controls
    const togglePass = container.querySelector('button[aria-controls="password"]');
    const toggleConfirm = container.querySelector('button[aria-controls="confirmPassword"]');
    expect(togglePass).not.toBeNull();
    expect(toggleConfirm).not.toBeNull();

    await act(async () => {
      togglePass.click();
    });
    expect(passwordInput.type).toBe('text');

    await act(async () => {
      toggleConfirm.click();
    });
    expect(confirmPasswordInput.type).toBe('text');

    // Terms checkbox
    const termsCheckbox = container.querySelector('#terms');
    expect(termsCheckbox).not.toBeNull();
    expect(container.querySelector('label[for="terms"]')).not.toBeNull();

    // Primary submit button
    const submitBtn = container.querySelector('button[type="submit"]');
    expect(submitBtn).not.toBeNull();
    expect(submitBtn.textContent).toContain('Sign Up');

    // Google Sign-In and Navigation to Login
    expect(container.querySelector('[data-testid="google-signup"]')).not.toBeNull();
    const loginLink = container.querySelector('a[href="/login"]');
    expect(loginLink).not.toBeNull();
    expect(loginLink.textContent).toBe('Log in now');
  });

  it('displays accessible validation error messages when submitted empty', async () => {
    await renderSignUp();

    const form = container.querySelector('form');
    await act(async () => {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });

    const errorAlerts = container.querySelectorAll('[role="alert"]');
    expect(errorAlerts.length).toBeGreaterThanOrEqual(4);
    expect(container.textContent).toContain('Full Name must be at least 3 characters');
    expect(container.textContent).toContain('Username must be at least 3 characters');
    expect(container.textContent).toContain('Email is required');
    expect(container.textContent).toContain('Password must be at least 8 characters');
    expect(container.textContent).toContain('You must agree to the Terms of Service');
  });

  it('displays UnverifiedEmailModal when registering a new account', async () => {
    authService.register.mockResolvedValueOnce({
      message: 'Registration successful. Verify your email before logging in.',
      isExistingUnverified: false,
    });

    await renderSignUp();

    const fullNameInput = container.querySelector('#fullName');
    const usernameInput = container.querySelector('#username');
    const emailInput = container.querySelector('#email');
    const passwordInput = container.querySelector('#password');
    const confirmPasswordInput = container.querySelector('#confirmPassword');
    const termsCheckbox = container.querySelector('#terms');

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;

    await act(async () => {
      nativeInputValueSetter.call(fullNameInput, 'Nguyen Van A');
      fullNameInput.dispatchEvent(new Event('input', { bubbles: true }));
      nativeInputValueSetter.call(usernameInput, 'nguyenvana');
      usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
      nativeInputValueSetter.call(emailInput, 'nguyenvana@example.com');
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      nativeInputValueSetter.call(passwordInput, 'Password123!');
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
      nativeInputValueSetter.call(confirmPasswordInput, 'Password123!');
      confirmPasswordInput.dispatchEvent(new Event('input', { bubbles: true }));
      termsCheckbox.click();
    });

    const form = container.querySelector('form');
    await act(async () => {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });

    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog.textContent).toContain('Account Verification Required');
    expect(dialog.textContent).toContain('nguyenvana@example.com');
  });

  it('displays UnverifiedEmailModal with existing message when email was already registered but unverified', async () => {
    authService.register.mockResolvedValueOnce({
      message: 'This email has already been registered but is not yet verified.',
      isExistingUnverified: true,
    });

    await renderSignUp();

    const fullNameInput = container.querySelector('#fullName');
    const usernameInput = container.querySelector('#username');
    const emailInput = container.querySelector('#email');
    const passwordInput = container.querySelector('#password');
    const confirmPasswordInput = container.querySelector('#confirmPassword');
    const termsCheckbox = container.querySelector('#terms');

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;

    await act(async () => {
      nativeInputValueSetter.call(fullNameInput, 'Tran Thi B');
      fullNameInput.dispatchEvent(new Event('input', { bubbles: true }));
      nativeInputValueSetter.call(usernameInput, 'tranthib');
      usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
      nativeInputValueSetter.call(emailInput, 'pending@example.com');
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      nativeInputValueSetter.call(passwordInput, 'Password123!');
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
      nativeInputValueSetter.call(confirmPasswordInput, 'Password123!');
      confirmPasswordInput.dispatchEvent(new Event('input', { bubbles: true }));
      termsCheckbox.click();
    });

    const form = container.querySelector('form');
    await act(async () => {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });

    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog.textContent).toContain('Email Already Registered');
    expect(dialog.textContent).toContain('pending@example.com');
    expect(dialog.textContent).toContain('not been verified yet');
  });
});
