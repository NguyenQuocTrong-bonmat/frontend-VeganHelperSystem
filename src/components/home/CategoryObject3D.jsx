import React, { useState, useRef, useEffect } from 'react';

/**
 * Visual layer helper rendering sculptural vessel geometries (clay bowls, steaming hotpots, etc.)
 */
function SculpturalVessel({ formType, imgSrc, title, isHovered, isSelected }) {
  // Common smooth vessel dimensions: balanced, soft, and never dominating the viewport
  const baseSize = "relative w-44 h-44 sm:w-48 sm:h-48 md:w-52 md:h-52 transition-transform duration-500 ease-out";

  switch (formType) {
    case 'claypot':
      return (
        <div className={baseSize}>
          {/* Gentle ceramic bevel & soft warm shadow */}
          <div 
            className="w-full h-full rounded-full p-2 bg-gradient-to-br from-[#E6C2A5] via-[#C48C62] to-[#733F20] transition-all duration-500 relative"
            style={{
              boxShadow: isHovered 
                ? '0 20px 40px -10px rgba(84, 43, 16, 0.28), 0 0 20px rgba(214, 182, 106, 0.15)' 
                : '0 12px 28px -8px rgba(84, 43, 16, 0.16)'
            }}
          >
            {/* Inner rim highlight */}
            <div className="w-full h-full rounded-full overflow-hidden border border-[#FAF8F0]/40 relative bg-[#FAF8F0]">
              <img 
                src={imgSrc} 
                alt="" 
                className="w-full h-full object-cover rounded-full filter contrast-[1.01] transition-transform duration-700 ease-out" 
                style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3D1E0B]/25 via-transparent to-white/10 pointer-events-none" />
            </div>
          </div>
        </div>
      );

    case 'ceramic-bowl':
      return (
        <div className={baseSize}>
          {/* Celadon Glazed Ceramic Bowl Body */}
          <div 
            className="w-full h-full rounded-full p-2 bg-gradient-to-br from-[#E5ECE3] via-[#B4C7B0] to-[#4A6E55] transition-all duration-500 relative"
            style={{
              boxShadow: isHovered 
                ? '0 20px 40px -10px rgba(36, 76, 56, 0.28), 0 0 20px rgba(168, 189, 162, 0.2)' 
                : '0 12px 28px -8px rgba(36, 76, 56, 0.16)'
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden border border-[#FAF8F0]/50 relative bg-[#FAF8F0]">
              <img 
                src={imgSrc} 
                alt="" 
                className="w-full h-full object-cover rounded-full filter contrast-[1.01] transition-transform duration-700 ease-out" 
                style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }} 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#244C38]/20 via-transparent to-[#FAF8F0]/20 pointer-events-none" />
            </div>
          </div>
        </div>
      );

    case 'hotpot':
      return (
        <div className={baseSize}>
          {/* Warm Earthen Terracotta Rim */}
          <div 
            className="w-full h-full rounded-full p-2 bg-gradient-to-br from-[#E8BF98] via-[#BF7850] to-[#69361C] transition-all duration-500 relative"
            style={{
              boxShadow: isHovered 
                ? '0 20px 40px -10px rgba(74, 38, 18, 0.3), 0 0 20px rgba(214, 182, 106, 0.18)' 
                : '0 12px 28px -8px rgba(74, 38, 18, 0.18)'
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden border border-[#FAF8F0]/40 relative bg-[#FAF8F0]">
              <img 
                src={imgSrc} 
                alt="" 
                className="w-full h-full object-cover rounded-full filter contrast-[1.02] transition-transform duration-700 ease-out" 
                style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }} 
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4A2612]/10 to-[#311608]/30 pointer-events-none" />
            </div>
          </div>
        </div>
      );

    case 'wok':
      return (
        <div className={baseSize}>
          {/* Natural Slate / Cast Iron Sheen */}
          <div 
            className="w-full h-full rounded-full p-2 bg-gradient-to-br from-[#5E6B64] via-[#38433C] to-[#1E2721] transition-all duration-500 relative"
            style={{
              boxShadow: isHovered 
                ? '0 20px 40px -10px rgba(20, 26, 22, 0.3), 0 0 20px rgba(221, 242, 225, 0.15)' 
                : '0 12px 28px -8px rgba(20, 26, 22, 0.18)'
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden border border-[#DCE5D9]/30 relative bg-[#FAF8F0]">
              <img 
                src={imgSrc} 
                alt="" 
                className="w-full h-full object-cover rounded-full filter contrast-[1.01] transition-transform duration-700 ease-out" 
                style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }} 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#121A15]/25 via-transparent to-white/10 pointer-events-none" />
            </div>
          </div>
        </div>
      );

    case 'ceramic-pedestal':
    default:
      return (
        <div className={baseSize}>
          {/* Glazed Porcelain / Warm Sand Dish */}
          <div 
            className="w-full h-full rounded-full p-2 bg-gradient-to-br from-[#FAF8F0] via-[#E2D8C7] to-[#9C8665] transition-all duration-500 relative"
            style={{
              boxShadow: isHovered 
                ? '0 20px 40px -10px rgba(60, 48, 32, 0.25), 0 0 20px rgba(214, 182, 106, 0.15)' 
                : '0 12px 28px -8px rgba(60, 48, 32, 0.15)'
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden border border-[#FAF8F0]/70 relative bg-[#FAF8F0]">
              <img 
                src={imgSrc} 
                alt="" 
                className="w-full h-full object-cover rounded-full filter contrast-[1.01] transition-transform duration-700 ease-out" 
                style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }} 
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-[#4A3B2C]/20 pointer-events-none" />
            </div>
          </div>
        </div>
      );
  }
}

/**
 * CategoryObject3D — An interactive 3D floating food vessel representing a category
 */
export default function CategoryObject3D({
  id,
  index,
  title,
  subtitle,
  imgSrc,
  formType = 'ceramic-bowl',
  initialZ = 0,
  initialScale = 1,
  depthLayer = 1, // 0.6 = background, 1 = midground, 1.4 = foreground
  centerFactor = 1, // 1 = center, 0 = far edge
  isSelected = false,
  onSelect,
}) {
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, translateZ: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Handle pointer tilt physics
  const handlePointerMove = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate normalized delta (-1 to 1)
    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);

    // Max rotation 14deg, max translateZ 40px
    setTilt({
      rotateX: -normY * 12,
      rotateY: normX * 14,
      translateZ: 35,
    });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, translateZ: 0 });
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const formattedIndex = String(index).padStart(2, '0');

  // Center-focused scaling math:
  // centerFactor: 1.0 (center) down to 0.0 (far away)
  // Scale range: ~0.76 at edges up to 1.04 at center for natural, graceful proportions
  const dynamicBaseScale = 0.76 + centerFactor * 0.28; 
  const hoverBonus = isHovered || isFocused ? 0.04 : 0;
  const currentScale = dynamicBaseScale * initialScale + hoverBonus;

  // Depth & Opacity modulation based on distance from center
  const dynamicZ = initialZ + centerFactor * 20 + (isHovered || isFocused ? 25 : 0) + (isSelected ? 10 : 0);
  const dynamicOpacity = 0.55 + centerFactor * 0.45; // 0.55 at far edges, 1.0 at center

  return (
    <div
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative shrink-0 flex flex-col items-center justify-center cursor-pointer select-none group"
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        opacity: dynamicOpacity,
        transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Interactive Trigger Button for Keyboard and Accessibility */}
      <button
        type="button"
        onClick={() => onSelect(id)}
        onFocus={() => { setIsFocused(true); setIsHovered(true); }}
        onBlur={() => { setIsFocused(false); setIsHovered(false); }}
        aria-pressed={isSelected}
        aria-label={`${title} Category (${formattedIndex})`}
        className="relative bg-transparent border-0 p-0 m-0 outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:ring-offset-4 focus-visible:ring-offset-vh-cream rounded-full transition-transform"
      >
        {/* Floating 3D Object Body */}
        <div
          className="relative transition-transform duration-300 ease-out will-change-transform"
          style={{
            transform: `scale(${currentScale}) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) translateZ(${dynamicZ + tilt.translateZ}px)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Soft Radial Ambient Shadow underneath vessel */}
          <div 
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-6 rounded-[100%] bg-[#244C38]/15 filter blur-lg transition-all duration-500 pointer-events-none"
            style={{
              transform: `scale(${isHovered ? 1.15 : 1}) translateZ(-20px)`,
              opacity: isHovered ? 0.35 : isSelected ? 0.28 : 0.2,
            }}
          />

          {/* Elegant Botanical Selection Ring */}
          {isSelected && (
            <div 
              className="absolute -inset-3 rounded-full border border-vh-forest/30 pointer-events-none transition-all duration-500"
              style={{
                boxShadow: '0 0 25px rgba(36, 76, 56, 0.12), inset 0 0 15px rgba(214, 182, 106, 0.12)',
                transform: 'translateZ(-5px)',
              }}
            />
          )}

          {/* 3D Vessel Form */}
          <SculpturalVessel
            formType={formType}
            imgSrc={imgSrc}
            title={title}
            isHovered={isHovered || isFocused}
            isSelected={isSelected}
          />
        </div>
      </button>

      {/* Floating Editorial Typography Label */}
      <div 
        className="mt-5 flex flex-col items-center text-center max-w-[210px] pointer-events-none transition-all duration-400 ease-out"
        style={{
          transform: `translateY(${isHovered || isFocused ? '-3px' : '0px'}) translateZ(15px)`,
        }}
      >
        <span 
          className={`font-dm-sans text-[11px] uppercase tracking-[0.2em] font-medium transition-colors duration-300 flex items-center gap-1.5 ${
            isSelected 
              ? 'text-vh-forest font-semibold' 
              : isHovered 
                ? 'text-vh-forest' 
                : 'text-vh-text-secondary/65'
          }`}
        >
          <span className="opacity-75">{formattedIndex}</span>
          <span>·</span>
          <span>{subtitle}</span>
        </span>
        <h3 
          className={`font-dm-serif text-lg sm:text-xl leading-tight mt-1 transition-all duration-300 ${
            isSelected 
              ? 'text-vh-forest font-semibold' 
              : isHovered 
                ? 'text-vh-text-primary' 
                : 'text-vh-text-primary/90'
          }`}
        >
          {title}
        </h3>
        
        {/* Subtle Active Indicator Dot */}
        <div 
          className={`mt-1.5 flex items-center gap-1 transition-opacity duration-300 ${
            isSelected ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-vh-gold ring-2 ring-vh-forest/40" />
          <span className="text-[10px] font-dm-sans text-vh-forest font-semibold uppercase tracking-wider">Active</span>
        </div>
      </div>
    </div>
  );
}
