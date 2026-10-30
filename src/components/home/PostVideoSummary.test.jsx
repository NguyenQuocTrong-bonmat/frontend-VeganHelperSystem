import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PostVideoSummary from './PostVideoSummary';
import { getPostSummary, requestPostSummary } from '../../services/postSummaryService';

vi.mock('../../services/postSummaryService', () => ({
  getPostSummary: vi.fn(), requestPostSummary: vi.fn(),
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('Video summary disclosure and request lifecycle', () => {
  let container;
  let root;
  const completed = { status: 'completed', summary: 'Steam the mushrooms.', transcript: 'Recipe audio.' };
  const buttons = () => [...container.querySelectorAll('button')];
  const click = async (label) => {
    const button = buttons().find((item) => item.textContent === label);
    expect(button).toBeTruthy();
    await act(async () => button.click());
  };
  const render = async (props = {}) => {
    await act(async () => root.render(<PostVideoSummary postId={1} {...props} />));
  };

  beforeEach(() => {
    vi.resetAllMocks();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.useRealTimers();
  });

  it('does not fetch on mount and lets guests reveal an existing summary without generating', async () => {
    const onAuthRequired = vi.fn();
    getPostSummary.mockResolvedValue(completed);
    await render({ isGuest: true, onAuthRequired });
    expect(getPostSummary).not.toHaveBeenCalled();
    await click('View video summary');
    expect(container.textContent).toContain(completed.summary);
    expect(requestPostSummary).not.toHaveBeenCalled();
    expect(onAuthRequired).not.toHaveBeenCalled();
    await click('Hide summary');
    expect(container.querySelector('[aria-busy]').hidden).toBe(true);
    await click('View video summary');
    expect(getPostSummary).toHaveBeenCalledTimes(1);
  });

  it('checks GET before requesting generation for a member', async () => {
    getPostSummary.mockResolvedValue({ status: 'not_requested' });
    requestPostSummary.mockResolvedValue({ status: 'pending' });
    await render();
    await click('View video summary');
    expect(getPostSummary).toHaveBeenCalledTimes(1);
    expect(requestPostSummary).toHaveBeenCalledTimes(1);
    expect(getPostSummary.mock.invocationCallOrder[0]).toBeLessThan(requestPostSummary.mock.invocationCallOrder[0]);
    expect(container.textContent).toContain('Waiting to process');
  });

  it('requires login for a guest when no cached summary exists', async () => {
    const onAuthRequired = vi.fn();
    getPostSummary.mockResolvedValue({ status: 'not_requested' });
    await render({ isGuest: true, onAuthRequired });
    await click('View video summary');
    expect(onAuthRequired).toHaveBeenCalledTimes(1);
    expect(requestPostSummary).not.toHaveBeenCalled();
  });

  it('requires explicit retry for stale content and rechecks the cache before generating', async () => {
    getPostSummary.mockResolvedValueOnce({ status: 'stale' }).mockResolvedValueOnce(completed);
    await render();
    await click('View video summary');
    expect(requestPostSummary).not.toHaveBeenCalled();
    await click('Update summary');
    expect(getPostSummary).toHaveBeenCalledTimes(2);
    expect(requestPostSummary).not.toHaveBeenCalled();
    expect(container.textContent).toContain(completed.summary);
  });

  it('stops polling when collapsed and resumes on reopening', async () => {
    vi.useFakeTimers();
    getPostSummary.mockResolvedValue({ status: 'processing' });
    await render();
    await click('View video summary');
    await act(async () => { await vi.advanceTimersByTimeAsync(4000); });
    expect(getPostSummary).toHaveBeenCalledTimes(2);
    await click('Hide summary');
    await act(async () => { await vi.advanceTimersByTimeAsync(12000); });
    expect(getPostSummary).toHaveBeenCalledTimes(2);
    await click('View video summary');
    expect(getPostSummary).toHaveBeenCalledTimes(3);
    getPostSummary.mockResolvedValue(completed);
    await act(async () => { await vi.advanceTimersByTimeAsync(4000); });
    expect(container.textContent).toContain(completed.summary);
    await act(async () => { await vi.advanceTimersByTimeAsync(8000); });
    expect(getPostSummary).toHaveBeenCalledTimes(4);
  });

  it('cancels the old post request and ignores its response after navigation', async () => {
    let resolveOld;
    getPostSummary.mockImplementationOnce(() => new Promise((resolve) => { resolveOld = resolve; }));
    await render();
    await click('View video summary');
    const signal = getPostSummary.mock.calls[0][1].signal;
    await render({ postId: 2 });
    expect(signal.aborted).toBe(true);
    await act(async () => resolveOld(completed));
    expect(requestPostSummary).not.toHaveBeenCalled();
    expect(container.textContent).not.toContain(completed.summary);
    expect(buttons()[0].getAttribute('aria-expanded')).toBe('false');
  });
});
