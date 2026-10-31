import React, { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import DateInput from './DateInput';
import AdminDashboard from '../../pages/admin/AdminDashboard';
import PlanSetupFlow from '../meal-planning/PlanSetupFlow';
import * as adminService from '../../services/adminService';
import * as healthService from '../../services/healthProfileService';

vi.mock('../../components/admin/AdminLayout', () => ({ default: ({ children }) => <main>{children}</main> }));
vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ user: { username: 'Admin' } }) }));
vi.mock('../../services/adminService', () => ({
  getAdminDashboardOverview: vi.fn(),
  getAdminDashboardActivity: vi.fn(),
  getAdminDashboardCategories: vi.fn(),
  getAdminAuditLogs: vi.fn(),
}));
vi.mock('../../services/healthProfileService', () => ({
  getHealthProfile: vi.fn(),
  updateHealthProfile: vi.fn(),
  declareAllergies: vi.fn(),
  searchIngredients: vi.fn(),
}));

describe('DateInput Project-Wide Integration Tests', () => {
  let container, root;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vi.clearAllMocks();

    adminService.getAdminDashboardOverview.mockResolvedValue({
      members: { total: 100, newInPeriod: 10, growthPercentage: 5 },
      posts: { totalPublished: 50, createdInPeriod: 5 },
      moderation: { totalPending: 0, aiFlaggedPosts: 0, reportedPosts: 0, reportedComments: 0 },
    });
    adminService.getAdminDashboardActivity.mockResolvedValue({ items: [] });
    adminService.getAdminDashboardCategories.mockResolvedValue({ items: [] });
    adminService.getAdminAuditLogs.mockResolvedValue({ items: [] });
    healthService.getHealthProfile.mockResolvedValue({
      heightCm: 170,
      weightKg: 65,
      dietType: 'vegan',
      allergies: [],
    });
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  const simulateInput = (input, value) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };

  it('AdminDashboard From filter displays DD/MM/YYYY and submits ISO YYYY-MM-DD', async () => {
    await act(async () => {
      root.render(
        <MemoryRouter>
          <AdminDashboard />
        </MemoryRouter>
      );
    });

    const fromInput = container.querySelector('[aria-label="From (UTC)"]');
    expect(fromInput).not.toBeNull();
    // Verify it displays DD/MM/YYYY format
    expect(fromInput.value).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);

    // Enter date manually in DD/MM/YYYY
    await act(async () => {
      simulateInput(fromInput, '15/10/2026');
    });

    expect(fromInput.value).toBe('15/10/2026');

    // Submit form and verify ISO string was dispatched to service
    const form = container.querySelector('form');
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(adminService.getAdminDashboardOverview).toHaveBeenCalledWith(
      expect.objectContaining({ from: '2026-10-15' }),
      expect.any(AbortSignal)
    );
  });

  it('AdminDashboard To filter enforces minimum date bound based on From date', async () => {
    await act(async () => {
      root.render(
        <MemoryRouter>
          <AdminDashboard />
        </MemoryRouter>
      );
    });

    const fromInput = container.querySelector('[aria-label="From (UTC)"]');
    const toInput = container.querySelector('[aria-label="To (UTC)"]');

    await act(async () => {
      simulateInput(fromInput, '10/10/2026');
    });

    // Try setting To date before From date
    await act(async () => {
      simulateInput(toInput, '05/10/2026');
    });

    expect(toInput.validationMessage).toContain('Date must be on or after 10/10/2026');
  });

  it('Weekly Menu start date in PlanSetupFlow displays DD/MM/YYYY and advances wizard state with ISO value', async () => {
    const handleGenerate = vi.fn();

    await act(async () => {
      root.render(
        <PlanSetupFlow
          busy={false}
          onGenerate={handleGenerate}
          onCancel={vi.fn()}
          onEditProfile={vi.fn()}
          profileRevision={0}
        />
      );
    });

    // Step 0: Mode selection -> click Next
    const form = container.querySelector('#plan-setup-form');
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    // Step 1: Start Date field
    const startInput = container.querySelector('#meal-plan-start');
    expect(startInput).not.toBeNull();
    expect(startInput.value).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);

    // Manually type a valid DD/MM/YYYY start date
    await act(async () => {
      simulateInput(startInput, '25/11/2026');
    });

    expect(startInput.value).toBe('25/11/2026');

    // Advance to Step 2 (Review)
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    // Review step should display formatted start date in DD/MM/YYYY
    expect(container.textContent).toContain('25/11/2026');

    // Submit generation
    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    // Verify generation payload preserved ISO YYYY-MM-DD
    expect(handleGenerate).toHaveBeenCalledWith(
      expect.objectContaining({
        startDate: '2026-11-25',
      })
    );
  });

  it('preserves calendar selection and synchronizes visible DD/MM/YYYY display', async () => {
    const handleChange = vi.fn();

    function TestHarness() {
      const [dateVal, setDateVal] = useState('2026-10-15');
      return (
        <DateInput
          id="test-date"
          name="testDate"
          value={dateVal}
          onChange={(e) => {
            setDateVal(e.target.value);
            handleChange(e.target.value);
          }}
        />
      );
    }

    await act(async () => {
      root.render(<TestHarness />);
    });

    const textInput = container.querySelector('input[type="text"]');
    const picker = container.querySelector('input[type="date"]');

    expect(textInput.value).toBe('15/10/2026');

    // Simulate choosing 2026-12-05 via calendar picker
    await act(async () => {
      simulateInput(picker, '2026-12-05');
    });

    expect(textInput.value).toBe('05/12/2026');
    expect(handleChange).toHaveBeenCalledWith('2026-12-05');
  });
});
