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
  const queryTab = searchParams.get('tab') || 'recipes'; // 'recipes' or 'people'
  
  const [inputValue, setInputValue] = useState(queryKeyword);
  const [activeTab, setActiveTab] = useState(queryTab);
  
  // Data states
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setInputValue(queryKeyword);
    setActiveTab(queryTab);
    
    if (queryKeyword.trim()) {
      fetchResults(queryKeyword, queryTab);
    } else {
      setPosts([]);
      setUsers([]);
      setTotalCount(0);
    }
  }, [queryKeyword, queryTab]);

  const fetchResults = async (keyword, tab) => {
    setLoading(true);
    try {
      if (tab === 'recipes') {
        const result = await searchPosts({ keyword, pageIndex: 1, pageSize: 20 });
        setPosts(result.items || []);
        setTotalCount(result.totalCount || 0);
      } else if (tab === 'people') {
        if (isGuest) {
          toast.error("Please login to search the community.");
          navigate('/login');
          return;
        }
        const result = await searchUsers({ keyword, pageIndex: 1, pageSize: 20 });
        setUsers(result.items || []);
        setTotalCount(result.totalCount || 0);
      }
    } catch (error) {
      toast.error(error.message || "Failed to search.");
      if (tab === 'recipes') setPosts([]);
      if (tab === 'people') setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    
    setSearchParams({ q: inputValue.trim(), tab: activeTab });
  };

  const clearSearch = () => {
    setInputValue('');
    setSearchParams({ tab: activeTab });
  };

  const switchTab = (tabName) => {
    if (isGuest && tabName === 'people') {
      toast.error("Please login to search the community.");
      navigate('/login');
      return;
    }
    setActiveTab(tabName);
    if (queryKeyword.trim()) {
      setSearchParams({ q: queryKeyword.trim(), tab: tabName });
    } else {
      setSearchParams({ tab: tabName });
    }
  };

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
                <span className="font-semibold text-[#2F5233]">{totalCount} results</span>
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
            ) : totalCount === 0 ? (
              <div className="text-center py-12 bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl">
                <svg className="w-12 h-12 text-[#DCE3D5] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="text-lg font-medium text-[#2B2A25] mb-2">No results found</h3>
                <p className="text-[#6B6F63]">We couldn't find any {activeTab} matching '{queryKeyword}'.</p>
              </div>
            ) : (
              <div className={activeTab === 'people' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-4'}>
                {activeTab === 'recipes' && posts.map(post => (
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
                ))}

                {activeTab === 'people' && users.map(user => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

export default SearchCore;
