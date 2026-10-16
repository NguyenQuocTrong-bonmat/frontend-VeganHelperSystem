import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import CommentModal from './CommentModal';
import * as interactionService from '../../services/interactionService';
import toast from 'react-hot-toast';

vi.mock('../../services/interactionService', () => ({
  getComments: vi.fn(),
  createComment: vi.fn(),
  updateComment: vi.fn(),
  deleteComment: vi.fn(),
  reportComment: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'user-101', role: 'Member', displayName: 'Member User' },
    isAuthenticated: true,
  })),
}));

import { useAuth } from '../../context/AuthContext';

describe('FN17-FE-02 — Comment & Reply UI Alignment', () => {
  let container, root;

  beforeEach(() => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vi.clearAllMocks();
    useAuth.mockReturnValue({
      user: { id: 'user-101', role: 'Member', displayName: 'Member User' },
      isAuthenticated: true,
    });
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    document.body.style.overflow = '';
  });

  const mockPost = {
    id: 'post-1',
    title: 'Vegan Tofu Scramble',
    authorName: 'Chef Linh',
    authorId: 'user-author-99',
    createdAt: '2026-10-15T10:00:00Z',
  };

  it('Case 1: renders a normal visible root comment', async () => {
    interactionService.getComments.mockResolvedValueOnce([
      {
        id: 'c-1',
        postId: 'post-1',
        userId: 'user-200',
        authorName: 'Sarah Vegan',
        content: 'This recipe is amazing and creamy!',
        createdAt: '2026-10-15T11:00:00Z',
        isDeleted: false,
        depth: 1,
        replies: [],
      },
    ]);

    await act(async () => {
      root.render(<CommentModal isOpen={true} onClose={() => {}} post={mockPost} />);
    });

    expect(container.textContent).toContain('Sarah Vegan');
    expect(container.textContent).toContain('This recipe is amazing and creamy!');
    expect(interactionService.getComments).toHaveBeenCalledWith('post-1', { maxDepth: 4 });
  });

  it('Case 2: renders a normal reply with ReplyToDisplayName', async () => {
    interactionService.getComments.mockResolvedValueOnce([
      {
        id: 'c-1',
        postId: 'post-1',
        userId: 'user-200',
        authorName: 'Sarah Vegan',
        content: 'Great tip!',
        createdAt: '2026-10-15T11:00:00Z',
        depth: 1,
        replies: [
          {
            id: 'c-2',
            postId: 'post-1',
            userId: 'user-300',
            authorName: 'David Cook',
            content: 'I added some kala namak for sulfur flavor.',
            replyToDisplayName: 'Sarah Vegan',
            isReplyToDeleted: false,
            createdAt: '2026-10-15T11:05:00Z',
            depth: 2,
            replies: [],
          },
        ],
      },
    ]);

    await act(async () => {
      root.render(<CommentModal isOpen={true} onClose={() => {}} post={mockPost} />);
    });

    expect(container.textContent).toContain('David Cook');
    expect(container.textContent).toContain('Replying to @Sarah Vegan');
    expect(container.textContent).toContain('I added some kala namak');
  });

  it('Case 3: renders a deleted root comment as a compact, muted tombstone without avatar or action buttons', async () => {
    interactionService.getComments.mockResolvedValueOnce([
      {
        id: 'c-del-1',
        postId: 'post-1',
        userId: 'user-200',
        authorName: 'Ghost User',
        content: 'This comment has been deleted.',
        isDeleted: true,
        depth: 1,
        replies: [],
      },
    ]);

    await act(async () => {
      root.render(<CommentModal isOpen={true} onClose={() => {}} post={mockPost} />);
    });

    const tombstone = container.querySelector('[data-testid="comment-tombstone-c-del-1"]');
    expect(tombstone).not.toBeNull();
    expect(tombstone.textContent).toContain('This comment has been deleted.');
    // Normal author name and avatar should NOT be in the tombstone
    expect(tombstone.textContent).not.toContain('Ghost User');
    expect(tombstone.querySelector('img')).toBeNull();
    // Edit, Delete, Report, Reply buttons should be hidden for deleted comment
    expect(tombstone.querySelector('button')).toBeNull();
  });

  it('Case 4: preserves surviving replies beneath a deleted child comment', async () => {
    interactionService.getComments.mockResolvedValueOnce([
      {
        id: 'c-1',
        postId: 'post-1',
        userId: 'user-101',
        authorName: 'Root Author',
        content: 'Root comment',
        isDeleted: false,
        depth: 1,
        replies: [
          {
            id: 'c-2-deleted',
            postId: 'post-1',
            userId: 'user-200',
            authorName: 'Deleted Parent',
            content: 'This comment has been deleted.',
            isDeleted: true,
            depth: 2,
            replies: [
              {
                id: 'c-3-surviving',
                postId: 'post-1',
                userId: 'user-300',
                authorName: 'Surviving Child',
                content: 'I am still here in the thread!',
                isReplyToDeleted: true,
                depth: 3,
                replies: [],
              },
            ],
          },
        ],
      },
    ]);

    await act(async () => {
      root.render(<CommentModal isOpen={true} onClose={() => {}} post={mockPost} />);
    });

    expect(container.querySelector('[data-testid="comment-tombstone-c-2-deleted"]')).not.toBeNull();
    expect(container.textContent).toContain('Surviving Child');
    expect(container.textContent).toContain('I am still here in the thread!');
    expect(container.textContent).toContain('Replying to a deleted comment');
  });

  it('Case 5: renders "Replying to a deleted comment" when isReplyToDeleted is true', async () => {
    interactionService.getComments.mockResolvedValueOnce([
      {
        id: 'c-1',
        postId: 'post-1',
        authorName: 'Active User',
        content: 'Replying to the former comment',
        isReplyToDeleted: true,
        depth: 2,
        replies: [],
      },
    ]);

    await act(async () => {
      root.render(<CommentModal isOpen={true} onClose={() => {}} post={mockPost} />);
    });

    expect(container.textContent).toContain('Replying to a deleted comment');
  });

  it('Case 6: does not expose a non-deleted comment with status="hidden" publicly', async () => {
    interactionService.getComments.mockResolvedValueOnce([
      {
        id: 'c-hidden-1',
        postId: 'post-1',
        authorName: 'Spammer',
        content: 'Buy discount pills now!',
        isDeleted: false,
        status: 'hidden',
        depth: 1,
        replies: [],
      },
      {
        id: 'c-visible-2',
        postId: 'post-1',
        authorName: 'Friendly Cook',
        content: 'Nice dinner!',
        isDeleted: false,
        status: 'visible',
        depth: 1,
        replies: [],
      },
    ]);

    await act(async () => {
      root.render(<CommentModal isOpen={true} onClose={() => {}} post={mockPost} />);
    });

    expect(container.textContent).not.toContain('Buy discount pills now!');
    expect(container.textContent).not.toContain('Spammer');
    expect(container.textContent).toContain('Friendly Cook');
    expect(container.textContent).toContain('Nice dinner!');
  });

  it('Case 7: supports 4-level nesting hierarchy without flattening', async () => {
    interactionService.getComments.mockResolvedValueOnce([
      {
        id: 'c-l1',
        authorName: 'Level 1 User',
        content: 'Level 1 Root',
        depth: 1,
        replies: [
          {
            id: 'c-l2',
            authorName: 'Level 2 User',
            content: 'Level 2 Reply',
            depth: 2,
            replies: [
              {
                id: 'c-l3',
                authorName: 'Level 3 User',
                content: 'Level 3 Nested',
                depth: 3,
                replies: [
                  {
                    id: 'c-l4',
                    authorName: 'Level 4 User',
                    content: 'Level 4 Deepest',
                    depth: 4,
                    replies: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);

    await act(async () => {
      root.render(<CommentModal isOpen={true} onClose={() => {}} post={mockPost} />);
    });

    expect(container.textContent).toContain('Level 1 Root');
    expect(container.textContent).toContain('Level 2 Reply');
    expect(container.textContent).toContain('Level 3 Nested');
    expect(container.textContent).toContain('Level 4 Deepest');
  });

  it('Case 8: restricts replies beyond fourth level with "Maximum reply depth reached"', async () => {
    interactionService.getComments.mockResolvedValueOnce([
      {
        id: 'c-l4',
        authorName: 'Deepest User',
        content: 'I am at depth 4',
        depth: 4,
        replies: [],
      },
    ]);

    await act(async () => {
      root.render(<CommentModal isOpen={true} onClose={() => {}} post={mockPost} />);
    });

    expect(container.textContent).toContain('Maximum reply depth reached');
    const buttons = Array.from(container.querySelectorAll('button'));
    const replyBtn = buttons.find((b) => b.textContent?.trim() === 'Reply');
    expect(replyBtn).toBeUndefined();
  });

  it('Case 9: guest users cannot create comments or replies and trigger onAuthRequired', async () => {
    interactionService.getComments.mockResolvedValueOnce([
      {
        id: 'c-1',
        authorName: 'Member A',
        content: 'Member comment',
        depth: 1,
        replies: [],
      },
    ]);

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

    const loginPrompt = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Log in to comment') || b.textContent?.includes('Log in to reply')
    );
    expect(loginPrompt).toBeDefined();

    await act(async () => {
      loginPrompt.click();
    });

    expect(handleAuthRequired).toHaveBeenCalled();
  });

  it('Case 10: validates empty, whitespace-only, and > 500 characters content', async () => {
    interactionService.getComments.mockResolvedValueOnce([]);

    await act(async () => {
      root.render(<CommentModal isOpen={true} onClose={() => {}} post={mockPost} isGuest={false} />);
    });

    const form = container.querySelector('form');
    const textarea = container.querySelector('textarea');

    // Test whitespace only
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      setter.call(textarea, '   \n   ');
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(interactionService.createComment).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Comment content is required.');

    // Test > 500 characters
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      setter.call(textarea, 'a'.repeat(501));
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(interactionService.createComment).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Comment must be between 1 and 500 characters.');
  });

  it('Case 11: preserves user input when createComment fails with server error', async () => {
    interactionService.getComments.mockResolvedValueOnce([]);
    interactionService.createComment.mockRejectedValueOnce(
      new Error('Comment rejected due to blocked keywords.')
    );

    await act(async () => {
      root.render(<CommentModal isOpen={true} onClose={() => {}} post={mockPost} isGuest={false} />);
    });

    const textarea = container.querySelector('textarea');
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      setter.call(textarea, 'Testing blocked keyword post');
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const submitBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Post Comment')
    );

    await act(async () => {
      submitBtn.click();
    });

    expect(toast.error).toHaveBeenCalledWith('Comment rejected due to blocked keywords.');
    // User typed content remains intact in the textarea
    expect(textarea.value).toBe('Testing blocked keyword post');
  });

  it('Case 12: handles moderation review response (status="hidden") truthfully', async () => {
    interactionService.getComments.mockResolvedValueOnce([]);
    interactionService.createComment.mockResolvedValueOnce({
      id: 'c-mod-1',
      status: 'hidden',
      content: 'Needs review',
    });
    interactionService.getComments.mockResolvedValueOnce([]);

    await act(async () => {
      root.render(<CommentModal isOpen={true} onClose={() => {}} post={mockPost} isGuest={false} />);
    });

    const textarea = container.querySelector('textarea');
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      setter.call(textarea, 'Needs review');
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const submitBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Post Comment')
    );

    await act(async () => {
      submitBtn.click();
    });

    expect(toast.success).toHaveBeenCalledWith('Your comment was submitted for moderation review.');
    // Did not append it to visible comments
    expect(container.textContent).not.toContain('Needs review');
  });

  it('Case 13: allows owner editing and displays (edited) tag on updated comments', async () => {
    interactionService.getComments.mockResolvedValueOnce([
      {
        id: 'c-edit-1',
        postId: 'post-1',
        userId: 'user-101',
        authorName: 'Member User',
        content: 'Original comment text',
        isMine: true,
        updatedAt: '2026-10-15T12:00:00Z',
        depth: 1,
        replies: [],
      },
    ]);

    await act(async () => {
      root.render(<CommentModal isOpen={true} onClose={() => {}} post={mockPost} isGuest={false} />);
    });

    expect(container.textContent).toContain('(edited)');
    const editBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Edit'
    );
    expect(editBtn).toBeDefined();

    interactionService.updateComment.mockResolvedValueOnce({
      id: 'c-edit-1',
      content: 'Updated comment text',
      status: 'visible',
    });
    interactionService.getComments.mockResolvedValueOnce([
      {
        id: 'c-edit-1',
        postId: 'post-1',
        userId: 'user-101',
        authorName: 'Member User',
        content: 'Updated comment text',
        isMine: true,
        updatedAt: '2026-10-15T12:30:00Z',
        depth: 1,
        replies: [],
      },
    ]);

    await act(async () => {
      editBtn.click();
    });

    const editTextarea = container.querySelector('textarea');
    expect(editTextarea.value).toBe('Original comment text');

    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      setter.call(editTextarea, 'Updated comment text');
      editTextarea.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const saveBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Save'
    );

    await act(async () => {
      saveBtn.click();
    });

    expect(interactionService.updateComment).toHaveBeenCalledWith('post-1', 'c-edit-1', 'Updated comment text');
    expect(toast.success).toHaveBeenCalledWith('Comment updated.');
  });

  it('Case 14: supports owner self-deletion after confirmation', async () => {
    interactionService.getComments.mockResolvedValueOnce([
      {
        id: 'c-del-owner',
        postId: 'post-1',
        userId: 'user-101',
        authorName: 'Member User',
        content: 'I want to delete this',
        isMine: true,
        depth: 1,
        replies: [],
      },
    ]);

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    await act(async () => {
      root.render(<CommentModal isOpen={true} onClose={() => {}} post={mockPost} isGuest={false} />);
    });

    const deleteBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Delete'
    );
    expect(deleteBtn).toBeDefined();

    interactionService.deleteComment.mockResolvedValueOnce();
    interactionService.getComments.mockResolvedValueOnce([
      {
        id: 'c-del-owner',
        postId: 'post-1',
        content: 'This comment has been deleted.',
        isDeleted: true,
        depth: 1,
        replies: [],
      },
    ]);

    await act(async () => {
      deleteBtn.click();
    });

    expect(window.confirm).toHaveBeenCalled();
    expect(interactionService.deleteComment).toHaveBeenCalledWith('post-1', 'c-del-owner');
    expect(toast.success).toHaveBeenCalledWith('Comment deleted.');
  });

  it('Case 15: supports Admin deletion requiring a non-empty reason', async () => {
    useAuth.mockReturnValue({
      user: { id: 'admin-999', role: 'Admin', displayName: 'System Admin' },
      isAuthenticated: true,
    });

    interactionService.getComments.mockResolvedValueOnce([
      {
        id: 'c-target-user',
        postId: 'post-1',
        userId: 'other-user-55',
        authorName: 'Other Person',
        content: 'Inappropriate remark',
        isMine: false,
        depth: 1,
        replies: [],
      },
    ]);

    vi.spyOn(window, 'prompt').mockReturnValue('Violates community standards');
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    await act(async () => {
      root.render(<CommentModal isOpen={true} onClose={() => {}} post={mockPost} isGuest={false} />);
    });

    const adminDeleteBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Delete (Admin)'
    );
    expect(adminDeleteBtn).toBeDefined();

    interactionService.deleteComment.mockResolvedValueOnce();
    interactionService.getComments.mockResolvedValueOnce([]);

    await act(async () => {
      adminDeleteBtn.click();
    });

    expect(window.prompt).toHaveBeenCalled();
    expect(interactionService.deleteComment).toHaveBeenCalledWith(
      'post-1',
      'c-target-user',
      'Violates community standards'
    );
    expect(toast.success).toHaveBeenCalledWith('Comment deleted by administrator.');
  });

  it('Case 16: prevents reporting user own comment and allows reporting other comments', async () => {
    interactionService.getComments.mockResolvedValueOnce([
      {
        id: 'c-mine',
        postId: 'post-1',
        userId: 'user-101',
        authorName: 'Me',
        content: 'My own comment',
        isMine: true,
        depth: 1,
        replies: [],
      },
      {
        id: 'c-theirs',
        postId: 'post-1',
        userId: 'user-200',
        authorName: 'Someone Else',
        content: 'Spam comment',
        isMine: false,
        depth: 1,
        replies: [],
      },
    ]);

    await act(async () => {
      root.render(<CommentModal isOpen={true} onClose={() => {}} post={mockPost} isGuest={false} />);
    });

    const reportButtons = Array.from(container.querySelectorAll('button')).filter(
      (b) => b.textContent?.trim() === 'Report'
    );
    // Only 1 report button should exist, for the non-owner comment
    expect(reportButtons).toHaveLength(1);

    vi.spyOn(window, 'prompt').mockReturnValue('Spam advertising');
    interactionService.reportComment.mockResolvedValueOnce({
      success: true,
      message: 'Report submitted for review.',
      commentHidden: false,
    });

    await act(async () => {
      reportButtons[0].click();
    });

    expect(interactionService.reportComment).toHaveBeenCalledWith('post-1', 'c-theirs', 'Spam advertising');
    expect(toast.success).toHaveBeenCalledWith('Report submitted for review.');
  });

  it('Case 17: gracefully handles 409 Conflict duplicate report', async () => {
    interactionService.getComments.mockResolvedValueOnce([
      {
        id: 'c-theirs',
        postId: 'post-1',
        userId: 'user-200',
        authorName: 'Someone Else',
        content: 'Reported comment',
        isMine: false,
        depth: 1,
        replies: [],
      },
    ]);

    await act(async () => {
      root.render(<CommentModal isOpen={true} onClose={() => {}} post={mockPost} isGuest={false} />);
    });

    const reportBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Report'
    );

    vi.spyOn(window, 'prompt').mockReturnValue('Repeated offensive behavior');
    const conflictError = new Error('You have already reported this comment.');
    conflictError.status = 409;
    interactionService.reportComment.mockRejectedValueOnce(conflictError);

    await act(async () => {
      reportBtn.click();
    });

    expect(toast.error).toHaveBeenCalledWith('You have already reported this comment.');
  });
});
