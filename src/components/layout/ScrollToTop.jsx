import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    // Allow destination pages with an explicit anchor to handle their own positioning.
    if (hash || navigationType === 'POP') return;
    window.scrollTo(0, 0);
  }, [pathname, hash, navigationType]);

  return null;
}
