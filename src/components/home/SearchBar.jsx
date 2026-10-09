import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

export default function SearchBar() {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
    }
  };

  return (
    <section className="mb-8 relative z-20">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-3 w-full p-2 bg-vh-surface/80 backdrop-blur-md rounded-control border border-vh-border shadow-sm focus-within:ring-2 focus-within:ring-vh-forest focus-within:border-vh-forest transition-all duration-300">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-vh-text-secondary" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
            </svg>
          </div>
          <input 
            className="w-full h-12 pl-12 pr-4 bg-transparent text-[15px] text-vh-text-primary font-dm-sans placeholder-vh-text-secondary focus:outline-none focus:ring-0" 
            placeholder="Search recipes, video guides, vegan ingredients..." 
            aria-label="Search"
            type="text" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <Button type="submit" variant="primary" className="w-full md:w-auto h-12 px-6">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
          </svg>
          Search
        </Button>
      </form>
    </section>
  );
}

