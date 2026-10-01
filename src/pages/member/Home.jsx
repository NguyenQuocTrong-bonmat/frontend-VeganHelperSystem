import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getPostsFeed } from '../../services/postService'
import { getImageUrl } from '../../utils/imageUtils'

import HeaderMember from '../../components/layout/HeaderMember'

function Home() {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeed() {
      try {
        const data = await getPostsFeed({ pageIndex: 1, pageSize: 10 });
        setPosts(data.items || []);
      } catch (err) {
        console.error('Failed to load feed:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeed();
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

  return (
    <>
      <HeaderMember />
      {/* MAIN CONTENT CONTAINER (max-w 1120px, gutter 24px per DESIGN.md section 4) */}
      <main className="flex-1 w-full max-w-[1120px] mx-auto px-6 py-8 md:py-10">
        {/* SEARCH BAR SECTION */}
        <section className="mb-6" id="search-section">
          <div className="flex items-center gap-3 w-full max-w-[900px] mx-auto mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-[#6B6F63]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
                </svg>
              </div>
              <input className="w-full h-12 pl-12 pr-12 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[15px] text-[#2B2A25] placeholder-[#6B6F63] focus:border-[#2F5233] focus:outline-none transition-colors font-medium" id="search-input" placeholder="Search recipes, video guides, vegan ingredients..." type="text" defaultValue="" />
            </div>
            <button className="h-12 px-6 bg-[#2F5233] hover:bg-[#25401F] text-white rounded-lg font-semibold text-[15px] flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 shadow-sm" type="button">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
              </svg>
              <span className="">
                Search
              </span>
            </button>
          </div>
        </section>
        {/* CATEGORY BAR (Vertical 3px color bar + lowercase category name per DESIGN.md section 6) */}
        <section className="mb-10">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {/* Tab All (Active) */}
            <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#2F5233] rounded-lg text-[14px] font-medium text-[#2F5233] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
              <span className="w-[3px] h-4 bg-[#2F5233] rounded-full"></span>
              <span className="">
                all
              </span>
            </button>
            {/* Category: Main Dishes (Moss) */}
            <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#2F5233] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
              <span className="w-[3px] h-4 bg-[#2F5233] rounded-full"></span>
              <span className="">
                main dishes
              </span>
            </button>
            {/* Category: Soups (Turmeric) */}
            <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#D9A441] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
              <span className="w-[3px] h-4 bg-[#D9A441] rounded-full"></span>
              <span className="">
                soups
              </span>
            </button>
            {/* Category: Salads (Beetroot) */}
            <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#A63446] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
              <span className="w-[3px] h-4 bg-[#A63446] rounded-full"></span>
              <span className="">
                salads
              </span>
            </button>
            {/* Category: Braised Dishes (Stem Gray) */}
            <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#6B6F63] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
              <span className="w-[3px] h-4 bg-[#6B6F63] rounded-full"></span>
              <span className="">
                braised dishes
              </span>
            </button>
            {/* Category: Desserts (Turmeric) */}
            <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#D9A441] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
              <span className="w-[3px] h-4 bg-[#D9A441] rounded-full"></span>
              <span className="">
                desserts
              </span>
            </button>
            {/* Category: Cooking Videos (Beetroot) */}
            <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#A63446] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
              <span className="w-[3px] h-4 bg-[#A63446] rounded-full"></span>
              <span className="">
                cooking videos
              </span>
            </button>
          </div>
        </section>
        {/* SECTION: FEATURED POST (Card lớn với ảnh hero bo góc bất đối xứng top-left 32px per DESIGN.md section 5) */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-fraunces text-2xl font-medium text-[#2B2A25]">
              Featured Post
            </h2>
            <span className="text-[13px] font-medium text-[#6B6F63]">
              Weekly recommendation
            </span>
          </div>
          <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center cursor-pointer hover:border-[#2F5233] transition-colors group" to="/posts/1">
            {/* Featured Image with Asymmetric Radius */}
            <div className="relative overflow-hidden lg:col-span-6 w-full h-64 md:h-80 bg-[#E9EFE6] border border-[#DCE3D5] hero-radius flex flex-col items-center justify-center p-4 text-center transition-transform group-hover:scale-[1.01]">
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-white text-[12px] font-medium z-10 font-vietnam" style={{ background: 'rgba(43, 42, 37, 0.6)' }}>
                1/5
              </span>
              <img src="https://lh3.googleusercontent.com/aida/AEtjO1WB5ue4YCiF80yX2LzmxjB651NSmec6AmpbmpsEy1yW2-RMH9r6Fa4PggMuAx5Grp-uwgUJ6OPHepQksJuRi6w6mXPryD_ffHB6dt4S8aLkuIaMrpE2GkbpHQ579qI0feP47eU3GW1We4Znk4_VP1cUcagdQ2fOCkgqdbLJORKO5mrR3oCKdmvYTWCmapm2oMAjUBSCNUXJgEwMVMlvDpkLFAW9v4-XBXy5P9u6krFA6hwJi5RXRipZfjI" alt="Claypot Braised King Oyster Mushrooms with Green Peppercorn" className="w-full h-full object-cover" />
            </div>
            {/* Featured Content */}
            <div className="lg:col-span-6 flex flex-col justify-between h-full py-1 text-left">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-[3px] h-4 bg-[#2F5233] rounded-full"></span>
                  <span className="text-[13px] font-medium text-[#6B6F63]">
                    main dishes
                  </span>
                  <span className="text-xs text-[#6B6F63]">
                    •
                  </span>
                  <span className="text-[13px] text-[#6B6F63]">
                    25 minutes ago
                  </span>
                </div>
                <h3 className="font-fraunces text-2xl md:text-3xl font-semibold text-[#2B2A25] group-hover:text-[#2F5233] transition-colors mb-3 leading-snug">
                  Claypot Braised King Oyster Mushrooms with Green Peppercorn
                </h3>
                <p className="text-[15px] leading-relaxed text-[#6B6F63] mb-6">
                  Tender king oyster mushrooms gently simmered in an earthenware pot with fresh green peppercorns, aromatic soy reduction, and coconut water for authentic rustic sweetness.
                </p>
              </div>
              <div className="pt-4 border-t border-[#DCE3D5] flex items-center justify-between text-[13px] text-[#6B6F63]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <circle cx="12" cy="7" r="4"></circle>
                      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                    </svg>
                  </div>
                  <span className="font-medium text-[#2B2A25]">
                    Chef Duy
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="">
                    Views:
                    <strong className="font-semibold text-[#2B2A25]">
                      342
                    </strong>
                  </span>
                  <span className="flex items-center gap-1 text-[#A63446]">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                    </svg>
                    <span className="text-[#6B6F63]">
                      Likes:
                    </span>
                    <strong className="font-semibold text-[#2B2A25]">
                      124
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
        {/* SECTION: NEWEST RECIPES & VIDEOS (Feed / List Item per DESIGN.md section 6) */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-fraunces text-2xl font-medium text-[#2B2A25]">
              Newest Recipes & Videos
            </h2>
            <div className="flex items-center gap-2 text-[13px] text-[#6B6F63]">
              <span className="text-[#2B2A25] font-semibold underline underline-offset-4">
                Newest
              </span>
              <span className="">
                •
              </span>
              <span className="hover:text-[#2F5233] cursor-pointer">
                Popular
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="text-center py-10 text-[#6B6F63]">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-10 text-[#6B6F63]">No posts found.</div>
            ) : (
              posts.map(post => (
                <Link key={post.id} className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer group" to={`/posts/${post.id}`}>
                  <div className="relative overflow-hidden w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 flex flex-col items-center justify-center p-3 text-center transition-transform group-hover:scale-[1.01]">
                    {post.mediaFiles && post.mediaFiles.length > 0 ? (
                      <img src={getImageUrl(post.mediaFiles[0].mediaUrl)} alt={post.title} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <div className="text-[#6B6F63] text-sm">No Image</div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-[3px] h-3.5 bg-[#2F5233] rounded-full"></span>
                        <span className="text-[13px] font-medium text-[#6B6F63] lowercase">
                          {post.category?.name || 'recipe'}
                        </span>
                        <span className="text-xs text-[#6B6F63]">•</span>
                        <span className="text-[13px] text-[#6B6F63]">
                          {getTimeAgo(post.createdAt)}
                        </span>
                      </div>
                      <h3 className="font-vietnam text-[18px] md:text-[20px] font-semibold text-[#2B2A25] mb-2 leading-snug group-hover:text-[#2F5233] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-[14px] md:text-[15px] leading-relaxed text-[#6B6F63] line-clamp-2 mb-3">
                        {post.content}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#DCE3D5] flex items-center justify-between text-[13px] text-[#6B6F63]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center overflow-hidden">
                          {post.user?.avatarUrl ? (
                            <img src={getImageUrl(post.user.avatarUrl)} className="w-full h-full object-cover" />
                          ) : (
                            <svg className="w-3.5 h-3.5 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                              <circle cx="12" cy="7" r="4"></circle>
                              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                            </svg>
                          )}
                        </div>
                        <span className="font-medium text-[#2B2A25]">
                          {post.user?.displayName || post.user?.username || 'User'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="">
                          Views:
                          <strong className="font-semibold text-[#2B2A25] ml-1">{post.viewCount || 0}</strong>
                        </span>
                        <span className="flex items-center gap-1 text-[#A63446]">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                          </svg>
                          <span className="text-[#6B6F63]">Likes:</span>
                          <strong className="font-semibold text-[#2B2A25]">{post.likeCount || 0}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </main>
      {/* CHATBOT FAB (Global, bottom right, primary-moss background, single shadow per DESIGN.md section 12) */}
      <aside className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* CHATBOT FAB (circular button w-14 h-14 bg #2F5233) */}
        <button className="w-14 h-14 rounded-full bg-[#2F5233] hover:bg-[#25401F] text-white flex items-center justify-center modal-shadow transition-transform hover:scale-105 cursor-pointer" id="chat-fab" title="Botanical Hearth AI Assistant">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 00-1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
          </svg>
        </button>
        {/* POPUP PANEL CHAT */}
        <div className="hidden fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-32px)] h-[520px] bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl modal-shadow z-50 flex flex-col overflow-hidden" id="chat-popup">
          {/* Header Popup */}
          <div className="h-16 px-4 bg-[#FDFBF6] border-b border-[#DCE3D5] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#F3F6EE] border border-[#DCE3D5] flex items-center justify-center text-[#2F5233]">
                <svg className="w-5 h-5 text-[#2F5233]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 00-1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-vietnam text-[15px] font-semibold text-[#2B2A25] leading-tight">
                  AI Nutrition Assistant
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#4C8C4A]"></span>
                  <span className="text-[11px] text-[#6B6F63]">
                    Online & Ready
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[#6B6F63]">
              <button className="w-8 h-8 rounded-lg hover:bg-[#E9EFE6] flex items-center justify-center text-[#2B2A25] transition-colors cursor-pointer" id="chat-minimize" title="Minimize">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="5" x2="19" y1="12" y2="12"></line>
                </svg>
              </button>
              <button className="w-8 h-8 rounded-lg hover:bg-[#E9EFE6] flex items-center justify-center text-[#2B2A25] transition-colors cursor-pointer" id="chat-close" title="Close">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" x2="6" y1="6" y2="18"></line>
                  <line x1="6" x2="18" y1="6" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-[13px] leading-relaxed bg-[#F3F6EE]/40">
            {/* AI Greeting */}
            <div className="flex gap-2.5 max-w-[88%]">
              <div className="w-7 h-7 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center text-[#2F5233] shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                </svg>
              </div>
              <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl rounded-tl-none p-3 text-[#2B2A25]">
                Hello! I am the Botanical Hearth AI Nutrition Assistant. I can help you discover wholesome plant-based recipes, calculate nutritional balance, or suggest meal ideas for today.
              </div>
            </div>
            {/* User Message */}
            <div className="flex justify-end">
              <div className="max-w-[85%] bg-[#2F5233] text-white rounded-xl rounded-tr-none p-3 text-[13px]">
                Could you recommend a light, high-protein plant-based lunch for today?
              </div>
            </div>
            {/* AI Response */}
            <div className="flex gap-2.5 max-w-[88%]">
              <div className="w-7 h-7 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center text-[#2F5233] shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                </svg>
              </div>
              <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl rounded-tl-none p-3 text-[#2B2A25]">
                For lunch today, consider trying:
                <strong>
                  Lotus Seed & Seaweed Soup
                </strong>
                paired with
                <strong>
                  Silken Tofu in Shiitake Mushroom Sauce
                </strong>
                . This combination offers complete plant protein, purifies the palate, and is very gentle on digestion!
              </div>
            </div>
          </div>
          {/* Suggested Quick Chips */}
          <div className="px-3.5 py-2 bg-[#FDFBF6] border-t border-[#DCE3D5] flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            <button className="px-2.5 py-1 rounded-full bg-[#F3F6EE] hover:bg-[#E9EFE6] border border-[#DCE3D5] text-[12px] text-[#2F5233] whitespace-nowrap transition-colors cursor-pointer">
              🌱 High Protein Dishes
            </button>
            <button className="px-2.5 py-1 rounded-full bg-[#F3F6EE] hover:bg-[#E9EFE6] border border-[#DCE3D5] text-[12px] text-[#2F5233] whitespace-nowrap transition-colors cursor-pointer">
              🥣 Weight Loss Menu
            </button>
            <button className="px-2.5 py-1 rounded-full bg-[#F3F6EE] hover:bg-[#E9EFE6] border border-[#DCE3D5] text-[12px] text-[#2F5233] whitespace-nowrap transition-colors cursor-pointer">
              🥦 Ingredient Swaps
            </button>
          </div>
          {/* Message Input Field */}
          <div className="p-3 bg-[#FDFBF6] border-t border-[#DCE3D5] shrink-0">
            <div className="flex items-center gap-2">
              <input className="flex-1 h-10 px-3.5 bg-[#F3F6EE] border border-[#DCE3D5] rounded-xl text-[13px] text-[#2B2A25] placeholder-[#6B6F63] focus:border-[#2F5233] focus:outline-none transition-colors" placeholder="Ask AI nutrition assistant..." type="text" />
              <button className="w-10 h-10 rounded-xl bg-[#2F5233] hover:bg-[#25401F] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer" title="Send message">
                <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>
      {/* FOOTER (surface-paper, top border border-sage-mist) */}
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
      {/* TODO: script goc da bi loai bo, can port lai logic bang useState/useEffect */}
      {/* TODO: script goc da bi loai bo, can port lai logic bang useState/useEffect */}
    </>
  );
}

export default Home;
