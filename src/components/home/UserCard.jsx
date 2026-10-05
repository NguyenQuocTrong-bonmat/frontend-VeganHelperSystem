import { Link } from 'react-router-dom';

function UserCard({ user }) {
  // Default avatar if none provided
  const avatarUrl = user.avatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName || 'User') + '&background=E9EFE6&color=2F5233';

  return (
    <Link 
      to={`/users/${user.id}`}
      className="bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 flex items-center gap-4 hover:border-[#2F5233] transition-colors cursor-pointer group"
    >
      <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-[#DCE3D5] group-hover:border-[#2F5233] transition-colors">
        <img 
          src={avatarUrl} 
          alt={user.displayName} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-vietnam font-semibold text-[16px] text-[#2B2A25] group-hover:text-[#2F5233] transition-colors truncate">
          {user.displayName || 'Unnamed User'}
        </h3>
        <p className="text-[13px] text-[#6B6F63] truncate mt-0.5">
          {user.dietType || 'Vegan Enthusiast'}
        </p>
      </div>
      <div className="shrink-0">
        <button className="px-3 py-1.5 text-[12px] font-medium text-[#2F5233] bg-[#F3F6EE] hover:bg-[#E9EFE6] rounded-lg transition-colors border border-transparent group-hover:border-[#DCE3D5]">
          View Profile
        </button>
      </div>
    </Link>
  );
}

export default UserCard;
