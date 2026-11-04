import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Login from './Login';
import * as authContextModule from '../../context/AuthContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@react-oauth/google', () => ({
  GoogleLogin: () => <div data-testid="google-login">Google Login Button</div>,
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Account Ban Flow in Login Page', () => {
  let container, root;
  let mockLogin;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    mockNavigate.mockReset();
    mockLogin = vi.fn();

    vi.spyOn(authContextModule, 'useAuth').mockReturnValue({
      login: mockLogin,
      loginWithGoogle: vi.fn(),
    });

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.restoreAllMocks();
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

  const fillAndSubmit = async (username, password) => {
    const usernameInput = container.querySelector('#username');
    const passwordInput = container.querySelector('#password');
    const form = container.querySelector('form');

    await act(async () => {
      // Simulate input
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      nativeInputValueSetter.call(usernameInput, username);
      usernameInput.dispatchEvent(new Event('input', { bubbles: true }));

      nativeInputValueSetter.call(passwordInput, password);
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });
  };

  it('1. Ban response containing a reason displays that exact reason in the account suspended view', async () => {
    const specificReason = 'Account suspended due to terms of service violation on recipe comments.';
    const banError = new Error('Account is banned or inactive.');
    banError.response = {
      status: 403,
      data: {
        error: 'Account is banned or inactive.',
        reason: specificReason,
      },
    };
    mockLogin.mockRejectedValueOnce(banError);

    await renderLogin();
    await fillAndSubmit('bannedUser', 'Secret123!');

    // Account Suspended view is displayed
    const heading = container.querySelector('#account-suspended-heading');
    expect(heading).not.toBeNull();
    expect(heading.textContent).toBe('Account Suspended');

    // Exact reason is displayed
    const reasonEl = container.querySelector('[data-testid="ban-reason-text"]');
    expect(reasonEl).not.toBeNull();
    expect(reasonEl.textContent).toBe(specificReason);

    // Form inputs are no longer rendered
    expect(container.querySelector('#username')).toBeNull();
  });

  it('2. Ban response with missing or empty reason displays a safe generic restriction message without inventing details', async () => {
    const banError = new Error('Account is banned or inactive.');
    banError.response = {
      status: 403,
      data: {
        error: 'Account is banned or inactive.',
        // no reason field
      },
    };
    mockLogin.mockRejectedValueOnce(banError);

    await renderLogin();
    await fillAndSubmit('bannedUserNoReason', 'Secret123!');

    // Account Suspended view is displayed
    const heading = container.querySelector('#account-suspended-heading');
    expect(heading).not.toBeNull();
    expect(heading.textContent).toBe('Account Suspended');

    // Safe fallback message is shown instead of fabricated details
    const fallbackEl = container.querySelector('[data-testid="ban-reason-fallback"]');
    expect(fallbackEl).not.toBeNull();
    expect(fallbackEl.textContent).toContain('No specific reason was provided');
    expect(container.querySelector('[data-testid="ban-reason-text"]')).toBeNull();
  });

  it('3. Invalid credentials (401) do not display the account-ban screen', async () => {
    const authError = new Error('Invalid username or password.');
    authError.response = {
      status: 401,
      data: { error: 'Invalid username or password.' },
    };
    mockLogin.mockRejectedValueOnce(authError);

    await renderLogin();
    await fillAndSubmit('wrongUser', 'wrongPass');

    // Account Suspended view must NOT be displayed
    expect(container.querySelector('#account-suspended-heading')).toBeNull();

    // Login form remains visible
    expect(container.querySelector('#username')).not.toBeNull();
    expect(container.querySelector('#password')).not.toBeNull();
  });

  it('4. Unverified email (403 with verification notice) navigates to /verify-otp rather than displaying ban screen', async () => {
    const unverifiedError = new Error('Please verify your email before logging in.');
    unverifiedError.response = {
      status: 403,
      data: { error: 'Please verify your email before logging in.' },
    };
    mockLogin.mockRejectedValueOnce(unverifiedError);

    await renderLogin();
    await fillAndSubmit('unverifiedUser', 'Secret123!');

    // Does NOT show ban screen
    expect(container.querySelector('#account-suspended-heading')).toBeNull();

    // Navigates to verify-otp
    expect(mockNavigate).toHaveBeenCalledWith('/verify-otp', {
      state: { requiresEmail: true, email: 'unverifiedUser' },
    });
  });

  it('5. Back to Log In button resets the ban state and restores the login form', async () => {
    const banError = new Error('Account is banned or inactive.');
    banError.response = {
      status: 403,
      data: { error: 'Account is banned or inactive.' },
    };
    mockLogin.mockRejectedValueOnce(banError);

    await renderLogin();
    await fillAndSubmit('bannedUser', 'Secret123!');

    expect(container.querySelector('#account-suspended-heading')).not.toBeNull();

    const backBtn = container.querySelector('[data-testid="back-to-login-btn"]');
    expect(backBtn).not.toBeNull();

    await act(async () => {
      backBtn.click();
    });

    // Login form is restored
    expect(container.querySelector('#account-suspended-heading')).toBeNull();
    expect(container.querySelector('#username')).not.toBeNull();
    expect(container.querySelector('#password')).not.toBeNull();
  });
});
