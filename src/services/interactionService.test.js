import { beforeEach, describe, expect, it, vi } from 'vitest';
import axiosInstance from '../lib/axios';
import {
  COMMENT_DELETE_REASON_MAX_LENGTH,
  deleteComment,
} from './interactionService';

vi.mock('../lib/axios', () => ({
  default: {
    delete: vi.fn(),
  },
}));

describe('deleteComment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    axiosInstance.delete.mockResolvedValue({ status: 204 });
  });

  it('trims the administrator reason and sends it as the DELETE body', async () => {
    await deleteComment(12, 34, '  Community guideline violation  ');

    expect(axiosInstance.delete).toHaveBeenCalledWith('/posts/12/comments/34', {
      data: { reason: 'Community guideline violation' },
    });
  });

  it('accepts a deletion reason at the 500-character limit', async () => {
    const reason = 'x'.repeat(COMMENT_DELETE_REASON_MAX_LENGTH);

    await deleteComment(12, 34, reason);

    expect(axiosInstance.delete).toHaveBeenCalledWith('/posts/12/comments/34', {
      data: { reason },
    });
  });

  it('rejects reasons longer than the backend limit without making a request', async () => {
    await expect(deleteComment(12, 34, 'x'.repeat(COMMENT_DELETE_REASON_MAX_LENGTH + 1)))
      .rejects.toMatchObject({
        status: 400,
        message: `Deletion reason must not exceed ${COMMENT_DELETE_REASON_MAX_LENGTH} characters.`,
      });

    expect(axiosInstance.delete).not.toHaveBeenCalled();
  });

  it('sends no body when a deletion reason is not supplied', async () => {
    await deleteComment(12, 34);

    expect(axiosInstance.delete).toHaveBeenCalledWith('/posts/12/comments/34', {});
  });
});
