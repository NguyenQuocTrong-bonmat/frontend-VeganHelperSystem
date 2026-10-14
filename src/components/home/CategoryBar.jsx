import React, { useRef, useState, useEffect } from 'react';
import CategoryObject3D from './CategoryObject3D';
import imgAll from '../../assets/images/categories/category-all-recipes.jpg';
import imgBraised from '../../assets/images/categories/category-braised-dishes.jpg';
import imgStirFried from '../../assets/images/categories/category-stir-fried.jpg';
import imgSoups from '../../assets/images/categories/category-soups.jpg';
import imgHotPots from '../../assets/images/categories/category-hot-pots.jpg';
import imgPastries from '../../assets/images/categories/category-vegan-pastries.jpg';

// Visual vessel pairings and imagery
const categoryMetadata = {
  'all': {
    img: imgAll,
    formType: 'ceramic-pedestal',
    subtitle: 'Harvest Banquet',
  },
  'braised-dishes': {
    img: imgBraised,
    formType: 'claypot',
    subtitle: 'Claypot Simmer',
  },
  'stir-fried-dishes': {
    img: imgStirFried,
    formType: 'wok',
    subtitle: 'Wok Searing',
  },
  'soups': {
    img: imgSoups,
    formType: 'ceramic-bowl',
    subtitle: 'Fragrant Broth',
  },
  'hot-pots': {
    img: imgHotPots,
    formType: 'hotpot',
    subtitle: 'Communal Hearth',
  },
  'vegan-pastries': {
    img: imgPastries,
    formType: 'ceramic-pedestal',
    subtitle: 'Oven & Steamer',
  },
  'vietnamese-vegan-foods': {
    img: imgBraised,
    formType: 'claypot',
    subtitle: 'Homestyle Heritage',
  },
  'western-vegan-foods': {
    img: imgPastries,
    formType: 'ceramic-pedestal',
    subtitle: 'Global Fusion',
  },
  'nutritional-knowledge': {
    img: imgSoups,
    formType: 'ceramic-bowl',
    subtitle: 'Medicinal Herbs',
  },
  'vegan-news': {
    img: imgStirFried,
    formType: 'wok',
    subtitle: 'Seasonal Market',
  },
  'inspiring-stories': {
    img: imgHotPots,
    formType: 'hotpot',
    subtitle: 'Living Traditions',
  },
};

