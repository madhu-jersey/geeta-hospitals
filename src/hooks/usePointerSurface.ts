import { useEffect, useRef, type RefObject } from 'react';

/** Pointer-following CSS variables with a restrained lerped return-to-rest. */
export function usePointerSurface<T extends HTMLElement>(ref: RefObject<T | null>, maxDegrees = 4) {
  useEffect(() => {
    const node = ref.current;
    if (!node || !window.matchMedia('(pointer:fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    let x = 0; let y = 0; let targetX = 0; let targetY = 0;
    const animate = () => {
      x += (targetX - x) * .12;
      y += (targetY - y) * .12;
      node.style.setProperty('--pointer-x', `${50 + x * 50}%`);
      node.style.setProperty('--pointer-y', `${50 + y * 50}%`);
      node.style.setProperty('--tilt-x', `${-y * maxDegrees}deg`);
      node.style.setProperty('--tilt-y', `${x * maxDegrees}deg`);
      if (Math.abs(targetX - x) > .001 || Math.abs(targetY - y) > .001) frame = requestAnimationFrame(animate);
      else frame = 0;
    };
    const move = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      targetX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - .5) * 2));
      targetY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - .5) * 2));
      if (!frame) frame = requestAnimationFrame(animate);
    };
    const leave = () => { targetX = 0; targetY = 0; if (!frame) frame = requestAnimationFrame(animate); };
    node.addEventListener('pointermove', move);
    node.addEventListener('pointerleave', leave);
    return () => { node.removeEventListener('pointermove', move); node.removeEventListener('pointerleave', leave); cancelAnimationFrame(frame); };
  }, [ref, maxDegrees]);
}
