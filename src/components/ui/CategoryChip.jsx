import React from 'react';

const CategoryChip = ({
  label,
  isActive = false,
  onClick,
  className = ''
}) => {
  const activeStyles = isActive 
    ? 'bg-vh-forest text-white shadow-md'
    : 'bg-vh-mint text-vh-text-primary hover:bg-vh-sage hover:text-white';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium font-dm-sans transition-all duration-normal ease-vh focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:ring-offset-2 active:scale-[0.97] motion-reduce:transform-none cursor-pointer ${activeStyles} ${className}`}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
};

export default CategoryChip;
