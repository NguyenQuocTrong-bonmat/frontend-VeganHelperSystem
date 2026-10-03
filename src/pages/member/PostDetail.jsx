import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import AIChatbot from '../../components/chat/AIChatbot';
import { getPostDetail, getCategories } from '../../services/postService';
import { getImageUrl } from '../../utils/imageUtils';
import { getTimeAgo } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [categoryName, setCategoryName] = useState('Recipe');
  
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function loadPost() {
      try {
        const data = await getPostDetail(id);
        setPost(data);
        try {
          const catsData = await getCategories();
          const cats = Array.isArray(catsData) ? catsData : catsData.items || [];
          const foundCat = cats.find(c => c.id === data.categoryId);
          if (foundCat) setCategoryName(foundCat.name);
        } catch (catErr) {
          console.warn('Failed to load categories mapping:', catErr);
        }
      } catch (err) {
        setError('Failed to load post details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-vh-cream">
      <HeaderMember />
      <main className="w-full flex-1 flex flex-col items-center justify-center gap-4 py-20 text-vh-text-secondary">
        <div className="w-10 h-10 border-4 border-vh-mint border-t-vh-forest rounded-full animate-spin"></div>
        <p className="font-dm-sans">Loading recipe...</p>
      </main>
      <Footer />
    </div>
  );

  if (error || !post) return (
    <div className="min-h-screen flex flex-col bg-vh-cream">
      <HeaderMember />
      <main className="w-full flex-1 flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 mb-6 bg-vh-mint rounded-full flex items-center justify-center text-4xl">🥀</div>
        <h3 className="font-dm-serif text-2xl text-vh-text-primary mb-2">Recipe Not Found</h3>
        <p className="font-dm-sans text-vh-text-secondary max-w-md text-center mb-6">
          {error || "We couldn't find the recipe you're looking for. It may have been removed."}
        </p>
        <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-vh-forest text-white rounded-full font-dm-sans font-medium hover:bg-vh-sage transition-colors">
          Return to Garden
        </button>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-vh-cream">
      <HeaderMember />
      
      {/* IMMERSIVE HEADER */}
      <div className="relative w-full h-[400px] md:h-[500px] bg-vh-mint flex flex-col items-center justify-center overflow-hidden mb-8 md:mb-16">
        <div className="absolute inset-0 z-0">
          {post.thumbnailUrl ? (
            <img 
              src={getImageUrl(post.thumbnailUrl)} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-vh-forest/10 flex items-center justify-center text-vh-text-secondary font-dm-sans">No Cover Image</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-vh-forest/90 via-vh-forest/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-[800px] mx-auto px-6 text-center mt-auto pb-12 md:pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white font-dm-sans text-xs font-medium uppercase tracking-wider mb-6">
            {post.postType || 'Recipe'} • {categoryName}
          </div>
          
          <h1 className="font-dm-serif text-3xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight drop-shadow-md">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-center gap-6 text-white/90 font-dm-sans text-sm md:text-base">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center overflow-hidden">
                {post.avatarUrl ? (
                  <img src={getImageUrl(post.avatarUrl)} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"></circle><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path></svg>
                )}
              </div>
              <span className="font-medium">{post.authorName || 'Anonymous'}</span>
            </div>
            <span>•</span>
            <span>{getTimeAgo(post.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="w-full max-w-[800px] mx-auto px-6 pb-20 flex-1">
        
        {/* Quick Stats Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-vh-surface border border-vh-border/60 rounded-card-lg mb-10 shadow-sm">
          <div className="flex items-center gap-6 text-vh-text-secondary font-dm-sans text-[14px]">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-vh-forest" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              <span>{post.viewCount || 0} Views</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-vh-error" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
              <span>{post.likeCount || 0} Likes</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {post.authorId === user?.id && (
              <button onClick={() => navigate(`/posts/edit/${post.id}`)} className="h-10 px-4 flex items-center gap-2 bg-vh-mint text-vh-forest font-dm-sans text-sm font-medium rounded-full hover:bg-vh-sage transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"></path></svg>
                Edit Recipe
              </button>
            )}
            <button onClick={() => navigate(-1)} className="h-10 px-5 flex items-center gap-2 border border-vh-border text-vh-text-secondary hover:text-vh-text-primary font-dm-sans text-sm font-medium rounded-full hover:bg-vh-surface transition-colors cursor-pointer">
              Go Back
            </button>
          </div>
        </div>

        {/* Media Gallery */}
        {post.media && post.media.length > 0 && (
          <section className="mb-12 space-y-4">
            <div className="relative w-full aspect-video bg-black/90 rounded-card-lg overflow-hidden border border-vh-border/50 shadow-sm select-none group">
              {post.media[activeMediaIndex].mediaType === 'video' ? (
                <video className="w-full h-full object-cover" src={getImageUrl(post.media[activeMediaIndex].mediaUrl)} controls />
              ) : (
                <img className="w-full h-full object-cover" src={getImageUrl(post.media[activeMediaIndex].mediaUrl)} alt="Media" />
              )}
              
              {post.media.length > 1 && (
                <>
                  <button onClick={() => setActiveMediaIndex(prev => prev === 0 ? post.media.length - 1 : prev - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/40 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:outline-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"></path></svg>
                  </button>
                  <button onClick={() => setActiveMediaIndex(prev => prev === post.media.length - 1 ? 0 : prev + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/40 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:outline-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"></path></svg>
                  </button>
                </>
              )}
            </div>

            {post.media.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {post.media.map((item, index) => (
                  <button key={index} onClick={() => setActiveMediaIndex(index)} className={`relative w-20 h-20 shrink-0 rounded-card overflow-hidden border-2 transition-all ${activeMediaIndex === index ? 'border-vh-forest' : 'border-vh-border hover:border-vh-sage'}`}>
                    <img className="w-full h-full object-cover opacity-90 hover:opacity-100" src={getImageUrl(item.mediaUrl)} alt="Thumbnail" />
                    {item.mediaType === 'video' && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Article Body */}
        <article className="prose prose-lg prose-p:font-dm-sans prose-p:text-[17px] prose-p:text-vh-text-secondary prose-p:leading-relaxed prose-headings:font-dm-serif prose-headings:font-medium prose-headings:text-vh-text-primary max-w-none">
          <p className="text-xl md:text-2xl font-dm-serif text-vh-text-primary leading-relaxed border-l-4 border-vh-forest pl-6 italic mb-10 text-balance">
            "{post.content}"
          </p>

          <h2 className="text-3xl mt-12 mb-6">Ingredients</h2>
          {post.ingredients && post.ingredients.length > 0 ? (
            <div className="bg-vh-surface border border-vh-border/50 rounded-card-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-vh-mint border border-vh-sage shrink-0"></div>
                  <span className="font-dm-sans text-vh-text-secondary">{ing.ingredientName || ing.name || JSON.stringify(ing)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-vh-text-secondary bg-vh-surface p-6 rounded-card border border-vh-border/50 italic">No specific ingredients listed.</p>
          )}

          <h2 className="text-3xl mt-12 mb-6">Instructions</h2>
          <p className="text-vh-text-secondary">
            Follow along with the video or imagery above for the complete step-by-step preparation. 
            Enjoy crafting this botanical dish!
          </p>
        </article>

      </main>

      <AIChatbot />
      <Footer />
    </div>
  );
}

export default PostDetail;
