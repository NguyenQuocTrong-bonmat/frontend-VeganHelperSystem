import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import AIChatbot from '../../components/chat/AIChatbot';
import { getSavedPosts, toggleSave } from '../../services/interactionService';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

function SavedPosts({ isComponent = false }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUnsaving, setIsUnsaving] = useState(false);

  useEffect(() => {
    async function loadSavedPosts() {
      try {
        const data = await getSavedPosts({ pageIndex: 1, pageSize: 50 });
        setPosts(data.items || []);
      } catch (err) {
        console.error('Failed to load saved posts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSavedPosts();
  }, []);

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

  const handleUnsave = async (postId) => {
    try {
      setIsUnsaving(true);
      await toggleSave(postId);
      setPosts(posts.filter(p => p.postId !== postId));
      toast.success('Removed from saved recipes');
    } catch (err) {
      console.error('Unsave error:', err);
      toast.error('Failed to remove from saved recipes.');
    } finally {
      setIsUnsaving(false);
    }
  };

  return (
    <div className={!isComponent ? "min-h-screen flex flex-col bg-[#FDFBF6]" : "w-full"}>
      {!isComponent && <HeaderMember />}
      
      {/* PAGE HEADER */}
      {!isComponent && (
      <div className="w-full bg-gradient-to-br from-[#E9EFE6]/40 to-[#FDFBF6] border-b border-[#DCE3D5]/50">
        <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-16 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md flex items-center justify-center bg-[#2F5233] text-white">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"></path>
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-fraunces font-semibold text-[#2B2A25] mb-2">
            Saved Recipes
          </h1>
          <p className="text-[16px] text-[#6B6F63]">
            Your personal collection of culinary inspirations
          </p>
        </div>
      </div>
      )}

      {/* MAIN CONTENT */}
      <main className={`flex-1 w-full max-w-[1200px] mx-auto px-6 ${!isComponent ? 'py-12' : 'py-6'}`}>
        {loading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center text-[#6B6F63] gap-4">
            <div className="w-10 h-10 border-4 border-[#DCE3D5] border-t-[#2F5233] rounded-full animate-spin"></div>
            <p className="font-medium">Loading saved recipes...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="w-full py-24 flex flex-col items-center justify-center text-center bg-[#FDFBF6] rounded-xl border border-[#DCE3D5]/50">
            <div className="w-20 h-20 mb-6 bg-[#E9EFE6] rounded-full flex items-center justify-center text-4xl">🔖</div>
            <h3 className="font-fraunces font-semibold text-2xl text-[#2B2A25] mb-2">No saved recipes yet</h3>
            <p className="text-[#6B6F63] mb-8 max-w-md">You haven't saved any recipes yet. Browse the community and bookmark your favorites!</p>
            <button 
              onClick={() => navigate('/home')} 
              className="px-8 py-3 bg-[#2F5233] text-white rounded-lg text-[15px] font-medium hover:bg-[#25401F] transition-colors shadow-sm"
            >
              Explore Recipes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <div 
                key={post.postId} 
                className="flex flex-col bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#DCE3D5]/50 transition-all duration-300 group" 
              >
                <div 
                  className="relative w-full h-56 bg-[#E9EFE6] overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/posts/${post.postId}`)}
                >
                  {post.thumbnailUrl ? (
                    <img src={getImageUrl(post.thumbnailUrl)} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#6B6F63] text-sm">No Image</div>
                  )}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full border border-white/50 text-[#2F5233] text-xs font-medium shadow-sm">
                    {post.postType || 'Recipe'}
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col justify-between p-5">
                  <div onClick={() => navigate(`/posts/${post.postId}`)} className="cursor-pointer">
                    <h3 className="font-fraunces text-xl font-semibold text-[#2B2A25] mb-2 leading-snug group-hover:text-[#2F5233] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                  
                  <div className="pt-4 mt-auto border-t border-[#DCE3D5]/60 flex items-center justify-between text-[13px] text-[#6B6F63]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-[#E9EFE6] flex items-center justify-center shrink-0">
                        {post.avatarUrl ? (
                          <img src={getImageUrl(post.avatarUrl)} className="w-full h-full object-cover" alt={post.authorName} />
                        ) : (
                          <svg className="w-4 h-4 text-[#6B6F63]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                        )}
                      </div>
                      <span className="font-medium text-[#2B2A25] truncate max-w-[100px]">{post.authorName}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        <strong>{post.viewCount || 0}</strong>
                      </span>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleUnsave(post.postId); }} 
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F6EE] text-[#2F5233] transition-colors" 
                        title="Remove from saved"
                        disabled={isUnsaving}
                      >
                        <svg className="w-5 h-5 fill-current" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {!isComponent && <AIChatbot />}
      {!isComponent && <Footer />}
    </div>
  );
}

export default SavedPosts;
