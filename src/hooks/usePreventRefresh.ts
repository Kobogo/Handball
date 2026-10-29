import { useEffect } from 'react';

export function usePreventRefresh() {
  useEffect(() => {
    let lastTouchY = 0;
    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchY - lastTouchY;
      lastTouchY = touchY;

      if (window.scrollY === 0 && deltaY > 0) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => document.removeEventListener('touchmove', handleTouchMove);
  }, []);
}