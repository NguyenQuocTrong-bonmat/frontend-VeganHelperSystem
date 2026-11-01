import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import Profile from './Profile';
import { authService } from '../../services/authService';

vi.mock('../../components/layout/HeaderMember', () => ({ default: () => <div data-testid="header-member" /> }));
vi.mock('../../components/chat/AIChatbot', () => ({ default: () => null }));
vi.mock('@react-oauth/google', () => ({ GoogleLogin: () => null }));
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, username: 'testuser', displayName: 'Test User' },
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

let container, root;

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  vi.clearAllMocks();

  authService.getProfile.mockResolvedValue({
    id: 1,
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
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  container.remove();
});

const renderProfile = async () => {
  await act(async () => {
    root.render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );
  });
};

const setInputValue = (input, value) => {
  const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  if (valueSetter) {
    valueSetter.call(input, value);
  } else {
    input.value = value;
  }
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
};

describe('Profile - Phone Number & Edit Modal Validation', () => {
  it('displays existing phone number on the card and populates modal input on open', async () => {
    await renderProfile();

    // Verify phone number is displayed on the profile card
    expect(container.textContent).toContain('0912345678');

    // Open Edit modal
    const openBtn = container.querySelector('#openEditProfileBtn');
    expect(openBtn).not.toBeNull();
    await act(async () => {
      openBtn.click();
    });

    const phoneInput = container.querySelector('#modalPhone');
    expect(phoneInput).not.toBeNull();
    expect(phoneInput.value).toBe('0912345678');
  });

  it('validates invalid phone number, shows inline error and does not submit', async () => {
    await renderProfile();

    // Open modal
    await act(async () => {
      container.querySelector('#openEditProfileBtn').click();
    });

    const phoneInput = container.querySelector('#modalPhone');
    // Enter invalid phone number
    await act(async () => {
      setInputValue(phoneInput, '12345');
    });

    // Attempt save
    const form = container.querySelector('#editProfileForm');
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    // authService.updateProfile should NOT be called
    expect(authService.updateProfile).not.toHaveBeenCalled();

    // Inline error should be displayed
    const errorEl = container.querySelector('#modalPhoneError');
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toContain('Phone number must be a valid Vietnamese number');
    expect(phoneInput.getAttribute('aria-invalid')).toBe('true');
    expect(phoneInput.className).toContain('border-red-500');
  });

  it('resets dirty/invalid phone input when modal is closed or cancelled', async () => {
    await renderProfile();

    // Open modal
    await act(async () => {
      container.querySelector('#openEditProfileBtn').click();
    });

    const phoneInput = container.querySelector('#modalPhone');
    // Change to invalid value
    await act(async () => {
      setInputValue(phoneInput, 'invalid-phone-999');
    });
    expect(phoneInput.value).toBe('invalid-phone-999');

    // Click Cancel button
    const cancelBtn = container.querySelector('#cancelEditProfileBtn');
    await act(async () => {
      cancelBtn.click();
    });

    // Modal overlay should now be hidden
    const modalOverlay = container.querySelector('#edit-profile-modal-overlay');
    expect(modalOverlay.className).toContain('hidden');

    // Reopen modal: input must be reset to original profile phone number, not the invalid input!
    await act(async () => {
      container.querySelector('#openEditProfileBtn').click();
    });

    const reopenedPhoneInput = container.querySelector('#modalPhone');
    expect(reopenedPhoneInput.value).toBe('0912345678');
    expect(container.querySelector('#modalPhoneError')).toBeNull();
  });

  it('normalizes phone with spaces/dashes and successfully updates profile', async () => {
    authService.updateProfile.mockResolvedValue({ message: 'Success' });
    await renderProfile();

    // Open modal
    await act(async () => {
      container.querySelector('#openEditProfileBtn').click();
    });

    const phoneInput = container.querySelector('#modalPhone');
    // Enter formatted phone number with spaces
    await act(async () => {
      setInputValue(phoneInput, '0987 654 321');
    });

    const form = container.querySelector('#editProfileForm');
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(authService.updateProfile).toHaveBeenCalledTimes(1);
    const sentFormData = authService.updateProfile.mock.calls[0][0];
    expect(sentFormData.get('phoneNumber')).toBe('0987654321');
  });
});
