import { useState, useEffect, useCallback } from "react";

export function useModal(initialState: boolean = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  // Vi bruger useCallback så funktionerne ikke skifter reference ved hver render
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    // Cleanup funktion: Kører når isOpen ændres, eller komponenten dør
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]);

  return { isOpen, open, close, toggle };
}