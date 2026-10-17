import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import AdminAuditLogs from './AdminAuditLogs';
import { useAuth } from '../../context/AuthContext';

// Mock AuthContext
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock NotificationBell
vi.mock('../../components/notifications/NotificationBell', () => ({
  default: () => <div data-testid="mock-notification-bell">NotificationBell</div>,
}));

// Mock adminService to trigger fallback
vi.mock('../../services/adminService', () => ({
  getAdminAuditLogs: vi.fn().mockRejectedValue(new Error('Backend offline in test')),
  getAdminAuditLogById: vi.fn(),
}));

let container;
let root;

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  useAuth.mockReturnValue({
    user: { id: 'admin-1', username: 'superadmin', role: 'ADMIN' },
    isAuthenticated: true,
    logout: vi.fn(),
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => {
    root.unmount();
  });
  container.remove();
  vi.clearAllMocks();
});

const renderComponent = async () => {
  await act(async () => {
    root.render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AdminAuditLogs />
      </MemoryRouter>
    );
  });
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

describe('AdminAuditLogs', () => {
  it('renders page header, KPI summary cards, and audit log table', async () => {
    await renderComponent();

    // Check heading
    const heading = container.querySelector('h1');
    expect(heading).not.toBeNull();
    expect(heading.textContent).toContain('Audit Logs');

    // Check KPI cards
    expect(container.textContent).toContain('Total Log Records');
    expect(container.textContent).toContain('Active Admins');
    expect(container.textContent).toContain('Target Resource Types');
    expect(container.textContent).toContain('Client IP Addresses');

    // Check table headers
    expect(container.textContent).toContain('Timestamp');
    expect(container.textContent).toContain('ID');
    expect(container.textContent).toContain('Admin');
    expect(container.textContent).toContain('Action');
    expect(container.textContent).toContain('Target Entity');
    expect(container.textContent).toContain('Client IP');
    expect(container.textContent).toContain('Trace ID');
  });

  it('filters audit logs when user types into search input', async () => {
    await renderComponent();

    const searchInput = container.querySelector('input[type="text"]');
    expect(searchInput).not.toBeNull();

    // Type a specific action or target
    await act(async () => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      nativeInputValueSetter.call(searchInput, 'member.ban');
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Should display only the matching log
    expect(container.textContent).toContain('member.ban');
    expect(container.textContent).toContain('#892');
    expect(container.textContent).not.toContain('category.create');
  });

  it('filters audit logs by target type selection', async () => {
    await renderComponent();

    const selects = container.querySelectorAll('select');
    const targetTypeSelect = selects[0]; // first select is Target Type
    expect(targetTypeSelect).not.toBeNull();

    await act(async () => {
      targetTypeSelect.value = 'member';
      targetTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    });

    // Should only contain member target events
    expect(container.textContent).toContain('member.ban');
    expect(container.textContent).toContain('member.unban');
    expect(container.textContent).not.toContain('category.create');
  });

  it('opens and closes event detail inspection modal', async () => {
    await renderComponent();

    const inspectButtons = container.querySelectorAll('button');
    const inspectBtn = Array.from(inspectButtons).find((b) => b.textContent.includes('Inspect'));
    expect(inspectBtn).not.toBeNull();

    // Open modal
    await act(async () => {
      inspectBtn.click();
    });

    // Verify modal is open
    const modalTitle = container.querySelector('#audit-modal-title');
    expect(modalTitle).not.toBeNull();
    expect(modalTitle.textContent).toContain('Audit Event Details');
    expect(container.textContent).toContain('Raw Event Payload');
    expect(container.textContent).toContain('Copy JSON');

    // Click Close button
    const closeBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent.trim() === 'Close'
    );
    expect(closeBtn).not.toBeNull();
    await act(async () => {
      closeBtn.click();
    });

    // Verify modal is closed
    expect(container.querySelector('#audit-modal-title')).toBeNull();
  });

  it('triggers CSV export without crashing', async () => {
    await renderComponent();

    // Mock URL.createObjectURL and URL.revokeObjectURL
    window.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    window.URL.revokeObjectURL = vi.fn();

    const exportBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent.includes('Export CSV')
    );
    expect(exportBtn).not.toBeNull();

    await act(async () => {
      exportBtn.click();
    });

    expect(window.URL.createObjectURL).toHaveBeenCalled();
  });
});
