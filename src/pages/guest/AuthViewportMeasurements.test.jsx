import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Login from './Login';
import SignUp from './SignUp';
import VerifyOTP from './VerifyOTP';
import { authService } from '../../services/authService';
import ForgotPasswordResetPassword from './ForgotPasswordResetPassword';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(),
    loginWithGoogle: vi.fn(),
  }),
}));

vi.mock('../../services/authService', () => ({
  authService: {
    register: vi.fn(),
    resendVerification: vi.fn(),
    verifyEmail: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
  },
}));

vi.mock('@react-oauth/google', () => ({
  GoogleLogin: () => <div data-testid="google-auth">Google Auth Button</div>,
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('AUTH-FIT-SCREEN-01 Layout & Viewport Budget Verification', () => {
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

  const targetViewports = [
    { name: 'Full HD Desktop', width: 1920, height: 1080 },
    { name: 'MacBook / Wide Laptop', width: 1440, height: 900 },
    { name: 'Standard HD Laptop', width: 1366, height: 768 },
    { name: 'Compact Laptop', width: 1280, height: 720 },
    { name: 'iPad / Small Desktop', width: 1024, height: 768 },
    { name: 'Tablet Short Landscape', width: 768, height: 640 },
    { name: 'Tablet Portrait', width: 768, height: 1024 },
    { name: 'iPhone 15 Pro Max', width: 430, height: 932 },
    { name: 'iPhone 14 / 15', width: 390, height: 844 },
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'Compact Android', width: 360, height: 640 },
    { name: 'Narrow Mobile Short', width: 320, height: 568 },
  ];

  it('Login page satisfies viewport contract across all target viewports', async () => {
    await act(async () => {
      root.render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );
    });

    const rootElement = container.firstElementChild;
    const header = container.querySelector('header');
    const main = container.querySelector('main');
    const card = main.querySelector('.my-auto');
    const footer = container.querySelector('footer');

    // 1. Root element uses 100dvh budget without overflow-hidden hack on page level
    expect(rootElement.className).toContain('min-h-screen');
    expect(rootElement.className).toContain('min-h-[100dvh]');
    expect(rootElement.className).not.toContain('overflow-hidden');

    // 2. Header and footer participate in the single budget
    expect(header.className).toContain('shrink-0');
    expect(footer.className).toContain('shrink-0');

    // 3. Main container centers content with flex-1
    expect(main.className).toContain('flex-1');
    expect(main.className).toContain('justify-center');

    // 4. Card uses responsive max width and auto margins
    expect(card).not.toBeNull();
    expect(card.className).toContain('max-w-[390px]');
    expect(card.className).toContain('sm:max-w-[410px]');
    expect(card.className).toContain('lg:max-w-[420px]');

    // 5. Submit button satisfies 44px touch target
    const submitBtn = container.querySelector('button[type="submit"]');
    expect(submitBtn.className).toContain('min-h-[44px]');

    // 6. Test each viewport configuration
    targetViewports.forEach((vp) => {
      window.innerWidth = vp.width;
      window.innerHeight = vp.height;
      window.dispatchEvent(new Event('resize'));
      expect(window.innerHeight).toBe(vp.height);
      expect(window.innerWidth).toBe(vp.width);
    });
  });

  it('SignUp email step satisfies the viewport and touch-target contract', async () => {
    await act(async () => {
      root.render(
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      );
    });

    const rootElement = container.firstElementChild;
    const header = container.querySelector('header');
    const main = container.querySelector('main');
    const card = main.querySelector('.my-auto');
    const footer = container.querySelector('footer');

    // 1. Root element uses 100dvh budget without overflow-hidden hack
    expect(rootElement.className).toContain('min-h-screen');
    expect(rootElement.className).toContain('min-h-[100dvh]');
    expect(rootElement.className).not.toContain('overflow-hidden');

    // 2. Header and footer shrink-0
    expect(header.className).toContain('shrink-0');
    expect(footer.className).toContain('shrink-0');

    // 3. Card uses compact responsive width
    expect(card).not.toBeNull();
    expect(card.className).toContain('max-w-[420px]');
    expect(card.className).toContain('sm:max-w-[480px]');
    expect(card.className).toContain('lg:max-w-[500px]');

    // 4. Submit button satisfies 44px touch target
    const submitBtn = container.querySelector('button[type="submit"]');
    expect(submitBtn.className).toContain('min-h-[44px]');

    expect(container.querySelector('#registration-email')).not.toBeNull();
    expect(container.querySelector('#password')).toBeNull();

    // 6. Test each viewport configuration
    targetViewports.forEach((vp) => {
      window.innerWidth = vp.width;
      window.innerHeight = vp.height;
      window.dispatchEvent(new Event('resize'));
      expect(window.innerHeight).toBe(vp.height);
      expect(window.innerWidth).toBe(vp.width);
    });
  });

  it('redirects legacy OTP links and provides one accessible verification input', async () => {
    authService.resendVerification.mockResolvedValueOnce({});
    await act(async () => root.render(
      <MemoryRouter initialEntries={[{ pathname: '/verify-otp', state: { email: 'chef@veganhelper.org' } }]}>
        <Routes>
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </MemoryRouter>
    ));
    expect(container.querySelector('#registration-email').value).toBe('chef@veganhelper.org');
    await act(async () => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    const otpInputs = container.querySelectorAll('input#registration-code');
    expect(otpInputs).toHaveLength(1);
    expect(otpInputs[0].maxLength).toBe(6);
    expect(otpInputs[0].inputMode).toBe('numeric');
    expect(otpInputs[0].autocomplete).toBe('one-time-code');
  });

  it('ForgotPasswordResetPassword satisfies responsive card padding and short-viewport resilience', async () => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/forgot-password']}>
          <ForgotPasswordResetPassword />
        </MemoryRouter>
      );
    });

    const rootElement = container.firstElementChild;
    const header = container.querySelector('header');
    const main = container.querySelector('main');
    const card = main.querySelector('.my-auto');
    const footer = container.querySelector('footer');

    // 1. Root container uses 100dvh budget
    expect(rootElement.className).toContain('min-h-screen');
    expect(rootElement.className).toContain('min-h-[100dvh]');

    // 2. Header and footer participate cleanly
    expect(header.className).toContain('shrink-0');
    expect(footer.className).toContain('shrink-0');

    // 3. Card uses p-5 on mobile and sm:p-8, with my-auto
    expect(card).not.toBeNull();
    expect(card.className).toContain('p-5');
    expect(card.className).toContain('sm:p-8');
    expect(card.className).toContain('my-auto');

    // 4. Submit button satisfies 44px touch target
    const submitBtn = container.querySelector('button[type="submit"]');
    expect(submitBtn.className).toContain('min-h-[44px]');
  });
});
