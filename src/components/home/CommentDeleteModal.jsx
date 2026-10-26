import React, { useState, useEffect, useRef } from 'react';
import { COMMENT_DELETE_REASON_MAX_LENGTH } from '../../services/interactionService';

function getCommentDeletionImpact(comment) {
  const parentCommentId = comment?.parentCommentId ?? comment?.ParentCommentId ?? null;
  const replies = comment?.replies ?? comment?.Replies;
  const hasReplies = Array.isArray(replies) && replies.length > 0;

  if (parentCommentId == null && hasReplies) {
    return 'Deleting this top-level comment hides the text of its entire reply thread. Deleted comments remain as placeholders to preserve the conversation.';
  }

  if (hasReplies) {
    return 'Only this reply will be marked deleted. Its replies will remain visible, with this reply shown as a deleted placeholder.';
  }

  return 'This comment will be marked deleted and shown as a placeholder.';
}

export default function CommentDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  comment,
  currentUser,
  post,
  isSubmitting = false,
  submitError = null,
}) {
  const [reason, setReason] = useState('');
  const [validationError, setValidationError] = useState('');
  const [touched, setTouched] = useState(false);
  const textareaRef = useRef(null);

  const currentUserId = currentUser?.id != null ? String(currentUser.id) : null;
  const commentAuthorId = (comment?.userId ?? comment?.UserId) != null
    ? String(comment.userId ?? comment.UserId)
    : null;

  const isOwnComment = Boolean(
    currentUserId != null &&
    commentAuthorId != null &&
    currentUserId === commentAuthorId
  );

  const role = String(currentUser?.role || currentUser?.roleName || '').toLowerCase();
  const isAdmin = role === 'admin';

  const postAuthorId = (post?.authorId ?? post?.author?.id) != null
    ? String(post.authorId ?? post.author.id)
    : null;
  const isPostAuthor = Boolean(
    !isOwnComment &&
    currentUserId != null &&
    postAuthorId != null &&
    currentUserId === postAuthorId
  );

  // When admin deletes another user's comment, reason is strictly required.
  const isReasonRequired = isAdmin && !isOwnComment;

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setValidationError('');
      setTouched(false);
    }
  }, [isOpen, comment?.id]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  useEffect(() => {
    if (isOpen && isReasonRequired) {
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isReasonRequired]);

  if (!isOpen || !comment) return null;

  const handleReasonChange = (value) => {
    setReason(value);
    const trimmed = value.trim();
    if (value.length > 0 && !trimmed) {
      setValidationError('A deletion reason is required when an administrator removes another user\'s comment.');
    } else if (trimmed.length > COMMENT_DELETE_REASON_MAX_LENGTH) {
      setValidationError(`Deletion reason must not exceed ${COMMENT_DELETE_REASON_MAX_LENGTH} characters.`);
    } else if (touched && !trimmed) {
      setValidationError('A deletion reason is required when an administrator removes another user\'s comment.');
    } else {
      setValidationError('');
    }
  };

  const handleBlur = (e) => {
    setTouched(true);
    const trimmed = (e.target.value || '').trim();
    if (!trimmed) {
      setValidationError('A deletion reason is required when an administrator removes another user\'s comment.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (isReasonRequired) {
      const trimmed = reason.trim();
      setTouched(true);
      if (!trimmed) {
        setValidationError('A deletion reason is required when an administrator removes another user\'s comment.');
        textareaRef.current?.focus();
        return;
      }
      if (trimmed.length > COMMENT_DELETE_REASON_MAX_LENGTH) {
        setValidationError(`Deletion reason must not exceed ${COMMENT_DELETE_REASON_MAX_LENGTH} characters.`);
        textareaRef.current?.focus();
        return;
      }
      setValidationError('');
      onConfirm(trimmed);
    } else {
      onConfirm(null);
    }
  };

  const title = isReasonRequired
    ? 'Delete Comment as Administrator'
    : isPostAuthor
      ? 'Delete Comment as Post Author'
      : 'Delete Comment';

  const authorDisplayName = comment.authorName || (isOwnComment ? 'You' : 'Commenter');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="comment-delete-modal-title"
    >
      <div className="bg-white border border-[#DCE3D5] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-[#2B2A25]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#DCE3D5] pb-4 mb-4">
          <div>
            <h3 id="comment-delete-modal-title" className="font-fraunces font-medium text-xl text-[#2B2A25]">
              {title}
            </h3>
            <p className="text-xs text-[#6B6F63] mt-0.5">
              Author: <span className="font-semibold text-[#2B2A25]">{authorDisplayName}</span>
              {comment.id != null && ` • Comment #${comment.id}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs font-semibold text-[#6B6F63] hover:text-[#2B2A25] px-2 py-1 rounded transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none cursor-pointer"
            aria-label="Close delete dialog"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Comment Context */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#6B6F63] uppercase tracking-wider">
              Comment content
            </label>
            <div className="rounded-xl border border-[#DCE3D5] bg-[#FDFBF6] p-3 text-sm text-[#2B2A25] whitespace-pre-wrap break-words max-h-36 overflow-y-auto">
              “{comment.content || 'No text content.'}”
            </div>
            <p className="text-xs text-[#6B6F63] leading-relaxed">
              {getCommentDeletionImpact(comment)}
            </p>
          </div>

          {/* Conditional Reason Textarea (Case B) */}
          {isReasonRequired ? (
            <div className="space-y-1.5 pt-1">
              <label htmlFor="comment-delete-reason" className="block text-xs font-semibold text-[#2B2A25]">
                Reason for removal <span className="text-[#A63446]" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <textarea
                ref={textareaRef}
                id="comment-delete-reason"
                data-testid="comment-delete-reason"
                value={reason}
                onChange={(e) => handleReasonChange(e.target.value)}
                onBlur={handleBlur}
                maxLength={COMMENT_DELETE_REASON_MAX_LENGTH}
                rows={3}
                placeholder="Explain why this comment is being removed..."
                className="w-full rounded-xl border border-[#DCE3D5] bg-[#FDFBF6] p-3 text-sm text-[#2B2A25] placeholder:text-[#6B6F63]/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:border-[#2F5233] transition-colors resize-y disabled:opacity-60"
                disabled={isSubmitting}
                aria-required="true"
                aria-invalid={Boolean(validationError)}
                aria-describedby={validationError ? 'comment-delete-reason-error' : 'comment-delete-reason-help'}
              />
              <div className="flex items-center justify-between text-xs">
                {validationError ? (
                  <span id="comment-delete-reason-error" role="alert" className="text-[#A63446] font-medium">
                    {validationError}
                  </span>
                ) : (
                  <span id="comment-delete-reason-help" className="text-[#6B6F63]">
                    The author will receive a notification with this reason.
                  </span>
                )}
                <span className="text-[#6B6F63]">
                  {reason.length}/{COMMENT_DELETE_REASON_MAX_LENGTH}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#6B6F63]">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
          )}

          {/* Error Message if API failed */}
          {submitError && (
            <div role="alert" className="rounded-xl border border-[#F4C2BC] bg-[#FDF2F2] p-3 text-xs text-[#8B2B3A]">
              {submitError}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#DCE3D5]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-[#DCE3D5] text-[#6B6F63] hover:text-[#2B2A25] hover:bg-[#F3F6EE] rounded-lg text-sm font-medium transition-all disabled:opacity-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="confirm-delete-button"
              disabled={isSubmitting || (isReasonRequired && (!reason.trim() || reason.trim().length > COMMENT_DELETE_REASON_MAX_LENGTH))}
              className="px-5 py-2 bg-[#A63446] hover:bg-[#8A2B3A] text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A63446] focus-visible:ring-offset-2 active:scale-95 motion-reduce:transform-none"
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
