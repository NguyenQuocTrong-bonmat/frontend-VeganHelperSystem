import React, { useState, useEffect, useRef, useCallback } from 'react';
import goongjs from '@goongmaps/goong-js';
import '@goongmaps/goong-js/dist/goong-js.css';
import HeaderMember from '../../components/layout/HeaderMember';
import AIChatbot from '../../components/chat/AIChatbot';
import shopService from '../../services/shopService';
import { createStoreMarkerElement, setStoreMarkerHighlighted, resolveStoreIcon, STORE_ICON_PATHS, STORE_MARKER_VISUAL_SELECTOR } from '../../utils/storeMapMarker';

function FindVeganStores() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationStatus, setLocationStatus] = useState('prompt');
  const [coordinates, setCoordinates] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  // Data states
  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Map interactions
  const [showSearchThisArea, setShowSearchThisArea] = useState(false);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const userMarkerRef = useRef(null);
  const hoverPopupRef = useRef(null);
  const hoveredShopIdRef = useRef(null);
  const searchTimeout = useRef(null);

  const loadShops = async (lat, lng) => {
    setIsLoading(true);
    setErrorMsg(null);
    setShowSearchThisArea(false);
    try {
      const res = await shopService.getNearbyShops(lat, lng, 10, 1, 50);
      setShops(res.items || res || []);
    } catch (err) {
      setErrorMsg("Failed to load nearby stores.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationStatus('granted');
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          loadShops(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setLocationStatus('denied');
          // Fallback to center of HCMC
          setCoordinates({ lat: 10.7769, lng: 106.7009 });
          loadShops(10.7769, 106.7009);
        }
      );
    } else {
      setLocationStatus('error');
      setCoordinates({ lat: 10.7769, lng: 106.7009 });
      loadShops(10.7769, 106.7009);
    }
  }, []);

  // Map Initialization
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const mapKey = import.meta.env.VITE_GOONG_MAPTILES_KEY || '';
    if (!mapKey) return;

    goongjs.accessToken = mapKey;
    mapRef.current = new goongjs.Map({
      container: mapContainerRef.current,
      style: 'https://tiles.goong.io/assets/goong_map_web.json',
      center: [106.7009, 10.7769], // Fallback HCMC
      zoom: 13
    });

    mapRef.current.addControl(new goongjs.NavigationControl(), 'top-right');

    mapRef.current.on('dragend', () => setShowSearchThisArea(true));
    mapRef.current.on('zoomend', () => setShowSearchThisArea(true));
    mapRef.current.on('movestart', () => {
      if (hoverPopupRef.current) {
        hoverPopupRef.current.remove();
        hoveredShopIdRef.current = null;
      }
    });

    return () => {
      if (hoverPopupRef.current) {
        hoverPopupRef.current.remove();
        hoverPopupRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Fetch address when coordinates are updated via My Location
  useEffect(() => {
    if (coordinates && locationStatus === 'granted') {
      const fetchAddress = async () => {
        try {
          // Try Goong API first
          const mapKey = import.meta.env.VITE_GOONG_MAPTILES_KEY || '';
          if (mapKey) {
            const goongRes = await fetch(`https://rsapi.goong.io/Geocode?latlng=${coordinates.lat},${coordinates.lng}&api_key=${mapKey}`);
            const goongData = await goongRes.json();
            if (goongData && goongData.results && goongData.results.length > 0) {
              setUserAddress(goongData.results[0].formatted_address);
              return;
            }
          }
          
          // Fallback to Nominatim if Goong fails
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coordinates.lat}&lon=${coordinates.lng}&format=json&accept-language=vi`, {
            headers: { 'User-Agent': 'VeganHelperApp/1.0' }
          });
          const data = await res.json();
          if (data && data.display_name) {
            setUserAddress(data.display_name);
          } else {
            setUserAddress(`${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`);
          }
        } catch (err) {
          console.error("Geocoding failed:", err);
          setUserAddress(`${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`);
        }
      };
      fetchAddress();
    }
  }, [coordinates, locationStatus]);

  // Sync initial user coordinates to map & draw blue dot
  useEffect(() => {
    if (!mapRef.current || !coordinates) return;

    if (!userMarkerRef.current) {
      const el = document.createElement('div');
      el.className = 'w-4 h-4 bg-[#3B82F6] rounded-full border-[3px] border-white shadow-[0_0_0_2px_rgba(59,130,246,0.3)] z-20';
      userMarkerRef.current = new goongjs.Marker({ element: el })
        .setLngLat([coordinates.lng, coordinates.lat])
        .addTo(mapRef.current);

      mapRef.current.setCenter([coordinates.lng, coordinates.lat]);
    } else {
      userMarkerRef.current.setLngLat([coordinates.lng, coordinates.lat]);
    }
  }, [coordinates]);

  // Handle Search Debounce
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!searchTerm.trim()) return;

    searchTimeout.current = setTimeout(async () => {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const cLat = coordinates?.lat || 10.7769;
        const cLng = coordinates?.lng || 106.7009;
        const res = await shopService.searchShops(searchTerm, cLat, cLng, 1, 50);
        setShops(res.items || res || []);
      } catch (err) {
        setErrorMsg("Failed to search stores.");
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(searchTimeout.current);
  }, [searchTerm, coordinates]);

  const handleSearchThisArea = () => {
    if (!mapRef.current) return;
    const center = mapRef.current.getCenter();
    loadShops(center.lat, center.lng);
  };

  const handleGetMyLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        setLocationStatus('granted');
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoordinates({ lat, lng });

        if (mapRef.current) {
          mapRef.current.flyTo({ center: [lng, lat], zoom: 15, essential: true });
        }

        loadShops(lat, lng);
      },
      (error) => {
        setIsLocating(false);
        setLocationStatus('denied');
        let errMsg = "Unable to retrieve your location.";
        if (error.code === error.PERMISSION_DENIED) errMsg = "Location permission denied.";
        if (error.code === error.TIMEOUT) errMsg = "Location request timed out.";
        setLocationError(errMsg);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  const showShopTooltip = useCallback((shop) => {
    if (!mapRef.current || !shop.latitude || !shop.longitude) return;

    if (!hoverPopupRef.current) {
      hoverPopupRef.current = new goongjs.Popup({
        offset: 14,
        closeButton: false,
        closeOnClick: false,
        className: 'store-map-hover-popup'
      });
    }

    hoveredShopIdRef.current = shop.shopId;

    const content = document.createElement('div');
    content.className = 'px-1 py-0.5 text-left font-dm-sans min-w-[120px] max-w-[240px]';

    const nameEl = document.createElement('div');
    nameEl.className = 'font-bold text-[13px] text-[#2F5233] leading-snug break-words';
    nameEl.textContent = shop.name;
    content.appendChild(nameEl);

    if (shop.address) {
      const addrEl = document.createElement('div');
      addrEl.className = 'text-[11px] text-[#6B6F63] mt-0.5 line-clamp-2 leading-tight';
      addrEl.textContent = shop.address;
      content.appendChild(addrEl);
    }

    if (shop.distanceKm !== undefined && shop.distanceKm !== null) {
      const distEl = document.createElement('div');
      distEl.className = 'text-[10px] font-semibold text-[#4C8C4A] mt-1';
      distEl.textContent = `${Number(shop.distanceKm).toFixed(1)} km away`;
      content.appendChild(distEl);
    }

    hoverPopupRef.current
      .setLngLat([shop.longitude, shop.latitude])
      .setDOMContent(content)
      .addTo(mapRef.current);
  }, []);

  const hideShopTooltip = useCallback((shopId) => {
    if (shopId && hoveredShopIdRef.current !== shopId) return;
    hoveredShopIdRef.current = null;
    if (hoverPopupRef.current) {
      hoverPopupRef.current.remove();
    }
  }, []);

  // Sync shops to map markers
  useEffect(() => {
    if (!mapRef.current) return;

    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    shops.forEach(shop => {
      if (!shop.latitude || !shop.longitude) return;

      const isSelected = selectedShopId === shop.shopId;
      const el = createStoreMarkerElement(shop, isSelected);

      if (isSelected) el.style.zIndex = '10';

      const marker = new goongjs.Marker({ element: el })
        .setLngLat([shop.longitude, shop.latitude])
        .addTo(mapRef.current);

      el.addEventListener('mouseenter', () => {
        el.style.zIndex = '999';
        setStoreMarkerHighlighted(el, true);
        showShopTooltip(shop);
      });

      el.addEventListener('mouseleave', () => {
        el.style.zIndex = isSelected ? '10' : '';
        setStoreMarkerHighlighted(el, false);
        hideShopTooltip(shop.shopId);
      });

      marker.getElement().addEventListener('click', () => {
        const visual = el.querySelector(STORE_MARKER_VISUAL_SELECTOR);
        if (visual) {
          visual.classList.remove('store-marker-pin-selected');
          void visual.offsetWidth;
          visual.classList.add('store-marker-pin-selected');
        }
        setSelectedShopId(shop.shopId);
        setIsPanelExpanded(true);
      });

      markersRef.current[shop.shopId] = marker;
    });

  }, [shops, selectedShopId, showShopTooltip, hideShopTooltip]);

  const handleSelectShop = (shop) => {
    setSelectedShopId(shop.shopId);
    const marker = markersRef.current[shop.shopId];
    if (marker) {
      const visual = marker.getElement().querySelector(STORE_MARKER_VISUAL_SELECTOR);
      if (visual) {
        visual.classList.remove('store-marker-pin-selected');
        void visual.offsetWidth;
        visual.classList.add('store-marker-pin-selected');
      }
    }
    if (mapRef.current && shop.latitude && shop.longitude) {
      mapRef.current.flyTo({ center: [shop.longitude, shop.latitude], zoom: 15, essential: true });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#FDFBF6] overflow-hidden">
      <HeaderMember />

      <main className="flex-grow relative w-full h-full">
        {/* Map Container */}
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

        {!import.meta.env.VITE_GOONG_MAPTILES_KEY && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-0 bg-[#E9EFE6]">
            <svg className="w-12 h-12 text-[#A63446] mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <h3 className="text-xl font-semibold text-[#2B2A25]">Map Configuration Missing</h3>
            <p className="text-[#6B6F63] text-sm mt-2 max-w-md">Please configure VITE_GOONG_MAPTILES_KEY.</p>
          </div>
        )}

        {/* My Location Floating Button */}
        <div className="absolute bottom-[200px] right-4 md:top-24 md:bottom-auto z-10 flex flex-col gap-2 items-end">
          {locationError && (
            <div className="bg-[#FFF5F5] border border-[#FFE0E0] px-3 py-2 rounded-lg text-xs text-[#A63446] shadow-sm mb-2 mr-2 animate-fade-in">
              {locationError}
            </div>
          )}
          <button
            onClick={handleGetMyLocation}
            disabled={isLocating}
            className="w-10 h-10 bg-white rounded-lg shadow-md border border-[#DCE3D5] flex items-center justify-center text-[#2F5233] hover:bg-[#F3F6EE] transition-colors focus:outline-none"
            title="My Location"
          >
            {isLocating ? (
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="3" strokeOpacity="0.2"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            )}
          </button>
        </div>

        {/* Search This Area Button */}
        {showSearchThisArea && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 hidden md:block">
            <button
              onClick={handleSearchThisArea}
              className="px-4 py-2 bg-white rounded-full shadow-md text-sm font-medium text-[#2F5233] hover:bg-[#FDFBF6] border border-[#DCE3D5] transition-all"
            >
              Search this area
            </button>
          </div>
        )}

        {/* Floating Panel */}
        <div className={`absolute z-10 transition-all duration-300 ease-in-out flex flex-col bg-white
          md:top-6 md:left-6 md:bottom-6 md:w-[400px] md:rounded-2xl md:shadow-xl md:border md:border-[#DCE3D5]
          bottom-0 left-0 right-0 w-full rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)]
          ${isPanelExpanded ? 'h-[85vh] md:h-auto' : 'h-[140px] md:h-auto'}
        `}>
          {/* Header */}
          <div className="p-5 border-b border-[#DCE3D5] flex flex-col gap-4 bg-white md:rounded-t-2xl rounded-t-3xl cursor-pointer md:cursor-auto shrink-0"
            onClick={() => setIsPanelExpanded(!isPanelExpanded)}>
            <div className="w-12 h-1.5 bg-[#E9EFE6] rounded-full mx-auto mb-1 md:hidden" />

            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-fraunces text-2xl font-semibold text-[#2F5233]">Vegan Stores</h1>
                {locationStatus === 'granted' && coordinates && (
                  <div className="flex items-start gap-1.5 mt-1.5 text-[13px] text-[#6B6F63]">
                    <svg className="w-4 h-4 mt-[3px] text-[#3B82F6] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    <span className="line-clamp-2 leading-tight pr-4">{userAddress || "Đang xác định vị trí..."}</span>
                  </div>
                )}
              </div>
              <button className="md:hidden text-[#6B6F63] shrink-0" onClick={(e) => { e.stopPropagation(); setIsPanelExpanded(!isPanelExpanded); }}>
                <svg className={`w-6 h-6 transition-transform ${isPanelExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
              </button>
            </div>

            <div className="relative w-full" onClick={e => e.stopPropagation()}>
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#6B6F63]">
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="4" strokeOpacity="0.25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                )}
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (!e.target.value) {
                    loadShops(coordinates?.lat || 10.7769, coordinates?.lng || 106.7009);
                  }
                }}
                placeholder="Search by store name..."
                className="w-full pl-11 pr-4 py-3 bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl text-[14px] text-[#2B2A25] placeholder:text-[#6B6F63] focus:outline-none focus:ring-2 focus:ring-[#2F5233]"
              />
            </div>

            {showSearchThisArea && (
              <button onClick={(e) => { e.stopPropagation(); handleSearchThisArea(); }} className="w-full md:hidden py-2 bg-[#FDFBF6] rounded-xl shadow-sm text-sm font-medium text-[#2F5233] border border-[#DCE3D5]">
                Search this area
              </button>
            )}
          </div>

          {/* List */}
          <div className={`flex-1 overflow-y-auto p-5 bg-[#FDFBF6] md:rounded-b-2xl flex flex-col gap-4 ${!isPanelExpanded ? 'hidden md:flex' : 'flex'}`}>
            {errorMsg && (
              <div className="bg-[#FFF5F5] border border-[#FFE0E0] p-4 rounded-xl flex items-start gap-3 shadow-sm">
                <svg className="w-5 h-5 shrink-0 text-[#A63446] mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <span className="text-[#A63446] text-sm">{errorMsg}</span>
              </div>
            )}

            {!isLoading && shops.length === 0 && !errorMsg && (
              <div className="flex-1 bg-white border border-[#DCE3D5] rounded-xl flex flex-col items-center justify-center p-6 text-center min-h-[250px] shadow-sm">
                <div className="w-14 h-14 bg-[#F3F6EE] rounded-full flex items-center justify-center mb-4 text-[#2F5233]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"></path></svg>
                </div>
                <h3 className="font-fraunces text-lg font-semibold text-[#2B2A25] mb-1">No Stores Found</h3>
                <p className="text-[#6B6F63] text-xs leading-relaxed">Try searching somewhere else or zooming out.</p>
              </div>
            )}

            {shops.map(shop => {
              const isSelected = selectedShopId === shop.shopId;
              
              // Build Google Maps URLs
              let mapsSearchUrl = '';
              let mapsDirUrl = '';
              
              if (shop.name || shop.address) {
                const query = [shop.name, shop.address].filter(Boolean).join(', ');
                mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
              } else if (shop.latitude && shop.longitude) {
                mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${shop.latitude},${shop.longitude}`;
              }

              if (shop.latitude && shop.longitude) {
                mapsDirUrl = `https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`;
              } else if (shop.name || shop.address) {
                const dest = [shop.name, shop.address].filter(Boolean).join(', ');
                mapsDirUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
              }

              if (mapsDirUrl && coordinates?.lat && coordinates?.lng) {
                mapsDirUrl += `&origin=${coordinates.lat},${coordinates.lng}`;
              }

              return (
                <div
                  key={shop.shopId}
                  onClick={() => handleSelectShop(shop)}
                  onMouseEnter={() => {
                    const marker = markersRef.current[shop.shopId];
                    if (marker) {
                      marker.getElement().style.zIndex = '999';
                      setStoreMarkerHighlighted(marker.getElement(), true);
                    }
                    showShopTooltip(shop);
                  }}
                  onMouseLeave={() => {
                    const marker = markersRef.current[shop.shopId];
                    if (marker) {
                      marker.getElement().style.zIndex = selectedShopId === shop.shopId ? '10' : '';
                      setStoreMarkerHighlighted(marker.getElement(), false);
                    }
                    hideShopTooltip(shop.shopId);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer shadow-sm flex flex-col ${isSelected ? 'bg-[#F3F6EE] border-[#2F5233]' : 'bg-white border-[#DCE3D5] hover:border-[#2F5233]'}`}
                >
                  <div className="flex items-center gap-2.5 mb-2 min-w-0">
                    <span className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-[#2F5233] text-white' : 'bg-[#E9EFE6] text-[#2F5233]'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d={STORE_ICON_PATHS[resolveStoreIcon(shop)] || STORE_ICON_PATHS.pin} />
                      </svg>
                    </span>
                    <h3 className="font-semibold text-[#2B2A25] line-clamp-1">{shop.name}</h3>
                  </div>
                  <p className="text-xs text-[#6B6F63] line-clamp-2 mb-2">{shop.address}</p>
                  <div className="flex items-center justify-between mt-auto">
                    {shop.distanceKm !== undefined && (
                      <div className="text-xs font-medium text-[#2F5233]">{Number(shop.distanceKm).toFixed(1)} km away</div>
                    )}
                    
                    {isSelected && (
                      <div className="flex gap-2 ml-auto" onClick={e => e.stopPropagation()}>
                        {mapsDirUrl && (
                          <a 
                            href={mapsDirUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#2F5233] text-white rounded-lg text-xs font-medium hover:bg-[#223d26] transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                            Directions
                          </a>
                        )}
                        {mapsSearchUrl && (
                          <a 
                            href={mapsSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1.5 bg-white text-[#2F5233] border border-[#2F5233] rounded-lg text-xs font-medium hover:bg-[#F3F6EE] transition-colors"
                          >
                            Google Maps
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <AIChatbot />
    </div>
  );
}

export default FindVeganStores;
