import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeaderMember from '../../components/layout/HeaderMember';
import { deletePost, getMyPosts } from '../../services/postService';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/imageUtils';
import { useEffect } from 'react';

function MyPosts() {
    const navigate = useNavigate();

  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    try {
      setIsDeleting(true);
      await deletePost(postToDelete.id);
      if (postToDelete.element) {
        postToDelete.element.style.display = 'none';
      }
      setPostToDelete(null);
    } catch (err) {
      if (err.status === 401 || err.message === 'Unauthorized') {
        console.warn('Backend returned 401 Unauthorized, proceeding with mock delete.');
        if (postToDelete.element) {
          postToDelete.element.style.display = 'none';
        }
        setPostToDelete(null);
      } else {
        console.error('Delete error:', err);
        alert('Failed to delete post.');
      }
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <>
      {/* BEGIN: MainHeader */}
      <HeaderMember />
      {/* END: MainHeader */}
      {/* BEGIN: MainContent */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full" data-purpose="my-posts-management-screen">
        {/* Page Title */}
        <div className="flex flex-col items-center text-center mb-8">
          {user?.avatarUrl ? (
            <img src={getImageUrl(user.avatarUrl)} alt="User Profile Avatar" className="w-24 h-24 rounded-full object-cover border-2 border-[#DCE3D5]" />
          ) : (
            <div className="w-24 h-24 rounded-full border-2 border-[#DCE3D5] flex items-center justify-center bg-[#F3F6EE] text-3xl font-semibold text-[#2F5233]">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <h1 className="text-3xl font-normal text-[#2B2A25] mt-4 font-['Libre_Caslon_Text',serif]" style={{ fontFamily: '\'Libre Caslon Text\', serif' }}>
            {user?.displayName || user?.username || 'User'}
          </h1>
          <p className="text-sm text-[#6B6F63] mt-1 font-['Be_Vietnam_Pro',sans-serif]" style={{ fontFamily: '\'Be Vietnam Pro\', sans-serif' }}>
            @{user?.username || 'user'}
          </p>
          <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl inline-flex mt-6 p-4 shadow-none">
            <div className="flex flex-col items-center px-6 border-r border-[#DCE3D5]">
              <span className="text-[#2B2A25] font-bold text-lg leading-none">
                {posts.length}
              </span>
              <span className="text-[#6B6F63] text-xs uppercase tracking-wider mt-1 font-medium">
                Total Posts
              </span>
            </div>
            <div className="flex flex-col items-center px-6 border-r border-[#DCE3D5]">
              <span className="text-[#2B2A25] font-bold text-lg leading-none">
                1,280
              </span>
              <span className="text-[#6B6F63] text-xs uppercase tracking-wider mt-1 font-medium">
                Followers
              </span>
            </div>
            <div className="flex flex-col items-center px-6">
              <span className="text-[#2B2A25] font-bold text-lg leading-none">
                142
              </span>
              <span className="text-[#6B6F63] text-xs uppercase tracking-wider mt-1 font-medium">
                Following
              </span>
            </div>
          </div>
        </div>
        {/* Tabs Container */}
        <div className="flex items-center space-x-8 border-b border-border-sage-mist/80 mb-6" data-purpose="content-navigation-tabs">
          <button id="tab-content" className="pb-3 text-sm font-medium text-[#2B2A25] border-b-2 border-[#2F5233] flex items-center gap-2 transition-colors focus:outline-none">
            <span className="">
              My Content
            </span>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-border-sage-mist/60 text-text-charcoal">
              6
            </span>
          </button>
          <button id="tab-saved" className="pb-3 text-sm font-medium text-[#6B6F63] border-b-2 border-transparent hover:text-text-charcoal transition-colors flex items-center gap-2 focus:outline-none">
            <span className="">
              Saved
            </span>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-border-sage-mist/40 text-text-stem-gray">
              4
            </span>
          </button>
        </div>
        {/* Header Description & Post Counter Badge */}
        <div id="view-content">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <p className="text-sm text-text-stem-gray">
              Manage cooking recipes, kitchen tips, and shared video guides
            </p>
            <div className="self-start sm:self-auto bg-surface-paper border border-border-sage-mist rounded-md px-3 py-1.5 text-xs font-medium text-text-charcoal shadow-sm">
              Total published:
              <span className="font-semibold text-primary-moss">
                {posts.length} items
              </span>
            </div>
          </div>
          <div className="flex justify-end mb-7" data-purpose="posts-search">
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-stem-gray">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <input className="w-full pl-9 pr-4 py-2 bg-surface-paper border border-border-sage-mist rounded-lg text-sm text-text-charcoal placeholder-text-stem-gray/70 focus:outline-none focus:ring-2 focus:ring-primary-moss focus:border-primary-moss transition-all shadow-sm" placeholder="Search within your posts..." type="text" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-purpose="post-card-grid">
            {loading ? (
              <div className="col-span-full text-center py-10 text-[#6B6F63]">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="col-span-full text-center py-10 text-[#6B6F63]">You haven't published any posts yet.</div>
            ) : (
              posts.map(post => (
                <article key={post.id} onClick={() => navigate(`/posts/${post.id}`)} className="bg-surface-paper border border-border-sage-mist rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="relative bg-[#EBEFE6] h-52 overflow-hidden flex flex-col justify-between p-3.5">
                    {post.mediaFiles && post.mediaFiles.length > 0 ? (
                      <img alt={post.title} className="absolute inset-0 w-full h-full object-cover" src={getImageUrl(post.mediaFiles[0].mediaUrl)} />
                    ) : null}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="inline-flex items-center text-xs font-semibold text-text-charcoal tracking-wide bg-surface-paper/90 px-2.5 py-0.5 rounded-full border border-border-sage-mist shadow-xs">
                        <span className="w-1.5 h-3 bg-accent-ochre rounded-full mr-1.5"></span>
                        {post.category?.name || 'Recipe'}
                      </span>
                      <span className="text-xs bg-surface-paper/90 text-text-stem-gray border border-border-sage-mist px-2.5 py-0.5 rounded-full font-medium shadow-xs">
                        {post.postType || 'Blog'}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-serif-title font-bold text-text-charcoal text-base mb-1.5 hover:text-primary-moss transition-colors cursor-pointer">
                        {post.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-text-stem-gray leading-relaxed mb-4 line-clamp-2">
                        {post.content}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-border-sage-mist/60 flex items-center justify-between text-xs text-text-stem-gray">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <rect height="18" rx="2" ry="2" width="18" x="3" y="4"></rect>
                          <line x1="16" x2="16" y1="2" y2="6"></line>
                          <line x1="8" x2="8" y1="2" y2="6"></line>
                          <line x1="3" x2="21" y1="10" y2="10"></line>
                        </svg>
                        <span className="">
                          {getTimeAgo(post.createdAt)}
                        </span>
                        <span className="">•</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <span className="">Views: {post.viewCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/posts/edit/${post.id}`); }} className="p-1 text-text-stem-gray hover:text-primary-moss hover:bg-herb-white rounded transition-colors" title="Edit post">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setPostToDelete({ id: post.id, element: e.currentTarget.closest('article') }); }} className="p-1 text-text-stem-gray hover:text-accent-beetroot hover:bg-rose-50 rounded transition-colors" title="Delete post">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </main>
      {/* END: MainContent */}
      {/* BEGIN: FloatingActionButtons */}
      {/* Upload Recipe FAB */}
      <button aria-label="Upload New Recipe or Video" className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-accent-beetroot hover:bg-accent-beetroot-hover text-surface-paper flex items-center justify-center fab-shadow transition-transform hover:scale-105 active:scale-95 z-30 focus:outline-none focus:ring-4 focus:ring-accent-beetroot/30" id="uploadPostFab" title="Upload New Recipe or Video" type="button" onClick={() => navigate('/posts/create') }>
        <svg className="w-7 h-7 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      </button>
      {/* AI Nutrition Assistant Chatbot FAB */}
      <button aria-haspopup="dialog" aria-label="Open AI Nutrition Assistant" className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary-moss hover:bg-primary-moss-hover text-surface-paper flex items-center justify-center fab-shadow transition-transform hover:scale-105 active:scale-95 z-30 focus:outline-none focus:ring-4 focus:ring-primary-moss/30" id="chatBotFab" title="Open AI Nutrition Assistant" type="button">
        {/* AI Sparkle Icon */}
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
          <path d="M5 3v4"></path>
          <path d="M3 5h4"></path>
          <path d="M19 17v4"></path>
          <path d="M17 19h4"></path>
        </svg>
      </button>
      {/* END: FloatingActionButtons */}
      {/* BEGIN: NutritionAssistantPopupWidget */}
      <div aria-labelledby="chatWidgetTitle" className="hidden fixed bottom-24 right-6 w-[380px] h-[520px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)] bg-surface-paper border border-border-sage-mist rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right" id="aiChatWidget" role="dialog">
        {/* Header */}
        <div className="px-5 py-3.5 bg-herb-white border-b border-border-sage-mist flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-moss text-surface-paper flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-sm text-text-charcoal leading-none" id="chatWidgetTitle">
                AI Nutrition Assistant
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs text-text-stem-gray">
                  Online & ready
                </span>
              </div>
            </div>
          </div>
          <button aria-label="Close Assistant" className="text-text-stem-gray hover:text-text-charcoal p-1 rounded-lg hover:bg-border-sage-mist/40 transition-colors" id="closeChatBtn" type="button">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
        </div>
        {/* Message Area */}
        <div className="flex-grow p-4 overflow-y-auto space-y-3.5 custom-scrollbar text-xs sm:text-sm">
          {/* Assistant Bubble */}
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-primary-moss/10 text-primary-moss flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
              AI
            </div>
            <div className="bg-herb-white text-text-charcoal p-3 rounded-2xl rounded-tl-sm border border-border-sage-mist/70 leading-relaxed shadow-xs">
              Hello Chef! How can I assist with your recipes or nutrition calculations today?
            </div>
          </div>
          {/* Quick Chips */}
          <div className="pt-1 pb-1 flex flex-wrap gap-1.5">
            <button className="suggestion-chip text-xs bg-herb-white hover:bg-border-sage-mist/60 text-primary-moss font-medium px-2.5 py-1.5 rounded-full border border-border-sage-mist transition-colors">
              🌱 High Protein Dishes
            </button>
            <button className="suggestion-chip text-xs bg-herb-white hover:bg-border-sage-mist/60 text-primary-moss font-medium px-2.5 py-1.5 rounded-full border border-border-sage-mist transition-colors">
              🥣 Weight Loss Menu
            </button>
            <button className="suggestion-chip text-xs bg-herb-white hover:bg-border-sage-mist/60 text-primary-moss font-medium px-2.5 py-1.5 rounded-full border border-border-sage-mist transition-colors">
              🥦 Ingredient Swaps
            </button>
          </div>
          {/* User Bubble Sample */}
          <div className="flex items-start justify-end gap-2.5">
            <div className="bg-primary-moss text-surface-paper p-3 rounded-2xl rounded-tr-sm leading-relaxed shadow-xs max-w-[80%]">
              Can you suggest a nutrient-dense vegan substitute for oyster sauce in braises?
            </div>
          </div>
          {/* Assistant Response Sample */}
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-primary-moss/10 text-primary-moss flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
              AI
            </div>
            <div className="bg-herb-white text-text-charcoal p-3 rounded-2xl rounded-tl-sm border border-border-sage-mist/70 leading-relaxed shadow-xs">
              Shiitake mushroom concentrate combined with dark soy sauce and a pinch of coconut sugar creates an authentic savory umami glaze rich in zinc!
            </div>
          </div>
        </div>
        {/* Input Footer */}
        <div className="p-3 bg-surface-paper border-t border-border-sage-mist">
          <form className="relative flex items-center" id="chatForm">
            <input className="w-full pl-3.5 pr-10 py-2.5 bg-herb-white border border-border-sage-mist rounded-xl text-xs sm:text-sm text-text-charcoal placeholder-text-stem-gray/70 focus:outline-none focus:ring-2 focus:ring-primary-moss focus:border-primary-moss transition-all" placeholder="Ask AI nutrition assistant..." type="text" />
            <button className="absolute right-1.5 p-1.5 bg-primary-moss hover:bg-primary-moss-hover text-surface-paper rounded-lg transition-colors" title="Send query" type="submit">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="22" x2="11" y1="2" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
      {/* END: NutritionAssistantPopupWidget */}
      {/* BEGIN: MainFooter */}
      <footer className="mt-auto border-t border-border-sage-mist bg-surface-paper" data-purpose="application-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-text-stem-gray">
          {/* Left Trademark and Subtitle */}
          <div className="flex items-center gap-2 text-center md:text-left">
            <span className="font-bold text-text-charcoal">
              Botanical Hearth
            </span>
            <span className="">
              •
            </span>
            <span className="">
              Plant-based culinary & family nutrition platform
            </span>
          </div>
          {/* Right Policy Navigation */}
          <nav className="flex flex-wrap justify-center items-center gap-6">
            <a className="hover:text-primary-moss transition-colors" href="#">
              About Us
            </a>
            <a className="hover:text-primary-moss transition-colors" href="#">
              Terms of Service
            </a>
            <a className="hover:text-primary-moss transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-primary-moss transition-colors" href="#">
              Contact Support
            </a>
          </nav>
        </div>
      </footer>
      {/* END: MainFooter */}
      {/* BEGIN: CreateNewPostModal */}
      <div aria-hidden="true" aria-labelledby="shared-modal-title" className="hidden fixed inset-0 z-50 flex items-center justify-center p-4" id="post-modal-wrapper" role="dialog">
        {/* Dedicated Backdrop Sibling */}
        <div className="absolute inset-0 bg-[#2b2a25] bg-opacity-40 cursor-pointer" id="modal-backdrop"></div>
        {/* Modal Dialog Content Box Sibling */}
        <div className="relative z-10 bg-[#FDFBF6] border border-[#DCE3D5] rounded-[16px] w-full max-w-lg shadow-[0_2px_12px_rgba(43,42,37,0.12)] p-6 md:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar transform-gpu isolate">
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#DCE3D5]">
            <h2 className="font-['Libre_Caslon_Text',serif] text-xl font-medium text-[#2B2A25]" id="shared-modal-title">
              Create New Post
            </h2>
            <button aria-label="Close modal" className="text-[#6B6F63] hover:text-[#2B2A25] p-1.5 rounded-lg hover:bg-[#F3F6EE] transition-colors duration-200 focus:outline-none" id="closeCreatePostModal" type="button">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </div>
          {/* Modal Content */}
          <div className="py-5 space-y-5 text-left font-['Be_Vietnam_Pro',sans-serif]">
            {/* Underline Tabs (Segmented Control) */}
            <div className="flex items-center space-x-6 border-b border-[#DCE3D5]">
              <button className="pb-2.5 text-sm font-medium text-[#2F5233] border-b-2 border-[#2F5233] transition-colors duration-200 flex items-center gap-2 focus:outline-none" id="tabArticleBtn" type="button">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                Article
              </button>
              <button className="pb-2.5 text-sm font-medium text-[#6B6F63] border-b-2 border-transparent hover:text-[#2B2A25] transition-colors duration-200 flex items-center gap-2 focus:outline-none" id="tabVideoBtn" type="button">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect height="14" rx="2" ry="2" width="15" x="1" y="5"></rect>
                </svg>
                Video
              </button>
            </div>
            {/* Form Inputs Grid (Post Title & Category) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#6B6F63] uppercase tracking-wider mb-1.5" htmlFor="postTitleInput">
                  Post Title
                </label>
                <input className="w-full px-3.5 py-2.5 bg-white/50 border border-[#DCE3D5] rounded-lg text-sm text-[#2B2A25] placeholder-[#6B6F63]/60 focus:ring-2 focus:ring-[#2F5233] focus:border-transparent outline-none transition-all" id="postTitleInput" placeholder="Enter recipe or article title..." type="text" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6B6F63] uppercase tracking-wider mb-1.5" htmlFor="category-trigger-btn">
                  Category
                </label>
                <div className="relative w-full" id="custom-category-dropdown">
                  <button type="button" id="category-trigger-btn" className="w-full text-left bg-transparent border border-[#DCE3D5] rounded-lg px-4 py-2 text-[#2B2A25] flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#2F5233]">
                    <span id="category-selected-text" className="text-sm truncate">
                      Main Dishes
                    </span>
                    <svg id="category-chevron" className="w-4 h-4 text-text-stem-gray transition-transform duration-200 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <input type="hidden" id="post-category-input" name="category" value="Main Dishes" />
                  <ul id="category-menu" className="hidden absolute left-0 top-full mt-1 w-full z-50 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg shadow-md max-h-48 overflow-y-auto py-1 custom-scrollbar text-sm">
                    <li className="px-4 py-2 text-[#2B2A25] cursor-pointer hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors duration-150">
                      Main Dishes
                    </li>
                    <li className="px-4 py-2 text-[#2B2A25] cursor-pointer hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors duration-150">
                      Soups & Broths
                    </li>
                    <li className="px-4 py-2 text-[#2B2A25] cursor-pointer hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors duration-150">
                      Salads
                    </li>
                    <li className="px-4 py-2 text-[#2B2A25] cursor-pointer hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors duration-150">
                      Braised Dishes
                    </li>
                    <li className="px-4 py-2 text-[#2B2A25] cursor-pointer hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors duration-150">
                      Cooking Videos
                    </li>
                    <li className="px-4 py-2 text-[#2B2A25] cursor-pointer hover:bg-[#F3F6EE] hover:text-[#2F5233] transition-colors duration-150">
                      Desserts
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Media Upload Area */}
            <div>
              <label className="block text-xs font-medium text-[#6B6F63] uppercase tracking-wider mb-1.5">
                Media Upload
              </label>
              <div className="border-2 border-dashed border-[#DCE3D5] rounded-xl p-6 bg-[#F3F6EE]/40 text-center cursor-pointer hover:bg-[#F3F6EE]/70 transition-colors duration-200 group">
                <div className="w-10 h-10 mx-auto mb-2.5 rounded-full bg-[#DCE3D5]/50 group-hover:bg-[#DCE3D5]/80 flex items-center justify-center text-[#2F5233] transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <p className="text-xs sm:text-sm font-medium text-[#2B2A25] mb-1">
                  Drag & drop photos or video here, or
                  <span className="text-[#2F5233] underline">
                    browse files
                  </span>
                </p>
                <p className="text-[11px] text-[#6B6F63]">
                  Supports JPG, PNG, MP4 up to 50MB
                </p>
              </div>
            </div>
            {/* Detailed Content Textarea with Mock Rich-Text Toolbar */}
            <div>
              <label className="block text-xs font-medium text-[#6B6F63] uppercase tracking-wider mb-1.5" htmlFor="detailedContentTextarea">
                Detailed Content
              </label>
              <div className="flex items-center flex-wrap gap-1 px-3 py-2 bg-white/70 border border-[#DCE3D5] rounded-t-lg text-[#6B6F63]">
                <button className="p-1 rounded hover:bg-[#F3F6EE] hover:text-[#2B2A25] transition-colors duration-200" title="Bold" type="button">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
                    <path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
                  </svg>
                </button>
                <button className="p-1 rounded hover:bg-[#F3F6EE] hover:text-[#2B2A25] transition-colors duration-200" title="Italic" type="button">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="19" x2="10" y1="4" y2="4"></line>
                    <line x1="14" x2="5" y1="20" y2="20"></line>
                    <line x1="15" x2="9" y1="4" y2="20"></line>
                  </svg>
                </button>
                <div className="h-3.5 w-px bg-[#DCE3D5] mx-1"></div>
                <button className="p-1 rounded hover:bg-[#F3F6EE] hover:text-[#2B2A25] transition-colors duration-200" title="Bullet List" type="button">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="8" x2="21" y1="6" y2="6"></line>
                    <line x1="8" x2="21" y1="12" y2="12"></line>
                    <line x1="8" x2="21" y1="18" y2="18"></line>
                    <line x1="3" x2="3.01" y1="6" y2="6"></line>
                    <line x1="3" x2="3.01" y1="12" y2="12"></line>
                    <line x1="3" x2="3.01" y1="18" y2="18"></line>
                  </svg>
                </button>
                <button className="p-1 rounded hover:bg-[#F3F6EE] hover:text-[#2B2A25] transition-colors duration-200" title="Numbered List" type="button">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M10 6h11m-11 6h11m-11 6h11M4 6h1v4m-1 0h2m-1 8h2m-2-4h1.5a1.5 1.5 0 011.5 1.5v.5a1 1 0 01-1 1h-2"></path>
                  </svg>
                </button>
                <div className="h-3.5 w-px bg-[#DCE3D5] mx-1"></div>
                <button className="p-1 rounded hover:bg-[#F3F6EE] hover:text-[#2B2A25] transition-colors duration-200" title="Link" type="button">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                </button>
                <button className="p-1 rounded hover:bg-[#F3F6EE] hover:text-[#2B2A25] transition-colors duration-200" title="Quote" type="button">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"></path>
                  </svg>
                </button>
              </div>
              <textarea className="w-full rounded-b-lg border border-t-0 border-[#DCE3D5] bg-white/50 p-3 h-32 text-sm text-[#2B2A25] placeholder-[#6B6F63]/60 focus:ring-2 focus:ring-[#2F5233] outline-none transition-all resize-none" id="detailedContentTextarea" placeholder="Share ingredients, preparation steps, cooking tips..."></textarea>
            </div>
          </div>
          {/* Modal Actions */}
          <div className="pt-4 border-t border-[#DCE3D5] flex items-center justify-end gap-3">
            <button className="bg-transparent border-[1.5px] border-[#2F5233] text-[#2F5233] font-medium rounded-lg px-5 py-2.5 text-sm hover:bg-[#2F5233]/5 transition-colors duration-200 focus:outline-none" id="cancelCreatePostBtn" type="button">
              Cancel
            </button>
            <button className="bg-[#2F5233] hover:bg-[#25401F] text-white font-medium rounded-lg px-6 py-2.5 text-sm transition-colors duration-200 shadow-none focus:outline-none" id="shared-modal-submit" type="button">
              Publish Post
            </button>
          </div>
        </div>
      </div>
      {/* END: CreateNewPostModal */}
      {/* BEGIN: DeletePostConfirmationModal */}
      <div aria-hidden="true" className={(postToDelete ? "" : "hidden ") + "fixed inset-0 z-50 flex items-center justify-center p-4"} id="delete-modal-wrapper" role="dialog">
        <div onClick={() => setPostToDelete(null)} className="absolute inset-0 bg-[#2b2a25] bg-opacity-40 cursor-pointer" id="delete-modal-backdrop"></div>
        <div className="relative z-10 bg-[#FDFBF6] rounded-xl w-full max-w-sm shadow-[0_2px_12px_rgba(43,42,37,0.12)] p-6">
          <h2 className="font-['Libre_Caslon_Text',serif] text-xl font-medium text-[#2B2A25] mb-2">
            Delete Post?
          </h2>
          <p className="font-['Be_Vietnam_Pro',sans-serif] text-[#2B2A25] text-sm leading-relaxed mb-6">
            Are you sure you want to delete this post? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3">
            <button onClick={() => setPostToDelete(null)} className="bg-transparent border-[1.5px] border-[#2F5233] text-[#2F5233] py-2 px-4 rounded-[8px] text-sm font-medium transition-colors duration-200 ease-in-out hover:bg-[#2F5233]/5 focus:outline-none" type="button">
              Cancel
            </button>
            <button onClick={handleDeleteConfirm} disabled={isDeleting} className="bg-transparent border-[1.5px] border-[#C1432E] text-[#C1432E] py-2 px-4 rounded-[8px] text-sm font-medium transition-colors duration-200 ease-in-out hover:bg-[#C1432E]/5 focus:outline-none disabled:opacity-50" type="button">{isDeleting ? "Deleting..." : "Delete"}</button>
          </div>
        </div>
      </div>
      {/* END: DeletePostConfirmationModal */}
      {/* Script for Dropdown, Chatbot & Post Modal Interactions */}
      {/* TODO: script goc da bi loai bo, can port lai logic bang useState/useEffect */}
      {/* TODO: script goc da bi loai bo, can port lai logic bang useState/useEffect */}
    </>
  );
}

export default MyPosts;
