import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import UnverifiedEmailModal from './UnverifiedEmailModal';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../services/authService', () => ({
  authService: {
    resendVerification: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('UnverifiedEmailModal Component', () => {
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
    document.body.style.overflow = '';
  });

  it('does not render when isOpen is false', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <UnverifiedEmailModal isOpen={false} email="test@example.com" />
        </BrowserRouter>
      );
    });

    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders correctly for existing unverified email', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <UnverifiedEmailModal
            isOpen={true}
            email="existing@example.com"
            isExisting={true}
            onClose={() => {}}
          />
        </BrowserRouter>
      );
    });

    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog.textContent).toContain('Email Already Registered');
    expect(dialog.textContent).toContain('existing@example.com');
    expect(dialog.textContent).toContain('not been verified yet');
    expect(container.querySelector('#unverified-modal-verify-btn')).not.toBeNull();
    expect(container.querySelector('#unverified-modal-resend-btn')).not.toBeNull();
  });

  it('renders correctly for new account creation unverified state', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <UnverifiedEmailModal
            isOpen={true}
            email="newuser@example.com"
            isExisting={false}
            onClose={() => {}}
          />
        </BrowserRouter>
      );
    });

    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog.textContent).toContain('Account Verification Required');
    expect(dialog.textContent).toContain('newuser@example.com');
  });

  it('navigates to /verify-otp with email when clicking Verify Email Now', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <UnverifiedEmailModal
            isOpen={true}
            email="user@example.com"
            isExisting={true}
            onClose={() => {}}
          />
        </BrowserRouter>
      );
    });

    const verifyBtn = container.querySelector('#unverified-modal-verify-btn');
    await act(async () => {
      verifyBtn.click();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/verify-otp', {
      state: {
        email: 'user@example.com',
        requiresEmail: false,
      },
    });
  });

  it('calls authService.resendVerification when clicking Resend Code', async () => {
    authService.resendVerification.mockResolvedValueOnce({ message: 'Code sent' });

    await act(async () => {
      root.render(
        <BrowserRouter>
          <UnverifiedEmailModal
            isOpen={true}
            email="user@example.com"
            isExisting={true}
            onClose={() => {}}
          />
        </BrowserRouter>
      );
    });

    const resendBtn = container.querySelector('#unverified-modal-resend-btn');
    await act(async () => {
      resendBtn.click();
    });

    expect(authService.resendVerification).toHaveBeenCalledWith({ email: 'user@example.com' });
    expect(toast.success).toHaveBeenCalledWith('A new verification code has been sent to your email.');
  });

  it('triggers onClose when clicking close button', async () => {
    const handleClose = vi.fn();
    await act(async () => {
      root.render(
        <BrowserRouter>
          <UnverifiedEmailModal
            isOpen={true}
            email="user@example.com"
            onClose={handleClose}
          />
        </BrowserRouter>
      );
    });

    const closeBtn = container.querySelector('#unverified-modal-close-btn');
    await act(async () => {
      closeBtn.click();
    });

    expect(handleClose).toHaveBeenCalled();
  });
});
