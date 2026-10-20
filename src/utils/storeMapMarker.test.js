import { describe, expect, it } from 'vitest';
import {
  createStoreMarkerElement,
  setStoreMarkerHighlighted,
  STORE_MARKER_VISUAL_SELECTOR
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

    setStoreMarkerHighlighted(markerElement, true);
    expect(markerVisual.classList.contains('scale-125')).toBe(true);

    setStoreMarkerHighlighted(markerElement, false);
    expect(markerVisual.classList.contains('scale-125')).toBe(false);
  });
});
