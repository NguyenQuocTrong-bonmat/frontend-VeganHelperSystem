import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchPosts } from '../../services/postService';
import { searchUsers } from '../../services/userService';
import { Link } from 'react-router-dom';
import UserCard from './UserCard';
import toast from 'react-hot-toast';

function SearchCore({ isGuest }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const queryKeyword = searchParams.get('q') || '';
  const queryTab = searchParams.get('tab') || 'all'; // 'all', 'recipes' or 'people'
  const queryPage = parseInt(searchParams.get('page')) || 1;
  
  const [inputValue, setInputValue] = useState(queryKeyword);
  const [activeTab, setActiveTab] = useState(queryTab);
  const [currentPage, setCurrentPage] = useState(queryPage);
  
  // Data states
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [totalPostsPages, setTotalPostsPages] = useState(0);
  const [totalUsersPages, setTotalUsersPages] = useState(0);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    setInputValue(queryKeyword);
    setActiveTab(queryTab);
    setCurrentPage(queryPage);
    setApiError(false);
    
    if (queryKeyword.trim()) {
      fetchResults(queryKeyword, queryTab, queryPage);
    } else {
      setPosts([]);
      setUsers([]);
      setTotalPostsCount(0);
      setTotalUsersCount(0);
      setTotalPostsPages(0);
      setTotalUsersPages(0);
    }
  }, [queryKeyword, queryTab, queryPage]);

  const fetchResults = async (keyword, tab, page) => {
    setLoading(true);
    let pCount = 0;
    let pTotalPages = 0;
    let uCount = 0;
    let uTotalPages = 0;
    let newPosts = [];
    let newUsers = [];
    let hasError = false;

    const fetchRecipes = async () => {
      try {
        const result = await searchPosts({ keyword, pageIndex: page, pageSize: 10 });
        newPosts = result.items || [];
        pCount = result.totalCount || 0;
        pTotalPages = result.totalPages || Math.ceil(pCount / 10);
      } catch (error) {
        hasError = true;
        if (tab === 'recipes' || tab === 'all') toast.error(error.message || "Failed to load recipes.");
      }
    };

    const fetchPeople = async () => {
      if (isGuest) return; // Guests can't search people
      try {
        const limit = tab === 'all' ? 4 : 10; 
        const result = await searchUsers({ keyword, pageIndex: page, pageSize: limit });
        newUsers = result.items || [];
        uCount = result.totalCount || 0;
        uTotalPages = result.totalPages || Math.ceil(uCount / limit);
      } catch (error) {
        hasError = true;
        if (tab === 'people') toast.error(error.message || "Failed to load people.");
      }
    };

    try {
      if (tab === 'recipes') {
        await fetchRecipes();
      } else if (tab === 'people') {
        if (isGuest) {
          toast.error("Please login to search the community.");
          navigate('/login');
          return;
        }
        await fetchPeople();
      } else if (tab === 'all') {
        // Independent fetching
        await Promise.allSettled([fetchRecipes(), fetchPeople()]);
      }
    } finally {
      if (hasError) setApiError(true);
      setPosts(newPosts);
      setUsers(newUsers);
      setTotalPostsCount(pCount);
      setTotalUsersCount(uCount);
      setTotalPostsPages(pTotalPages);
      setTotalUsersPages(uTotalPages);
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    
    setSearchParams({ q: inputValue.trim(), tab: activeTab, page: 1 });
  };

  const clearSearch = () => {
    setInputValue('');
    setSearchParams({ tab: activeTab, page: 1 });
  };

  const switchTab = (tabName) => {
    if (isGuest && tabName === 'people') {
      toast.error("Please login to search the community.");
      navigate('/login');
      return;
    }
    setActiveTab(tabName);
    if (queryKeyword.trim()) {
      setSearchParams({ q: queryKeyword.trim(), tab: tabName, page: 1 });
    } else {
      setSearchParams({ tab: tabName, page: 1 });
    }
  };

  const handlePageChange = (newPage) => {
    const maxPages = activeTab === 'recipes' ? totalPostsPages : totalUsersPages;
    if (newPage < 1 || newPage > maxPages) return;
    setSearchParams({ q: queryKeyword, tab: activeTab, page: newPage });
  };

  const PostCard = ({ post }) => (
    <Link key={post.id} to={`/posts/${post.id}${isGuest ? '/guest' : ''}`} className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer group">
      <div className="relative overflow-hidden w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 transition-transform group-hover:scale-[1.01]">
        {post.mediaUrls && post.mediaUrls.length > 0 ? (
          <img alt={post.title} className="w-full h-full object-cover" src={post.mediaUrls[0]} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#2F5233] opacity-30">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-[3px] h-3.5 bg-[#2F5233] rounded-full"></span>
            <span className="text-[13px] font-medium text-[#6B6F63]">{post.categoryName || 'Recipe'}</span>
          </div>
          <h3 className="font-vietnam text-[18px] md:text-[20px] font-semibold text-[#2B2A25] mb-2 leading-snug group-hover:text-[#2F5233] transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-[14px] md:text-[15px] leading-relaxed text-[#6B6F63] line-clamp-2 mb-3">
            {post.content}
          </p>
        </div>
        <div className="pt-3 border-t border-[#DCE3D5] flex items-center justify-between text-[13px] text-[#6B6F63]">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#2B2A25]">{post.authorName}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Views: <strong className="font-semibold text-[#2B2A25]">{post.viewCount || 0}</strong></span>
          </div>
        </div>
      </div>
    </Link>
  );

  const displayCount = activeTab === 'all' 
    ? totalPostsCount + totalUsersCount 
    : activeTab === 'recipes' 
      ? totalPostsCount 
      : totalUsersCount;

  return (
    <main className="flex-1 w-full max-w-[1120px] mx-auto px-6 py-8 md:py-10">
      <section className="mb-8" id="search-section">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-[#6B6F63]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
              </svg>
            </div>
            <input 
              className="w-full h-12 pl-12 pr-12 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[15px] text-[#2B2A25] placeholder-[#6B6F63] focus:border-[#2F5233] focus:outline-none transition-colors font-medium" 
              id="search-input" 
              placeholder="Search recipes, cooking videos, community..." 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {inputValue && (
              <button 
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#6B6F63] hover:text-[#2B2A25] cursor-pointer transition-colors" 
                title="Clear keyword" 
                type="button"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" x2="6" y1="6" y2="18"></line>
                  <line x1="6" x2="18" y1="6" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
          <button 
            type="submit"
            className="h-12 px-6 bg-[#2F5233] hover:bg-[#25401F] text-white rounded-lg font-medium text-[15px] flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
            </svg>
            <span>Search</span>
          </button>
        </form>

        <div className="inline-flex p-1 rounded-lg bg-[#F3F6EE] border border-[#DCE3D5] mb-6 gap-1 mt-6">
          <button 
            onClick={() => switchTab('all')}
            className={`px-4 py-2 text-sm font-medium rounded cursor-pointer transition-colors ${activeTab === 'all' ? 'bg-[#FDFBF6] text-[#2F5233] border border-[#DCE3D5] shadow-sm' : 'text-[#6B6F63] hover:text-[#2F5233] border border-transparent'}`}
            type="button"
          >
            All
          </button>
          <button 
            onClick={() => switchTab('recipes')}
            className={`px-4 py-2 text-sm font-medium rounded cursor-pointer transition-colors ${activeTab === 'recipes' ? 'bg-[#FDFBF6] text-[#2F5233] border border-[#DCE3D5] shadow-sm' : 'text-[#6B6F63] hover:text-[#2F5233] border border-transparent'}`}
            type="button"
          >
            Recipes
          </button>
          <button 
            onClick={() => switchTab('people')}
            className={`px-4 py-2 text-sm font-medium rounded cursor-pointer transition-colors ${activeTab === 'people' ? 'bg-[#FDFBF6] text-[#2F5233] border border-[#DCE3D5] shadow-sm' : 'text-[#6B6F63] hover:text-[#2F5233] border border-transparent'}`}
            type="button"
          >
            People
          </button>
        </div>
      </section>

      {queryKeyword && (
        <div id="content-search-view">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl text-[14px]" id="search-status-bar">
              <div className="flex items-center gap-2 text-[#2B2A25] flex-wrap">
                <span className="text-[#6B6F63]">Found</span>
                <span className="font-semibold text-[#2F5233]">{displayCount} results</span>
                <span className="text-[#6B6F63]">for keyword:</span>
                <span className="font-semibold text-[#2B2A25] px-2 py-0.5 bg-[#E9EFE6] rounded border border-[#DCE3D5]">
                  '{queryKeyword}'
                </span>
              </div>
            </div>
          </div>

          <section id="results-section">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-[#2F5233] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : apiError ? (
              <div className="text-center py-20 bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl flex flex-col items-center">
                <div className="w-20 h-20 bg-[#FEE2E2] text-[#DC2626] rounded-full flex items-center justify-center mb-5 shadow-sm border border-[#FCA5A5]">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h3 className="font-fraunces text-2xl font-semibold text-[#2B2A25] mb-2">
                  Search Failed
                </h3>
                <p className="text-[#6B6F63] text-[15px] max-w-md mx-auto mb-6">
                  There was a problem communicating with the server. Please check your keywords (e.g., minimum length of 2 characters) and try again.
                </p>
                <button onClick={() => fetchResults(queryKeyword, queryTab, queryPage)} className="px-6 py-2.5 bg-[#2F5233] hover:bg-[#25401F] text-white font-medium rounded-lg transition-colors shadow-sm">
                  Try Again
                </button>
              </div>
            ) : displayCount === 0 && (activeTab !== 'all' || (!isGuest && displayCount === 0) || (isGuest && totalPostsCount === 0)) ? (
              <div className="text-center py-20 bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl flex flex-col items-center">
                <div className="w-20 h-20 bg-[#F3F6EE] text-[#2F5233] rounded-full flex items-center justify-center text-3xl mb-5 shadow-sm border border-[#DCE3D5]/50">
                  {activeTab === 'people' ? '🌱' : activeTab === 'recipes' ? '🌿' : '🍃'}
                </div>
                <h3 className="font-fraunces text-2xl font-semibold text-[#2B2A25] mb-2">
                  {activeTab === 'all' ? 'No results found' : `No ${activeTab} found`}
                </h3>
                <p className="text-[#6B6F63] text-[15px] max-w-md mx-auto">
                  We couldn't find any {activeTab === 'all' ? 'results' : activeTab} matching '{queryKeyword}'. Try adjusting your search terms.
                </p>
              </div>
            ) : activeTab === 'all' ? (
              <div className="flex flex-col gap-12">
                {!isGuest && (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between border-b border-[#DCE3D5] pb-3">
                      <h2 className="text-[22px] font-fraunces font-semibold text-[#2B2A25]">People</h2>
                      {totalUsersCount > 0 && (
                        <button onClick={() => switchTab('people')} className="text-sm font-medium text-[#2F5233] hover:text-[#25401F] transition-colors flex items-center gap-1 group">
                          View all people <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                        </button>
                      )}
                    </div>
                    {users.length === 0 ? (
                      <div className="text-center py-10 bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl text-[#6B6F63] text-[15px]">
                        No people found
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {users.slice(0, 4).map(user => (
                          <UserCard key={user.id} user={user} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between border-b border-[#DCE3D5] pb-3">
                    <h2 className="text-[22px] font-fraunces font-semibold text-[#2B2A25]">Posts</h2>
                    {totalPostsCount > 0 && (
                      <button onClick={() => switchTab('recipes')} className="text-sm font-medium text-[#2F5233] hover:text-[#25401F] transition-colors flex items-center gap-1 group">
                        View all posts <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                      </button>
                    )}
                  </div>
                  {posts.length === 0 ? (
                    <div className="text-center py-10 bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl text-[#6B6F63] text-[15px]">
                      No posts found
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {posts.map(post => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                <div className={activeTab === 'people' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex flex-col gap-4'}>
                  {activeTab === 'recipes' && posts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))}

                  {activeTab === 'people' && users.map(user => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {((activeTab === 'recipes' && totalPostsPages > 1) || (activeTab === 'people' && totalUsersPages > 1)) && (
                  <div className="flex items-center justify-center gap-2 mt-4 pt-6 border-t border-[#DCE3D5]">
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1 || loading}
                      className="px-4 py-2 text-sm font-medium rounded-lg border border-[#DCE3D5] bg-[#FDFBF6] text-[#6B6F63] hover:text-[#2B2A25] hover:border-[#2B2A25] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-2 px-4 text-[14px] font-medium text-[#2B2A25]">
                      <span>Page {currentPage} of {activeTab === 'recipes' ? totalPostsPages : totalUsersPages}</span>
                    </div>
                    <button 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= (activeTab === 'recipes' ? totalPostsPages : totalUsersPages) || loading}
                      className="px-4 py-2 text-sm font-medium rounded-lg border border-[#DCE3D5] bg-[#FDFBF6] text-[#6B6F63] hover:text-[#2B2A25] hover:border-[#2B2A25] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

export default SearchCore;
