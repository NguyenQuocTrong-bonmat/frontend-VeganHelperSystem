import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getFollowers, getFollowing, unfollowUser } from '../../services/userService';
import { getImageUrl } from '../../utils/imageUtils';
import { formatDate } from '../../utils/dateUtils';
import { motion, useReducedMotion } from 'framer-motion';
import ModalMotion from '../ui/ModalMotion';

/**
 * FollowListModal
 * Displays a modal dialog with tabs for Followers and Following users.
 */
export default function FollowListModal({
  isOpen,
  onClose,
  userId,
  initialTab = 'followers',
  followersCount = null,
  followingCount = null,
}) {
  const shouldReduceMotion = useReducedMotion();
  let currentUser = null;
  try {
    const auth = useAuth();
    currentUser = auth?.user;
  } catch {
    currentUser = null;
  }

  const [activeTab, setActiveTab] = useState(initialTab);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [unfollowingId, setUnfollowingId] = useState(null);
  const [tabCounts, setTabCounts] = useState({
    followers: followersCount,
    following: followingCount,
  });

  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  const isOwnProfile = Boolean(
    currentUser?.id &&
    userId &&
    String(currentUser.id) === String(userId)
  );

  // Sync initial tab and counts when props change
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    setTabCounts((prev) => ({
      followers: followersCount !== null ? followersCount : prev.followers,
      following: followingCount !== null ? followingCount : prev.following,
    }));
  }, [followersCount, followingCount]);

  const loadList = useCallback(async (tab, targetUserId) => {
    if (!targetUserId) return;
    setLoading(true);
    setError(null);

    try {
      let data;
      if (tab === 'followers') {
        data = await getFollowers(targetUserId, 1, 50);
      } else {
        data = await getFollowing(targetUserId, 1, 50);
      }

      const list = Array.isArray(data) ? data : data?.items || [];
      const actualCount = typeof data?.totalCount === 'number' ? data.totalCount : list.length;
      setItems(list);
      setTabCounts((prev) => ({
        ...prev,
        [tab]: actualCount,
      }));
    } catch (err) {
      console.error('Failed to load follow list:', err);
      setError('Unable to load user list. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && userId) {
      loadList(activeTab, userId);

      // Refresh other tab count in background if unknown or 0
      const otherTab = activeTab === 'followers' ? 'following' : 'followers';
      const fetchOtherCount = otherTab === 'followers' ? getFollowers : getFollowing;
      if (typeof fetchOtherCount === 'function') {
        try {
          const promise = fetchOtherCount(userId, 1, 1);
          if (promise && typeof promise.then === 'function') {
            promise
              .then((data) => {
                const count = typeof data?.totalCount === 'number' ? data.totalCount : (data?.items?.length ?? 0);
                setTabCounts((prev) => ({ ...prev, [otherTab]: count }));
              })
              .catch(() => { });
          }
        } catch {
          // ignore background count fetch error
        }
      }

      const focusTimer = setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);

      // Lock body scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        clearTimeout(focusTimer);
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, activeTab, userId, loadList]);

  const handleUnfollow = async (targetUserId, targetName) => {
    if (!targetUserId || unfollowingId) return;
    setUnfollowingId(targetUserId);

    try {
      await unfollowUser(targetUserId);
      setItems((prev) => prev.filter((item) => String(item.id) !== String(targetUserId)));
      setTabCounts((prev) => ({
        ...prev,
        following: Math.max(0, (prev.following ?? 1) - 1),
      }));

      // Broadcast global event
      window.dispatchEvent(
        new CustomEvent('veganhelper:follow-changed', {
          detail: {
            userId: targetUserId,
            isFollowing: false,
          },
        })
      );

      toast.success(`Unfollowed ${targetName || 'user'}`);
    } catch (err) {
      toast.error('Failed to unfollow user. Please try again.');
    } finally {
      setUnfollowingId(null);
    }
  };

  // Keyboard Escape handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <ModalMotion
      isOpen={Boolean(isOpen && userId)}
      onClose={onClose}
      backdropClassName="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      dialogClassName="w-full max-w-md bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]"
      ariaLabelledBy="follow-list-title"
      dialogRef={modalRef}
      closeOnEscape={false}
    >
      {/* Modal Header */}
      <div className="p-4 border-b border-[#DCE3D5] flex items-center justify-between bg-white">
        <h2 id="follow-list-title" className="font-fraunces font-semibold text-lg text-[#2B2A25]">
          Connections
        </h2>
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-[#F3F6EE] hover:bg-[#E2EAD9] text-[#6B6F63] hover:text-[#2B2A25] flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none cursor-pointer"
          aria-label="Close dialog"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tabs: Followers / Following */}
      <div className="flex border-b border-[#DCE3D5] bg-[#FDFBF6]" role="tablist" aria-label="Followers and Following">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'followers'}
          onClick={() => setActiveTab('followers')}
          className={`relative flex-1 py-3 text-sm font-dm-sans font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-[0.99] motion-reduce:transform-none ${activeTab === 'followers'
              ? 'text-[#2F5233]'
              : 'text-[#6B6F63] hover:text-[#2B2A25]'
            }`}
        >
          <span>Followers {(tabCounts.followers ?? followersCount) !== null && `(${tabCounts.followers ?? followersCount})`}</span>
          {activeTab === 'followers' && (
            <motion.div
              layoutId="follow-list-active-tab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2F5233]"
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'following'}
          onClick={() => setActiveTab('following')}
          className={`relative flex-1 py-3 text-sm font-dm-sans font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-[0.99] motion-reduce:transform-none ${activeTab === 'following'
              ? 'text-[#2F5233]'
              : 'text-[#6B6F63] hover:text-[#2B2A25]'
            }`}
        >
          <span>Following {(tabCounts.following ?? followingCount) !== null && `(${tabCounts.following ?? followingCount})`}</span>
          {activeTab === 'following' && (
            <motion.div
              layoutId="follow-list-active-tab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2F5233]"
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
        </button>
      </div>

      {/* Content list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex items-center gap-3 p-2 animate-pulse">
                <div className="w-11 h-11 rounded-full bg-[#E9EFE6] shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="w-28 h-4 bg-[#E9EFE6] rounded" />
                  <div className="w-20 h-3 bg-[#E9EFE6] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-8 text-center text-sm text-red-700 bg-red-50 rounded-xl p-4">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => loadList(activeTab, userId)}
              className="mt-2 text-xs font-semibold underline hover:text-red-900 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-[#6B6F63]">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#F3F6EE] text-[#2F5233] flex items-center justify-center text-2xl">
              🌿
            </div>
            <p className="font-fraunces font-semibold text-base text-[#2B2A25]">
              {activeTab === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
            </p>
            <p className="text-xs text-[#6B6F63] mt-1 max-w-xs mx-auto">
              {activeTab === 'followers'
                ? 'When members follow this profile, they will appear here.'
                : 'Explore recipes and connect with creators in the community.'}
            </p>
          </div>
        ) : (
          items.map((item) => {
            const isItemSelf = Boolean(currentUser?.id && String(currentUser.id) === String(item.id));
            const profileUrl = isItemSelf ? '/my-posts' : `/users/${item.id}`;
            const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              item.displayName || item.username || 'User'
            )}&background=E9EFE6&color=2F5233&size=96`;
            const avatarSrc =
              !imageErrors[item.id] && item.avatarUrl
                ? getImageUrl(item.avatarUrl)
                : fallbackUrl;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white border border-transparent hover:border-[#DCE3D5] transition-all duration-150"
              >
                <Link
                  to={profileUrl}
                  onClick={onClose}
                  className="flex items-center gap-3 min-w-0 flex-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] rounded-lg p-0.5"
                >
                  <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border border-[#DCE3D5] bg-[#E9EFE6]">
                    <img
                      src={avatarSrc}
                      alt={item.displayName || item.username || 'User'}
                      onError={() =>
                        setImageErrors((prev) => ({ ...prev, [item.id]: true }))
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-fraunces font-semibold text-sm text-[#2B2A25] group-hover:text-[#2F5233] truncate transition-colors">
                        {item.displayName || item.username || 'User'}
                      </h4>
                      {isItemSelf && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2F5233] bg-[#E9EFE6] px-1.5 py-0.2 rounded">
                          You
                        </span>
                      )}
                    </div>
                    {item.username && (
                      <p className="text-xs text-[#6B6F63] truncate">@{item.username}</p>
                    )}
                    {item.followedAt && (
                      <p className="text-[10px] text-[#6B6F63]/80 mt-0.5">
                        Since {formatDate(item.followedAt)}
                      </p>
                    )}
                  </div>
                </Link>

                {isOwnProfile && activeTab === 'following' && !isItemSelf ? (
                  <button
                    type="button"
                    onClick={() => handleUnfollow(item.id, item.displayName || item.username)}
                    disabled={unfollowingId === item.id}
                    className="text-xs font-dm-sans font-semibold px-3 py-1.5 rounded-lg border border-[#DCE3D5] bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-300 text-[#6B6F63] transition-all shrink-0 ml-2 cursor-pointer disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 active:scale-95 motion-reduce:transform-none"
                  >
                    {unfollowingId === item.id ? 'Unfollowing...' : 'Unfollow'}
                  </button>
                ) : (
                  <Link
                    to={profileUrl}
                    onClick={onClose}
                    className="text-xs font-dm-sans font-semibold px-3 py-1.5 rounded-lg border border-[#DCE3D5] bg-[#F3F6EE] hover:bg-[#2F5233] hover:text-white text-[#2F5233] transition-all shrink-0 ml-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none"
                  >
                    {isItemSelf ? 'Your Garden' : 'View'}
                  </Link>
                )}
              </div>
            );
          })
        )}
      </div>
    </ModalMotion>
  );
}
