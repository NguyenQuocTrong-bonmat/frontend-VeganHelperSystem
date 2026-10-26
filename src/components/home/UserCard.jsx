import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUtils';
import UserProfilePreview from './UserProfilePreview';

function UserCard({ user, onOpenProfilePreview, isGuest = false, onAuthRequired }) {
  const [imageError, setImageError] = useState(false);
  const [isLocalPreviewOpen, setIsLocalPreviewOpen] = useState(false);
  const cardRef = useRef(null);

  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.displayName || user?.username || 'User'
  )}&background=E9EFE6&color=2F5233&size=128`;

  const avatarUrl = !imageError && user?.avatarUrl ? getImageUrl(user.avatarUrl) : fallbackUrl;

  const handleOpenPreview = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user?.id) return;

    if (onOpenProfilePreview) {
      onOpenProfilePreview(user, e.currentTarget);
    } else {
      setIsLocalPreviewOpen(true);
    }
  };

  return (
    <>
      <div
        ref={cardRef}
        onClick={handleOpenPreview}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleOpenPreview(e);
          }
        }}
        aria-label={`Preview profile for ${user.displayName || user.username || 'user'}`}
        className="bg-[#FDFBF6] hover:bg-white border border-[#DCE3D5] hover:border-[#2F5233] rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center gap-3.5 hover:shadow-md hover:-translate-y-0.5 motion-reduce:transform-none transition-all duration-200 cursor-pointer group active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5233]"
      >
        {/* Avatar */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm ring-2 ring-[#DCE3D5] group-hover:ring-[#2F5233]/40 transition-colors bg-[#E9EFE6]">
          <img
            src={avatarUrl}
            alt={user.displayName || user.username || 'User'}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name & Username */}
        <div className="flex-1 w-full min-w-0 flex flex-col items-center">
          <h3 className="font-fraunces font-semibold text-[17px] sm:text-[19px] text-[#2B2A25] group-hover:text-[#2F5233] transition-colors truncate w-full">
            {user.displayName || user.username || 'Unnamed User'}
          </h3>
          {user.username && (
            <p className="text-[13px] text-[#6B6F63] font-medium truncate w-full mt-0.5">
              @{user.username}
            </p>
          )}
        </div>

        {/* Action Button: Opens profile preview */}
        <div className="w-full pt-3 border-t border-[#DCE3D5]/50 mt-auto flex items-center justify-center">
          <span className="block w-full text-center px-4 py-2 text-[13px] font-medium text-[#2F5233] bg-[#F3F6EE] group-hover:bg-[#2F5233] group-hover:text-white rounded-xl transition-colors">
            Preview Profile
          </span>
        </div>
      </div>

      {/* Fallback local profile preview if no container-level modal is used */}
      {!onOpenProfilePreview && (
        <UserProfilePreview
          isOpen={isLocalPreviewOpen}
          onClose={() => setIsLocalPreviewOpen(false)}
          userId={user.id}
          initialUser={user}
          triggerEl={cardRef.current}
          isGuest={isGuest}
          onAuthRequired={onAuthRequired}
        />
      )}
    </>
  );
}

export default UserCard;
