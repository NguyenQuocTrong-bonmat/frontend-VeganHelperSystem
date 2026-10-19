import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import CommentModal from './CommentModal';
import * as interactionService from '../../services/interactionService';

vi.mock('../../services/interactionService', () => ({
  getComments: vi.fn(),
  createComment: vi.fn(),
  updateComment: vi.fn(),
  deleteComment: vi.fn(),
  reportComment: vi.fn(),
}));

describe('CommentModal', () => {
  let container, root;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    document.body.style.overflow = '';
  });

  const mockPost = {
    id: 101,
    title: 'Crispy Vegan Spring Rolls',
    authorName: 'Chef Linh',
    authorId: 5,
    createdAt: '2026-10-15T10:00:00Z',
  };

  const mockComments = [
    {
      id: 1,
      postId: 101,
      userId: 10,
      authorName: 'An Nguyen',
      content: 'This recipe looks delicious!',
      createdAt: '2026-10-15T11:00:00Z',
      replies: [],
    },
  ];

  it('renders accessible dialog with aria-modal and loads comments', async () => {
    interactionService.getComments.mockResolvedValueOnce(mockComments);

    await act(async () => {
      root.render(
        <CommentModal
          isOpen={true}
          onClose={() => {}}
          post={mockPost}
          isGuest={false}
        />
      );
    });

    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(document.body.style.overflow).toBe('hidden');
    expect(dialog.textContent).toContain('Crispy Vegan Spring Rolls');
    expect(dialog.textContent).toContain('An Nguyen');
    expect(dialog.textContent).toContain('This recipe looks delicious!');
  });

  it('allows member to submit comment and refreshes comment list', async () => {
    interactionService.getComments.mockResolvedValueOnce([]);
    interactionService.createComment.mockResolvedValueOnce({
      id: 2,
      postId: 101,
      content: 'Looks tasty!',
      status: 'published',
    });
    interactionService.getComments.mockResolvedValueOnce([
      {
        id: 2,
        postId: 101,
        authorName: 'You',
        content: 'Looks tasty!',
        createdAt: '2026-10-15T12:00:00Z',
        isMine: true,
      },
    ]);

    await act(async () => {
      root.render(
        <CommentModal
          isOpen={true}
          onClose={() => {}}
          post={mockPost}
          isGuest={false}
        />
      );
    });

    const textarea = document.querySelector('textarea');
    expect(textarea).not.toBeNull();

    await act(async () => {
      // Simulate input event
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      ).set;
      nativeInputValueSetter.call(textarea, 'Looks tasty!');
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const submitBtn = Array.from(document.querySelectorAll('button')).find(
      (b) => b.textContent && b.textContent.includes('Post Comment')
    );
    expect(submitBtn).toBeDefined();

    await act(async () => {
      submitBtn.click();
    });

    expect(interactionService.createComment).toHaveBeenCalledWith(101, {
      content: 'Looks tasty!',
      parentCommentId: null,
    });
  });

  it('closes on Escape key and triggers onClose', async () => {
    interactionService.getComments.mockResolvedValueOnce([]);
    const handleClose = vi.fn();

    await act(async () => {
      root.render(
        <CommentModal
          isOpen={true}
          onClose={handleClose}
          post={mockPost}
          isGuest={false}
        />
      );
    });

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('guest sees Log In prompt instead of comment composer', async () => {
    interactionService.getComments.mockResolvedValueOnce([]);
    const handleAuthRequired = vi.fn();

    await act(async () => {
      root.render(
        <CommentModal
          isOpen={true}
          onClose={() => {}}
          post={mockPost}
          isGuest={true}
          onAuthRequired={handleAuthRequired}
        />
      );
    });

    expect(document.body.textContent).toContain('Join the discussion');
    expect(document.querySelector('textarea')).toBeNull();

    const loginBtn = Array.from(document.querySelectorAll('button')).find(
      (b) => b.textContent === 'Log In'
    );
    expect(loginBtn).toBeDefined();

    await act(async () => {
      loginBtn.click();
    });

    expect(handleAuthRequired).toHaveBeenCalledTimes(1);
  });
});
