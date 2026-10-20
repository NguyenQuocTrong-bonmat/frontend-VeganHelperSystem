export const STORE_MARKER_VISUAL_SELECTOR = '[data-store-marker-visual]';

export function createStoreMarkerElement(shop, isSelected = false) {
  const markerElement = document.createElement('button');
  markerElement.type = 'button';
  markerElement.className = 'group flex cursor-pointer appearance-none items-center justify-center border-0 bg-transparent p-0';
  markerElement.setAttribute('aria-label', shop.name || 'Vegan Store');
  markerElement.setAttribute('aria-pressed', String(isSelected));
  markerElement.title = shop.name || 'Vegan Store';

  const markerVisual = document.createElement('span');
  markerVisual.dataset.storeMarkerVisual = 'true';
  markerVisual.className = [
    'block rounded-full border-2 border-white shadow-md',
    'transition-[width,height,background-color,box-shadow,transform] duration-150',
    'group-hover:scale-125 group-hover:shadow-lg',
    isSelected ? 'h-8 w-8 scale-110 bg-[#2F5233]' : 'h-6 w-6 bg-[#A63446]'
  ].join(' ');

  markerElement.appendChild(markerVisual);
  return markerElement;
}

export function setStoreMarkerHighlighted(markerElement, isHighlighted) {
  const markerVisual = markerElement?.querySelector(STORE_MARKER_VISUAL_SELECTOR);
  markerVisual?.classList.toggle('scale-125', isHighlighted);
}
