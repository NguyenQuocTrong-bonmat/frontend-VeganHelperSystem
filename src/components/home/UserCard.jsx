import { Link } from 'react-router-dom';
import { SafeImage } from '../posts/PostCard';
export default function UserCard({ user }) {
  return <Link to={`/users/${user.id}`} className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 flex items-center gap-4 hover:border-[#2F5233] min-w-0">
    <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-[#E9EFE6] flex items-center justify-center"><SafeImage src={user.avatarUrl} alt={user.displayName || user.username} fallback={user.displayName?.charAt(0) || 'U'} className="w-full h-full object-cover" /></div>
    <div className="flex-1 min-w-0"><h3 className="font-semibold truncate">{user.displayName || user.username}</h3><p className="text-sm text-[#6B6F63] truncate">@{user.username}</p></div>
    <span className="text-sm text-[#2F5233] shrink-0">View Profile</span>
  </Link>;
}
