import { Link } from 'react-router-dom';
import { useState } from 'react';
import { getImageUrl } from '../../utils/imageUtils';

export function SafeImage({ src, alt = '', className = '', fallback = 'No image' }) {
  const [failedSrc, setFailedSrc] = useState(null);
  return typeof src === 'string' && src && failedSrc !== src
    ? <img src={getImageUrl(src)} alt={alt} className={className} onError={() => setFailedSrc(src)} />
    : <span className="text-[#6B6F63] text-sm" role="img" aria-label={alt || fallback}>{fallback}</span>;
}

// SavedPostItemDto uses postId; PostFeedItemDto uses id. Keep that distinction at the caller.
export default function PostCard({ post, postId, onUnsave, removing, disabled }) {
  return <article className="min-w-0 flex flex-col bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl overflow-hidden hover:shadow-lg">
    <Link to={`/posts/${postId}`} className="block min-w-0 group">
      <div className="relative h-56 bg-[#E9EFE6] flex items-center justify-center overflow-hidden">
        <SafeImage src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover" />
        <span className="absolute top-3 left-3 bg-white/90 rounded-full px-3 py-1 text-xs text-[#2F5233]">{post.postType}</span>
      </div>
      <h3 className="p-5 font-fraunces text-xl font-semibold text-[#2B2A25] line-clamp-2 break-words [overflow-wrap:anywhere] group-hover:text-[#2F5233]">{post.title}</h3>
    </Link>
    <div className="mt-auto p-5 pt-3 flex flex-wrap items-center justify-between gap-3 text-sm border-t border-[#DCE3D5]">
      <span className="min-w-0 flex-1 truncate" title={post.authorName}>{post.authorName}</span>
      <span className="text-[#6B6F63]">{post.viewCount ?? 0} views</span>
      {onUnsave && <button type="button" disabled={disabled || removing} onClick={() => onUnsave(postId)} className="text-[#2F5233] disabled:opacity-50" aria-label={`Remove ${post.title} from saved posts`}>{removing ? 'Removing…' : 'Unsave'}</button>}
    </div>
  </article>;
}
