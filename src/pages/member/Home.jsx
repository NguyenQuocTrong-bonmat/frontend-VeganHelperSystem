import React, { useState, useEffect, useRef } from 'react';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import SearchBar from '../../components/home/SearchBar';
import CategoryBar from '../../components/home/CategoryBar';
import FeaturedPost from '../../components/home/FeaturedPost';
import PostList from '../../components/home/PostList';
import AIChatbot from '../../components/chat/AIChatbot';
import { getPostsFeed, getCategories } from '../../services/postService';

import heroBg from '../../assets/images/hero/hero-background.webp';
import heroPho from '../../assets/images/hero/hero-vietnamese-vegan-pho.webp';
import heroSpringRolls from '../../assets/images/hero/hero-vietnamese-vegan-spring-rolls.webp';
import heroSalad from '../../assets/images/hero/hero-vietnamese-vegan-food.webp';

function Home() {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  
  const [isMounted, setIsMounted] = useState(false);
  const collageRef = useRef(null);

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

  useEffect(() => {
    async function loadFeed() {
      setLoading(true);
      try {
        const data = await getPostsFeed({ pageIndex: 1, pageSize: 10, categoryId: selectedCategoryId });
        setPosts(data.items || []);
      } catch (err) {
        console.error('Failed to load feed:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeed();
  }, [selectedCategoryId]);

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
    <div className="min-h-screen flex flex-col bg-vh-cream">
      <HeaderMember />
      
      {/* IMMERSIVE HERO */}
      <div className="relative w-full min-h-[650px] h-auto lg:h-[700px] py-16 lg:py-0 flex items-center justify-center overflow-hidden mb-12 bg-vh-cream">
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
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 h-full flex flex-col md:flex-row items-center justify-between gap-12 mt-12 md:mt-0">
          
          {/* Left Side: Text and Search */}
          <div className="w-full md:w-5/12 flex flex-col items-start text-left">
            <span className={`font-dm-sans text-vh-forest font-bold tracking-[0.15em] text-[11px] md:text-xs mb-4 uppercase transform transition-all duration-700 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              PLANT-BASED FOOD · HO CHI MINH CITY
            </span>
            <h1 className={`font-dm-serif text-5xl md:text-[64px] text-vh-text-primary mb-6 leading-[1.05] drop-shadow-sm transform transition-all duration-700 delay-100 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Discover the <br className="hidden md:block" /> Taste of Vietnam
            </h1>
            <p className={`font-dm-sans text-vh-text-secondary text-[16px] md:text-lg max-w-[400px] mb-10 font-light leading-relaxed transform transition-all duration-700 delay-200 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Explore the vibrant world of Vietnamese plant-based cuisine, starting in Ho Chi Minh City.
            </p>
            
            <div className={`w-full max-w-[450px] transform transition-all duration-700 delay-300 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <SearchBar />
            </div>
            
            <button 
              onClick={() => window.scrollTo({ top: window.innerHeight - 100, behavior: 'smooth' })}
              style={{ transitionDelay: isMounted ? '400ms' : '0ms' }}
              className={`mt-2 px-8 py-3.5 bg-vh-forest text-white rounded-full font-dm-sans text-[15px] font-medium hover:bg-vh-sage hover:-translate-y-0.5 hover:shadow-md active:scale-95 transition-all duration-500 shadow-sm flex items-center gap-2 transform ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              Explore Vegan Recipes
              <svg className="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            </button>
          </div>

          {/* Right Side: Collage */}
          <div 
            ref={collageRef}
            className={`w-full md:w-7/12 flex items-center justify-center relative h-[350px] md:h-[500px] transform transition-all duration-1000 delay-[400ms] ease-out mt-8 md:mt-0 ${isMounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
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
             <div style={{ transform: 'translate(calc(var(--mouse-x, 0px) * 0.5), calc(var(--mouse-y, 0px) * 0.5))' }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0 md:top-8 md:left-auto md:right-0 lg:right-8 z-20 transition-transform duration-300 ease-out">
               <div className="w-[260px] h-[320px] md:w-[280px] md:h-[340px] lg:w-[320px] lg:h-[380px] bg-white p-4 rounded-2xl shadow-2xl shadow-black/15 rotate-0 md:rotate-3 hover:rotate-0 hover:scale-105 hover:z-30 transition-all duration-500 border border-black/5 group">
                  <div className="w-full h-full overflow-hidden rounded-xl shadow-inner">
                    <img src={heroPho} alt="Vegan Pho" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 pb-16">
        <CategoryBar categories={categories} selectedCategoryId={selectedCategoryId} onSelectCategory={setSelectedCategoryId} />
        
        {loading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center text-vh-text-secondary gap-4">
            <div className="w-10 h-10 border-4 border-vh-mint border-t-vh-forest rounded-full animate-spin"></div>
            <p className="font-dm-sans">Harvesting recipes...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="w-full py-24 flex flex-col items-center justify-center text-center bg-vh-surface/50 rounded-card border border-vh-border/50">
            <div className="w-20 h-20 mb-6 bg-vh-mint rounded-full flex items-center justify-center text-4xl">🌱</div>
            <h3 className="font-dm-serif text-2xl text-vh-text-primary mb-2">The garden is still growing</h3>
            <p className="font-dm-sans text-vh-text-secondary mb-6 max-w-md">We couldn't find any recipes matching your current filters. Try exploring other categories.</p>
            <button onClick={() => setSelectedCategoryId(null)} className="px-6 py-2.5 bg-vh-forest text-white rounded-full font-dm-sans text-sm font-medium hover:bg-vh-sage transition-colors shadow-sm">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <FeaturedPost post={posts[0]} isGuest={false} />
            <PostList posts={posts.slice(1)} isGuest={false} />
          </>
        )}
      </main>

      <AIChatbot />
      <Footer />
    </div>
  );
}

export default Home;
