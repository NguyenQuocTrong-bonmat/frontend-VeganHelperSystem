import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import CommentReportModal from './CommentReportModal';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let root, host;
beforeEach(() => { host = document.createElement('div'); document.body.append(host); root = createRoot(host); });
afterEach(() => { act(() => root.unmount()); host.remove(); });
it('focuses the reason, prevents blank reports, and submits a trimmed reason', async () => {
  const submit = vi.fn();
  await act(async () => root.render(<CommentReportModal open busy={false} onClose={vi.fn()} onSubmit={submit} />));
  const input = document.querySelector('#comment-report-reason');
  expect(document.activeElement).toBe(input);
  expect(document.querySelector('button:not([type])').disabled).toBe(true);
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(input, '  Harassment  ');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await act(async () => input.closest('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
  expect(submit).toHaveBeenCalledWith('Harassment');
});
it('keeps a pending report modal open when Escape is pressed', async () => {
  const close = vi.fn();
  await act(async () => root.render(<CommentReportModal open busy onClose={close} onSubmit={vi.fn()} />));
  await act(async () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
  expect(close).not.toHaveBeenCalled();
});
