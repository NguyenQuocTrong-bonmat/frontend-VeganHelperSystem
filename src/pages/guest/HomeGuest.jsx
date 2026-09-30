import HeaderGuest from '../../components/layout/HeaderGuest';
import Footer from '../../components/layout/Footer';
import SearchBar from '../../components/home/SearchBar';
import CategoryBar from '../../components/home/CategoryBar';
import FeaturedPost from '../../components/home/FeaturedPost';
import PostList from '../../components/home/PostList';
import AIChatbot from '../../components/chat/AIChatbot';

function HomeGuest() {
  return (
    <>
      <HeaderGuest />
      
      {/* MAIN CONTENT CONTAINER (max-w 1120px, gutter 24px per DESIGN.md section 4) */}
      <main className="flex-1 w-full max-w-[1120px] mx-auto px-6 py-8 md:py-10">
        <SearchBar />
        <CategoryBar />
        <FeaturedPost />
        <PostList />
      </main>

      <AIChatbot />
      
      <Footer />
    </>
  );
}

export default HomeGuest;
