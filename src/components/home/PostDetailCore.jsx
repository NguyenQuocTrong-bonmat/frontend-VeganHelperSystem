import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getPostDetail, getCategories } from '../../services/postService';
import { toggleLike, toggleSave } from '../../services/interactionService';
import { getImageUrl } from '../../utils/imageUtils';
import { getTimeAgo } from '../../utils/dateUtils';
import toast from 'react-hot-toast';

function PostDetailCore({ isGuest, onAuthRequired }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [categoryName, setCategoryName] = useState('Recipe');
  
  // Local state for interactions since GET /posts/:id doesn't provide them initially
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function loadPost() {
      try {
        const data = await getPostDetail(id);
        setPost(data);
        // PostDetailDto doesn't return LikeCount, initialize with 0 or fallback
        setLikeCount(data.likeCount || 0); 
        
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

  const handleLike = async () => {
    if (isGuest) {
      if (onAuthRequired) onAuthRequired();
      return;
    }
    
    // Optimistic UI update
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;
    
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
    try {
      const response = await toggleLike(id);
      // Update with authoritative response
      setIsLiked(response.isLiked);
      setLikeCount(response.likeCount);
    } catch (err) {
      // Revert on error
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
      toast.error('Failed to update like status');
    }
  };

  const handleSave = async () => {
    if (isGuest) {
      if (onAuthRequired) onAuthRequired();
      return;
    }
    
    // Optimistic UI update
    const previousIsSaved = isSaved;
    setIsSaved(!isSaved);
    
    try {
      const response = await toggleSave(id);
      // Update with authoritative response
      setIsSaved(response.isSaved);
      if (response.isSaved) {
        toast.success('Recipe saved to your collection');
      }
    } catch (err) {
      // Revert on error
      setIsSaved(previousIsSaved);
      toast.error('Failed to save recipe');
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (isGuest) {
      if (onAuthRequired) onAuthRequired();
      return;
    }
    toast.error('Comments API is currently BLOCKED by backend');
  };

  if (loading) return (
    <main className="w-full flex-1 flex flex-col items-center justify-center gap-4 py-20 text-[#6B6F63]">
      <div className="w-10 h-10 border-4 border-[#DCE3D5] border-t-[#2F5233] rounded-full animate-spin"></div>
      <p className="font-medium">Loading recipe...</p>
    </main>
  );

  if (error || !post) return (
    <main className="w-full flex-1 flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 mb-6 bg-[#E9EFE6] rounded-full flex items-center justify-center text-4xl">🥀</div>
      <h3 className="font-fraunces font-semibold text-2xl text-[#2B2A25] mb-2">Recipe Not Found</h3>
      <p className="text-[#6B6F63] max-w-md text-center mb-6">
        {error || "We couldn't find the recipe you're looking for. It may have been removed."}
      </p>
      <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-[#2F5233] text-white rounded-lg font-medium hover:bg-[#25401F] transition-colors">
        Return to Home
      </button>
    </main>
  );

  return (
    <main className="w-full max-w-[1120px] mx-auto px-6 py-8 md:py-12 flex-1">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-medium text-[#6B6F63] hover:text-[#2F5233] transition-colors cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="m15 18-6-6 6-6"></path>
          </svg>
          <span>Back</span>
        </button>
        <div className="inline-flex items-center gap-2">
          <span className="w-[3px] h-4 bg-[#2F5233] rounded-full"></span>
          <span className="text-sm font-medium text-[#2B2A25]">{categoryName}</span>
        </div>
      </div>

      <article className="space-y-6">
        <h1 className="font-fraunces font-semibold text-3xl sm:text-4xl text-[#2B2A25] leading-tight tracking-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-[#DCE3D5] text-[13px] text-[#6B6F63]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FDFBF6] border border-[#DCE3D5] flex items-center justify-center text-[#6B6F63] overflow-hidden">
              {post.authorAvatarUrl ? (
                <img src={getImageUrl(post.authorAvatarUrl)} alt={post.authorName} className="w-full h-full object-cover" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#2B2A25]">{post.authorName || 'Anonymous'}</span>
              <span>•</span>
              <span>{getTimeAgo(post.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>Views: <strong className="font-semibold text-[#2B2A25]">{post.viewCount || 0}</strong></span>
            </div>
          </div>
        </div>

        {post.media && post.media.length > 0 && (
          <div className="space-y-3">
            <div className="w-full bg-[#1e2d21] border border-[#DCE3D5] rounded-xl h-72 sm:h-[420px] flex flex-col items-center justify-center text-white relative overflow-hidden group select-none">
              {post.media[activeMediaIndex].mediaType === 'video' ? (
                <video className="absolute inset-0 w-full h-full object-cover" src={getImageUrl(post.media[activeMediaIndex].mediaUrl)} controls />
              ) : (
                <img src={getImageUrl(post.media[activeMediaIndex].mediaUrl)} alt="Media" className="absolute inset-0 w-full h-full object-cover" />
              )}
              
              {post.media.length > 1 && (
                <>
                  <button onClick={() => setActiveMediaIndex(prev => prev === 0 ? post.media.length - 1 : prev - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"></path></svg>
                  </button>
                  <button onClick={() => setActiveMediaIndex(prev => prev === post.media.length - 1 ? 0 : prev + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"></path></svg>
                  </button>
                  <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-medium text-white flex items-center gap-1.5 border border-white/20">
                    <span>{activeMediaIndex + 1} / {post.media.length}</span>
                  </div>
                </>
              )}
            </div>
            
            {post.media.length > 1 && (
              <div className="flex items-center gap-3 pt-1 overflow-x-auto pb-1 scrollbar-none">
                {post.media.map((item, index) => (
                  <button key={index} onClick={() => setActiveMediaIndex(index)} className={`relative shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all opacity-90 hover:opacity-100 ${activeMediaIndex === index ? 'border-[#2F5233]' : 'border-transparent'}`}>
                    {item.mediaType === 'video' ? (
                      <>
                        <video src={getImageUrl(item.mediaUrl)} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                      </>
                    ) : (
                      <img src={getImageUrl(item.mediaUrl)} alt={`Thumb ${index}`} className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="max-w-[760px] space-y-6 pt-4 text-[#2B2A25] leading-relaxed text-[17px]">
          <p className="font-medium text-lg text-[#2B2A25]/90 leading-relaxed border-l-2 border-[#2F5233] pl-4 italic whitespace-pre-wrap">
            {post.content}
          </p>

          <h2 className="font-fraunces font-medium text-2xl text-[#2B2A25] pt-4">Ingredients Preparation</h2>
          {post.ingredients && post.ingredients.length > 0 ? (
            <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-6 space-y-3">
              {post.ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span className="w-2 h-2 rounded-full bg-[#2F5233]"></span>
                  <span>{ing.ingredientName || ing.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#6B6F63] italic">No ingredients listed.</p>
          )}

          <h2 className="font-fraunces font-medium text-2xl text-[#2B2A25] pt-4">Step-by-step Instructions</h2>
          {post.steps && post.steps.length > 0 ? (
            <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl divide-y divide-[#DCE3D5] overflow-hidden">
              {post.steps.map((step, idx) => (
                <div key={idx} className="w-full px-4 py-3 flex items-start gap-3 hover:bg-[#F3F6EE] transition-colors text-left group">
                  <span className="px-2 py-0.5 rounded bg-[#2F5233] text-white font-semibold text-xs mt-0.5">
                    Step {step.stepNumber}
                  </span>
                  <span className="text-sm font-medium text-[#2B2A25]">{step.description}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#6B6F63] italic">Follow along with the media for preparation steps.</p>
          )}
        </div>

        <div className="py-6 my-8 border-y border-[#DCE3D5] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleLike} 
              type="button" 
              className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer ${isLiked ? 'bg-[#2F5233] border-[#2F5233] text-white' : 'bg-[#FDFBF6] border-[#DCE3D5] text-[#2B2A25] hover:text-[#2F5233] hover:border-[#2F5233]'}`}
            >
              <svg className={`w-5 h-5 ${isLiked ? 'fill-current' : 'fill-none'}`} stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"></path>
              </svg>
              <span>{isLiked ? 'Liked' : 'Like'}</span>
              <span className={`text-xs font-normal ml-0.5 ${isLiked ? 'text-white/80' : 'text-[#6B6F63]'}`}>{likeCount}</span>
            </button>

            <button 
              onClick={handleSave} 
              type="button" 
              className={`px-4 py-2 border rounded-lg text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer ${isSaved ? 'bg-[#F3F6EE] border-[#2F5233] text-[#2F5233]' : 'bg-[#FDFBF6] border-[#DCE3D5] text-[#2B2A25] hover:text-[#2F5233] hover:border-[#2F5233]'}`}
            >
              <svg className={`w-5 h-5 ${isSaved ? 'fill-current' : 'fill-none'}`} stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"></path>
              </svg>
              <span>{isSaved ? 'Saved' : 'Save recipe'}</span>
            </button>
          </div>
        </div>

        <section className="pt-8 pb-12 space-y-8" id="comments">
          <div className="flex items-center justify-between border-b border-[#DCE3D5] pb-4">
            <h2 className="font-fraunces font-medium text-2xl text-[#2B2A25] flex items-center gap-2">
              <span>Comments</span>
              <span className="text-base font-sans font-normal text-[#6B6F63]">(0)</span>
            </h2>
            <span className="text-xs text-[#6B6F63]">Community guidelines: Warm & respectful</span>
          </div>

          {!isGuest ? (
            <form onSubmit={handleCommentSubmit} className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-5 space-y-3">
              <textarea 
                className="w-full bg-[#F3F6EE] border border-[#DCE3D5] rounded-lg p-3 text-sm focus:outline-none focus:border-[#2F5233] transition-colors resize-none" 
                rows="3" 
                placeholder="Share your thoughts or questions..."
              ></textarea>
              <div className="flex justify-end">
                <button type="submit" className="px-5 py-2 bg-[#2F5233] hover:bg-[#25401F] text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
                  Post Comment
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-6 text-center space-y-4">
              <div className="space-y-1">
                <h3 className="font-medium text-base text-[#2B2A25]">Join the recipe discussion</h3>
                <p className="text-sm text-[#6B6F63] max-w-md mx-auto">
                  Please <strong className="text-[#2F5233]">Log In</strong> to share your feedback.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button onClick={onAuthRequired} className="px-6 py-2.5 bg-[#2F5233] text-white text-sm font-medium rounded-lg hover:bg-[#25401F] transition-colors cursor-pointer">
                  Log In
                </button>
              </div>
            </div>
          )}
          
          <div className="py-8 text-center text-[#6B6F63] italic text-sm">
            Comments API is currently unavailable (BLOCKED).
          </div>
        </section>
      </article>
    </main>
  );
}

export default PostDetailCore;
