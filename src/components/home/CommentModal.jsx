import React, { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  reportComment,
  COMMENT_DELETE_REASON_MAX_LENGTH,
} from '../../services/interactionService';
import { getImageUrl } from '../../utils/imageUtils';
import { formatDate, formatDateTime, getTimeAgo } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';
import CommentDeleteModal from './CommentDeleteModal';
import ModalMotion from '../ui/ModalMotion';

function asArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

function countComments(list = []) {
  let count = 0;
  for (const item of list) {
    count++;
    if (item.replies && item.replies.length > 0) {
      count += countComments(item.replies);
    }
  }
  return count;
}

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

/**
 * Accessible, responsive Facebook-style Comment Modal.
 * - Traps focus, handles Escape, restores focus on close.
 * - Locks background scrolling while open.
 * - Supports nested replies, edit, delete, report, and moderation handling.
 * - Preserves user input if submission fails.
 */
export default function CommentModal({
  isOpen,
  onClose,
  post,
  isGuest = false,
  onAuthRequired,
  onCommentCountChange,
  triggerRef,
}) {
  let authUser = null;
  let isAdmin = false;
  try {
    const auth = useAuth();
    authUser = auth?.user;
    isAdmin = !isGuest && String(auth?.user?.role || auth?.user?.roleName || '').toLowerCase() === 'admin';
  } catch {
    authUser = null;
    isAdmin = false;
  }

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [reportingId, setReportingId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const [deleteModalError, setDeleteModalError] = useState(null);
  const deleteModalOpenRef = useRef(deleteModalOpen);
  deleteModalOpenRef.current = deleteModalOpen;

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const textareaRef = useRef(null);

  const postId = post?.id;

  useEffect(() => {
    if (modalRef.current) modalRef.current.inert = deleteModalOpen;
  }, [deleteModalOpen]);

  const loadCommentsList = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError('');
    try {
      const data = await getComments(postId, { maxDepth: 4 });
      const arr = asArray(data);
      setComments(arr);
      const total = countComments(arr);
      onCommentCountChange?.(total);
    } catch (err) {
      setError(err.message || 'Failed to load comments.');
    } finally {
      setLoading(false);
    }
  }, [postId, onCommentCountChange]);

  useEffect(() => {
    if (!isOpen || !postId) return;

    loadCommentsList();

    // Lock background scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Trap focus and handle Escape on window
    const handleKeyDown = (e) => {
      if (deleteModalOpenRef.current) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Focus close button or composer after rendering
    const timer = setTimeout(() => {
      if (deleteModalOpenRef.current) return;
      if (textareaRef.current && !isGuest) {
        textareaRef.current.focus();
      } else if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      // Restore focus to trigger button
      if (triggerRef?.current) {
        triggerRef.current.focus();
      }
    };
  }, [isOpen, postId, isGuest, loadCommentsList, onClose, triggerRef]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCommentSubmit = async (e, parentCommentId = null) => {
    e.preventDefault();
    if (isGuest) {
      onAuthRequired?.();
      return;
    }

    const content = (parentCommentId === null ? commentText : replyText).trim();
    if (!content) {
      toast.error(parentCommentId ? 'Reply content is required.' : 'Comment content is required.');
      return;
    }
    if (content.length > 500) {
      toast.error('Comment must be between 1 and 500 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const created = await createComment(postId, { content, parentCommentId });
      const status = String(created?.status || '').toLowerCase();
      if (status === 'hidden') {
        toast.success(parentCommentId ? 'Your reply was submitted for moderation review.' : 'Your comment was submitted for moderation review.');
      } else {
        toast.success(parentCommentId ? 'Reply posted.' : 'Comment posted.');
      }

      if (parentCommentId === null) {
        setCommentText('');
      } else {
        setReplyText('');
        setReplyingTo(null);
      }

      // Refresh comment tree
      const refreshed = await getComments(postId, { maxDepth: 4 });
      const arr = asArray(refreshed);
      setComments(arr);
      const total = countComments(arr);
      onCommentCountChange?.(total);
    } catch (err) {
      // Intentionally preserve entered text on error
      toast.error(err.message || 'Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e, commentId) => {
    e.preventDefault();
    if (isGuest) {
      onAuthRequired?.();
      return;
    }

    const content = editCommentText.trim();
    if (!content) {
      toast.error('Comment content is required.');
      return;
    }
    if (content.length > 500) {
      toast.error('Comment must be between 1 and 500 characters.');
      return;
    }

    setActionLoadingId(commentId);
    try {
      const updated = await updateComment(postId, commentId, content);
      if (String(updated?.status || '').toLowerCase() === 'hidden') {
        toast.success('Your edited comment was submitted for moderation review.');
      } else {
        toast.success('Comment updated.');
      }
      setEditingCommentId(null);
      setEditCommentText('');

      const refreshed = await getComments(postId, { maxDepth: 4 });
      const arr = asArray(refreshed);
      setComments(arr);
    } catch (err) {
      toast.error(err.message || 'Failed to update comment.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = (comment) => {
    if (isGuest) {
      onAuthRequired?.();
      return;
    }
    setCommentToDelete(comment);
    setDeleteModalError(null);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async (reason) => {
    if (!commentToDelete || !postId) return;

    setIsDeletingComment(true);
    setDeleteModalError(null);
    try {
      await deleteComment(postId, commentToDelete.id, reason);
      const commentAuthorId = commentToDelete.userId ?? commentToDelete.UserId;
      const isMine = commentAuthorId != null && authUser?.id != null && String(authUser.id) === String(commentAuthorId);
      const postAuthorId = post?.authorId ?? post?.author?.id;
      const isPostAuthor = !isMine && authUser?.id != null && postAuthorId != null && String(authUser.id) === String(postAuthorId);

      if (isAdmin && !isMine && !isPostAuthor) {
        toast.success('Comment deleted by administrator.');
      } else if (isPostAuthor && !isMine) {
        toast.success('Comment deleted by post author.');
      } else {
        toast.success('Comment deleted.');
      }

      setDeleteModalOpen(false);
      setCommentToDelete(null);
      if (editingCommentId === commentToDelete.id) {
        setEditingCommentId(null);
        setEditCommentText('');
      }

      const refreshed = await getComments(postId, { maxDepth: 4 });
      const arr = asArray(refreshed);
      setComments(arr);
      const total = countComments(arr);
      onCommentCountChange?.(total);
    } catch (err) {
      setDeleteModalError(err.message || 'Failed to delete comment.');
      toast.error(err.message || 'Failed to delete comment.');
    } finally {
      setIsDeletingComment(false);
    }
  };

  const handleReport = async (commentId) => {
    if (isGuest) {
      onAuthRequired?.();
      return;
    }

    const promptReason = window.prompt('Why are you reporting this comment? (required):');
    if (promptReason === null) return;
    const reason = promptReason.trim();
    if (!reason) {
      toast.error('A reason is required to report this comment.');
      return;
    }
    if (reason.length > 500) {
      toast.error('Report reason must be between 1 and 500 characters.');
      return;
    }

    setReportingId(commentId);
    try {
      const result = await reportComment(postId, commentId, reason);
      toast.success(result?.message || 'Report submitted for review.');
      if (result?.commentHidden) {
        const refreshed = await getComments(postId, { maxDepth: 4 });
        const arr = asArray(refreshed);
        setComments(arr);
      }
    } catch (err) {
      if (err.status === 409 || err.message?.includes('already reported') || err.message?.includes('Duplicate')) {
        toast.error('You have already reported this comment.');
      } else {
        toast.error(err.message || 'Failed to report comment.');
      }
    } finally {
      setReportingId(null);
    }
  };

  const renderCommentItem = (comment) => {
    const isDeleted = Boolean(comment.isDeleted ?? comment.IsDeleted);
    const isReplyToDeleted = Boolean(comment.isReplyToDeleted ?? comment.IsReplyToDeleted);
    const replyToDisplayName = comment.replyToDisplayName ?? comment.ReplyToDisplayName;
    const content = comment.content ?? comment.Content;
    const status = String(comment.status ?? comment.Status ?? '').toLowerCase();
    const depth = Number(comment.depth ?? comment.Depth) || 1;
    const isMine = Boolean(
      !isGuest && (comment.isMine ?? comment.IsMine ?? (authUser?.id != null && String(comment.userId ?? comment.UserId) === String(authUser.id)))
    );
    const postAuthorId = post?.authorId ?? post?.author?.id;
    const isPostAuthor = Boolean(!isMine && !isGuest && authUser?.id != null && postAuthorId != null && String(authUser.id) === String(postAuthorId));
    const updatedAt = comment.updatedAt ?? comment.UpdatedAt;

    // A non-deleted comment with status="hidden" must not be exposed publicly
    if (!isDeleted && status === 'hidden') {
      return null;
    }

    const canReply = depth < 4;
    const isEditing = editingCommentId === comment.id;
    const isActionLoading = actionLoadingId === comment.id;
    const isReporting = reportingId === comment.id;
    const indentClasses = [
      'ml-0',
      'ml-3 sm:ml-4',
      'ml-6 sm:ml-8',
      'ml-9 sm:ml-12',
    ][Math.min(depth - 1, 3)] || 'ml-0';
    const avatarSizeClass = depth > 1 ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-8 h-8';

    // Tombstone row for deleted comments
    if (isDeleted) {
      return (
        <div key={comment.id} className="space-y-2.5">
          <div
            className={`py-1 text-[11px] text-vh-text-secondary italic break-words ${indentClasses}`}
            data-testid={`comment-tombstone-${comment.id}`}
          >
            <span>{content || 'This comment has been deleted.'}</span>
          </div>
          {comment.replies && comment.replies.length > 0 && (
            <div className="space-y-2.5">{comment.replies.map(renderCommentItem)}</div>
          )}
        </div>
      );
    }

    return (
      <div key={comment.id} className="space-y-2.5">
        <div
          className={`bg-white/80 border border-vh-border/70 rounded-xl p-3 sm:p-4 text-left shadow-2xs transition-colors ${indentClasses}`}
        >
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div className={`${avatarSizeClass} rounded-full bg-vh-mint/60 border border-vh-border flex items-center justify-center shrink-0 overflow-hidden`}>
              {comment.avatarUrl ? (
                <img src={getImageUrl(comment.avatarUrl)} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="font-semibold text-xs text-vh-forest">
                  {comment.authorName ? comment.authorName.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-vh-text-secondary">
                <span className="font-semibold text-vh-text-primary truncate max-w-[150px]">
                  {comment.authorName || 'Anonymous'}
                </span>
                {post?.authorId != null && (comment.userId != null || comment.UserId != null) && String(comment.userId ?? comment.UserId) === String(post.authorId) && (
                  <span className="px-1.5 py-0.2 rounded bg-vh-mint text-vh-forest font-semibold text-[10px]">
                    Author
                  </span>
                )}
                {isMine && (
                  <span className="px-1.5 py-0.2 rounded bg-vh-sage/20 text-vh-forest font-medium text-[10px]">
                    You
                  </span>
                )}
                <span>•</span>
                <time dateTime={comment.createdAt} title={formatDateTime(comment.createdAt)}>
                  {getTimeAgo(comment.createdAt) || formatDate(comment.createdAt)}
                </time>

                {/* Reply parent reference */}
                {isReplyToDeleted ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-vh-text-secondary bg-vh-mint/50 border border-vh-border/60 px-2 py-0.5 rounded italic">
                    The comment that {comment.authorName || 'this member'} is replying to has been deleted.
                  </span>
                ) : replyToDisplayName ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-vh-forest bg-vh-mint border border-vh-border/60 px-2 py-0.5 rounded font-medium">
                    Replying to @{replyToDisplayName}
                  </span>
                ) : null}
              </div>

              {isEditing ? (
                <form onSubmit={(e) => handleEditSubmit(e, comment.id)} className="mt-2.5 space-y-2">
                  <textarea
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                    maxLength={500}
                    rows="2"
                    className="w-full bg-vh-cream/50 border border-vh-border rounded-lg p-2.5 text-xs sm:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:border-vh-forest transition-colors resize-y min-h-[60px]"
                    disabled={isActionLoading}
                    autoFocus
                  />
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-vh-text-secondary">{editCommentText.length}/500</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditCommentText('');
                        }}
                        disabled={isActionLoading}
                        className="px-2.5 py-1 border border-vh-border text-vh-text-secondary text-xs rounded-lg hover:text-vh-forest disabled:opacity-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest active:scale-95 motion-reduce:transform-none"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isActionLoading || !editCommentText.trim()}
                        className="px-3 py-1 bg-vh-forest text-white text-xs font-medium rounded-lg disabled:opacity-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest active:scale-95 motion-reduce:transform-none"
                      >
                        {isActionLoading ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <p className="mt-1.5 whitespace-pre-wrap break-words text-xs sm:text-sm leading-relaxed text-vh-text-primary">
                  {content}
                  {updatedAt && (
                    <span className="ml-1.5 text-[11px] text-vh-text-secondary italic">(edited)</span>
                  )}
                </p>
              )}

              {/* Actions row: reply, edit, delete, report */}
              {!isEditing && (
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                  {canReply && !isGuest && (
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingTo(replyingTo === comment.id ? null : comment.id);
                        setReplyText('');
                      }}
                      className="font-medium text-vh-forest hover:text-vh-sage transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest rounded px-1 active:opacity-80"
                    >
                      {replyingTo === comment.id ? 'Cancel reply' : 'Reply'}
                    </button>
                  )}
                  {canReply && isGuest && (
                    <button
                      type="button"
                      onClick={onAuthRequired}
                      className="font-medium text-vh-forest hover:text-vh-sage transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest rounded px-1 active:opacity-80"
                    >
                      Log in to reply
                    </button>
                  )}
                  {!canReply && (
                    <span className="text-[11px] text-vh-text-secondary/80 italic">
                      Maximum reply depth reached
                    </span>
                  )}

                  {/* Owner Edit */}
                  {isMine && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditCommentText(content || '');
                      }}
                      disabled={isActionLoading}
                      className="font-medium text-vh-text-secondary hover:text-vh-forest transition-colors cursor-pointer disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest rounded px-1 active:opacity-80"
                    >
                      Edit
                    </button>
                  )}

                  {/* Owner Delete */}
                  {isMine && (
                    <button
                      type="button"
                      onClick={() => handleDelete(comment)}
                      disabled={isActionLoading || isDeletingComment}
                      className="font-medium text-vh-error hover:opacity-80 transition-colors cursor-pointer disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-error rounded px-1 active:opacity-80"
                    >
                      Delete
                    </button>
                  )}

                  {/* Admin Delete (Only for other users' comments) */}
                  {isAdmin && !isMine && !isPostAuthor && (
                    <button
                      type="button"
                      onClick={() => handleDelete(comment)}
                      disabled={isActionLoading || isDeletingComment}
                      className="font-medium text-vh-error hover:opacity-80 transition-colors cursor-pointer disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-error rounded px-1 active:opacity-80"
                      title="Delete as Administrator (requires reason)"
                    >
                      Delete (Admin)
                    </button>
                  )}

                  {/* Post Author Delete */}
                  {!isMine && isPostAuthor && (
                    <button
                      type="button"
                      onClick={() => handleDelete(comment)}
                      disabled={isActionLoading || isDeletingComment}
                      className="font-medium text-vh-error hover:opacity-80 transition-colors cursor-pointer disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-error rounded px-1 active:opacity-80"
                      title="Delete as Post Author"
                    >
                      Delete
                    </button>
                  )}

                  {/* Report (Non-owner, non-admin only) */}
                  {!isMine && !isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleReport(comment.id)}
                      disabled={isReporting}
                      className="font-medium text-vh-text-secondary/70 hover:text-vh-error transition-colors cursor-pointer disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest rounded px-1 active:opacity-80"
                    >
                      {isReporting ? 'Reporting...' : 'Report'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Nested Reply Composer */}
          {replyingTo === comment.id && (
            <form onSubmit={(e) => handleCommentSubmit(e, comment.id)} className="mt-3 pl-0 sm:pl-10 space-y-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                maxLength={500}
                rows="2"
                placeholder={`Reply to ${comment.authorName || 'user'}...`}
                className="w-full bg-vh-cream/50 border border-vh-border rounded-lg p-2.5 text-xs sm:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:border-vh-forest transition-colors resize-y min-h-[56px]"
                disabled={submitting}
                autoFocus
              />
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-vh-text-secondary">{replyText.length}/500</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText('');
                    }}
                    className="px-2.5 py-1 text-xs border border-vh-border rounded-lg text-vh-text-secondary hover:text-vh-forest focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest active:scale-95 motion-reduce:transform-none cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !replyText.trim()}
                    className="px-3 py-1 bg-vh-forest hover:bg-vh-sage disabled:opacity-60 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest active:scale-95 motion-reduce:transform-none"
                  >
                    {submitting ? 'Posting...' : 'Post Reply'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-2.5">{comment.replies.map(renderCommentItem)}</div>
        )}
      </div>
    );
  };

  const lastPostRef = useRef(post);
  if (post) {
    lastPostRef.current = post;
  }
  const currentPost = post || lastPostRef.current;

  if (!isOpen && !currentPost) {
    return null;
  }

  const totalCommentCount = currentPost ? countComments(comments) : 0;

  return (
    <>
      <ModalMotion
        isOpen={Boolean(isOpen && currentPost)}
        onClose={onClose}
        variant="bottom-sheet"
        backdropClassName="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
        dialogClassName="relative w-full sm:max-w-xl md:max-w-2xl bg-vh-surface border-t sm:border border-vh-border/80 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[86vh] overflow-hidden"
        ariaLabelledBy="comment-modal-title"
        ariaModal={!deleteModalOpen}
        dialogRef={modalRef}
        closeOnEscape={false}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-vh-border/70 flex items-center justify-between shrink-0 bg-vh-surface">
          <div className="min-w-0 flex-1 pr-3">
            <h2 id="comment-modal-title" className="font-dm-serif text-lg sm:text-xl font-medium text-vh-text-primary truncate">
              Comments on &ldquo;{currentPost?.title || 'Recipe'}&rdquo;
            </h2>
            <div className="flex items-center gap-2 text-xs font-dm-sans text-vh-text-secondary mt-0.5">
              <span>{currentPost?.authorName || 'Author'}</span>
              <span>•</span>
              <span>{formatDate(currentPost?.createdAt)}</span>
              <span>•</span>
              <span className="font-medium text-vh-forest">{totalCommentCount} comments</span>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close comments dialog"
            className="w-8 h-8 rounded-full bg-vh-cream hover:bg-vh-mint/40 border border-vh-border/60 text-vh-text-secondary hover:text-vh-forest flex items-center justify-center transition-all focus-ring-vh active:scale-95 motion-reduce:transform-none cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Comments Thread */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3.5 bg-gradient-to-b from-vh-surface to-vh-cream/20 overscroll-contain">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2.5 text-vh-text-secondary">
              <div className="w-7 h-7 border-2 border-vh-mint border-t-vh-forest rounded-full animate-spin" />
              <p className="text-xs sm:text-sm font-dm-sans">Loading conversation...</p>
            </div>
          ) : error ? (
            <div className="py-10 text-center space-y-3">
              <p className="text-sm text-vh-error font-dm-sans">{error}</p>
              <button
                type="button"
                onClick={loadCommentsList}
                className="px-4 py-1.5 bg-vh-forest text-white rounded-lg text-xs font-medium hover:bg-vh-sage transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest active:scale-95 motion-reduce:transform-none cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : comments.length === 0 ? (
            <div className="py-14 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-vh-mint/50 border border-vh-border flex items-center justify-center text-2xl">
                💬
              </div>
              <p className="font-dm-serif text-base text-vh-text-primary">No comments yet</p>
              <p className="text-xs sm:text-sm text-vh-text-secondary max-w-xs mx-auto">
                Be the first to share your thoughts, cooking tips, or questions!
              </p>
            </div>
          ) : (
            <div className="space-y-3">{comments.map(renderCommentItem)}</div>
          )}
        </div>

        {/* Bottom Composer */}
        <div className="p-3.5 sm:p-4 border-t border-vh-border/70 bg-vh-surface shrink-0">
          {!isGuest ? (
            <form onSubmit={(e) => handleCommentSubmit(e, null)} className="space-y-2">
              <textarea
                ref={textareaRef}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                maxLength={500}
                rows="2"
                placeholder="Share your thoughts or questions about this dish..."
                className="w-full bg-vh-cream/40 border border-vh-border/70 rounded-xl p-3 text-xs sm:text-sm font-dm-sans text-vh-text-primary focus:outline-none focus-visible:border-vh-forest focus-visible:ring-2 focus-visible:ring-vh-forest transition-colors resize-none min-h-[58px]"
                disabled={submitting}
              />
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-dm-sans text-vh-text-secondary">
                  {commentText.length}/500
                </span>
                <button
                  type="submit"
                  disabled={submitting || !commentText.trim()}
                  className="px-5 py-2 bg-vh-forest hover:bg-vh-sage disabled:opacity-50 text-white text-xs sm:text-sm font-medium rounded-full shadow-2xs transition-all hover:shadow-xs active:scale-[0.98] motion-reduce:transform-none disabled:active:scale-100 cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:ring-offset-2"
                >
                  {submitting && (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-3.5 bg-vh-mint/20 border border-vh-border/60 rounded-xl flex items-center justify-between gap-4">
              <div className="text-left">
                <p className="font-dm-serif text-sm font-medium text-vh-text-primary">Join the discussion</p>
                <p className="text-xs text-vh-text-secondary">Log in to leave comments and connect with chefs.</p>
              </div>
              <button
                type="button"
                onClick={onAuthRequired}
                className="px-4 py-2 bg-vh-forest hover:bg-vh-sage text-white text-xs font-semibold rounded-full shadow-2xs transition-colors shrink-0 cursor-pointer"
              >
                Log In
              </button>
            </div>
          )}
        </div>
      </ModalMotion>

      {/* Accessible Comment Delete Modal */}
      <CommentDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeletingComment) {
            setDeleteModalOpen(false);
            setCommentToDelete(null);
            setDeleteModalError(null);
          }
        }}
        onConfirm={confirmDelete}
        comment={commentToDelete}
        currentUser={authUser}
        post={currentPost}
        isSubmitting={isDeletingComment}
        submitError={deleteModalError}
      />
    </>
  );
}
