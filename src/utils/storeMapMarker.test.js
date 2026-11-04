import { describe, expect, it } from 'vitest';
import {
  createStoreMarkerElement,
  setStoreMarkerHighlighted,
  resolveStoreIcon,
  STORE_MARKER_VISUAL_SELECTOR,
  STORE_ICON_PATHS,
} from './storeMapMarker';

describe('store map marker', () => {
  it('keeps map positioning transforms free from transitions', () => {
    const markerElement = createStoreMarkerElement({ name: 'Green Garden' });
    const markerVisual = markerElement.querySelector(STORE_MARKER_VISUAL_SELECTOR);

    expect(markerElement.className).not.toContain('transition');
    expect(markerElement.className).not.toContain('scale-');
    expect(markerVisual.className).toContain('transition-[');
  });

  it('applies selection and hover styling only to the visual child', () => {
    const markerElement = createStoreMarkerElement({ name: 'Green Garden' }, true);
    const markerVisual = markerElement.querySelector(STORE_MARKER_VISUAL_SELECTOR);

    expect(markerElement.getAttribute('aria-pressed')).toBe('true');
    expect(markerVisual.className).toContain('bg-[#2F5233]');
    expect(markerVisual.className).toContain('text-white');

    setStoreMarkerHighlighted(markerElement, true);
    expect(markerVisual.classList.contains('scale-125')).toBe(true);

    setStoreMarkerHighlighted(markerElement, false);
    expect(markerVisual.classList.contains('scale-125')).toBe(false);
  });

  it('renders teardrop icon pins matching landing page without red dots', () => {
    const unselectedElement = createStoreMarkerElement({ name: 'Quán Chay An Lạc' }, false);
    const visual = unselectedElement.querySelector(STORE_MARKER_VISUAL_SELECTOR);

    // Never use the old red dot #A63446
    expect(visual.className).not.toContain('bg-[#A63446]');
    expect(visual.className).not.toContain('text-[#A63446]');

    // Uses landing-page teardrop style
    expect(visual.className).toContain('-rotate-45');
    expect(visual.className).toContain('rounded-[50%_50%_50%_4px]');
    expect(visual.className).toContain('bg-[#FAFBF9]');
    expect(visual.className).toContain('text-[#2F5233]');

    // Contains SVG icon rotated back +45deg so it stays upright
    const svg = visual.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg.getAttribute('class')).toContain('rotate-45');

    const path = svg.querySelector('path');
    expect(path).not.toBeNull();
    expect(path.getAttribute('d')).toBe(STORE_ICON_PATHS.bowl);
  });

  it('correctly maps store categories to bowl, leaf, and pin icons', () => {
    // Eatery / Restaurant
    expect(resolveStoreIcon({ name: 'Quán cơm chay Sen Trắng' })).toBe('bowl');
    expect(resolveStoreIcon({ name: 'Loving Hut Vegan Restaurant' })).toBe('bowl');

    // Produce / Organic / Farm
    expect(resolveStoreIcon({ name: 'Nông sản hữu cơ Đà Lạt' })).toBe('leaf');
    expect(resolveStoreIcon({ name: 'Green Garden Organic Market' })).toBe('leaf');

    // Mart / Grocery / Store
    expect(resolveStoreIcon({ name: 'Siêu thị thực phẩm chay An Lạc' })).toBe('pin');
    expect(resolveStoreIcon({ name: 'Vegan Pantry Store' })).toBe('pin');
  });
});
