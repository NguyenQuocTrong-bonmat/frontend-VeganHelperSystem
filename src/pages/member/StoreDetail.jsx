import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import HeaderMember from '../../components/layout/HeaderMember';
import Footer from '../../components/layout/Footer';
import AIChatbot from '../../components/chat/AIChatbot';
import shopService from '../../services/shopService';
import { getImageUrl } from '../../utils/imageUtils';
import { isNotFoundError } from '../../utils/errorUtils';
import ImageLightbox from '../../components/ui/ImageLightbox';

export default function StoreDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadShop() {
      setLoading(true); setError(''); setShop(null);
      try {
        const data = await shopService.getShopDetail(id);
        if (!cancelled) setShop(data);
      } catch (err) {
        if (cancelled) return;
        if (isNotFoundError(err)) {
          navigate('/404', { replace: true });
          return;
        }
        setError('We couldn’t load this store. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadShop();
    return () => { cancelled = true; };
  }, [id, navigate, retry]);

  return (
    <div className="min-h-screen flex flex-col bg-vh-cream font-dm-sans">
      <HeaderMember />
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-10">
        <Link to="/vegan-stores" className="inline-flex items-center gap-2 text-sm font-medium text-vh-forest mb-8 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest rounded px-1 active:opacity-80">
          <span aria-hidden="true">←</span> Back to Stores
        </Link>
        {loading ? (
          <p role="status" className="py-12 text-center text-vh-text-secondary">Loading store details...</p>
        ) : error ? (
          <div role="alert" className="rounded-card border border-vh-border bg-vh-surface p-8 text-center">
            <p className="text-vh-text-primary">{error}</p>
            <button type="button" onClick={() => setRetry(value => value + 1)} className="mt-5 rounded-control bg-vh-forest px-6 py-3 text-sm font-semibold text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:ring-offset-2 active:scale-95 motion-reduce:transform-none cursor-pointer">Try again</button>
          </div>
        ) : shop ? (
          <article className="space-y-6">
            {shop.mediaUrls?.[0] && (
              <div
                className="cursor-zoom-in group relative overflow-hidden rounded-card max-h-96 focus:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:ring-offset-2 active:scale-[0.99] motion-reduce:transform-none"
                onClick={() => setIsLightboxOpen(true)}
                role="button"
                tabIndex={0}
                aria-label="Enlarge store image"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsLightboxOpen(true);
                  }
                }}
              >
                <img
                  src={getImageUrl(shop.mediaUrls[0])}
                  alt={shop.name}
                  className="w-full max-h-96 object-cover rounded-card transition-transform duration-200 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                />
                <div className="absolute bottom-3 right-3 px-2.5 py-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs text-xs flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                  <span>Enlarge</span>
                </div>
              </div>
            )}
            <div>
              <h1 className="font-dm-serif text-3xl sm:text-4xl text-vh-text-primary">{shop.name}</h1>
              <p className="mt-3 text-vh-text-secondary">{shop.address}</p>
            </div>
            {shop.description && <p className="whitespace-pre-wrap leading-relaxed text-vh-text-secondary">{shop.description}</p>}
            {(shop.openingHours || shop.contactPhone) && (
              <dl className="space-y-3 border-t border-vh-border pt-6 text-sm text-vh-text-primary">
                {shop.openingHours && <div><dt className="font-semibold">Opening hours</dt><dd className="mt-1 text-vh-text-secondary">{shop.openingHours}</dd></div>}
                {shop.contactPhone && <div><dt className="font-semibold">Phone</dt><dd className="mt-1 text-vh-text-secondary">{shop.contactPhone}</dd></div>}
              </dl>
            )}
          </article>
        ) : null}
      </main>
      <ImageLightbox
        isOpen={isLightboxOpen}
        src={shop?.mediaUrls?.[0] ? getImageUrl(shop.mediaUrls[0]) : null}
        alt={shop?.name || 'Store photo'}
        onClose={() => setIsLightboxOpen(false)}
      />
      <AIChatbot />
      <Footer />
    </div>
  );
}
