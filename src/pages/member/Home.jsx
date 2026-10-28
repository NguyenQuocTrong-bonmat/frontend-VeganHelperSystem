import React, { useState, useEffect, useRef, useCallback } from 'react';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import SearchBar from '../../components/home/SearchBar';
import FeaturedPost from '../../components/home/FeaturedPost';
import PostList from '../../components/home/PostList';
import HomeSocialNav from '../../components/home/HomeSocialNav';
import HomeUtilityRail from '../../components/home/HomeUtilityRail';
import CategoryFilterRow from '../../components/home/CategoryFilterRow';
import CreatePostModal from '../../components/home/CreatePostModal';
import UserProfilePreview from '../../components/home/UserProfilePreview';
import AIChatbot from '../../components/chat/AIChatbot';
import { getPostsFeed, getCategories } from '../../services/postService';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/imageUtils';

import heroBg from '../../assets/images/hero/hero-background.webp';
import heroPho from '../../assets/images/hero/hero-vietnamese-vegan-pho.webp';
import heroSpringRolls from '../../assets/images/hero/hero-vietnamese-vegan-spring-rolls.webp';
import heroSalad from '../../assets/images/hero/hero-vietnamese-vegan-food.webp';

function Home() {
  const { user } = useAuth();

  const [featuredPost, setFeaturedPost] = useState(null);
  const [exploreRecipes, setExploreRecipes] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [feedRefreshKey, setFeedRefreshKey] = useState(0);

  // Social Composer Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [composerInitialType, setComposerInitialType] = useState('recipe');
  const [composerFocusPhoto, setComposerFocusPhoto] = useState(false);
  const composerTriggerRef = useRef(null);

  const handleOpenComposer = (type = 'recipe', focusPhoto = false, triggerElement = null) => {
    setComposerInitialType(type);
    setComposerFocusPhoto(focusPhoto);
    if (triggerElement) {
      composerTriggerRef.current = triggerElement;
    }
    setIsCreateModalOpen(true);
  };

  // Profile Preview Popover state for entire Community Feed
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

  const [isMounted, setIsMounted] = useState(false);
  const collageRef = useRef(null);
  const postsPoolRef = useRef([]);
  const apiPageRef = useRef(1);
  const totalItemsRef = useRef(0);

  useEffect(() => {
    setIsMounted(true);

    const handleMouseMove = (e) => {
      if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!collageRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 30; // max 15px
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      collageRef.current.style.setProperty('--mouse-x', `${x}px`);
      collageRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initial load: Fetch 1 featured post + fixed initial Explore recipes
  useEffect(() => {
    let isCancelled = false;

    async function loadInitialFeed() {
      setLoading(true);
      setLoadMoreError(null);
      postsPoolRef.current = [];
      apiPageRef.current = 1;
      totalItemsRef.current = 0;

      try {
        const data = await getPostsFeed({
          pageIndex: 1,
          pageSize: 6,
          categoryId: selectedCategoryId
        });
        if (isCancelled) return;

        const items = data.items || [];
        const total = data.totalItems ?? data.totalCount ?? items.length;
        totalItemsRef.current = total;
        setTotalCount(total);
        postsPoolRef.current = [...items];

        if (items.length > 0) {
          setFeaturedPost(items[0]);
          const initialGrid = items.slice(1, 4);
          setExploreRecipes(initialGrid);

          const totalExplore = Math.max(0, total - 1);
          setHasMore(initialGrid.length < totalExplore);
        } else {
          setFeaturedPost(null);
          setExploreRecipes([]);
          setHasMore(false);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Failed to load initial feed:', err);
          setFeaturedPost(null);
          setExploreRecipes([]);
          setHasMore(false);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadInitialFeed();

    return () => {
      isCancelled = true;
    };
  }, [selectedCategoryId, feedRefreshKey]);

  // Load More: Fetch exactly 6 additional recipe cards per click until all items are loaded
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    setLoadMoreError(null);

    try {
      const currentExploreCount = exploreRecipes.length;
      const targetExploreCount = currentExploreCount + 6;
      const startIndex = featuredPost ? 1 : 0;
      const targetTotalInPool = startIndex + targetExploreCount;

      while (
        postsPoolRef.current.length < targetTotalInPool &&
        postsPoolRef.current.length < totalItemsRef.current
      ) {
        const nextPage = apiPageRef.current + 1;
        const data = await getPostsFeed({
          pageIndex: nextPage,
          pageSize: 6,
          categoryId: selectedCategoryId
        });
        apiPageRef.current = nextPage;

        const newItems = data.items || [];
        if (newItems.length === 0) {
          break;
        }

        const existingIds = new Set(postsPoolRef.current.map((p) => p.id));
        let addedAny = false;
        for (const item of newItems) {
          if (!existingIds.has(item.id)) {
            existingIds.add(item.id);
            postsPoolRef.current.push(item);
            addedAny = true;
          }
        }

        if (!addedAny) {
          break;
        }
      }

      const nextExplore = postsPoolRef.current.slice(startIndex, startIndex + targetExploreCount);
      setExploreRecipes(nextExplore);

      const totalExplore = Math.max(0, totalItemsRef.current - startIndex);
      const noMoreAvailable =
        nextExplore.length < targetExploreCount &&
        nextExplore.length >= (postsPoolRef.current.length - startIndex);
      setHasMore(nextExplore.length < totalExplore && !noMoreAvailable);
    } catch (err) {
      console.error('Failed to load more recipes:', err);
      setLoadMoreError('Failed to load additional recipes');
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-vh-cream overflow-x-clip">
      <HeaderMember />

      {/* IMMERSIVE HERO */}
      <div className="relative w-full min-h-[560px] sm:min-h-[650px] h-auto lg:h-[700px] py-12 sm:py-16 lg:py-0 flex items-center justify-center overflow-hidden mb-8 md:mb-10 bg-vh-cream">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-vh-cream/85 backdrop-blur-[2px]"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 h-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 mt-8 sm:mt-12 md:mt-0">

          {/* Left Side: Text and Search */}
          <div className="w-full md:w-5/12 flex flex-col items-start text-left">
            <span className={`font-dm-sans text-vh-forest font-bold tracking-[0.15em] text-[11px] md:text-xs mb-4 uppercase transform transition-all duration-700 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              PLANT-BASED FOOD · HO CHI MINH CITY
            </span>
            <h1 className={`font-dm-serif text-4xl sm:text-5xl md:text-[64px] text-vh-text-primary mb-4 sm:mb-6 leading-[1.05] drop-shadow-sm transform transition-all duration-700 delay-100 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Discover the <br className="hidden md:block" /> Taste of Vietnam
            </h1>
            <p className={`font-dm-sans text-vh-text-secondary text-[15px] sm:text-[16px] md:text-lg max-w-[400px] mb-6 sm:mb-10 font-light leading-relaxed transform transition-all duration-700 delay-200 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Explore the vibrant world of Vietnamese plant-based cuisine, starting in Ho Chi Minh City.
            </p>

            <div className={`w-full max-w-[450px] transform transition-all duration-700 delay-300 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <SearchBar />
            </div>

            <button
              onClick={() => {
                const targetEl = document.getElementById('social-feed');
                if (targetEl) {
                  targetEl.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.scrollTo({ top: window.innerHeight - 100, behavior: 'smooth' });
                }
              }}
              style={{ transitionDelay: isMounted ? '400ms' : '0ms' }}
              className={`mt-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-vh-forest text-white rounded-full font-dm-sans text-[15px] font-medium hover:bg-vh-sage hover:-translate-y-0.5 hover:shadow-md active:scale-95 motion-reduce:transform-none focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:ring-offset-2 transition-all duration-500 shadow-sm flex items-center gap-2 transform ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              Explore Vegan Recipes
              <svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            </button>
          </div>

          {/* Right Side: Collage */}
          <div
            ref={collageRef}
            className={`w-full md:w-7/12 flex items-center justify-center relative h-[290px] sm:h-[350px] md:h-[500px] transform transition-all duration-1000 delay-[400ms] ease-out mt-8 md:mt-0 ${isMounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
          >
            {/* Secondary Image - Spring Rolls */}
            <div style={{ transform: 'translate(calc(var(--mouse-x, 0px) * -1), calc(var(--mouse-y, 0px) * -1))' }} className="absolute top-16 left-8 z-10 transition-transform duration-300 ease-out hidden md:block">
              <div className="w-[220px] h-[260px] lg:w-[240px] lg:h-[280px] bg-white p-3 rounded-xl shadow-xl shadow-black/10 -rotate-6 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-500 border border-black/5 group">
                <div className="w-full h-full overflow-hidden rounded shadow-inner">
                  <img src={heroSpringRolls} alt="" aria-hidden="true" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
              </div>
            </div>

            {/* Primary Image - Pho */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0 md:top-8 md:left-auto md:right-0 lg:right-8 z-20">
              <div style={{ transform: 'translate(calc(var(--mouse-x, 0px) * 0.5), calc(var(--mouse-y, 0px) * 0.5))' }} className="transition-transform duration-300 ease-out">
                <div className="w-[210px] h-[260px] sm:w-[260px] sm:h-[320px] md:w-[280px] md:h-[340px] lg:w-[320px] lg:h-[380px] bg-white p-4 rounded-2xl shadow-2xl shadow-black/15 rotate-0 md:rotate-3 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-500 border border-black/5 group">
                  <div className="w-full h-full overflow-hidden rounded-xl shadow-inner">
                    <img src={heroPho} alt="Vegan Pho" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tertiary Image */}
            <div style={{ transform: 'translate(calc(var(--mouse-x, 0px) * 1.5), calc(var(--mouse-y, 0px) * 1.5))' }} className="absolute bottom-10 left-24 lg:left-32 z-10 transition-transform duration-300 ease-out hidden md:block">
              <div className="w-[180px] h-[220px] lg:w-[200px] lg:h-[240px] bg-white p-2.5 rounded-xl shadow-lg shadow-black/10 rotate-12 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-500 border border-black/5 group">
                <div className="w-full h-full overflow-hidden rounded shadow-inner">
                  <img src={heroSalad} alt="" aria-hidden="true" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Organic Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10" style={{ transform: 'translateY(1px)' }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[50px] md:h-[90px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C69.74,52.34,204.34,78.85,321.39,56.44Z" className="fill-vh-cream"></path>
          </svg>
        </div>
      </div>

      {/* THREE-COLUMN SOCIAL CONTENT AREA */}
      <main id="social-feed" className="flex-1 w-full max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pb-20">
        <div className="flex flex-col min-[900px]:flex-row items-start justify-center gap-6 xl:gap-7 w-full">
          {/* Left Utility Rail (Navigation) */}
          <HomeSocialNav
            isGuest={false}
            onOpenComposer={(type) => handleOpenComposer(type, false, null)}
          />

          {/* Main Content Column */}
          <section aria-label="Community Feed" className="flex-1 min-w-0 max-w-[840px] w-full space-y-6">
            {/* Quick-Post Composer Widget */}
            <div className="bg-vh-surface border border-vh-border/70 rounded-card p-4 sm:p-5 md:p-6 shadow-sm text-left">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-vh-mint border border-vh-border flex items-center justify-center shrink-0 overflow-hidden">
                  {user?.avatarUrl ? (
                    <img src={getImageUrl(user.avatarUrl)} alt={user.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-semibold text-base text-vh-forest">
                      {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={(e) => handleOpenComposer('post', false, e.currentTarget)}
                  aria-label="Create a post"
                  className="flex-1 px-5 py-3 sm:py-3.5 bg-vh-cream hover:bg-vh-mint/40 border border-vh-border/60 rounded-full text-xs sm:text-sm font-dm-sans text-vh-text-secondary transition-all text-left truncate cursor-pointer shadow-2xs focus-ring-vh active:scale-[0.99] motion-reduce:transform-none"
                >
                  What are you sharing today, {user?.displayName || 'friend'}?
                </button>
                <button
                  type="button"
                  onClick={(e) => handleOpenComposer('post', false, e.currentTarget)}
                  aria-label="Create Post"
                  className="shrink-0 rounded-full bg-vh-forest px-4 py-3 font-dm-sans text-xs font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#1D3D2D] hover:shadow-md active:scale-95 motion-reduce:transform-none focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:ring-offset-2 sm:px-5 sm:py-3.5 sm:text-sm cursor-pointer"
                >
                  <span>Create Post</span>
                </button>
              </div>
            </div>

            {/* Fully Usable Category Filter Row */}
            <CategoryFilterRow
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setSelectedCategoryId}
            />

            {/* Feed State Display */}
            {loading ? (
              <div className="w-full py-16 flex flex-col items-center justify-center text-vh-text-secondary gap-3 bg-vh-surface/50 rounded-card border border-vh-border/40">
                <div className="w-9 h-9 border-3 border-vh-mint border-t-vh-forest rounded-full animate-spin"></div>
                <p className="font-dm-sans text-sm">Harvesting delicious recipes...</p>
              </div>
            ) : !featuredPost && exploreRecipes.length === 0 ? (
              <div className="w-full py-20 flex flex-col items-center justify-center text-center bg-vh-surface/50 rounded-card border border-vh-border/50 p-6">
                <div className="w-16 h-16 mb-4 bg-vh-mint rounded-full flex items-center justify-center text-3xl">🌱</div>
                <h3 className="font-dm-serif text-2xl text-vh-text-primary mb-2">The garden is still growing</h3>
                <p className="font-dm-sans text-vh-text-secondary mb-6 max-w-md text-sm">We couldn't find any recipes matching your current filters. Try exploring other categories.</p>
                <button onClick={() => setSelectedCategoryId(null)} className="px-6 py-2.5 bg-vh-forest text-white rounded-full font-dm-sans text-xs font-semibold hover:bg-vh-sage transition-colors shadow-sm cursor-pointer">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {featuredPost && (
                  <FeaturedPost
                    post={featuredPost}
                    isGuest={false}
                    onOpenProfilePreview={handleOpenProfilePreview}
                  />
                )}
                <PostList
                  posts={exploreRecipes}
                  isGuest={false}
                  onLoadMore={handleLoadMore}
                  hasMore={hasMore}
                  loadingMore={loadingMore}
                  loadMoreError={loadMoreError}
                  onOpenProfilePreview={handleOpenProfilePreview}
                />
              </div>
            )}

          </section>

          {/* Right Utility Rail */}
          <HomeUtilityRail
            isGuest={false}
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        </div>
      </main>

      {/* Social Post Composer Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        initialPostType={composerInitialType}
        focusPhoto={composerFocusPhoto}
        onPostCreated={() => {
          setFeedRefreshKey((prev) => prev + 1);
        }}
        triggerRef={composerTriggerRef}
      />

      {/* Shared Community Feed User Profile Preview */}
      <UserProfilePreview
        isOpen={profilePreviewState.isOpen}
        onClose={handleCloseProfilePreview}
        userId={profilePreviewState.user?.id}
        initialUser={profilePreviewState.user}
        triggerEl={profilePreviewState.triggerEl}
        isGuest={false}
      />

      <AIChatbot />
      <Footer />
    </div>
  );
}

export default Home;
