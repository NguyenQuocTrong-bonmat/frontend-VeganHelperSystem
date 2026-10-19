import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { searchPosts } from '../../services/postService';
import { searchUsers } from '../../services/userService';
import UserCard from './UserCard';
import InlinePostCard from './InlinePostCard';
import CommentModal from './CommentModal';
import ImageLightbox from '../ui/ImageLightbox';
import UserProfilePreview from './UserProfilePreview';
import toast from 'react-hot-toast';

// Skeletons
function PostSkeleton() {
  return (
    <div className="w-full bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl p-5 animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#E9EFE6]"></div>
        <div className="space-y-1.5 flex-1">
          <div className="w-32 h-4 bg-[#E9EFE6] rounded"></div>
          <div className="w-24 h-3 bg-[#E9EFE6] rounded"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="w-3/4 h-5 bg-[#E9EFE6] rounded"></div>
        <div className="w-full h-4 bg-[#E9EFE6] rounded"></div>
        <div className="w-4/5 h-4 bg-[#E9EFE6] rounded"></div>
      </div>
      <div className="w-full h-56 rounded-xl bg-[#E9EFE6]"></div>
      <div className="flex items-center justify-between pt-3 border-t border-[#DCE3D5]/40">
        <div className="w-16 h-4 bg-[#E9EFE6] rounded"></div>
        <div className="w-20 h-4 bg-[#E9EFE6] rounded"></div>
        <div className="w-16 h-4 bg-[#E9EFE6] rounded"></div>
      </div>
    </div>
  );
}

function UserSkeleton() {
  return (
    <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl p-5 flex flex-col items-center gap-3.5 animate-pulse">
      <div className="w-20 h-20 rounded-full bg-[#E9EFE6]"></div>
      <div className="w-28 h-4 bg-[#E9EFE6] rounded"></div>
      <div className="w-20 h-3 bg-[#E9EFE6] rounded"></div>
      <div className="w-full h-8 bg-[#E9EFE6] rounded-xl mt-2"></div>
    </div>
  );
}

