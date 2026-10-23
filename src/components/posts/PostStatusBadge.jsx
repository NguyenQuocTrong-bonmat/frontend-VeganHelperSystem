import React from 'react';

/**
 * Resolves the authoritative publication and moderation status of a post.
 * 
 * Follows backend rules from VeganHelperBE:
 * - 'published': Publicly visible unless moderationHold is true.
 * - 'pending_review' / 'flagged' / 'under_review': Placed under AI moderation hold or awaiting review.
 * - 'hidden' / 'removed': Restricted by admin decision.
 * - 'rejected': Rejected by admin decision.
 * - 'draft' / isDraft: Draft recipe, not published.
 * - unknown/missing: Safe neutral fallback (never incorrectly defaults to Published).
 */
export function resolvePostStatus(post) {
  if (!post) {
    return {
      key: 'unknown',
      label: 'Unknown',
      isPublic: false,
      isRestricted: false,
      isRed: false,
      badgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
      borderClass: 'border-[#DCE5D9]',
      message: null,
    };
  }

  const rawStatus = typeof post.status === 'string' ? post.status.trim().toLowerCase() : '';
  const isDraftFlag = Boolean(post.isDraft);

  // 1. Draft post
  if (rawStatus === 'draft' || isDraftFlag) {
    return {
      key: 'draft',
      label: 'Draft',
      isPublic: false,
      isRestricted: false,
      isRed: false,
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      borderClass: 'border-[#DCE5D9]',
      message: null,
    };
  }

  // 2. Pending Review / Flagged / Under Review
  if (rawStatus === 'pending_review' || rawStatus === 'under_review' || rawStatus === 'flagged') {
    const label = rawStatus === 'flagged' ? 'Flagged' : 'Under Review';
    return {
      key: rawStatus === 'flagged' ? 'flagged' : 'under_review',
      label,
      isPublic: false,
      isRestricted: true,
      isRed: true,
      badgeClass: 'bg-red-50 text-red-700 border-red-200',
      borderClass: 'border-red-400 ring-1 ring-red-200',
      message: 'This post is under moderation review',
    };
  }

  // 3. Hidden / Removed
  if (rawStatus === 'hidden' || rawStatus === 'removed') {
    const label = rawStatus === 'removed' ? 'Removed' : 'Hidden';
    return {
      key: rawStatus,
      label,
      isPublic: false,
      isRestricted: true,
      isRed: true,
      badgeClass: 'bg-red-100 text-red-800 border-red-300',
      borderClass: 'border-red-400 ring-1 ring-red-200',
      message: 'This post is not currently visible to the public',
    };
  }

  // 4. Rejected
  if (rawStatus === 'rejected') {
    return {
      key: 'rejected',
      label: 'Rejected',
      isPublic: false,
      isRestricted: true,
      isRed: true,
      badgeClass: 'bg-red-100 text-red-800 border-red-300',
      borderClass: 'border-red-400 ring-1 ring-red-200',
      message: 'This post is not currently visible to the public',
    };
  }

  // 5. Published
  if (rawStatus === 'published') {
    // If moderationHold is explicitly true despite published status, authoritative state is Under Review
    if (post.moderationHold) {
      return {
        key: 'under_review',
        label: 'Under Review',
        isPublic: false,
        isRestricted: true,
        isRed: true,
        badgeClass: 'bg-red-50 text-red-700 border-red-200',
        borderClass: 'border-red-400 ring-1 ring-red-200',
        message: 'This post is under moderation review',
      };
    }

    return {
      key: 'published',
      label: 'Published',
      isPublic: true,
      isRestricted: false,
      isRed: false,
      badgeClass: 'bg-[#F3F6EE] text-[#2F5233] border-[#DCE3D5]',
      borderClass: 'border-[#DCE5D9]',
      message: null,
    };
  }

  // 6. Unknown / Missing: Safe neutral fallback, NEVER default to Published
  return {
    key: 'unknown',
    label: post.status ? String(post.status) : 'Unknown',
    isPublic: false,
    isRestricted: false,
    isRed: false,
    badgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
    borderClass: 'border-[#DCE5D9]',
    message: null,
  };
}

