import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';

export default function FeaturedPost({ post, loading }) {
  if (loading) return <div className="text-center py-10 text-[#6B6F63]">Loading...</div>;
  if (!post) return <div className="text-center py-10 text-[#6B6F63]">No featured post.</div>;

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
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-fraunces text-2xl font-medium text-[#2B2A25]">
          Featured Post
        </h2>
        <span className="text-[13px] font-medium text-[#6B6F63]">
          Weekly recommendation
        </span>
      </div>
      <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center hover:border-[#2F5233] transition-colors cursor-pointer" to={`/posts/${post.id}/guest`}>
        <div className="relative lg:col-span-6 w-full h-64 md:h-80 bg-[#E9EFE6] border border-[#DCE3D5] hero-radius overflow-hidden">
          {post.thumbnailUrl ? (
            <img src={getImageUrl(post.thumbnailUrl)} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#6B6F63] text-sm">No Image</div>
          )}
        </div>
        <div className="lg:col-span-6 flex flex-col justify-between h-full py-1 text-left">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-[3px] h-4 bg-[#2F5233] rounded-full"></span>
              <span className="text-[13px] font-medium text-[#6B6F63]">
                {post.category?.name || 'Recipe'}
              </span>
              <span className="text-xs text-[#6B6F63]">
                •
              </span>
              <span className="text-[13px] text-[#6B6F63]">
                {getTimeAgo(post.createdAt)}
              </span>
            </div>
            <h3 className="font-fraunces text-2xl md:text-3xl font-semibold text-[#2B2A25] mb-3 leading-snug hover:text-[#2F5233] transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-[15px] leading-relaxed text-[#6B6F63] mb-6 line-clamp-3">
              {post.content}
            </p>
          </div>
          <div className="pt-4 border-t border-[#DCE3D5] flex items-center justify-between text-[13px] text-[#6B6F63]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center overflow-hidden">
                {post.avatarUrl ? (
                  <img src={getImageUrl(post.avatarUrl)} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="7" r="4"></circle>
                    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                  </svg>
                )}
              </div>
              <span className="font-medium text-[#2B2A25]">
                {post.authorName || 'Anonymous'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="">
                Views:
                <strong className="font-semibold text-[#2B2A25] ml-1">
                  {post.viewCount || 0}
                </strong>
              </span>
              <span className="flex items-center gap-1 text-[#A63446]">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                </svg>
                <span className="text-[#6B6F63]">
                  Likes:
                </span>
                <strong className="font-semibold text-[#2B2A25]">
                  {post.likeCount || 0}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
