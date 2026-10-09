import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';

function UserCard({ user }) {
  // Use actual avatar or fallback
  const avatarUrl = user.avatarUrl 
    ? getImageUrl(user.avatarUrl) 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=E9EFE6&color=2F5233&size=128`;

  return (
    <Link 
      to={`/users/${user.id}`}
      className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-2xl p-6 flex flex-col items-center text-center gap-4 hover:border-[#2F5233] hover:shadow-lg hover:shadow-[#E9EFE6] hover:-translate-y-1 transition-all duration-300 cursor-pointer group active:scale-[0.98]"
    >
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-sm ring-1 ring-[#DCE3D5] group-hover:ring-[#2F5233]/40 transition-colors bg-[#E9EFE6]">
        <img 
          src={avatarUrl} 
          alt={user.displayName} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="flex-1 w-full min-w-0 flex flex-col items-center">
        <h3 className="font-fraunces font-semibold text-[18px] md:text-[20px] text-[#2B2A25] group-hover:text-[#2F5233] transition-colors truncate w-full">
          {user.displayName || 'Unnamed User'}
        </h3>
        {user.username && (
          <p className="text-[14px] text-[#6B6F63] font-medium truncate w-full mt-1">
            @{user.username}
          </p>
        )}
      </div>
      
      <div className="w-full pt-4 border-t border-[#DCE3D5]/50 mt-auto">
        <span className="block w-full text-center px-4 py-2.5 text-[14px] font-medium text-[#2F5233] bg-[#F3F6EE] group-hover:bg-[#E9EFE6] rounded-xl transition-colors">
          View Profile
        </span>
      </div>
    </Link>
  );
}

export default UserCard;
