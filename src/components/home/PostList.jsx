import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';

export default function PostList({ posts = [], loading }) {
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
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-fraunces text-2xl font-medium text-[#2B2A25]">
          Newest Recipes & Videos
        </h2>
        <div className="flex items-center gap-2 text-[13px] text-[#6B6F63]">
          <span className="text-[#2F5233] font-semibold underline underline-offset-4">
            Newest
          </span>
          <span className="">•</span>
          <span className="hover:text-[#2F5233] cursor-pointer">
            Popular
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="text-center py-10 text-[#6B6F63]">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 text-[#6B6F63]">No posts found for this category.</div>
        ) : (
          posts.map(post => (
            <Link key={post.id} className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer group" to={`/posts/${post.id}/guest`}>
              <div className="relative overflow-hidden w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 flex flex-col items-center justify-center p-3 text-center transition-transform group-hover:scale-[1.01]">
                {post.thumbnailUrl ? (
                  <img src={getImageUrl(post.thumbnailUrl)} alt={post.title} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-[#6B6F63] text-sm">No Image</div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-[3px] h-3.5 bg-[#2F5233] rounded-full"></span>
                    <span className="text-[13px] font-medium text-[#6B6F63] lowercase">
                      {post.category?.name || 'recipe'}
                    </span>
                    <span className="text-xs text-[#6B6F63]">•</span>
                    <span className="text-[13px] text-[#6B6F63]">
                      {getTimeAgo(post.createdAt)}
                    </span>
                  </div>
                  <h3 className="font-vietnam text-[18px] md:text-[20px] font-semibold text-[#2B2A25] mb-2 leading-snug group-hover:text-[#2F5233] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[14px] md:text-[15px] leading-relaxed text-[#6B6F63] line-clamp-2 mb-3">
                    {post.content}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#DCE3D5] flex flex-wrap items-center justify-between text-[13px] text-[#6B6F63] gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center overflow-hidden">
                      {post.avatarUrl ? (
                        <img src={getImageUrl(post.avatarUrl)} className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-3.5 h-3.5 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <circle cx="12" cy="7" r="4"></circle>
                          <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                        </svg>
                      )}
                    </div>
                    <span className="font-medium text-[#2B2A25]">{post.authorName || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>Views: <strong className="font-semibold text-[#2B2A25] ml-1">{post.viewCount || 0}</strong></span>
                    <span className="flex items-center gap-1 text-[#A63446]">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                      </svg>
                      <span className="text-[#6B6F63]">Likes:</span>
                      <strong className="font-semibold text-[#2B2A25]">{post.likeCount || 0}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
      <div className="mt-8 flex justify-center">
        <button className="h-11 px-6 rounded-lg border-[1.5px] border-[#2F5233] bg-transparent text-[#2F5233] text-[14px] font-medium hover:bg-[#E9EFE6] transition-colors">
          View More Recipes & Posts
        </button>
      </div>
    </section>
  );
}
