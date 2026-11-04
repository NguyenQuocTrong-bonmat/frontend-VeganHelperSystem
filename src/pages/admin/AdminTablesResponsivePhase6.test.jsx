import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import AdminMemberManagement from './AdminMemberManagement';
import AdminAuditLogs from './AdminAuditLogs';
import AdminCategoryManagement from './AdminCategoryManagement';
import AdminDashboard from './AdminDashboard';
import * as adminService from '../../services/adminService';

vi.mock('../../components/admin/AdminLayout', () => ({
  default: ({ children }) => <div data-testid="admin-layout">{children}</div>,
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'admin-1', role: 'Admin', username: 'admin' },
  }),
}));

describe('Phase 6: Admin Suite Tables Responsive & Sticky Behavior', () => {
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
    vi.restoreAllMocks();
  });

  describe('1. Member Management Table (AdminMemberManagement)', () => {
    beforeEach(() => {
      vi.spyOn(adminService, 'getAdminMembers').mockResolvedValue({
        items: [
          {
            id: 101,
            username: 'vegan_chef',
            displayName: 'Vegan Chef',
            email: 'chef@veganhelper.org',
            role: 'Member',
            status: 'Active',
            isActive: true,
            emailVerifiedAt: '2025-01-01T00:00:00Z',
            joinedDate: '2025-01-01',
          },
        ],
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
    });

    it('enforces min-w-[880px], accessible scroll wrapper, and mobile scroll cue', async () => {
      await act(async () => {
        root.render(
          <MemoryRouter>
            <AdminMemberManagement />
          </MemoryRouter>
        );
      });

      // Accessible scroll wrapper
      const scrollRegion = container.querySelector('[role="region"][aria-label="Members directory table"]');
      expect(scrollRegion).not.toBeNull();
      expect(scrollRegion.getAttribute('tabindex')).toBe('0');
      expect(scrollRegion.className).toContain('overflow-x-auto');

      // Table minimum width
      const table = scrollRegion.querySelector('table');
      expect(table).not.toBeNull();
      expect(table.className).toContain('min-w-[880px]');
      expect(table.className).toContain('table-fixed');

      // Mobile horizontal scroll cue
      const mobileCue = container.querySelector('.md\\:hidden');
      expect(mobileCue).not.toBeNull();
      expect(mobileCue.textContent).toContain('Swipe horizontally to view full member columns');
    });

    it('implements sticky identity column on left (sm:) and sticky action column on right with tablet-safe (md:) gating', async () => {
      await act(async () => {
        root.render(
          <MemoryRouter>
            <AdminMemberManagement />
          </MemoryRouter>
        );
      });

      const table = container.querySelector('table');
      const thList = table.querySelectorAll('thead th');
      expect(thList.length).toBe(6);

      // Identity column: Member (active from sm: 640px)
      const memberHeader = thList[0];
      expect(memberHeader.textContent).toBe('Member');
      expect(memberHeader.className).toContain('w-[220px]');
      expect(memberHeader.className).toContain('sm:sticky');
      expect(memberHeader.className).toContain('sm:left-0');
      expect(memberHeader.className).toContain('z-20');

      // Action column: Actions (gated to md: 768px to prevent tablet keyhole effect)
      const actionsHeader = thList[5];
      expect(actionsHeader.textContent).toBe('Actions');
      expect(actionsHeader.className).toContain('w-[140px]');
      expect(actionsHeader.className).toContain('md:sticky');
      expect(actionsHeader.className).toContain('md:right-0');
      expect(actionsHeader.className).toContain('z-20');

      // Body row cells
      const row = table.querySelector('tbody tr');
      const cells = row.querySelectorAll('td');

      const memberCell = cells[0];
      expect(memberCell.className).toContain('sm:sticky');
      expect(memberCell.className).toContain('sm:left-0');
      expect(memberCell.className).toContain('z-10');
      expect(memberCell.className).toContain('bg-white');

      const actionsCell = cells[5];
      expect(actionsCell.className).toContain('md:sticky');
      expect(actionsCell.className).toContain('md:right-0');
      expect(actionsCell.className).toContain('z-10');
      expect(actionsCell.className).toContain('bg-white');

      // Action buttons usable
      const detailsBtn = actionsCell.querySelector('button');
      expect(detailsBtn.textContent.trim()).toBe('Details');
    });
  });

  describe('2. Audit Logs Table (AdminAuditLogs)', () => {
    beforeEach(() => {
      vi.spyOn(adminService, 'getAdminAuditLogs').mockResolvedValue({
        items: [
          {
            id: 501,
            adminId: '99',
            action: 'MEMBER_BAN',
            targetType: 'Member',
            targetId: '101',
            ipAddress: '192.168.1.1',
            traceId: 'tr_test_trace_123',
            createdAt: '2025-01-01T12:00:00Z',
          },
        ],
        totalCount: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1,
      });
    });

    it('enforces min-w-[970px], accessible scroll wrapper, sticky timestamp on sm+, and sticky inspection on md+', async () => {
      await act(async () => {
        root.render(
          <MemoryRouter>
            <AdminAuditLogs />
          </MemoryRouter>
        );
      });

      // Accessible scroll wrapper
      const scrollRegion = container.querySelector('[role="region"][aria-label="Platform audit trail table"]');
      expect(scrollRegion).not.toBeNull();
      expect(scrollRegion.getAttribute('tabindex')).toBe('0');
      expect(scrollRegion.className).toContain('overflow-x-auto');

      // Table minimum width
      const table = scrollRegion.querySelector('table');
      expect(table).not.toBeNull();
      expect(table.className).toContain('min-w-[970px]');
      expect(table.className).toContain('table-fixed');

      // Mobile/tablet scroll cue (visible up to 767px)
      const mobileCue = container.querySelector('.md\\:hidden');
      expect(mobileCue).not.toBeNull();
      expect(mobileCue.textContent).toContain('Swipe horizontally to view full audit trail');

      // Sticky columns
      const thList = table.querySelectorAll('thead th');
      const timestampTh = thList[0];
      expect(timestampTh.textContent).toBe('Timestamp');
      expect(timestampTh.className).toContain('sm:sticky');
      expect(timestampTh.className).toContain('sm:left-0');
      expect(timestampTh.className).toContain('z-20');

      const inspectTh = thList[7];
      expect(inspectTh.textContent).toBe('Inspection');
      expect(inspectTh.className).toContain('md:sticky');
      expect(inspectTh.className).toContain('md:right-0');
      expect(inspectTh.className).toContain('z-20');

      // Body cells
      const row = table.querySelector('tbody tr');
      const cells = row.querySelectorAll('td');
      expect(cells[0].className).toContain('sm:sticky');
      expect(cells[0].className).toContain('sm:left-0');
      expect(cells[7].className).toContain('md:sticky');
      expect(cells[7].className).toContain('md:right-0');
    });
  });

  describe('3. Category Management Table (AdminCategoryManagement)', () => {
    beforeEach(() => {
      vi.spyOn(adminService, 'getAdminCategories').mockResolvedValue({
        items: [
          {
            id: 1,
            name: 'Vegan Desserts',
            slug: 'vegan-desserts',
            type: 'Dish Category',
            postsCount: 5,
          },
        ],
      });
    });

    it('enforces min-w-[680px], accessible scroll wrapper, sticky category on sm+, and sticky actions on md+', async () => {
      await act(async () => {
        root.render(
          <MemoryRouter>
            <AdminCategoryManagement />
          </MemoryRouter>
        );
      });

      // Accessible scroll wrapper
      const scrollRegion = container.querySelector('[role="region"][aria-label="Taxonomy categories table"]');
      expect(scrollRegion).not.toBeNull();
      expect(scrollRegion.getAttribute('tabindex')).toBe('0');
      expect(scrollRegion.className).toContain('overflow-x-auto');

      // Table min width
      const table = scrollRegion.querySelector('table');
      expect(table).not.toBeNull();
      expect(table.className).toContain('min-w-[680px]');

      // Tablet scroll cue
      const mobileCue = container.querySelector('.md\\:hidden');
      expect(mobileCue).not.toBeNull();
      expect(mobileCue.textContent).toContain('Swipe horizontally to view full categories');

      // Sticky columns
      const thList = table.querySelectorAll('thead th');
      expect(thList[0].textContent).toBe('Category');
      expect(thList[0].className).toContain('sm:sticky');
      expect(thList[0].className).toContain('sm:left-0');

      expect(thList[3].textContent).toBe('Actions');
      expect(thList[3].className).toContain('md:sticky');
      expect(thList[3].className).toContain('md:right-0');

      // Body cells
      const row = table.querySelector('tbody tr');
      const cells = row.querySelectorAll('td');
      expect(cells[0].className).toContain('sm:sticky');
      expect(cells[0].className).toContain('sm:left-0');
      expect(cells[3].className).toContain('md:sticky');
      expect(cells[3].className).toContain('md:right-0');
    });
  });

  describe('4. Dashboard Recent Activity Table (AdminDashboard)', () => {
    beforeEach(() => {
      vi.spyOn(adminService, 'getAdminDashboardOverview').mockResolvedValue({
        members: { total: 1250, newInPeriod: 42, growthPercentage: 5 },
        posts: { totalPublished: 560, createdInPeriod: 38 },
        moderation: { totalPending: 9, aiFlaggedPosts: 4, reportedPosts: 3, reportedComments: 2 },
      });

      vi.spyOn(adminService, 'getAdminDashboardActivity').mockResolvedValue([]);
      vi.spyOn(adminService, 'getAdminDashboardCategories').mockResolvedValue([]);

      vi.spyOn(adminService, 'getAdminAuditLogs').mockResolvedValue({
        items: [
          {
            id: 1,
            adminId: '1',
            action: 'LOGIN',
            createdAt: '2025-01-01T10:00:00Z',
            targetType: 'Auth',
          },
        ],
        totalCount: 1,
      });
    });

    it('enforces min-w-[560px], scroll wrapper, and sticky name column', async () => {
      await act(async () => {
        root.render(
          <MemoryRouter>
            <AdminDashboard />
          </MemoryRouter>
        );
      });

      const scrollRegion = container.querySelector('[role="region"][aria-label="Recent activity table"]');
      expect(scrollRegion).not.toBeNull();
      expect(scrollRegion.className).toContain('overflow-x-auto');

      const table = scrollRegion.querySelector('table');
      expect(table).not.toBeNull();
      expect(table.className).toContain('min-w-[560px]');

      const thName = table.querySelector('thead th');
      expect(thName.textContent).toBe('Name');
      expect(thName.className).toContain('sm:sticky');
      expect(thName.className).toContain('sm:left-0');
    });
  });
});
