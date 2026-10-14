import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/layout/Footer';

export default function NotFound() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const heading = useRef(null);
  const home = isAuthenticated ? '/home' : '/';

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Page not found | Vegan Helper';
    heading.current?.focus();
    return () => { document.title = previousTitle; };
  }, []);

  const goBack = () => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate(home, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-vh-cream font-dm-sans text-vh-text-primary">
      <header className="border-b border-vh-border px-6 py-4 sm:px-10">
        <Link to={home} className="inline-flex rounded-control-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:ring-offset-4" aria-label="Vegan Helper home">
          <img src="/logo.png" alt="Vegan Helper" className="h-12 w-auto" />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12 sm:py-16">
        <section className="w-full max-w-2xl text-center" aria-labelledby="not-found-heading">
          <div aria-hidden="true" className="relative mx-auto mb-8 w-fit">
            <span className="block font-dm-serif text-[8rem] leading-none tracking-tight text-vh-forest sm:text-[11rem]">404</span>
            <svg className="absolute -right-4 -top-4 h-14 w-14 text-vh-forest sm:-right-8 sm:h-20 sm:w-20" viewBox="0 0 64 64" fill="none">
              <path d="M16 49C20 33 32 24 48 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M28 37C15 36 13 23 15 14C29 14 38 23 28 37Z" fill="currentColor" fillOpacity=".15" stroke="currentColor" strokeWidth="2" />
              <path d="M34 28C34 12 46 7 57 7C58 22 48 32 34 28Z" fill="currentColor" fillOpacity=".25" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <p className="mb-3 text-sm font-medium tracking-wide text-vh-text-secondary">A little lost in the garden?</p>
          <h1 ref={heading} tabIndex={-1} id="not-found-heading" className="font-dm-serif text-4xl sm:text-5xl focus:outline-none">Page not found</h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-vh-text-secondary">
            We couldn’t find the page you’re looking for. Check the address, or head back home to explore more plant-based inspiration.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link to={home} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control bg-vh-forest px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-moss-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:ring-offset-2">
              <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="m3 10 9-7 9 7M5 9v11h5v-6h4v6h5V9" /></svg>
              Back to home
            </Link>
            <button type="button" onClick={goBack} className="inline-flex min-h-12 items-center justify-center rounded-control border border-vh-border px-6 py-3 text-sm font-semibold text-vh-forest transition-colors hover:bg-vh-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest focus-visible:ring-offset-2">
              Go back
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
