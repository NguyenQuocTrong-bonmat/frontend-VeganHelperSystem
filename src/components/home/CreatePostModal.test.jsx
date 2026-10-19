import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import CreatePostModal from './CreatePostModal';
import * as postService from '../../services/postService';

vi.mock('../../services/postService', () => ({
  createPost: vi.fn(),
  getCategories: vi.fn(),
}));

describe('CreatePostModal', () => {
  let container, root;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vi.clearAllMocks();

    postService.getCategories.mockResolvedValue([
      { id: 1, name: 'Soups & Stews' },
    ]);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    document.body.style.overflow = '';
  });

  it('renders accessible dialog with aria-modal and locks body scroll when open', async () => {
    await act(async () => {
      root.render(
        <BrowserRouter>
          <CreatePostModal isOpen={true} onClose={() => {}} />
        </BrowserRouter>
      );
    });

    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.textContent).toContain('Create Post');
  });

  it('closes cleanly on close button when form is clean without confirmation', async () => {
    const handleClose = vi.fn();
    const confirmSpy = vi.spyOn(window, 'confirm');

    await act(async () => {
      root.render(
        <BrowserRouter>
          <CreatePostModal isOpen={true} onClose={handleClose} />
        </BrowserRouter>
      );
    });

    const closeBtn = document.querySelector('button[aria-label="Close create post modal"]');
    expect(closeBtn).not.toBeNull();

    await act(async () => {
      closeBtn.click();
    });

    expect(confirmSpy).not.toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('prompts confirmation when dirty before closing, and aborts if user cancels', async () => {
    const handleClose = vi.fn();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    await act(async () => {
      root.render(
        <BrowserRouter>
          <CreatePostModal isOpen={true} onClose={handleClose} />
        </BrowserRouter>
      );
    });

    // Make form dirty by typing in title
    const titleInput = document.querySelector('#post-title-input');
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      setter.call(titleInput, 'Draft title');
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
      titleInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const closeBtn = document.querySelector('button[aria-label="Close create post modal"]');
    await act(async () => {
      closeBtn.click();
    });

    expect(confirmSpy).toHaveBeenCalledWith(
      expect.stringContaining('You have unsaved changes')
    );
    expect(handleClose).not.toHaveBeenCalled();
    expect(document.querySelector('#post-title-input').value).toBe('Draft title');
  });

  it('closes on Escape key when confirmed', async () => {
    const handleClose = vi.fn();
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    await act(async () => {
      root.render(
        <BrowserRouter>
          <CreatePostModal isOpen={true} onClose={handleClose} />
        </BrowserRouter>
      );
    });

    // Make form dirty
    const titleInput = document.querySelector('#post-title-input');
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      setter.call(titleInput, 'Draft title');
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
      titleInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
