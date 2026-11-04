export const STORE_MARKER_VISUAL_SELECTOR = '[data-store-marker-visual]';

export const STORE_ICON_PATHS = {
  bowl: 'M3 11h18a9 9 0 0 1-18 0Zm3 10h12M8 7V3m4 4V2m4 5V3',
  leaf: 'M20 4c-8-1-15 3-15 9a6 6 0 0 0 6 6c6 0 10-7 9-15ZM4 21l11-11',
  pin: 'M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Zm-4 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
};

export function resolveStoreIcon(shop) {
  const name = String(shop?.name || '').toLowerCase();
  const address = String(shop?.address || '').toLowerCase();
  const description = String(shop?.description || '').toLowerCase();
  const text = `${name} ${address} ${description}`;

  // Fresh produce, markets, farms, organics
  if (/(nông sản|hoa quả|trái cây|rau củ|rau sạch|organic|fresh|produce|farm|vườn|garden)/i.test(text)) {
    return 'leaf';
  }
  // Grocery, store, pantry, mart, essentials
  if (/(siêu thị|cửa hàng|tiệm|thực phẩm|tạp hóa|mart|store|grocery|pantry|shop)/i.test(text)) {
    return 'pin';
  }
  // Kitchens, eateries, restaurants, cafes, dishes
  if (/(quán|phở|cơm|bún|bánh|lẩu|buffet|restaurant|kitchen|cafe|café|bistro|eatery|ẩm thực|chay)/i.test(text)) {
    return 'bowl';
  }

  // Consistent distribution based on shop ID or string hash
  const seed = Number(shop?.shopId || shop?.id) || Array.from(name).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const icons = ['bowl', 'leaf', 'pin'];
  return icons[Math.abs(seed) % icons.length];
}

export function createStoreMarkerElement(shop, isSelected = false) {
  const markerElement = document.createElement('button');
  markerElement.type = 'button';
  markerElement.className = 'group flex cursor-pointer appearance-none items-center justify-center border-0 bg-transparent p-0';
  markerElement.setAttribute('aria-label', shop.name || 'Vegan Store');
  markerElement.setAttribute('aria-pressed', String(isSelected));
  markerElement.title = shop.name || 'Vegan Store';

  const iconType = resolveStoreIcon(shop);
  const iconPath = STORE_ICON_PATHS[iconType] || STORE_ICON_PATHS.pin;

  const markerVisual = document.createElement('span');
  markerVisual.dataset.storeMarkerVisual = 'true';
  markerVisual.dataset.storeMarkerIcon = iconType;
  markerVisual.className = [
    'relative flex items-center justify-center',
    'rounded-[50%_50%_50%_4px] -rotate-45',
    'transition-[width,height,background-color,border-color,color,box-shadow,transform] duration-150',
    'group-hover:scale-125 group-hover:shadow-lg group-active:scale-95',
    isSelected
      ? 'store-marker-pin-selected w-10 h-10 scale-110 bg-[#2F5233] border-2 border-[#2F5233] text-white shadow-lg ring-4 ring-[#2F5233]/25 z-10'
      : 'w-9 h-9 bg-[#FAFBF9] border-2 border-[#2F5233] text-[#2F5233] shadow-md hover:bg-[#F3F6EE]'
  ].join(' ');

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.8');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', 'w-5 h-5 rotate-45 pointer-events-none transition-transform');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', iconPath);
  svg.appendChild(path);

  markerVisual.appendChild(svg);
  markerElement.appendChild(markerVisual);
  return markerElement;
}

export function setStoreMarkerHighlighted(markerElement, isHighlighted) {
  const markerVisual = markerElement?.querySelector(STORE_MARKER_VISUAL_SELECTOR);
  markerVisual?.classList.toggle('scale-125', isHighlighted);
}