export default function CategoryBar({ categories = [], selectedCategoryId, onSelectCategory }) {
  const stageRef = useRef(null);

  // Build the complete list of unique items: All Recipes (null) + dynamic categories
  const allItems = [
    {
      id: null,
      name: 'All Recipes',
      slug: 'all',
      subtitle: categoryMetadata['all'].subtitle,
      img: categoryMetadata['all'].img,
      formType: categoryMetadata['all'].formType,
    },
    ...categories.map((cat) => {
      const slug = cat.slug || cat.name.toLowerCase().replace(/ /g, '-');
      const meta = categoryMetadata[slug] || {
        img: imgAll,
        formType: 'ceramic-bowl',
        subtitle: 'Botanical Chapter',
      };
      return {
        id: cat.id,
        name: cat.name,
        slug,
        subtitle: meta.subtitle,
        img: meta.img,
        formType: meta.formType,
      };
    }),
  ];

  const totalCount = allItems.length;

  // Item slot spacing in pixels (balanced negative space for 200px vessels)
  const ITEM_WIDTH = 260;
  const TOTAL_CYCLE_WIDTH = totalCount * ITEM_WIDTH;

  // Carousel physics state (unbounded continuous offset)
  const offsetRef = useRef(0);
  const targetOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);
  const lastXRef = useRef(0);
  const velocityRef = useRef(0);
  const hasMovedRef = useRef(false);
  const rafIdRef = useRef(null);

  // Visible slots state updated smoothly via animation frame
  const [stageWidth, setStageWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [renderedSlots, setRenderedSlots] = useState([]);
  const [nearestItemId, setNearestItemId] = useState(selectedCategoryId);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setStageWidth(window.innerWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main animation and physics loop
  useEffect(() => {
    if (totalCount === 0) return;

    let lastCommitId = selectedCategoryId;

    const loop = () => {
      // Inertia and spring towards target
      if (!isDraggingRef.current) {
        // Apply remaining velocity
        targetOffsetRef.current += velocityRef.current;
        velocityRef.current *= 0.94; // slightly softer friction for natural glide
        if (Math.abs(velocityRef.current) < 0.05) velocityRef.current = 0;
      }

      // Smooth spring lerp towards target offset
      const diff = targetOffsetRef.current - offsetRef.current;
      offsetRef.current += diff * 0.12;

      const currentOffset = offsetRef.current;
      const centerStageX = stageWidth / 2;

      // Calculate which items should be rendered around the center
      const visibleRange = Math.ceil(stageWidth / ITEM_WIDTH) + 2;

      // Find the nearest virtual index to the center
      const centerVirtualIdx = Math.round(-currentOffset / ITEM_WIDTH);

      const slots = [];
      let closestDist = Infinity;
      let closestId = null;

      for (let i = centerVirtualIdx - visibleRange; i <= centerVirtualIdx + visibleRange; i++) {
        // Modulo arithmetic for infinite wrapping in both directions
        const rawItemIdx = ((i % totalCount) + totalCount) % totalCount;
        const item = allItems[rawItemIdx];

        // Exact horizontal position of this slot relative to stage center
        const slotX = centerStageX + currentOffset + i * ITEM_WIDTH;

        // Distance from stage center
        const distFromCenter = Math.abs(slotX - centerStageX);

        // Center factor: 1.0 (exact center), down to 0.0 (smooth falloff across 480px)
        const maxDist = Math.max(stageWidth * 0.42, 380);
        const centerFactor = Math.max(0, 1 - distFromCenter / maxDist);

        if (distFromCenter < closestDist) {
          closestDist = distFromCenter;
          closestId = item.id;
        }

        slots.push({
          key: `slot-${i}-${item.id ?? 'all'}`,
          item,
          virtualIndex: i,
          itemIndex: rawItemIdx,
          slotX,
          centerFactor,
        });
      }

      setRenderedSlots(slots);
      setNearestItemId(closestId);

      // When dragging finishes and momentum slows down, commit the nearest active category to state
      if (!isDraggingRef.current && Math.abs(velocityRef.current) < 0.2 && Math.abs(diff) < 0.5) {
        if (closestId !== lastCommitId) {
          lastCommitId = closestId;
        }
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [totalCount, stageWidth, allItems, selectedCategoryId]);

  // Pointer / Touch / Mouse Drag Listeners
  const handlePointerDown = (e) => {
    // Only drag with left click or primary touch
    if (e.button !== undefined && e.button !== 0) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    startOffsetRef.current = targetOffsetRef.current;
    velocityRef.current = 0;

    if (stageRef.current) {
      stageRef.current.style.cursor = 'grabbing';
    }
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    if (Math.abs(deltaX) > 6) {
      hasMovedRef.current = true;
    }

    const stepDelta = e.clientX - lastXRef.current;
    velocityRef.current = stepDelta;
    lastXRef.current = e.clientX;

    targetOffsetRef.current = startOffsetRef.current + deltaX;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (stageRef.current) {
      stageRef.current.style.cursor = 'grab';
    }

    // Snap smoothly to nearest item center after dragging ends
    const nearestVirtual = Math.round(-targetOffsetRef.current / ITEM_WIDTH);
    targetOffsetRef.current = -nearestVirtual * ITEM_WIDTH;
  };

  // Step button helper
  const handleStep = (direction) => {
    velocityRef.current = 0;
    const currentVirtual = Math.round(-targetOffsetRef.current / ITEM_WIDTH);
    const nextVirtual = currentVirtual + (direction === 'left' ? -1 : 1);
    targetOffsetRef.current = -nextVirtual * ITEM_WIDTH;
  };

  // Handle clicking a category item
  const handleItemSelect = (id) => {
    if (!hasMovedRef.current && onSelectCategory) {
      onSelectCategory(id);

      // Also smoothly center the selected item
      const currentVirtual = Math.round(-targetOffsetRef.current / ITEM_WIDTH);
      const rawCurrent = ((currentVirtual % totalCount) + totalCount) % totalCount;
      const targetIdx = allItems.findIndex((it) => it.id === id);
      if (targetIdx !== -1) {
        let diff = targetIdx - rawCurrent;
        if (diff > totalCount / 2) diff -= totalCount;
        if (diff < -totalCount / 2) diff += totalCount;
        targetOffsetRef.current = -(currentVirtual + diff) * ITEM_WIDTH;
      }
    }
  };

  return (
    <section
      ref={stageRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative mb-24 w-screen left-1/2 -translate-x-1/2 overflow-hidden select-none cursor-grab py-4 touch-pan-y"
      aria-labelledby="immersive-stage-heading"
    >
      {/* Editorial Title & Concept Header */}
      <div className="text-center max-w-2xl mx-auto px-6 mb-8 pointer-events-none">
        <span className="font-dm-sans text-vh-forest font-semibold tracking-[0.2em] text-[11px] md:text-xs uppercase block mb-2.5">
          SCULPTURAL CULINARY STAGE
        </span>
        <h2 id="immersive-stage-heading" className="font-dm-serif text-3xl md:text-4xl lg:text-[42px] text-vh-text-primary leading-[1.14]">
          An interactive feast of plant-based craft
        </h2>
        <p className="font-dm-sans text-vh-text-secondary text-[14px] md:text-[15px] mt-2.5 max-w-lg mx-auto font-light leading-relaxed">
          Drag horizontally in any direction for an infinite showcase of culinary vessels. The centered vessel filters the seasonal recipe collection.
        </p>
      </div>

      {/* Infinite 3D Carousel Stage */}
      <div
        className="relative w-full h-[360px] sm:h-[390px] md:h-[420px] flex items-center overflow-hidden"
        style={{
          perspective: '1400px',
        }}
      >
        {/* Subtle, soft ambient glow in the stage center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[320px] rounded-full bg-gradient-to-r from-[#A8BDA2]/12 via-[#FAF8F0]/20 to-[#D6B66A]/12 blur-3xl pointer-events-none" />

        {/* Circular Virtual Slot Track */}
        <div className="relative w-full h-full">
          {renderedSlots.map(({ key, item, itemIndex, slotX, centerFactor }) => {
            const isSelected = selectedCategoryId === item.id;
            const isNearest = nearestItemId === item.id;

            return (
              <div
                key={key}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 will-change-transform pointer-events-auto"
                style={{
                  left: `${slotX}px`,
                  zIndex: Math.round(centerFactor * 50) + (isSelected ? 60 : 0),
                }}
              >
                <CategoryObject3D
                  id={item.id}
                  index={itemIndex}
                  title={item.name}
                  subtitle={item.subtitle}
                  imgSrc={item.img}
                  formType={item.formType}
                  centerFactor={centerFactor}
                  isSelected={isSelected}
                  onSelect={handleItemSelect}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Buttons & Reset Indicator */}
      <div className="flex items-center justify-between text-xs font-dm-sans text-vh-text-secondary/70 max-w-4xl mx-auto px-6 mt-6">
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => handleStep('left')}
            aria-label="Previous category"
            className="w-10 h-10 rounded-full bg-white border border-vh-border/80 text-vh-text-primary hover:bg-vh-forest hover:text-white transition-all shadow-sm flex items-center justify-center active:scale-95"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => handleStep('right')}
            aria-label="Next category"
            className="w-10 h-10 rounded-full bg-white border border-vh-border/80 text-vh-text-primary hover:bg-vh-forest hover:text-white transition-all shadow-sm flex items-center justify-center active:scale-95"
          >
            →
          </button>
          <span className="ml-2 font-medium">← Infinite drag in both directions →</span>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onSelectCategory) onSelectCategory(null);
            // Center All Recipes (index 0)
            const currentVirtual = Math.round(-targetOffsetRef.current / totalCount);
            targetOffsetRef.current = -currentVirtual * totalCount * ITEM_WIDTH;
          }}
          className="hover:text-vh-forest font-medium underline underline-offset-4 decoration-vh-border transition-colors cursor-pointer pointer-events-auto"
        >
          {selectedCategoryId !== null ? 'Reset to All Recipes' : 'Viewing All Categories'}
        </button>
      </div>
    </section>
  );
}


