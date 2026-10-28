import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import AIChatbot from '../../components/chat/AIChatbot';
import FollowListModal from '../../components/home/FollowListModal';
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
import { isNotFoundError } from '../../utils/errorUtils';
import { formatDate, getTimeAgo } from '../../utils/dateUtils';

function PublicUserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  let currentUser = null;
  let isAuthenticated = false;
  try {
    const auth = useAuth();
    currentUser = auth?.user;
    isAuthenticated = Boolean(auth?.isAuthenticated);
  } catch {
    currentUser = null;
    isAuthenticated = false;
  }

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [followStatus, setFollowStatus] = useState(null);
  const [isFollowUpdating, setIsFollowUpdating] = useState(false);
  const [followListModal, setFollowListModal] = useState({
    isOpen: false,
    initialTab: 'followers',
  });

  const isSelf = Boolean(
    currentUser?.id &&
    id &&
    String(currentUser.id) === String(id)
  );

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        const profilePromise = getPublicProfile(id);

        let followPromise;
        if (isSelf) {
          // Bypasses 400 Bad Request on self follow-status
          followPromise = Promise.allSettled([
            getFollowers(id, 1, 1),
            getFollowing(id, 1, 1),
          ]);
        } else if (isAuthenticated) {
          followPromise = getFollowStatus(id);
        } else {
          followPromise = Promise.allSettled([
            getFollowers(id, 1, 1),
            getFollowing(id, 1, 1),
          ]);
        }

        const [profileData, followRes] = await Promise.all([profilePromise, followPromise]);
        if (cancelled) return;

        setProfile(profileData);
        setError(null);

        if (isSelf || !isAuthenticated) {
          const [followersRes, followingRes] = followRes;
          const followersCount = followersRes.status === 'fulfilled'
            ? (followersRes.value?.totalCount ?? followersRes.value?.totalItems ?? (followersRes.value?.items?.length ?? 0))
            : (currentUser?.followersCount ?? 0);
          const followingCount = followingRes.status === 'fulfilled'
            ? (followingRes.value?.totalCount ?? followingRes.value?.totalItems ?? (followingRes.value?.items?.length ?? 0))
            : (currentUser?.followingCount ?? 0);

          setFollowStatus({
            userId: id,
            isFollowing: false,
            followersCount,
            followingCount,
            notifyOnNewPost: false,
          });
        } else {
          setFollowStatus(followRes);
        }
      } catch (err) {
        if (cancelled) return;
        if (isNotFoundError(err)) {
          navigate('/404', { replace: true });
          return;
        }
        setError('Failed to load profile.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [id, isSelf, isAuthenticated, currentUser?.followersCount, currentUser?.followingCount, navigate]);

  // Synchronize with external follow changes
  useEffect(() => {
    const handleFollowChanged = (e) => {
      const detail = e.detail;
      if (!detail) return;
      if (id && String(detail.userId) === String(id)) {
        setFollowStatus((prev) => ({
          ...prev,
          ...detail,
        }));
      }
    };
    window.addEventListener('veganhelper:follow-changed', handleFollowChanged);
    return () => window.removeEventListener('veganhelper:follow-changed', handleFollowChanged);
  }, [id]);

  const handleToggleFollow = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to follow creators.');
      navigate('/login');
      return;
    }

    if (isSelf || isFollowUpdating || !id) return;

    const previousFollow = followStatus?.isFollowing ?? false;
    const previousFollowers = followStatus?.followersCount ?? 0;
    const nextFollow = !previousFollow;
    const nextFollowers = Math.max(0, previousFollow ? previousFollowers - 1 : previousFollowers + 1);

    // Optimistic UI update
    setFollowStatus((prev) => ({
      ...prev,
      userId: id,
      isFollowing: nextFollow,
      followersCount: nextFollowers,
    }));
    setIsFollowUpdating(true);

    try {
      let res;
      if (nextFollow) {
        res = await followUser(id);
      } else {
        res = await unfollowUser(id);
      }

      const authoritativeStatus = {
        userId: id,
        isFollowing: res?.isFollowing !== undefined ? res.isFollowing : nextFollow,
        followersCount: res?.followersCount !== undefined ? res.followersCount : nextFollowers,
        followingCount: res?.followingCount !== undefined ? res.followingCount : (followStatus?.followingCount ?? 0),
        notifyOnNewPost: Boolean(res?.notifyOnNewPost),
      };

      setFollowStatus(authoritativeStatus);

      // Broadcast global event for cross-screen consistency
      window.dispatchEvent(
        new CustomEvent('veganhelper:follow-changed', {
          detail: {
            userId: id,
            ...authoritativeStatus,
          },
        })
      );

      toast.success(nextFollow ? `Following ${profile?.displayName || 'creator'}` : `Unfollowed ${profile?.displayName || 'creator'}`);
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFBF6]">
        <HeaderMember />
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-[#6B6F63]">
            <div className="w-10 h-10 border-4 border-[#DCE3D5] border-t-[#2F5233] rounded-full animate-spin"></div>
            <p className="font-medium">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFBF6]">
        <HeaderMember />
        <div className="flex-grow flex items-center justify-center py-12 sm:py-20 px-4">
          <div className="text-center bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-6 sm:p-10 max-w-md w-full">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#F3F6EE] text-[#2F5233] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h2 className="font-fraunces text-2xl font-semibold text-[#2B2A25] mb-2">{error || 'User not found.'}</h2>
            <p className="text-[#6B6F63] mb-6">Please try again, or return home and open the profile again.</p>
            <button onClick={() => navigate('/home')} className="px-6 py-2.5 bg-[#2F5233] text-white rounded-lg font-medium hover:bg-[#25401F] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-2 active:scale-95 motion-reduce:transform-none">
              Return Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const followersDisplay = followStatus?.followersCount !== undefined && followStatus?.followersCount !== null
    ? followStatus.followersCount
    : '—';
  const followingDisplay = followStatus?.followingCount !== undefined && followStatus?.followingCount !== null
    ? followStatus.followingCount
    : '—';

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF6]">
      <HeaderMember />

      <main className="flex-grow max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        {/* Profile Header */}
        <section className="bg-[#FDFBF6] rounded-2xl sm:rounded-3xl mb-10 md:mb-16 relative overflow-hidden flex flex-col items-center border border-[#DCE3D5]/60 shadow-sm">
          {/* Subtle organic cover background */}
          <div className="absolute top-0 left-0 w-full h-32 sm:h-40 md:h-48 bg-gradient-to-b from-[#E9EFE6] to-[#FDFBF6] z-0">
            {/* Decorative SVG pattern */}
            <svg className="absolute inset-0 w-full h-full text-[#DCE3D5]/30" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
              <path d="M0,0 L100,0 L100,100 Q50,20 0,100 Z" fill="currentColor" />
            </svg>
          </div>

          <div className="relative z-10 w-full flex flex-col items-center pt-16 sm:pt-24 md:pt-28 pb-8 sm:pb-12 px-4 sm:px-6">
            <div className="mb-5">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-[#FDFBF6] shadow-md overflow-hidden bg-[#E9EFE6] flex items-center justify-center text-[#2F5233] text-4xl md:text-5xl font-semibold ring-1 ring-[#DCE3D5]">
                {profile.avatarUrl ? (
                  <img src={getImageUrl(profile.avatarUrl)} alt={profile.displayName} className="w-full h-full object-cover" />
                ) : (
                  profile.displayName?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
            </div>

            <h1 className="font-fraunces text-2xl sm:text-3xl md:text-5xl text-[#2B2A25] font-semibold mb-3 text-center tracking-tight break-words max-w-full">
              {profile.displayName}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base text-[#6B6F63] font-medium mb-6">
              {profile.username && (
                <span>@{profile.username}</span>
              )}
              {profile.dietType && (
                <>
                  <span className="w-1 h-1 rounded-full bg-[#DCE3D5]"></span>
                  <span className="capitalize px-3 py-1 bg-[#F3F6EE] text-[#2F5233] text-sm rounded-full border border-[#DCE3D5]/50">
                    {profile.dietType.replace(/_/g, ' ')}
                  </span>
                </>
              )}
              <span className="w-1 h-1 rounded-full bg-[#DCE3D5]"></span>
              <span>Joined {formatDate(profile.joinedAt)}</span>
            </div>

            {/* Profile Action Buttons */}
            {!isSelf ? (
              <div className="mb-8">
                <button
                  type="button"
                  onClick={handleToggleFollow}
                  disabled={isFollowUpdating}
                  className={`h-11 px-7 rounded-full font-dm-sans text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-2 active:scale-95 motion-reduce:transform-none disabled:active:scale-100 disabled:opacity-60 disabled:cursor-not-allowed ${followStatus?.isFollowing
                      ? 'border-2 border-[#2F5233] text-[#2F5233] bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                      : 'bg-[#2F5233] text-white hover:bg-[#25401F]'
                    }`}
                >
                  {isFollowUpdating ? (
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : followStatus?.isFollowing ? (
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
              </div>
            ) : (
              <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/profile"
                  className="h-10 px-5 rounded-full font-dm-sans text-sm font-semibold border border-[#DCE3D5] bg-white hover:bg-[#F3F6EE] text-[#2F5233] transition-all flex items-center gap-1.5 shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                  </svg>
                  <span>Edit Settings</span>
                </Link>
                <Link
                  to="/my-posts"
                  className="h-10 px-5 rounded-full font-dm-sans text-sm font-semibold bg-[#2F5233] hover:bg-[#25401F] text-white transition-all flex items-center gap-1.5 shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-2 active:scale-95 motion-reduce:transform-none"
                >
                  <span>My Garden</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            )}

            {/* 4-Stat Row: Published, Followers, Following, Likes */}
            <div className="w-full max-w-xl border-t border-[#DCE3D5]/50 pt-6 sm:pt-8 mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
              <div className="flex flex-col items-center">
                <span className="font-fraunces font-semibold text-2xl md:text-3xl text-[#2B2A25]">
                  {profile.publishedPostCount || 0}
                </span>
                <span className="text-xs text-[#6B6F63] font-medium uppercase tracking-widest mt-1">
                  Published
                </span>
              </div>

              <button
                type="button"
                onClick={() => setFollowListModal({ isOpen: true, initialTab: 'followers' })}
                className="flex flex-col items-center hover:text-[#2F5233] transition-all cursor-pointer group rounded-xl p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none"
                title="View followers"
              >
                <span className="font-fraunces font-semibold text-2xl md:text-3xl text-[#2B2A25] group-hover:text-[#2F5233] transition-colors">
                  {followersDisplay}
                </span>
                <span className="text-xs text-[#6B6F63] group-hover:text-[#2F5233] font-medium uppercase tracking-widest mt-1 transition-colors">
                  Followers
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFollowListModal({ isOpen: true, initialTab: 'following' })}
                className="flex flex-col items-center hover:text-[#2F5233] transition-all cursor-pointer group rounded-xl p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] active:scale-95 motion-reduce:transform-none"
                title="View following"
              >
                <span className="font-fraunces font-semibold text-2xl md:text-3xl text-[#2B2A25] group-hover:text-[#2F5233] transition-colors">
                  {followingDisplay}
                </span>
                <span className="text-xs text-[#6B6F63] group-hover:text-[#2F5233] font-medium uppercase tracking-widest mt-1 transition-colors">
                  Following
                </span>
              </button>

              <div className="flex flex-col items-center">
                <span className="font-fraunces font-semibold text-2xl md:text-3xl text-[#2B2A25]">
                  {profile.receivedLikeCount || 0}
                </span>
                <span className="text-xs text-[#6B6F63] font-medium uppercase tracking-widest mt-1">
                  Likes
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* User's Posts */}
        <section>
          <div className="flex items-center gap-4 mb-6 md:mb-10">
            <h2 className="font-fraunces text-xl sm:text-2xl md:text-3xl text-[#2B2A25] font-semibold">
              Published Recipes
            </h2>
            <div className="flex-1 h-px bg-[#DCE3D5]"></div>
          </div>

          {(!profile.posts || profile.posts.length === 0) ? (
            <div className="py-14 px-4 sm:py-20 md:py-24 text-center bg-[#FDFBF6] border border-[#DCE3D5] rounded-3xl flex flex-col items-center shadow-sm">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F3F6EE] text-[#2F5233] rounded-full flex items-center justify-center text-3xl sm:text-4xl mb-5 shadow-inner border border-[#DCE3D5]/30">
                🌿
              </div>
              <h3 className="font-fraunces text-2xl font-semibold text-[#2B2A25] mb-2">No published recipes yet</h3>
              <p className="text-[#6B6F63] max-w-md mx-auto text-[15px]">This author is still exploring and hasn't published any recipes to the community.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 md:gap-y-10">
              {profile.posts.map(post => (
                <div
                  key={post.id}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/posts/${post.id}`);
                    }
                  }}
                  className="flex flex-col bg-transparent group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] focus-visible:ring-offset-2 rounded-2xl p-1"
                  onClick={() => navigate(`/posts/${post.id}`)}
                >
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 md:mb-5 bg-[#E9EFE6] border border-[#DCE3D5]/50 shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:shadow-[#DCE3D5] group-hover:-translate-y-1 motion-reduce:transform-none">
                    {post.thumbnailUrl ? (
                      <img src={getImageUrl(post.thumbnailUrl)} alt={post.title} className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03] motion-reduce:transform-none" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#6B6F63] text-sm">No Image</div>
                    )}
                  </div>

                  <div className="flex flex-col flex-grow px-1">
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="text-[12px] font-semibold text-[#2F5233] uppercase tracking-wider">
                        {post.categoryName || 'Recipe'}
                      </span>
                    </div>

                    <h3 className="font-fraunces text-xl md:text-[22px] lg:text-xl xl:text-[22px] font-semibold text-[#2B2A25] mb-2.5 leading-tight group-hover:text-[#2F5233] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#6B6F63] font-medium mb-5">
                      <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                      {post.dietType && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-[#DCE3D5]"></span>
                          <span className="capitalize">{post.dietType.replace(/_/g, ' ')}</span>
                        </>
                      )}
                    </div>

                    <div className="mt-auto flex items-center gap-5 text-[14px] text-[#6B6F63]">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-[#2B2A25]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        <strong className="font-semibold text-[#2B2A25]">{post.viewCount || 0}</strong>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-[#2F5233]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                        <strong className="font-semibold text-[#2B2A25]">{post.likeCount || 0}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Followers & Following Modal */}
      {followListModal.isOpen && (
        <FollowListModal
          isOpen={followListModal.isOpen}
          onClose={() => setFollowListModal({ isOpen: false, initialTab: 'followers' })}
          userId={id}
          initialTab={followListModal.initialTab}
          followersCount={followStatus?.followersCount}
          followingCount={followStatus?.followingCount}
        />
      )}

      <AIChatbot />
      <Footer />
    </div>
  );
}

export default PublicUserProfile;
