import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import CommentDeleteModal from './CommentDeleteModal';

describe('CommentDeleteModal', () => {
  let container;
  let root;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    document.body.innerHTML = '';
  });

  const adminUser = { id: 1, role: 'admin', displayName: 'Admin User' };
  const regularUser = { id: 2, role: 'member', displayName: 'Regular User' };
  const postAuthorUser = { id: 3, role: 'member', displayName: 'Recipe Author' };

  const testPost = { id: 100, authorId: 3, title: 'Vegan Pho' };

  it('Case A: Admin deleting own comment does NOT show reason textarea', async () => {
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();

    const ownComment = {
      id: 50,
      userId: 1,
      authorName: 'Admin User',
      content: 'This is my admin comment.',
    };

    await act(async () => {
      root.render(
        <CommentDeleteModal
          isOpen={true}
          onClose={handleClose}
          onConfirm={handleConfirm}
          comment={ownComment}
          currentUser={adminUser}
          post={testPost}
        />
      );
    });

    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.textContent).toContain('Delete Comment');
    expect(dialog.textContent).toContain('This is my admin comment.');

    // Crucial: no reason textarea
    const textarea = document.querySelector('textarea');
    expect(textarea).toBeNull();
    expect(document.querySelector('[data-testid="comment-delete-reason"]')).toBeNull();

    // Delete button should be enabled immediately
    const deleteBtn = document.querySelector('[data-testid="confirm-delete-button"]');
    expect(deleteBtn).not.toBeNull();
    expect(deleteBtn.disabled).toBe(false);

    // Clicking delete submits with null reason
    await act(async () => {
      deleteBtn.click();
    });

    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleConfirm).toHaveBeenCalledWith(null);
  });

  it('Case B: Admin deleting another user\'s comment requires a non-empty reason', async () => {
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();

    const otherUserComment = {
      id: 55,
      userId: 2,
      authorName: 'Regular User',
      content: 'Offensive or spammy comment text.',
    };

    await act(async () => {
      root.render(
        <CommentDeleteModal
          isOpen={true}
          onClose={handleClose}
          onConfirm={handleConfirm}
          comment={otherUserComment}
          currentUser={adminUser}
          post={testPost}
        />
      );
    });

    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog.textContent).toContain('Delete Comment as Administrator');
    expect(dialog.textContent).toContain('Regular User');
    expect(dialog.textContent).toContain('Offensive or spammy comment text.');

    // Reason textarea MUST be displayed
    const textarea = document.querySelector('textarea#comment-delete-reason');
    expect(textarea).not.toBeNull();
    expect(textarea.getAttribute('placeholder')).toBe('Explain why this comment is being removed...');
    expect(textarea.getAttribute('aria-required')).toBe('true');

    // Delete button must be disabled initially
    const deleteBtn = document.querySelector('[data-testid="confirm-delete-button"]');
    expect(deleteBtn.disabled).toBe(true);

    // Enter whitespace only -> must reject and stay disabled
    await act(async () => {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      ).set;
      nativeSetter.call(textarea, '     ');
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
      textarea.dispatchEvent(new Event('blur', { bubbles: true }));
    });

    expect(deleteBtn.disabled).toBe(true);
    const errorMsg = document.querySelector('#comment-delete-reason-error');
    expect(errorMsg).not.toBeNull();
    expect(errorMsg.textContent).toContain('A deletion reason is required');

    // Enter valid reason -> enables delete button and removes error
    await act(async () => {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      ).set;
      nativeSetter.call(textarea, '   Spam and unsolicited advertising   ');
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(deleteBtn.disabled).toBe(false);

    // Clicking delete sends the trimmed reason
    await act(async () => {
      deleteBtn.click();
    });

    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleConfirm).toHaveBeenCalledWith('Spam and unsolicited advertising');
  });

  it('prevents submission and disables Delete when isSubmitting is true', async () => {
    const handleConfirm = vi.fn();

    const otherUserComment = {
      id: 56,
      userId: 2,
      authorName: 'Regular User',
      content: 'Comment content',
    };

    await act(async () => {
      root.render(
        <CommentDeleteModal
          isOpen={true}
          onClose={() => {}}
          onConfirm={handleConfirm}
          comment={otherUserComment}
          currentUser={adminUser}
          post={testPost}
          isSubmitting={true}
        />
      );
    });

    const deleteBtn = document.querySelector('[data-testid="confirm-delete-button"]');
    expect(deleteBtn.disabled).toBe(true);
    expect(deleteBtn.textContent).toContain('Deleting...');

    const cancelBtn = Array.from(document.querySelectorAll('button')).find(
      (b) => b.textContent === 'Cancel'
    );
    expect(cancelBtn.disabled).toBe(true);

    const form = document.querySelector('form');
    await act(async () => {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    });

    expect(handleConfirm).not.toHaveBeenCalled();
  });

  it('displays API error safely and keeps entered reason intact on failure', async () => {
    const handleConfirm = vi.fn();

    const otherUserComment = {
      id: 57,
      userId: 2,
      authorName: 'Regular User',
      content: 'Comment content',
    };

    // First render with no error, user types reason
    await act(async () => {
      root.render(
        <CommentDeleteModal
          isOpen={true}
          onClose={() => {}}
          onConfirm={handleConfirm}
          comment={otherUserComment}
          currentUser={adminUser}
          post={testPost}
          isSubmitting={false}
          submitError={null}
        />
      );
    });

    const textarea = document.querySelector('textarea#comment-delete-reason');
    await act(async () => {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      ).set;
      nativeSetter.call(textarea, 'Harassment and hate speech');
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(textarea.value).toBe('Harassment and hate speech');

    // Simulate parent updating with error after failed submission
    await act(async () => {
      root.render(
        <CommentDeleteModal
          isOpen={true}
          onClose={() => {}}
          onConfirm={handleConfirm}
          comment={otherUserComment}
          currentUser={adminUser}
          post={testPost}
          isSubmitting={false}
          submitError={'Backend 500: Database connection timeout'}
        />
      );
    });

    // Error is displayed
    const errorBanner = document.querySelector('[role="alert"]');
    expect(errorBanner).not.toBeNull();
    expect(errorBanner.textContent).toContain('Backend 500: Database connection timeout');

    // Entered text is still preserved
    const currentTextarea = document.querySelector('textarea#comment-delete-reason');
    expect(currentTextarea.value).toBe('Harassment and hate speech');
  });

  it('preserves comment owner permissions (regular user deletes own comment without reason)', async () => {
    const handleConfirm = vi.fn();

    const ownComment = {
      id: 60,
      userId: 2,
      authorName: 'Regular User',
      content: 'I want to delete my own typo comment.',
    };

    await act(async () => {
      root.render(
        <CommentDeleteModal
          isOpen={true}
          onClose={() => {}}
          onConfirm={handleConfirm}
          comment={ownComment}
          currentUser={regularUser}
          post={testPost}
        />
      );
    });

    expect(document.querySelector('textarea')).toBeNull();
    const deleteBtn = document.querySelector('[data-testid="confirm-delete-button"]');
    expect(deleteBtn.disabled).toBe(false);

    await act(async () => {
      deleteBtn.click();
    });

    expect(handleConfirm).toHaveBeenCalledWith(null);
  });

  it.each(['member', 'admin'])('preserves post author permissions for role %s without a reason', async (role) => {
    const handleConfirm = vi.fn();

    const trollComment = {
      id: 70,
      userId: 99,
      authorName: 'Troll User',
      content: 'Mean comment on the recipe',
    };

    await act(async () => {
      root.render(
        <CommentDeleteModal
          isOpen={true}
          onClose={() => {}}
          onConfirm={handleConfirm}
          comment={trollComment}
          currentUser={{ ...postAuthorUser, role }}
          post={testPost}
        />
      );
    });

    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog.textContent).toContain('Delete Comment as Post Author');
    expect(document.querySelector('textarea')).toBeNull();

    const deleteBtn = document.querySelector('[data-testid="confirm-delete-button"]');
    expect(deleteBtn.disabled).toBe(false);

    await act(async () => {
      deleteBtn.click();
    });

    expect(handleConfirm).toHaveBeenCalledWith(null);
  });
});
