import { useEffect, useRef, useState } from 'react';

export function useScrollReveal(options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(currentRef);
      }
    }, options);

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [options.threshold, options.rootMargin]);

  return { ref, isVisible };
}
