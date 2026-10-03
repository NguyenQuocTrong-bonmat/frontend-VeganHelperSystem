import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';

export default function PostList({ posts = [], isGuest = false }) {
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
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-dm-serif text-3xl font-medium text-vh-text-primary">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <Link 
            key={post.id} 
            className="flex flex-col bg-vh-surface border border-vh-border/50 rounded-card-lg overflow-hidden hover:shadow-lg hover:shadow-vh-sage/20 transition-all duration-normal ease-vh cursor-pointer group" 
            to={getLinkTo(post.id)}
          >
            <div className="relative w-full h-56 bg-vh-mint overflow-hidden">
              {post.thumbnailUrl ? (
                <img src={getImageUrl(post.thumbnailUrl)} alt={post.title} className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-[1.05]" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-dm-sans text-vh-text-secondary text-sm">No Image</div>
              )}
              <div className="absolute top-3 left-3 px-3 py-1 bg-white/70 backdrop-blur-md rounded-full border border-white/50 text-vh-forest font-dm-sans text-xs font-medium shadow-sm">
                {post.category?.name || 'Recipe'}
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-between p-5 bg-gradient-to-b from-vh-surface to-vh-cream/30">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-dm-sans text-vh-text-secondary">
                    {getTimeAgo(post.createdAt)}
                  </span>
                </div>
                <h3 className="font-dm-serif text-xl font-medium text-vh-text-primary mb-2 leading-snug group-hover:text-vh-forest transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-[15px] leading-relaxed font-dm-sans text-vh-text-secondary line-clamp-2 mb-4">
                  {post.content}
                </p>
              </div>
              
              <div className="pt-4 border-t border-vh-border/60 flex items-center justify-between text-[13px] font-dm-sans text-vh-text-secondary">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-vh-mint border border-vh-border flex items-center justify-center overflow-hidden">
                    {post.avatarUrl ? (
                      <img src={getImageUrl(post.avatarUrl)} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-3.5 h-3.5 text-vh-text-secondary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <circle cx="12" cy="7" r="4"></circle>
                        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                      </svg>
                    )}
                  </div>
                  <span className="font-medium text-vh-text-primary truncate max-w-[100px]">{post.authorName || 'Anonymous'}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
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
        ))}
      </div>
      
      <div className="mt-12 flex justify-center">
        <button className="h-12 px-8 rounded-full border border-vh-forest bg-transparent text-vh-forest font-dm-sans text-[15px] font-medium hover:bg-vh-forest hover:text-white transition-colors focus-ring-vh cursor-pointer">
          Load More Recipes
        </button>
      </div>
    </section>
  );
}
