import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function PostList({ 
  posts = [], 
  isGuest = false,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  loadMoreError = null,
}) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.05 });

  if (!posts || posts.length === 0) return null;

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

  const getLinkTo = (id) => isGuest ? `/posts/${id}/guest` : `/posts/${id}`;

  return (
    <section ref={ref} aria-labelledby="explore-recipes-heading" className="w-full">
      <div className={`flex items-center justify-between mb-8 transform transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h2 id="explore-recipes-heading" className="font-dm-serif text-3xl font-medium text-vh-text-primary">
          Explore Recipes
        </h2>
        <div className="flex items-center gap-4 text-[14px] font-dm-sans text-vh-text-secondary">
          <span className="text-vh-forest font-semibold border-b-2 border-vh-forest pb-1 cursor-pointer">
            Latest
          </span>
          <span className="hover:text-vh-forest transition-colors cursor-pointer pb-1">
            Trending
          </span>
        </div>
      </div>
      
      {/* 3-column responsive grid on desktop, 2-col on tablet, 1-col on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch w-full">
        {posts.map((post, index) => (
          <div 
            key={post.id}
            style={{ transitionDelay: isVisible ? `${(index % 9) * 80}ms` : '0ms' }}
            className={`flex flex-col h-full transform transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <Link 
              className="flex flex-col h-full bg-vh-surface border border-vh-border/50 rounded-card-lg overflow-hidden hover:shadow-xl hover:shadow-vh-sage/20 hover:border-vh-sage/60 hover:-translate-y-1 transition-all duration-500 ease-out cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest" 
              to={getLinkTo(post.id)}
            >
              <div className="relative w-full h-52 sm:h-56 bg-vh-mint overflow-hidden shrink-0">
                {post.thumbnailUrl ? (
                  <img 
                    src={getImageUrl(post.thumbnailUrl)} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-dm-sans text-vh-text-secondary text-sm">No Image</div>
                )}
                <div className="absolute top-3 left-3 px-3 py-1 bg-white/70 backdrop-blur-md rounded-full border border-white/50 text-vh-forest font-dm-sans text-xs font-medium shadow-sm">
                  {post.category?.name || 'Recipe'}
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-between p-5 bg-gradient-to-b from-vh-surface to-vh-cream/30">
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-xs font-dm-sans text-vh-text-secondary">
                      {getTimeAgo(post.createdAt)}
                    </span>
                  </div>
                  <h3 className="font-dm-serif text-xl font-medium text-vh-text-primary mb-2 leading-snug group-hover:text-vh-forest transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[14px] sm:text-[15px] leading-relaxed font-dm-sans text-vh-text-secondary line-clamp-2 mb-4">
                    {post.content}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-vh-border/60 flex items-center justify-between text-[13px] font-dm-sans text-vh-text-secondary mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-vh-mint border border-vh-border flex items-center justify-center overflow-hidden shrink-0">
                      {post.avatarUrl ? (
                        <img src={getImageUrl(post.avatarUrl)} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-3.5 h-3.5 text-vh-text-secondary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <circle cx="12" cy="7" r="4"></circle>
                          <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                        </svg>
                      )}
                    </div>
                    <span className="font-medium text-vh-text-primary truncate max-w-[110px]">{post.authorName || 'Anonymous'}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-vh-text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      <strong className="font-semibold text-vh-text-primary">{post.viewCount || 0}</strong>
                    </span>
                    <span className="flex items-center gap-1 text-vh-error">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                      </svg>
                      <strong className="font-semibold text-vh-text-primary">{post.likeCount || 0}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      {/* Load More Section */}
      {hasMore && (
        <div 
          className={`mt-12 flex flex-col items-center justify-center gap-3 transform transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          {loadMoreError && (
            <p className="text-sm font-dm-sans text-vh-error">
              {loadMoreError} — please try again.
            </p>
          )}

          <button 
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className={`h-12 px-8 rounded-full border border-vh-forest font-dm-sans text-[15px] font-medium transition-all duration-300 focus-ring-vh flex items-center justify-center gap-2.5 ${
              loadingMore 
                ? 'bg-vh-mint/40 text-vh-forest cursor-wait border-vh-sage' 
                : 'bg-transparent text-vh-forest hover:bg-vh-forest hover:text-white hover:-translate-y-0.5 hover:shadow-md active:scale-95 cursor-pointer'
            }`}
          >
            {loadingMore ? (
              <>
                <span className="w-4 h-4 border-2 border-vh-forest border-t-transparent rounded-full animate-spin" />
                <span>Harvesting Recipes...</span>
              </>
            ) : (
              <span>Load More Recipes</span>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
