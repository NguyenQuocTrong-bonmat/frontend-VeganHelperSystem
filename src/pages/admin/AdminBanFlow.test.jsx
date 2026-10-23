import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import AdminMemberManagement from './AdminMemberManagement';
import * as adminService from '../../services/adminService';

vi.mock('../../components/admin/AdminLayout', () => ({
  default: ({ children }) => <div data-testid="admin-layout">{children}</div>,
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'admin-1', role: 'Admin', username: 'admin' },
  }),
}));

describe('Admin Ban Flow in AdminMemberManagement', () => {
  let container, root;
  let banMemberSpy;

  const mockMembers = [
    {
      id: 101,
      username: 'targetUser',
      displayName: 'Target User',
      email: 'target@example.com',
      role: 'Member',
      status: 'active',
      isActive: true,
      emailVerifiedAt: '2025-01-01T00:00:00Z',
      banReason: null,
      banDuration: 'None',
      createdAt: '2025-01-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    vi.spyOn(adminService, 'getAdminMembers').mockResolvedValue({
      items: mockMembers,
      totalCount: 1,
      page: 1,
      pageSize: 6,
      totalPages: 1,
    });
    vi.spyOn(adminService, 'getAdminMemberSummary').mockResolvedValue({
      totalMembers: 1,
      activeMembers: 1,
      bannedMembers: 0,
      administrators: 1,
    });
    banMemberSpy = vi.spyOn(adminService, 'banMember').mockResolvedValue({
      id: 101,
      status: 'banned',
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

  const renderComponent = async () => {
    await act(async () => {
      root.render(
        <MemoryRouter>
          <AdminMemberManagement />
        </MemoryRouter>
      );
    });

    // Flush promises to resolve fetchMembers
    for (let i = 0; i < 5; i++) {
      await act(async () => {
        await Promise.resolve();
      });
    }
  };

  it('opens the ban modal and displays user information and character limit counter', async () => {
    await renderComponent();

    const openBanBtn = container.querySelector('[data-testid="open-ban-modal-btn"]');
    expect(openBanBtn).not.toBeNull();

    await act(async () => {
      openBanBtn.click();
    });

    // Modal is opened
    expect(container.textContent).toContain('Suspend User Account');
    expect(container.textContent).toContain('targetUser');
    expect(container.textContent).toContain('Reason for Suspension');
    expect(container.textContent).toContain('0/500');

    const textarea = container.querySelector('#admin-ban-reason-input');
    expect(textarea).not.toBeNull();
    expect(textarea.getAttribute('maxLength')).toBe('500');
  });

  it('submits the trimmed ban reason and correct expiration to the API', async () => {
    await renderComponent();

    const openBanBtn = container.querySelector('[data-testid="open-ban-modal-btn"]');
    expect(openBanBtn).not.toBeNull();
    await act(async () => {
      openBanBtn.click();
    });

    const textarea = container.querySelector('#admin-ban-reason-input');
    const form = textarea.closest('form');

    // Enter reason with surrounding whitespace
    await act(async () => {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      ).set;
      nativeSetter.call(textarea, '   Harassment of other members in forum threads.   ');
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).toContain('51/500');

    // Submit form
    await act(async () => {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });

    // Verify banMember was called with trimmed reason
    expect(banMemberSpy).toHaveBeenCalledTimes(1);
    expect(banMemberSpy).toHaveBeenCalledWith(101, {
      reason: 'Harassment of other members in forum threads.',
      expiresAt: expect.any(String),
    });
  });

  it('does not submit if the reason is only whitespace', async () => {
    await renderComponent();

    const openBanBtn = container.querySelector('[data-testid="open-ban-modal-btn"]');
    expect(openBanBtn).not.toBeNull();
    await act(async () => {
      openBanBtn.click();
    });

    const textarea = container.querySelector('#admin-ban-reason-input');
    const form = textarea.closest('form');

    await act(async () => {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      ).set;
      nativeSetter.call(textarea, '     ');
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });

    // Should NOT call API
    expect(banMemberSpy).not.toHaveBeenCalled();
  });
});
