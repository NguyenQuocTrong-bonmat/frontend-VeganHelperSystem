import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import AIChatbot from '../../components/chat/AIChatbot';
import { deletePost, getMyPosts, getCategories } from '../../services/postService';
import { getFollowStatus, getFollowers, getFollowing } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/imageUtils';
import { formatDate } from '../../utils/dateUtils';
import { motion, useReducedMotion } from 'framer-motion';
import SavedPosts from './SavedPosts';
import FollowListModal from '../../components/home/FollowListModal';
import ModalMotion from '../../components/ui/ModalMotion';
import PostStatusBadge, { resolvePostStatus, extractModerationReason, PostStatusNotice } from '../../components/posts/PostStatusBadge';
import RecipeMediaRenderer from '../../components/posts/RecipeMediaRenderer';

// Shared media renderer with video detection, muted hover preview, and botanical fallback
const RecipeCardImage = RecipeMediaRenderer;

function MyPosts({ notifications = [] } = {}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [activeTab, setActiveTab] = useState('my-posts');
  const [posts, setPosts] = useState([]);
  const [totalPostsCount, setTotalPostsCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categories, setCategories] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  // Followers & Following state
  const [followStats, setFollowStats] = useState({
    followersCount: null,
    followingCount: null,
    loading: true,
  });

  const [followListModal, setFollowListModal] = useState({
    isOpen: false,
    initialTab: 'followers',
  });

  // Load followers and following counts
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    async function loadFollowStats() {
      try {
        let status = null;
        try {
          if (typeof getFollowStatus === 'function') {
            status = await getFollowStatus(user.id);
          }
        } catch {
          // getFollowStatus returns 400 for self profile on backend; fall back to count methods
          status = null;
        }

        if (!cancelled && status && typeof status.followersCount === 'number') {
          setFollowStats({
            followersCount: status.followersCount ?? 0,
            followingCount: status.followingCount ?? 0,
            loading: false,
          });
          return;
        }

        // Fetch counts directly from getFollowers and getFollowing pagination endpoints
        const [followersRes, followingRes] = await Promise.allSettled([
          getFollowers(user.id, 1, 1),
          getFollowing(user.id, 1, 1),
        ]);

        if (!cancelled) {
          const followersCount = followersRes.status === 'fulfilled'
            ? (followersRes.value?.totalCount ?? followersRes.value?.totalItems ?? (followersRes.value?.items?.length ?? 0))
            : (user?.followersCount ?? 0);
          const followingCount = followingRes.status === 'fulfilled'
            ? (followingRes.value?.totalCount ?? followingRes.value?.totalItems ?? (followingRes.value?.items?.length ?? 0))
            : (user?.followingCount ?? 0);

          setFollowStats({
            followersCount,
            followingCount,
            loading: false,
          });
          return;
        }
      } catch (err) {
        console.error('Failed to load follow status:', err);
      }
      if (!cancelled) {
        setFollowStats({
          followersCount: user?.followersCount ?? 0,
          followingCount: user?.followingCount ?? 0,
          loading: false,
        });
      }
    }

    loadFollowStats();
    return () => { cancelled = true; };
  }, [user?.id, user?.followersCount, user?.followingCount]);

  // Synchronize follow counts when follow events occur across the application
  useEffect(() => {
    const handleFollowChanged = () => {
      if (!user?.id) return;
      Promise.allSettled([
        getFollowers(user.id, 1, 1),
        getFollowing(user.id, 1, 1),
      ]).then(([followersRes, followingRes]) => {
        const followersCount = followersRes.status === 'fulfilled'
          ? (followersRes.value?.totalCount ?? followersRes.value?.totalItems ?? (followersRes.value?.items?.length ?? 0))
          : (user?.followersCount ?? 0);
        const followingCount = followingRes.status === 'fulfilled'
          ? (followingRes.value?.totalCount ?? followingRes.value?.totalItems ?? (followingRes.value?.items?.length ?? 0))
          : (user?.followingCount ?? 0);

        setFollowStats({
          followersCount,
          followingCount,
          loading: false,
        });
      }).catch(() => { });
    };

    window.addEventListener('veganhelper:follow-changed', handleFollowChanged);
    return () => window.removeEventListener('veganhelper:follow-changed', handleFollowChanged);
  }, [user?.id, user?.followersCount, user?.followingCount]);

  // Load user's posts, notifications (for moderation reasons), and categories
  const loadMyPosts = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setErrorMessage('');

      // 1. Fetch user's posts
      const data = await getMyPosts({ pageIndex: 1, pageSize: 50 });
      const items = data?.items || (Array.isArray(data) ? data : []);
      setPosts(items);

      // Authoritative pagination total
      const serverTotal = typeof data?.totalCount === 'number'
        ? data.totalCount
        : (typeof data?.totalItems === 'number' ? data.totalItems : items.length);
      setTotalPostsCount(serverTotal);

      // 2. Fetch categories
      try {
        const catsData = await getCategories();
        const catsList = Array.isArray(catsData) ? catsData : catsData?.items || [];
        const catsMap = {};
        catsList.forEach((category) => { catsMap[category.id] = category.name; });
        setCategories(catsMap);
      } catch (categoryError) {
        console.error('Failed to load categories:', categoryError);
      }
    } catch (err) {
      console.error('Failed to load my posts:', err);
      setErrorMessage(err.status === 401 ? 'Your session has expired. Please log in again.' : 'Failed to load your posts. Please try again.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadMyPosts();
  }, [loadMyPosts]);

  // Synchronize on post changed events
  useEffect(() => {
    const handlePostChanged = () => {
      loadMyPosts(true);
    };
    window.addEventListener('veganhelper:post-changed', handlePostChanged);
    return () => window.removeEventListener('veganhelper:post-changed', handlePostChanged);
  }, [loadMyPosts]);

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    try {
      setIsDeleting(true);
      await deletePost(postToDelete.id);
      setPosts((prev) => prev.filter(p => p.id !== postToDelete.id));
      setTotalPostsCount((prev) => Math.max(0, (prev ?? posts.length) - 1));
      setPostToDelete(null);
    } catch (err) {
      console.error('Delete error:', err);
      setErrorMessage(err.status === 401 ? 'Your session has expired. Please log in again.' : 'Failed to delete post.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Status breakdown calculations using authoritative resolver
  const statusCounts = posts.reduce(
    (acc, p) => {
      const info = resolvePostStatus(p);
      if (info.key === 'published') acc.published++;
      else if (info.key === 'under_review' || info.key === 'flagged') acc.underReview++;
      else if (info.key === 'hidden' || info.key === 'removed' || info.key === 'rejected') acc.restricted++;
      else if (info.key === 'draft') acc.draft++;
      return acc;
    },
    { published: 0, underReview: 0, restricted: 0, draft: 0 }
  );

  const displayPostCount = totalPostsCount !== null ? totalPostsCount : posts.length;

  // Filter posts based on selected status filter
  const filteredPosts = posts.filter((p) => {
    if (statusFilter === 'all') return true;
    const info = resolvePostStatus(p);
    if (statusFilter === 'published') return info.key === 'published';
    if (statusFilter === 'under_review') return info.key === 'under_review' || info.key === 'flagged';
    if (statusFilter === 'restricted') return info.key === 'hidden' || info.key === 'removed' || info.key === 'rejected';
    if (statusFilter === 'draft') return info.key === 'draft';
    return true;
  });

  const followersDisplay = followStats.loading && followStats.followersCount === null ? (
    <span className="inline-block w-6 h-5 bg-vh-mint/60 rounded animate-pulse" />
  ) : (
    followStats.followersCount ?? user?.followersCount ?? 0
  );

  const followingDisplay = followStats.loading && followStats.followingCount === null ? (
    <span className="inline-block w-6 h-5 bg-vh-mint/60 rounded animate-pulse" />
  ) : (
    followStats.followingCount ?? user?.followingCount ?? 0
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F0]">
      <HeaderMember />

      {errorMessage && (
        <div className="mx-auto w-full max-w-[1140px] px-4 sm:px-6 md:px-8 pt-4">
          <div role="alert" className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => loadMyPosts(false)}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 hover:bg-red-200 text-red-800 transition-colors cursor-pointer"
              >
                Try again
              </button>
              <Link to="/login" className="underline font-semibold text-xs hover:text-red-900">Log in</Link>
            </div>
          </div>
        </div>
      )}

      {/* BOTANICAL EDITORIAL PROFILE HEADER */}
      <section className="w-full bg-[#FAF8F0] border-b border-[#DCE5D9]/80">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">

            {/* Left & Center: Identity + Bio + Stats */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 flex-1 min-w-0 text-center sm:text-left">
              {/* Avatar */}
              <div className="shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white shadow-sm overflow-hidden bg-[#E9EFE6] ring-1 ring-[#DCE5D9] flex items-center justify-center">
                  {user?.avatarUrl ? (
                    <img
                      src={getImageUrl(user.avatarUrl)}
                      alt={user.displayName || 'Avatar'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-fraunces text-3xl sm:text-4xl font-bold text-[#2F5233] bg-[#E9EFE6] select-none">
                      {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
              </div>

              {/* Information Column */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap mb-1">
                  <h1 className="font-fraunces text-2xl sm:text-3xl font-semibold text-[#2B2A25] tracking-tight">
                    {user?.displayName || 'Creator'}
                  </h1>
                  {user?.dietType && (
                    <span className="text-xs font-semibold capitalize px-2.5 py-0.5 rounded-full bg-[#F3F6EE] text-[#2F5233] border border-[#DCE3D5]">
                      🌱 {user.dietType.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-medium text-[#6B6F63] mb-2">
                  @{user?.username || 'user'}
                </p>

                <p className="text-xs sm:text-sm text-[#4E5246] max-w-xl font-dm-sans leading-relaxed mb-3">
                  {user?.bio || "Culinary garden & plant-based kitchen recipes. Sharing wholesome vegan inspiration with the community."}
                </p>

                {/* Compact Social & Content Statistics */}
                <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4 flex-wrap text-xs font-dm-sans">
                  <div className="flex items-center gap-1.5">
                    <span className="font-fraunces font-bold text-base sm:text-lg text-[#2B2A25]">
                      {displayPostCount}
                    </span>
                    <span className="text-xs text-[#6B6F63] font-medium uppercase tracking-wider">
                      Posts
                    </span>
                  </div>

                  <div className="w-px h-3.5 bg-[#DCE5D9]" aria-hidden="true" />

                  <button
                    type="button"
                    onClick={() => setFollowListModal({ isOpen: true, initialTab: 'followers' })}
                    className="flex items-center gap-1.5 hover:text-[#2F5233] transition-all cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] rounded-lg p-0.5 active:scale-95 motion-reduce:transform-none"
                    title="View your followers"
                  >
                    <span className="font-fraunces font-bold text-base sm:text-lg text-[#2B2A25] group-hover:text-[#2F5233] transition-colors">
                      {followersDisplay}
                    </span>
                    <span className="text-xs text-[#6B6F63] group-hover:text-[#2F5233] font-medium uppercase tracking-wider transition-colors">
                      Followers
                    </span>
                  </button>

                  <div className="w-px h-3.5 bg-[#DCE5D9]" aria-hidden="true" />

                  <button
                    type="button"
                    onClick={() => setFollowListModal({ isOpen: true, initialTab: 'following' })}
                    className="flex items-center gap-1.5 hover:text-[#2F5233] transition-all cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] rounded-lg p-0.5 active:scale-95 motion-reduce:transform-none"
                    title="View who you are following"
                  >
                    <span className="font-fraunces font-bold text-base sm:text-lg text-[#2B2A25] group-hover:text-[#2F5233] transition-colors">
                      {followingDisplay}
                    </span>
                    <span className="text-xs text-[#6B6F63] group-hover:text-[#2F5233] font-medium uppercase tracking-wider transition-colors">
                      Following
                    </span>
                  </button>

                  {/* Attention badges for owner awareness */}
                  {statusCounts.underReview > 0 && (
                    <>
                      <div className="w-px h-3.5 bg-[#DCE5D9]" aria-hidden="true" />
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        {statusCounts.underReview} Under Review
                      </span>
                    </>
                  )}

                  {statusCounts.restricted > 0 && (
                    <>
                      <div className="w-px h-3.5 bg-[#DCE5D9]" aria-hidden="true" />
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300">
                        {statusCounts.restricted} Restricted
                      </span>
                    </>
                  )}

                  {statusCounts.draft > 0 && (
                    <>
                      <div className="w-px h-3.5 bg-[#DCE5D9]" aria-hidden="true" />
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        {statusCounts.draft} Draft{statusCounts.draft > 1 ? 's' : ''}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Profile Actions */}
            <div className="flex items-center justify-center sm:justify-start md:justify-end gap-2.5 shrink-0 self-center md:self-start pt-1">
              <button
                type="button"
                onClick={() => navigate('/posts/create')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2F5233] hover:bg-[#25401F] text-white text-xs sm:text-sm font-semibold font-dm-sans transition-all shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Write Recipe</span>
              </button>

              <Link
                to="/profile"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#DCE3D5] bg-white hover:bg-[#F3F6EE] text-[#2F5233] text-xs sm:text-sm font-semibold font-dm-sans transition-all shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
                <span>Edit Profile</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* BOTANICAL CONTENT SWITCHER */}
      <div className="w-full max-w-[1140px] mx-auto px-4 sm:px-6 md:px-8 pt-4 pb-1">
        <div className="flex items-center justify-between border-b border-[#DCE5D9]/70 pb-3.5">
          <nav
            className="inline-flex p-1 sm:p-1.5 bg-[#E8EEE4]/60 border border-[#DCE5D9] rounded-2xl shadow-2xs backdrop-blur-xs select-none max-w-full overflow-x-auto no-scrollbar"
            role="tablist"
            aria-label="Profile navigation"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'my-posts'}
              onClick={() => setActiveTab('my-posts')}
              className={`relative px-4 sm:px-5 py-2.5 rounded-xl font-dm-sans font-semibold text-sm flex items-center gap-2.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-1 active:scale-[0.98] motion-reduce:transform-none shrink-0 ${activeTab === 'my-posts'
                  ? 'text-white'
                  : 'text-[#556052] hover:text-[#2B2A25]'
                }`}
            >
              {activeTab === 'my-posts' && (
                <motion.div
                  layoutId="my-posts-active-tab"
                  className="absolute inset-0 bg-[#2F5233] rounded-xl shadow-xs"
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                <span>My Posts</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${activeTab === 'my-posts'
                      ? 'bg-white/20 text-white'
                      : 'bg-white/80 text-[#2F5233] border border-[#DCE3D5]'
                    }`}
                >
                  {displayPostCount}
                </span>
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'saved'}
              onClick={() => setActiveTab('saved')}
              className={`relative px-4 sm:px-5 py-2.5 rounded-xl font-dm-sans font-semibold text-sm flex items-center gap-2.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-1 active:scale-[0.98] motion-reduce:transform-none shrink-0 ${activeTab === 'saved'
                  ? 'text-white'
                  : 'text-[#556052] hover:text-[#2B2A25]'
                }`}
            >
              {activeTab === 'saved' && (
                <motion.div
                  layoutId="my-posts-active-tab"
                  className="absolute inset-0 bg-[#2F5233] rounded-xl shadow-xs"
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
                <span>Saved Recipes</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition-colors ${activeTab === 'saved'
                      ? 'bg-white/20 text-white'
                      : 'bg-[#E8EEE4] text-[#4A7A4D]'
                    }`}
                >
                  Private
                </span>
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      {activeTab === 'my-posts' ? (
        <main className="flex-1 w-full max-w-[1140px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
          {/* Sub-Filter Bar & State Refresh Button */}
          {!loading && posts.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#DCE5D9]">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1" role="group" aria-label="Filter recipes by status">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-dm-sans transition-all cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none ${statusFilter === 'all'
                      ? 'bg-[#2F5233] text-white shadow-xs'
                      : 'bg-white text-[#6B6F63] hover:text-[#2B2A25] border border-[#DCE5D9]'
                    }`}
                >
                  All ({posts.length})
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('published')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-dm-sans transition-all cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none ${statusFilter === 'published'
                      ? 'bg-[#2F5233] text-white shadow-xs'
                      : 'bg-white text-[#2F5233] hover:bg-[#F3F6EE] border border-[#DCE5D9]'
                    }`}
                >
                  Published ({statusCounts.published})
                </button>

                {statusCounts.underReview > 0 && (
                  <button
                    type="button"
                    onClick={() => setStatusFilter('under_review')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-dm-sans transition-all cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 active:scale-95 motion-reduce:transform-none ${statusFilter === 'under_review'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                      }`}
                  >
                    Under Review ({statusCounts.underReview})
                  </button>
                )}

                {statusCounts.restricted > 0 && (
                  <button
                    type="button"
                    onClick={() => setStatusFilter('restricted')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-dm-sans transition-all cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 active:scale-95 motion-reduce:transform-none ${statusFilter === 'restricted'
                        ? 'bg-red-700 text-white shadow-xs'
                        : 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-300'
                      }`}
                  >
                    Hidden / Restricted ({statusCounts.restricted})
                  </button>
                )}

                {statusCounts.draft > 0 && (
                  <button
                    type="button"
                    onClick={() => setStatusFilter('draft')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-dm-sans transition-all cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 active:scale-95 motion-reduce:transform-none ${statusFilter === 'draft'
                        ? 'bg-amber-700 text-white shadow-xs'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                      }`}
                  >
                    Drafts ({statusCounts.draft})
                  </button>
                )}
              </div>

              {/* Refresh Button to fetch updated status after decision */}
              <button
                type="button"
                onClick={() => loadMyPosts(true)}
                disabled={isRefreshing || loading}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F3F6EE] text-[#4E5246] hover:text-[#2F5233] text-xs font-semibold font-dm-sans border border-[#DCE5D9] transition-all shadow-xs cursor-pointer disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none shrink-0 self-end sm:self-center"
                title="Refresh posts"
                aria-label="Refresh posts"
              >
                <svg className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#2F5233]' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          )}

          {loading ? (
            <div className="w-full py-20 flex flex-col items-center justify-center text-[#6B6F63] gap-4">
              <div className="w-10 h-10 border-3 border-[#DCE3D5] border-t-[#2F5233] rounded-full animate-spin" />
              <p className="font-fraunces text-sm text-[#2F5233] font-medium tracking-wide">Gathering your recipe journal...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="w-full py-14 sm:py-20 px-4 sm:px-6 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-[#DCE5D9] shadow-xs">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-5 bg-[#F3F6EE] rounded-full flex items-center justify-center text-3xl sm:text-4xl shadow-inner border border-[#DCE3D5]">
                🪴
              </div>
              <h2 className="font-fraunces text-xl sm:text-2xl font-semibold text-[#2B2A25] mb-2">
                Your garden is ready to bloom
              </h2>
              <p className="font-dm-sans text-[#6B6F63] text-sm mb-7 max-w-md">
                You haven't published any recipes yet. Share your favorite plant-based creations and nourish the community.
              </p>
              <button
                type="button"
                onClick={() => navigate('/posts/create')}
                className="px-6 py-2.5 bg-[#2F5233] hover:bg-[#25401F] text-white rounded-full font-dm-sans text-sm font-semibold transition-all shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-2 active:scale-95 motion-reduce:transform-none"
              >
                Create Your First Recipe
              </button>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="w-full py-12 sm:py-16 px-4 sm:px-6 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-[#DCE5D9] shadow-xs">
              <p className="font-dm-sans text-[#6B6F63] text-sm mb-4">
                No recipes found matching the "{statusFilter.replace('_', ' ')}" filter.
              </p>
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className="px-4 py-2 bg-[#F3F6EE] hover:bg-[#2F5233] text-[#2F5233] hover:text-white rounded-full font-dm-sans text-xs font-semibold transition-all border border-[#DCE3D5] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none"
              >
                Show All Recipes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {filteredPosts.map((post) => {
                const statusInfo = resolvePostStatus(post);
                const reason = extractModerationReason(post, notifications);

                return (
                  <article
                    key={post.id}
                    data-testid={`post-card-${post.id}`}
                    data-status={statusInfo.key}
                    className="flex flex-col rounded-2xl overflow-hidden transition-all duration-200 group bg-white border border-[#DCE5D9] hover:border-[#2F5233]/40 shadow-xs hover:shadow-md"
                  >
                    {/* Top subtle red accent status strip for flagged or restricted posts */}
                    {statusInfo.isRed && (
                      <div
                        data-testid="post-red-strip"
                        className="h-1 w-full bg-[#E05252] shrink-0"
                        aria-hidden="true"
                      />
                    )}

                    {/* Photo Container */}
                    <div
                      className="relative w-full aspect-[4/3] bg-[#E9EFE6] overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-2"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(`/posts/${post.id}`);
                        }
                      }}
                      onClick={() => navigate(`/posts/${post.id}`)}
                    >
                      <RecipeCardImage
                        post={post}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                      />

                      {/* Category Overlay Tag */}
                      <div className="absolute top-3 left-3 max-w-[45%] truncate px-2.5 py-1 bg-white/90 backdrop-blur-xs rounded-full border border-white/60 text-[#2F5233] font-dm-sans text-[11px] font-semibold shadow-xs select-none">
                        {categories[post.categoryId] || post.categoryName || post.category?.name || 'Recipe'}
                      </div>

                      {/* Status Badge placed prominently near the top right of each card */}
                      <div className="absolute top-3 right-3 select-none">
                        <PostStatusBadge post={post} />
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="flex-1 flex flex-col justify-between p-4 sm:p-5">
                      <div>
                        {/* Explanatory Banner & Reason for Restricted Posts */}
                        <PostStatusNotice post={post} reason={reason} className="mb-3" />

                        <div
                          onClick={() => navigate(`/posts/${post.id}`)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              navigate(`/posts/${post.id}`);
                            }
                          }}
                          tabIndex={0}
                          className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] rounded px-0.5 active:opacity-80"
                        >
                          <div className="flex items-center gap-2 mb-1.5 text-xs text-[#6B6F63] font-medium">
                            <time dateTime={post.createdAt}>
                              {formatDate(post.createdAt)}
                            </time>
                          </div>

                          <h3 className="font-fraunces text-lg font-semibold text-[#2B2A25] mb-2 leading-snug group-hover:text-[#2F5233] transition-colors line-clamp-1">
                            {post.title}
                          </h3>

                          <p className="text-xs leading-relaxed font-dm-sans text-[#6B6F63] line-clamp-2 mb-4">
                            {post.content || 'Plant-based recipe created with fresh botanical ingredients.'}
                          </p>
                        </div>
                      </div>

                      {/* Footer Stats & Owner Controls */}
                      <div className="pt-3 border-t border-[#DCE5D9]/70 flex items-center justify-between text-xs font-dm-sans mt-auto">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-[#6B6F63]" title="Views">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <strong className="font-semibold text-[#2B2A25]">{post.viewCount || 0}</strong>
                          </span>

                          <span
                            className="flex items-center gap-1 text-[#D9534F]"
                            aria-label={`${post.likeCount ?? 0} likes`}
                            title="Likes"
                          >
                            <svg aria-hidden="true" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <strong className="font-semibold text-[#2B2A25]">{post.likeCount ?? 0}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/posts/edit/${post.id}`);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F3F6EE] hover:bg-[#2F5233] text-[#2F5233] hover:text-white transition-all border border-[#DCE3D5] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-90 motion-reduce:transform-none"
                            title="Edit post"
                            aria-label={`Edit ${post.title}`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPostToDelete({ id: post.id, title: post.title });
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition-all border border-red-100 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 active:scale-90 motion-reduce:transform-none"
                            title="Delete post"
                            aria-label={`Delete ${post.title}`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      ) : (
        <SavedPosts isComponent={true} />
      )}

      {/* DELETE CONFIRMATION MODAL OVERLAY */}
      <ModalMotion
        isOpen={Boolean(postToDelete)}
        onClose={() => {
          if (!isDeleting) setPostToDelete(null);
        }}
        backdropClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
        dialogClassName="bg-[#FDFBF6] border border-[#DCE5D9] rounded-2xl p-6 w-full max-w-sm shadow-xl"
        ariaLabelledBy="delete-recipe-title"
      >
        <h3 id="delete-recipe-title" className="font-fraunces text-xl font-semibold text-[#2B2A25] mb-2">
          Delete Recipe?
        </h3>
        <p className="font-dm-sans text-[#6B6F63] text-sm mb-6">
          Are you sure you want to delete {postToDelete?.title ? `"${postToDelete.title}"` : 'this recipe'}? This action cannot be undone.
        </p>
        <div className="flex gap-2.5 justify-end">
          <button
            type="button"
            onClick={() => setPostToDelete(null)}
            className="px-4 py-2 rounded-full font-dm-sans text-xs font-semibold text-[#6B6F63] hover:bg-[#F3F6EE] transition-all border border-[#DCE5D9] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteConfirm}
            className="px-4 py-2 rounded-full font-dm-sans text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-all shadow-xs flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 active:scale-95 motion-reduce:transform-none disabled:active:scale-100"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </ModalMotion>

      {/* Followers & Following Modal */}
      {user?.id && (
        <FollowListModal
          isOpen={followListModal.isOpen}
          onClose={() => setFollowListModal({ isOpen: false, initialTab: 'followers' })}
          userId={user.id}
          initialTab={followListModal.initialTab}
          followersCount={followStats.followersCount}
          followingCount={followStats.followingCount}
        />
      )}

      <AIChatbot />
      <Footer />
    </div>
  );
}

export default MyPosts;
