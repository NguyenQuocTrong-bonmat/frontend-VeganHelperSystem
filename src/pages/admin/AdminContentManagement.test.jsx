import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { beforeEach, afterEach, test, expect, vi } from 'vitest';
import AdminContentManagement from './AdminContentManagement';
import * as service from '../../services/adminService';

vi.mock('../../components/admin/AdminLayout', () => ({ default: ({ children }) => <main>{children}</main> }));
vi.mock('../../services/adminService', () => ({
  decideAiFlag: vi.fn(), decideCommentReport: vi.fn(), decidePostReport: vi.fn(),
  getAdminAiFlags: vi.fn(), getAdminCommentReportDetail: vi.fn(), getAdminCommentReports: vi.fn(),
  getAdminModerationPostDetail: vi.fn(), getAdminPostReportDetail: vi.fn(), getAdminPostReports: vi.fn(),
}));

let container, root;
const report = { id: 901, postId: 44, reason: 'Possible spam', createdAt: '2026-10-20T09:00:00Z' };
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  vi.clearAllMocks();
  service.getAdminAiFlags.mockResolvedValue({ items: [{ id: 201, postId: 33, title: 'AI detected content', reason: 'AI evidence' }], totalCount: 1 });
  service.getAdminPostReports.mockResolvedValue({ items: [report], totalCount: 1 });
  service.getAdminCommentReports.mockResolvedValue({ items: [], totalCount: 0 });
  service.getAdminModerationPostDetail.mockResolvedValue({ title: 'AI detected content', content: 'AI queue content', contentRevision: 2 });
  service.getAdminPostReportDetail.mockResolvedValue({ report, currentContent: { title: 'Community reported content', content: 'Still public pending Admin review', status: 'published', contentRevision: 3 } });
  service.decidePostReport.mockResolvedValue({ ...report, status: 'resolved' });
  container = document.createElement('div'); document.body.appendChild(container); root = createRoot(container);
});
afterEach(async () => { await act(async () => root.unmount()); container.remove(); });

test('reported posts use their own queue, evidence and Admin decision endpoint', async () => {
  await act(async () => root.render(<AdminContentManagement />));
  expect(container.textContent).toContain('AI detected content');
  expect(container.textContent).not.toContain('Possible spam');
  const reportsTab = [...container.querySelectorAll('button')].find(button => button.textContent.includes('Reported posts'));
  await act(async () => reportsTab.click());
  expect(container.textContent).toContain('Community reported content');
  expect(container.textContent).toContain('Community report');
  expect(container.textContent).not.toContain('AI detected content');
  expect(container.textContent).toContain('Reports do not automatically hide posts or notify their authors.');
  expect(service.getAdminPostReportDetail).toHaveBeenLastCalledWith(901);
  await act(async () => container.querySelector('input[value="remove"]').click());
  await act(async () => {
    const input = container.querySelector('textarea');
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(input, 'Spam confirmed by Admin');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await act(async () => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  expect(service.decidePostReport).toHaveBeenCalledWith(901, { action: 'remove', reason: 'Spam confirmed by Admin', expectedRevision: 3 });
  expect(service.decideAiFlag).not.toHaveBeenCalled();
});
