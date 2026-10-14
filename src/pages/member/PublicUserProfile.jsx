import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import AIChatbot from '../../components/chat/AIChatbot';
import PostCard, { SafeImage } from '../../components/posts/PostCard';
import PageState from '../../components/posts/PageState';
import { getPublicProfile } from '../../services/userService';

export default function PublicUserProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setProfile(null); setError(null);
    getPublicProfile(id).then(data => {
      if (!active) return;
      if (!data || !Array.isArray(data.posts)) throw new Error('Invalid profile response.');
      setProfile(data);
    }).catch(err => { if (active) setError({ status: err.status, message: err.status === 400 ? 'Invalid user ID.' : 'Unable to load this profile.' }); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, revision]);
  const joined = profile?.joinedAt ? new Date(profile.joinedAt) : null;
  const joinedLabel = joined && !Number.isNaN(joined.getTime()) ? joined.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : null;
  return <div className="min-h-screen flex flex-col bg-[#FDFBF6]">
    <HeaderMember />
    <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-12">
      {loading || error || !profile ? <PageState loading={loading} error={error} onRetry={() => setRevision(value => value + 1)} /> : <>
        <section className="border border-[#DCE3D5] rounded-2xl p-6 md:p-12 mb-12 flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-[#E9EFE6] flex items-center justify-center mb-5">
            <SafeImage src={profile.avatarUrl} alt={profile.displayName || profile.username} fallback={profile.displayName?.charAt(0).toUpperCase() || 'U'} className="w-full h-full object-cover" />
          </div>
          <h1 className="font-fraunces text-3xl md:text-4xl font-semibold max-w-full [overflow-wrap:anywhere]">{profile.displayName || profile.username}</h1>
          <p className="text-[#6B6F63] my-4 max-w-full [overflow-wrap:anywhere]">@{profile.username}{joinedLabel && ` · Joined ${joinedLabel}`}</p>
          <div className="flex flex-wrap justify-center gap-8 bg-[#F3F6EE] px-6 py-4 rounded-xl">
            <span><strong>{profile.publishedPostCount ?? 0}</strong> posts</span>
            <span><strong>{profile.receivedLikeCount ?? 0}</strong> likes received</span>
          </div>
        </section>
        <h2 className="font-fraunces text-2xl mb-8">Published Posts</h2>
        {profile.posts.length === 0 ? <PageState empty="This author hasn't published any posts yet." /> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{profile.posts.map(post => <PostCard key={post.id} post={post} postId={post.id} />)}</div>}
      </>}
    </main>
    <AIChatbot /><Footer />
  </div>;
}