/**
 * Extracts authorized moderation reason from post object or user notifications.
 * Never fabricates a reason if none is found.
 */
export function extractModerationReason(post, notifications = []) {
  if (!post) return null;

  // 1. Direct reason fields on post (if returned by API or mock)
  const directReason = post.moderationReason || post.reason || post.reviewReason;
  if (typeof directReason === 'string' && directReason.trim()) {
    return directReason.trim();
  }

  // 2. Correlate from authorized user notifications
  if (Array.isArray(notifications) && notifications.length > 0 && post.id) {
    const postNotif = notifications.find((n) => {
      if (!n || !n.targetUrl) return false;
      const match = String(n.targetUrl).match(/\/posts\/(?:edit\/)?(\d+)/);
      return match && Number(match[1]) === Number(post.id);
    });

    if (postNotif && typeof postNotif.message === 'string' && postNotif.message.trim()) {
      let msg = postNotif.message.trim();
      // Remove boilerplate prefix if present
      if (msg.startsWith('Your post needs an Admin review.')) {
        msg = msg.replace('Your post needs an Admin review.', '').trim();
      }
      if (msg) return msg;
    }
  }

  return null;
}

/**
 * Renders the status icon for a given status key
 */
function StatusIcon({ statusKey, isRed }) {
  if (statusKey === 'published') {
    return (
      <svg className="w-3 h-3 text-[#2F5233] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    );
  }

  if (statusKey === 'under_review' || statusKey === 'flagged') {
    return (
      <svg className="w-3 h-3 text-red-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    );
  }

  if (statusKey === 'hidden' || statusKey === 'removed') {
    return (
      <svg className="w-3 h-3 text-red-700 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
    );
  }

  if (statusKey === 'rejected') {
    return (
      <svg className="w-3 h-3 text-red-700 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    );
  }

  if (statusKey === 'draft') {
    return (
      <svg className="w-3 h-3 text-amber-700 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
      </svg>
    );
  }

  // Unknown fallback icon
  return (
    <svg className="w-3 h-3 text-stone-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 18h.01" />
    </svg>
  );
}

/**
 * Reusable Post Status Badge
 */
export default function PostStatusBadge({ post, className = '' }) {
  const statusInfo = resolvePostStatus(post);

  return (
    <div
      data-testid="post-status-badge"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-xs backdrop-blur-xs select-none ${statusInfo.badgeClass} ${className}`}
      aria-label={`Status: ${statusInfo.label}`}
    >
      <StatusIcon statusKey={statusInfo.key} isRed={statusInfo.isRed} />
      <span>{statusInfo.label}</span>
    </div>
  );
}

/**
 * Reusable Explanatory Status Notice Banner (rendered on restricted posts)
 */
export function PostStatusNotice({ post, reason = null, className = '' }) {
  const statusInfo = resolvePostStatus(post);

  if (!statusInfo.message) {
    return null;
  }

  return (
    <div
      data-testid="post-status-notice"
      role="status"
      className={`p-3 rounded-xl bg-red-50/90 border border-red-200 text-xs text-red-800 flex flex-col gap-1.5 ${className}`}
    >
      <div className="flex items-center gap-1.5 font-medium text-red-700">
        <svg className="w-4 h-4 shrink-0 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <span className="font-semibold">{statusInfo.message}</span>
      </div>

      {reason && (
        <div data-testid="moderation-reason" className="pt-2 mt-0.5 border-t border-red-200/70 text-red-900/90 text-xs break-words leading-relaxed">
          <strong className="font-semibold text-red-800">Reason: </strong>
          <span>{reason}</span>
        </div>
      )}
    </div>
  );
}
