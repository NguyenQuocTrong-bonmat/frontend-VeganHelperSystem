import React, { useRef, useState, useEffect, useCallback } from 'react';

/**
 * CategoryFilterRow:
 * - Horizontally scrollable category pills without native scrollbar tracks.
 * - Previous & Next chevron scroll buttons for easy desktop navigation.
 * - Pointer drag-to-scroll support with drag-distance threshold.
 * - Left/Right gradient fade indicators when content overflows.
 * - Fully keyboard accessible with left/right arrow navigation.
 */
export default function CategoryFilterRow({
  categories = [],
  selectedCategoryId = null,
  onSelectCategory,
}) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Drag-to-scroll state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const draggedDistanceRef = useRef(0);

  const checkScrollEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
  }, []);

  useEffect(() => {
    checkScrollEdges();
    const el = scrollRef.current;
    if (!el) return;

    const handleResize = () => checkScrollEdges();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [categories, checkScrollEdges]);

  const handleScrollBy = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Drag handlers
  const onMouseDown = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
    draggedDistanceRef.current = 0;
  };

  const onMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    draggedDistanceRef.current = Math.abs(x - startXRef.current);
    el.scrollLeft = scrollLeftRef.current - walk;
    checkScrollEdges();
  };

  const onMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleCategoryClick = (catId) => {
    // If the user was dragging to scroll (> 6px), do not trigger category filter selection
    if (draggedDistanceRef.current > 6) {
      return;
    }
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleScrollBy(160);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleScrollBy(-160);
    }
  };

  if (!categories || categories.length === 0) return null;

  return (
    <div
      className="relative w-full group/filter select-none"
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Recipe categories"
    >
      {/* Left Scroll Button */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => handleScrollBy(-220)}
          aria-label="Scroll categories left"
          className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-vh-surface/95 hover:bg-white text-vh-forest border border-vh-border/80 shadow-md items-center justify-center transition-all hover:scale-105 active:scale-95 motion-reduce:transform-none focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:ring-offset-1 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Left Gradient Edge Fade */}
      {canScrollLeft && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-vh-cream via-vh-cream/80 to-transparent z-10"
        />
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={checkScrollEdges}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUpOrLeave}
        onMouseLeave={onMouseUpOrLeave}
        className="w-full flex items-center gap-2 overflow-x-auto py-1 px-1 text-xs sm:text-sm font-dm-sans cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] focus:outline-none focus-visible:ring-1 focus-visible:ring-vh-forest/40 rounded-lg"
        tabIndex={0}
        aria-label="Categories list, use left and right arrow keys to scroll"
      >
        <button
          type="button"
          onClick={() => handleCategoryClick(null)}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:ring-offset-2 active:scale-95 motion-reduce:transform-none ${
            selectedCategoryId === null
              ? 'bg-vh-forest text-white font-medium shadow-xs'
              : 'bg-vh-surface text-vh-text-secondary hover:text-vh-forest hover:bg-vh-mint/40 border border-vh-border/70'
          }`}
        >
          All Recipes
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(isSelected ? null : cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:ring-offset-2 active:scale-95 motion-reduce:transform-none ${
                isSelected
                  ? 'bg-vh-forest text-white font-medium shadow-xs'
                  : 'bg-vh-surface text-vh-text-secondary hover:text-vh-forest hover:bg-vh-mint/40 border border-vh-border/70'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Right Gradient Edge Fade */}
      {canScrollRight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-vh-cream via-vh-cream/80 to-transparent z-10"
        />
      )}

      {/* Right Scroll Button */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => handleScrollBy(220)}
          aria-label="Scroll categories right"
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-vh-surface/95 hover:bg-white text-vh-forest border border-vh-border/80 shadow-md items-center justify-center transition-all hover:scale-105 active:scale-95 motion-reduce:transform-none focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:ring-offset-1 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
