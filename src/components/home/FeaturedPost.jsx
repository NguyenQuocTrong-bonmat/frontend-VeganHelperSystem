import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export default function FeaturedPost({ post, isGuest = false }) {
  const { ref, isVisible } = useScrollReveal();

  if (!post) return null;

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

  const linkTo = isGuest ? `/posts/${post.id}/guest` : `/posts/${post.id}`;

  return (
    <section ref={ref} className={`mb-16 transform transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-dm-serif text-3xl font-medium text-vh-text-primary">
          Editor's Pick
        </h2>
      </div>
      
      <Link 
        className="block bg-vh-surface border border-vh-border/60 rounded-card-lg grid grid-cols-1 lg:grid-cols-12 overflow-hidden hover:shadow-xl hover:shadow-vh-sage/20 hover:border-vh-sage/60 hover:-translate-y-1 transition-all duration-500 ease-out cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest" 
        to={linkTo}
      >
        <div className="relative lg:col-span-7 w-full h-72 md:h-[400px] lg:h-[480px] bg-vh-mint overflow-hidden">
          {post.thumbnailUrl ? (
            <img src={getImageUrl(post.thumbnailUrl)} alt={post.title} className="w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-dm-sans text-vh-text-secondary text-sm">No Image</div>
          )}
          {/* Glass pill for category on top of image */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6 px-4 py-1.5 bg-white/70 backdrop-blur-md rounded-full border border-white/50 text-vh-forest font-dm-sans text-sm font-medium shadow-sm">
            {post.category?.name || 'Recipe'}
          </div>
        </div>
        
        <div className="lg:col-span-5 flex flex-col justify-center p-6 md:p-10 text-left bg-gradient-to-br from-vh-surface to-vh-cream/50">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[14px] font-medium font-dm-sans text-vh-forest">
                Featured
              </span>
              <span className="text-xs text-vh-text-secondary">•</span>
              <span className="text-[14px] font-dm-sans text-vh-text-secondary">
                {getTimeAgo(post.createdAt)}
              </span>
            </div>
            
            <h3 className="font-dm-serif text-3xl md:text-4xl font-medium text-vh-text-primary mb-4 leading-tight group-hover:text-vh-forest transition-colors">
              {post.title}
            </h3>
            
            <p className="text-[16px] leading-relaxed font-dm-sans text-vh-text-secondary mb-8 line-clamp-3">
              {post.content}
            </p>
          </div>
          
          <div className="pt-6 border-t border-vh-border/60 flex items-center justify-between text-[14px] font-dm-sans text-vh-text-secondary">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-vh-mint border border-vh-border flex items-center justify-center overflow-hidden">
                {post.avatarUrl ? (
                  <img src={getImageUrl(post.avatarUrl)} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-5 h-5 text-vh-text-secondary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="7" r="4"></circle>
                    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                  </svg>
                )}
              </div>
              <span className="font-medium text-vh-text-primary">
                {post.authorName || 'Vegan Helper'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-vh-text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                <strong className="font-semibold text-vh-text-primary">{post.viewCount || 0}</strong>
              </span>
              <span className="flex items-center gap-1.5 text-vh-error">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                </svg>
                <strong className="font-semibold text-vh-text-primary">{post.likeCount || 0}</strong>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
