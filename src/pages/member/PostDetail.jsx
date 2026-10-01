import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getPostDetail } from '../../services/postService';
import { getImageUrl } from '../../utils/imageUtils';
import { getTimeAgo } from '../../utils/dateUtils';
import HeaderMember from '../../components/layout/HeaderMember';

function PostDetail() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function loadPost() {
      try {
        const data = await getPostDetail(id);
        setPost(data);
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
    <div className="min-h-screen flex flex-col">
      <HeaderMember />
      <main className="w-full max-w-[1120px] mx-auto px-6 py-12 flex-1 text-center text-text-stem-gray">Loading post details...</main>
    </div>
  );

  if (error || !post) return (
    <div className="min-h-screen flex flex-col">
      <HeaderMember />
      <main className="w-full max-w-[1120px] mx-auto px-6 py-12 flex-1 text-center text-accent-beetroot">{error || 'Post not found.'}</main>
    </div>
  );

  return (
    <>
      {/* TOP HEADER */}
      <HeaderMember />
      {/* MAIN ARTICLE CONTAINER */}
      <main className="w-full max-w-[1120px] mx-auto px-6 py-8 md:py-12 flex-1">
        {/* Breadcrumb & Back action */}
        <div className="mb-6 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-medium text-text-stem-gray hover:text-primary-moss transition-colors focus:outline-none cursor-pointer" type="button">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
            <span className="">
              Back
            </span>
          </button>
          {/* Category Tag */}
          <div className="inline-flex items-center gap-2">
            <span className="w-[3px] h-4 bg-primary-moss rounded-full"></span>
            <span className="text-sm font-medium text-text-charcoal">
              {post.postType} / Recipe
            </span>
          </div>
        </div>
        {/* Article Header Area */}
        <article className="space-y-6">
          {/* Title: Fraunces H2 */}
          <h1 className="font-fraunces font-semibold text-[28px] leading-[36px] text-text-charcoal tracking-tight">
            {post.title}
          </h1>
          {/* Meta Information Row: Author, Date, Views, Rating */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-border-sage-mist text-[13px] text-text-stem-gray">
            <div className="flex items-center gap-3">
              {/* User Avatar Placeholder */}
              <div className="w-8 h-8 rounded-full bg-surface-paper border border-border-sage-mist flex items-center justify-center text-text-stem-gray">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-text-charcoal">
                  {post.authorName || 'Anonymous'}
                </span>
                <span className="">
                  •
                </span>
                <span className="">
                  {getTimeAgo(post.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-text-stem-gray" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span className="">
                  Views:
                  <strong className="font-semibold text-text-charcoal">
                    {post.viewCount}
                  </strong>
                </span>
              </div>
            </div>
          </div>
          {/* COMPONENT MEDIA GALLERY */}
          <section aria-label="Media Gallery" className="space-y-3">
            {post.media && post.media.length > 0 ? (
              <>
                {/* Main Viewer */}
                <div className="relative w-full aspect-video bg-[#222823] border border-border-sage-mist hero-radius overflow-hidden shadow-sm group select-none">
                  <div className="absolute inset-0 w-full h-full flex flex-col justify-between">
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      {post.media[activeMediaIndex].mediaType === 'video' ? (
                        <video 
                          className="w-full h-full object-cover" 
                          src={getImageUrl(post.media[activeMediaIndex].mediaUrl)} 
                          controls
                        />
                      ) : (
                        <img 
                          alt="Media" 
                          className="w-full h-full object-cover" 
                          src={getImageUrl(post.media[activeMediaIndex].mediaUrl)} 
                        />
                      )}
                    </div>
                  </div>
                  
                  {post.media.length > 1 && (
                    <>
                      <button 
                        onClick={() => setActiveMediaIndex(prev => prev === 0 ? post.media.length - 1 : prev - 1)}
                        aria-label="Previous media" 
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface-paper/90 hover:bg-surface-paper border border-border-sage-mist text-text-charcoal flex items-center justify-center shadow-sm backdrop-blur-sm transition-all hover:scale-105 z-20 focus:outline-none" 
                        type="button">
                        <svg className="w-5 h-5 text-text-charcoal" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="m15 18-6-6 6-6"></path>
                        </svg>
                      </button>
                      <button 
                        onClick={() => setActiveMediaIndex(prev => prev === post.media.length - 1 ? 0 : prev + 1)}
                        aria-label="Next media" 
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface-paper/90 hover:bg-surface-paper border border-border-sage-mist text-text-charcoal flex items-center justify-center shadow-sm backdrop-blur-sm transition-all hover:scale-105 z-20 focus:outline-none" 
                        type="button">
                        <svg className="w-5 h-5 text-text-charcoal" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="m9 18 6-6-6-6"></path>
                        </svg>
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {post.media.length > 1 && (
                  <div className="flex items-center gap-2.5 overflow-x-auto py-1">
                    {post.media.map((item, index) => (
                      <button 
                        key={index}
                        onClick={() => setActiveMediaIndex(index)}
                        className={`relative w-14 h-14 shrink-0 rounded-[6px] border ${activeMediaIndex === index ? 'border-2 border-primary-moss' : 'border-border-sage-mist'} bg-[#1c241d] overflow-hidden focus:outline-none transition-all ring-offset-1 group`} 
                        type="button">
                        <img 
                          alt={`Thumbnail ${index + 1}`} 
                          className={`w-full h-full object-cover transition-opacity ${activeMediaIndex === index ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`} 
                          src={getImageUrl(item.mediaUrl)} 
                        />
                        {item.mediaType === 'video' && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                              <svg className="w-2.5 h-2.5 fill-primary-moss translate-x-0.5" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"></path>
                              </svg>
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-xs text-text-stem-gray pt-1">
                  {post.media.length} item{post.media.length > 1 ? 's' : ''} ({post.media.filter(m => m.mediaType === 'video').length} video, {post.media.filter(m => m.mediaType === 'image').length} image)
                </p>
              </>
            ) : (
              <div className="w-full aspect-video bg-surface-paper border border-border-sage-mist hero-radius flex items-center justify-center text-text-stem-gray text-sm">
                No media available
              </div>
            )}
          </section>
          <div className="my-6 max-w-[760px]">
            <button className="bg-[#FDFBF6] border border-[#DCE3D5] text-[#2F5233] font-medium text-sm flex items-center gap-2 px-4 py-2.5 rounded-tl-[16px] rounded-tr-[6px] rounded-b-[6px] hover:bg-[#F3F6EE] transition-colors duration-200 focus:outline-none" type="button">
              <svg className="w-4 h-4 text-[#D9A441]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <span className="">
                ✨ AI Video Summary
              </span>
            </button>
            <div className="mt-4 bg-[#F3F6EE] rounded-[8px] border-l-[3px] border-l-[#D9A441] p-5 sm:p-6 font-['Be_Vietnam_Pro',sans-serif]" id="ai-summary-content">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-fraunces font-semibold text-base text-[#2B2A25]">
                    AI Video Insights
                  </span>
                  <span className="px-2 py-0.5 bg-accent-turmeric/15 text-warning-turmeric-deep text-xs font-semibold rounded-full">
                    AI Summary
                  </span>
                </div>
                <span className="text-xs text-[#6B6F63]">
                  Auto-generated
                </span>
              </div>
              <p className="text-[#2B2A25] leading-relaxed text-[15px]">
                AI analysis synthesizes {post.authorName || 'Anonymous'}'s master braising technique: searing king oyster mushrooms golden-brown in cold-pressed oil, then slow-reducing in fresh young coconut broth and crushed green peppercorns to achieve an earthy, deeply caramelized texture.
              </p>
              <div className="mt-4 pt-4 border-t border-[#DCE3D5]">
                <h4 className="text-[13px] font-semibold text-[#2F5233] uppercase tracking-wide">
                  Key Timestamps
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5 text-xs text-[#2B2A25]">
                  <div className="flex items-center gap-2 p-2 rounded bg-[#FDFBF6] border border-[#DCE3D5]">
                    <span className="font-bold text-[#2B2A25]">
                      01:20
                    </span>
                    <span className="text-[#6B6F63]">
                      Prep & score king oyster mushrooms
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-[#FDFBF6] border border-[#DCE3D5]">
                    <span className="font-bold text-[#2B2A25]">
                      03:15
                    </span>
                    <span className="text-[#6B6F63]">
                      Caramelize sweet soy sauce & young coconut nectar
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-[#FDFBF6] border border-[#DCE3D5]">
                    <span className="font-bold text-[#2B2A25]">
                      06:40
                    </span>
                    <span className="text-[#6B6F63]">
                      Braise with crushed fresh green peppercorns
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-[#FDFBF6] border border-[#DCE3D5]">
                    <span className="font-bold text-[#2B2A25]">
                      10:50
                    </span>
                    <span className="text-[#6B6F63]">
                      Reduce glaze & garnish with fresh herbs
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#DCE3D5]">
                <h4 className="text-[13px] font-semibold text-[#6B6F63]">
                  Ingredients Detected
                </h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-transparent border border-[#DCE3D5] rounded-[8px] text-[#6B6F63] px-2.5 py-1 text-[13px]">
                    King Oyster Mushrooms
                  </span>
                  <span className="bg-transparent border border-[#DCE3D5] rounded-[8px] text-[#6B6F63] px-2.5 py-1 text-[13px]">
                    Young Coconut Water
                  </span>
                  <span className="bg-transparent border border-[#DCE3D5] rounded-[8px] text-[#6B6F63] px-2.5 py-1 text-[13px]">
                    Green Peppercorns
                  </span>
                  <span className="bg-transparent border border-[#DCE3D5] rounded-[8px] text-[#6B6F63] px-2.5 py-1 text-[13px]">
                    Dark Tamari Soy Sauce
                  </span>
                  <span className="bg-transparent border border-[#DCE3D5] rounded-[8px] text-[#6B6F63] px-2.5 py-1 text-[13px]">
                    Silken Tofu
                  </span>
                  <span className="bg-transparent border border-[#DCE3D5] rounded-[8px] text-[#6B6F63] px-2.5 py-1 text-[13px]">
                    Lotus Root Broth
                  </span>
                  <span className="bg-transparent border border-[#DCE3D5] rounded-[8px] text-[#6B6F63] px-2.5 py-1 text-[13px]">
                    Thai Basil
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Article Content Body */}
          <div className="max-w-[760px] space-y-6 pt-4 text-text-charcoal leading-relaxed text-[17px]">
            {/* Quote highlight / Description summary */}
            <p className="font-medium text-lg text-text-charcoal/90 leading-relaxed border-l-2 border-primary-moss pl-4 italic">
              {post.content}
            </p>
            <p className="">
              Wholesome plant-based home cooking honors simplicity. Fresh king oyster mushrooms provide a hearty, succulent texture while crushed green peppercorns offer mild, lingering warmth without overpowering the natural sweetness of root broth.
            </p>
            {/* Subheading H2 in Fraunces */}
            <h2 className="font-fraunces font-medium text-2xl text-text-charcoal pt-4">
              Ingredients Preparation
            </h2>
            {/* Ingredients Card */}
            <div className="bg-surface-paper border border-border-sage-mist rounded-xl p-6 space-y-3">
              {post.ingredients && post.ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span className="w-2 h-2 rounded-full bg-primary-moss shrink-0"></span>
                  <span className="">{ing.ingredientName || ing.name || JSON.stringify(ing)}</span>
                </div>
              ))}
              {(!post.ingredients || post.ingredients.length === 0) && (
                <div className="text-sm text-text-stem-gray">No ingredients listed.</div>
              )}
            </div>
            <h2 className="font-fraunces font-medium text-2xl text-text-charcoal pt-4">
              Step-by-step Instructions
            </h2>
            <p className="">
              Detailed step-by-step cooking directions will appear here. Begin with preparing fresh produce, sautéing aromatic herbs with natural vegetable oil, and simmering gently until every vegetable is tender, infusing the kitchen with delightful botanical aromas.
            </p>
            {/* Video Chapters Timeline */}
            <div className="bg-surface-paper border border-border-sage-mist rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-border-sage-mist pb-2.5">
                <h3 className="font-fraunces font-medium text-base text-text-charcoal flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary-moss" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span className="">
                    Video Chapters
                  </span>
                </h3>
                <span className="text-xs text-text-stem-gray">
                  Click to jump to chapter
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-sm">
                <div className="flex items-center justify-between p-2 rounded bg-bg-herb-white/80 hover:bg-bg-herb-white transition-colors cursor-pointer">
                  <span className="font-medium text-text-charcoal">
                    00:00 - Prepare vegetables & mushrooms
                  </span>
                  <span className="text-xs text-primary-moss font-semibold">
                    Start
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-bg-herb-white/80 hover:bg-bg-herb-white transition-colors cursor-pointer">
                  <span className="font-medium text-text-charcoal">
                    03:15 - Sauté aromatic mushrooms & spices
                  </span>
                  <span className="text-xs text-primary-moss font-semibold">
                    Jump to
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-bg-herb-white/80 hover:bg-bg-herb-white transition-colors cursor-pointer">
                  <span className="font-medium text-text-charcoal">
                    06:40 - Simmer sweet lotus root broth
                  </span>
                  <span className="text-xs text-primary-moss font-semibold">
                    Jump to
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-bg-herb-white/80 hover:bg-bg-herb-white transition-colors cursor-pointer">
                  <span className="font-medium text-text-charcoal">
                    08:40 - Season & finalize dish
                  </span>
                  <span className="text-xs text-primary-moss font-semibold">
                    Jump to
                  </span>
                </div>
              </div>
            </div>
            {/* Key cooking notes */}
            <div className="space-y-2 pt-1 text-sm text-text-stem-gray">
              <p className="font-medium text-text-charcoal">
                Important cooking notes:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li className="">
                  Avoid sautéing mushrooms at excessive temperatures for too long to retain their natural juiciness and crunch.
                </li>
                <li className="">
                  Add red dates or sweet corn for an all-natural sweet undertone without refined sugar.
                </li>
              </ul>
            </div>
          </div>
          {/* Action Interaction Bar */}
          <div className="py-6 my-8 border-y border-border-sage-mist flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Heart/Like & Vote Button */}
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#DCE3D5] bg-[#FDFBF6] text-[#2B2A25] text-sm font-medium transition-colors duration-200 ease-in-out hover:border-[#A63446]/40 cursor-pointer" id="like-button" type="button">
                <svg className="w-5 h-5 text-current transition-colors" fill="none" id="like-icon" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                </svg>
                <span id="like-label" className="">
                  Like & Vote
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-black/5" id="like-count">
                  46
                </span>
              </button>
              {/* Save Recipe Button */}
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#DCE3D5] bg-[#FDFBF6] text-[#2B2A25] text-sm font-medium transition-colors duration-200 ease-in-out hover:border-[#A63446]/40 cursor-pointer" id="save-button" type="button">
                <svg className="w-4 h-4 text-current transition-colors" fill="none" id="save-icon" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                </svg>
                <span id="save-text" className="">
                  Save Recipe
                </span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              {/* Share button */}
              <button className="h-11 px-4 border border-border-sage-mist bg-surface-paper hover:bg-bg-herb-white text-text-charcoal font-medium text-sm rounded-lg flex items-center gap-2 transition-colors cursor-pointer" type="button">
                <svg className="w-4 h-4 text-text-stem-gray" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line>
                  <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>
                </svg>
                <span className="">
                  Share
                </span>
              </button>
            </div>
          </div>
          {/* Author Card Info */}
          <div className="bg-surface-paper border border-border-sage-mist rounded-xl p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E5EBE0] border border-border-sage-mist flex items-center justify-center text-primary-moss shrink-0 font-fraunces font-bold text-lg">
              {(post.authorName || 'Anonymous').substring(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-base text-text-charcoal">
                Author: {post.authorName || 'Anonymous'}
              </h3>
              <p className="text-sm text-text-stem-gray">
                Plant-based culinary instructor & cookbook author, sharing hearty traditional home recipes.
              </p>
            </div>
          </div>
          {/* COMMENTS SECTION */}
          <section className="pt-8 pb-12 space-y-8" id="comments">
            <div className="flex items-center justify-between border-b border-border-sage-mist pb-4">
              <h2 className="font-fraunces font-medium text-2xl text-text-charcoal flex items-center gap-2">
                <span className="">
                  Comments
                </span>
                <span className="text-base font-sans font-normal text-text-stem-gray">
                  (2)
                </span>
              </h2>
              <span className="text-xs text-text-stem-gray">
                Community guidelines: Warm & respectful
              </span>
            </div>
            {/* Comment Input Box */}
            <div className="bg-surface-paper border border-border-sage-mist rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-bg-herb-white border border-border-sage-mist flex items-center justify-center text-text-stem-gray">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <span className="text-sm font-medium text-text-charcoal">
                  Comment as:
                  <strong className="text-primary-moss">
                    User Name
                  </strong>
                </span>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-stem-gray mb-1.5" htmlFor="comment-text">
                  Recipe discussion and feedback
                </label>
                <textarea className="w-full bg-white border border-border-sage-mist rounded-lg p-3 text-sm text-text-charcoal placeholder-text-stem-gray focus:outline-none focus:border-primary-moss transition-colors resize-y" id="comment-text" placeholder="Share your thoughts or secret cooking tips..." rows="3"></textarea>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-text-stem-gray">
                  Basic markdown supported
                </span>
                <button className="h-11 px-6 bg-primary-moss hover:bg-primary-moss-hover text-white text-sm font-medium rounded-lg transition-colors focus:outline-none" type="button">
                  Post Comment
                </button>
              </div>
            </div>
            {/* Comments List */}
            <div className="space-y-4">
              {/* Realistic comment 1 from Mai Linh */}
              <div className="bg-surface-paper border border-border-sage-mist rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary-moss/10 text-primary-moss font-semibold text-xs border border-border-sage-mist flex items-center justify-center">
                      ML
                    </div>
                    <span className="text-sm font-medium text-text-charcoal">
                      Mai Linh
                    </span>
                    <span className="text-xs text-text-stem-gray">
                      • 2 hours ago
                    </span>
                  </div>
                  <button className="text-xs text-text-stem-gray hover:text-primary-moss transition-colors">
                    Reply
                  </button>
                </div>
                <p className="text-sm text-text-charcoal/90 pl-9">
                  I made this dish for dinner yesterday and my family loved the fragrant green peppercorn sauce! Thank you {post.authorName || 'Anonymous'} for sharing this wonderful technique.
                </p>
              </div>
              {/* Realistic comment 2 */}
              <div className="bg-surface-paper border border-border-sage-mist rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-bg-herb-white border border-border-sage-mist flex items-center justify-center text-text-stem-gray text-xs font-semibold">
                      AN
                    </div>
                    <span className="text-sm font-medium text-text-charcoal">
                      An Nguyen
                    </span>
                    <span className="text-xs text-text-stem-gray">
                      • 4 hours ago
                    </span>
                  </div>
                  <button className="text-xs text-text-stem-gray hover:text-primary-moss transition-colors">
                    Reply
                  </button>
                </div>
                <p className="text-sm text-text-charcoal/90 pl-9">
                  Fresh green peppercorns really make a big difference compared to dried black pepper. The mild herbal heat pairs perfectly with steamed brown rice.
                </p>
              </div>
            </div>
          </section>
        </article>
      </main>
      {/* Toast Notification */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 transform translate-y-20 opacity-0 pointer-events-none" id="save-toast">
        <div className="bg-surface-paper border border-border-sage-mist shadow-[0_2px_12px_rgba(43,42,37,0.12)] rounded-lg px-4 py-3 flex items-center gap-3 text-sm text-text-charcoal">
          <svg className="w-4 h-4 text-accent-beetroot" fill="#A63446" viewBox="0 0 24 24">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
          </svg>
          <span className="">
            Recipe saved to your collection.
          </span>
          <a className="text-primary-moss font-semibold hover:underline ml-1" href="#">
            View
          </a>
        </div>
      </div>
      {/* FOOTER */}
      <footer className="w-full border-t border-[#DCE3D5] bg-[#FDFBF6] py-6 mt-16">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-sm text-[#6B6F63] gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-semibold text-[#2F5233] text-base">
              Botanical Hearth
            </span>
            <span className="">
              •
            </span>
            <span className="">
              Plant-based culinary & family nutrition platform
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a className="hover:text-[#2F5233] transition-colors" href="#">
              About Us
            </a>
            <a className="hover:text-[#2F5233] transition-colors" href="#">
              Terms of Service
            </a>
            <a className="hover:text-[#2F5233] transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-[#2F5233] transition-colors" href="#">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
      {/* AI Nutrition Assistant FAB & Chat Popup Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Chat Popup Panel */}
        <div className="w-[380px] max-w-[calc(100vw-32px)] h-[520px] bg-surface-paper border border-border-sage-mist rounded-2xl shadow-[0_2px_12px_rgba(43,42,37,0.12)] flex flex-col overflow-hidden mb-3 hidden" id="chat-popup">
          {/* Header popup */}
          <div className="px-4 py-3 bg-surface-paper border-b border-border-sage-mist flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-bg-herb-white border border-border-sage-mist flex items-center justify-center text-primary-moss">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 001.423 1.423z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-charcoal">
                  AI Nutrition Assistant
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-text-stem-gray">
                  <span className="w-2 h-2 rounded-full bg-[#4C8C4A]"></span>
                  <span className="">
                    Online & Ready to help
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button aria-label="Minimize" className="w-7 h-7 rounded-lg text-text-stem-gray hover:text-text-charcoal hover:bg-bg-herb-white flex items-center justify-center transition-colors" id="chat-minimize" title="Minimize" type="button">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="5" x2="19" y1="12" y2="12"></line>
                </svg>
              </button>
              <button aria-label="Close" className="w-7 h-7 rounded-lg text-text-stem-gray hover:text-text-charcoal hover:bg-bg-herb-white flex items-center justify-center transition-colors" id="chat-close" title="Close" type="button">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
            </div>
          </div>
          {/* Messages Body */}
          <div className="flex-1 p-4 space-y-3.5 overflow-y-auto bg-bg-herb-white/40 text-xs leading-relaxed">
            {/* AI greeting */}
            <div className="flex items-start gap-2 max-w-[85%]">
              <div className="w-6 h-6 rounded-full bg-bg-herb-white border border-border-sage-mist flex items-center justify-center text-primary-moss shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 001.423 1.423z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <div className="bg-surface-paper border border-border-sage-mist text-text-charcoal p-3 rounded-2xl rounded-tl-sm shadow-sm">
                Hello! I am your Botanical Hearth AI Nutrition Assistant. I can help you explore plant-based recipes, check balanced macros, or suggest today's wholesome menu.
              </div>
            </div>
            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-primary-moss text-white p-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm leading-relaxed">
                Can you suggest a high-protein, light plant-based lunch for today?
              </div>
            </div>
            {/* AI response */}
            <div className="flex items-start gap-2 max-w-[88%]">
              <div className="w-6 h-6 rounded-full bg-bg-herb-white border border-border-sage-mist flex items-center justify-center text-primary-moss shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 001.423 1.423z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <div className="bg-surface-paper border border-border-sage-mist text-text-charcoal p-3 rounded-2xl rounded-tl-sm shadow-sm">
                For lunch today, try Lotus Seed Seaweed Soup paired with Steamed Silken Tofu in Shiitake Mushroom Sauce. This combo provides complete plant protein, cleanses your palate, and is easy to digest!
              </div>
            </div>
          </div>
          {/* Chip Suggestions */}
          <div className="px-3 py-2 bg-surface-paper border-t border-border-sage-mist flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button className="whitespace-nowrap px-2.5 py-1 bg-bg-herb-white hover:bg-[#E5EBE0] text-primary-moss border border-border-sage-mist rounded-full transition-colors" type="button">
              🌱 High-Protein Dishes
            </button>
            <button className="whitespace-nowrap px-2.5 py-1 bg-bg-herb-white hover:bg-[#E5EBE0] text-primary-moss border border-border-sage-mist rounded-full transition-colors" type="button">
              🥣 Balanced Calorie Meals
            </button>
            <button className="whitespace-nowrap px-2.5 py-1 bg-bg-herb-white hover:bg-[#E5EBE0] text-primary-moss border border-border-sage-mist rounded-full transition-colors" type="button">
              🥦 Ingredient Swaps
            </button>
          </div>
          {/* Chat input */}
          <div className="p-3 bg-surface-paper border-t border-border-sage-mist shrink-0">
            <div className="flex items-center gap-2">
              <input className="flex-1 bg-white border border-border-sage-mist rounded-xl px-3.5 py-2.5 text-xs text-text-charcoal placeholder-text-stem-gray focus:outline-none focus:border-primary-moss transition-colors" placeholder="Ask AI assistant about nutrition..." type="text" />
              <button aria-label="Send message" className="w-9 h-9 rounded-full bg-primary-moss hover:bg-primary-moss-hover text-white flex items-center justify-center shrink-0 transition-colors shadow-sm" type="button">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinejoin="round" stroke-round="round" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="22" x2="11" y1="2" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Chatbot FAB */}
        <button aria-label="Open AI Nutrition Assistant" className="w-14 h-14 rounded-full bg-primary-moss hover:bg-primary-moss-hover text-white flex items-center justify-center shadow-[0_2px_12px_rgba(43,42,37,0.12)] transition-all transform hover:scale-105 focus:outline-none" id="chat-fab" type="button">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 001.423 1.423z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
          </svg>
        </button>
      </div>
      {/* TODO: script goc da bi loai bo, can port lai logic bang useState/useEffect */}
    </>
  );
}

export default PostDetail;
