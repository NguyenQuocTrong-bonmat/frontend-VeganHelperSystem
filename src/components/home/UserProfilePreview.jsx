import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import {
  getPublicProfile,
  getFollowStatus,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from '../../services/userService';
import { getImageUrl } from '../../utils/imageUtils';
import { formatDate } from '../../utils/dateUtils';
import { popoverBackdropVariants, popoverCardVariants, reducedMotionVariants } from '../ui/dropdownMotion';

// In-memory session cache for preview data to avoid duplicate queries
const previewCache = new Map(); // userId -> { profile, followStatus, timestamp }
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

/**
 * UserProfilePreview
 * Reusable Facebook-style compact profile preview popover/modal.
 * 
 * Used when clicking a user's avatar or name in Home feed, Search People, etc.
 */
export default function UserProfilePreview({
  isOpen,
  onClose,
  userId,
  initialUser = null,
  triggerEl = null,
  isGuest = false,
  onAuthRequired = null,
}) {
  const navigate = useNavigate();
  
  let currentUser = null;
  let isAuthenticated = false;
  try {
    const auth = useAuth();
    currentUser = auth?.user;
    isAuthenticated = Boolean(auth?.isAuthenticated && !isGuest);
  } catch {
    currentUser = null;
    isAuthenticated = !isGuest;
  }

  const [profile, setProfile] = useState(null);
  const [followStatus, setFollowStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowUpdating, setIsFollowUpdating] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [positionStyle, setPositionStyle] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const popoverRef = useRef(null);
  const closeBtnRef = useRef(null);
  const activeUserIdRef = useRef(null);

  const isSelf = Boolean(
    currentUser?.id &&
    userId &&
    String(currentUser.id) === String(userId)
  );

  // Responsive check & popover position calculation
  const updatePosition = useCallback(() => {
    const mobile = window.innerWidth < 640;
    setIsMobile(mobile);

    if (mobile || !triggerEl) {
      setPositionStyle({});
      return;
    }

    try {
      const rect = triggerEl.getBoundingClientRect();
      const popoverWidth = 330;
      const popoverHeight = 310;
      const padding = 12;

      // Vertical positioning (flip above if not enough space below)
      const spaceBelow = window.innerHeight - rect.bottom;
      let top;
      if (spaceBelow >= popoverHeight + padding || rect.top < popoverHeight + padding) {
        top = rect.bottom + 8;
      } else {
        top = rect.top - popoverHeight - 8;
      }
      top = Math.max(padding, Math.min(top, window.innerHeight - popoverHeight - padding));

      // Horizontal positioning (clamp within viewport)
      let left = rect.left;
      if (left + popoverWidth > window.innerWidth - padding) {
        left = window.innerWidth - popoverWidth - padding;
      }
      left = Math.max(padding, left);

      setPositionStyle({
        top: `${Math.round(top)}px`,
        left: `${Math.round(left)}px`,
        position: 'fixed',
      });
    } catch {
      setPositionStyle({});
    }
  }, [triggerEl]);

  // Fetch or retrieve from cache
  const fetchUserData = useCallback(async (targetId) => {
    if (!targetId) return;
    activeUserIdRef.current = targetId;
    setError(null);

    // Check cache
    const cached = previewCache.get(String(targetId));
    const now = Date.now();
    const hasFreshCache = cached && (now - cached.timestamp < CACHE_TTL_MS);

    if (hasFreshCache) {
      setProfile(cached.profile);
      setFollowStatus(cached.followStatus);
      setIsLoading(false);
    } else {
      // Clean slate for new user to eliminate stale data leak
      setProfile(initialUser ? { ...initialUser } : null);
      setFollowStatus(null);
      setIsLoading(true);
    }

    // If guest, backend endpoints require auth. Rely on initial data and do not fire unauthorized requests.
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const isSelfTarget = Boolean(currentUser?.id && String(currentUser.id) === String(targetId));

    try {
      if (isSelfTarget) {
        // Self view: avoid getFollowStatus(self) which returns 400 Bad Request.
        // Fetch public profile and authoritative counts via pagination endpoints.
        const [profileRes, followersRes, followingRes] = await Promise.allSettled([
          getPublicProfile(targetId),
          getFollowers(targetId, 1, 1),
          getFollowing(targetId, 1, 1),
        ]);

        if (activeUserIdRef.current !== targetId) return;

        let fetchedProfile = null;
        if (profileRes.status === 'fulfilled') {
          fetchedProfile = profileRes.value;
          setProfile(fetchedProfile);
        }

        const followersCount = followersRes.status === 'fulfilled'
          ? (followersRes.value?.totalCount ?? followersRes.value?.totalItems ?? (followersRes.value?.items?.length ?? 0))
          : (currentUser?.followersCount ?? 0);
        const followingCount = followingRes.status === 'fulfilled'
          ? (followingRes.value?.totalCount ?? followingRes.value?.totalItems ?? (followingRes.value?.items?.length ?? 0))
          : (currentUser?.followingCount ?? 0);

        const authoritativeSelfStatus = {
          userId: targetId,
          isFollowing: false,
          followersCount,
          followingCount,
          notifyOnNewPost: false,
        };

        setFollowStatus(authoritativeSelfStatus);

        previewCache.set(String(targetId), {
          profile: fetchedProfile || cached?.profile || null,
          followStatus: authoritativeSelfStatus,
          timestamp: Date.now(),
        });
      } else {
        const [profileRes, followRes] = await Promise.allSettled([
          getPublicProfile(targetId),
          getFollowStatus(targetId),
        ]);

        // If user ID changed while request was in-flight, discard response
        if (activeUserIdRef.current !== targetId) return;

        let fetchedProfile = null;
        let fetchedFollow = null;

        if (profileRes.status === 'fulfilled') {
          fetchedProfile = profileRes.value;
          setProfile(fetchedProfile);
          setImageError(false);
        }

        if (followRes.status === 'fulfilled') {
          fetchedFollow = followRes.value;
          setFollowStatus(fetchedFollow);
        }

        if (profileRes.status === 'rejected' && followRes.status === 'rejected') {
          if (!hasFreshCache && !initialUser) {
            setError('Unable to load user profile. Please check your connection.');
          }
        } else {
          // Update cache with whatever data was retrieved
          previewCache.set(String(targetId), {
            profile: fetchedProfile || cached?.profile || null,
            followStatus: fetchedFollow || cached?.followStatus || null,
            timestamp: Date.now(),
          });
        }
      }
    } catch (err) {
      if (activeUserIdRef.current === targetId && !hasFreshCache && !initialUser) {
        setError('Failed to load profile.');
      }
    } finally {
      if (activeUserIdRef.current === targetId) {
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, initialUser, currentUser]);

  // Handle open / target change
  useEffect(() => {
    if (!isOpen || !userId) {
      activeUserIdRef.current = null;
      return;
    }

    setImageError(false);
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    // Immediately reset to clean initial snapshot for the new userId
    setProfile(initialUser ? { ...initialUser } : null);
    setFollowStatus(null);
    setError(null);

    fetchUserData(userId);

    // Focus close button on mount for accessibility
    const focusTimer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, userId, initialUser, updatePosition, fetchUserData]);

  // Outside click & Escape handlers
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    const handleOutsideClick = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        // Also ensure click wasn't on trigger element itself
        if (triggerEl && triggerEl.contains(e.target)) return;
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const clickTimer = setTimeout(() => {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }, 20);

    return () => {
      clearTimeout(clickTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen, onClose, triggerEl]);

  // Handle Follow / Unfollow toggle
  const handleToggleFollow = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated) {
      if (onAuthRequired) {
        onAuthRequired();
      } else {
        toast.error('Please log in to follow creators.');
        navigate('/login');
      }
      return;
    }

    if (isSelf || isFollowUpdating || !userId) return;

    const previousFollow = followStatus?.isFollowing ?? false;
    const previousFollowers = followStatus?.followersCount ?? 0;
    const nextFollow = !previousFollow;
    const nextFollowers = Math.max(0, previousFollow ? previousFollowers - 1 : previousFollowers + 1);

    // Optimistic UI update
    setFollowStatus((prev) => ({
      ...prev,
      userId,
      isFollowing: nextFollow,
      followersCount: nextFollowers,
    }));
    setIsFollowUpdating(true);

    try {
      let res;
      if (nextFollow) {
        res = await followUser(userId);
      } else {
        res = await unfollowUser(userId);
      }

      const authoritativeStatus = {
        userId,
        isFollowing: res?.isFollowing !== undefined ? res.isFollowing : nextFollow,
        followersCount: res?.followersCount !== undefined ? res.followersCount : nextFollowers,
        followingCount: res?.followingCount !== undefined ? res.followingCount : (followStatus?.followingCount ?? 0),
        notifyOnNewPost: Boolean(res?.notifyOnNewPost),
      };

      setFollowStatus(authoritativeStatus);

      // Invalidate and update cache
      const cached = previewCache.get(String(userId));
      previewCache.set(String(userId), {
        profile: cached?.profile || profile,
        followStatus: authoritativeStatus,
        timestamp: Date.now(),
      });

      // Dispatch global follow-changed event for cross-screen consistency
      window.dispatchEvent(
        new CustomEvent('veganhelper:follow-changed', {
          detail: {
            userId,
            ...authoritativeStatus,
          },
        })
      );

      toast.success(nextFollow ? 'Following creator' : 'Unfollowed creator');
    } catch (err) {
      // Rollback on failure
      setFollowStatus((prev) => ({
        ...prev,
        isFollowing: previousFollow,
        followersCount: previousFollowers,
      }));
      toast.error('Could not update follow status. Please try again.');
    } finally {
      setIsFollowUpdating(false);
    }
  };

  // Synchronize follow changes from other screens
  useEffect(() => {
    const handleFollowChanged = (e) => {
      const detail = e.detail;
      if (!detail) return;
      if (userId && String(detail.userId) === String(userId)) {
        setFollowStatus((prev) => ({
          ...prev,
          ...detail,
        }));
      }
    };
    window.addEventListener('veganhelper:follow-changed', handleFollowChanged);
    return () => window.removeEventListener('veganhelper:follow-changed', handleFollowChanged);
  }, [userId]);

  // Synchronize profile updates from Edit Profile
  useEffect(() => {
    const handleProfileUpdated = (e) => {
      const updatedUserId = e?.detail?.userId;
      if (updatedUserId) {
        previewCache.delete(String(updatedUserId));
      } else {
        previewCache.clear();
      }
      if (userId && (String(updatedUserId) === String(userId) || !updatedUserId)) {
        setImageError(false);
        fetchUserData(userId);
      }
    };
    window.addEventListener('veganhelper:profile-updated', handleProfileUpdated);
    return () => window.removeEventListener('veganhelper:profile-updated', handleProfileUpdated);
  }, [userId, fetchUserData]);

  if (!isOpen && !userId) {
    return null;
  }

  // Resolve user fields
  const displayName = profile?.displayName || initialUser?.displayName || 'User';
  const username = profile?.username || initialUser?.username || '';
  const avatarRaw =
    profile?.avatarUrl ??
    profile?.AvatarUrl ??
    profile?.avatar ??
    initialUser?.avatarUrl ??
    initialUser?.AvatarUrl ??
    initialUser?.avatar ??
    (isSelf ? (currentUser?.avatarUrl ?? currentUser?.AvatarUrl) : null);
  const avatarUrl = !imageError && avatarRaw ? getImageUrl(avatarRaw) : null;

  const dietType = profile?.dietType || initialUser?.dietType;
  const joinedAt = profile?.joinedAt;
  const postCount = profile?.publishedPostCount !== undefined && profile?.publishedPostCount !== null
    ? profile.publishedPostCount
    : '—';
  const followersCount = followStatus?.followersCount !== undefined && followStatus?.followersCount !== null
    ? followStatus.followersCount
    : '—';
  const followingCount = followStatus?.followingCount !== undefined && followStatus?.followingCount !== null
    ? followStatus.followingCount
    : '—';

  const isFollowing = Boolean(followStatus?.isFollowing);

  const viewProfileUrl = isSelf ? '/my-posts' : `/users/${userId}`;

  const content = (
    <motion.div
      ref={popoverRef}
      role="dialog"
      aria-modal={isMobile ? 'true' : 'false'}
      aria-label={`Profile preview for ${displayName}`}
      onClick={(e) => e.stopPropagation()}
      style={!isMobile ? positionStyle : undefined}
      className={`bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl shadow-xl z-50 overflow-hidden text-left ${
        isMobile
          ? 'w-[92vw] max-w-sm mx-auto'
          : 'w-[330px]'
      }`}
      custom={isMobile}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={shouldReduceMotion ? reducedMotionVariants : popoverCardVariants}
    >
      {/* Header Accent & Close - z-30 ensures close button is above any overlapping negative margin containers */}
      <div className="relative z-30 h-16 bg-gradient-to-r from-[#E9EFE6] via-[#F3F6EE] to-[#E9EFE6] border-b border-[#DCE3D5]/40 flex items-center justify-between px-4">
        {isSelf && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2F5233] bg-white/90 px-2.5 py-0.5 rounded-full border border-[#DCE3D5]">
            You
          </span>
        )}
        <div className="ml-auto relative z-40">
          <button
            ref={closeBtnRef}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose?.();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#6B6F63] hover:text-[#2B2A25] flex items-center justify-center transition-all shadow-xs border border-[#DCE3D5] hover:border-[#2F5233] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none cursor-pointer relative z-40"
            aria-label="Close profile preview"
          >
            <svg className="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-5 pt-0 pb-5">
        {/* Avatar - positioned overlapping the header banner with pointer-events-none on wrapper so header clicks are not blocked */}
        <div className="relative z-20 flex items-end justify-between -mt-9 mb-3 pointer-events-none">
          <div className="pointer-events-auto relative z-20 w-[72px] h-[72px] min-w-[72px] min-h-[72px] max-w-[72px] max-h-[72px] aspect-square rounded-full overflow-hidden border-[3px] border-[#FDFBF6] shadow-md bg-[#E9EFE6] shrink-0 ring-1 ring-[#DCE3D5]">
            {avatarUrl && !imageError ? (
              <img
                src={avatarUrl}
                alt={displayName}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover aspect-square block"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-fraunces font-bold text-2xl text-[#2F5233] bg-[#E9EFE6] select-none aspect-square">
                {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>

          {dietType && (
            <span className="pointer-events-auto mb-1 text-[11px] font-medium capitalize px-2.5 py-0.5 bg-[#F3F6EE] text-[#2F5233] rounded-full border border-[#DCE3D5]/70">
              {dietType.replace(/_/g, ' ')}
            </span>
          )}
        </div>

        {/* Identity Details */}
        <div className="mb-4">
          <h3 className="font-fraunces font-semibold text-[18px] text-[#2B2A25] leading-tight truncate">
            {displayName}
          </h3>
          {username && (
            <p className="text-[13px] text-[#6B6F63] font-medium truncate mt-0.5">
              @{username}
            </p>
          )}
          {joinedAt && (
            <p className="text-[11px] text-[#6B6F63] mt-1">
              Member since {formatDate(joinedAt)}
            </p>
          )}
        </div>

        {/* Error state */}
        {error && !profile && (
          <div className="p-3 mb-4 rounded-xl bg-red-50/80 border border-red-200 text-xs text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => fetchUserData(userId)}
              className="font-semibold underline ml-2 hover:text-red-900 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* 3-Column Statistics Row */}
        <div className="grid grid-cols-3 gap-2 py-3 px-2 mb-4 bg-[#F3F6EE]/60 rounded-xl border border-[#DCE3D5]/50 text-center">
          <div className="flex flex-col items-center">
            <span className="font-fraunces font-bold text-base text-[#2B2A25]">
              {isLoading && !profile ? (
                <span className="inline-block w-6 h-4 bg-[#DCE3D5]/60 animate-pulse rounded" />
              ) : (
                postCount
              )}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#6B6F63] font-medium mt-0.5">
              Posts
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-[#DCE3D5]/60">
            <span className="font-fraunces font-bold text-base text-[#2B2A25]">
              {isLoading && !followStatus ? (
                <span className="inline-block w-6 h-4 bg-[#DCE3D5]/60 animate-pulse rounded" />
              ) : (
                followersCount
              )}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#6B6F63] font-medium mt-0.5">
              Followers
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="font-fraunces font-bold text-base text-[#2B2A25]">
              {isLoading && !followStatus ? (
                <span className="inline-block w-6 h-4 bg-[#DCE3D5]/60 animate-pulse rounded" />
              ) : (
                followingCount
              )}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#6B6F63] font-medium mt-0.5">
              Following
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {!isSelf && (
            <button
              type="button"
              onClick={handleToggleFollow}
              disabled={isFollowUpdating}
              className={`flex-1 h-10 px-4 rounded-xl font-dm-sans text-[13px] font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-2 active:scale-95 motion-reduce:transform-none disabled:active:scale-100 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                isFollowing
                  ? 'border border-[#2F5233] text-[#2F5233] bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                  : 'bg-[#2F5233] text-white hover:bg-[#25401F] shadow-xs'
              }`}
            >
              {isFollowUpdating ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isFollowing ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Following</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Follow</span>
                </>
              )}
            </button>
          )}

          <Link
            to={viewProfileUrl}
            onClick={() => onClose()}
            className={`h-10 px-4 rounded-xl font-dm-sans text-[13px] font-semibold transition-all flex items-center justify-center gap-1.5 border border-[#DCE3D5] bg-[#F3F6EE] hover:bg-[#E2EAD9] text-[#2F5233] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-2 active:scale-95 motion-reduce:transform-none cursor-pointer ${
              isSelf ? 'w-full' : 'flex-1'
            }`}
          >
            <span>{isSelf ? 'View Your Profile' : 'View Profile'}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );

  // Wrap in backdrop overlay with AnimatePresence for clean entrance and exit without blocking clicks
  return (
    <AnimatePresence>
      {isOpen && userId && (
        <motion.div
          key={`user-profile-preview-overlay-${userId}`}
          className={`fixed inset-0 z-50 ${
            isMobile || !triggerEl
              ? 'flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs'
              : 'bg-black/20 backdrop-blur-[1px]'
          }`}
          onClick={onClose}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={shouldReduceMotion ? reducedMotionVariants : popoverBackdropVariants}
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
