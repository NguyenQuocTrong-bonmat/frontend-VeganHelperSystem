import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import AdminAuditLogs, { auditCsv, formatAuditTime } from './AdminAuditLogs';
import { getAdminAuditLogs, getAdminAuditLogById } from '../../services/adminService';

vi.mock('../../components/admin/AdminLayout', () => ({ default: ({ children }) => <main>{children}</main> }));
vi.mock('../../services/adminService', () => ({ getAdminAuditLogs: vi.fn(), getAdminAuditLogById: vi.fn() }));
const entry = { id: 1, adminId: 100, adminName: 'Hoang Anh', adminUsername: 'hoanganh', action: 'post.approve',
  subjectType: 'post', subjectName: 'Pumpkin soup', ownerName: 'Linh Nguyen', ownerUsername: 'linh',
  targetId: '892', traceId: 'secret-trace', ipAddress: '127.0.0.1', createdAt: '2026-10-17T14:45:12Z' };
let container, root;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  getAdminAuditLogs.mockResolvedValue({ items: [entry], totalCount: 125, totalPages: 13 });
  getAdminAuditLogById.mockResolvedValue(entry);
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(async () => { await act(async () => root.unmount()); container.remove(); vi.resetAllMocks(); });
const render = async () => { await act(async () => root.render(<AdminAuditLogs />)); };
const click = async (label) => { const button = [...container.querySelectorAll('button')].find((el) => el.textContent === label); await act(async () => button.click()); };

describe('Readable admin activity', () => {
  it('shows names, meaningful activities and affected posts without technical metadata', async () => {
    await render();
    expect(container.textContent).toContain('Hoang Anh');
    expect(container.textContent).toContain('Pumpkin soup');
    expect(container.textContent).toContain('Linh Nguyen');
    expect(container.textContent).toContain('Approved a post');
    for (const text of ['post.approve', 'secret-trace', '127.0.0.1', 'Client IP', 'Trace ID']) expect(container.textContent).not.toContain(text);
  });
  it('loads real server pages beyond the former first 100 records', async () => {
    await render();
    expect(getAdminAuditLogs).toHaveBeenLastCalledWith({ pageIndex: 1, pageSize: 10, importantOnly: true }, expect.any(AbortSignal));
    expect(container.textContent).toContain('Page 1 of 13');
    await click('Next');
    expect(getAdminAuditLogs).toHaveBeenLastCalledWith({ pageIndex: 2, pageSize: 10, importantOnly: true }, expect.any(AbortSignal));
    expect(container.textContent).toContain('Page 2 of 13');
  });
  it('filters activity on the server and resets pagination', async () => {
    await render(); await click('Next');
    const select = container.querySelector('select');
    await act(async () => { select.value = 'member.ban'; select.dispatchEvent(new Event('change', { bubbles: true })); });
    expect(getAdminAuditLogs).toHaveBeenLastCalledWith({ pageIndex: 1, pageSize: 10, importantOnly: true, action: 'member.ban' }, expect.any(AbortSignal));
  });
  it('shows friendly details with truthful historical limitations', async () => {
    await render(); await click('View details');
    const modal = container.querySelector('[role="dialog"]');
    expect(modal.textContent).toContain('The post was approved for publication.');
    expect(modal.textContent).toContain('before-and-after values were not stored');
    expect(modal.textContent).not.toContain('Raw Event Payload');
    expect(modal.textContent).not.toContain('secret-trace');
    expect(document.activeElement.getAttribute('aria-label')).toBe('Close activity details');
    await click('Close');
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });
  it('does not reopen a closed dialog when a slow detail response arrives', async () => {
    let resolve;
    getAdminAuditLogById.mockReturnValue(new Promise((done) => { resolve = done; }));
    await render(); await click('View details'); await click('Close');
    await act(async () => resolve(entry));
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });
  it('allows retrying failed loads without invented activity', async () => {
    getAdminAuditLogs.mockRejectedValueOnce(new Error('Activity could not be loaded.'));
    await render();
    expect(container.querySelector('[role="alert"]').textContent).toContain('could not be loaded');
    expect(container.textContent).not.toContain('Pumpkin soup');
    await click('Try again');
    expect(container.textContent).toContain('Pumpkin soup');
  });
  it('does not fabricate a date or identity when a related record is unavailable', async () => {
    getAdminAuditLogs.mockResolvedValue({ items: [{ id: 9, action: 'category.delete' }], totalCount: 1 });
    await render();
    expect(container.textContent).toContain('Time not recorded');
    expect(container.textContent).toContain('Category information unavailable');
    expect(container.textContent).toContain('Administrator name unavailable');
    expect(formatAuditTime('invalid')).toBe('Time not recorded');
    expect(formatAuditTime(entry.createdAt)).toMatch(/2026.*\d{2}:\d{2}:\d{2}.*GMT/);
  });
  it('exports business details, escapes quotes and neutralizes spreadsheet formulas', () => {
    const csv = auditCsv([{ ...entry, subjectName: '=HYPERLINK("bad")' }]);
    expect(csv).toContain('Approved a post');
    expect(csv).toContain(`"'=HYPERLINK(""bad"")"`);
    expect(csv).not.toContain('secret-trace');
    expect(csv).not.toContain('127.0.0.1');
    expect(csv).not.toContain('post.approve');
  });
});
