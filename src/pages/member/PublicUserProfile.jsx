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
        <section className="bg-[#FDFBF6] rounded-3xl mb-16 relative overflow-hidden flex flex-col items-center border border-[#DCE3D5]/60 shadow-sm">
          {/* Subtle organic cover background */}
          <div className="absolute top-0 left-0 w-full h-40 md:h-48 bg-gradient-to-b from-[#E9EFE6] to-[#FDFBF6] z-0">
            {/* Decorative SVG pattern */}
            <svg className="absolute inset-0 w-full h-full text-[#DCE3D5]/30" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
              <path d="M0,0 L100,0 L100,100 Q50,20 0,100 Z" fill="currentColor"/>
            </svg>
          </div>
          
          <div className="relative z-10 w-full flex flex-col items-center pt-24 md:pt-28 pb-12 px-6">
            <div className="mb-5">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#FDFBF6] shadow-md overflow-hidden bg-[#E9EFE6] flex items-center justify-center text-[#2F5233] text-5xl font-semibold ring-1 ring-[#DCE3D5]">
                {profile.avatarUrl ? (
                  <img src={getImageUrl(profile.avatarUrl)} alt={profile.displayName} className="w-full h-full object-cover" />
                ) : (
                  profile.displayName?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
            </div>
            
            <h1 className="font-fraunces text-3xl md:text-5xl text-[#2B2A25] font-semibold mb-3 text-center tracking-tight">
              {profile.displayName}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-3 text-[#6B6F63] font-medium mb-8">
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
              <span>Joined {getJoinedDate(profile.joinedAt)}</span>
            </div>
            
            <div className="w-full max-w-md border-t border-[#DCE3D5]/50 pt-8 mt-2 flex justify-center gap-16 md:gap-24">
              <div className="flex flex-col items-center">
                <span className="font-fraunces font-semibold text-3xl md:text-4xl text-[#2B2A25]">{profile.publishedPostCount || 0}</span>
                <span className="text-xs md:text-sm text-[#6B6F63] font-medium uppercase tracking-widest mt-1">Published</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-fraunces font-semibold text-3xl md:text-4xl text-[#2B2A25]">{profile.receivedLikeCount || 0}</span>
                <span className="text-xs md:text-sm text-[#6B6F63] font-medium uppercase tracking-widest mt-1">Likes</span>
              </div>
            </div>
          </div>
        </section>

        {/* User's Posts */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="font-fraunces text-2xl md:text-3xl text-[#2B2A25] font-semibold">
              Published Recipes
            </h2>
            <div className="flex-1 h-px bg-[#DCE3D5]"></div>
          </div>
          
          {(!profile.posts || profile.posts.length === 0) ? (
            <div className="py-24 text-center bg-[#FDFBF6] border border-[#DCE3D5] rounded-3xl flex flex-col items-center shadow-sm">
              <div className="w-20 h-20 bg-[#F3F6EE] text-[#2F5233] rounded-full flex items-center justify-center text-4xl mb-5 shadow-inner border border-[#DCE3D5]/30">
                🌿
              </div>
              <h3 className="font-fraunces text-2xl font-semibold text-[#2B2A25] mb-2">No published recipes yet</h3>
              <p className="text-[#6B6F63] max-w-md mx-auto text-[15px]">This author is still exploring and hasn't published any recipes to the community.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {profile.posts.map(post => (
                <div 
                  key={post.id} 
                  className="flex flex-col bg-transparent group cursor-pointer"
                  onClick={() => navigate(`/posts/${post.id}`)}
                >
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-[#E9EFE6] border border-[#DCE3D5]/50 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:shadow-[#DCE3D5] group-hover:-translate-y-1">
                    {post.thumbnailUrl ? (
                      <img src={getImageUrl(post.thumbnailUrl)} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
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
                    
                    <h3 className="font-fraunces text-[22px] md:text-[24px] font-semibold text-[#2B2A25] mb-2.5 leading-tight group-hover:text-[#2F5233] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#6B6F63] font-medium mb-5">
                      <span>{getTimeAgo(post.createdAt)}</span>
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
                        <svg className="w-4 h-4 text-[#2F5233]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
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

      <AIChatbot />
      <Footer />
    </div>
  );
}

export default PublicUserProfile;
