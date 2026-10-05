import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import AIChatbot from '../../components/chat/AIChatbot';
import { getPublicProfile } from '../../services/userService';
import { getImageUrl } from '../../utils/imageUtils';

function PublicUserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await getPublicProfile(id);
        setProfile(data);
        setError(null);
      } catch (err) {
        if (err.status === 404) {
          setError('User not found.');
        } else {
          setError('Failed to load profile.');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id]);

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs} hours ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays} days ago`;
  };

  const getJoinedDate = (dateStr) => {
    if (!dateStr) return '';
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
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
        <div className="flex-grow flex items-center justify-center py-20 px-4">
          <div className="text-center bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-10 max-w-md w-full">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#F3F6EE] text-[#2F5233] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h2 className="font-fraunces text-2xl font-semibold text-[#2B2A25] mb-2">{error || 'User not found.'}</h2>
            <p className="text-[#6B6F63] mb-6">The profile you are looking for doesn't exist or has been removed.</p>
            <button onClick={() => navigate('/home')} className="px-6 py-2.5 bg-[#2F5233] text-white rounded-lg font-medium hover:bg-[#25401F] transition-colors">
              Return Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF6]">
      <HeaderMember />
      
      <main className="flex-grow max-w-[1200px] w-full mx-auto px-6 py-12">
        {/* Profile Header */}
        <section className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl p-8 md:p-12 mb-12 relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#E9EFE6] to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#E9EFE6] to-transparent rounded-full translate-y-1/3 -translate-x-1/3 opacity-50 pointer-events-none"></div>
          
          <div className="relative z-10 w-full flex flex-col items-center">
            <div className="mb-5 relative">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-[#E9EFE6] flex items-center justify-center text-[#2F5233] text-4xl font-semibold">
                {profile.avatarUrl ? (
                  <img src={getImageUrl(profile.avatarUrl)} alt={profile.displayName} className="w-full h-full object-cover" />
                ) : (
                  profile.displayName?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
            </div>
            
            <h1 className="font-fraunces text-3xl md:text-4xl text-[#2B2A25] font-semibold mb-2">
              {profile.displayName}
            </h1>
            <p className="text-[#6B6F63] font-medium mb-6">
              @{profile.username} &middot; Joined {getJoinedDate(profile.joinedAt)}
            </p>
            
            <div className="flex items-center gap-8 bg-[#F3F6EE]/50 border border-[#DCE3D5]/50 px-8 py-4 rounded-xl">
              <div className="flex flex-col items-center">
                <span className="font-fraunces font-semibold text-2xl text-[#2B2A25]">{profile.publishedPostCount || 0}</span>
                <span className="text-xs text-[#6B6F63] font-medium uppercase tracking-wide">Posts</span>
              </div>
              <div className="w-px h-10 bg-[#DCE3D5]"></div>
              <div className="flex flex-col items-center">
                <span className="font-fraunces font-semibold text-2xl text-[#2B2A25]">{profile.receivedLikeCount || 0}</span>
                <span className="text-xs text-[#6B6F63] font-medium uppercase tracking-wide">Likes</span>
              </div>
            </div>
          </div>
        </section>

        {/* User's Posts */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-[#DCE3D5] pb-4">
            <h2 className="font-fraunces text-2xl text-[#2B2A25] font-semibold">
              Published Recipes
            </h2>
            <span className="text-sm font-medium px-3 py-1 bg-[#E9EFE6] text-[#2F5233] rounded-full">
              {profile.posts?.length || 0}
            </span>
          </div>
          
          {(!profile.posts || profile.posts.length === 0) ? (
            <div className="py-20 text-center bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#F3F6EE] text-[#2F5233] rounded-full flex items-center justify-center text-2xl">🌱</div>
              <p className="text-lg font-medium text-[#2B2A25] mb-1">No posts yet.</p>
              <p className="text-[#6B6F63]">This user hasn't published any recipes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {profile.posts.map(post => (
                <div 
                  key={post.id} 
                  className="flex flex-col bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#DCE3D5]/50 transition-all duration-300 group cursor-pointer"
                  onClick={() => navigate(`/posts/${post.id}`)}
                >
                  <div className="relative w-full h-56 bg-[#E9EFE6] overflow-hidden">
                    {post.thumbnailUrl ? (
                      <img src={getImageUrl(post.thumbnailUrl)} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#6B6F63] text-sm">No Image</div>
                    )}
                    <div className="absolute top-3 left-3 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full border border-white/50 text-[#2F5233] text-xs font-medium shadow-sm">
                      {post.categoryName || 'Recipe'}
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs text-[#6B6F63] mb-3">
                      <span>{getTimeAgo(post.createdAt)}</span>
                      {post.dietType && (
                        <>
                          <span>&middot;</span>
                          <span className="capitalize">{post.dietType.replace(/_/g, ' ')}</span>
                        </>
                      )}
                    </div>
                    
                    <h3 className="font-fraunces text-xl font-semibold text-[#2B2A25] mb-2 leading-snug group-hover:text-[#2F5233] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <div className="pt-4 mt-auto border-t border-[#DCE3D5]/60 flex items-center justify-between text-[13px] text-[#6B6F63]">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          <strong>{post.viewCount || 0}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                          <strong>{post.likeCount || 0}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <AIChatbot />
      <Footer />
    </div>
  );
}

export default PublicUserProfile;
