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

test('keyword comments use the existing queue and return to the last valid page after review', async () => {
  let reviewed = false;
  const keyword = { id: 1001, commentId: 2001, postId: 44, postTitle: 'Keyword review post',
    commentContent: 'Filtered content', reporterName: 'Keyword filter', reporterId: null,
    reason: 'Keyword filter matched a term.', reportCount: 1, createdAt: '2026-10-31T00:00:00Z' };
  const earlier = { ...keyword, id: 1000, commentId: 2000, postTitle: 'Earlier pending comment' };
  service.getAdminCommentReports.mockImplementation(async ({ pageIndex }) => ({
    items: pageIndex === 2 ? reviewed ? [] : [keyword] : [earlier],
    totalCount: reviewed ? 10 : 11, totalPages: reviewed ? 1 : 2,
  }));
  service.getAdminCommentReportDetail.mockImplementation(async (id) => id === keyword.id ? keyword : earlier);
  service.decideCommentReport.mockImplementation(async () => { reviewed = true; return { ...keyword, status: 'dismissed' }; });
  await act(async () => root.render(<AdminContentManagement />));
  await act(async () => [...container.querySelectorAll('button')].find(button => button.textContent.includes('Reported comments')).click());
  expect(service.getAdminCommentReports).toHaveBeenCalledWith({ pageIndex: 1, pageSize: 10, status: 'pending' });
  await act(async () => [...container.querySelectorAll('button')].find(button => button.textContent === 'Next').click());
  expect(service.getAdminCommentReports).toHaveBeenLastCalledWith({ pageIndex: 2, pageSize: 10, status: 'pending' });
  expect(container.textContent).toContain('Keyword filter');
  await act(async () => container.querySelector('input[value="keep"]').click());
  await act(async () => {
    const input = container.querySelector('textarea');
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(input, 'Reviewed by admin');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await act(async () => container.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  expect(service.decideCommentReport).toHaveBeenCalledWith(keyword.id, { action: 'keep', reason: 'Reviewed by admin' });
  expect(service.getAdminCommentReports).toHaveBeenLastCalledWith({ pageIndex: 1, pageSize: 10, status: 'pending' });
  expect(container.textContent).toContain('Earlier pending comment');
});