function SearchCore({ isGuest }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryKeyword = searchParams.get('q') || '';
  let queryTab = (searchParams.get('tab') || 'all').toLowerCase();
  if (queryTab === 'recipes') queryTab = 'posts';
  if (!['all', 'posts', 'people'].includes(queryTab)) queryTab = 'all';
  const queryPage = parseInt(searchParams.get('page')) || 1;

  const [inputValue, setInputValue] = useState(queryKeyword);
  const [activeTab, setActiveTab] = useState(queryTab);
  const [currentPage, setCurrentPage] = useState(queryPage);

  // Independent Data States
  const [posts, setPosts] = useState([]);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const [totalPostsPages, setTotalPostsPages] = useState(0);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState(null);

  const [users, setUsers] = useState([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [totalUsersPages, setTotalUsersPages] = useState(0);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  const latestRequest = useRef(0);

  // Comment Modal state
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [commentTriggerRef, setCommentTriggerRef] = useState(null);
  const countCallbackRef = useRef(null);

  // Profile Preview Popover state
  const [profilePreviewState, setProfilePreviewState] = useState({
    isOpen: false,
    user: null,
    triggerEl: null,
  });

  const handleOpenProfilePreview = useCallback((user, triggerEl) => {
    setProfilePreviewState({
      isOpen: true,
      user,
      triggerEl,
    });
  }, []);

  const handleCloseProfilePreview = useCallback(() => {
    setProfilePreviewState({
      isOpen: false,
      user: null,
      triggerEl: null,
    });
  }, []);

  // Lightbox state
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    src: null,
    alt: null,
  });

  const handleOpenComments = useCallback((post, triggerRef, countUpdater) => {
    setActiveCommentPost(post);
    setCommentTriggerRef(triggerRef);
    countCallbackRef.current = countUpdater;
  }, []);

  const handleCloseComments = useCallback(() => {
    setActiveCommentPost(null);
    countCallbackRef.current = null;
  }, []);

  const handleCommentCountChange = useCallback((newCount) => {
    if (typeof countCallbackRef.current === 'function') {
      countCallbackRef.current(newCount);
    }
  }, []);

  const handleOpenLightbox = useCallback((src, alt) => {
    setLightboxState({
      isOpen: true,
      src,
      alt,
    });
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxState({
      isOpen: false,
      src: null,
      alt: null,
    });
  }, []);

  const handleAuthRequired = useCallback(() => {
    toast.error('Please log in to interact with posts.');
    navigate('/login');
  }, [navigate]);

  // Sync state with URL params
  useEffect(() => {
    setInputValue(queryKeyword);
    setActiveTab(queryTab);
    setCurrentPage(queryPage);

    if (queryKeyword.trim()) {
      executeSearch(queryKeyword.trim(), queryTab, queryPage);
    } else {
      clearAllResults();
    }
  }, [queryKeyword, queryTab, queryPage]);

  const clearAllResults = () => {
    setPosts([]);
    setUsers([]);
    setTotalPostsCount(0);
    setTotalUsersCount(0);
    setTotalPostsPages(0);
    setTotalUsersPages(0);
    setPostsError(null);
    setUsersError(null);
    setPostsLoading(false);
    setUsersLoading(false);
  };

  const executeSearch = async (keyword, tab, page) => {
    const requestId = ++latestRequest.current;

    // Reset errors and start loading based on active tab
    if (tab === 'posts') {
      setPostsLoading(true);
      setPostsError(null);
      setUsersLoading(false);
      setUsersError(null);
    } else if (tab === 'people') {
      setUsersLoading(true);
      setUsersError(null);
      setPostsLoading(false);
      setPostsError(null);
    } else {
      // 'all' tab
      setPostsLoading(true);
      setUsersLoading(!isGuest);
      setPostsError(null);
      setUsersError(null);
    }

    const fetchPostsTask = async () => {
      try {
        const pageSize = tab === 'all' ? 6 : 10;
        const pageIdx = tab === 'all' ? 1 : page;
        const result = await searchPosts({ keyword, pageIndex: pageIdx, pageSize });
        if (latestRequest.current === requestId) {
          setPosts(result.items || []);
          const count = result.totalCount ?? result.totalItems ?? (result.items || []).length;
          setTotalPostsCount(count);
          setTotalPostsPages(result.totalPages || Math.ceil(count / pageSize) || 1);
          setPostsError(null);
        }
      } catch (err) {
        if (latestRequest.current === requestId) {
          setPosts([]);
          setTotalPostsCount(0);
          setTotalPostsPages(0);
          setPostsError(err.message || 'Failed to load posts from server.');
        }
      } finally {
        if (latestRequest.current === requestId) {
          setPostsLoading(false);
        }
      }
    };

    const fetchUsersTask = async () => {
      if (isGuest) {
        if (latestRequest.current === requestId) {
          setUsers([]);
          setTotalUsersCount(0);
          setTotalUsersPages(0);
          setUsersLoading(false);
        }
        return;
      }
      try {
        const pageSize = tab === 'all' ? 4 : 12;
        const pageIdx = tab === 'all' ? 1 : page;
        const result = await searchUsers({ keyword, pageIndex: pageIdx, pageSize });
        if (latestRequest.current === requestId) {
          setUsers(result.items || []);
          const count = result.totalCount ?? result.totalItems ?? (result.items || []).length;
          setTotalUsersCount(count);
          setTotalUsersPages(result.totalPages || Math.ceil(count / pageSize) || 1);
          setUsersError(null);
        }
      } catch (err) {
        if (latestRequest.current === requestId) {
          setUsers([]);
          setTotalUsersCount(0);
          setTotalUsersPages(0);
          setUsersError(err.message || 'Failed to load community members.');
        }
      } finally {
        if (latestRequest.current === requestId) {
          setUsersLoading(false);
        }
      }
    };

    if (tab === 'posts') {
      await fetchPostsTask();
    } else if (tab === 'people') {
      if (isGuest) {
        setUsersLoading(false);
        return;
      }
      await fetchUsersTask();
    } else {
      // 'all' tab executes both independently
      await Promise.allSettled([fetchPostsTask(), fetchUsersTask()]);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const cleanKeyword = inputValue.trim();
    if (!cleanKeyword) return;

    setSearchParams({
      q: cleanKeyword,
      tab: activeTab,
      page: 1,
    });
  };

  const clearSearch = () => {
    setInputValue('');
    setSearchParams({
      tab: activeTab,
      page: 1,
    });
  };

  const switchTab = (tabName) => {
    setActiveTab(tabName);
    const params = { tab: tabName, page: 1 };
    if (queryKeyword.trim()) {
      params.q = queryKeyword.trim();
    }
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const maxPages = activeTab === 'posts' ? totalPostsPages : totalUsersPages;
    if (newPage < 1 || newPage > maxPages) return;
    setSearchParams({
      q: queryKeyword,
      tab: activeTab,
      page: newPage,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Nav filter items
  const filterTabs = [
    {
      id: 'all',
      label: 'All',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
        </svg>
      ),
    },
    {
      id: 'posts',
      label: 'Posts',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
        </svg>
      ),
    },
    {
      id: 'people',
      label: 'People',
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      ),
    },
  ];

  // Reliable Summary Count
  const renderSummaryCount = () => {
    if (!queryKeyword) return null;

    if (activeTab === 'posts') {
      if (postsLoading) return 'Searching posts...';
      if (postsError) return 'Posts search error';
      return `${totalPostsCount} ${totalPostsCount === 1 ? 'post' : 'posts'} found`;
    }

    if (activeTab === 'people') {
      if (isGuest) return 'Guest mode';
      if (usersLoading) return 'Searching people...';
      if (usersError) return 'People search error';
      return `${totalUsersCount} ${totalUsersCount === 1 ? 'person' : 'people'} found`;
    }

    // activeTab === 'all'
    if (postsLoading || usersLoading) return 'Searching...';
    if (postsError && usersError) return 'Search encountered errors';
    if (postsError) return 'Showing people results (posts unavailable)';
    if (usersError) return 'Showing post results (people unavailable)';
    if (isGuest) {
      return `${totalPostsCount} ${totalPostsCount === 1 ? 'post' : 'posts'} found`;
    }
    const totalCombined = totalPostsCount + totalUsersCount;
    return `${totalCombined} ${totalCombined === 1 ? 'result' : 'results'} found (${totalPostsCount} posts, ${totalUsersCount} people)`;
  };

  const isGlobalLoading = (activeTab === 'all' && postsLoading && usersLoading) ||
    (activeTab === 'posts' && postsLoading) ||
    (activeTab === 'people' && usersLoading);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAF8F0] text-[#2B2A25] pb-16 font-dm-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        
        {/* Layout container: Left filters rail + Main area */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          
          {/* DESKTOP LEFT FILTERS PANEL (Facebook-style) */}
          <aside 
            className="hidden lg:block lg:w-72 xl:w-80 shrink-0 sticky top-24 bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl p-5 shadow-sm"
            aria-label="Search filters"
          >
            <div className="pb-4 mb-4 border-b border-[#DCE3D5]/70">
              <h2 className="font-fraunces text-xl font-semibold text-[#2B2A25]">
                Search results
              </h2>
              <p className="text-xs text-[#6B6F63] mt-1">
                Filter by result type
              </p>
            </div>

            <nav className="flex flex-col gap-1.5" role="tablist" aria-orientation="vertical">
              {filterTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    id={`filter-tab-${tab.id}`}
                    aria-selected={isActive}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => switchTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233] ${
                      isActive
                        ? 'bg-[#E9EFE6] text-[#2F5233] font-semibold border-l-4 border-[#2F5233] shadow-xs pl-3'
                        : 'text-[#6B6F63] hover:text-[#2B2A25] hover:bg-[#F3F6EE] border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg transition-colors ${
                        isActive ? 'bg-[#2F5233] text-white' : 'bg-transparent text-[#6B6F63]'
                      }`}>
                        {tab.icon}
                      </div>
                      <span>{tab.label}</span>
                    </div>

                    {queryKeyword && !isGlobalLoading && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-[#2F5233]/15 text-[#2F5233] font-bold' : 'text-[#6B6F63] bg-[#E9EFE6]/60'
                      }`}>
                        {tab.id === 'posts' && !postsError && totalPostsCount}
                        {tab.id === 'people' && !isGuest && !usersError && totalUsersCount}
                        {tab.id === 'all' && !postsError && !usersError && (isGuest ? totalPostsCount : totalPostsCount + totalUsersCount)}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {isGuest && (
              <div className="mt-6 pt-4 border-t border-[#DCE3D5]/70 bg-[#F3F6EE]/60 rounded-xl p-3 text-xs text-[#6B6F63]">
                <p className="font-semibold text-[#2B2A25] mb-1">Community search</p>
                <p className="mb-2.5 leading-relaxed">Log in to search and connect with other community members.</p>
                <Link 
                  to="/login"
                  className="inline-block text-xs font-semibold text-[#2F5233] hover:underline"
                >
                  Log in now →
                </Link>
              </div>
            )}
          </aside>

          {/* MAIN RESULTS COLUMN */}
          <main className="flex-1 min-w-0 w-full" id="search-main-content">
            
            {/* Top Search Input Box */}
            <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl p-4 sm:p-5 shadow-sm mb-6">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B6F63]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
                    </svg>
                  </div>
                  <input
                    id="search-input"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Search recipes, articles, videos, people..."
                    aria-label="Search query"
                    className="w-full h-12 pl-11 pr-11 bg-white border border-[#DCE3D5] rounded-xl text-[15px] text-[#2B2A25] placeholder-[#6B6F63] focus:border-[#2F5233] focus:outline-none focus:ring-2 focus:ring-[#2F5233]/20 transition-all font-medium"
                  />
                  {inputValue && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      title="Clear search query"
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6B6F63] hover:text-[#2B2A25] cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  id="search-submit-button"
                  className="h-12 px-7 bg-[#2F5233] hover:bg-[#25401F] text-white font-medium text-[15px] rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
                  </svg>
                  <span>Search</span>
                </button>
              </form>

              {/* MOBILE & TABLET HORIZONTAL FILTER PILLS */}
              <div className="lg:hidden mt-4 pt-3 border-t border-[#DCE3D5]/60 flex items-center gap-2 overflow-x-auto pb-1" role="tablist">
                <span className="text-xs font-semibold text-[#6B6F63] uppercase tracking-wider shrink-0 mr-1">
                  Scope:
                </span>
                {filterTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => switchTab(tab.id)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#2F5233] text-white shadow-xs font-semibold'
                          : 'bg-[#F3F6EE] text-[#6B6F63] hover:text-[#2B2A25] hover:bg-[#E9EFE6]'
                      }`}
                    >
                      <span className="w-4 h-4">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUERY SUMMARY BAR */}
            {queryKeyword && (
              <div 
                id="search-status-bar"
                className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl text-sm"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[#6B6F63]">Search results for:</span>
                  <span className="font-semibold text-[#2B2A25] px-2.5 py-0.5 bg-[#E9EFE6] rounded-md border border-[#DCE3D5]/80">
                    "{queryKeyword}"
                  </span>
                </div>

                <div className="text-xs sm:text-sm font-semibold text-[#2F5233]">
                  {renderSummaryCount()}
                </div>
              </div>
            )}

            {/* RESULTS CONTAINER */}
            <div id="results-section">
              {!queryKeyword ? (
                /* EMPTY SEARCH INPUT PROMPT */
                <div className="text-center py-16 px-6 bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl flex flex-col items-center">
                  <div className="w-20 h-20 bg-[#E9EFE6] text-[#2F5233] rounded-full flex items-center justify-center text-3xl mb-4 shadow-sm border border-[#DCE3D5]">
                    🌱
                  </div>
                  <h3 className="font-fraunces text-2xl font-semibold text-[#2B2A25] mb-2">
                    Search VeganHelper
                  </h3>
                  <p className="text-[#6B6F63] text-[15px] max-w-md mx-auto leading-relaxed mb-6">
                    Enter keywords to discover plant-based recipes, cooking stories, videos, and connect with fellow vegans in the community.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Tofu', 'Pho Chay', 'Spring Rolls', 'Mushroom', 'Salad'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setInputValue(tag);
                          setSearchParams({ q: tag, tab: activeTab, page: 1 });
                        }}
                        className="px-3.5 py-1.5 bg-[#F3F6EE] hover:bg-[#E9EFE6] text-[#2F5233] rounded-full text-xs font-medium border border-[#DCE3D5] transition-colors cursor-pointer"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : activeTab === 'all' ? (
                /* ================= ALL VIEW (PEOPLE + POSTS) ================= */
                <div className="flex flex-col gap-10">
                  
                  {/* People Preview Section */}
                  <section aria-labelledby="heading-people-preview" className="flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#DCE3D5]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-[#2F5233] text-white flex items-center justify-center p-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                        </div>
                        <h2 id="heading-people-preview" className="text-[20px] font-fraunces font-semibold text-[#2B2A25]">
                          People
                        </h2>
                      </div>

                      {!isGuest && !usersError && totalUsersCount > 0 && (
                        <button
                          onClick={() => switchTab('people')}
                          className="text-xs sm:text-sm font-semibold text-[#2F5233] hover:text-[#25401F] transition-colors flex items-center gap-1 group cursor-pointer"
                        >
                          <span>View all people ({totalUsersCount})</span>
                          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                        </button>
                      )}
                    </div>

                    {isGuest ? (
                      <div className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-6 text-center">
                        <p className="text-sm text-[#6B6F63] mb-3">
                          People search is exclusive to registered community members.
                        </p>
                        <Link
                          to="/login"
                          className="inline-flex items-center px-4 py-2 bg-[#2F5233] hover:bg-[#25401F] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
                        >
                          Log in to search community
                        </Link>
                      </div>
                    ) : usersLoading ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((n) => (
                          <UserSkeleton key={n} />
                        ))}
                      </div>
                    ) : usersError ? (
                      <div className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl flex items-center justify-between text-xs sm:text-sm text-[#991B1B]">
                        <span>Failed to load community members.</span>
                        <button
                          onClick={() => executeSearch(queryKeyword, 'all', 1)}
                          className="px-3 py-1 bg-[#DC2626] text-white rounded-md font-semibold hover:bg-[#B91C1C] cursor-pointer"
                        >
                          Retry
                        </button>
                      </div>
                    ) : users.length === 0 ? (
                      <div className="py-8 text-center bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl text-[#6B6F63] text-sm">
                        No people found matching "{queryKeyword}".
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {users.slice(0, 4).map((user) => (
                          <UserCard
                            key={user.id}
                            user={user}
                            onOpenProfilePreview={handleOpenProfilePreview}
                            isGuest={isGuest}
                            onAuthRequired={handleAuthRequired}
                          />
                        ))}
                      </div>
                    )}
                  </section>

                  {/* Posts Preview Section */}
                  <section aria-labelledby="heading-posts-preview" className="flex flex-col gap-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#DCE3D5]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-[#2F5233] text-white flex items-center justify-center p-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                          </svg>
                        </div>
                        <h2 id="heading-posts-preview" className="text-[20px] font-fraunces font-semibold text-[#2B2A25]">
                          Posts
                        </h2>
                      </div>

                      {!postsError && totalPostsCount > 0 && (
                        <button
                          onClick={() => switchTab('posts')}
                          className="text-xs sm:text-sm font-semibold text-[#2F5233] hover:text-[#25401F] transition-colors flex items-center gap-1 group cursor-pointer"
                        >
                          <span>View all posts ({totalPostsCount})</span>
                          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                        </button>
                      )}
                    </div>

                    {postsLoading ? (
                      <div className="flex flex-col gap-6">
                        {[1, 2].map((n) => (
                          <PostSkeleton key={n} />
                        ))}
                      </div>
                    ) : postsError ? (
                      <div className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl flex items-center justify-between text-xs sm:text-sm text-[#991B1B]">
                        <span>{postsError}</span>
                        <button
                          onClick={() => executeSearch(queryKeyword, 'all', 1)}
                          className="px-3 py-1 bg-[#DC2626] text-white rounded-md font-semibold hover:bg-[#B91C1C] cursor-pointer"
                        >
                          Retry
                        </button>
                      </div>
                    ) : posts.length === 0 ? (
                      <div className="py-8 text-center bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl text-[#6B6F63] text-sm">
                        No posts found matching "{queryKeyword}".
                      </div>
                    ) : (
                      <div className="flex flex-col gap-6">
                        {posts.map((post) => (
                          <InlinePostCard
                            key={post.id}
                            post={post}
                            isGuest={isGuest}
                            onAuthRequired={handleAuthRequired}
                            onOpenComments={handleOpenComments}
                            onOpenLightbox={handleOpenLightbox}
                            onOpenProfilePreview={handleOpenProfilePreview}
                          />
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              ) : activeTab === 'posts' ? (
                /* ================= POSTS FILTER ONLY ================= */
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#DCE3D5]">
                    <h2 className="text-[20px] font-fraunces font-semibold text-[#2B2A25]">
                      Posts {totalPostsCount > 0 && `(${totalPostsCount})`}
                    </h2>
                  </div>

                  {postsLoading ? (
                    <div className="flex flex-col gap-6">
                      {[1, 2, 3].map((n) => (
                        <PostSkeleton key={n} />
                      ))}
                    </div>
                  ) : postsError ? (
                    <div className="text-center py-16 bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl flex flex-col items-center">
                      <div className="w-16 h-16 bg-[#FEE2E2] text-[#DC2626] rounded-full flex items-center justify-center mb-4 border border-[#FCA5A5]">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                      </div>
                      <h3 className="font-fraunces text-xl font-semibold text-[#2B2A25] mb-2">
                        Unable to load posts
                      </h3>
                      <p className="text-[#6B6F63] text-sm max-w-md mx-auto mb-5">
                        {postsError}
                      </p>
                      <button
                        onClick={() => executeSearch(queryKeyword, 'posts', currentPage)}
                        className="px-6 py-2 bg-[#2F5233] hover:bg-[#25401F] text-white font-medium rounded-lg text-sm transition-colors cursor-pointer"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="text-center py-16 bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl flex flex-col items-center">
                      <div className="w-16 h-16 bg-[#E9EFE6] text-[#2F5233] rounded-full flex items-center justify-center text-2xl mb-4 border border-[#DCE3D5]">
                        🌿
                      </div>
                      <h3 className="font-fraunces text-xl font-semibold text-[#2B2A25] mb-2">
                        No posts found
                      </h3>
                      <p className="text-[#6B6F63] text-sm max-w-md mx-auto">
                        We couldn't find any posts matching "{queryKeyword}". Try searching with different keywords or check your spelling.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {posts.map((post) => (
                        <InlinePostCard
                          key={post.id}
                          post={post}
                          isGuest={isGuest}
                          onAuthRequired={handleAuthRequired}
                          onOpenComments={handleOpenComments}
                          onOpenLightbox={handleOpenLightbox}
                          onOpenProfilePreview={handleOpenProfilePreview}
                        />
                      ))}

                      {/* Pagination Controls */}
                      {totalPostsPages > 1 && (
                        <nav aria-label="Posts pagination" className="flex items-center justify-center gap-3 mt-6 pt-6 border-t border-[#DCE3D5]">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1 || postsLoading}
                            className="px-4 py-2 text-sm font-medium rounded-xl border border-[#DCE3D5] bg-[#FDFBF6] text-[#6B6F63] hover:text-[#2B2A25] hover:border-[#2F5233] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            Previous
                          </button>
                          <div className="text-sm font-medium text-[#2B2A25] px-2">
                            Page {currentPage} of {totalPostsPages}
                          </div>
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPostsPages || postsLoading}
                            className="px-4 py-2 text-sm font-medium rounded-xl border border-[#DCE3D5] bg-[#FDFBF6] text-[#6B6F63] hover:text-[#2B2A25] hover:border-[#2F5233] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            Next
                          </button>
                        </nav>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* ================= PEOPLE FILTER ONLY ================= */
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#DCE3D5]">
                    <h2 className="text-[20px] font-fraunces font-semibold text-[#2B2A25]">
                      People {totalUsersCount > 0 && `(${totalUsersCount})`}
                    </h2>
                  </div>

                  {isGuest ? (
                    <div className="text-center py-16 bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl flex flex-col items-center">
                      <div className="w-16 h-16 bg-[#E9EFE6] text-[#2F5233] rounded-full flex items-center justify-center text-2xl mb-4 border border-[#DCE3D5]">
                        👤
                      </div>
                      <h3 className="font-fraunces text-xl font-semibold text-[#2B2A25] mb-2">
                        Community search is for members
                      </h3>
                      <p className="text-[#6B6F63] text-sm max-w-md mx-auto mb-5">
                        Please log in to your VeganHelper account to discover and connect with other vegan members.
                      </p>
                      <Link
                        to="/login"
                        className="px-6 py-2.5 bg-[#2F5233] hover:bg-[#25401F] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                      >
                        Log In Now
                      </Link>
                    </div>
                  ) : usersLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <UserSkeleton key={n} />
                      ))}
                    </div>
                  ) : usersError ? (
                    <div className="text-center py-16 bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl flex flex-col items-center">
                      <div className="w-16 h-16 bg-[#FEE2E2] text-[#DC2626] rounded-full flex items-center justify-center mb-4 border border-[#FCA5A5]">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                      </div>
                      <h3 className="font-fraunces text-xl font-semibold text-[#2B2A25] mb-2">
                        Unable to load community members
                      </h3>
                      <p className="text-[#6B6F63] text-sm max-w-md mx-auto mb-5">
                        {usersError}
                      </p>
                      <button
                        onClick={() => executeSearch(queryKeyword, 'people', currentPage)}
                        className="px-6 py-2 bg-[#2F5233] hover:bg-[#25401F] text-white font-medium rounded-lg text-sm transition-colors cursor-pointer"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-16 bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl flex flex-col items-center">
                      <div className="w-16 h-16 bg-[#E9EFE6] text-[#2F5233] rounded-full flex items-center justify-center text-2xl mb-4 border border-[#DCE3D5]">
                        🌱
                      </div>
                      <h3 className="font-fraunces text-xl font-semibold text-[#2B2A25] mb-2">
                        No members found
                      </h3>
                      <p className="text-[#6B6F63] text-sm max-w-md mx-auto">
                        We couldn't find any community members matching "{queryKeyword}". Try adjusting your keywords or username.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                        {users.map((user) => (
                          <UserCard
                            key={user.id}
                            user={user}
                            onOpenProfilePreview={handleOpenProfilePreview}
                            isGuest={isGuest}
                            onAuthRequired={handleAuthRequired}
                          />
                        ))}
                      </div>

                      {/* Pagination Controls */}
                      {totalUsersPages > 1 && (
                        <nav aria-label="People pagination" className="flex items-center justify-center gap-3 mt-6 pt-6 border-t border-[#DCE3D5]">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1 || usersLoading}
                            className="px-4 py-2 text-sm font-medium rounded-xl border border-[#DCE3D5] bg-[#FDFBF6] text-[#6B6F63] hover:text-[#2B2A25] hover:border-[#2F5233] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            Previous
                          </button>
                          <div className="text-sm font-medium text-[#2B2A25] px-2">
                            Page {currentPage} of {totalUsersPages}
                          </div>
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalUsersPages || usersLoading}
                            className="px-4 py-2 text-sm font-medium rounded-xl border border-[#DCE3D5] bg-[#FDFBF6] text-[#6B6F63] hover:text-[#2B2A25] hover:border-[#2F5233] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            Next
                          </button>
                        </nav>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

          </main>
        </div>
      </div>

      {/* Comment Modal */}
      {activeCommentPost && (
        <CommentModal
          isOpen={Boolean(activeCommentPost)}
          onClose={handleCloseComments}
          post={activeCommentPost}
          isGuest={isGuest}
          onAuthRequired={handleAuthRequired}
          onCommentCountChange={handleCommentCountChange}
          triggerRef={commentTriggerRef}
        />
      )}

      {/* Image Lightbox */}
      <ImageLightbox
        isOpen={lightboxState.isOpen}
        onClose={handleCloseLightbox}
        src={lightboxState.src}
        alt={lightboxState.alt}
      />

      {/* User Profile Preview Popover */}
      <UserProfilePreview
        isOpen={profilePreviewState.isOpen}
        onClose={handleCloseProfilePreview}
        userId={profilePreviewState.user?.id}
        initialUser={profilePreviewState.user}
        triggerEl={profilePreviewState.triggerEl}
        isGuest={isGuest}
        onAuthRequired={handleAuthRequired}
      />
    </div>
  );
}

export default SearchCore;
