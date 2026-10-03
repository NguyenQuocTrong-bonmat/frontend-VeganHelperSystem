import React, { useState, useEffect } from 'react';
import HeaderGuest from '../../components/layout/HeaderGuest';
import Footer from '../../components/layout/Footer';
import SearchBar from '../../components/home/SearchBar';
import CategoryBar from '../../components/home/CategoryBar';
import FeaturedPost from '../../components/home/FeaturedPost';
import PostList from '../../components/home/PostList';
import AIChatbot from '../../components/chat/AIChatbot';
import { getPostsFeed, getCategories } from '../../services/postService';

function HomeGuest() {

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    async function initCategories() {
      const cats = await getCategories();
      setCategories(cats || []);
    }
    initCategories();
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

  return (
    <div className="min-h-screen flex flex-col bg-vh-cream">
      <HeaderGuest />
      
      {/* IMMERSIVE HERO */}
      <div className="relative w-full h-[500px] md:h-[600px] flex flex-col items-center justify-center overflow-hidden mb-12">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=2070" 
            alt="Healthy plant-based food" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-vh-forest/80 via-vh-forest/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-[900px] mx-auto px-6 text-center mt-16">
          <h1 className="font-dm-serif text-4xl md:text-6xl text-white mb-4 leading-tight drop-shadow-md">
            Discover the Art of Vegan Cooking
          </h1>
          <p className="font-dm-sans text-white/90 text-[16px] md:text-xl max-w-2xl mx-auto mb-10 drop-shadow-sm font-light">
            Delicious, plant-based recipes for a vibrant, healthy lifestyle.
          </p>
          
          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
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
            <FeaturedPost post={posts[0]} isGuest={true} />
            <PostList posts={posts.slice(1)} isGuest={true} />
          </>
        )}
      </main>

      <AIChatbot />
      <Footer />
    </div>
  );
}

export default HomeGuest;
