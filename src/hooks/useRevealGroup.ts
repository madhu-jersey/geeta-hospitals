import { useEffect, useRef } from 'react';

/**
 * One observer owns the reveal targets in a section. Every target is unobserved
 * as soon as it reaches the viewport so long pages do not keep doing work.
 */
export function useRevealGroup<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const root = ref.current;
    if (!enabled || !root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const targets = root.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!targets.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [enabled]);
  return ref;
}
