import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import AIChatbot from '../../components/chat/AIChatbot';
import { deletePost, getMyPosts } from '../../services/postService';
import { toggleSave } from '../../services/interactionService';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/imageUtils';
import SavedPosts from './SavedPosts';

function MyPosts() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('my-posts');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadMyPosts() {
      try {
        const data = await getMyPosts({ pageIndex: 1, pageSize: 50 });
        setPosts(data.items || []);
      } catch (err) {
        console.error('Failed to load my posts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMyPosts();
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

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    try {
      setIsDeleting(true);
      await deletePost(postToDelete.id);
      setPosts(posts.filter(p => p.id !== postToDelete.id));
      setPostToDelete(null);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete post.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-vh-cream">
      <HeaderMember />
      
      {/* PAGE HEADER */}
      <div className="w-full bg-gradient-to-br from-vh-mint/40 to-vh-cream border-b border-vh-border/50">
        <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-16 flex flex-col items-center text-center">
          <div className="relative mb-6">
            {user?.avatarUrl ? (
              <img src={getImageUrl(user.avatarUrl)} alt="Avatar" className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md" />
            ) : (
              <div className="w-28 h-28 rounded-full border-4 border-white shadow-md flex items-center justify-center bg-vh-mint text-4xl font-dm-serif text-vh-forest">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-vh-forest text-white w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm font-dm-sans font-bold text-sm">
              {posts.length}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-dm-serif text-vh-text-primary mb-2">
            My Recipe Garden
          </h1>
          <p className="text-[16px] font-dm-sans text-vh-text-secondary mb-8">
            @{user?.username || 'user'} • Manage your culinary creations
          </p>
          
          <div className="flex items-center justify-center gap-8 md:gap-12 bg-white/60 backdrop-blur-sm border border-vh-border/60 px-10 py-4 rounded-full shadow-sm">
            <div className="flex flex-col items-center">
              <span className="font-dm-serif text-2xl text-vh-text-primary">{posts.length}</span>
              <span className="text-[11px] font-dm-sans text-vh-text-secondary font-bold uppercase tracking-wider mt-1">Posts</span>
            </div>
            <div className="w-px h-10 bg-vh-border"></div>
            <div className="flex flex-col items-center">
              <span className="font-dm-serif text-2xl text-vh-text-primary">{user?.followersCount || 0}</span>
              <span className="text-[11px] font-dm-sans text-vh-text-secondary font-bold uppercase tracking-wider mt-1">Followers</span>
            </div>
            <div className="w-px h-10 bg-vh-border"></div>
            <div className="flex flex-col items-center">
              <span className="font-dm-serif text-2xl text-vh-text-primary">{user?.followingCount || 0}</span>
              <span className="text-[11px] font-dm-sans text-vh-text-secondary font-bold uppercase tracking-wider mt-1">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="w-full bg-white border-b border-vh-border sticky top-16 z-30 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab('my-posts')}
              className={`h-14 px-2 font-dm-sans font-medium text-[15px] border-b-2 transition-colors focus:outline-none ${activeTab === 'my-posts' ? 'border-vh-forest text-vh-forest' : 'border-transparent text-vh-text-secondary hover:text-vh-forest'}`}
            >
              My Posts
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`h-14 px-2 font-dm-sans font-medium text-[15px] border-b-2 transition-colors focus:outline-none ${activeTab === 'saved' ? 'border-vh-forest text-vh-forest' : 'border-transparent text-vh-text-secondary hover:text-vh-forest'}`}
            >
              Saved Recipes
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      {activeTab === 'my-posts' ? (
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-dm-serif text-3xl font-medium text-vh-text-primary">
            Published Recipes
          </h2>
          <button 
            onClick={() => navigate('/posts/create')}
            className="flex items-center gap-2 bg-vh-forest text-white px-5 py-2.5 rounded-full font-dm-sans text-[14px] font-medium hover:bg-vh-sage hover:text-vh-forest transition-colors shadow-sm cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Write Recipe
          </button>
        </div>

        {loading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center text-vh-text-secondary gap-4">
            <div className="w-10 h-10 border-4 border-vh-mint border-t-vh-forest rounded-full animate-spin"></div>
            <p className="font-dm-sans">Loading your garden...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="w-full py-24 flex flex-col items-center justify-center text-center bg-vh-surface/50 rounded-card-lg border border-vh-border/50">
            <div className="w-20 h-20 mb-6 bg-vh-mint rounded-full flex items-center justify-center text-4xl">🪴</div>
            <h3 className="font-dm-serif text-2xl text-vh-text-primary mb-2">Your garden is empty</h3>
            <p className="font-dm-sans text-vh-text-secondary mb-8 max-w-md">You haven't shared any recipes or videos yet. Start planting seeds of inspiration for the community.</p>
            <button 
              onClick={() => navigate('/posts/create')} 
              className="px-8 py-3 bg-vh-forest text-white rounded-full font-dm-sans text-[15px] font-medium hover:bg-vh-sage transition-colors shadow-sm"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <div 
                key={post.id} 
                className="flex flex-col bg-vh-surface border border-vh-border/50 rounded-card-lg overflow-hidden hover:shadow-lg hover:shadow-vh-sage/20 transition-all duration-normal ease-vh group" 
              >
                <div 
                  className="relative w-full h-56 bg-vh-mint overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/posts/${post.id}`)}
                >
                  {post.thumbnailUrl ? (
                    <img src={getImageUrl(post.thumbnailUrl)} alt={post.title} className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-[1.05]" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-dm-sans text-vh-text-secondary text-sm">No Image</div>
                  )}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/70 backdrop-blur-md rounded-full border border-white/50 text-vh-forest font-dm-sans text-xs font-medium shadow-sm">
                    {post.categoryName || post.category?.name || 'Recipe'}
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col justify-between p-5 bg-gradient-to-b from-vh-surface to-vh-cream/30">
                  <div onClick={() => navigate(`/posts/${post.id}`)} className="cursor-pointer">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-dm-sans text-vh-text-secondary">
                        {getTimeAgo(post.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-dm-serif text-xl font-medium text-vh-text-primary mb-2 leading-snug group-hover:text-vh-forest transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-[15px] leading-relaxed font-dm-sans text-vh-text-secondary line-clamp-2 mb-4">
                      {post.content}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-vh-border/60 flex items-center justify-between text-[13px] font-dm-sans">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-vh-text-secondary">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        <strong>{post.viewCount || 0}</strong>
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/posts/edit/${post.id}`); }} 
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-vh-mint text-vh-forest hover:bg-vh-forest hover:text-white transition-colors border border-vh-border/50" 
                        title="Edit post"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setPostToDelete({ id: post.id }); }} 
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors border border-red-100" 
                        title="Delete post"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      ) : (
        <SavedPosts isComponent={true} />
      )}

      {/* DELETE MODAL OVERLAY */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-vh-text-primary/40 backdrop-blur-sm p-4">
          <div className="bg-vh-surface border border-vh-border rounded-card p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-dm-serif text-2xl text-vh-text-primary mb-3">Delete Recipe?</h3>
            <p className="font-dm-sans text-vh-text-secondary text-[15px] mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setPostToDelete(null)}
                className="px-5 py-2 rounded-full font-dm-sans text-[14px] font-medium text-vh-text-secondary hover:bg-vh-mint transition-colors border border-vh-border/50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-full font-dm-sans text-[14px] font-medium bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                ) : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <AIChatbot />
      <Footer />
    </div>
  );
}

export default MyPosts;
