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
      <HeaderGuest />
      
      {/* MAIN CONTENT CONTAINER (max-w 1120px, gutter 24px per DESIGN.md section 4) */}
      <main className="flex-1 w-full max-w-[1120px] mx-auto px-6 py-8 md:py-10">
        <SearchBar />
        <CategoryBar categories={categories} selectedCategoryId={selectedCategoryId} onSelectCategory={setSelectedCategoryId} />
        <FeaturedPost post={posts[0]} loading={loading} />
        <PostList posts={posts.slice(1)} loading={loading} />
      </main>

      <AIChatbot />
      
      <Footer />
    </>
  );
}

export default HomeGuest;
